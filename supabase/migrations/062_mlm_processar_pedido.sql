-- Migration: Função principal de processamento de pedidos MLM
-- Cria a função processar_pedido_mlm() que identifica o tipo de compra
-- e direciona para a função específica (plano ou produto)

-- Habilita extensão necessária se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função principal de processamento de pedidos MLM
CREATE OR REPLACE FUNCTION processar_pedido_mlm(pedido_id UUID)
RETURNS VOID AS $$
DECLARE
    pedido RECORD;
    tipo_compra TEXT;
    e_distribuidor BOOLEAN;
    e_plano BOOLEAN;
BEGIN
    -- Buscar dados do pedido
    SELECT * INTO pedido FROM pedidos WHERE id = pedido_id;
    
    -- Se pedido não existe, retornar
    IF NOT FOUND THEN
        RAISE NOTICE 'Pedido % não encontrado', pedido_id;
        RETURN;
    END IF;
    
    -- Verificar se pagamento foi confirmado
    IF NOT pedido.pagamento_confirmado THEN
        RAISE NOTICE 'Pedido % não tem pagamento confirmado', pedido_id;
        RETURN;
    END IF;
    
    -- Verificar se já foi processado
    IF pedido.comissoes_geradas THEN
        RAISE NOTICE 'Pedido % já foi processado', pedido_id;
        RETURN;
    END IF;
    
    -- Identificar tipo de compra
    tipo_compra := COALESCE(pedido.tipo_nome, '');
    
    -- Verificar se é compra de plano
    e_plano := tipo_compra ILIKE '%Plano%' OR tipo_compra ILIKE '%plano%';
    
    -- Identificar se comprador é distribuidor
    SELECT EXISTS(
        SELECT 1 FROM mlm.distribuidores d
        WHERE d.id = pedido.distribuidor_comprador_id
           OR d.allin_id::TEXT = pedido.metadata->>'id_comprador'
    ) INTO e_distribuidor;
    
    -- Log para debug
    RAISE NOTICE 'Processando pedido %: tipo=%, e_plano=%, e_distribuidor=%', 
        pedido_id, tipo_compra, e_plano, e_distribuidor;
    
    -- Processar conforme tipo
    IF e_plano THEN
        -- Processar compra de plano
        PERFORM processar_compra_plano(pedido_id, e_distribuidor);
    ELSE
        -- Processar compra de produto
        PERFORM processar_compra_produto(pedido_id, e_distribuidor);
    END IF;
    
    -- Marcar pedido como processado
    UPDATE pedidos 
    SET comissoes_geradas = true, 
        comissoes_geradas_at = NOW()
    WHERE id = pedido_id;
    
    RAISE NOTICE 'Pedido % processado com sucesso', pedido_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erro ao processar pedido %: %', pedido_id, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Comentário sobre a função
COMMENT ON FUNCTION processar_pedido_mlm IS 'Função principal que processa pedidos MLM, identificando se é compra de plano ou produto e direcionando para a função específica';
