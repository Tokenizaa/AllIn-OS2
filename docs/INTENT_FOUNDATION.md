# INTENT FOUNDATION

**Data:** 7 de Junho de 2026  
**Projeto:** AllIn-OS2  
**Objetivo:** Mapear intents possíveis e classificar implementabilidade

---

# RESUMO EXECUTIVO

**Status:** ⚠️ PARCIALMENTE PREPARADO

Intents existem mas a maioria está bloqueada por problemas de qualidade de dados. Alguns intents podem ser implementados imediatamente usando dados de pagamentos.

---

# INTENTS MAPEADOS

## Customer360 Intents

### customer.summary

**Descrição:** Obter resumo completo de um cliente

**SQL Requerido:**
```sql
SELECT * FROM customer_360_view WHERE customer_id = :customer_id
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** customer_360_view referencia customers (28) em vez de customers_backup (1,631)
- **Correção:** Atualizar view ou aguardar scrape completo

### customer.search

**Descrição:** Buscar clientes por nome, email ou CPF

**SQL Requerido:**
```sql
SELECT * FROM customers WHERE nome ILIKE :query OR email ILIKE :query OR cpf ILIKE :query LIMIT 20
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** Apenas 28 registros vs 1,631 reais
- **Correção:** Aguardar scrape completo

### customer.metrics

**Descrição:** Obter métricas de um cliente (LTV, ticket médio, etc.)

**SQL Requerido:**
```sql
SELECT * FROM customer_metrics WHERE customer_id = :customer_id
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** Dados estagnados desde 2026-05-17
- **Correção:** Implementar pipeline de atualização automática

### customer.scores

**Descrição:** Obter scores de um cliente (churn, engagement, etc.)

**SQL Requerido:**
```sql
SELECT * FROM customer_scores WHERE customer_id = :customer_id
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** Dados estagnados desde 2026-05-17
- **Correção:** Implementar pipeline de atualização automática

### customer.qualification

**Descrição:** Obter qualificação atual de um cliente

**SQL Requerido:**
```sql
SELECT * FROM customer_qualifications WHERE customer_id = :customer_id AND status = 'active'
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Tabela customer_qualifications não existe
- **Correção:** Criar tabela customer_qualifications

## Financial Intents

### wallet.balance

**Descrição:** Obter saldo da carteira de um cliente

**SQL Requerido:**
```sql
SELECT * FROM wallets WHERE customer_id = :customer_id
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Todas as carteiras têm saldo zero
- **Correção:** Criar transactions, conciliar payments, atualizar saldos

### wallet.history

**Descrição:** Obter histórico de transações da carteira

**SQL Requerido:**
```sql
SELECT * FROM wallet_transactions WHERE wallet_id = :wallet_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Tabela wallet_transactions não existe
- **Correção:** Criar tabela wallet_transactions

### bonus.balance

**Descrição:** Obter saldo da carteira de bônus

**SQL Requerido:**
```sql
SELECT * FROM bonus_wallets WHERE customer_id = :customer_id
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** 1,630 de 1,631 carteiras têm saldo zero
- **Correção:** Implementar cálculo de bônus

### bonus.history

**Descrição:** Obter histórico de bônus

**SQL Requerido:**
```sql
SELECT * FROM bonus_transactions WHERE bonus_wallet_id = :wallet_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Tabela bonus_transactions não existe
- **Correção:** Criar tabela bonus_transactions

### payments.history

**Descrição:** Obter histórico de pagamentos de um cliente

**SQL Requerido:**
```sql
SELECT * FROM payments WHERE customer_id = :customer_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ✅ IMPLEMENTÁVEL HOJE
- **Dados:** 43,717 registros
- **Qualidade:** Excelente (98.3% COMPLETED)

### commissions.summary

**Descrição:** Obter resumo de comissões de um cliente

**SQL Requerido:**
```sql
SELECT SUM(amount) as total_commissions, COUNT(*) as total_commission_payments FROM commissions WHERE customer_id = :customer_id AND status = 'paid'
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Tabela commissions não existe
- **Correção:** Criar tabela commissions

## Orders Intents

### orders.list

**Descrição:** Listar pedidos de um cliente

**SQL Requerido:**
```sql
SELECT * FROM orders WHERE customer_id = :customer_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Apenas 21 orders vs 22,195 reais
- **Correção:** Aguardar scrape completo

### orders.details

**Descrição:** Obter detalhes de um pedido específico

**SQL Requerido:**
```sql
SELECT o.*, oi.* FROM orders o LEFT JOIN order_items oi ON oi.order_id::text = o.id::text WHERE o.id = :order_id
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Type mismatch (UUID vs TEXT)
- **Correção:** Converter order_items.order_id para UUID

### orders.summary

**Descrição:** Obter resumo de pedidos de um cliente

**SQL Requerido:**
```sql
SELECT COUNT(*) as total_orders, SUM(valor_total) as total_spent, AVG(valor_total) as avg_order_value FROM orders WHERE customer_id = :customer_id
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Apenas 21 orders vs 22,195 reais
- **Correção:** Aguardar scrape completo

## Network Intents

### network.tree

**Descrição:** Obter árvore de rede de um cliente

**SQL Requerido:**
```sql
SELECT * FROM network_tree_view WHERE customer_id = :customer_id
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** Referencia customers_backup, não scrape
- **Correção:** Atualizar view ou aguardar scrape

### network.downlines

**Descrição:** Listar downlines diretos de um cliente

**SQL Requerido:**
```sql
SELECT * FROM network_relationships WHERE sponsor_id = :customer_id
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** Referencia customers_backup, não scrape
- **Correção:** Atualizar para referenciar customers ou aguardar scrape

### network.metrics

**Descrição:** Obter métricas de rede de um cliente

**SQL Requerido:**
```sql
SELECT * FROM customer_network_metrics WHERE customer_id = :customer_id
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** Referencia customers_backup, não scrape
- **Correção:** Atualizar para referenciar customers ou aguardar scrape

### network.sponsor

**Descrição:** Obter patrocinador de um cliente

**SQL Requerido:**
```sql
SELECT * FROM customers WHERE id = (SELECT sponsor_id FROM customers WHERE id = :customer_id)
```

**Status:** ⚠️ IMPLEMENTÁVEL APÓS CORREÇÕES
- **Bloqueio:** 0 de 28 customers têm sponsor_id
- **Correção:** Aguardar scrape completo

## Analytics Intents

### analytics.revenue

**Descrição:** Obter receita total

**SQL Requerido:**
```sql
SELECT SUM(amount) as total_revenue FROM payments WHERE status = 'COMPLETED'
```

**Status:** ✅ IMPLEMENTÁVEL HOJE
- **Dados:** 43,717 pagamentos
- **Qualidade:** Excelente

### analytics.revenue_daily

**Descrição:** Obter receita diária

**SQL Requerido:**
```sql
SELECT DATE(created_at) as date, SUM(amount) as revenue FROM payments WHERE status = 'COMPLETED' GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30
```

**Status:** ✅ IMPLEMENTÁVEL HOJE
- **Dados:** 43,717 pagamentos
- **Qualidade:** Excelente

### analytics.orders_count

**Descrição:** Obter contagem de pedidos

**SQL Requerido:**
```sql
SELECT COUNT(*) as total_orders FROM orders
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Apenas 21 orders vs 22,195 reais
- **Correção:** Aguardar scrape completo

### analytics.customers_count

**Descrição:** Obter contagem de clientes

**SQL Requerido:**
```sql
SELECT COUNT(*) as total_customers FROM customers
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Apenas 28 customers vs 1,631 reais
- **Correção:** Aguardar scrape completo

### analytics.top_products

**Descrição:** Obter produtos mais vendidos

**SQL Requerido:**
```sql
SELECT product_id, product_name, SUM(quantity) as total_sold, SUM(total_price) as revenue FROM order_items GROUP BY product_id, product_name ORDER BY revenue DESC LIMIT 10
```

**Status:** ❌ BLOQUEADO POR DADOS
- **Bloqueio:** Type mismatch (UUID vs TEXT)
- **Correção:** Converter order_items.order_id para UUID

---

# CLASSIFICAÇÃO DE INTENTS

## Implementável Hoje

| Intent | Categoria | SQL | Dados | Status |
|--------|-----------|-----|-------|--------|
| payments.history | Financial | ✅ | ✅ 43,717 | ✅ PRONTO |
| analytics.revenue | Analytics | ✅ | ✅ 43,717 | ✅ PRONTO |
| analytics.revenue_daily | Analytics | ✅ | ✅ 43,717 | ✅ PRONTO |

## Implementável Após Correções

| Intent | Categoria | Bloqueio | Correção | Prioridade |
|--------|-----------|---------|----------|------------|
| customer.summary | Customer360 | Dados incompletos | Aguardar scrape | ALTA |
| customer.search | Customer360 | Dados incompletos | Aguardar scrape | ALTA |
| customer.metrics | Customer360 | Dados estagnados | Pipeline automático | ALTA |
| customer.scores | Customer360 | Dados estagnados | Pipeline automático | ALTA |
| network.tree | Network | Dados não atualizados | Aguardar scrape | MÉDIA |
| network.downlines | Network | Dados não atualizados | Aguardar scrape | MÉDIA |
| network.metrics | Network | Dados não atualizados | Aguardar scrape | MÉDIA |
| network.sponsor | Network | Sem sponsor_id | Aguardar scrape | MÉDIA |

## Bloqueado por Dados

| Intent | Categoria | Bloqueio | Correção | Prioridade |
|--------|-----------|---------|----------|------------|
| customer.qualification | Customer360 | Tabela ausente | Criar tabela | CRÍTICA |
| wallet.balance | Financial | Saldo zero | Criar transactions | CRÍTICA |
| wallet.history | Financial | Tabela ausente | Criar tabela | CRÍTICA |
| bonus.balance | Financial | Saldo zero | Implementar cálculo | CRÍTICA |
| bonus.history | Financial | Tabela ausente | Criar tabela | CRÍTICA |
| commissions.summary | Financial | Tabela ausente | Criar tabela | CRÍTICA |
| orders.list | Orders | Dados incompletos | Aguardar scrape | ALTA |
| orders.details | Orders | Type mismatch | Converter UUID | CRÍTICA |
| orders.summary | Orders | Dados incompletos | Aguardar scrape | ALTA |
| analytics.orders_count | Analytics | Dados incompletos | Aguardar scrape | ALTA |
| analytics.customers_count | Analytics | Dados incompletos | Aguardar scrape | ALTA |
| analytics.top_products | Analytics | Type mismatch | Converter UUID | CRÍTICA |

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Intents Implementáveis Hoje | 3/20 | 15% |
| Intents Após Correções | 7/20 | 35% |
| Intents Bloqueados | 10/20 | 50% |
| **Intent Readiness** | **2.5/10** | **❌ Crítico** |

---

# CONCLUSÃO

O Copilot tem **apenas 15% dos intents implementáveis hoje**. A maioria dos intents está bloqueada por problemas de qualidade de dados (scrape incompleto, type mismatch, tabelas ausentes, saldos zero).

**Recomendação Imediata:**
1. Priorizar intents PRONTOS para uso inicial (payments, analytics de receita)
2. Corrigir type mismatch (order_items.order_id)
3. Criar tabelas ausentes (transactions, commissions, customer_qualifications)
4. Implementar pipeline de atualização de analytics
5. Aguardar scrape completo para customer/orders/network intents

**Após correções, o Copilot estará pronto para:**
- Consultas de pagamentos
- Análises de receita
- Consultas de customers completas
- Consultas de orders completas
- Consultas de carteiras funcionais
- Consultas de comissões

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
