-- ============================================================================
-- PLANOS DISTRIBUIDORES - ALLIN OS 2.0
-- Planos ativos por distribuidor
-- ============================================================================

BEGIN;

-- ============================================================================
-- PLANOS DISTRIBUIDORES
-- Tabela de planos ativos por distribuidor
-- ============================================================================
CREATE TABLE planos_distribuidores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    distribuidor_id TEXT NOT NULL,
    plano_id UUID NOT NULL REFERENCES planos(id) ON DELETE CASCADE,
    
    -- Status do plano
    status VARCHAR(50) DEFAULT 'active',
    data_ativacao TIMESTAMPTZ DEFAULT NOW(),
    data_expiracao TIMESTAMPTZ,
    data_renovacao TIMESTAMPTZ,
    
    -- Valores pagos
    valor_pago NUMERIC(10,2),
    forma_pagamento VARCHAR(50),
    
    -- Pontuação
    pontos_ganhos INTEGER DEFAULT 0,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_planos_distribuidores_distribuidor_id ON planos_distribuidores(distribuidor_id);
CREATE INDEX idx_planos_distribuidores_plano_id ON planos_distribuidores(plano_id);
CREATE INDEX idx_planos_distribuidores_status ON planos_distribuidores(status);
CREATE INDEX idx_planos_distribuidores_data_ativacao ON planos_distribuidores(data_ativacao);
CREATE INDEX idx_planos_distribuidores_data_expiracao ON planos_distribuidores(data_expiracao);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_planos_distribuidores_updated_at BEFORE UPDATE ON planos_distribuidores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'planos_distribuidores';
