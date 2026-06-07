# 🔍 Auditoria do Banco de Dados Atual - Sistema AllIn

**Data:** 6 de Junho de 2026  
**Projeto Supabase:** sistema-allin (isjsydhuqurneswstlyx)  
**Objetivo:** Auditar dados e datas das tabelas profiles, orders e order_items para identificar gaps e inconsistências antes da atualização via scrape

---

## 📊 Resumo Executivo

A auditoria revelou **problemas críticos de integridade e consistência** nos dados migrados:

- **22,195 pedidos** importados, mas **3,209 (14.5%) sem itens**
- **17,810 pedidos (80.2%)** com valores totais inconsistentes
- **1,631 customers** com **100% de emails e CPFs NULL**
- **636 customers (39%)** sem patrocinador definido
- **41,742 order_items** com **total_price NULL em 100% dos registros**

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

| Tabela | Registros | Status |
|--------|-----------|--------|
| profiles | 7 | Dados incompletos |
| customers | 1,631 | Dados críticos faltando |
| orders | 22,195 | Inconsistências graves |
| order_items | 41,742 | Campo total_price NULL |
| payments | - | Não auditada |
| wallets | 1,631 | OK |
| bonus_wallets | 1,631 | OK |
| points_wallets | 1,631 | OK |

---

## 🔴 Problemas Críticos Identificados

### 1. Tabela `profiles` (7 registros)

**Problemas:**
- **2 emails NULL (28.6%)** - Dados de contato incompletos
- **7 telefones NULL (100%)** - Sem dados de telefone
- **7 CPFs NULL (100%)** - Sem dados de identificação
- **0 patrocinadores** - Nenhum sponsor_id preenchido

**Dados de Auditoria:**
```sql
total_records: 7
unique_users: 7
unique_sponsors: 0
earliest_created: 2026-05-16 00:55:40
latest_created: 2026-06-01 13:27:42
null_emails: 2
null_phones: 7
null_cpfs: 7
```

**Impacto:** Alta - Profiles são a base do sistema de autenticação e RBAC

**Ação Necessária:** Atualizar via scrape com dados completos da loja virtual

---

### 2. Tabela `orders` (22,195 registros)

**Problemas:**
- **3,209 orders sem items (14.5%)** - Quebra de integridade referencial
- **17,810 orders com totais inconsistentes (80.2%)** - Valor total ≠ soma dos itens
- **755 orders não pagas (3.4%)** - Pagamento não confirmado
- **1,155 orders sem patrocinador (5.2%)** - Dados de rede incompletos

**Dados de Auditoria:**
```sql
total_records: 22,195
unique_customers: 1,631
unique_distributors: 0
unique_users: 1
earliest_data_criacao: 2020-07-30 00:00:00
latest_data_criacao: 2026-04-18 00:00:00
earliest_imported: 2026-05-16 19:49:29
latest_imported: 2026-05-17 17:24:22
paid_orders: 21,440
unpaid_orders: 755
cancelled_orders: 0
null_patrocinador: 1,155
```

**Inconsistência de Totais:**
```sql
orders_without_items: 3,209
orders_with_inconsistent_totals: 17,810
orders_with_null_dates: 0
```

**Impacto:** Crítica - Orders são a base de cálculos de bônus e comissões

**Ação Necessária:** 
1. Recalcular totais baseado em order_items
2. Investigar orders sem items (podem ser pedidos cancelados ou erro de migração)
3. Atualizar dados de patrocinador via scrape

---

### 3. Tabela `order_items` (41,742 registros)

**Problemas:**
- **41,742 registros com total_price NULL (100%)** - Campo não calculado
- **18,986 orders únicas** vs **22,195 orders** - Gap de 3,209 (confirma orders sem items)
- **88 produtos únicos** - Catálogo de produtos limitado

**Dados de Auditoria:**
```sql
total_records: 41,742
unique_orders: 18,986
unique_products: 88
unique_product_codes: 88
earliest_created: 2026-05-17 00:59:48
latest_created: 2026-05-17 09:19:39
null_quantity: 0
null_unit_price: 0
null_total_price: 41,742 (100%)
null_product_name: 0
null_product_code: 0
total_quantity: 49,862
calculated_total_value: 9,086,020.19
sum_total_price: null
```

**Impacto:** Alta - total_price é necessário para validações e relatórios

**Ação Necessária:** Calcular total_price = unit_price * quantity para todos os registros

---

### 4. Tabela `customers` (1,631 registros)

**Problemas:**
- **1,631 emails NULL (100%)** - Sem dados de contato
- **1,631 CPFs NULL (100%)** - Sem dados de identificação
- **0 user_id preenchidos (100%)** - Sem link com auth.users
- **636 sem patrocinador (39%)** - Quebra de rede MLM
- **635 sem plan_id (38.9%)** - Sem plano definido

**Dados de Auditoria:**
```sql
total_records: 1,631
unique_users: 0
unique_sponsors: 248
unique_patrocinador_comprador: 248
earliest_data_criacao: 2020-07-31 00:00:00
latest_data_criacao: 2026-04-18 00:00:00
null_emails: 1,631 (100%)
null_cpfs: 1,631 (100%)
null_telefones: 1
null_sponsor_id: 636
null_patrocinador_comprador: 636
null_customer_type: 0
null_plan_id: 635
null_or_empty_path: 0
total_pedidos: 22,195
total_valor_compras: 5,250,199.33
```

**Impacto:** Crítica - Customers são a base da rede MLM e cálculos de bônus

**Ação Necessária:** Atualizar via scrape com dados completos da loja virtual

---

## 🔗 Integridade Referencial

### Orders ↔ Order_Items

| Relação | Status | Detalhes |
|---------|--------|----------|
| Orders sem items | ❌ CRÍTICO | 3,209 orders (14.5%) sem itens correspondentes |
| Items sem orders | ✅ OK | 0 items sem order correspondente |
| Totais inconsistentes | ❌ CRÍTICO | 17,810 orders (80.2%) com valor total ≠ soma itens |

### Orders ↔ Customers

| Relação | Status | Detalhes |
|---------|--------|----------|
| Orders sem customers | ✅ OK | 0 orders sem customer correspondente |
| Customers sem orders | ✅ OK | 0 customers sem orders |

### Customers ↔ Network

| Relação | Status | Detalhes |
|---------|--------|----------|
| Customers sem sponsor | ❌ CRÍTICO | 636 customers (39%) sem patrocinador |
| Customers com path null | ✅ OK | 0 customers com path null |

---

## 📅 Análise de Datas

### Período de Dados

| Tabela | Data Mais Antiga | Data Mais Recente | Período |
|--------|------------------|------------------|---------|
| orders (data_criacao) | 2020-07-30 | 2026-04-18 | ~5.7 anos |
| orders (imported_at) | 2026-05-16 | 2026-05-17 | 1 dia |
| customers (data_criacao) | 2020-07-31 | 2026-04-18 | ~5.7 anos |
| customers (created_at) | 2026-05-16 | 2026-05-16 | 1 dia |
| order_items (created_at) | 2026-05-17 | 2026-05-17 | 1 dia |

**Observações:**
- Dados originais cobrem período de ~5.7 anos (2020-2026)
- Migração ocorreu em 1 dia (2026-05-16 a 2026-05-17)
- **GAP CRÍTICO:** Última data de pedido é 2026-04-18, mas hoje é 2026-06-06
- **Gap de ~50 dias** de dados não migrados

### Datas Nulas

| Tabela | Registros com Data NULL |
|--------|------------------------|
| orders | 0 |
| customers | 0 |
| order_items | 0 |

**Status:** ✅ OK - Todas as datas estão preenchidas

---

## 🎯 Plano de Atualização via Scrape

### Fase 1: Preparação

**1.1 Mapeamento de Campos**

Baseado no documento `loja-virtual-pedidos-mapping.md`:

| Campo Loja Virtual | Tabela Supabase | Prioridade |
|-------------------|-----------------|------------|
| Cliente (nome, email, telefone) | customers.email, customers.telefone | CRÍTICA |
| Patrocinador (usuário, nome) | customers.patrocinador_comprador, customers.sponsor_id | CRÍTICA |
| CNPJ/CPF | customers.cpf, customers.metadata.cnpj | CRÍTICA |
| Total pedido | orders.valor_total | CRÍTICA |
| Itens (quantidade, valor) | order_items.quantity, order_items.unit_price | CRÍTICA |
| Data pagamento | orders.data_pagamento | MÉDIA |
| Status pedido | orders.status_pedido | MÉDIA |

**1.2 Estratégia de Scrape**

```python
# Estrutura do Crawler
class LojaVirtualCrawler:
    def __init__(self):
        self.base_url = "https://allinbrasil.com.br/loja/admin"
        self.credentials = ("juniorind", "allin2025")
        self.session_token = None
    
    def login(self):
        """Autenticar na loja virtual"""
        pass
    
    def extract_orders(self, start_date, end_date):
        """Extrair pedidos no período especificado"""
        # Focar no gap: 2026-04-18 a 2026-06-06
        pass
    
    def extract_order_details(self, order_id):
        """Extrair detalhes completos do pedido (7 abas)"""
        pass
    
    def transform_to_supabase(self, raw_data):
        """Transformar dados para formato Supabase"""
        pass
```

### Fase 2: Atualização de Dados Críticos

**2.1 Atualizar Customers (1,631 registros)**

```sql
-- Script de atualização
UPDATE customers c
SET 
    email = scraped.email,
    telefone = scraped.telefone,
    cpf = scraped.cpf,
    sponsor_id = scraped.sponsor_id,
    patrocinador_comprador = scraped.patrocinador_comprador
FROM scraped_customers scraped
WHERE c.id_comprador = scraped.id_comprador;
```

**Prioridade:** CRÍTICA - Sem isso, cálculos de bônus não funcionam

**2.2 Atualizar Orders (22,195 registros)**

```sql
-- Recalcular totais
UPDATE orders o
SET valor_total = (
    SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
    FROM order_items oi
    WHERE oi.order_id = o.id
)
WHERE o.id IN (
    SELECT o.id
    FROM orders o
    WHERE o.valor_total <> (
        SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
        FROM order_items oi
        WHERE oi.order_id = o.id
    )
);
```

**Prioridade:** CRÍTICA - Totais incorretos afetam cálculos financeiros

**2.3 Calcular Order_Items (41,742 registros)**

```sql
-- Calcular total_price
UPDATE order_items
SET total_price = unit_price * quantity
WHERE total_price IS NULL;
```

**Prioridade:** ALTA - Necessário para relatórios e validações

### Fase 3: Migração de Dados Faltantes

**3.1 Pedidos do Gap (2026-04-18 a 2026-06-06)**

```python
# Extrair pedidos do gap
gap_orders = crawler.extract_orders(
    start_date="2026-04-19",
    end_date="2026-06-06"
)

# Estimativa: ~50 dias * média diária
# Média diária = 22,195 pedidos / 2,068 dias ≈ 10.7 pedidos/dia
# Gap estimado: 50 dias * 10.7 ≈ 535 pedidos
```

**Prioridade:** MÉDIA - Dados recentes são importantes para cálculos atuais

**3.2 Orders Sem Items (3,209 registros)**

```sql
-- Investigar orders sem items
SELECT 
    o.id,
    o.numero_pedido,
    o.valor_total,
    o.status_pedido,
    o.data_criacao,
    o.cancelado
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE oi.id IS NULL
LIMIT 100;

-- Possíveis causas:
# 1. Pedidos cancelados antes de ter itens
# 2. Erro de migração (items não importados)
# 3. Pedidos de serviço (sem produtos físicos)
```

**Prioridade:** ALTA - Pode indicar erro de migração

### Fase 4: Validação e Correção

**4.1 Validação de Integridade**

```sql
-- Verificar orders sem items após correção
SELECT COUNT(*) as orders_without_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE oi.id IS NULL;

-- Verificar totais inconsistentes após correção
SELECT COUNT(*) as orders_with_inconsistent_totals
FROM orders o
WHERE o.valor_total <> (
    SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
    FROM order_items oi
    WHERE oi.order_id = o.id
);

-- Verificar customers sem sponsor após correção
SELECT COUNT(*) as customers_without_sponsor
FROM customers c
WHERE c.sponsor_id IS NULL AND c.patrocinador_comprador IS NULL;
```

**4.2 Validação de Datas**

```sql
-- Verificar datas futuras
SELECT COUNT(*) as future_dates
FROM orders
WHERE data_criacao > NOW();

-- Verificar datas muito antigas
SELECT COUNT(*) as ancient_dates
FROM orders
WHERE data_criacao < '2020-01-01';

-- Verificar consistência de datas
SELECT 
    COUNT(*) as inconsistent_dates
FROM orders
WHERE data_criacao > imported_at;
```

### Fase 5: Recálculo de Bônus

**5.1 Identificar Pedidos Pagos Após Migração**

```sql
-- Pedidos pagos após a migração
SELECT 
    COUNT(*) as new_paid_orders,
    SUM(valor_total) as total_value
FROM orders
WHERE pago = true
AND data_pagamento > '2026-05-17';
```

**5.2 Recalcular Bônus para Pedidos Atualizados**

```typescript
// Usar função existente
import { calculateCommission } from '@/lib/api/bonus.functions';

// Recalcular para orders com dados atualizados
for (const order of updatedOrders) {
  const commission = await calculateCommission({
    order_id: order.id,
    seller_id: order.customer_id,
    order_amount: order.valor_total
  });
  
  // Atualizar bonus_transactions
  // ...
}
```

**Prioridade:** CRÍTICA - Bônus dependem de dados corretos de rede e valores

---

## 📋 Checklist de Ação

### Imediato (Pré-Scrape)

- [ ] Implementar crawler baseado em `loja-virtual-pedidos-mapping.md`
- [ ] Testar crawler com 10 pedidos de amostra
- [ ] Validar estrutura de dados extraídos
- [ ] Criar backup do banco de dados atual

### Curto Prazo (Scrape + Atualização)

- [ ] Extrair dados de customers (1,631 registros)
- [ ] Atualizar tabela customers com emails, CPFs, telefones
- [ ] Atualizar patrocinadores de customers (636 faltantes)
- [ ] Calcular total_price em order_items (41,742 registros)
- [ ] Recalcular valor_total em orders (17,810 inconsistentes)

### Médio Prazo (Gap + Validação)

- [ ] Extrair pedidos do gap (2026-04-19 a 2026-06-06)
- [ ] Investigar orders sem items (3,209 registros)
- [ ] Validar integridade referencial após atualizações
- [ ] Validar consistência de datas
- [ ] Recalcular bônus para pedidos atualizados

### Longo Prazo (Monitoramento)

- [ ] Implementar trigger para cálculo automático de total_price
- [ ] Implementar trigger para validação de integridade
- [ ] Criar dashboard de monitoramento de qualidade de dados
- [ ] Estabelecer processo de scrape periódico (diário/semanal)

---

## 🎯 Métricas de Sucesso

### Antes da Atualização

| Métrica | Valor Atual | Meta |
|---------|-------------|------|
| Customers sem email | 1,631 (100%) | 0 |
| Customers sem CPF | 1,631 (100%) | < 100 (6%) |
| Customers sem sponsor | 636 (39%) | 0 |
| Orders sem items | 3,209 (14.5%) | < 100 (0.5%) |
| Orders com totais inconsistentes | 17,810 (80.2%) | 0 |
| Order_items com total_price NULL | 41,742 (100%) | 0 |

### Após a Atualização (Meta)

| Métrica | Meta | Prazo |
|---------|------|-------|
| Customers sem email | 0 | 1 semana |
| Customers sem CPF | < 100 | 1 semana |
| Customers sem sponsor | 0 | 1 semana |
| Orders sem items | < 100 | 2 semanas |
| Orders com totais inconsistentes | 0 | 1 semana |
| Order_items com total_price NULL | 0 | 1 dia |
| Gap de dados preenchido | 100% | 2 semanas |

---

## 🔧 Scripts SQL de Correção

### Script 1: Calcular total_price em order_items

```sql
UPDATE order_items
SET total_price = unit_price * quantity
WHERE total_price IS NULL;
```

### Script 2: Recalcular valor_total em orders

```sql
UPDATE orders
SET valor_total = (
    SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
    FROM order_items oi
    WHERE oi.order_id = orders.id
)
WHERE valor_total <> (
    SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
    FROM order_items oi
    WHERE oi.order_id = orders.id
);
```

### Script 3: Investigar orders sem items

```sql
-- Criar tabela temporária para análise
CREATE TEMP TABLE orders_without_items_analysis AS
SELECT 
    o.id,
    o.numero_pedido,
    o.valor_total,
    o.status_pedido,
    o.data_criacao,
    o.cancelado,
    o.pago
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE oi.id IS NULL;

-- Analisar padrões
SELECT 
    status_pedido,
    cancelado,
    pago,
    COUNT(*) as count,
    MIN(data_criacao) as earliest,
    MAX(data_criacao) as latest
FROM orders_without_items_analysis
GROUP BY status_pedido, cancelado, pago;
```

### Script 4: Validar integridade após correções

```sql
-- Relatório final de integridade
SELECT 
    'Orders sem items' as metric,
    COUNT(*) as value
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE oi.id IS NULL

UNION ALL

SELECT 
    'Orders com totais inconsistentes' as metric,
    COUNT(*) as value
FROM orders o
WHERE o.valor_total <> (
    SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
    FROM order_items oi
    WHERE oi.order_id = o.id
)

UNION ALL

SELECT 
    'Customers sem sponsor' as metric,
    COUNT(*) as value
FROM customers c
WHERE c.sponsor_id IS NULL AND c.patrocinador_comprador IS NULL

UNION ALL

SELECT 
    'Order_items com total_price NULL' as metric,
    COUNT(*) as value
FROM order_items
WHERE total_price IS NULL;
```

---

## 📝 Conclusão

A auditoria revelou **problemas críticos de qualidade de dados** que impactam diretamente:

1. **Cálculos de Bônus:** Dependem de rede (patrocinadores) e valores corretos
2. **Integridade Financeira:** Totais inconsistentes afetam relatórios e pagamentos
3. **Operação do Sistema:** Customers sem email/CPF impossibilitam comunicação

**Recomendação:** Priorizar atualização via scrape seguindo o plano acima, focando primeiro em:
1. Atualizar customers (emails, CPFs, patrocinadores)
2. Corrigir totais de orders e order_items
3. Preencher gap de dados dos últimos 50 dias
4. Recalcular bônus após correções

---

**Documento criado em:** 6 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
