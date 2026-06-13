-- ============================================================================
-- QUALIFICAÇÕES HISTÓRICO - ALLIN OS 2.0
-- Histórico de qualificações
-- ============================================================================

BEGIN;

-- ============================================================================
-- QUALIFICAÇÕES HISTÓRICO
-- Tabela de histórico de qualificações por distribuidor
-- ============================================================================
CREATE TABLE qualificacoes_historico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    distribuidor_id TEXT NOT NULL,
    qualificacao_id UUID REFERENCES qualificacoes(id) ON DELETE SET NULL,
    
    -- Período
    data_inicio DATE NOT NULL,
    data_fim DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_qualificacoes_historico_distribuidor_id ON qualificacoes_historico(distribuidor_id);
CREATE INDEX idx_qualificacoes_historico_qualificacao_id ON qualificacoes_historico(qualificacao_id);
CREATE INDEX idx_qualificacoes_historico_data_inicio ON qualificacoes_historico(data_inicio);
CREATE INDEX idx_qualificacoes_historico_data_fim ON qualificacoes_historico(data_fim);
CREATE INDEX idx_qualificacoes_historico_is_active ON qualificacoes_historico(is_active);

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'qualificacoes_historico';
