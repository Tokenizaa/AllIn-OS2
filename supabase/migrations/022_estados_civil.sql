-- ============================================================================
-- ESTADOS CIVIL - ALLIN OS 2.0
-- Baseado em: 41-estados-civil.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- ESTADOS CIVIL
-- Tabela de estados civis possíveis para clientes e distribuidores
-- ============================================================================
CREATE TABLE estados_civil (
    id INTEGER PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_estados_civil_codigo ON estados_civil(codigo);
CREATE INDEX idx_estados_civil_descricao ON estados_civil(descricao);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_estados_civil_updated_at BEFORE UPDATE ON estados_civil
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'estados_civil';
