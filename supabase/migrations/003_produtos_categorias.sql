-- ============================================================================
-- PRODUTOS CATEGORIAS - ALLIN OS 2.0
-- Baseado em: 56-produtos-categorias.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PRODUTOS CATEGORIAS
-- Baseado em: 56-produtos-categorias.md
-- Campos: id, image, categoria_pai_id, ordem, status
-- ============================================================================
CREATE TABLE produtos_categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image TEXT,
    categoria_pai_id UUID REFERENCES produtos_categorias(id) ON DELETE SET NULL,
    ordem INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_produtos_categorias_categoria_pai_id ON produtos_categorias(categoria_pai_id);
CREATE INDEX idx_produtos_categorias_ordem ON produtos_categorias(ordem);
CREATE INDEX idx_produtos_categorias_status ON produtos_categorias(status);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_produtos_categorias_updated_at BEFORE UPDATE ON produtos_categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'produtos_categorias';
