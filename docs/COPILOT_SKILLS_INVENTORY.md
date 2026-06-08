# COPILOT SKILLS INVENTORY

**Data:** 7 de Junho de 2026  
**Projeto:** AllIn-OS2  
**Objetivo:** Criar inventário real de skills SQL e Analytics para Copilot

---

# RESUMO EXECUTIVO

**Status:** ⚠️ PARCIALMENTE PREPARADO

Skills SQL existem mas estão limitadas pela qualidade dos dados. Skills Analytics estão bloqueadas por dados estagnados.

---

# SKILLS SQL

## Customer360 Skills

### 1. customer.summary

**SQL:**
```sql
SELECT * FROM customer_360_view WHERE customer_id = :customer_id
```

**Status:** ⚠️ PARCIAL
- **Bloqueio:** customer_360_view referencia customers (28 registros) em vez de customers_backup (1,631 registros)
- **Dados:** Incompletos devido ao scrape em andamento
- **Correção Necessária:** Atualizar view para referenciar customers_backup ou aguardar scrape completo

### 2. customer.search

**SQL:**
```sql
SELECT * FROM customers WHERE nome ILIKE :query OR email ILIKE :query OR cpf ILIKE :query LIMIT 20
```

**Status:** ⚠️ PARCIAL
- **Bloqueio:** Apenas 28 registros vs 1,631 reais
- **Dados:** Incompletos devido ao scrape em andamento
- **Correção Necessária:** Aguardar scrape completo

### 3. customer.metrics

**SQL:**
```sql
SELECT * FROM customer_metrics WHERE customer_id = :customer_id
```

**Status:** ⚠️ PARCIAL
- **Bloqueio:** Referencia customers_backup (1,631) mas dados estagnados desde 2026-05-17
- **Dados:** Estagnados há 3 semanas
- **Correção Necessária:** Implementar pipeline de atualização automática

### 4. customer.scores

**SQL:**
```sql
SELECT * FROM customer_scores WHERE customer_id = :customer_id
```

**Status:** ⚠️ PARCIAL
- **Bloqueio:** Referencia customers_backup (1,631) mas dados estagnados desde 2026-05-17
- **Dados:** Estagnados há 3 semanas
- **Correção Necessária:** Implementar pipeline de atualização automática

## Financial Skills

### 5. wallet.balance

**SQL:**
```sql
SELECT * FROM wallets WHERE customer_id = :customer_id
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Todas as carteiras têm saldo zero (1,631 registros)
- **Dados:** Vazios/Incorretos
- **Correção Necessária:** Criar tabela transactions, conciliar payments, atualizar saldos

### 6. wallet.transactions

**SQL:**
```sql
SELECT * FROM wallet_transactions WHERE wallet_id = :wallet_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Tabela wallet_transactions não existe
- **Dados:** Ausente
- **Correção Necessária:** Criar tabela wallet_transactions

### 7. bonus.balance

**SQL:**
```sql
SELECT * FROM bonus_wallets WHERE customer_id = :customer_id
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** 1,630 de 1,631 carteiras têm saldo zero
- **Dados:** Quase vazios
- **Correção Necessária:** Implementar cálculo de bônus

### 8. bonus.transactions

**SQL:**
```sql
SELECT * FROM bonus_transactions WHERE bonus_wallet_id = :wallet_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Tabela bonus_transactions não existe
- **Dados:** Ausente
- **Correção Necessária:** Criar tabela bonus_transactions

### 9. payments.history

**SQL:**
```sql
SELECT * FROM payments WHERE customer_id = :customer_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ✅ PRONTO
- **Dados:** 43,717 registros
- **Qualidade:** Excelente (98.3% COMPLETED)
- **Observação:** Referencia customers_backup, não scrape

## Orders Skills

### 10. orders.list

**SQL:**
```sql
SELECT * FROM orders WHERE customer_id = :customer_id ORDER BY created_at DESC LIMIT 50
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Apenas 21 orders vs 22,195 reais
- **Dados:** Incompletos
- **Correção Necessária:** Aguardar scrape completo ou restaurar orders_backup

### 11. orders.details

**SQL:**
```sql
SELECT o.*, oi.* FROM orders o LEFT JOIN order_items oi ON oi.order_id::text = o.id::text WHERE o.id = :order_id
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Type mismatch (orders.id UUID vs order_items.order_id TEXT)
- **Dados:** Join falha
- **Correção Necessária:** Converter order_items.order_id para UUID

### 12. orders.summary

**SQL:**
```sql
SELECT COUNT(*) as total_orders, SUM(valor_total) as total_spent FROM orders WHERE customer_id = :customer_id
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Apenas 21 orders vs 22,195 reais
- **Dados:** Incompletos
- **Correção Necessária:** Aguardar scrape completo

## Network Skills

### 13. network.tree

**SQL:**
```sql
SELECT * FROM network_tree_view WHERE customer_id = :customer_id
```

**Status:** ⚠️ PARCIAL
- **Bloqueio:** Referencia customers_backup (1,631)
- **Dados:** Funcional mas não atualizado com scrape
- **Correção Necessária:** Atualizar view para referenciar customers ou aguardar scrape

### 14. network.downlines

**SQL:**
```sql
SELECT * FROM network_relationships WHERE sponsor_id = :customer_id
```

**Status:** ⚠️ PARCIAL
- **Bloqueio:** Referencia customers_backup (1,631)
- **Dados:** Funcional mas não atualizado com scrape
- **Correção Necessária:** Atualizar para referenciar customers ou aguardar scrape

### 15. network.metrics

**SQL:**
```sql
SELECT * FROM customer_network_metrics WHERE customer_id = :customer_id
```

**Status:** ⚠️ PARCIAL
- **Bloqueio:** Referencia customers_backup (1,631)
- **Dados:** Funcional mas não atualizado com scrape
- **Correção Necessária:** Atualizar para referenciar customers ou aguardar scrape

---

# SKILLS ANALYTICS

## Executive Analytics

### 16. executive.revenue

**SQL:**
```sql
SELECT SUM(amount) as total_revenue FROM payments WHERE status = 'COMPLETED'
```

**Status:** ✅ PRONTO
- **Dados:** 43,717 pagamentos
- **Qualidade:** Excelente

### 17. executive.orders

**SQL:**
```sql
SELECT COUNT(*) as total_orders, AVG(valor_total) as avg_order_value FROM orders
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Apenas 21 orders vs 22,195 reais
- **Dados:** Incompletos
- **Correção Necessária:** Aguardar scrape completo

### 18. executive.customers

**SQL:**
```sql
SELECT COUNT(*) as total_customers, COUNT(DISTINCT plan_id) as active_plans FROM customers
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Apenas 28 customers vs 1,631 reais
- **Dados:** Incompletos
- **Correção Necessária:** Aguardar scrape completo

## Sales Analytics

### 19. sales.daily

**SQL:**
```sql
SELECT DATE(created_at) as date, SUM(amount) as revenue, COUNT(*) as orders FROM payments WHERE status = 'COMPLETED' GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30
```

**Status:** ✅ PRONTO
- **Dados:** 43,717 pagamentos
- **Qualidade:** Excelente

### 20. sales.by_product

**SQL:**
```sql
SELECT product_id, product_name, SUM(quantity) as total_sold, SUM(total_price) as revenue FROM order_items GROUP BY product_id, product_name ORDER BY revenue DESC
```

**Status:** ❌ BLOQUEADO
- **Bloqueio:** Type mismatch (orders.id UUID vs order_items.order_id TEXT)
- **Dados:** Join falha
- **Correção Necessária:** Converter order_items.order_id para UUID

---

# CLASSIFICAÇÃO DE SKILLS

## PRONTO (Pode ser usado hoje)

| Skill | Categoria | Observação |
|-------|-----------|------------|
| payments.history | Financial | ✅ Dados completos |
| executive.revenue | Analytics | ✅ Dados completos |
| sales.daily | Analytics | ✅ Dados completos |

## PARCIAL (Pode ser usado com limitações)

| Skill | Categoria | Bloqueio | Correção |
|-------|-----------|---------|----------|
| customer.summary | Customer360 | Dados incompletos | Aguardar scrape |
| customer.search | Customer360 | Dados incompletos | Aguardar scrape |
| customer.metrics | Customer360 | Dados estagnados | Pipeline automático |
| customer.scores | Customer360 | Dados estagnados | Pipeline automático |
| network.tree | Network | Dados não atualizados | Aguardar scrape |
| network.downlines | Network | Dados não atualizados | Aguardar scrape |
| network.metrics | Network | Dados não atualizados | Aguardar scrape |

## BLOQUEADO (Não pode ser usado hoje)

| Skill | Categoria | Bloqueio | Correção |
|-------|-----------|---------|----------|
| wallet.balance | Financial | Saldo zero | Criar transactions |
| wallet.transactions | Financial | Tabela ausente | Criar tabela |
| bonus.balance | Financial | Saldo zero | Implementar cálculo |
| bonus.transactions | Financial | Tabela ausente | Criar tabela |
| orders.list | Orders | Dados incompletos | Aguardar scrape |
| orders.details | Orders | Type mismatch | Converter UUID |
| orders.summary | Orders | Dados incompletos | Aguardar scrape |
| executive.orders | Analytics | Dados incompletos | Aguardar scrape |
| executive.customers | Analytics | Dados incompletos | Aguardar scrape |
| sales.by_product | Analytics | Type mismatch | Converter UUID |

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Skills Prontos | 3/20 | 15% |
| Skills Parciais | 6/20 | 30% |
| Skills Bloqueados | 11/20 | 55% |
| **Copilot Skills Readiness** | **2.5/10** | **❌ Crítico** |

---

# CONCLUSÃO

O Copilot tem **apenas 15% das skills prontas para uso imediato**. A maioria das skills está bloqueada por problemas de qualidade de dados (scrape incompleto, type mismatch, saldos zero, tabelas ausentes).

**Recomendação Imediata:**
1. Priorizar skills PRONTOS para uso inicial
2. Corrigir type mismatch (order_items.order_id)
3. Criar tabelas ausentes (transactions)
4. Implementar pipeline de atualização de analytics
5. Aguardar scrape completo para customer/orders skills

**Após correções, o Copilot estará pronto para:**
- Consultas de pagamentos
- Análises de receita
- Consultas de customers completas
- Consultas de orders completas
- Consultas de carteiras funcionais

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
