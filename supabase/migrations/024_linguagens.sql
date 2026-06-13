-- ============================================================================
-- LINGUAGENS - ALLIN OS 2.0
-- Baseado em: 47-linguagens.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- LINGUAGENS
-- Tabela de linguagens/idiomas
-- ============================================================================
CREATE TABLE linguagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    titulo VARCHAR(200) NOT NULL,
    sigla VARCHAR(10) UNIQUE NOT NULL,
    diretorio VARCHAR(50),
    data_formato VARCHAR(20),
    icon TEXT,
    
    -- Status e configurações
    status INTEGER DEFAULT 1,
    padrao BOOLEAN DEFAULT false,
    ordem INTEGER DEFAULT 0,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_linguagens_titulo ON linguagens(titulo);
CREATE INDEX idx_linguagens_sigla ON linguagens(sigla);
CREATE INDEX idx_linguagens_status ON linguagens(status);
CREATE INDEX idx_linguagens_padrao ON linguagens(padrao);
CREATE INDEX idx_linguagens_ordem ON linguagens(ordem);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_linguagens_updated_at BEFORE UPDATE ON linguagens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'linguagens';
