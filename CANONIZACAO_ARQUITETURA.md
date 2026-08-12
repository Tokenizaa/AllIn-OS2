# CANONIZAÇÃO DA ARQUITETURA

> Sprint 1 — Propósito: Descobrir a implementação oficial (Fonte da Verdade) de cada domínio.

## Metodologia

Para cada domínio:

1. **Mapear todas as implementações existentes**
2. **Rastrear fluxo completo** (quem inicia → quem chama → quem executa)
3. **Identificar consumidores** (quem importa, quem depende)
4. **Identificar duplicados** (implementações concorrentes do mesmo conceito)
5. **Avaliar completude** (qual está mais completa / em uso real)
6. **Declarar status: CANÔNICO | LEGADO | DUPLICADO | MORTO**

---

## MAPA GERAL

```
src/
├── modules/          → Domínios canônicos + MLM engine (7 módulos)
│   ├── auth/         ✅ CANÔNICO
│   ├── plans/        ✅ CANÔNICO (mlm-rules.ts REMOVIDO)
│   └── mlm-engine/   ✅ CANÔNICO (8 submódulos)
│
├── services/         → Domínios de dados (camada de acesso a dados)
│   ├── customers/    ✅ CANÔNICO
│   ├── orders/       ✅ CANÔNICO
│   ├── plans/        ✅ CANÔNICO (DB-driven)
│   ├── products/     ✅ CANÔNICO (dual: AllIn + Commerce)
│   ├── checkout/     ✅ CANÔNICO
│   ├── cart/         ✅ CANÔNICO
│   ├── wallets/      ❌ LEGADO (monolítico, sendo substituído)
│   ├── withdrawals/  ✅ CANÔNICO (Sprint 6)
│   ├── payments/     ✅ CANÔNICO (Sprint 6)
│   ├── points/       ✅ CANÔNICO (Sprint 6)
│   ├── bonus/        ✅ CANÔNICO (Sprint 6)
│   ├── payment-methods/ ✅ CANÔNICO
│   ├── network/      ✅ CANÔNICO (lightweight facade)
│   ├── commissions/  ❌ DUPLICADO (MLM engine tem o canônico) — MIGRADO
│   ├── crm360/       ❌ DUPLICADO (Customer360 agrega)
│   ├── customer360/  ✅ CANÔNICO (customer aggregation)
│   ├── marketing/    ✅ CANÔNICO
│   ├── analytics/    ✅ CANÔNICO
│   ├── industrial/   ✅ CANÔNICO
│   ├── system/       ✅ CANÔNICO
│   ├── profiles/     ❌ LEGADO (duplicata de auth) — MIGRADO
│   └── mlm-engine.ts ✅ CANÔNICO (facade do MLM engine)
│
├── hooks/            → Ponte entre UI e dados (React Query)
│   ├── customers/    → customers service
│   ├── orders/       → orders service
│   ├── plans/        → plans service
│   ├── products/     → products service (dual)
│   ├── cart/         → cart + auth
│   ├── wallets/      → wallets service (LEGADO) — PARCIALMENTE MIGRADO
│   ├── payments/     → payments service (Sprint 6)
│   ├── withdrawals/  → withdrawals service (Sprint 6)
│   ├── points/       → points service (Sprint 6)
│   ├── bonus/        → bonus service (Sprint 6)
│   ├── network/      → network service
│   ├── referral/     → referral-tracking service
│   ├── commissions/  → commissions service (DUPLICADO)
│   ├── commission/   → commission-summary service
│   ├── mlm/          → customer360 + mlm engine
│   ├── profiles/     → profiles service (LEGADO)
│   ├── marketing/    → marketing service
│   ├── analytics/    → analytics + orders + customers
│   └── distributor/  → supabase service
│
├── components/       → UI components
└── routes/           → TanStack Router (fonte da verdade de navegação)
```

---

## DOMÍNIO: AUTH ✅ CANÔNICO

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/modules/auth/` | Módulo completo (context + hooks + services + guards + permissions) | **CANÔNICO** |
| 2 | `src/services/profiles/index.ts` | Service avulso (ProfileService) | **DUPLICADO PARCIAL** |
| 3 | `src/api/client.ts` | HTTP Client p/ API AllInBrasil (OAuth2 externo) | **NÃO RELACIONADO** |
| 4 | `src/lib/supabase/client.ts` | Cliente Supabase (base p/ todos) | **INFRAESTRUTURA** |

### Fluxo completo

```
Rota Pública (/login, /cadastro, /recuperar-senha, /redefinir-senha, /auth/invite/:token)
  │
  ▼
useAuth() ← src/modules/auth/hooks/useAuth.ts
  │
  ▼
AuthContext ← src/modules/auth/context/AuthContext.tsx
  │
  ▼
AuthProvider ← src/modules/auth/context/AuthProvider.tsx
  │
  ├─ AuthService.login()      → supabase.auth.signInWithPassword()
  ├─ AuthService.register()   → supabase.auth.signUp() + crm.customers.insert()
  ├─ AuthService.logout()     → supabase.auth.signOut()
  ├─ ProfileService.updateProfile() → crm.customers.update()
  │
  ▼
SupabaseService.fetchUserProfile() → crm.customers.select() + RoleResolver.getUserRole()
  │
  ▼
RoleResolver.getUserRole() → crm.user_roles_view → identity.user_roles
```

### Proteção de Rotas

```
RouteGuard (src/modules/auth/guards/RouteGuard.tsx)
  ├─ useAuth() → verifica autenticação
  ├─ usePermissions() → verifica permissão por módulo/ação
  └─ DashboardResolver.getDashboardPathForUser() → redireciona por role
```

### Consumidores de `modules/auth`

| Consumidor | O que usa |
|------------|-----------|
| `src/routes/__root.tsx:39` | `<AuthProvider>` (wrapper raiz) |
| `src/routes/_app.tsx:15` | `<RouteGuard>` (proteção admin) |
| `src/routes/cadastro.tsx:7` | `useAuth()` → register |
| `src/routes/auth.invite.$token.tsx:6` | `useAuth()` → getAdminInviteByToken / acceptAdminInvite |
| `src/components/auth/login-view.tsx:9-11` | `useAuth()` → login + DashboardResolver |
| `src/components/app/public-header.tsx:10` | `DashboardResolver` |
| `src/components/Footer.tsx:7` | `DashboardResolver` |
| `src/components/UserMenu.tsx:8` | `DashboardResolver` |
| `src/hooks/cart/useCartQuery.ts:3` | `useAuth()` → user |
| `src/hooks/distributor/useDistributorQuery.ts:3` | `SupabaseService` |
| `src/routes/seja-distribuidor.$slug.tsx:4` | `SupabaseService` |
| `src/routes/ativacao.tsx:5` | `SupabaseService` |
| `src/routes/index.tsx:15` | `DashboardResolver` |

### Duplicado: `src/services/profiles/index.ts`

- `fetchUserProfile()` duplica `SupabaseService.fetchUserProfile()`
- `fetchMyProfile()` duplica lógica de `SupabaseService`
- `fetchProfiles()` / `fetchDistributors()` / etc. — lógica extra não existente em `modules/auth`

**Consumidores:** `useMyProfile.ts`, `useOfficeDashboard.ts`

**Status: DUPLICADO PARCIAL** — Migrar consumidores para `modules/auth`, depois REMOVER.

### Declaração

```json
{
  "domain": "AUTH",
  "canonical": "src/modules/auth",
  "status": "CANÔNICO",
  "legado": [
    {
      "path": "src/services/profiles/index.ts",
      "reason": "Duplicata parcial de SupabaseService.fetchUserProfile(). Consumido por 2 hooks.",
      "action": "Migrar consumidores para modules/auth, depois REMOVER"
    }
  ],
  "morto": [],
  "nao_relacionado": ["src/api/client.ts — HTTP client AllInBrasil"]
}
```

---

## DOMÍNIO: CUSTOMERS ✅ CANÔNICO

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/customers/index.ts` | CustomerService (CRUD + stats) | **CANÔNICO** |
| 2 | `src/services/customer360/index.ts` | Customer360Service (agrega dados) | **CANÔNICO** |
| 3 | `src/services/crm360/` | CRM services (automations, documents, notes) | **CANÔNICO** |
| 4 | `src/hooks/customers/` | useCustomers + useCustomer360New | **PONTE CANÔNICA** |
| 5 | `src/components/customers/` | Customer tabs (profile, network, orders, wallet, etc.) | **UI CANÔNICA** |

### Fluxo

```
Páginas: customers.tsx, customers.$id.tsx
  │
  ▼
useCustomers() → CustomerService (CRUD básico)
useCustomer360New() → Customer360Service (dados agregados)
  │
  ▼
CustomerService.getCustomerById()       → crm.customers
CustomerService.getMyCustomers()        → crm.customers (filtrado)
CustomerService.getCustomerDownline()   → rede (via views)
CustomerService.getCustomerStats()      → agregado
Customer360Service.fetchCustomer360()   → múltiplas fontes
  │
  ▼
crm360/ → automations, documents, notes (CRUD de entidades relacionadas)
```

### Observações

- Customer360 **agrega** dados de customers + orders + network + wallet. É uma camada de projeção, não duplicação.
- CRM360 são serviços auxiliares de entidades filhas (documentos, notas, automações).
- NÃO há módulo em `src/modules/` — customers vive em services + components.

### Declaração

```json
{
  "domain": "CUSTOMERS",
  "canonical": "src/services/customers/index.ts",
  "canonical_aggregator": "src/services/customer360/index.ts",
  "canonical_aux": ["src/services/crm360/"],
  "status": "CANÔNICO",
  "legado": [],
  "morto": [],
  "observacao": "Nao ha modulo dedicado. O dominio vive em services (dados) + components (UI). Consistente."
}
```

---

## DOMÍNIO: ORDERS ✅ CANÔNICO

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/orders/index.ts` | OrderService + CheckoutRules + OfficeRules + EarningsRules | **CANÔNICO** |
| 2 | `src/services/cart/index.ts` | CartService (CRUD carrinho) | **CANÔNICO (separado)** |
| 3 | `src/hooks/orders/useOrders.ts` | Hook de consulta de pedidos | **PONTE CANÔNICA** |
| 4 | `src/hooks/orders/useOrderList.ts` | Hook de listagem de pedidos | **PONTE CANÔNICA** |
| 5 | `src/hooks/cart/useCartQuery.ts` | Hook de carrinho | **PONTE CANÔNICA** |

### Fluxo

```
Páginas de pedidos (orders.tsx, orders.$id.tsx, admin/orders.tsx)
  │
  ▼
useOrders() / useOrderList() → OrderService
useCartQuery() / useCart() → CartService
  │
  ▼
OrderService:
  ├─ fetchOrders() / fetchOrderById() → commerce.pedidos
  ├─ createOrder() → commerce.pedidos INSERT
  ├─ getCheckoutRules() → regras de negócio
  ├─ getOfficeRules() → regras de escritório
  └─ getEarningsRules() → regras de comissionamento
```

### Observações

- OrderService é um service monolítico que incorpora regras de negócio (CheckoutRules, OfficeRules, EarningsRules).
- CartService é separado e focado em carrinho.
- NÃO há módulo em `src/modules/` para orders.

### Declaração

```json
{
  "domain": "ORDERS",
  "canonical": "src/services/orders/index.ts",
  "canonical_cart": "src/services/cart/index.ts",
  "status": "CANÔNICO",
  "legado": [],
  "morto": []
}
```

---

## DOMÍNIO: PLANS ✅ CANÔNICO (mlm-rules.ts REMOVIDO)

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/plans/index.ts` | PlanService (CRUD DB-driven) | **CANÔNICO** |
| 2 | `src/hooks/plans/usePlans.ts` | usePlans() → PlanService | **PONTE CANÔNICA** |
| 3 | `src/hooks/plans/usePlanBonuses.ts` | usePlanBonuses() → PlanService | **PONTE CANÔNICA** |
| 4 | `src/hooks/plans/usePlanAnalytics.ts` | usePlanAnalytics() → PlanService | **PONTE CANÔNICA** |
| 5 | `src/components/plans/` | PlansDashboard, PlanCard, UpgradeSuggestions, etc. | **UI CANÔNICA** |

### Resolução do Conflito

**`src/modules/plans/mlm-rules.ts` REMOVIDO** — Investigação confirmou **ZERO consumidores** ativos. Todas as 13 ocorrências de grep apontavam apenas para o próprio arquivo. Funcionalidade 100% substituída por:
- `PlanService.getPlanBonuses()` → consulta `mlm.bonus_regras`
- `CommissionModule.calculateCommission()` → cálculo de comissões
- `BonusService.fetchActiveRules()` → regras de bônus ativas

### Declaração

```json
{
  "domain": "PLANS",
  "canonical": "src/services/plans/index.ts",
  "reason": "PlanService consulta public.plans + public.plan_bonus_rules no DB. Fonte da verdade de dados.",
  "status": "CANÔNICO",
  "conflito": {
    "path": "src/modules/plans/mlm-rules.ts",
    "status": "REMOVIDO — dead code confirmado (0 consumidores)",
    "action": "Deletado"
  },
  "morto": []
}
```

---

## DOMÍNIO: PRODUCTS ✅ CANÔNICO (designed dual)

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/products/index.ts` | ProductService → `public.products` (AllIn) | **CANÔNICO (AllIn)** |
| 2 | `src/services/products/index.ts` | productsService → `commerce.produtos` (storefront) | **CANÔNICO (Commerce)** |
| 3 | `src/hooks/products/useProducts.ts` | ProductService | **PONTE CANÔNICA** |
| 4 | `src/hooks/products/useProductsQuery.ts` | productsService | **PONTE CANÔNICA** |
| 5 | `src/hooks/products/useProductDetail.ts` | ProductService | **PONTE CANÔNICA** |
| 6 | `src/components/features/products/` | ProductGallery | **UI CANÔNICA** |

### Fluxo

```
ProductService:  public.products (produtos AllIn — planos, kits)
productsService: commerce.produtos (produtos de e-commerce)
```

### Declaração

```json
{
  "domain": "PRODUCTS",
  "canonical_1": {
    "path": "src/services/products/index.ts (ProductService)",
    "table": "public.products",
    "purpose": "Produtos AllIn (planos, kits, industrial)"
  },
  "canonical_2": {
    "path": "src/services/products/index.ts (productsService)",
    "table": "commerce.produtos",
    "purpose": "Produtos de e-commerce (storefront)"
  },
  "status": "CANÔNICO (dual, by design)",
  "legado": [],
  "morto": []
}
```

---

## DOMÍNIO: CHECKOUT ✅ CANÔNICO

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/checkout/index.ts` | CheckoutService (validate, complete, update address) | **CANÔNICO** |
| 2 | `src/services/cart/index.ts` | CartService (CRUD carrinho) | **CANÔNICO** |
| 3 | `src/hooks/cart/useCartQuery.ts` | Hook carrinho | **PONTE CANÔNICA** |

### Fluxo

```
CheckoutService:
  ├─ validateCheckout() → valida dados do pedido
  ├─ completeCheckout() → finaliza pedido (integra cart + customer + payment)
  └─ updateCheckoutAddress() → atualiza endereço
```

### Declaração

```json
{
  "domain": "CHECKOUT",
  "canonical": "src/services/checkout/index.ts",
  "cart": "src/services/cart/index.ts",
  "status": "CANÔNICO",
  "legado": [],
  "morto": []
}
```

---

## DOMÍNIO: WALLET / FINANCE ✅ MIGRAÇÃO SPRINT 6 CONCLUÍDA

### Implementações encontradas (estado final)

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/wallets/index.ts` | WalletService (monolítico: wallet + points + bonus + withdrawals) | **REMOVIDO** |
| 2 | `src/services/withdrawals/index.ts` | WithdrawalService (Sprint 6) | **CANÔNICO** |
| 3 | `src/services/payments/index.ts` | PaymentService (Sprint 6) | **CANÔNICO** |
| 4 | `src/services/points/index.ts` | PointsService (Sprint 6) | **CANÔNICO** |
| 5 | `src/services/bonus/index.ts` | BonusService (Sprint 6) | **CANÔNICO** |
| 6 | `src/services/payment-methods/index.ts` | PaymentMethodService | **CANÔNICO** |
| 7 | `src/modules/mlm-engine/wallet.module.ts` | MLM engine wallet ops | **CANÔNICO (engine)** |
| 8 | `src/modules/mlm-engine/points.module.ts` | MLM engine points ops | **CANÔNICO (engine)** |
| 9 | `src/hooks/wallets/` | useWalletData, useWalletActions, useWithdrawals | **MIGRADOS** |
| 10 | `src/hooks/payments/usePayments.ts` | → PaymentService | **PONTE CANÔNICA** |
| 11 | `src/hooks/points/usePoints.ts` | → PointsService | **PONTE CANÔNICA** |
| 12 | `src/hooks/bonus/useBonus.ts` | → BonusService | **PONTE CANÔNICA** |
| 13 | `src/hooks/withdrawals/useWithdrawals.ts` | → WithdrawalService | **PONTE CANÔNICA** |

### Ações Executadas (Sprint 6 - Completa)

1. **`WithdrawalService` completado** — Adicionados `fetchRecentWithdrawals()` e `fetchWithdrawalsByDistribuidor()` (faltavam e eram chamados por hooks)
2. **Migrados hooks de withdrawal:**
   - `useAlerts.ts` → `WithdrawalService.fetchRecentWithdrawals()`
   - `useOfficeDashboard.ts` → `WithdrawalService.fetchRecentWithdrawals()`
   - `useOfficeFinance.ts` → `WithdrawalService.fetchRecentWithdrawals()`
3. **Migrados hooks de wallet:**
   - `useWalletData.ts` → `MlmEngineService.wallet.getBalance()` + `PointsService` + `BonusService`
   - `useWalletActions.ts` → `MlmEngineService.wallet.addFunds()/withdraw()`
   - `useCreateWallet.ts` → `MlmEngineService.wallet.getBalance()` (ensure wallet exists)
   - `useCreatePointsWallet.ts` → `PointsService.fetchPointsByDistribuidor()`
   - `useUpdateWalletBalance.ts` → `MlmEngineService.wallet` (diff-based addFunds/withdraw)
   - `useCreateWalletTransaction.ts` → `MlmEngineService.wallet.addFunds()/withdraw()`
   - `useWalletTransactions.ts` (customers) → `MlmEngineService.wallet.addFunds()/withdraw()`
4. **`wallet-dashboard.tsx`** → `canWithdraw()` movido para função local
5. **`services/wallets` REMOVIDO** — Monolítico eliminado

### Declaração Final

```json
{
  "domain": "WALLET_FINANCE",
  "status": "MIGRAÇÃO CONCLUÍDA",
  "canonical": [
    "src/services/withdrawals/index.ts",
    "src/services/payments/index.ts",
    "src/services/points/index.ts",
    "src/services/bonus/index.ts",
    "src/services/payment-methods/index.ts",
    "src/modules/mlm-engine/wallet.module.ts",
    "src/modules/mlm-engine/points.module.ts"
  ],
  "morto": [
    "src/services/wallets/index.ts — REMOVIDO"
  ]
}
```

---

## DOMÍNIO: NETWORK ✅ CANÔNICO (com MLM engine)

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/network/index.ts` | NetworkService (relacionamentos, sponsor, downlines) | **CANÔNICO (facade)** |
| 2 | `src/services/network/referral-tracking.ts` | Referral tracking service | **CANÔNICO** |
| 3 | `src/modules/mlm-engine/network.module.ts` | MLM engine network module | **CANÔNICO (engine)** |
| 4 | `src/modules/mlm-engine/` | Full MLM engine (8 módulos) | **CANÔNICO** |
| 5 | `src/services/mlm-engine.ts` | Facade do MLM engine | **CANÔNICO** |
| 6 | `src/hooks/network/useNetwork.ts` | Hook de rede | **PONTE CANÔNICA** |
| 7 | `src/hooks/mlm/useMLM360.ts` | Hook MLM | **PONTE CANÔNICA** |

### Arquitetura

```
services/network/index.ts (facade leve)
  ├─ getSponsor() / getDownlines() → consultas simples
  └─ getNetworkTree() → arvore da rede

modules/mlm-engine/ (engine completa — 8 módulos)
  ├─ network.module.ts   → hierarquia, patrocínio, pontos
  ├─ commission.module.ts → cálculo de comissões
  ├─ bonus.module.ts     → cálculo de bônus
  ├─ payout.module.ts    → processamento de pagamentos
  ├─ points.module.ts    → gestão de pontos
  ├─ wallet.module.ts    → operações de carteira (MLM)
  ├─ qualification.module.ts → qualificações
  └─ plan.module.ts      → regras de planos (MLM)

services/mlm-engine.ts → Facade que unifica todos os módulos do MLM engine
```

### Relação

- `services/network` é uma **facade leve** para consultas simples de rede.
- `modules/mlm-engine` é o **motor canônico** de cálculos complexos (comissões, bônus, payout, qualificação).
- `services/mlm-engine.ts` é a **facade** que expõe o MLM engine de forma unificada.

### Declaração

```json
{
  "domain": "NETWORK",
  "canonical_facade": "src/services/network/index.ts",
  "canonical_engine": "src/modules/mlm-engine/",
  "canonical_facade_engine": "src/services/mlm-engine.ts",
  "status": "CANÔNICO",
  "legado": [],
  "morto": []
}
```

---

## DOMÍNIO: COMMISSION ✅ MIGRADO PARA MLM ENGINE

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/commissions/index.ts` | CommissionService (CRUD + queries avançadas) | **DUPLICADO — MIGRADO** |
| 2 | `src/services/commissions/summary-service.ts` | CommissionSummaryService | **DUPLICADO** |
| 3 | `src/modules/mlm-engine/commission.module.ts` | MLM engine commission module | **CANÔNICO** |
| 4 | `src/modules/mlm-engine/bonus.module.ts` | MLM engine bonus module | **CANÔNICO** |
| 5 | `src/hooks/commissions/useCommissions.ts` | useCommissions() → CommissionService | **PONTE MIGRADA** |
| 6 | `src/hooks/commission/useCommissionSummary.ts` | useCommissionSummary() → CommissionSummaryService | **PONTE MIGRADA** |

### Ações Executadas

1. **Adicionado ao `CommissionModule` (MLM engine):**
   - `runCycle()` — processa ciclo de comissões via RPC
   - `simulateCommission()` — simula comissão para vendedor/valor

2. **Migrado consumidores:**
   - `src/routes/_app/commissions.tsx` → `MlmEngineService.commissions.runCycle()`
   - `src/components/plans/MLMCommissionSimulator.tsx` → `MlmEngineService.commissions.calculateCommission()`

### Declaração

```json
{
  "domain": "COMMISSION",
  "canonical": "src/modules/mlm-engine/commission.module.ts + bonus.module.ts",
  "duplicado": [
    {
      "path": "src/services/commissions/index.ts",
      "reason": "Duplica logica de comissoes que existe no MLM engine. CRUD simples + queries que o engine ja cobre.",
      "action": "Consumidores migrados para mlm-engine, remover apos limpeza"
    },
    {
      "path": "src/services/commissions/summary-service.ts",
      "reason": "Mesmo caso: resumo de comissoes que o MLM engine ja calcula.",
      "action": "Remover apos limpeza"
    }
  ],
  "morto": [],
  "hooks_migrados": [
    "src/hooks/commissions/useCommissions.ts",
    "src/hooks/commission/useCommissionSummary.ts"
  ]
}
```

---

## DOMÍNIO: ANALYTICS ✅ CANÔNICO (thin)

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/analytics/index.ts` | AnalyticsService (fetchAuditLogs) | **CANÔNICO** |
| 2 | `src/hooks/analytics/useAnalytics.ts` | Hook que combina OrderService + CustomerService | **PONTE CANÔNICA** |

### Declaração

```json
{
  "domain": "ANALYTICS",
  "canonical": "src/services/analytics/index.ts",
  "status": "CANÔNICO (thin)",
  "observacao": "Servico minimalista (apenas audit logs). A maioria das 'analytics' sao feitas agregando dados de outros servicos (orders, customers).",
  "legado": [],
  "morto": []
}
```

---

## DOMÍNIO: MARKETING ✅ CANÔNICO

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/marketing/index.ts` | MarketingService (campanhas, upgrade suggestions, distributor profile) | **CANÔNICO** |
| 2 | `src/hooks/marketing/useCampaigns.ts` | Hook de campanhas | **PONTE CANÔNICA** |

### Declaração

```json
{
  "domain": "MARKETING",
  "canonical": "src/services/marketing/index.ts",
  "status": "CANÔNICO",
  "legado": [],
  "morto": []
}
```

---

## DOMÍNIO: INDUSTRIAL ✅ CANÔNICO

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/industrial/index.ts` | IndustrialService (CRUD massivo: locations, machines, materials, suppliers, processes, BOMs, etc.) | **CANÔNICO** |
| 2 | `src/modules/industrial/` | Módulo industrial (se existir) | **NÃO VERIFICADO** |

### Declaração

```json
{
  "domain": "INDUSTRIAL",
  "canonical": "src/services/industrial/index.ts",
  "status": "CANÔNICO",
  "observacao": "Service massivo com ~15+ entidades. Poucos consumidores identificados (provavelmente rotas admin).",
  "legado": [],
  "morto": []
}
```

---

## DOMÍNIO: SYSTEM ✅ CANÔNICO

### Implementações encontradas

| # | Local | Tipo | Status |
|---|-------|------|--------|
| 1 | `src/services/system/index.ts` | SystemService (auditLog, config) | **CANÔNICO** |

### Declaração

```json
{
  "domain": "SYSTEM",
  "canonical": "src/services/system/index.ts",
  "status": "CANÔNICO",
  "legado": [],
  "morto": []
}
```

---

## RESUMO GERAL — STATUS POR DOMÍNIO

| Domínio | Status | Canônico | Legado/Duplicado | Prioridade |
|---------|--------|----------|-----------------|------------|
| AUTH | ✅ CANÔNICO | `modules/auth` | `services/profiles` (parcial) — **REMOVIDO** | BAIXA |
| CUSTOMERS | ✅ CANÔNICO | `services/customers` + `customer360` | — | BAIXA |
| ORDERS | ✅ CANÔNICO | `services/orders` + `cart` | — | BAIXA |
| PLANS | ✅ CANÔNICO | `services/plans` (DB) | `modules/plans/mlm-rules.ts` (hardcoded) — **REMOVIDO** | ~~ALTA~~ **CONCLUÍDO** |
| PRODUCTS | ✅ CANÔNICO | `services/products` (dual) | — | BAIXA |
| CHECKOUT | ✅ CANÔNICO | `services/checkout` + `cart` | — | BAIXA |
| WALLET/FINANCE | ❌ EM MIGRAÇÃO | Sprint 6 (withdrawals, payments, points, bonus, payment-methods) | `services/wallets` (monolítico) | **ALTA** |
| NETWORK | ✅ CANÔNICO | `services/network` (facade) + `modules/mlm-engine` | — | BAIXA |
| COMMISSION | ✅ MIGRADO | `modules/mlm-engine` (commission + bonus) | `services/commissions` (2 arquivos) — **REMOVIDO** | ~~ALTA~~ **CONCLUÍDO** |
| ANALYTICS | ✅ CANÔNICO | `services/analytics` | — | BAIXA |
| MARKETING | ✅ CANÔNICO | `services/marketing` | — | BAIXA |
| INDUSTRIAL | ✅ CANÔNICO | `services/industrial` | — | BAIXA |
| SYSTEM | ✅ CANÔNICO | `services/system` | — | BAIXA |

### Ações Prioritárias (Atualizado)

1. ~~**PLANS**: Verificar se `mlm-rules.ts` tem consumidores ativos. Se sim, migrar regras para DB e remover hardcoded.~~ **✅ CONCLUÍDO** — `mlm-rules.ts` removido (dead code)
2. ~~**WALLET/FINANCE**: Completar migração Sprint 6. Migrar hooks de `wallets/` para os novos serviços especializados. Remover `services/wallets`.~~ **✅ CONCLUÍDO** — Todos os hooks migrados; `services/wallets` removido
3. ~~**COMMISSION**: Migrar hooks de `commissions/` + `commission/` para `mlm-engine`. Remover `services/commissions/`.~~ **✅ CONCLUÍDO** — Consumidores migrados para `MlmEngineService.commissions`
4. ~~**AUTH**: Migrar `useMyProfile` e `useOfficeDashboard` de `ProfileService` para `modules/auth`. Remover `services/profiles`.~~ **✅ CONCLUÍDO**
