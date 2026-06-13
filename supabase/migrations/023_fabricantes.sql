-- ============================================================================
-- FABRICANTES - ALLIN OS 2.0
-- Baseado em: 44-fabricantes.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- FABRICANTES
-- Tabela de fabricantes
-- ============================================================================
CREATE TABLE fabricantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    imagem TEXT,
    ordem INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_fabricantes_nome ON fabricantes(nome);
CREATE INDEX idx_fabricantes_ordem ON fabricantes(ordem);
CREATE INDEX idx_fabricantes_is_active ON fabricantes(is_active);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_fabricantes_updated_at BEFORE UPDATE ON fabricantes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'fabricantes';
