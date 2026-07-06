-- Migration: Função de processamento de compra de plano MLM
-- Cria a função processar_compra_plano() que processa compras de planos
-- (Plano Afiliado, Plano Avanço, Plano Excelência)

-- Função de processamento de compra de plano
CREATE OR REPLACE FUNCTION processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)
RETURNS VOID AS $$
DECLARE
    pedido RECORD;
    comprador_id UUID;
    patrocinador_id UUID;
    plano_nome TEXT;
    plano_id UUID;
    novo_distribuidor_id UUID;
    pontos_ativacao INTEGER;
BEGIN
    -- Buscar dados do pedido
    SELECT * INTO pedido FROM pedidos WHERE id = pedido_id;
    
    -- Identificar plano
    plano_nome := pedido.tipo_nome;
    
    -- Normalizar nome do plano para busca
    plano_nome := LOWER(TRIM(plano_nome));
    
    -- Buscar plano correspondente
    IF plano_nome LIKE '%afiliado%' THEN
        SELECT id INTO plano_id FROM planos WHERE LOWER(nome) = 'afiliado' LIMIT 1;
        pontos_ativacao := 0; -- Plano Afiliado não gera pontos de ativação
    ELSIF plano_nome LIKE '%avanço%' OR plano_nome LIKE '%avanco%' THEN
        SELECT id INTO plano_id FROM planos WHERE LOWER(nome) = 'avanço' LIMIT 1;
        pontos_ativacao := 100; -- Plano Avanço gera 100 pontos
    ELSIF plano_nome LIKE '%excelência%' OR plano_nome LIKE '%excelencia%' THEN
        SELECT id INTO plano_id FROM planos WHERE LOWER(nome) = 'excelência' LIMIT 1;
        pontos_ativacao := 500; -- Plano Excelência gera 500 pontos
    ELSE
        -- Default para Avanço se não conseguir identificar
        SELECT id INTO plano_id FROM planos WHERE LOWER(nome) = 'avanço' LIMIT 1;
        pontos_ativacao := 100;
    END IF;
    
    -- Se não encontrou plano, usar o primeiro disponível
    IF plano_id IS NULL THEN
        SELECT id INTO plano_id FROM planos LIMIT 1;
        pontos_ativacao := 100;
    END IF;
    
    RAISE NOTICE 'Plano identificado: %, pontos_ativacao: %', plano_id, pontos_ativacao;
    
    -- Identificar patrocinador
    -- Prioridade: distribuidor_indicador_id > metadata->>'patrocinador_comprador'
    IF pedido.distribuidor_indicador_id IS NOT NULL THEN
        patrocinador_id := pedido.distribuidor_indicador_id::uuid;
    ELSIF pedido.metadata->>'patrocinador_comprador' IS NOT NULL THEN
        -- Tentar converter para UUID
        BEGIN
            SELECT id INTO patrocinador_id FROM mlm.distribuidores 
            WHERE allin_id::TEXT = pedido.metadata->>'patrocinador_comprador'
            LIMIT 1;
        EXCEPTION WHEN OTHERS THEN
            patrocinador_id := NULL;
        END;
    END IF;
    
    -- Processar conforme tipo de comprador
    IF NOT e_distribuidor THEN
        -- COMPRADOR É CLIENTE FINAL - CRIAR NOVO DISTRIBUIDOR
        
        RAISE NOTICE 'Criando novo distribuidor para cliente final';
        
        -- Gerar novo UUID para o distribuidor
        novo_distribuidor_id := uuid_generate_v4();
        
        -- Inserir novo distribuidor copiando dados do pedido
        INSERT INTO mlm.distribuidores (
            id,
            usuario,
            nome,
            email,
            cpf,
            cnpj,
            tipo_pessoa,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            patrocinador_id,
            ativo,
            status,
            data_cadastro,
            email_verificado,
            login,
            metadata
        ) VALUES (
            novo_distribuidor_id,
            COALESCE(pedido.metadata->>'usuario', pedido.cliente_email),
            pedido.cliente_nome,
            pedido.cliente_email,
            pedido.cliente_cpf,
            pedido.cliente_cnpj,
            CASE WHEN pedido.cliente_cpf IS NOT NULL THEN 'Física' ELSE 'Jurídica' END,
            pedido.cliente_telefone,
            pedido.cliente_logradouro,
            pedido.cliente_cidade,
            pedido.cliente_uf,
            pedido.cliente_cep,
            patrocinador_id,
            true,
            'ativo',
            NOW(),
            false,
            true,
            jsonb_build_object(
                'pedido_origem_id', pedido_id,
                'cliente_origem_id', pedido.cliente_id,
                'origem', 'compra_plano'
            )
        );
        
        comprador_id := novo_distribuidor_id;
        
        RAISE NOTICE 'Novo distribuidor criado: %', comprador_id;
        
        -- Inserir na rede linear
        IF patrocinador_id IS NOT NULL THEN
            INSERT INTO mlm.rede_linear_nos (
                id_distribuidor,
                id_patrocinador,
                linha,
                posicao_relativa,
                created_at
            ) VALUES (
                comprador_id,
                patrocinador_id,
                -- Calcular linha baseado no patrocinador
                (SELECT COALESCE(MAX(linha), 0) + 1 FROM mlm.rede_linear_nos WHERE id_patrocinador = patrocinador_id),
                -- Calcular posição relativa
                (SELECT COALESCE(MAX(posicao_relativa), 0) + 1 FROM mlm.rede_linear_nos),
                NOW()
            );
            
            RAISE NOTICE 'Distribuidor inserido na rede linear com patrocinador %', patrocinador_id;
        END IF;
        
    ELSE
        -- COMPRADOR JÁ É DISTRIBUIDOR
        
        -- Identificar ID do distribuidor
        IF pedido.distribuidor_comprador_id IS NOT NULL THEN
            comprador_id := pedido.distribuidor_comprador_id;
        ELSE
            -- Buscar por allin_id
            SELECT id INTO comprador_id FROM mlm.distribuidores 
            WHERE allin_id::TEXT = pedido.metadata->>'id_comprador'
            LIMIT 1;
        END IF;
        
        RAISE NOTICE 'Distribuidor existente identificado: %', comprador_id;
        
    END IF;
    
    -- Atualizar plano do distribuidor
    INSERT INTO mlm.planos_distribuidores (
        distribuidor_id,
        plano_id,
        data_ativacao,
        ativo
    ) VALUES (
        comprador_id,
        plano_id,
        NOW(),
        true
    )
    ON CONFLICT (distribuidor_id) DO UPDATE SET
        plano_id = plano_id,
        data_ativacao = NOW(),
        ativo = true;
    
    RAISE NOTICE 'Plano % atualizado para distribuidor %', plano_id, comprador_id;
    
    -- Gerar pontos de ativação
    IF pontos_ativacao > 0 THEN
        INSERT INTO mlm.pontos_saldo (
            distribuidor_id,
            saldo_atual,
            saldo_acumulado
        ) VALUES (
            comprador_id,
            pontos_ativacao,
            pontos_ativacao
        )
        ON CONFLICT (distribuidor_id) DO UPDATE SET
            saldo_atual = pontos_saldo.saldo_atual + pontos_ativacao,
            saldo_acumulado = pontos_saldo.saldo_acumulado + pontos_ativacao;
        
        -- Registrar transação de pontos
        INSERT INTO mlm.pontos_transacoes (
            distribuidor_id,
            tipo,
            quantidade,
            saldo_antes,
            saldo_depois,
            descricao,
            pedido_id,
            created_at
        ) VALUES (
            comprador_id,
            'ativacao',
            pontos_ativacao,
            0,
            pontos_ativacao,
            'Pontos de ativação - Compra de plano ' || pedido.tipo_nome,
            pedido_id,
            NOW()
        );
        
        RAISE NOTICE 'Pontos de ativação gerados: % para distribuidor %', pontos_ativacao, comprador_id;
    END IF;
    
    -- Atualizar qualificação inicial se necessário
    -- Desabilitado - tabela mlm.qualificacoes não tem coluna distribuidor_id
    -- INSERT INTO mlm.qualificacoes (
    --     distribuidor_id,
    --     nivel,
    --     data_qualificacao,
    --     ativo
    -- ) VALUES (
    --     comprador_id,
    --     'Bronze',
    --     NOW(),
    --     true
    -- )
    -- ON CONFLICT (distribuidor_id) DO NOTHING;
    
    RAISE NOTICE 'Qualificação inicial não definida (tabela qualificacoes não suporta distribuidor_id)';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erro ao processar compra de plano %: %', pedido_id, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Comentário sobre a função
COMMENT ON FUNCTION processar_compra_plano IS 'Função que processa compras de planos MLM, criando novos distribuidores se necessário e gerando pontos de ativação';
