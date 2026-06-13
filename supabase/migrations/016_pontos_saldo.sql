-- ============================================================================
-- PONTOS SALDO - ALLIN OS 2.0
-- Saldo de pontos por distribuidor
-- ============================================================================

BEGIN;

-- ============================================================================
-- PONTOS SALDO
-- Tabela de saldo de pontos por distribuidor
-- ============================================================================
CREATE TABLE pontos_saldo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamento
    distribuidor_id TEXT NOT NULL UNIQUE,
    
    -- Saldos
    saldo_atual INTEGER DEFAULT 0,
    saldo_disponivel INTEGER DEFAULT 0,
    saldo_bloqueado INTEGER DEFAULT 0,
    saldo_acumulado INTEGER DEFAULT 0,
    saldo_utilizado INTEGER DEFAULT 0,
    
    -- Pontos por período
    pontos_mes_atual INTEGER DEFAULT 0,
    pontos_mes_anterior INTEGER DEFAULT 0,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pontos_saldo_distribuidor_id ON pontos_saldo(distribuidor_id);
CREATE INDEX idx_pontos_saldo_saldo_atual ON pontos_saldo(saldo_atual);
CREATE INDEX idx_pontos_saldo_pontos_mes_atual ON pontos_saldo(pontos_mes_atual);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_pontos_saldo_updated_at BEFORE UPDATE ON pontos_saldo
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'pontos_saldo';
