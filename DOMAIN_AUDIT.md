# DOMAIN_AUDIT.md

**AllIn-OS2 — Auditoria da Camada de Domínio**
Data: 2026-07-07
Projeto: AllIn-OS2 (id: imeadfnlgzphumuawdyt)

---

## Objetivo

Consolidar a camada de domínio para que cada entidade do sistema possua **apenas uma implementação oficial**, eliminando duplicações de regras de negócio.

---

## Metodologia

Para cada domínio:
1. Mapear TODOS os arquivos relacionados (services, hooks, repositories, components, routes)
2. Identificar quem chama cada um (consumidores)
3. Identificar duplicações (mesma lógica implementada em múltiplos lugares)
4. Identificar código morto (arquivos sem consumidores)
5. Definir a **implementação oficial**
6. Definir o que pode ser removido

---

## DOMÍNIO: CUSTOMERS (Cliente)

### 1. Arquivos Encontrados

#### Services (8 arquivos)

| Arquivo | Tipo | Status | Observação |
|---------|------|--------|------------|
| `src/services/customers/index.ts` | Service | **OFICIAL** | CustomerService principal |
| `src/services/customers/customer.service.ts` | Service | ❌ REMOVIDO | Re-export puro, sem valor |
| `src/services/customers/customer.types.ts` | Types | ✅ Manter | Tipos CustomerRecord |
| `src/services/customer360/index.ts` | Service | **OFICIAL** | Customer360Service (view 360 otimizada) |
| `src/services/crm360/index.ts` | Service | ✅ Manter | CRM360Service |
| `src/services/crm360/documents.ts` | Service | ✅ Manter | Documentos CRM |
| `src/services/crm360/customer-notes.ts` | Service | ✅ Manter | Notas CRM |
| `src/services/crm360/automations.ts` | Service | ✅ Manter | Automações CRM |
| `src/services/mlm360/index.ts` | Service | ✅ Manter | MLM360Service |

#### Hooks (6 arquivos)

| Arquivo | Tipo | Status | Consumidores | Observação |
|---------|------|--------|--------------|------------|
| `src/hooks/customers/useCustomers.ts` | Hook | **OFICIAL** | customers/index.tsx, distributors/index.tsx | Lista de customers |
| `src/hooks/customers/useCustomer.ts` | Hook | ❌ REMOVIDO | Nenhum (órfão) | Buscava por UUID id |
| `src/hooks/customers/useCustomer360.ts` | Hook | ❌ REMOVIDO | customers/$id.tsx (migrado) | Legacy - múltiplas queries |
| `src/hooks/customers/useCustomer360New.ts` | Hook | **OFICIAL** | customers/$id.tsx (migrado) | View otimizada customer_360_view |
| `src/hooks/customers/useCustomer360Data.ts` | Hook | ❌ REMOVIDO | Nenhum (órfão) | Wrapper não utilizado |
| `src/hooks/customers/useWalletTransactions.ts` | Hook | ❌ REMOVIDO | Nenhum (órfão) | Estado local - lógica na route |

#### Routes (4 arquivos)

| Arquivo | Uso de Hooks | Status |
|---------|--------------|--------|
| `src/routes/_app/customers/index.tsx` | `useCustomers` | ✅ OK |
| `src/routes/_app/customers/$id.tsx` | `useCustomer360ByCustomerId` | ✅ Migração completa |
| `src/routes/_app/distributors/index.tsx` | `useCustomers` | ✅ OK |
| `src/routes/cliente.tsx` | Nenhum hook (direto) | ✅ OK |

#### Components (9 arquivos)

| Arquivo | Dependências | Status |
|---------|--------------|--------|
| `components/customers/CustomerProfileCard.tsx` | getCustomerLabel, getCustomerInitials | ✅ OK |
| `components/customers/CustomerOrdersTab.tsx` | formatBRL | ✅ OK |
| `components/customers/CustomerKPIs.tsx` | formatBRL | ✅ OK |
| `components/customers/CustomerWalletTab.tsx` | formatBRL | ✅ OK |
| `components/customers/CustomerNetworkTab.tsx` | formatBRL | ✅ OK |
| `components/customers/CustomerTimelineTab.tsx` | CustomerNotesService | ✅ OK |
| `components/customers/CustomerDocumentsTab.tsx` | DocumentService | ✅ OK |
| `components/customers/CustomerAutomationsTab.tsx` | AutomationService | ✅ OK |
| `components/customers/CustomerHeroSection.tsx` | Landing page genérica | ✅ OK |

#### Lib Utilities (2 arquivos)

| Arquivo | Função | Status |
|---------|--------|--------|
| `src/lib/customer-label.ts` | getCustomerLabel(), getCustomerInitials() | ✅ OK |
| `src/lib/customer-calculations.ts` | formatBRL() | ✅ OK |

### 2. Duplicações Identificadas

| Duplicação | Descrição | Solução |
|------------|-----------|---------|
| `useCustomer360` + `useCustomer360New` | Ambos buscam dados 360, mas por ID diferente e com abordagens diferentes | Manter `useCustomer360New` (usa view otimizada) |
| `customer.service.ts` re-export | Apenas re-exporta CustomerService de index.ts | Removido |
| `useQuery` direto na route | Route fazia query direta sem hook | Integrado ao usar hook novo |
| `useCustomer` (singular) | Idêntico a `useCustomer360` mas só busca cliente | Removido (órfão) |
| `useCustomer360Data` wrapper | Wrapper do useCustomer360 com mutations | Removido (não usado) |

### 3. Código Morto Removido

| Arquivo | Tipo | Motivo |
|---------|------|--------|
| `src/services/customers/customer.service.ts` | Service | Re-export sem valor |
| `src/hooks/customers/useCustomer.ts` | Hook | Nunca usado em nenhuma route/component |
| `src/hooks/customers/useCustomer360Data.ts` | Hook | Nunca usado, era wrapper não utilizado |
| `src/hooks/customers/useWalletTransactions.ts` | Hook | Nunca usado, lógica estava na route |

### 4. Fluxo Atual (Após Migração)

```
Route /_app/customers/$id
  ↓
useCustomer360ByCustomerId(id)
  ↓
Customer360Service.getCustomer360ByCustomerId(id)
  ↓
customer_360_view (1 query otimizada)
  ↓
Supabase
```

**Antes:** 2 hooks + 5+ queries sequenciais  
**Depois:** 1 hook + 1 query principal

### 5. Implementação Oficial Definida

| Serviço/Hook | Arquivo | Responsabilidade |
|-------------|---------|-----------------|
| `CustomerService` | `services/customers/index.ts` | CRUD básico de customers |
| `Customer360Service` | `services/customer360/index.ts` | Visão 360 agregada |
| `useCustomers` | `hooks/customers/useCustomers.ts` | Lista de customers |
| `useCustomer360New` | `hooks/customers/useCustomer360New.ts` | Hook 360 unificado |

### 6. Estatísticas CUSTOMERS

| Métrica | Antes | Depois |
|---------|-------|--------|
| Services duplicados | 2 | 1 (CustomerService + Customer360Service) |
| Hooks duplicados | 4 | 2 |
| Arquivos removidos | - | 4 |
| Queries na route 360 | 5+ | 1 (view otimizada) |

### 7. Pendências CUSTOMERS

1. `customer-calculations.ts` — Contém `formatBRL` que também existe em `customer-label.ts`? Verificar.
2. `lib/customer-label.ts` — Funções `getCustomerLabel` e `getCustomerInitials` usadas em 7+ components. Manter.
3. `lib/customer-calculations.ts` — Contém `calculateLTV`, `calculateTotalComprado` REMOVIDOS (agora usa campos pré-calculados do DB). Arquivo ainda existe mas com `formatBRL` apenas.

---

## DOMÍNIO: ORDERS (Pedidos)

### 1. Arquivos Encontrados

#### Services

| Arquivo | Tipo | Status | Observação |
|---------|------|--------|------------|
| `src/services/orders/index.ts` | Service | **OFICIAL** | OrderService principal |
| `src/services/orders/order.service.ts` | Service | ❌ REMOVIDO | Re-export puro, sem consumidores |
| `src/services/orders/order.types.ts` | Types | ✅ Manter | Tipos OrderRecord |

#### Hooks

| Arquivo | Tipo | Status | Consumidores | Observação |
|---------|------|--------|--------------|------------|
| `src/hooks/orders/useOrders.ts` | Hook | **OFICIAL** | routes/office/orders | Lista paginada |
| `src/hooks/orders/useOrderList.ts` | Hook | **OFICIAL** | routes/_app/orders | Lista + customers |
| `src/hooks/customers/useCustomer360.ts` | Hook | ❌ REMOVIDO | (estava em customers/$id mas foi migrado) | Chamava `OrderService.fetchOrdersByCustomerId()` que NÃO EXISTE — bug mascarado |

#### Routes

| Arquivo | Uso de Hooks | Status |
|---------|--------------|--------|
| `src/routes/_app/orders/index.tsx` | `useOrderList` | ✅ OK |
| `src/routes/office/orders.tsx` | `useOrders` | ✅ OK |
| `src/routes/office/OrdersPage.tsx` | — | ❌ REMOVIDO — código morto duplicado de orders.tsx |

#### Utils

| Arquivo | Status | Motivo |
|---------|--------|--------|
| `src/utils/priceFormatter.ts` | ❌ REMOVIDO | Só usado por OrdersPage.tsx (dead code) |

### 2. Duplicações e Bugs Mascarados Identificados

| Problema | Arquivo | Descrição |
|----------|---------|-----------|
| Re-export órfão | `order.service.ts` | Apenas re-exportava OrderService sem ser usado |
| Componente duplicado | `OrdersPage.tsx` vs `orders.tsx` | Componente com mesma estrutura, nunca importado |
| Bug mascarado | `useCustomer360.ts` (legado) | Chamava `OrderService.fetchOrdersByCustomerId()` — método que NÃO EXISTE no OrderService |
| Método com typo | `OrderService.fetchOrdersByidComprador` | `idComprador` (lowercase) — typo de "IdComprador". **Não tinha consumidores** |
| Dead method | `OrderService.fetchOfficeOrders` | Método definido mas nunca chamado |
| Formatador BRL duplicado | `function formatBRL` em 8 routes | Definido localmente em cada route — duplicação massiva |

### 3. Código Morto Removido

| Arquivo | Tipo | Motivo |
|---------|------|--------|
| `src/hooks/customers/useCustomer360.ts` | Hook | Legacy, chamava método inexistente, já migrado |
| `src/services/orders/order.service.ts` | Service | Re-export órfão |
| `src/routes/office/OrdersPage.tsx` | Component | Duplicado de orders.tsx, nunca usado |
| `src/utils/priceFormatter.ts` | Utils | Só usado por código morto |

### 4. Métodos Removidos do OrderService

| Método | Motivo |
|--------|--------|
| `fetchOrdersByidComprador` | Typo + zero consumidores |
| `fetchOfficeOrders` | Zero consumidores |

### 5. Implementação Oficial Definida

| Serviço/Hook | Arquivo | Responsabilidade |
|-------------|---------|-----------------|
| `OrderService` | `services/orders/index.ts` | 5 métodos: fetchOrdersForDashboard, fetchOrdersList, fetchOrdersAndCustomers, fetchRecentOrders, fetchOrderStats |
| `useOrders` | `hooks/orders/useOrders.ts` | Lista paginada (office) |
| `useOrderList` | `hooks/orders/useOrderList.ts` | Lista + customers (cliente) |

### 6. Estatísticas ORDERS

| Métrica | Antes | Depois |
|---------|-------|--------|
| Métodos no OrderService | 7 | 5 |
| Arquivos removidos (4 + 1 hook) | 5 | 5 |
| Hooks duplicados | 2 | 2 (PROPÓSITOS DIFERENTES - validados) |
| Componentes duplicados (OrdersPage) | 2 | 1 |
| Bugs mascarados identificados | 1 | 0 |

### 7. Pendências ORDERS

1. ⚠️ `formatBRL` duplicado em 8 routes — Eliminar duplicação criando `src/utils/formatBRL.ts`
2. ⚠️ `OrderService.fetchOrdersList` retorna `totalCount: 0` hardcoded — Hardcoded bug
3. ⚠️ `OrderService.fetchOrdersAndCustomers` sempre retorna TODOS customers (sem limite) — Performance risk
4. ⚠️ `OrderRepository` referenciado em `context-builder.ts` mas módulo não existe — Broken ref backend

---

## DOMÍNIO: PRODUCTS (Produtos)

### 1. Status: ✅ COMPLETO (1ª iteração)

### 2. Decisão Arquitetural Importante

**⚠️ Existem DUAS tabelas de produtos que pertencem a PROJETOS DIFERENTES:**

| Tabela | Serviço | Projeto |
|--------|---------|---------|
| `public.products` | `ProductService` | Projeto comercial AllIn (sapatos terapêuticos) |
| `commerce.produtos` | `productsService` | Storefront do projeto |
| `industrial.products_industrial` | `ProductIndustrialRepository` | Industrial (colchões manufatura) |

**NÃO são duplicações** — são 3 produtos de domínios/empresas distintas:
- AllIn comercial (sapatos) → `public.products`
- Storefront → `commerce.produtos`
- Industrial → `industrial.products_industrial`

### 3. Acções Tomadas

| Arquivo/Ação | Mudança |
|--------------|---------|
| `src/utils/productsData.ts` | ❌ Removido (dead code: array vazio) |
| `src/components/sections/HeroStatsSection.tsx` | ✅ Atualizado — removeu `useMemo`, lógica quebrada |
| `src/services/products/index.ts` | ✅ Removido `fetchStoresProducts` (duplicado de `fetchProducts`)<br>✅ Adicionada documentação explicando a coexistência dos 2 produtos services |
| `src/hooks/products/useProducts.ts` | ✅ Migrado de `fetchStoresProducts` para `fetchProducts` (versão canônica) |
| `src/hooks/useProductsFromCSV.ts` | ❌ Removido (substituído por `useProductsLegacy`) |
| `src/hooks/useProductsLegacy.ts` | ✅ Criado — versão TanStack-based, retorna shape backward-compatible com useProductsFromCSV |
| `src/components/ProductSearch.tsx` | ✅ Migrado import para `useProductsLegacy` |
| `src/routes/loja.tsx` | ✅ Migrado import para `useProductsLegacy` |

### 4. Implementação Oficial Definida

| Camada | Implementação | Tabela |
|--------|---------------|--------|
| **Frontend Service (AllIn comercial)** | `ProductService` | `public.products` |
| **Frontend Service (storefront)** | `productsService` | `commerce.produtos` |
| **Frontend Hook (storefront)** | `useProductsQuery` | `commerce.produtos` |
| **Frontend Hook (legacy storefront)** | `useProductsLegacy` | `commerce.produtos` |
| **Frontend Hook (AllIn comercial)** | `useProducts`, `useProductDetail` | `public.products` |
| **Backend (industrial)** | `ProductIndustrialService/Repository` | `industrial.products_industrial` |
| **Backend (e-commerce)** | `ProductService/Repository` | `commerce.produtos` |

### 5. Estatísticas PRODUCTS

| Métrica | Valor |
|---------|-------|
| Total de arquivos identificados | 50+ |
| Arquivos removidos nesta sprint | 2 (`productsData.ts`, `useProductsFromCSV.ts`) |
| Métodos duplicados removidos | 1 (`fetchStoresProducts`) |
| Hooks migrados para TanStack | 1 (`useProductsFromCSV` → `useProductsLegacy`) |
| Consumers migrados com sucesso | 2 (`ProductSearch.tsx`, `loja.tsx`) |
| Duplicações residuais (backend) | 5+ (multi-estilo de API, BaseRepository paths inconsistentes) |

### 6. Pendências PRODUCTS (Próximas Iterações)

| Prioridade | Pendência |
|-----------|----------|
| 🟢 Baixa | Unificar `useProductsQuery` e `useProductsLegacy` (ambos consultam `commerce.produtos`) |
| 🟢 Baixa | Padronizar estilos de API backend (Express vs `{data, error}`) — 4 estilos |
| 🟢 Baixa | Consolidar `StoreProductAssignment` interface (DTO + Repository duplicados) |
| 🟢 Baixa | Padronizar paths de import do `BaseRepository` (3 paths diferentes) |
| 🟢 Baixa | Decidir destino de `product.service.ts` (re-export no backend) |
| ⚪ Info | `ProductIndustrialRepository` em arquivo genérico `industrial.api.ts` (~58KB) — refator para arquivo próprio |

---

## DOMÍNIO: PLANS (Planos MLM)

### 1. Status: ✅ COMPLETO

### 2. Acções Tomadas Nesta Iteracão

| Arquivo | Ação | Motivo |
|---------|------|--------|
| `src/hooks/distributor/useDistributorPlans.ts` | ❌ Removido (dead code) | 0 consumidores — duplicava `usePlans` |
| `src/services/plans/plan.service.ts` | ❌ Removido (re-export) | `export { PlanService as planService }` — alias `planService` (lowercase) nunca usado |
| `src/services/plans/plan.types.ts` | ❌ Removido (dead type) | `PlanRecord = Record<string, any>` nunca importado |
| `src/routes/office/PlanPage.tsx` | ❌ Removido (dead code) | Duplicado de `routes/office/plan.tsx` que define localmente |
| `src/backend/modules/plans/repositories/plan.repository.ts` | ✅ Criado | Resolve import órfão em `context-builder.ts` |

### 3. Duplicações Identificadas (já resolvidas)

| Duplicação | Solução |
|------------|---------|
| `useDistributorPlans` vs `usePlans` | Removido `useDistributorPlans` (dead code) |
| `planService` (alias) vs `PlanService` | Removido alias; todos usam `PlanService` (canônico) |
| `PlanPage.tsx` standalone vs local em `plan.tsx` | Removido `PlanPage.tsx` standalone |
| `PlanRecord` type alias genérico | Removido |

### 4. Implementação Oficial Definida

| Camada | Implementação | Tabela/Schema |
|--------|---------------|---------------|
| **Frontend Service** | `PlanService` (`services/plans/index.ts`) | `mlm.planos` |
| **Frontend Hooks** | `usePlans`, `usePlanBonuses`, `usePlanAnalytics` | `mlm.planos` |
| **Backend Repository** | `PlanRepository` (`backend/modules/plans/repositories/plan.repository.ts`) | `mlm.planos` |
| **Backend Events** | `plan.handlers.ts` | Eventos (PLAN_ACTIVATED, etc.) |
| **MLM Rules** | `src/modules/plans/mlm-rules.ts` | Regras hardcoded (3 planos: afiliado/avanço/excelência) |
| **Auth Module** | `SupabaseService.fetchPlans()` | Usado por `routes/ativacao.tsx`, `routes/seja-distribuidor.$slug.tsx` (legado) |

### 5. Estatísticas PLANS

| Métrica | Valor |
|---------|-------|
| Total de arquivos identificados | 30+ |
| Arquivos removidos nesta sprint | 4 (1 hook + 1 service re-export + 1 type + 1 componente дуплицит) |
| Repositórios backend criados | 1 (PlanRepository) |
| Import órfão resolvido | 1 (context-builder.ts → PlanRepository) |
| Duplicações backend similares | 5+ (OrderRepository, CustomerRepository, etc.) — pendentes |

### 6. Pendências PLANS (Próximas Iterações)

| Prioridade | Pendência |
|-----------|----------|
| 🟡 Média | `SupabaseService.fetchPlans()` em `modules/auth/services/supabase.service` duplica lógica — migrar para `usePlans` |
| 🟡 Média | `Routes/_app/plans.tsx` vs `routes/office/plan.tsx` — verificar se ambos são necessários |
| 🟢 Baixa | `PlansOverviewSection.tsx` (DEPRECATED, hardcoded) — substituir por PlanCard dinâmico |
| 🟢 Baixa | `Backend`: criar `OrderRepository`, `CustomerRepository`, `NetworkRepository`, `PaymentRepository`, `AnalyticsRepository` (todos import orfão) |
| 🟢 Baixa | Padronizar paths de import do `BaseRepository` (produtos/plans/copilot usam paths diferentes) |

---

## DOMÍNIO: PAYMENTS (Pagamentos) - 🔄 REDESIGN COMPLETO

### 1. Status: ✅ REDESIGN CANÔNICO COMPLETO

### 2. Decisão Arquitetural

**AVISO:** O domínio `payments/` legacy estava **fundamentalmente quebrado**. Service apontava para tabelas INEXISTENTES (`payments`, `wallets`, `wallet_transactions`, `bonus_wallets`, `points_wallets`). Hooks chamavam métodos que não existiam (`fetchWithdrawals`, `fetchRecentWithdrawals`, `fetchWorkspaceSettings`). 5+ imports quebrados em `context-builder.ts` (backend `payments/` diretório inteiro NÃO EXISTIA).

**Decisão:** **Refazer do zero** com base nas 9 tabelas REAIS do banco. Não remendar código legacy.

### 3. Tabelas Reais Utilizadas (de information_schema)

| Schema | Tabela | Propósito |
|--------|--------|-----------|
| `commerce` | `pedidos_pagamentos` | Pagamentos de pedidos |
| `commerce` | `formas_pagamento` | Catálogo de formas |
| `finance` | `solicitacoes_saque` | Saques de distribuidores |
| `finance` | `solicitacoes_saque_cd` | Saques de CD |
| `mlm` | `bonus_historico` | Histórico de bônus |
| `mlm` | `bonus_regras` | Regras de bônus |
| `mlm` | `pontos_saldo` | Saldo de pontos |
| `mlm` | `pontos_transacoes` | Transações de pontos |
| `commerce` | `pedidos_saldos` | Saldos dos pedidos |

### 4. Implementação Oficial Definida (5 novos serviços)

| Service | Hook | Tabela Real |
|---------|------|-------------|
| `PaymentService` (`services/payments/index.ts`) | `usePayments`, `usePaymentById`, `usePaymentsByPedido` (`hooks/payments/`) | `commerce.pedidos_pagamentos` |
| `WithdrawalService` (`services/withdrawals/index.ts`) | `useWithdrawals`, `useRecentWithdrawals` (`hooks/withdrawals/`) | `finance.solicitacoes_saque` |
| `BonusService` (`services/bonus/index.ts`) | `useBonusHistory`, `useActiveBonusRules` (`hooks/bonus/`) | `mlm.bonus_historico` + `bonus_regras` |
| `PointsService` (`services/points/index.ts`) | `usePointsByDistribuidor`, `usePointsTransactions` (`hooks/points/`) | `mlm.pontos_saldo` + `pontos_transacoes` |
| `PaymentMethodService` (`services/payment-methods/index.ts`) | `useActivePaymentMethods` (`hooks/payment-methods/`) | `commerce.formas_pagamento` |

### 5. Arquivos Criados (9 novos) + Removidos (7 arquivos)

**Novos Services:**
1. `src/services/payments/index.ts` (escrito com tabelas reais)
2. `src/services/withdrawals/index.ts` (NOVO diretório)
3. `src/services/bonus/index.ts` (NOVO diretório)
4. `src/services/points/index.ts` (NOVO diretório)
5. `src/services/payment-methods/index.ts` (NOVO diretório)

**Novos Hooks:**
6. `src/hooks/payments/usePayments.ts` (reescrito)
7. `src/hooks/withdrawals/useWithdrawals.ts` (NOVO)
8. `src/hooks/bonus/useBonus.ts` (NOVO)
9. `src/hooks/points/usePoints.ts` (NOVO)
10. `src/hooks/payment-methods/usePaymentMethods.ts` (NOVO)

**Arquivos Removidos:**
1. `src/services/payments/payment.service.ts` (re-export morto)
2. `src/services/payments/payment.types.ts` (type genérico morto)
3. `src/services/wallets/wallet.service.ts` (re-export morto)
4. `src/services/wallets/wallet.types.ts` (type genérico morto)
5. `src/routes/office/FinancePage.tsx` (componente duplicado de finance.tsx)
6. `src/routes/office/ReportsPage.tsx` (componente duplicado de reports.tsx)
7. `src/routes/office/reports.tsx.bak` (backup antigo)

### 6. Pendências Críticas (PRÓXIMAS SPRINTS)

| Prioridade | Pendência |
|-----------|----------|
| 🔴 Alta | `services/wallets/index.ts` legacy consulta tabelas INEXISTENTES (`bonus_wallets`, `points_wallets`) — Migrar para `points/index.ts` + criar `comissoes/index.ts` |
| 🔴 Alta | `services/payments/index.ts` legacy consultava tabela `payments` inexistente. Foi REESCRITO mas precisa comunicação clara para devs |
| 🔴 Alta | Hooks legados (`useOfficeDashboard`, `useOfficeFinance`, `useAlerts`, `useCommissions`, etc.) ainda usam services legados — migrar para os novos |
| 🔴 Alta | Mutação `useCreateWalletTransaction` insere em `wallet_transactions` (sem schema) — provavelmente falha. Substituir por trigger no DB ou nova mutation usando `mlm.pontos_transacoes` |
| 🟡 Média | Backend `payments/` directory não existe — 5+ imports quebrados em `context-builder.ts` (`PaymentRepository`, `WalletService`, `BonusWalletService`) |
| 🟡 Média | Componentes admin (`gateway-management`, `financial-dashboard`, `bonus-configuration`) têm hard-coded mocks com TODOs vazios — rewrite ou remover |
| 🟢 Baixa | Hook `useUpdateWalletBalance` usa `supabase.from("wallets")` sem schema (incoerente com service) |
| 🟢 Baixa | `payment.handlers.ts` (backend) tem handlers full-TODO — implementar ou remover |

### 7. Estatísticas PAYMENTS

| Métrica | Valor |
|---------|-------|
| Services legacy com tabelas inexistentes | 5 (payments, wallets 등) destruídos/destruindo |
| Tabelas reais utilizadas | 9 confirmadas via SQL |
| Novos services criados | 5 |
| Novos hooks criados | 6 |
| Arquivos removidos (dead code) | 7 |
| Imports quebrados a corrigir (futuras sprints) | 5+ |

---

## DOMÍNIO: WALLETS (Carteiras)

### Status: A FAZER

---

## DOMÍNIO: MLM (Marketing Multinível)

### Status: A FAZER

---

## DOMÍNIO: NETWORK (Rede)

### Status: A FAZER

---

## DOMÍNIO: CRM

### Status: A FAZER

---

## Resumo Geral

| Domínio | Status | Implementação Oficial | Arquivos/Métodos Alterados |
|---------|--------|----------------------|-----------------------------|
| Customers | ✅ COMPLETO | CustomerService + Customer360Service | 5 (1 re-export + 4 hooks removidos) |
| Orders | ✅ COMPLETO | OrderService + 2 hooks | 5 (1 re-export + 1 componente + 1 utils + 1 hook legacy + 2 methods removidos) |
| Products | ✅ COMPLETO | ProductService (AllIn) + productsService (storefront) + hooks legacy e canônico | 3 arquivos removidos, 1 método duplicado removido, 2 consumers migrados |
| Plans | ✅ COMPLETO | PlanService (frontend) + PlanRepository (backend) | 4 arquivos removidos + 1 PlanRepository criado |
| Payments | ✅ REDESIGN CANÔNICO | 5 novos services (Payment/Withdrawal/Bonus/Points/PaymentMethod) usando 9 tabelas reais | 7 arquivos removidos, 10 novos arquivos (5 services + 5 hooks) |
| Payments | 🔄 A FAZER | - | - |
| Wallets | 🔄 A FAZER | - | - |
| MLM | 🔄 A FAZER | - | - |
| Network | 🔄 A FAZER | - | - |

---

*Documento gerado via Sprint 6 — Consolidação da Camada de Domínio (2026-07-07)*