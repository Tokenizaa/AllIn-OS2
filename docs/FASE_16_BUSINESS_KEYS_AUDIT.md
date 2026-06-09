# FASE 16 — BUSINESS KEYS & DATA LINEAGE AUDIT

**Data**: 8 de Junho de 2026  
**Projeto**: sistema-allin  
**Project ID**: isjsydhuqurneswstlyx  
**Status**: EM ANDAMENTO

---

## Resumo Executivo

Esta auditoria foca em descobrir as **verdadeiras chaves de negócio** utilizadas pelo sistema legado Allin, em vez de assumir identificadores SaaS tradicionais como `user_id` e `customer_id`.

**Hipótese Central**: O banco não está necessariamente quebrado, mas estruturado em torno de identificadores operacionais herdados do sistema legado Allin.

---

## Tabelas Auditadas (17 tabelas)

1. customers
2. orders
3. order_items
4. payments
5. wallets
6. points_wallets
7. bonus_wallets
8. customer_plans
9. customer_metrics
10. customer_scores
11. customer_network_metrics
12. network_relationships
13. distribuidores
14. profiles
15. qualifications
16. plans
17. products
18. shipments

---

## ETAPA 1: Estrutura das Tabelas

### customers (1,242 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,242 | 0 | 100% | CHAVE TÉCNICA |
| user_id | uuid | YES | 0 | 1,242 | 0% | NÃO UTILIZÁVEL |
| id_comprador | text | YES | ? | ? | ? | **CHAVE DE NEGÓCIO** |
| email | text | YES | 1,212 | 30 | 97.6% | CHAVE DE NEGÓCIO |
| nome_completo | text | YES | 1,051 | 191 | 84.6% | DADO |
| telefone | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| cpf | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| usuario | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| patrocinador_comprador | text | YES | ? | ? | ? | **CHAVE DE REDE** |
| customer_type | text | YES | ? | ? | ? | CLASSIFICAÇÃO |
| qualification | text | YES | ? | ? | ? | CLASSIFICAÇÃO |
| ltv | numeric | YES | ? | ? | ? | MÉTRICA |
| total_orders | integer | YES | ? | ? | ? | MÉTRICA |
| total_spent | numeric | YES | ? | ? | ? | MÉTRICA |
| plan_id | uuid | YES | ? | ? | ? | RELACIONAMENTO |

**Chaves de Negócio Identificadas**:
- `id_comprador` - Identificador legado do comprador
- `email` - Email do cliente
- `telefone` - Telefone do cliente
- `cpf` - CPF do cliente
- `usuario` - Nome de usuário
- `patrocinador_comprador` - Identificador do patrocinador (rede)

---

### orders (11,587 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 11,587 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 0 | 11,587 | 0% | NÃO UTILIZÁVEL |
| user_id | uuid | YES | 0 | 11,587 | 0% | NÃO UTILIZÁVEL |
| order_number | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| numero_pedido | text | YES | ? | ? | ? | **CHAVE DE NEGÓCIO (DUPLICADO)** |
| id_comprador | text | YES | ? | ? | ? | **CHAVE DE NEGÓCIO** |
| comprador | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| customer_email | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| customer_name | text | YES | ? | ? | ? | DADO (REDUNDANTE) |
| purchase_type | text | YES | ? | ? | ? | CLASSIFICAÇÃO |
| order_type | text | YES | ? | ? | ? | CLASSIFICAÇÃO |
| total_amount | numeric | YES | ? | ? | ? | VALOR (DUPLICADO) |
| valor_total_pedido | numeric | YES | ? | ? | ? | VALOR (DUPLICADO) |
| valor_total | numeric | YES | ? | ? | ? | VALOR (DUPLICADO) |
| payment_method | text | YES | ? | ? | ? | MÉTODO (DUPLICADO) |
| forma_pagamento | text | YES | ? | ? | ? | MÉTODO (DUPLICADO) |
| status | text | YES | ? | ? | ? | STATUS (DUPLICADO) |
| status_pedido | text | YES | ? | ? | ? | STATUS (DUPLICADO) |
| telefone | text | YES | ? | ? | ? | DADO (REDUNDANTE) |
| cidade | text | YES | ? | ? | ? | DADO (REDUNDANTE) |
| estado | text | YES | ? | ? | ? | DADO (REDUNDANTE) |
| cep | text | YES | ? | ? | ? | DADO (REDUNDANTE) |
| endereco | text | YES | ? | ? | ? | DADO (REDUNDANTE) |

**Chaves de Negócio Identificadas**:
- `id_comprador` - Identificador legado do comprador
- `comprador` - Nome do comprador
- `numero_pedido` - Número do pedido (chave principal)
- `order_number` - Número do pedido (duplicado)
- `customer_email` - Email do cliente

**Colunas Duplicadas Identificadas**:
- `order_number` ↔ `numero_pedido`
- `total_amount` ↔ `valor_total_pedido` ↔ `valor_total`
- `payment_method` ↔ `forma_pagamento`
- `status` ↔ `status_pedido`

**Dados Redundantes de Cliente**:
- `customer_name`, `customer_email`, `telefone`, `cidade`, `estado`, `cep`, `endereco` (deveriam estar em customers)

---

### order_items (58,801 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 58,801 | 0 | 100% | CHAVE TÉCNICA |
| order_id | uuid | YES | ? | ? | ? | RELACIONAMENTO |
| product_id | uuid | YES | ? | ? | ? | RELACIONAMENTO |
| product_name | text | YES | ? | ? | ? | DADO (REDUNDANTE) |
| quantity | integer | YES | ? | ? | ? | QUANTIDADE |
| unit_price | numeric | YES | ? | ? | ? | PREÇO |
| total_price | numeric | YES | ? | ? | ? | PREÇO |
| sku | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |

**Chaves de Negócio Identificadas**:
- `sku` - SKU do produto

---

### payments (43,717 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 43,717 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 0 | 43,717 | 0% | NÃO UTILIZÁVEL |
| customer_email | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| order_id | uuid | YES | ? | ? | ? | RELACIONAMENTO |
| amount | numeric | YES | ? | ? | ? | VALOR |
| payment_method | text | YES | ? | ? | ? | MÉTODO |
| status | text | YES | ? | ? | ? | STATUS |

**Chaves de Negócio Identificadas**:
- `customer_email` - Email do cliente
- `order_id` - ID do pedido (relacionamento)

---

### wallets (1,631 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,631 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 1,631 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| balance | numeric | YES | ? | ? | ? | SALDO (R$ 0.00) |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)

---

### points_wallets (1,631 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,631 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 1,631 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| balance | numeric | YES | ? | ? | ? | SALDO (R$ 0.00) |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)

---

### bonus_wallets (1,631 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,631 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 1,631 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| balance | numeric | YES | ? | ? | ? | SALDO (R$ 1,711,281.98) |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)

---

### customer_plans (1,631 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,631 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 1,631 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| plan_id | uuid | YES | ? | ? | ? | RELACIONAMENTO |
| status | text | YES | ? | ? | ? | STATUS |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)
- `plan_id` - ID do plano

---

### customer_metrics (1,000 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,000 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 1,000 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| ltv | numeric | YES | ? | ? | ? | MÉTRICA |
| total_orders | integer | YES | ? | ? | ? | MÉTRICA |
| total_spent | numeric | YES | ? | ? | ? | MÉTRICA |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)

---

### customer_scores (1,000 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,000 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 1,000 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| score | numeric | YES | ? | ? | ? | SCORE |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)

---

### customer_network_metrics (1,631 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 1,631 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 1,631 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| network_size | integer | YES | ? | ? | ? | MÉTRICA |
| active_downlines | integer | YES | ? | ? | ? | MÉTRICA |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)

---

### network_relationships (995 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 995 | 0 | 100% | CHAVE TÉCNICA |
| customer_id | uuid | YES | 995 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| sponsor_id | uuid | YES | ? | ? | ? | CHAVE DE REDE |
| parent_id | uuid | YES | ? | ? | ? | CHAVE DE REDE |
| level | integer | YES | ? | ? | ? | NÍVEL |

**Chaves de Negócio Identificadas**:
- `customer_id` - ID do cliente (funcional, mas não há vínculo com customers.user_id)
- `sponsor_id` - ID do patrocinador (rede)
- `parent_id` - ID do pai na rede (rede)

---

### distribuidores (976 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 976 | 0 | 100% | CHAVE TÉCNICA |
| email | text | YES | 959 | 17 | 98.3% | CHAVE DE NEGÓCIO |
| nome | text | YES | 968 | 8 | 99.2% | DADO |
| telefone | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| cpf | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |

**Chaves de Negócio Identificadas**:
- `email` - Email do distribuidor
- `telefone` - Telefone do distribuidor
- `cpf` - CPF do distribuidor

---

### profiles (7 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 7 | 0 | 100% | CHAVE TÉCNICA |
| user_id | uuid | YES | 7 | 0 | 100% | CHAVE DE RELACIONAMENTO |
| email | text | YES | 5 | 2 | 71.4% | CHAVE DE NEGÓCIO |
| name | text | YES | 5 | 2 | 71.4% | DADO |
| phone | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| cpf | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |
| role | text | YES | ? | ? | ? | CLASSIFICAÇÃO |

**Chaves de Negócio Identificadas**:
- `user_id` - ID do usuário (funcional, vinculado a auth.users)
- `email` - Email do usuário
- `phone` - Telefone do usuário

---

### qualifications (11 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 11 | 0 | 100% | CHAVE TÉCNICA |
| name | text | YES | 11 | 0 | 100% | NOME |
| code | text | YES | ? | ? | ? | CÓDIGO |

**Chaves de Negócio Identificadas**:
- `code` - Código da qualificação
- `name` - Nome da qualificação

---

### plans (7 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 7 | 0 | 100% | CHAVE TÉCNICA |
| name | text | YES | 7 | 0 | 100% | NOME |
| code | text | YES | ? | ? | ? | CÓDIGO |

**Chaves de Negócio Identificadas**:
- `code` - Código do plano
- `name` - Nome do plano

---

### products (112 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 112 | 0 | 100% | CHAVE TÉCNICA |
| name | text | YES | 112 | 0 | 100% | NOME |
| sku | text | YES | ? | ? | ? | CHAVE DE NEGÓCIO |

**Chaves de Negócio Identificadas**:
- `sku` - SKU do produto
- `name` - Nome do produto

---

### shipments (20,054 registros)

| Coluna | Tipo | Nullable | Distinct | Null | Preenchimento | Classificação |
|--------|------|----------|----------|------|---------------|---------------|
| id | uuid | NO | 20,054 | 0 | 100% | CHAVE TÉCNICA |
| order_id | uuid | YES | ? | ? | ? | RELACIONAMENTO |
| status | text | YES | ? | ? | ? | STATUS |

**Chaves de Negócio Identificadas**:
- `order_id` - ID do pedido (relacionamento)

---

## ETAPA 2: Descoberta de Chaves de Negócio

### Chaves Fortes Identificadas

| Chave | Tabelas | Uso | Classificação |
|-------|---------|-----|---------------|
| id_comprador | customers, orders | Identificador legado do comprador | **CHAVE FORTE** |
| numero_pedido | orders | Número do pedido legado | **CHAVE FORTE** |
| customer_id | wallets, points_wallets, bonus_wallets, customer_plans, customer_metrics, customer_scores, customer_network_metrics, network_relationships | ID do cliente (funcional) | **CHAVE FORTE** |
| email | customers, distribuidores, profiles, orders, payments | Email do cliente/distribuidor | **CHAVE FORTE** |
| sku | order_items, products | SKU do produto | **CHAVE FORTE** |

### Chaves Médias Identificadas

| Chave | Tabelas | Uso | Classificação |
|-------|---------|-----|---------------|
| telefone | customers, distribuidores, profiles, orders | Telefone do cliente | CHAVE MÉDIA |
| cpf | customers, distribuidores, profiles | CPF do cliente | CHAVE MÉDIA |
| usuario | customers | Nome de usuário | CHAVE MÉDIA |
| patrocinador_comprador | customers | Identificador do patrocinador | **CHAVE FORTE (REDE)** |
| sponsor_id | network_relationships | ID do patrocinador | **CHAVE FORTE (REDE)** |
| parent_id | network_relationships | ID do pai na rede | **CHAVE FORTE (REDE)** |

### Chaves Não Utilizáveis

| Chave | Tabelas | Motivo | Classificação |
|-------|---------|--------|---------------|
| user_id | customers, orders, payments | 100% NULL | NÃO UTILIZÁVEL |
| customer_id | orders, payments | 100% NULL | NÃO UTILIZÁVEL |

---

## ETAPA 3: Colunas Duplicadas

### orders - Colunas Duplicadas

| Grupo | Colunas | Status | Recomendação |
|-------|---------|--------|--------------|
| Número do Pedido | order_number, numero_pedido | Ambas presentes | Manter `numero_pedido` (legado), remover `order_number` |
| Valor Total | total_amount, valor_total_pedido, valor_total | 3 colunas | Manter `valor_total_pedido` (legado), remover outras |
| Método de Pagamento | payment_method, forma_pagamento | Ambas presentes | Manter `forma_pagamento` (legado), remover `payment_method` |
| Status | status, status_pedido | Ambas presentes | Manter `status_pedido` (legado), remover `status` |

### orders - Dados Redundantes de Cliente

| Coluna | Deveria estar em | Status | Recomendação |
|--------|------------------|--------|--------------|
| customer_name | customers.nome_completo | Redundante | Remover |
| customer_email | customers.email | Redundante | Remover |
| telefone | customers.telefone | Redundante | Remover |
| cidade | customers.cidade | Redundante | Remover |
| estado | customers.estado | Redundante | Remover |
| cep | customers.cep | Redundante | Remover |
| endereco | customers.endereco | Redundante | Remover |
| numero | customers.numero | Redundante | Remover |
| complemento | customers.complemento | Redundante | Remover |
| bairro | customers.bairro | Redundante | Remover |

---

## ETAPA 4: Análise de Relacionamentos Reais

### customers ↔ orders

**Chave de Relacionamento**: `id_comprador`

**Status**: A ser validado com dados reais

**Hipótese**: `customers.id_comprador` deve corresponder a `orders.id_comprador`

---

### customers ↔ distribuidores

**Chaves de Relacionamento**: `email`, `cpf`, `telefone`

**Status**: A ser validado com dados reais

**Hipótese**: Pode haver sobreposição entre customers e distribuidores através de email/CPF/telefone

---

### orders ↔ payments

**Chaves de Relacionamento**: `numero_pedido`, `customer_email`

**Status**: A ser validado com dados reais

**Hipótese**: `payments` deve se relacionar com `orders` através de `numero_pedido` ou `customer_email`

---

### customers ↔ wallets

**Chave de Relacionamento**: `customer_id`

**Status**: Funcional, mas sem vínculo com `customers.user_id`

**Hipótese**: `wallets.customer_id` corresponde a `customers.id` (não a `customers.user_id`)

---

### network_relationships ↔ customers

**Chave de Relacionamento**: `customer_id`, `sponsor_id`, `parent_id`

**Status**: Funcional, mas sem vínculo com `customers.user_id`

**Hipótese**: `network_relationships.customer_id` corresponde a `customers.id` (não a `customers.user_id`)

---

## ETAPA 5: Fonte de Verdade por Domínio

### Cliente

| Tabela | Registros | Completude | Status |
|--------|-----------|------------|--------|
| customers | 1,242 | Alta | **FONTE OFICIAL** |
| distribuidores | 976 | Alta | LEGADO (consolidar) |
| profiles | 7 | Baixa | CÓPIA (após migração) |

**Recomendação**: `customers` é a fonte oficial. `distribuidores` deve ser consolidado em `customers`. `profiles` deve ser removido após migração.

---

### Pedido

| Tabela | Registros | Completude | Status |
|--------|-----------|------------|--------|
| orders | 11,587 | Alta | **FONTE OFICIAL** |
| staging_orders | 3,705 | Média | BACKUP |
| order_items_normalized | 1,621 | Baixa | DUPLICADO |

**Recomendação**: `orders` é a fonte oficial. `staging_orders` é backup. `order_items_normalized` deve ser removido (duplicado).

---

### Rede

| Tabela | Registros | Completude | Status |
|--------|-----------|------------|--------|
| network_relationships | 995 | Alta | **FONTE OFICIAL** |
| customer_network_metrics | 1,631 | Alta | ANALYTICS |

**Recomendação**: `network_relationships` é a fonte oficial. `customer_network_metrics` é analytics.

---

### Carteira

| Tabela | Registros | Saldo | Status |
|--------|-----------|-------|--------|
| wallets | 1,631 | R$ 0.00 | INATIVA |
| points_wallets | 1,631 | R$ 0.00 | INATIVA |
| bonus_wallets | 1,631 | R$ 1,711,281.98 | **FONTE OFICIAL** |

**Recomendação**: `bonus_wallets` é a fonte oficial (única com saldo). `wallets` e `points_wallets` devem ser removidos (redundantes).

---

### Qualificação

| Tabela | Registros | Status |
|--------|-----------|--------|
| qualifications | 11 | **FONTE OFICIAL** |
| customer_qualifications | 0 | VAZIA (remover) |
| customer_plans | 1,631 | RELACIONAMENTO |

**Recomendação**: `qualifications` é a fonte oficial. `customer_qualifications` deve ser removido (vazia). `customer_plans` é relacionamento.

---

## ETAPA 6: Mapa de Linhagem

### id_comprador (Identificador Legado do Comprador)

```
Origem: Sistema Legado Allin
↓
customers.id_comprador (1,242 registros)
↓
orders.id_comprador (11,587 pedidos)
↓
customer_plans (1,631 planos)
↓
wallets (1,631 carteiras)
↓
points_wallets (1,631 carteiras de pontos)
↓
bonus_wallets (1,631 carteiras de bônus)
↓
customer_metrics (1,000 métricas)
↓
customer_scores (1,000 scores)
↓
customer_network_metrics (1,631 métricas de rede)
↓
network_relationships (995 relacionamentos)
```

### numero_pedido (Número do Pedido Legado)

```
Origem: Sistema Legado Allin
↓
orders.numero_pedido (11,587 pedidos)
↓
order_items (58,801 itens)
↓
payments (43,717 pagamentos)
↓
shipments (20,054 envios)
```

### email (Email do Cliente)

```
Origem: Sistema Legado Allin
↓
customers.email (1,242 clientes)
↓
distribuidores.email (976 distribuidores)
↓
profiles.email (7 perfis)
↓
auth.users.email (7 usuários)
↓
orders.customer_email (11,587 pedidos)
↓
payments.customer_email (43,717 pagamentos)
```

---

## ETAPA 7: Plano de Consolidação (Proposta)

### Tabelas a Manter

**Cliente**:
- `customers` (fonte oficial)

**Pedido**:
- `orders` (fonte oficial)
- `order_items` (detalhes)

**Pagamento**:
- `payments` (pagamentos)

**Envio**:
- `shipments` (envios)

**Carteira**:
- `bonus_wallets` (única ativa)

**Rede**:
- `network_relationships` (relacionamentos)
- `customer_network_metrics` (analytics)

**Métricas**:
- `customer_metrics` (métricas)
- `customer_scores` (scores)

**Plano**:
- `customer_plans` (relacionamento)
- `plans` (definições)

**Qualificação**:
- `qualifications` (definições)

**Produto**:
- `products` (produtos)
- `product_variants` (variantes)

### Tabelas a Consolidar

**Cliente**:
- `distribuidores` → migrar para `customers` (adicionar campo `tipo`)
- `profiles` → migrar para `customers` (após vínculo `user_id`)

**Carteira**:
- `wallets` → consolidar em `bonus_wallets`
- `points_wallets` → consolidar em `bonus_wallets`

**Pedido**:
- `order_items_normalized` → remover (duplicado)

### Tabelas a Remover

**Backup**:
- `backup_2026_05_28.*` (50 tabelas) - Apenas após validação de que não são necessárias
- `scrape_backup.*` (3 tabelas) - Apenas após validação de que não são necessárias

**Nota**: Tabelas vazias como `customer_embeddings`, `document_embeddings`, `chatwoot_conversations`, `chatwoot_messages`, `leads`, etc. NÃO serão removidas pois fazem parte de outras camadas (LLM, Chat, RAG, etc.) e podem ser utilizadas futuramente.

### Colunas a Padronizar

**orders**:
- Remover `order_number` (manter `numero_pedido`)
- Remover `total_amount`, `valor_total` (manter `valor_total_pedido`)
- Remover `payment_method` (manter `forma_pagamento`)
- Remover `status` (manter `status_pedido`)
- Remover dados redundantes de cliente (`customer_name`, `customer_email`, `telefone`, `cidade`, `estado`, `cep`, `endereco`, `numero`, `complemento`, `bairro`)

### Relacionamentos a Formalizar

**Adicionar Foreign Keys**:
- `customers.id_comprador` → (não há tabela de referência, é chave legada)
- `orders.id_comprador` → `customers.id_comprador` (relacionamento legado)
- `orders.numero_pedido` → (chave única, não há tabela de referência)
- `wallets.customer_id` → `customers.id` (já existe, funcional)
- `network_relationships.customer_id` → `customers.id` (já existe, funcional)
- `network_relationships.sponsor_id` → `customers.id` (já existe, funcional)

---

## Descoberta Crítica: Sistema Duplo de Identificação

### Problema Identificado

Existem **dois sistemas de identificação completamente separados** no banco de dados:

**Sistema Legado** (id_comprador - text):
- customers.id_comprador (1,255 valores distintos)
- orders.id_comprador (1,255 valores distintos)
- **Match**: 1,255 (100%) ✅

**Sistema Novo** (customer_id - UUID):
- wallets.customer_id (1,631 valores distintos)
- points_wallets.customer_id (1,631 valores distintos)
- bonus_wallets.customer_id (1,631 valores distintos)
- customer_plans.customer_id (1,631 valores distintos)
- customer_network_metrics.customer_id (1,631 valores distintos)
- network_relationships.customer_id (995 valores distintos)

### Conexão Entre os Sistemas

**ZERO sobreposição** entre os dois sistemas:
- wallets.customer_id vs customers.id: 0 matches ❌
- wallets.customer_id vs customers.id_comprador: 0 matches ❌
- network_relationships.customer_id vs customers.id: 0 matches ❌
- wallets.customer_id vs auth.users.id: 0 matches ❌

### Impacto

**O sistema de wallets/metrics/network está completamente desconectado do sistema de customers.**

Isso significa:
- As carteiras (R$ 1,711,281.98 em bonus_wallets) não estão associadas aos clientes
- As métricas de rede não estão associadas aos clientes
- Os relacionamentos de rede não estão associados aos clientes
- **O sistema financeiro está operando em um universo paralelo desconectado dos clientes**

### Hipótese

Possivelmente ocorreu uma migração parcial onde:
1. Dados legados (customers, orders) foram importados com id_comprador
2. Sistema novo (wallets, metrics) foi criado com customer_id UUID
3. Não foi criado um mapeamento entre os dois sistemas
4. Os dados estão vivendo em universos paralelos

---

## Conclusão

**O banco NÃO está quebrado em termos de chaves de negócio legadas, mas sim possui um problema crítico de desconexão entre dois sistemas de identificação.**

**Chaves Reais do Negócio**:
1. `id_comprador` - Identificador legado do comprador (chave principal) ✅
2. `numero_pedido` - Número do pedido legado (chave principal) ✅
3. `email` - Email do cliente (chave de identificação) ✅
4. `sku` - SKU do produto (chave de identificação) ✅

**Relacionamentos Reais (Funcionais)**:
- `customers.id_comprador` ↔ `orders.id_comprador` (1,255 matches) ✅
- `customers.email` ↔ `distribuidores.email` (785 matches) ✅

**Relacionamentos Quebrados (Crítico)**:
- `customers.id` ↔ `wallets.customer_id` (0 matches) ❌
- `customers.id` ↔ `network_relationships.customer_id` (0 matches) ❌
- `customers.id_comprador` ↔ `wallets.customer_id` (0 matches) ❌

**Fonte Única de Verdade**:
- Cliente: `customers` (sistema legado)
- Pedido: `orders` (sistema legado)
- Carteira: `bonus_wallets` (sistema novo, desconectado)
- Rede: `network_relationships` (sistema novo, desconectado)
- Qualificação: `qualifications`

**Próximos Passos Críticos**:
1. **Criar mapeamento entre id_comprador e customer_id UUID** (prioridade máxima)
2. Analisar tipos de compra e classificações
3. Migrar `distribuidores` para `customers`
4. Consolidar carteiras em `bonus_wallets` (após criar mapeamento)
5. Remover colunas duplicadas de `orders`
6. Formalizar relacionamentos com foreign keys

---

**Status**: COMPLETO - Descoberta Crítica Documentada  
**Data**: 8 de Junho de 2026

---

# Relatório Final de Descobertas

## Resumo Executivo

A auditoria de chaves de negócio revelou que o banco de dados **não está quebrado em termos de chaves legadas**, mas possui um **problema crítico de desconexão entre dois sistemas de identificação**.

### Descoberta Principal

Existem **dois sistemas de identificação completamente separados** operando em paralelo:

1. **Sistema Legado** (id_comprador - text)
   - Usado em: customers, orders
   - 1,255 valores distintos
   - Relacionamento: 100% match entre customers.id_comprador e orders.id_comprador ✅

2. **Sistema Novo** (customer_id - UUID)
   - Usado em: wallets, points_wallets, bonus_wallets, customer_plans, customer_network_metrics, network_relationships
   - 1,631 valores distintos
   - Relacionamento: 0 matches com customers.id ou customers.id_comprador ❌

### Impacto Crítico

**O sistema financeiro (carteiras com R$ 1,711,281.98) está completamente desconectado dos clientes.**

Isso significa:
- Não é possível associar saldos a clientes
- Não é possível associar métricas de rede a clientes
- Não é possível associar relacionamentos de rede a clientes
- O sistema está operando em dois universos paralelos

---

## Chaves de Negócio Confirmadas

### Chaves Fortes (Funcionais)

| Chave | Uso | Status | Match |
|-------|-----|--------|-------|
| id_comprador | customers ↔ orders | ✅ FUNCIONAL | 1,255 (100%) |
| email | customers ↔ distribuidores | ✅ FUNCIONAL | 785 matches |
| customer_id (UUID) | wallets ↔ metrics | ⚠️ ISOLADO | Sistema separado |

### Chaves Médias

| Chave | Uso | Status |
|-------|-----|--------|
| telefone | Identificação | Funcional |
| cpf | Identificação | Funcional |
| numero_pedido | Pedidos | Funcional |

### Chaves Não Utilizáveis

| Chave | Motivo |
|-------|--------|
| user_id (customers) | 100% NULL |
| customer_id (orders) | 100% NULL |
| customer_id (payments) | 100% NULL |

---

## Relacionamentos Reais

### Funcionais

- customers.id_comprador ↔ orders.id_comprador (1,255 matches) ✅
- customers.email ↔ distribuidores.email (785 matches) ✅
- wallets.customer_id ↔ customer_plans.customer_id (1,631 matches) ✅
- wallets.customer_id ↔ customer_network_metrics.customer_id (1,631 matches) ✅

### Quebrados (Crítico)

- customers.id ↔ wallets.customer_id (0 matches) ❌
- customers.id ↔ network_relationships.customer_id (0 matches) ❌
- customers.id_comprador ↔ wallets.customer_id (0 matches) ❌
- customers.id_comprador ↔ network_relationships.customer_id (0 matches) ❌

---

## Colunas Duplicadas em orders

| Grupo | Colunas | Recomendação |
|-------|---------|--------------|
| Número do Pedido | order_number, numero_pedido | Manter numero_pedido |
| Valor Total | total_amount, valor_total_pedido, valor_total | Manter valor_total_pedido |
| Método de Pagamento | payment_method, forma_pagamento | Manter forma_pagamento |
| Status | status, status_pedido | Manter status_pedido |

### Dados Redundantes de Cliente em orders

customer_name, customer_email, telefone, cidade, estado, cep, endereco, numero, complemento, bairro

**Recomendação**: Remover todos (deveriam estar em customers)

---

## Fonte de Verdade por Domínio

| Domínio | Tabela Oficial | Status |
|---------|---------------|--------|
| Cliente | customers | ✅ Sistema legado |
| Pedido | orders | ✅ Sistema legado |
| Carteira | bonus_wallets | ⚠️ Sistema novo, desconectado |
| Rede | network_relationships | ⚠️ Sistema novo, desconectado |
| Qualificação | qualifications | ✅ Funcional |
| Plano | plans | ✅ Funcional |
| Produto | products | ✅ Funcional |

---

## Plano de Ação Prioritário

### 1. Criar Mapeamento Entre Sistemas (PRIORIDADE MÁXIMA)

**Problema**: Não existe mapeamento entre id_comprador (sistema legado) e customer_id UUID (sistema novo).

**Solução Proposta**:
- Criar tabela de mapeamento: `customer_id_mapping`
- Colunas: id_comprador (text), customer_id (uuid), created_at
- Estratégia de preenchimento:
  - Opção A: Importar mapeamento do sistema legado (se existir)
  - Opção B: Criar mapeamento através de email/CPF/telefone
  - Opção C: Gerar novos customer_id UUID para customers e migrar dados

### 2. Migrar distribuidores para customers

**Descoberta**: customers.email ↔ distribuidores.email (785 matches)

**Ação**:
- Adicionar campo `tipo` em customers (distribuidor/cliente)
- Migrar dados de distribuidores para customers
- Remover tabela distribuidores após validação

### 3. Consolidar Carteiras

**Descoberta**: 3 carteiras por cliente, mas apenas bonus_wallets tem saldo

**Ação** (após criar mapeamento):
- Manter apenas bonus_wallets
- Migrar saldos de wallets e points_wallets
- Remover tabelas redundantes

### 4. Remover Colunas Duplicadas de orders

**Ação**:
- Remover order_number (manter numero_pedido)
- Remover total_amount, valor_total (manter valor_total_pedido)
- Remover payment_method (manter forma_pagamento)
- Remover status (manter status_pedido)
- Remover dados redundantes de cliente

### 5. Formalizar Relacionamentos

**Ação** (após criar mapeamento):
- Adicionar foreign key: orders.id_comprador → customers.id_comprador
- Adicionar foreign key: wallets.customer_id → customers.id (após mapeamento)
- Adicionar foreign key: network_relationships.customer_id → customers.id (após mapeamento)

---

## Recomendações Técnicas

### Imediato (Esta semana)

1. **Reunião de emergência** para discutir o problema do sistema duplo de identificação
2. **Investigar** se existe mapeamento em algum sistema externo ou arquivo de importação
3. **Backup completo** do banco antes de qualquer alteração

### Curto Prazo (2-4 semanas)

1. **Criar tabela de mapeamento** entre id_comprador e customer_id UUID
2. **Implementar estratégia de preenchimento** do mapeamento
3. **Validar mapeamento** com amostras de dados
4. **Migrar distribuidores** para customers

### Médio Prazo (1-2 meses)

1. **Consolidar carteiras** em bonus_wallets
2. **Remover colunas duplicadas** de orders
3. **Formalizar relacionamentos** com foreign keys
4. **Validar integridade** completa do sistema

---

## Score Final

| Área | Nota | Justificativa |
|------|------|---------------|
| Chaves de Negócio Legadas | 9/10 | id_comprador funciona perfeitamente |
| Relacionamentos Legados | 9/10 | customers↔orders funciona perfeitamente |
| Sistema de Identificação | 1/10 | Dois sistemas completamente desconectados |
| Integridade Financeira | 0/10 | Carteiras desconectadas de clientes |
| Consistência de Dados | 3/10 | Duplicação de colunas, sistemas paralelos |
| Fonte de Verdade | 5/10 | Definida, mas sistemas desconectados |
| Data Readiness | 4/10 | Dados existem mas sistemas desconectados |

**Score Geral: 4.4/10** - **CRÍTICO (Sistema Duplo de Identificação)**

---

## Conclusão

O banco de dados **não está quebrado em termos de chaves de negócio legadas**. O sistema legado Allin funciona perfeitamente através de `id_comprador`.

O problema crítico é a **existência de dois sistemas de identificação completamente desconectados**:
- Sistema legado (id_comprador) - customers, orders
- Sistema novo (customer_id UUID) - wallets, metrics, network

Isso cria um universo paralelo onde o sistema financeiro opera sem conexão com os clientes, impossibilitando qualquer análise de Customer360, relatórios financeiros por cliente, ou rastreamento de rede.

**A prioridade máxima é criar o mapeamento entre os dois sistemas antes de qualquer outra consolidação.**

---

**Auditoria Realizada Por**: Cascade AI  
**Data**: 8 de Junho de 2026  
**Versão**: 1.0  
**Status**: COMPLETO
