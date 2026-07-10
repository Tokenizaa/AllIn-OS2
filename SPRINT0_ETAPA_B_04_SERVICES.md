# Sprint 0 — Etapa B #04: Engenharia Reversa — Frontend Services

## Objetivo
Mapear os 7 serviços frontend que consomem httpClient (Rota A), cruzar com backend routes e funções ausentes, e identificar bugs.

---

## 1. Serviços Frontend Rota A (via httpClient)

### 1.1 Mapa de Consumo

| Service | Arquivo | Funções httpClient | Backend Route Exists? | Usa supabase direto? |
|---------|---------|-------------------|----------------------|---------------------|
| **Customers** | `src/services/customers/index.ts` | `getCustomerById`, `getCustomerByCompradorId`, `getDownlines`, `getCustomersList`, `getCustomersWithOrderStats`, `getRecentCustomers`, `getNetworkMembers`, `getAnalyticsCustomers` | Parcial (list, recent, network, analytics não existem) | Não |
| **Orders** | `src/services/orders/index.ts` | `getOrders`, `getOrdersByComprador`, `getOfficeOrders`, `getRecentOrders`, `getOrderStats` | Sim | ⚠️ `fetchOrdersAndCustomers()` usa `supabase` sem import |
| **Payments** | `src/services/payments/index.ts` | `getPayments` (4x com limit diferente) | Sim | Não |
| **Plans** | `src/services/plans/index.ts` | `getPlans` | Sim | Não |
| **Products** | `src/services/products/index.ts` | `getProducts`, `getStoresProducts`, `getProductById` | Sim | Não |
| **Network** | `src/services/network/index.ts` | Nenhum (stub throws) | Sim | ⚠️ 4 métodos usam `supabase` sem import |
| **Auth** | `src/modules/auth/services/auth.service.ts` | **Nenhum** | N/A | Sim — `supabase.auth.*` |

### 1.2 Bugs Encontrados

#### 🚨 orders/index.ts — `supabase` usado sem import
`fetchOrdersAndCustomers()` (linhas 42-44) chama `supabase.from('orders')...` mas `supabase` nunca é importado. A única importação é `httpClient`. Causa: **ReferenceError em runtime** se a função for chamada.

#### 🚨 network/index.ts — `supabase` usado sem import (4 funções)
- `fetchRecentNetworkRelationships` (linha 10)
- `fetchSponsorRelationship` (linha 20)
- `fetchUplineRelationships` (linha 30)
- `countDirectRelationships` (linha 40)

Todas usam `supabase.from('network_relationships')...` mas `supabase` nunca é importado. Causa: **ReferenceError em runtime** se qualquer uma for chamada.

#### 🚨 network/index.ts — `fetchNetworkRelationships` é stub
Linhas 4-6: sempre lança erro com `"not yet implemented"`.

#### 🚨 bonus.functions.ts — `activePlan` não definido
Linha 80: `const activePlanResult = await getActiveCustomerPlanApi({ customerId })`
Linha 85: `const planId = activePlan.plan_id` — **`activePlan` não existe**, deveria ser `activePlanResult.data.plan_id`.

---

## 2. Funções `*Api` Inexistentes (5 funções)

Todas em `src/lib/api/plans.functions.ts` e `src/lib/api/bonus.functions.ts`:

| Função | Chamada em | Impacto |
|--------|-----------|---------|
| `getPlansApi` | plans.functions.ts:10 | ReferenceError |
| `getCustomerPlansApi` | plans.functions.ts:206 | ReferenceError |
| `deactivateCustomerPlanApi` | plans.functions.ts:196 | ReferenceError |
| `getPlanStatsApi` | plans.functions.ts:239 | ReferenceError |
| `getActiveCustomerPlanApi` | bonus.functions.ts:80 | ReferenceError |

**Padrão:** `<nome>Api` — sugere refatoração anterior que removeu essas funções sem atualizar as chamadas.

---

## 3. Segurança: Backend com ANON KEY

### 3.1 Backend usando `supabase` (anon key) — 7 repositórios industriais
Repositórios que importam `supabase` (pública) de `@/lib/supabase/client` para operações CRUD:

| Repositório | Operações |
|-------------|-----------|
| `timing-measurements.repository.ts` | CRUD (create, update, delete) |
| `machine-maintenance.repository.ts` | CRUD |
| `process-steps.repository.ts` | CRUD |
| `process-documents.repository.ts` | CRUD |
| `machine-photos.repository.ts` | CRUD |
| `machine-documents.repository.ts` | CRUD |
| `capacity-history.repository.ts` | CRUD |

**Risco:** Operações usando chave anônima → sujeitas a RLS. Se RLS não permitir escrita, operações falham silenciosamente (403). Devem usar `getBackendClient()` (service_role) como os demais repositórios.

### 3.2 Backend usando `getBackendClient()` (service_role) — ✅ correto
- `infra/database/base.repository.ts` — base de ~20 módulos
- `auth/services/auth.service.ts` — admin client
- `payments/services/fraud-detection.service.ts` (mas import quebrado)

### 3.3 Backend usando `getFrontendClient()` (anon key) — ✅ adequado
- `server/middleware/auth.middleware.ts` — só verifica sessão do usuário
- `auth/services/auth.service.ts` — operações auth (signIn, signUp, signOut)

---

## 4. Próximas Investigações

1. **Etapa B #06:** Mapear hooks + providers que consomem services
2. **Etapa B #07:** Mapear TanStack Router routes vs backend routes registradas
