# FASE 12 — COPILOT DATA SOURCE AUDIT

**Data:** 7 de Junho de 2026  
**Objetivo:** Auditoria completa das fontes de dados para implementação do Copilot com Ollama

---

## RESUMO EXECUTIVO

Identificadas **9 módulos backend** com **25 tabelas** e **15 serviços** que servirão como fontes de dados para o Copilot.

**Entidades Principais:**
- **CRM:** Distribuidores, Rede, Genealogia, Comissões
- **Financeiro:** Carteiras, Pagamentos, Transações
- **Comercial:** Pedidos, Produtos, Planos
- **Executivo:** KPIs, Insights, Alertas

---

## MATRIZ DE RASTREABILIDADE DE DADOS

### CRM MODULE

#### 1. Distribuidores (Customers)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Listar todos | `customers` | `CustomerRepository` | `customer.service.ts` | `customer.dto.ts` | - | Supabase |
| Buscar por email | `customers` | `CustomerRepository` | `customer.service.ts` | `customer.dto.ts` | - | Supabase |
| Buscar por CPF | `customers` | `CustomerRepository` | `customer.service.ts` | `customer.dto.ts` | - | Supabase |
| Buscar por patrocinador | `customers` | `CustomerRepository` | `customer.service.ts` | `customer.dto.ts` | - | Supabase |
| Customer 360 | `customer_360_view` | `CustomerRepository` | `customer.service.ts` | `customer.dto.ts` | - | Supabase View |
| Contar por status | `customers` | `CustomerRepository` | `customer.service.ts` | `customer.dto.ts` | - | Supabase |
| Contar por plano | `customers` | `CustomerRepository` | `customer.service.ts` | `customer.dto.ts` | - | Supabase |

**Colunas Principais:**
- `id`, `name`, `email`, `phone`, `cpf`
- `sponsor_id`, `patrocinador_comprador`
- `status`, `plan_id`, `customer_type`
- `metadata` (JSONB)
- `created_at`, `updated_at`

#### 2. Rede (Network)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Árvore de rede | `network_tree_view` | `NetworkRepository` | `network.service.ts` | `network.dto.ts` | - | Supabase View |
| Downlines | `network_tree_view` | `NetworkRepository` | `network.service.ts` | `network.dto.ts` | - | Supabase View |
| Upline | `network_tree_view` | `NetworkRepository` | `network.service.ts` | `network.dto.ts` | - | Supabase View |
| Estatísticas de rede | `network_tree_view`, `customers` | `NetworkRepository` | `network.service.ts` | `network.dto.ts` | - | Supabase |
| Contar downlines | `customers` | `NetworkRepository` | `network.service.ts` | `network.dto.ts` | - | Supabase |

**Colunas Principais:**
- `id`, `name`, `email`, `status`
- `sponsor_id`, `sponsor_name`
- `level`, `plan_id`, `plan_name`
- `total_downlines`, `active_downlines`
- `total_revenue`

#### 3. Genealogia

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
- **Status:** Genealogia é derivada de `network_tree_view` e `customers`
- **Frontend:** `src/routes/_app/genealogy.tsx`
- **Hook:** Não existe hook específico, usa NetworkRepository

#### 4. Comissões

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Ciclos de comissão | `commission_cycles` | - | `commissions.ts` (frontend) | - | `useCommissions.ts` | Supabase |
| Executar ciclo | RPC: `run_commission_cycle` | - | `commissions.ts` (frontend) | - | `useCommissions.ts` | Supabase RPC |
| Atualizar status | `commission_cycles` | - | `commissions.ts` (frontend) | - | `useCommissions.ts` | Supabase |

**Colunas Principais:**
- `id`, `ciclo`, `qualificados`, `pago`
- `status`, `created_at`, `updated_at`

---

### FINANCEIRO MODULE

#### 1. Carteiras (Wallets)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Carteira principal | `wallets` | - | `wallet.service.ts` | - | `useWalletData.ts` | Supabase |
| Carteira de bônus | `bonus_wallets` | - | `bonus-wallet.service.ts` | - | `useWalletData.ts` | Supabase |
| Carteira de pontos | `points_wallets` | - | `points-wallet.service.ts` | - | `useWalletData.ts` | Supabase |
| Transações | `wallet_transactions` | - | `wallet.service.ts` | - | `useWalletTransactions.ts` | Supabase |
| Transações de bônus | `bonus_transactions` | - | `bonus-wallet.service.ts` | - | `useWalletTransactions.ts` | Supabase |

**Colunas Principais (wallets):**
- `id`, `customer_id`, `balance`, `available_balance`, `frozen_balance`
- `currency`, `status`, `created_at`, `updated_at`

**Colunas Principais (wallet_transactions):**
- `id`, `wallet_id`, `transaction_type`, `amount`
- `balance_before`, `balance_after`
- `reference_id`, `reference_type`, `description`
- `metadata` (JSONB), `created_at`

**Colunas Principais (bonus_wallets):**
- `id`, `customer_id`, `balance`, `available_balance`, `frozen_balance`
- `total_earned`, `total_used`
- `currency`, `status`, `created_at`, `updated_at`

**Colunas Principais (bonus_transactions):**
- `id`, `bonus_wallet_id`, `transaction_type`, `amount`
- `balance_before`, `balance_after`
- `source_type`, `source_id`, `expires_at`
- `reference_id`, `reference_type`, `description`
- `metadata` (JSONB), `created_at`

#### 2. Pagamentos (Payments)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Buscar por order | `payments` | `PaymentRepository` | `payment.service.ts` | `payment.dto.ts` | - | Supabase |
| Buscar por cliente | `payments` | `PaymentRepository` | `payment.service.ts` | `payment.dto.ts` | - | Supabase |
| Buscar por status | `payments` | `PaymentRepository` | `payment.service.ts` | `payment.dto.ts` | - | Supabase |
| Buscar por transação gateway | `payments` | `PaymentRepository` | `payment.service.ts` | `payment.dto.ts` | - | Supabase |
| Contar por status | `payments` | `PaymentRepository` | `payment.service.ts` | `payment.dto.ts` | - | Supabase |
| Receita total | `payments` | `PaymentRepository` | `payment.service.ts` | `payment.dto.ts` | - | Supabase |
| Receita por período | `payments` | `PaymentRepository` | `payment.service.ts` | `payment.dto.ts` | - | Supabase |

**Colunas Principais:**
- `id`, `order_id`, `customer_id`, `amount`
- `status`, `payment_method`, `gateway_transaction_id`
- `paid_at`, `created_at`, `updated_at`

#### 3. Transações

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
- **Status:** Transações são parte de `wallet_transactions` e `bonus_transactions`

---

### COMERCIAL MODULE

#### 1. Pedidos (Orders)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Buscar por cliente | `orders` | `OrderRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |
| Buscar por status | `orders` | `OrderRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |
| Resumo de pedidos | `orders`, `order_items` | `OrderRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |
| Contar por status | `orders` | `OrderRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |
| Contar por cliente | `orders` | `OrderRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |
| Receita total | `orders` | `OrderRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |
| Receita por período | `orders` | `OrderRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |
| Itens do pedido | `order_items` | `OrderItemRepository` | `order.service.ts` | `order.dto.ts` | - | Supabase |

**Colunas Principais (orders):**
- `id`, `comprador`, `usuario`, `user_id`
- `status`, `pedido_pago`, `estado`
- `valor_total`, `valor_total_pedido`
- `forma_pagamento`, `data_pagamento`, `data_criacao`
- `patrocinador_comprador`
- `created_at`, `updated_at`

**Colunas Principais (order_items):**
- `id`, `order_id`, `product_id`, `product_name`, `product_code`
- `quantity`, `unit_price`, `total_price`
- `created_at`

#### 2. Produtos (Products)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Listar todos | `products` | - | `productsService.ts` (frontend) | `products.ts` | `useProducts.ts` | Supabase |
| Buscar por categoria | `products` | - | `productsService.ts` (frontend) | `products.ts` | `useProducts.ts` | Supabase |
| Buscar por ID | `products` | - | `productsService.ts` (frontend) | `products.ts` | `useProductDetail.ts` | Supabase |
| Categorias | `products` | - | `productsService.ts` (frontend) | `products.ts` | - | Supabase |

**Colunas Principais:**
- `id`, `name`, `category`, `price`
- `sku`, `manufacturer`, `stock`
- `images` (array), `description`
- `is_active`, `metadata` (JSONB)
- `created_at`, `updated_at`

#### 3. Planos (Plans)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Buscar por slug | `plans` | `PlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
| Planos ativos | `plans` | `PlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
| Planos de afiliado | `plans` | `PlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
| Bônus do plano | `plan_bonuses` | `PlanBonusRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
| Planos do cliente | `customer_plans` | `CustomerPlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
| Plano ativo do cliente | `customer_plans` | `CustomerPlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
| Ativar plano | `customer_plans` | `CustomerPlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
| Desativar plano | `customer_plans` | `CustomerPlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |
- Contar por plano | `customer_plans` | `CustomerPlanRepository` | `plan.service.ts` | `plan.dto.ts` | - | Supabase |

**Colunas Principais (plans):**
- `id`, `name`, `slug`, `description`
- `price`, `is_active`, `is_affiliate`
- `metadata` (JSONB), `created_at`, `updated_at`

**Colunas Principais (plan_bonuses):**
- `id`, `plan_id`, `bonus_type`
- `generation`, `percentage`
- `created_at`, `updated_at`

**Colunas Principais (customer_plans):**
- `id`, `customer_id`, `plan_id`
- `status`, `activated_at`
- `created_at`, `updated_at`

---

### EXECUTIVO MODULE

#### 1. KPIs (Analytics)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Analytics executivo | `orders`, `customers` | `AnalyticsRepository` | `analytics.service.ts` | `analytics.dto.ts` | - | Supabase |
| Analytics de vendas | `orders` | `AnalyticsRepository` | `analytics.service.ts` | `analytics.dto.ts` | - | Supabase |
| Analytics de rede | `customers` | `AnalyticsRepository` | `analytics.service.ts` | `analytics.dto.ts` | - | Supabase |
- Analytics de planos | `analytics_plan_performance` | `AnalyticsRepository` | `analytics.service.ts` | `analytics.dto.ts` | - | Supabase View |
- Distribuição de bônus | `analytics_bonus_distribution` | `AnalyticsRepository` | `analytics.service.ts` | `analytics.dto.ts` | - | Supabase View |
- Analytics por plano | `analytics_plan_performance` | `AnalyticsRepository` | `analytics.service.ts` | `analytics.dto.ts` | - | Supabase View |

**Colunas Principais (analytics_plan_performance):**
- `plan_id`, `plan_name`
- `total_customers`, `active_customers`
- `total_revenue`, `average_revenue_per_customer`

**Colunas Principais (analytics_bonus_distribution):**
- `plan_id`, `plan_name`
- `total_bonus_pool`, `distributed_bonus`
- `pending_bonus`

#### 2. Insights

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
- **Status:** Insights são derivados de analytics e agregações

#### 3. Alertas

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
- **Status:** Alertas não estão implementados como tabela separada

---

### AUTH MODULE

#### 1. Perfis (Profiles)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
| Buscar por user_id | `profiles` | `ProfileRepository` | `auth.service.ts` | `profile.dto.ts` | `useProfile.ts` | Supabase |
| Buscar por role | `profiles` | `ProfileRepository` | `auth.service.ts` | `profile.dto.ts` | - | Supabase |
| Criar perfil | `profiles` | `ProfileRepository` | `auth.service.ts` | `profile.dto.ts` | - | Supabase |
| Atualizar perfil | `profiles` | `ProfileRepository` | `auth.service.ts` | `profile.dto.ts` | - | Supabase |

**Colunas Principais:**
- `id`, `user_id`, `name`, `email`
- `role`, `status`
- `display_name`, `avatar_url`
- `created_at`, `updated_at`

#### 2. RBAC (Permissions)

| Campo | Tabela | Repository | Service | DTO | Hook | Origem Real |
|-------|--------|------------|---------|-----|------|-------------|
- Validar permissão | - | - | `permission.guard.ts` | `common.types.ts` | - | Code |
- Permissões por role | - | - | `permission.guard.ts` | `common.types.ts` | - | Code |

**Roles Disponíveis:**
- `admin` (ADMIN_ALL)
- `operator` (CUSTOMERS_READ, ORDERS_READ, ORDERS_WRITE, NETWORK_READ, PLANS_READ, ANALYTICS_READ, PAYMENTS_READ)
- `distributor` (CUSTOMERS_READ, ORDERS_READ, NETWORK_READ, PLANS_READ, ANALYTICS_READ)

---

## TABELAS UTILIZADAS PELO COPILOT

### Tabelas Principais (25)

1. **customers** - Distribuidores/Clientes
2. **customer_360_view** - View 360 do cliente
3. **network_tree_view** - Árvore de rede
4. **commission_cycles** - Ciclos de comissão
5. **wallets** - Carteiras principais
6. **bonus_wallets** - Carteiras de bônus
7. **points_wallets** - Carteiras de pontos
8. **wallet_transactions** - Transações de carteira
9. **bonus_transactions** - Transações de bônus
10. **payments** - Pagamentos
11. **orders** - Pedidos
12. **order_items** - Itens do pedido
13. **products** - Produtos
14. **plans** - Planos
15. **plan_bonuses** - Bônus dos planos
16. **customer_plans** - Planos dos clientes
17. **analytics_plan_performance** - Analytics de planos
18. **analytics_bonus_distribution** - Distribuição de bônus
19. **profiles** - Perfis de usuário
20. **bonus_usage_rules** - Regras de uso de bônus

### Views (3)

1. **customer_360_view** - Visão 360 do cliente
2. **network_tree_view** - Árvore de rede
3. **analytics_plan_performance** - Analytics de planos
4. **analytics_bonus_distribution** - Distribuição de bônus

### RPC Functions (1)

1. **run_commission_cycle** - Executar ciclo de comissão

---

## SERVIÇOS OFICIAIS DO COPILOT

### Backend Services (15)

1. **CustomerService** - Operações com clientes
2. **NetworkService** - Operações com rede
3. **OrderService** - Operações com pedidos
4. **PaymentService** - Operações com pagamentos
5. **PlanService** - Operações com planos
6. **AnalyticsService** - Operações com analytics
7. **AuthService** - Operações de autenticação
8. **WalletService** - Operações com carteiras
9. **BonusWalletService** - Operações com carteiras de bônus
10. **PointsWalletService** - Operações com carteiras de pontos

### Frontend Services (2)

1. **CommissionService** - Operações com comissões (frontend)
2. **productsService** - Operações com produtos (frontend)

---

## RBAC MATRIX

### Role: Admin

| Permissão | CRM | Financeiro | Comercial | Executivo |
|-----------|-----|------------|-----------|-----------|
| ADMIN_ALL | ✅ | ✅ | ✅ | ✅ |

### Role: Operator

| Permissão | CRM | Financeiro | Comercial | Executivo |
|-----------|-----|------------|-----------|-----------|
| CUSTOMERS_READ | ✅ | ❌ | ❌ | ❌ |
| ORDERS_READ | ❌ | ❌ | ✅ | ❌ |
| ORDERS_WRITE | ❌ | ❌ | ✅ | ❌ |
| NETWORK_READ | ✅ | ❌ | ❌ | ❌ |
| PLANS_READ | ❌ | ❌ | ✅ | ❌ |
| ANALYTICS_READ | ❌ | ❌ | ❌ | ✅ |
| PAYMENTS_READ | ❌ | ✅ | ❌ | ❌ |

### Role: Distributor

| Permissão | CRM | Financeiro | Comercial | Executivo |
|-----------|-----|------------|-----------|-----------|
| CUSTOMERS_READ | ✅ | ❌ | ❌ | ❌ |
| ORDERS_READ | ❌ | ❌ | ✅ | ❌ |
| NETWORK_READ | ✅ | ❌ | ❌ | ❌ |
| PLANS_READ | ❌ | ❌ | ✅ | ❌ |
| ANALYTICS_READ | ❌ | ❌ | ❌ | ✅ |

---

## CONTEXTOS DISPONÍVEIS PARA O COPILOT

### Contexto de Usuário
- user_id
- name
- email
- role
- status

### Contexto de CRM
- total_customers
- active_customers
- customers_by_status
- customers_by_plan
- network_size
- active_downlines
- total_revenue

### Contexto de Financeiro
- wallet_balance
- available_balance
- frozen_balance
- bonus_balance
- total_earned
- total_used
- recent_transactions
- payment_status

### Contexto de Comercial
- total_orders
- orders_by_status
- total_revenue
- average_order_value
- top_products
- active_plans
- customer_plans

### Contexto de Executivo
- total_revenue
- total_orders
- active_customers
- plan_performance
- bonus_distribution
- growth_metrics

---

## LIMITAÇÕES CONHECIDAS

### Dados Incompletos (Baseado em Auditoria)

- **1,631 customers (100%)** sem email
- **1,631 customers (100%)** sem CPF
- **636 customers (39%)** sem patrocinador
- **3,209 orders (14.5%)** sem itens
- **17,810 orders (80.2%)** com totais inconsistentes
- **41,742 order_items (100%)** com total_price NULL

### Impacto no Copilot

- O Copilot deve validar se os dados estão completos antes de responder
- Alertas devem ser mostrados quando dados críticos estão faltando
- Agregações devem lidar com valores NULL
- O Copilot não deve inventar dados quando não disponíveis

---

## PRÓXIMOS PASSOS

1. ✅ Auditoria de fontes de dados concluída
2. ⏳ Criar módulo copilot no backend
3. ⏳ Implementar ContextBuilder
4. ⏳ Implementar OllamaProvider
5. ⏳ Criar tabelas de persistência
6. ⏳ Implementar RBAC no copilot
7. ⏳ Integrar frontend
8. ⏳ Implementar observabilidade
9. ⏳ Validar cenários
10. ⏳ Criar relatório final

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
