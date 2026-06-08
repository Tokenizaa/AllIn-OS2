# RAG READINESS REPORT

**Data:** 7 de Junho de 2026  
**Projeto Supabase:** sistema-allin (isjsydhuqurneswstlyx)  
**Objetivo:** Auditar estrutura de embeddings e RAG

---

# RESUMO EXECUTIVO

**Status:** ❌ NÃO PREPARADO - Estrutura Ausente

A auditoria revelou que:

- Extensão `vector` está instalada (0.8.0) ✅
- Não há tabelas de embeddings ❌
- Não há tabelas de customer_embeddings ❌
- Não há pipeline de geração de embeddings ❌
- Não há busca semântica implementada ❌

---

# INFRAESTRUTURA DE VETORES

## Extensions

| Extension | Versão | Status | Uso |
|-----------|---------|--------|-----|
| vector | 0.8.0 | ✅ Instalado | ❌ Não utilizado |

## Tabelas de Embeddings

| Tabela | Registros | Status |
|--------|-----------|--------|
| embeddings | ❌ Não existe | - |
| customer_embeddings | ❌ Não existe | - |
| document_embeddings | ❌ Não existe | - |
| product_embeddings | ❌ Não existe | - |

---

# PIPELINE DE EMBEDDINGS

## Status Atual

**Geração de Embeddings:** ❌ Não implementado

**Problemas:**
1. Não há função para gerar embeddings
2. Não há serviço de embeddings identificado
3. Não há integração com Ollama ou OpenAI
4. Não há pipeline de batch processing
5. Não há atualização incremental

## Requisitos para Implementação

### 1. Tabelas de Embeddings

```sql
-- Tabela de embeddings de clientes
CREATE TABLE customer_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    embedding vector(1536),
    model TEXT DEFAULT 'text-embedding-ada-002',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de embeddings de produtos
CREATE TABLE product_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    embedding vector(1536),
    model TEXT DEFAULT 'text-embedding-ada-002',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de embeddings de documentos
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id TEXT NOT NULL,
    document_type TEXT NOT NULL, -- 'policy', 'faq', 'guide', etc.
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    model TEXT DEFAULT 'text-embedding-ada-002',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices vectoriais
CREATE INDEX idx_customer_embeddings_embedding ON customer_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_product_embeddings_embedding ON product_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_document_embeddings_embedding ON document_embeddings USING ivfflat (embedding vector_cosine_ops);
```

### 2. Função de Geração de Embeddings

```sql
-- Função para gerar embedding (requer integração com OpenAI ou similar)
CREATE OR REPLACE FUNCTION generate_embedding(text TEXT)
RETURNS vector(1536) AS $$
BEGIN
    -- Integrar com OpenAI API ou similar
    -- Por enquanto, retorna NULL
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### 3. Pipeline de Atualização

```sql
-- Trigger para atualizar embedding quando customer é atualizado
CREATE OR REPLACE FUNCTION update_customer_embedding()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customer_embeddings
    SET embedding = generate_embedding(
        COALESCE(NEW.nome, '') || ' ' ||
        COALESCE(NEW.email, '') || ' ' ||
        COALESCE(NEW.telefone, '') || ' ' ||
        COALESCE(NEW.cpf, '')
    ),
    updated_at = NOW()
    WHERE customer_id = NEW.id;
    
    IF NOT FOUND THEN
        INSERT INTO customer_embeddings (customer_id, embedding)
        VALUES (NEW.id, generate_embedding(
            COALESCE(NEW.nome, '') || ' ' ||
            COALESCE(NEW.email, '') || ' ' ||
            COALESCE(NEW.telefone, '') || ' ' ||
            COALESCE(NEW.cpf, '')
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customer_embedding_update
AFTER INSERT OR UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_customer_embedding();
```

---

# BUSCA SEMÂNTICA

## Status Atual

**Busca Semântica:** ❌ Não implementada

**Problemas:**
1. Não há função de busca semântica
2. Não há integração com Copilot
3. Não há endpoint de busca
4. Não há interface de busca

## Requisitos para Implementação

### 1. Função de Busca Semântica

```sql
-- Função para buscar clientes similares
CREATE OR REPLACE FUNCTION search_similar_customers(
    query_text TEXT,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    customer_id UUID,
    similarity FLOAT,
    customer_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ce.customer_id,
        1 - (ce.embedding <=> generate_embedding(query_text)) AS similarity,
        jsonb_build_object(
            'nome', c.nome,
            'email', c.email,
            'telefone', c.telefone
        ) AS customer_data
    FROM customer_embeddings ce
    JOIN customers c ON ce.customer_id = c.id
    ORDER BY ce.embedding <=> generate_embedding(query_text)
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

### 2. Função de RAG

```sql
-- Função para RAG (Retrieval Augmented Generation)
CREATE OR REPLACE FUNCTION rag_retrieve_context(
    query_text TEXT,
    context_type TEXT DEFAULT 'all',
    limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    content TEXT,
    source TEXT,
    similarity FLOAT
) AS $$
BEGIN
    IF context_type = 'customers' THEN
        RETURN QUERY
        SELECT 
            c.nome || ' - ' || c.email AS content,
            'customer' AS source,
            1 - (ce.embedding <=> generate_embedding(query_text)) AS similarity
        FROM customer_embeddings ce
        JOIN customers c ON ce.customer_id = c.id
        ORDER BY ce.embedding <=> generate_embedding(query_text)
        LIMIT limit_count;
    ELSIF context_type = 'products' THEN
        RETURN QUERY
        SELECT 
            p.nome || ' - ' || p.descricao AS content,
            'product' AS source,
            1 - (pe.embedding <=> generate_embedding(query_text)) AS similarity
        FROM product_embeddings pe
        JOIN products p ON pe.product_id = p.id
        ORDER BY pe.embedding <=> generate_embedding(query_text)
        LIMIT limit_count;
    ELSE
        -- Documentos
        RETURN QUERY
        SELECT 
            de.content,
            de.document_type AS source,
            1 - (de.embedding <=> generate_embedding(query_text)) AS similarity
        FROM document_embeddings de
        ORDER BY de.embedding <=> generate_embedding(query_text)
        LIMIT limit_count;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

---

# INTEGRAÇÃO COM COPILOT

## Status Atual

**Integração:** ❌ Não implementada

**Problemas:**
1. ContextBuilder do Copilot não usa embeddings
2. Não há busca semântica no contexto
3. Contexto é baseado apenas em queries SQL diretas

## Requisitos para Implementação

### 1. Atualizar ContextBuilder

No arquivo `src/backend/modules/copilot/context/context-builder.ts`:

```typescript
// Adicionar busca semântica ao contexto
async buildSemanticContext(query: string, contextType: string = 'all') {
  const { data, error } = await supabase.rpc('rag_retrieve_context', {
    query_text: query,
    context_type: contextType,
    limit_count: 5
  });
  
  if (error) {
    logger.error('Failed to retrieve semantic context', 'context-builder', { error });
    return [];
  }
  
  return data || [];
}
```

### 2. Integrar ao Contexto

```typescript
// No método buildContext
const semanticContext = await this.buildSemanticContext(query, 'customers');
contextData.semanticContext = semanticContext;
```

---

# AÇÕES CORRETIVAS PRIORITÁRIAS

## CRÍTICO (Bloqueia RAG)

1. **Criar tabelas de embeddings**
   - customer_embeddings
   - product_embeddings
   - document_embeddings
   - Criar índices vectoriais

2. **Implementar função de geração de embeddings**
   - Integrar com OpenAI API ou similar
   - Criar função SQL para geração
   - Testar geração de embeddings

3. **Implementar pipeline de atualização**
   - Criar triggers para atualização automática
   - Implementar batch processing inicial
   - Implementar atualização incremental

## ALTO (Impacta Qualidade)

4. **Implementar busca semântica**
   - Criar função de busca similar
   - Criar função RAG
   - Testar busca semântica

5. **Integrar com Copilot**
   - Atualizar ContextBuilder
   - Adicionar contexto semântico ao prompt
   - Testar integração

## MÉDIO (Melhorias Futuras)

6. **Implementar reindexação**
   - Job para reindexar embeddings periodicamente
   - Detecção de mudanças e atualização incremental

7. **Implementar cache de embeddings**
   - Cache de embeddings frequentemente acessados
   - Otimização de performance

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Infraestrutura de Vetores | 5/10 | ⚠️ Parcial |
| Tabelas de Embeddings | 0/10 | ❌ Crítico |
| Pipeline de Geração | 0/10 | ❌ Crítico |
| Busca Semântica | 0/10 | ❌ Crítico |
| Integração com Copilot | 0/10 | ❌ Crítico |
| **RAG Readiness** | **1/10** | **❌ Crítico** |

---

# CONCLUSÃO

O sistema **NÃO possui RAG funcional**. Embora a extensão `vector` esteja instalada, não há tabelas de embeddings, pipeline de geração, ou busca semântica implementada.

**Recomendação Imediata:**
1. Criar tabelas de embeddings
2. Implementar função de geração de embeddings
3. Implementar pipeline de atualização
4. Integrar com Copilot

**Após implementação, o sistema estará pronto para:**
- Busca semântica de clientes
- Busca semântica de produtos
- RAG para Copilot
- Contexto enriquecido com embeddings

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
