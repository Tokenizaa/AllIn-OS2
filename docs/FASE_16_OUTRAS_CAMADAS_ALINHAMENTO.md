# FASE 16 — ALINHAMENTO DE OUTRAS CAMADAS

**Data**: 8 de Junho de 2026  
**Projeto**: sistema-allin  
**Status**: EM ANDAMENTO

---

## Objetivo

Alinhar todas as tabelas de outras camadas (Chat, LLM, Embeddings, Marketing, Analytics) com o padrão legado (`id_comprador`).

---

## Análise de Tabelas por Camada

### 1. Chat/Integração

| Tabela | Registros | Campo Atual | Status | Ação |
|--------|-----------|-------------|--------|------|
| chatwoot_conversations | 0 | user_id (UUID) | VAZIA | Manter (user_id correto para auth) |
| chatwoot_messages | 0 | user_id (UUID) | VAZIA | Manter (user_id correto para auth) |
| integrations | 0 | - | VAZIA | Manter (configuração de sistema) |

**Status**: ✅ ALINHADO (usa user_id correto para auth)

---

### 2. LLM/Embeddings

| Tabela | Registros | Campo Atual | Status | Ação |
|--------|-----------|-------------|--------|------|
| customer_embeddings | 0 | customer_id (UUID) | VAZIA | ⚠️ PRECISA ALINHAR |
| document_embeddings | 0 | document_id (TEXT) | VAZIA | ✅ OK (usa document_id) |
| product_embeddings | 0 | product_id (UUID) | VAZIA | ✅ OK (usa product_id) |

**Status**: ⚠️ customer_embeddings precisa alinhar para id_comprador

---

### 3. Marketing/Campanhas

| Tabela | Registros | Campo Atual | Status | Ação |
|--------|-----------|-------------|--------|------|
| campaigns | 9 | user_id (UUID) | ATIVA | ✅ OK (usa user_id para auth) |
| campaign_intelligence | 0 | - | VAZIA | Manter (analytics de campanhas) |
| leads | 0 | user_id (UUID) | VAZIA | ✅ OK (usa user_id para auth) |
| marketing_links | 0 | distributor_id (UUID) | VAZIA | ⚠️ PRECISA ALINHAR |

**Status**: ⚠️ marketing_links precisa alinhar para id_comprador

---

### 4. Analytics/ML

| Tabela | Registros | Campo Atual | Status | Ação |
|--------|-----------|-------------|--------|------|
| customer_events | 0 | customer_id (UUID) | VAZIA | ⚠️ PRECISA ALINHAR |
| customer_predictions | 0 | customer_id (UUID) | VAZIA | ⚠️ PRECISA ALINHAR |
| upgrade_suggestions | 0 | - | VAZIA | Manter (sugestões genéricas) |

**Status**: ⚠️ customer_events e customer_predictions precisam alinhar para id_comprador

---

## Tabelas que Precisam de Alinhamento

### 1. customer_embeddings

**Campo Atual**: customer_id (UUID)  
**Campo Alvo**: id_comprador (TEXT)  
**Registros**: 0 (vazia)  
**Prioridade**: ALTA (RAG/LLM)

**Ação**:
- Adicionar coluna id_comprador
- Remover coluna customer_id
- Adicionar foreign key para customers.id_comprador

---

### 2. marketing_links

**Campo Atual**: distributor_id (UUID)  
**Campo Alvo**: id_comprador (TEXT)  
**Registros**: 0 (vazia)  
**Prioridade**: MÉDIA (Marketing)

**Ação**:
- Adicionar coluna id_comprador
- Remover coluna distributor_id
- Adicionar foreign key para customers.id_comprador

---

### 3. customer_events

**Campo Atual**: customer_id (UUID)  
**Campo Alvo**: id_comprador (TEXT)  
**Registros**: 0 (vazia)  
**Prioridade**: ALTA (Analytics)

**Ação**:
- Adicionar coluna id_comprador
- Remover coluna customer_id
- Adicionar foreign key para customers.id_comprador

---

### 4. customer_predictions

**Campo Atual**: customer_id (UUID)  
**Campo Alvo**: id_comprador (TEXT)  
**Registros**: 0 (vazia)  
**Prioridade**: MÉDIA (ML)

**Ação**:
- Adicionar coluna id_comprador
- Remover coluna customer_id
- Adicionar foreign key para customers.id_comprador

---

## Plano de Migração

### FASE 1: Adicionar colunas id_comprador

```sql
-- customer_embeddings
ALTER TABLE customer_embeddings ADD COLUMN id_comprador TEXT;

-- marketing_links
ALTER TABLE marketing_links ADD COLUMN id_comprador TEXT;

-- customer_events
ALTER TABLE customer_events ADD COLUMN id_comprador TEXT;

-- customer_predictions
ALTER TABLE customer_predictions ADD COLUMN id_comprador TEXT;
```

### FASE 2: Remover colunas antigas

```sql
-- customer_embeddings
ALTER TABLE customer_embeddings DROP COLUMN customer_id;

-- marketing_links
ALTER TABLE marketing_links DROP COLUMN distributor_id;

-- customer_events
ALTER TABLE customer_events DROP COLUMN customer_id;

-- customer_predictions
ALTER TABLE customer_predictions DROP COLUMN customer_id;
```

### FASE 3: Adicionar Foreign Keys

```sql
-- customer_embeddings
ALTER TABLE customer_embeddings ADD CONSTRAINT customer_embeddings_id_comprador_fkey 
    FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador) ON DELETE CASCADE;

-- marketing_links
ALTER TABLE marketing_links ADD CONSTRAINT marketing_links_id_comprador_fkey 
    FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador) ON DELETE CASCADE;

-- customer_events
ALTER TABLE customer_events ADD CONSTRAINT customer_events_id_comprador_fkey 
    FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador) ON DELETE CASCADE;

-- customer_predictions
ALTER TABLE customer_predictions ADD CONSTRAINT customer_predictions_id_comprador_fkey 
    FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador) ON DELETE CASCADE;
```

---

## Tabelas que NÃO Precisam de Alteração

### Chat/Integração
- chatwoot_conversations (usa user_id correto para auth)
- chatwoot_messages (usa user_id correto para auth)
- integrations (configuração de sistema, sem customer)

### LLM/Embeddings
- document_embeddings (usa document_id, correto)
- product_embeddings (usa product_id, correto)

### Marketing/Campanhas
- campaigns (usa user_id correto para auth)
- campaign_intelligence (analytics de campanhas, sem customer)
- leads (usa user_id correto para auth)

### Analytics/ML
- upgrade_suggestions (sugestões genéricas, sem customer)

---

## Próximos Passos

1. ✅ Análise completa de tabelas
2. ⏳ Aplicar migração de alinhamento
3. ⏳ Validar alinhamento completo
4. ⏳ Gerar relatório final de alinhamento total

---

**Status**: EM ANDAMENTO  
**Próxima Etapa**: Aplicar migração de alinhamento
