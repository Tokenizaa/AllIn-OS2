-- Migration: Função de processamento de compra de produto MLM
-- Cria a função processar_compra_produto() que processa compras de produtos
-- e gera comissões, bônus e pontos conforme as regras configuradas

-- Função de processamento de compra de produto
CREATE OR REPLACE FUNCTION processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)
RETURNS VOID AS $$
DECLARE
    pedido RECORD;
    comprador_id UUID;
    patrocinador_id UUID;
    valor NUMERIC;
    plano TEXT;
    plano_normalizado TEXT;
    regra RECORD;
    pontos_produto INTEGER;
BEGIN
    -- Buscar dados do pedido
    SELECT * INTO pedido FROM pedidos WHERE id = pedido_id;
    
    valor := COALESCE(pedido.valor_total, 0);
    
    -- Se valor for 0, não processar
    IF valor = 0 THEN
        RAISE NOTICE 'Pedido % com valor 0, ignorando', pedido_id;
        RETURN;
    END IF;
    
    -- Identificar comprador
    IF e_distribuidor THEN
        -- Comprador é distribuidor
        IF pedido.distribuidor_comprador_id IS NOT NULL THEN
            comprador_id := pedido.distribuidor_comprador_id;
        ELSE
            -- Buscar por allin_id
            SELECT id INTO comprador_id FROM mlm.distribuidores 
            WHERE allin_id::TEXT = pedido.metadata->>'id_comprador'
            LIMIT 1;
        END IF;
    ELSE
        -- Comprador é cliente final - buscar patrocinador
        IF pedido.distribuidor_indicador_id IS NOT NULL THEN
            patrocinador_id := pedido.distribuidor_indicador_id;
        ELSIF pedido.metadata->>'patrocinador_comprador' IS NOT NULL THEN
            BEGIN
                SELECT id INTO patrocinador_id FROM mlm.distribuidores 
                WHERE allin_id::TEXT = pedido.metadata->>'patrocinador_comprador'
                LIMIT 1;
            EXCEPTION WHEN OTHERS THEN
                patrocinador_id := NULL;
            END;
        END IF;
        
        -- Se cliente final não tem patrocinador, não gerar comissões
        IF patrocinador_id IS NULL THEN
            RAISE NOTICE 'Cliente final sem patrocinador, não gerando comissões';
            RETURN;
        END IF;
    END IF;
    
    -- Identificar plano do comprador
    plano := COALESCE(pedido.metadata->>'plano_comprador', '');
    plano_normalizado := LOWER(TRIM(plano));
    
    -- Se não conseguiu identificar plano, buscar na tabela planos_distribuidores
    IF plano_normalizado = '' AND comprador_id IS NOT NULL THEN
        SELECT LOWER(p.nome) INTO plano_normalizado
        FROM mlm.planos_distribuidores pd
        JOIN planos p ON pd.plano_id = p.id
        WHERE pd.distribuidor_id = comprador_id AND pd.status = 'ativo'
        LIMIT 1;
    END IF;
    
    -- Default para Avanço se não conseguir identificar
    IF plano_normalizado = '' THEN
        plano_normalizado := 'avanco';
    END IF;
    
    RAISE NOTICE 'Processando pedido %: valor=%, plano=%, comprador=%, patrocinador=%', 
        pedido_id, valor, plano_normalizado, comprador_id, patrocinador_id;
    
    -- Calcular pontos do produto (1 ponto para cada R$ 10)
    pontos_produto := FLOOR(valor / 10);
    
    -- ===========================
    -- GERAR COMISSÃO DIRETA
    -- ===========================
    IF comprador_id IS NOT NULL THEN
        SELECT * INTO regra FROM mlm.bonus_regras 
        WHERE tipo = 'direto' 
          AND configuracoes->>'plano' = plano_normalizado
          AND is_active = true
        LIMIT 1;
        
        IF regra.id IS NOT NULL THEN
            INSERT INTO mlm.comissoes (
                pedido_id, tipo, geracao, valor_base, porcentagem, 
                valor_comissao, status, data_calculo, distribuidor_id, descricao
            ) VALUES (
                pedido_id, regra.tipo, regra.geracao, valor, regra.porcentagem,
                ROUND(valor * (regra.porcentagem / 100), 2), 'pendente', NOW(), 
                comprador_id, regra.nome
            );
            
            RAISE NOTICE 'Comissão direta gerada: % para distribuidor %', 
                ROUND(valor * (regra.porcentagem / 100), 2), comprador_id;
        END IF;
    END IF;
    
    -- ===========================
    -- GERAR BÔNUS PARA PATROCINADOR
    -- ===========================
    IF patrocinador_id IS NOT NULL THEN
        -- Bônus de patrocinador (apenas para plano Afiliado)
        SELECT * INTO regra FROM mlm.bonus_regras 
        WHERE tipo = 'patrocinador' 
          AND configuracoes->>'plano' = plano_normalizado
          AND is_active = true
        LIMIT 1;
        
        IF regra.id IS NOT NULL THEN
            INSERT INTO mlm.comissoes (
                pedido_id, tipo, geracao, valor_base, porcentagem, 
                valor_comissao, status, data_calculo, distribuidor_id, descricao,
                referencia_id, referencia_tipo
            ) VALUES (
                pedido_id, regra.tipo, regra.geracao, valor, regra.porcentagem,
                ROUND(valor * (regra.porcentagem / 100), 2), 'pendente', NOW(), 
                patrocinador_id, regra.nome,
                comprador_id, 'distribuidor'
            );
            
            RAISE NOTICE 'Bônus patrocinador gerado: % para patrocinador %', 
                ROUND(valor * (regra.porcentagem / 100), 2), patrocinador_id;
        END IF;
        
        -- ===========================
        -- GERAR COMISSÕES DE GERAÇÃO (Avanço/Excelência)
        -- ===========================
        IF plano_normalizado IN ('avanco', 'excelencia') THEN
            DECLARE
                upline_atual UUID;
                geracao_atual INTEGER;
            BEGIN
                upline_atual := patrocinador_id;
                geracao_atual := 0;
                
                -- Buscar até 3 gerações
                WHILE geracao_atual < 3 AND upline_atual IS NOT NULL LOOP
                    geracao_atual := geracao_atual + 1;
                    
                    -- Buscar regra para esta geração
                    SELECT * INTO regra FROM mlm.bonus_regras 
                    WHERE tipo = 'geracao' 
                      AND geracao = geracao_atual
                      AND configuracoes->>'plano' = plano_normalizado
                      AND is_active = true
                    LIMIT 1;
                    
                    IF regra.id IS NOT NULL THEN
                        INSERT INTO mlm.comissoes (
                            pedido_id, tipo, geracao, valor_base, porcentagem, 
                            valor_comissao, status, data_calculo, distribuidor_id, descricao,
                            referencia_id, referencia_tipo
                        ) VALUES (
                            pedido_id, regra.tipo, regra.geracao, valor, regra.porcentagem,
                            ROUND(valor * (regra.porcentagem / 100), 2), 'pendente', NOW(), 
                            upline_atual, regra.nome || ' - Geração ' || geracao_atual,
                            comprador_id, 'distribuidor'
                        );
                        
                        RAISE NOTICE 'Comissão geração % gerada: % para upline %', 
                            geracao_atual, ROUND(valor * (regra.porcentagem / 100), 2), upline_atual;
                    END IF;
                    
                    -- Buscar próximo upline na rede linear
                    SELECT id_patrocinador INTO upline_atual 
                    FROM mlm.rede_linear_nos 
                    WHERE id_distribuidor = upline_atual
                    LIMIT 1;
                END LOOP;
            END;
        END IF;
        
        -- ===========================
        -- GERAR BÔNUS DE LIDERANÇA (Excelência)
        -- ===========================
        IF plano_normalizado = 'excelencia' THEN
            -- Contar diretos ativos do patrocinador
            DECLARE
                diretos_ativos INTEGER;
            BEGIN
                SELECT COUNT(*) INTO diretos_ativos
                FROM mlm.distribuidores d
                JOIN mlm.planos_distribuidores pd ON d.id = pd.distribuidor_id
                WHERE d.patrocinador_id = patrocinador_id::TEXT
                  AND pd.ativo = true
                  AND d.ativo = true;
                
                -- Bônus extra para 4-7 diretos
                IF diretos_ativos >= 4 AND diretos_ativos <= 7 THEN
                    SELECT * INTO regra FROM mlm.bonus_regras 
                    WHERE tipo = 'lideranca' 
                      AND configuracoes->>'plano' = 'excelencia'
                      AND configuracoes->>'min_diretos' = '4'
                      AND is_active = true
                    LIMIT 1;
                    
                    IF regra.id IS NOT NULL THEN
                        INSERT INTO mlm.comissoes (
                            pedido_id, tipo, geracao, valor_base, porcentagem, 
                            valor_comissao, status, data_calculo, distribuidor_id, descricao
                        ) VALUES (
                            pedido_id, regra.tipo, regra.geracao, valor, regra.porcentagem,
                            ROUND(valor * (regra.porcentagem / 100), 2), 'pendente', NOW(), 
                            patrocinador_id, regra.nome || ' (' || diretos_ativos || ' diretos)'
                        );
                        
                        RAISE NOTICE 'Bônus liderança gerado: % para patrocinador %', 
                            ROUND(valor * (regra.porcentagem / 100), 2), patrocinador_id;
                    END IF;
                END IF;
                
                -- Bônus extra para 8+ diretos
                IF diretos_ativos >= 8 THEN
                    SELECT * INTO regra FROM mlm.bonus_regras 
                    WHERE tipo = 'lideranca' 
                      AND configuracoes->>'plano' = 'excelencia'
                      AND configuracoes->>'min_diretos' = '8'
                      AND is_active = true
                    LIMIT 1;
                    
                    IF regra.id IS NOT NULL THEN
                        INSERT INTO mlm.comissoes (
                            pedido_id, tipo, geracao, valor_base, porcentagem, 
                            valor_comissao, status, data_calculo, distribuidor_id, descricao
                        ) VALUES (
                            pedido_id, regra.tipo, regra.geracao, valor, regra.porcentagem,
                            ROUND(valor * (regra.porcentagem / 100), 2), 'pendente', NOW(), 
                            patrocinador_id, regra.nome || ' (' || diretos_ativos || ' diretos)'
                        );
                        
                        RAISE NOTICE 'Bônus liderança gerado: % para patrocinador %', 
                            ROUND(valor * (regra.porcentagem / 100), 2), patrocinador_id;
                    END IF;
                END IF;
            END;
        END IF;
    END IF;
    
    -- ===========================
    -- GERAR PONTOS PARA A REDE
    -- ===========================
    IF pontos_produto > 0 THEN
        -- Adicionar pontos ao saldo do comprador
        IF comprador_id IS NOT NULL THEN
            INSERT INTO mlm.pontos_saldo (
                distribuidor_id,
                saldo_atual,
                saldo_acumulado
            ) VALUES (
                comprador_id,
                pontos_produto,
                pontos_produto
            )
            ON CONFLICT (distribuidor_id) DO UPDATE SET
                saldo_atual = pontos_saldo.saldo_atual + pontos_produto,
                saldo_acumulado = pontos_saldo.saldo_acumulado + pontos_produto;
            
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
                'qualificacao',
                pontos_produto,
                0,
                pontos_produto,
                'Pontos de qualificação - Compra de produto',
                pedido_id,
                NOW()
            );
            
            RAISE NOTICE 'Pontos de qualificação gerados: % para distribuidor %', 
                pontos_produto, comprador_id;
        END IF;
        
        -- Adicionar pontos aos uplines (rede do comprador)
        IF comprador_id IS NOT NULL THEN
            DECLARE
                upline_atual UUID;
                pontos_upline INTEGER;
            BEGIN
                upline_atual := comprador_id;
                pontos_upline := pontos_produto;
                
                -- Distribuir pontos para até 5 níveis na rede
                FOR i IN 1..5 LOOP
                    -- Buscar patrocinador do upline atual
                    SELECT id_patrocinador INTO upline_atual 
                    FROM mlm.rede_linear_nos 
                    WHERE id_distribuidor = upline_atual
                    LIMIT 1;
                    
                    EXIT WHEN upline_atual IS NULL;
                    
                    -- Adicionar pontos ao upline (50% do valor anterior)
                    pontos_upline := FLOOR(pontos_upline * 0.5);
                    
                    IF pontos_upline > 0 THEN
                        INSERT INTO mlm.pontos_saldo (
                            distribuidor_id,
                            saldo_atual,
                            saldo_acumulado
                        ) VALUES (
                            upline_atual,
                            pontos_upline,
                            pontos_upline
                        )
                        ON CONFLICT (distribuidor_id) DO UPDATE SET
                            saldo_atual = pontos_saldo.saldo_atual + pontos_upline,
                            saldo_acumulado = pontos_saldo.saldo_acumulado + pontos_upline;
                        
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
                            upline_atual,
                            'rede',
                            pontos_upline,
                            0,
                            pontos_upline,
                            'Pontos de rede - Nível ' || i,
                            pedido_id,
                            NOW()
                        );
                    END IF;
                END LOOP;
            END;
        END IF;
    END IF;
    
    -- ===========================
    -- ATUALIZAR QUALIFICAÇÕES
    -- ===========================
    -- Desabilitado - tabela mlm.qualificacoes não tem coluna distribuidor_id
    -- IF comprador_id IS NOT NULL THEN
    --     -- Verificar se atingiu novos níveis de qualificação
    --     DECLARE
    --         pontos_totais INTEGER;
    --         qualificacao_atual TEXT;
    --         nova_qualificacao TEXT;
    --     BEGIN
    --         SELECT saldo_acumulado INTO pontos_totais
    --         FROM mlm.pontos_saldo
    --         WHERE distribuidor_id = comprador_id;
    --         
    --         -- Definir qualificação baseada em pontos
    --         IF pontos_totais >= 10000 THEN
    --             nova_qualificacao := 'Diamante';
    --         ELSIF pontos_totais >= 5000 THEN
    --             nova_qualificacao := 'Platina';
    --         ELSIF pontos_totais >= 2000 THEN
    --             nova_qualificacao := 'Ouro';
    --         ELSIF pontos_totais >= 1000 THEN
    --             nova_qualificacao := 'Prata';
    --         ELSE
    --             nova_qualificacao := 'Bronze';
    --         END IF;
    --         
    --         RAISE NOTICE 'Qualificação calculada: % para distribuidor % (pontos: %)', 
    --             nova_qualificacao, comprador_id, pontos_totais;
    --     END;
    -- END IF;
    
    RAISE NOTICE 'Pedido % processado com sucesso', pedido_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erro ao processar compra de produto %: %', pedido_id, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Comentário sobre a função
COMMENT ON FUNCTION processar_compra_produto IS 'Função que processa compras de produtos MLM, gerando comissões diretas, bônus de patrocinador, comissões de geração, bônus de liderança e pontos para a rede';
