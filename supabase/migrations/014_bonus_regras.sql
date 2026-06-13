-- ============================================================================
-- BONUS REGRAS - ALLIN OS 2.0
-- Regras de cálculo de bônus
-- ============================================================================

BEGIN;

-- ============================================================================
-- BONUS REGRAS
-- Tabela de regras para cálculo de bônus
-- ============================================================================
CREATE TABLE bonus_regras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- direto, indireto, geracao, binario, start_bonus, etc
    descricao TEXT,
    
    -- Configurações de cálculo
    geracao INTEGER DEFAULT 1,
    porcentagem NUMERIC(5,2) NOT NULL DEFAULT 0,
    valor_fixo NUMERIC(10,2) DEFAULT 0,
    
    -- Condições
    pontos_minimos INTEGER DEFAULT 0,
    volume_minimo NUMERIC(15,2) DEFAULT 0,
    diretos_minimos INTEGER DEFAULT 0,
    
    -- Período
    periodo_tipo VARCHAR(50) DEFAULT 'mensal', -- mensal, semanal, diario
    periodo_dias INTEGER DEFAULT 30,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    data_inicio TIMESTAMPTZ DEFAULT NOW(),
    data_fim TIMESTAMPTZ,
    
    -- Metadados
    configuracoes JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_bonus_regras_nome ON bonus_regras(nome);
CREATE INDEX idx_bonus_regras_tipo ON bonus_regras(tipo);
CREATE INDEX idx_bonus_regras_geracao ON bonus_regras(geracao);
CREATE INDEX idx_bonus_regras_is_active ON bonus_regras(is_active);
CREATE INDEX idx_bonus_regras_data_inicio ON bonus_regras(data_inicio);
CREATE INDEX idx_bonus_regras_data_fim ON bonus_regras(data_fim);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_bonus_regras_updated_at BEFORE UPDATE ON bonus_regras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'bonus_regras';
