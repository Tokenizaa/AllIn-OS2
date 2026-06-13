-- ============================================================================
-- TIPOS PESSOA - ALLIN OS 2.0
-- Baseado em: 65-tipos-pessoa.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- TIPOS PESSOA
-- Tabela de tipos de pessoa possíveis para clientes e distribuidores
-- ============================================================================
CREATE TABLE tipos_pessoa (
    id INTEGER PRIMARY KEY,
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tipos_pessoa_nome ON tipos_pessoa(nome);
CREATE INDEX idx_tipos_pessoa_ativo ON tipos_pessoa(ativo);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_tipos_pessoa_updated_at BEFORE UPDATE ON tipos_pessoa
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'tipos_pessoa';
