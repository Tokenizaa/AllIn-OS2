-- ============================================================================
-- PRODUTOS CAMPOS OPÇÕES - ALLIN OS 2.0
-- Baseado em: 55-produtos-campos-opcoes.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PRODUTOS CAMPOS OPÇÕES
-- Tabela de campos das opções dos produtos
-- ============================================================================
CREATE TABLE produtos_campos_opcoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    descricao VARCHAR(200) NOT NULL,
    componente VARCHAR(50),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_produtos_campos_opcoes_descricao ON produtos_campos_opcoes(descricao);
CREATE INDEX idx_produtos_campos_opcoes_componente ON produtos_campos_opcoes(componente);
CREATE INDEX idx_produtos_campos_opcoes_ativo ON produtos_campos_opcoes(ativo);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_produtos_campos_opcoes_updated_at BEFORE UPDATE ON produtos_campos_opcoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'produtos_campos_opcoes';
