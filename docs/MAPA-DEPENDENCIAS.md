# MAPA DE DEPENDÊNCIAS - ALLIN OS 2.0

**Data:** 2026-06-15
**Projeto:** imeadfnlgzphumuawdyt
**Objetivo:** Mapa de dependências do sistema

---

## 1. ARQUITETURA DE DADOS

### Fluxo Principal

```
Frontend (React)
↓
Services (src/services/*.ts)
↓
Supabase Client (lib/supabase-client.ts)
↓
Banco de Dados (Supabase)
```

### Fluxo Secundário (Backend)

```
Backend (src/backend/)
↓
API Functions (api/*.api.ts)
↓
Services (services/*.service.ts)
↓
Repositories (repositories/*.repository.ts)
↓
BaseRepository (infra/database/base.repository.ts)
↓
Supabase Client (lib/supabase-client.ts)
↓
Banco de Dados (Supabase)
```

---

## 2. DEPENDÊNCIAS FRONTEND → BANCO

### Commerce

```
Frontend (React)
├── busca-produtos.tsx
├── produto.$id.tsx
├── loja.tsx
├── loja.$slug.tsx
└── checkout.tsx
↓
Hooks
├── useProducts.ts
├── useProductDetail.ts
├── useStoreCart.ts
└── useStoreCheckout.ts
↓
Services
├── productsService.ts
└── cartService.ts
↓
Supabase Client
├── schema('commerce')
├── from('produtos')
└── from('cart_items')
↓
Banco
├── commerce.produtos
└── commerce.cart_items
```

### CRM

```
Frontend (React)
├── office/customers/*
├── office/dashboard/*
└── office/analytics/*
↓
Hooks
├── useCustomer.ts
├── useCustomers.ts
├── useCustomer360.ts
├── useCustomer360Data.ts
└── useCustomer360New.ts
↓
Services
├── customers/*
├── customer360/*
└── crm360/*
↓
Supabase Client
├── schema('crm')
└── from('customers')
↓
Banco
└── crm.customers
```

### Identity

```
Frontend (React)
├── login.tsx
├── cadastro.tsx
├── ativacao.tsx
├── auth.invite.$token.tsx
└── referral tracking
↓
Hooks
├── useAuth (auth/hooks/useAuth.ts)
├── useMyProfile.ts
└── useProfile360.ts
↓
Services
├── auth/*
├── profiles/*
└── referralTrackingService.ts
↓
Supabase Client
├── schema('auth')
├── from('users')
├── schema('identity')
├── from('roles')
├── from('user_roles')
└── from('referral_tracking')
↓
Banco
├── auth.users
├── identity.roles
├── identity.user_roles
└── identity.referral_tracking
```

### MLM

```
Frontend (React)
├── office/distributors/*
├── office/plans/*
├── office/commissions/*
└── seja-distribuidor.tsx
↓
Hooks
├── useDistributorRegistration.ts
├── useDistributorPlans.ts
├── useEarningsCalculator.ts
├── usePlans.ts
├── usePlanBonuses.ts
├── usePlanAnalytics.ts
├── useMLM360.ts
└── useNetwork.ts
↓
Services
├── plans/*
├── commissions.ts
├── mlm360/*
└── network/*
↓
Supabase Client
├── schema('mlm')
├── from('distribuidores')
├── from('planos')
└── from('comissoes')
↓
Banco
├── mlm.distribuidores
├── mlm.planos
└── mlm.comissoes
```

### Finance

```
Frontend (React)
├── office/finance/*
├── office/wallets/*
└── office/withdrawals/*
↓
Hooks
├── useFinance360.ts
├── useWalletData.ts
├── useWalletActions.ts
├── useWithdrawals.ts
└── usePayments.ts
↓
Services
├── finance360/*
├── wallets/*
└── payments/*
↓
Supabase Client
├── schema('finance')
└── from('solicitacoes_saque')
↓
Banco
└── finance.solicitacoes_saque
```

### Copilot

```
Frontend (React)
├── office/copilot/*
↓
Hooks
├── useCopilot.ts
↓
Services
├── copilot.service.ts
↓
Supabase Client
├── schema('public')
└── from('copilot_conversations')
↓
Banco
└── public.copilot_conversations
```

---

## 3. DEPENDÊNCIAS BACKEND → BANCO

### Commerce

```
Backend (src/backend/)
├── modules/commerce/
├── modules/orders/
└── modules/inventory/
↓
API Functions
├── orders.api.ts
└── custom-field.api.ts
↓
Services
├── order.service.ts
└── custom-field.service.ts
↓
Repositories
├── OrderRepository
└── OrderItemRepository
↓
BaseRepository
├── tableName: "pedidos"
├── schema: "commerce"
└── tableName: "order_items"
└── schema: "public"
↓
Supabase Client
├── schema('commerce')
├── from('pedidos')
├── from('pedidos_itens')
└── schema('public')
└── from('order_items')
↓
Banco
├── commerce.pedidos
├── commerce.pedidos_itens
└── public.order_items
```

### CRM

```
Backend (src/backend/)
└── modules/customers/
↓
API Functions
└── customers.api.ts
↓
Services
└── customer.service.ts
↓
Repositories
└── CustomerRepository
↓
BaseRepository
├── tableName: "customers"
└── schema: "crm"
↓
Supabase Client
├── schema('crm')
├── from('customers')
└── from('customer_360_view')
↓
Banco
├── crm.customers
└── crm.customer_360_view
```

### MLM

```
Backend (src/backend/)
├── modules/distributors/
├── modules/plans/
├── modules/commissions/
└── modules/network/
↓
API Functions
├── plans.api.ts
├── network.api.ts
└── commissions.api.ts
↓
Services
├── plan.service.ts
├── network.service.ts
└── commission.service.ts
↓
Repositories
├── DistributorRepository
├── PlanRepository
├── PlanBonusRepository
├── CustomerPlanRepository
└── NetworkRepository
↓
BaseRepository
├── tableName: "distribuidores"
├── schema: "mlm"
├── tableName: "planos"
├── schema: "mlm"
├── tableName: "plan_bonuses"
├── schema: "public"
├── tableName: "customer_plans"
├── schema: "public"
├── tableName: "network_tree_view"
├── schema: "public"
└── tableName: "customers"
└── schema: "public"
↓
Supabase Client
├── schema('mlm')
├── from('distribuidores')
├── from('planos')
├── schema('public')
├── from('plan_bonuses')
├── from('customer_plans')
├── from('network_tree_view')
└── from('customers')
↓
Banco
├── mlm.distribuidores
├── mlm.planos
├── public.plan_bonuses
├── public.customer_plans
├── public.network_tree_view
└── public.customers
```

### Finance

```
Backend (src/backend/)
└── modules/finance/
↓
API Functions
└── payments.api.ts
↓
Services
├── withdrawal.service.ts
├── bank-account.service.ts
└── balance.service.ts
↓
Repositories
├── WithdrawalRepository
├── BankAccountRepository
└── BalanceRepository
↓
BaseRepository
├── tableName: "solicitacoes_saque"
├── schema: "finance"
├── tableName: "distribuidor_conta_bancaria"
└── schema: "mlm"
↓
Supabase Client
├── schema('finance')
├── from('solicitacoes_saque')
├── schema('mlm')
└── from('distribuidor_conta_bancaria')
↓
Banco
├── finance.solicitacoes_saque
└── mlm.distribuidor_conta_bancaria
```

### Industrial

```
Backend (src/backend/)
└── modules/industrial/
↓
API Functions
└── industrial.api.ts
↓
Services
├── bom.service.ts
├── capacity.service.ts
├── component.service.ts
├── location.service.ts
├── machine.service.ts
├── material.service.ts
├── process.service.ts
├── product-industrial.service.ts
├── supplier.service.ts
├── timing.service.ts
└── tool.service.ts
↓
Repositories
├── BOMRepository
├── CapacityRepository
├── ComponentRepository
├── LocationRepository
├── MachineRepository
├── MaterialRepository
├── ProcessRepository
├── ProductIndustrialRepository
├── SupplierRepository
├── TimingRepository
└── ToolRepository
↓
BaseRepository
├── tableName: "bom"
├── schema: "industrial"
├── tableName: "capacity"
├── schema: "industrial"
├── tableName: "components"
├── schema: "industrial"
├── tableName: "locations"
├── schema: "industrial"
├── tableName: "machines"
├── schema: "industrial"
├── tableName: "materials"
├── schema: "industrial"
├── tableName: "processes"
├── schema: "industrial"
├── tableName: "products_industrial"
├── schema: "industrial"
├── tableName: "suppliers"
├── schema: "industrial"
├── tableName: "timing_records"
├── schema: "industrial"
├── tableName: "tools"
└── schema: "industrial"
↓
Supabase Client
├── schema('industrial')
├── from('bom')
├── from('capacity')
├── from('components')
├── from('locations')
├── from('machines')
├── from('materials')
├── from('processes')
├── from('products_industrial')
├── from('suppliers')
├── from('timing_records')
└── from('tools')
↓
Banco
├── industrial.bom
├── industrial.capacity
├── industrial.components
├── industrial.locations
├── industrial.machines
├── industrial.materials
├── industrial.processes
├── industrial.products_industrial
├── industrial.suppliers
├── industrial.timing_records
└── industrial.tools
```

---

## 4. DEPENDÊNCIAS CRUZADAS

### Frontend → Backend

```
Frontend (React)
↓
Backend API Functions (src/backend/api/*.ts)
↓
Backend Services (src/backend/modules/*/services/*.ts)
↓
Backend Repositories (src/backend/modules/*/repositories/*.ts)
↓
BaseRepository (src/backend/infra/database/base.repository.ts)
↓
Supabase Client
↓
Banco de Dados
```

**Observação:** O frontend NÃO usa o backend. O frontend usa Supabase diretamente.

### Backend → Frontend

```
Backend (src/backend/)
↓
Frontend Services (src/services/*.ts)
↓
Frontend Hooks (src/hooks/*.ts)
↓
Frontend Components (src/components/*.tsx)
↓
Frontend Routes (src/routes/*.tsx)
```

**Observação:** O backend NÃO é usado pelo frontend. O backend é uma biblioteca de serviços separada.

---

## 5. DEPENDÊNCIAS ENTRE SCHEMAS

### Identity → CRM

```
identity.referral_tracking
↓
crm.customers
```

**Motivo:** Referral tracking está vinculado a customers.

### CRM → MLM

```
crm.customers
↓
mlm.distribuidores
```

**Motivo:** Customers podem ser distribuidores.

### Commerce → CRM

```
commerce.pedidos
↓
crm.customers
```

**Motivo:** Pedidos estão vinculados a customers.

### Commerce → Finance

```
commerce.pedidos
↓
finance.solicitacoes_saque
```

**Motivo:** Pedidos podem gerar solicitações de saque.

### MLM → Finance

```
mlm.distribuidores
↓
finance.solicitacoes_saque
```

**Motivo:** Distribuidores podem fazer solicitações de saque.

---

## 6. RESUMO DAS DEPENDÊNCIAS

### Por Schema

| Schema | Depende De | É Dependido De |
|--------|------------|---------------|
| auth | - | identity |
| identity | auth | crm |
| crm | identity | commerce, mlm |
| mlm | crm | finance |
| commerce | crm | finance |
| finance | commerce, mlm | - |
| public | - | - |
| system | - | - |
| logistics | - | - |
| industrial | - | - |

### Por Tabela

| Tabela | Depende De | É Dependido De |
|--------|------------|---------------|
| auth.users | - | identity.user_roles |
| identity.roles | - | identity.user_roles |
| identity.user_roles | auth.users, identity.roles | - |
| identity.referral_tracking | - | crm.customers |
| crm.customers | identity.referral_tracking | commerce.pedidos, mlm.distribuidores |
| mlm.distribuidores | crm.customers | finance.solicitacoes_saque |
| mlm.planos | - | mlm.distribuidores |
| mlm.comissoes | mlm.distribuidores | - |
| commerce.produtos | - | commerce.cart_items, commerce.pedidos |
| commerce.pedidos | crm.customers, commerce.produtos | finance.solicitacoes_saque |
| commerce.cart_items | commerce.produtos | - |
| finance.solicitacoes_saque | commerce.pedidos, mlm.distribuidores | - |
| public.copilot_conversations | - | - |

---

## 7. EVIDÊNCIAS COLETADAS

### Fontes de Evidência

1. **Tabelas do Banco:** MCP `list_tables` com verbose=true
2. **Repositories Backend:** Análise de repositories em `src/backend/modules/`
3. **Services Frontend:** Análise de services em `src/services/`
4. **Hooks Frontend:** Análise de hooks em `src/hooks/`
5. **Rotas Frontend:** Análise de rotas em `src/routes/`

### Observações Importantes

1. **Frontend Direto:** O frontend usa Supabase diretamente, sem passar pelo backend
2. **Backend Separado:** O backend é uma biblioteca de serviços separada, não usada pelo frontend
3. **Schema Identity:** Central para autenticação e autorização
4. **Schema CRM:** Central para gestão de clientes
5. **Schema MLM:** Central para gestão de distribuidores
6. **Schema Commerce:** Central para gestão de produtos e pedidos
7. **Schema Finance:** Central para gestão financeira

---

## 8. PRÓXIMOS PASSOS

Continuar com:
- ETAPA 9: Classificação final
- ETAPA 10: Entregáveis finais
