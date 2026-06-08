-- FASE 13 Phase 5: Embeddings/RAG Implementation
-- This file contains the SQL migrations for Phase 5 of FASE 13

-- Migration 1: Create customer_embeddings table
CREATE TABLE IF NOT EXISTS customer_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    embedding vector(1536),
    content TEXT NOT NULL,
    embedding_model TEXT DEFAULT 'text-embedding-3-small',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_embeddings_customer_id ON customer_embeddings(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_embeddings_created_at ON customer_embeddings(created_at DESC);

ALTER TABLE customer_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
ON customer_embeddings FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER trg_customer_embeddings_updated_at
BEFORE UPDATE ON customer_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_wallet_transactions_updated_at();

-- Migration 2: Create product_embeddings table
CREATE TABLE IF NOT EXISTS product_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    embedding vector(1536),
    content TEXT NOT NULL,
    embedding_model TEXT DEFAULT 'text-embedding-3-small',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_embeddings_product_id ON product_embeddings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_embeddings_created_at ON product_embeddings(created_at DESC);

ALTER TABLE product_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
ON product_embeddings FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER trg_product_embeddings_updated_at
BEFORE UPDATE ON product_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_wallet_transactions_updated_at();

-- Migration 3: Create document_embeddings table
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    section_id TEXT,
    embedding vector(1536),
    content TEXT NOT NULL,
    embedding_model TEXT DEFAULT 'text-embedding-3-small',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_embeddings_document_id ON document_embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_document_type ON document_embeddings(document_type);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_created_at ON document_embeddings(created_at DESC);

ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
ON document_embeddings FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER trg_document_embeddings_updated_at
BEFORE UPDATE ON document_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_wallet_transactions_updated_at();

-- Migration 4: Enable pgvector and create vector indexes
CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX IF NOT EXISTS idx_customer_embeddings_vector 
ON customer_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_product_embeddings_vector 
ON product_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_document_embeddings_vector 
ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Migration 5: Create semantic search functions
CREATE OR REPLACE FUNCTION search_customers_semantic(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    customer_id UUID,
    customer_name TEXT,
    similarity float,
    content TEXT,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ce.customer_id,
        c.nome_completo as customer_name,
        1 - (ce.embedding <=> query_embedding) as similarity,
        ce.content,
        ce.metadata
    FROM customer_embeddings ce
    INNER JOIN customers c ON c.id = ce.customer_id
    WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
    ORDER BY ce.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_products_semantic(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    similarity float,
    content TEXT,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pe.product_id,
        p.nome as product_name,
        1 - (pe.embedding <=> query_embedding) as similarity,
        pe.content,
        pe.metadata
    FROM product_embeddings pe
    INNER JOIN products p ON p.id = pe.product_id
    WHERE 1 - (pe.embedding <=> query_embedding) > match_threshold
    ORDER BY pe.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_documents_semantic(
    query_embedding vector(1536),
    document_type_filter TEXT DEFAULT NULL,
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    document_id TEXT,
    document_type TEXT,
    section_id TEXT,
    similarity float,
    content TEXT,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        de.document_id,
        de.document_type,
        de.section_id,
        1 - (de.embedding <=> query_embedding) as similarity,
        de.content,
        de.metadata
    FROM document_embeddings de
    WHERE 1 - (de.embedding <=> query_embedding) > match_threshold
    AND (document_type_filter IS NULL OR de.document_type = document_type_filter)
    ORDER BY de.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
