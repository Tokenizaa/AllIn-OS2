-- ============================================================================
-- ADD MISSING INDEXES - ALLIN OS 2.0
-- Adiciona índices ausentes em tabelas de alto volume para otimizar performance
-- Sprint 2 - Task 2.1
-- ============================================================================

BEGIN;

-- ============================================================================
-- CRM.CUSTOMERS INDEXES
-- ============================================================================

-- Index composto para busca por nome e status
CREATE INDEX IF NOT EXISTS idx_customers_nome_status ON crm.customers(nome, status);

-- Index composto para patrocinador_id e status (frequente em queries de rede)
CREATE INDEX IF NOT EXISTS idx_customers_patrocinador_status ON crm.customers(patrocinador_id, status);

-- Index composto para distribuidor_id e status
CREATE INDEX IF NOT EXISTS idx_customers_distribuidor_status ON crm.customers(distribuidor_id, status);

-- ============================================================================
-- MLM.DISTRIBUIDORES INDEXES
-- ============================================================================

-- Index composto para patrocinador_id e status (frequente em queries de rede)
CREATE INDEX IF NOT EXISTS idx_distribuidores_patrocinador_status ON mlm.distribuidores(patrocinador_id, status);

-- Index composto para perna_esquerda_id e status
CREATE INDEX IF NOT EXISTS idx_distribuidores_perna_esquerda_status ON mlm.distribuidores(perna_esquerda_id, status);

-- Index composto para perna_direita_id e status
CREATE INDEX IF NOT EXISTS idx_distribuidores_perna_direita_status ON mlm.distribuidores(perna_direita_id, status);

-- ============================================================================
-- COMMERCE.PEDIDOS INDEXES
-- ============================================================================

-- Index composto para cliente_id e status_pedido (frequente em queries combinadas)
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_status_pedido ON commerce.pedidos(cliente_id, status_pedido);

-- Index composto para status_pedido e data_criacao (frequente em filtros de pedidos por período e status)
CREATE INDEX IF NOT EXISTS idx_pedidos_status_pedido_data_criacao ON commerce.pedidos(status_pedido, data_criacao);

-- Index composto para cliente_id, status_pedido e data_criacao (frequente em queries complexas)
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_status_data_criacao ON commerce.pedidos(cliente_id, status_pedido, data_criacao);

-- Index composto para distribuidor_indicador_id e status_pedido
CREATE INDEX IF NOT EXISTS idx_pedidos_distribuidor_indicador_status ON commerce.pedidos(distribuidor_indicador_id, status_pedido);

-- Index composto para distribuidor_comprador_id e status_pedido
CREATE INDEX IF NOT EXISTS idx_pedidos_distribuidor_comprador_status ON commerce.pedidos(distribuidor_comprador_id, status_pedido);

-- ============================================================================
-- MLM.COMISSOES INDEXES
-- ============================================================================

-- Index composto para distribuidor_id e status (frequente em queries de comissões pendentes)
CREATE INDEX IF NOT EXISTS idx_comissoes_distribuidor_status ON mlm.comissoes(distribuidor_id, status);

-- Index composto para pedido_id e status
CREATE INDEX IF NOT EXISTS idx_comissoes_pedido_status ON mlm.comissoes(pedido_id, status);

-- Index composto para status e data_calculo (frequente em filtros de comissões por período e status)
CREATE INDEX IF NOT EXISTS idx_comissoes_status_data_calculo ON mlm.comissoes(status, data_calculo);

-- Index composto para distribuidor_id, status e data_calculo (frequente em queries complexas)
CREATE INDEX IF NOT EXISTS idx_comissoes_distribuidor_status_data ON mlm.comissoes(distribuidor_id, status, data_calculo);

-- Index composto para tipo e status
CREATE INDEX IF NOT EXISTS idx_comissoes_tipo_status ON mlm.comissoes(tipo, status);

-- ============================================================================
-- VERIFICAR ÍNDICES CRIADOS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname IN ('crm', 'mlm', 'commerce')
  AND tablename IN ('customers', 'distribuidores', 'pedidos', 'comissoes')
  AND indexname LIKE 'idx_%'
ORDER BY schemaname, tablename, indexname;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Índices compostos criados para queries com múltiplos filtros
-- - Índices simples (email, cpf, cnpj, etc.) já existem nas migrations originais
-- - Performance deve ser testada antes e depois com EXPLAIN ANALYZE
-- - Índices podem afetar performance de INSERT/UPDATE, mas o ganho em SELECT compensa
-- ============================================================================
