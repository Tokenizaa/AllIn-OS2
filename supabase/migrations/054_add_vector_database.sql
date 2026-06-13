-- ============================================================================
-- ADD VECTOR DATABASE - ALLIN OS 2.0
-- Instala extensão pgvector e cria tabela de embeddings para busca semântica
-- Sprint 3 - Task 3.4
-- ============================================================================

BEGIN;

-- ============================================================================
-- INSTALAR EXTENSÃO PGVECTOR
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- CRIAR TABELA DE EMBEDDINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS system.embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL,
    resource_id TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_embeddings_resource_type ON system.embeddings(resource_type);
CREATE INDEX IF NOT EXISTS idx_embeddings_resource_id ON system.embeddings(resource_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_embedding ON system.embeddings USING ivfflat (embedding vector_cosine_ops);

-- Índice GIN para busca em metadata
CREATE INDEX IF NOT EXISTS idx_embeddings_metadata ON system.embeddings USING gin(metadata);

-- ============================================================================
-- FUNÇÃO PARA BUSCA SIMILAR POR COSINE SIMILARITY
-- ============================================================================
CREATE OR REPLACE FUNCTION system.search_similar_embeddings(
    search_embedding vector(1536),
    search_resource_type VARCHAR(50),
    limit_count INTEGER DEFAULT 10,
    similarity_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    id UUID,
    resource_type VARCHAR(50),
    resource_id TEXT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.resource_type,
        e.resource_id,
        e.content,
        e.metadata,
        1 - (e.embedding <=> search_embedding) as similarity
    FROM system.embeddings e
    WHERE e.resource_type = search_resource_type
      AND (1 - (e.embedding <=> search_embedding)) >= similarity_threshold
    ORDER BY e.embedding <=> search_embedding
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNÇÃO PARA ATUALIZAR EMBEDDING
-- ============================================================================
CREATE OR REPLACE FUNCTION system.update_embedding(
    p_resource_type VARCHAR(50),
    p_resource_id TEXT,
    p_content TEXT,
    p_embedding vector(1536),
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    -- Verificar se embedding já existe
    SELECT id INTO v_id
    FROM system.embeddings
    WHERE resource_type = p_resource_type
      AND resource_id = p_resource_id
    LIMIT 1;
    
    IF v_id IS NOT NULL THEN
        -- Atualizar embedding existente
        UPDATE system.embeddings
        SET 
            content = p_content,
            embedding = p_embedding,
            metadata = p_metadata,
            updated_at = NOW()
        WHERE id = v_id;
        
        RETURN v_id;
    ELSE
        -- Criar novo embedding
        INSERT INTO system.embeddings (resource_type, resource_id, content, embedding, metadata)
        VALUES (p_resource_type, p_resource_id, p_content, p_embedding, p_metadata)
        RETURNING id INTO v_id;
        
        RETURN v_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNÇÃO PARA DELETAR EMBEDDING
-- ============================================================================
CREATE OR REPLACE FUNCTION system.delete_embedding(
    p_resource_type VARCHAR(50),
    p_resource_id TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM system.embeddings
    WHERE resource_type = p_resource_type
      AND resource_id = p_resource_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_embeddings_updated_at BEFORE UPDATE ON system.embeddings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR EXTENSÃO INSTALADA
-- ============================================================================
SELECT 
    extname as extension_name,
    extversion as version
FROM pg_extension
WHERE extname = 'vector';

-- ============================================================================
-- VERIFICAR TABELA CRIADA
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'system'
  AND tablename = 'embeddings';

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Extensão pgvector instalada para suporte a embeddings
-- - Tabela system.embeddings criada para armazenar embeddings
-- - Índice ivfflat criado para busca eficiente por similaridade
-- - Funções helper criadas para buscar, atualizar e deletar embeddings
-- - Função search_similar_embeddings usa cosine similarity
-- ============================================================================
