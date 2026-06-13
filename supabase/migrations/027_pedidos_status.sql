-- ============================================================================
-- PEDIDOS STATUS - ALLIN OS 2.0
-- Baseado em: 52-pedidos-status.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PEDIDOS STATUS
-- Tabela de situações de pedidos cadastradas na loja virtual
-- ============================================================================
CREATE TABLE pedidos_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    label VARCHAR(200),
    
    -- Visualização
    cor VARCHAR(20),
    cor_texto VARCHAR(20),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pedidos_status_nome ON pedidos_status(nome);
CREATE INDEX idx_pedidos_status_label ON pedidos_status(label);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_pedidos_status_updated_at BEFORE UPDATE ON pedidos_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'pedidos_status';
