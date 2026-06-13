-- ============================================================================
-- PRODUTOS OPÇÕES - ALLIN OS 2.0
-- Baseado em: 57-produtos-opcoes.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PRODUTOS OPÇÕES
-- Tabela de opções de produto
-- ============================================================================
CREATE TABLE produtos_opcoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamento
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    
    -- Configuração
    tipo VARCHAR(50),
    ordem INTEGER DEFAULT 0,
    combinacao TEXT,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_produtos_opcoes_produto_id ON produtos_opcoes(produto_id);
CREATE INDEX idx_produtos_opcoes_tipo ON produtos_opcoes(tipo);
CREATE INDEX idx_produtos_opcoes_ordem ON produtos_opcoes(ordem);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_produtos_opcoes_updated_at BEFORE UPDATE ON produtos_opcoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'produtos_opcoes';
