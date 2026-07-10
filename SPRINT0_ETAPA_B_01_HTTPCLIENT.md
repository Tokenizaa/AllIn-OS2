# Sprint 0 — Etapa B: Engenharia Reversa — Ficha #01: httpClient

> **Regra:** Nenhuma conclusão sobre morte ou remoção. Apenas mapeamento de existência, uso e dependências.

---

## 1. Identificação

| Campo | Valor |
|-------|-------|
| **Artefato** | `httpClient` — classe `HttpClient` + instância singleton |
| **Arquivo** | `src/lib/api-client/http-client.ts` |
| **Linhas** | 497 |
| **Barrel** | `src/lib/api-client/index.ts` (1 linha: `export { httpClient } from "./http-client"`) |

## 2. Definição

Classe que encapsula `fetch()` para comunicação com backend Express em `localhost:3001`.

```typescript
// Linha 42-496: class HttpClient { ... }
// Linha 497:
export const httpClient = new HttpClient(BASE_URL);
```

**Mecanismo de autenticação (linhas 53-62):**
```typescript
private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        return { ...this.defaultHeaders, Authorization: `Bearer ${session.access_token}` };
    }
    return this.defaultHeaders;
}
```

**Depende de:**
- `@/lib/supabase/client` — para obter token JWT da sessão Supabase
- `@/shared/types/api.types` — 12 tipos importados (ApiResponse, Customer, Order, etc.)
- `import.meta.env.VITE_BACKEND_URL` — URL base do backend (fallback: `http://localhost:3001`)

## 3. Endpoints Declarados

| Categoria | Métodos httpClient | Backend route existe? |
|-----------|-------------------|----------------------|
| Auth | login, register, refreshToken, changePassword, logout | ✅ `server/routes/auth.ts` |
| Customers | CRUD + getCustomerStats + getCustomer360 + getDownlines + getByComprador + getCustomersList + getRecentCustomers + getNetworkMembers + getAnalyticsCustomers + getCustomerBonus + getCustomerPlan | ✅ Parcial (faltam: comprador, list, recent, network, analytics, bonus, plan) |
| Plans | CRUD + getPlanBonuses + create/deletePlanBonus + activate/deactivateCustomerPlan + getCustomerPlans + getActiveCustomerPlan + getPlanStats + getAllPlanStats | ✅ Completo |
| Orders | CRUD + getOrderSummary + getOrderItems + getOrderStats + getByComprador + getOfficeOrders + getOrdersAndCustomers + getRecentOrders | ✅ Completo |
| Payments | CRUD + getPaymentById + processPaymentWebhook + getPaymentStats | ✅ Completo |
| Products | getProducts + getProductById + getStoresProducts | ✅ (mas sem wallet/MLM) |
| Network | getNetworkTree + getDownlines + getUpline + getNetworkStats | ✅ Completo |
| Analytics | getExecutiveAnalytics + getSalesAnalytics + getNetworkAnalytics + getPlanAnalytics + getPlanAnalyticsById + getBonusDistribution | ✅ Completo |
| Wallet | getWalletBalance + getWalletTransactions + ensureWallet + creditWallet + debitWallet + freezeWallet + unfreezeWallet | ❌ **Inexistente** (0 arquivos em backend/server/routes/) |
| Bonus Wallet | getBonusWalletBalance + getBonusTransactions + ensureBonusWallet | ❌ Mesmo problema |
| Points Wallet | getPointsWalletBalance + getPointsTransactions + ensurePointsWallet | ❌ Mesmo problema |
| MLM | simulateCommission | ❌ Inexistente |

## 4. Cadeia de Consumo (Quem → Quem → Quem)

### 4.1 Consumidores Diretos (importam httpClient diretamente)

| Arquivo | Funções que usam httpClient |
|---------|----------------------------|
| `src/services/customers/index.ts` | fetchCustomerById, fetchCustomerByCompradorId, getDownlines, getCustomersList, getCustomersWithOrderStats, getRecentCustomers, getNetworkMembers, getAnalyticsCustomers |
| `src/services/orders/index.ts` | fetchOrders, fetchOrdersByComprador, fetchOrdersPaged, fetchOfficeOrders, fetchRecentOrders, fetchOrderStats, fetchOrdersAndCustomers |
| `src/services/payments/index.ts` | fetchPayments (3 overloads), fetchPaymentById |
| `src/services/plans/index.ts` | fetchPlans |
| `src/services/products/index.ts` | fetchProducts, fetchStoresProducts, fetchProductById |
| `src/services/wallets/index.ts` | fetchWalletBalance, fetchPointsWalletBalance, ensureWallet, ensurePointsWallet |
| `src/services/network/index.ts` | fetchNetworkTree, fetchDownlines, fetchUpline, fetchNetworkStats |
| `src/lib/api/wallet.functions.ts` | getWalletBalance, getWalletTransactions, ensureWallet, creditWallet, debitWallet |
| `src/lib/api/bonus-wallet.functions.ts` | getBonusWalletBalance, getBonusTransactions, ensureBonusWallet |
| `src/lib/api/points-wallet.functions.ts` | getPointsWalletBalance, getPointsTransactions, ensurePointsWallet |
| `src/lib/api/payment.functions.ts` | getCustomerPayments |
| `src/lib/api/plans.functions.ts` | (indireto — chama getPlansApi etc. que não existem) |

### 4.2 Consumidores Indiretos (hooks → services → httpClient)

| Hook | Service(s) | Route/Component |
|------|-----------|-----------------|
| `hooks/customers/useCustomer.ts` | CustomerService | `_app/customers/$id.tsx` |
| `hooks/customers/useCustomer360.ts` | CustomerService, OrderService, WalletService | `_app/customers/$id.tsx` |
| `hooks/customers/useCustomers.ts` | CustomerService | `_app/customers/$id.tsx` |
| `hooks/orders/useOrders.ts` | OrderService | `_app/orders/index.tsx` |
| `hooks/orders/useOrderList.ts` | OrderService | `_app/orders/index.tsx` |
| `hooks/payments/usePayments.ts` | PaymentService | `_app/commissions` |
| `hooks/plans/usePlans.ts` | PlanService | `office/PlanPage.tsx`, `office/plan.tsx` |
| `hooks/products/useProducts.ts` | ProductService | `office/StorePage.tsx`, `office/store.tsx` |
| `hooks/products/useProductDetail.ts` | ProductService | (rota produto/$id) |
| `hooks/network/useNetwork.ts` | NetworkService, CustomerService | `_app/genealogy.tsx` |
| `hooks/network/useNetworkMembers.ts` | NetworkService, CustomerService | `_app/genealogy.tsx` |
| `hooks/office/useOfficeDashboard.ts` | OrderService, PaymentService, CustomerService, WalletService, ProductService | `office/*` |
| `hooks/office/useOfficeFinance.ts` | WalletService | `office/*` |
| `hooks/wallets/useWithdrawals.ts` | WalletService | (componente) |
| `hooks/wallets/useWalletData.ts` | wallet.functions, bonus-wallet.functions, points-wallet.functions | (componente) |
| `hooks/wallets/useWalletActions.ts` | wallet.functions | (componente) |
| `hooks/alerts/useAlerts.ts` | PaymentService, WalletService, OrderService | (componente) |
| `hooks/analytics/useAnalytics.ts` | CustomerService | (componente) |
| `hooks/commissions/useCommissions.ts` | PaymentService, PlanService, CustomerService | `_app/commissions` |
| `hooks/plans/usePlanBonuses.ts` | plans.functions | (componente) |
| `hooks/plans/usePlanAnalytics.ts` | plans.functions | (componente) |
| `hooks/mutations/wallets/useCreateWallet.ts` | wallet.functions | (mutation) |
| `hooks/mutations/wallets/useCreatePointsWallet.ts` | points-wallet.functions | (mutation) |
| `components/payments/payment-history.tsx` | payment.functions | (componente) |
| `components/plans/MLMCommissionSimulator.tsx` | bonus.functions | (componente) |

### 4.3 Consumidores que NÃO usam httpClient (rota B — supabase direto)

| Service | Acesso |
|---------|--------|
| `services/cartService.ts` | supabase direto |
| `services/productsService.ts` | supabase direto |
| `services/profiles/index.ts` | supabase direto |
| `services/customer360/index.ts` | supabase direto |
| `services/crm360/index.ts` | supabase direto |
| `services/finance360/index.ts` | supabase direto |
| `services/mlm360/index.ts` | supabase direto |
| `services/profile360/index.ts` | supabase direto |
| `services/industrial.service.ts` | supabase direto |
| `services/leads/index.ts` | supabase direto |
| `services/automations.ts` | supabase direto |
| `services/documents.ts` | supabase direto |
| `services/customer-notes.ts` | supabase direto |
| `services/commissions.ts` | supabase direto |
| `services/featureFlags.ts` | supabase direto |
| `services/referralTrackingService.ts` | supabase direto |

### 4.4 Barrel Export

`src/lib/api-client/index.ts` exporta `httpClient` mas **ninguém importa deste barrel**. Todos os 11 consumidores importam diretamente de `@/lib/api-client/http-client`.

## 5. Anomalias Encontradas

### 5.1 Funções Chamadas que Não Existem (Runtime Error)

Em `src/lib/api/plans.functions.ts` e `bonus.functions.ts`:

| Função | Chamada em | Definida em | Status |
|--------|-----------|-------------|--------|
| `getPlansApi` | plans.functions.ts:10 | Em lugar nenhum | ❌ **ReferenceError** |
| `getCustomerPlansApi` | plans.functions.ts:206 | Em lugar nenhum | ❌ **ReferenceError** |
| `deactivateCustomerPlanApi` | plans.functions.ts:196 | Em lugar nenhum | ❌ **ReferenceError** |
| `getPlanStatsApi` | plans.functions.ts:239 | Em lugar nenhum | ❌ **ReferenceError** |
| `getActiveCustomerPlanApi` | bonus.functions.ts:80 | Em lugar nenhum | ❌ **ReferenceError** |

**Observação:** O padrão `<nome>Api` sugere que essas funções existiam em uma versão anterior do código e foram removidas durante alguma refatoração, mas as referências não foram atualizadas.

### 5.2 Endpoints sem Rota no Backend

| Endpoint httpClient | Rota no backend | Impacto |
|--------------------|----------------|---------|
| `/api/wallets/*` (9 métodos) | ❌ Inexistente | 404 |
| `/api/mlm/simulate` | ❌ Inexistente | 404 |

### 5.3 Rotas no Backend sem Uso no httpClient

| Rota no backend | Usada por httpClient? |
|-----------------|----------------------|
| `/api/distributors/*` | ❌ Não (usa CustomerService/NetworkService) |

### 5.4 Duplicação no Próprio httpClient

| Método 1 | Método 2 | Diferença |
|----------|----------|-----------|
| `getWalletTransactions(idComprador, params)` | `getPointsTransactions(idComprador, params)` | Mesmo endpoint |
| `ensureWallet(idComprador)` | `ensurePointsWallet(idComprador)` | Mesmo endpoint |
| `getWalletBalance` | `getPointsWalletBalance` / `getBonusWalletBalance` | Endpoints diferentes mas conceito similar |

### 5.5 Duplicação de Wallet Functions (lib/api/)

| Arquivo | Métodos | Chamam no httpClient |
|---------|---------|---------------------|
| `wallet.functions.ts` | getWalletBalance, getWalletTransactions, ensureWallet, creditWallet, debitWallet | `getWalletBalance`, `getWalletTransactions`, `ensureWallet`, `creditWallet`, `debitWallet` |
| `bonus-wallet.functions.ts` | getBonusWalletBalance, getBonusTransactions, ensureBonusWallet | `getPointsWalletBalance` (**nome errado**), `getWalletTransactions`, `ensurePointsWallet` |
| `points-wallet.functions.ts` | getPointsWalletBalance, getPointsTransactions, ensurePointsWallet | `getPointsWalletBalance`, `getWalletTransactions`, `ensurePointsWallet` |

`bonus-wallet.functions.ts` chama `getPointsWalletBalance` (mesmo método de points-wallet) — provavelmente erro de cópia.

## 6. Status do Artefato

| Indicador | Valor |
|-----------|-------|
| **Vivo** | ✅ Sim — 7 services + 5 function files chamam httpClient ativamente |
| **Morto** | ❌ Não |
| **Rota A (httpClient)** | ~22 hooks + dezenas de componentes dependem indiretamente |
| **Rotas sem backend** | Wallets e MLM — chamariam httpClient e receberiam 404 |
| **Funções quebradas** | 5 funções `*Api` chamadas mas não definidas |
| **Plano de migração?** | Evidência de possível plano abandonado (serviços 360 foram para supabase direto) |

## 7. Perguntas Pendentes

- [ ] Por que `lib/api/*.functions.ts` existe paralelamente a `services/*/index.ts`? Ambos chamam httpClient.
- [ ] Os serviços 360 (customer360, crm360, mlm360, finance360, profile360) são a "nova" rota que substituiu httpClient?
- [ ] As funções `*Api` que não existem — foram removidas acidentalmente ou faziam parte de um módulo desativado?
- [ ] O backend tem rota `/api/distributors` que não é chamada pelo httpClient — quem a consome? (scripts? sync?)
