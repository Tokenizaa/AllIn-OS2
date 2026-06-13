-- ============================================================================
-- QUALIFICAÇÕES - ALLIN OS 2.0
-- Níveis de qualificação
-- ============================================================================

BEGIN;

-- ============================================================================
-- QUALIFICAÇÕES
-- Tabela de níveis de qualificação
-- ============================================================================
CREATE TABLE qualificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nivel INTEGER NOT NULL,
    descricao TEXT,
    
    -- Requisitos
    pontos_minimos INTEGER DEFAULT 0,
    volume_minimo NUMERIC(15,2) DEFAULT 0,
    diretos_minimos INTEGER DEFAULT 0,
    equipe_minima INTEGER DEFAULT 0,
    
    -- Benefícios
    bonus_porcentagem NUMERIC(5,2) DEFAULT 0,
    geracoes_maximas INTEGER DEFAULT 1,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadados
    configuracoes JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_qualificacoes_nome ON qualificacoes(nome);
CREATE INDEX idx_qualificacoes_codigo ON qualificacoes(codigo);
CREATE INDEX idx_qualificacoes_nivel ON qualificacoes(nivel);
CREATE INDEX idx_qualificacoes_is_active ON qualificacoes(is_active);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_qualificacoes_updated_at BEFORE UPDATE ON qualificacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'qualificacoes';
