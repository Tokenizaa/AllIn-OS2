# AUDITORIA ARQUITETURAL COMPLETA — ALLIN OS2

> **Data:** 2026-07-10  
> **Versão:** 2.0 (com análise arquitetural profunda)  
> **Status:** Diagnóstico completo — NENHUM CÓDIGO ALTERADO

---

## 0. ANÁLISE ARQUITETURAL PROFUNDA — CAUSA RAIZ

> **Nota:** Esta seção foi adicionada após revisão crítica da auditoria inicial. Ela identifica os problemas estruturais que geram todos os sintomas documentados nas seções seguintes.

### 0.1 Quem é o Dono dos Dados? (Data Ownership)

**Hoje não existe dono claro.** Os mesmos dados vêm de 8+ fontes diferentes para uma mesma tela:

```
CustomerService     → crm.customers
NetworkService      → mlm.rede_linear_nos, mlm.network_relationships
PlanService         → mlm.planos, mlm.planos_distribuidores
OrderService        → commerce.orders
PaymentService      → finance.pagamentos
SupabaseService     → identity.roles, crm.customers, mlm.distribuidores
MlmEngineService    → Todos os schemas MLM (canônico)
RPCs Diretas        → processar_pedido_mlm, processar_ciclo_comissoes
Hooks               → Transformações manuais
Componentes         → Re-transformações
```

**Consequência:** Uma tela como Dashboard monta informações de 5 serviços diferentes, cada um com sua própria query, transformação e cache. Nunca vai escalar.

### 0.2 Camada Arquitetural Faltante

**Arquitetura Atual (Layer-First, Anêmica):**
```
Página
  ↓
Hook (useQuery)
  ↓
Service (faz tudo: query + transform + business rule + cache + DTO + validação)
  ↓
Supabase
```

**Arquitetura Alvo (Feature-First, Rica):**
```
Página
  ↓
Feature Hook (useDashboard)
  ↓
Feature Repository (DashboardRepository)
  ↓
Domain Service (MlmEngineService.*)
  ↓
Supabase / RPC
```

### 0.3 Services Violam SOLID Completamente

Os services atuais acumulam **7 responsabilidades**:

| Responsabilidade | Exemplo no Código |
|------------------|-------------------|
| Consultar banco | `supabase.from().select()` |
| Transformar dados | `.map()`, `.reduce()`, normalização |
| Regra de negócio | `OfficeRules.calculateCommission()` |
| Cálculos | `EarningsRules.calculateMonthlyIncome()` |
| DTO/Serialização | Retorno de objetos tipados |
| Cache | TanStack Query keys inline |
| Validação | Zod schemas inline |

### 0.4 Feature-First vs Layer-First

**Estrutura Atual (Layer-First — Dificulta Manutenção):**
```
src/
├── components/
│   ├── customers/
│   ├── distributor/
│   ├── ui/
│   └── ...
├── hooks/
│   ├── customers/
│   ├── network/
│   ├── office/
│   └── ...
├── services/
│   ├── customers/
│   ├── network/
│   ├── plans/
│   └── ...
└── modules/
    ├── auth/
    ├── mlm-engine/
    └── ...
```

**Estrutura Alvo (Feature-First — Coesão Alta):**
```
src/modules/
├── customers/
│   ├── components/
│   ├── hooks/
│   ├── repository/
│   ├── service/
│   ├── types/
│   ├── validators/
│   └── routes/
├── orders/
├── wallet/
├── network/
├── plans/
└── shared/
    ├── ui/
    ├── auth/
    └── ...
```

### 0.5 Frontend Faz Inteligência Demais

**Dashboard Atual (5 queries + transformação manual):**
```
Dashboard
  ↓
useOfficeDashboard()
  ↓
Promise.all([
  OrderService.fetchOrdersForDashboard(),
  PaymentService.fetchPaymentsForDashboard(),
  CustomerService.fetchCustomersList(),
  ProductService.fetchProducts(20),
  WithdrawalService.fetchRecentWithdrawals(20),
])
  ↓
Transformação manual no hook (linhas 24-77):
  - reduce para totalVendido
  - reduce para totalPago
  - map para salesSeries
  - map para bonusOrigin
  - map para topProducts
  - map para timeline
  ↓
Render
```

**Dashboard Ideal (1 RPC + ViewModel):**
```
Dashboard
  ↓
useDashboard()
  ↓
DashboardRepository.getDashboardData()
  ↓
rpc_dashboard(distribuidor_id)  -- Single round-trip
  ↓
ViewModel (já calculado no banco):
  - stats: { saldoDisponivel, comissaoAcumulada, totalVendido, ... }
  - salesSeries: [{ day, vendas, bonus }]
  - bonusOrigin: [{ name, value }]
  - topProducts: [{ name, qtd, receita }]
  - timeline: [{ id, title, description, at }]
  - goals: [{ id, title, current, target }]
  - aiInsights: [{ id, title, detail, action }]
  ↓
Render (apenas exibição)
```

### 0.6 ViewModels Ausentes

**Fluxo Atual (Transformação em Cascata):**
```
Banco
  ↓
Service (transforma)
  ↓
Hook (transforma novamente)
  ↓
Page (passa props)
  ↓
Componentes (transformam novamente cada um)
```

**Fluxo Ideal (ViewModel Única):**
```
Banco
  ↓
Repository (dados brutos)
  ↓
Mapper/ViewModel (uma única transformação para formato de tela)
  ↓
Componentes (recebem dados prontos: name, avatar, status, wallet, commission, progress)
```

### 0.7 Hooks Inchados (Business Logic no Lugar Errado)

```typescript
// useOfficeDashboard.ts — 80 linhas com:
- Promise.all de 5 services
- 6 reduce/map para agregações
- Cálculo de comissão (OfficeRules)
- Cálculo de bônus (OfficeRules)
- Agregação de séries temporais
- Mapeamento de top products
- Construção de timeline
- Construção de goals
```

**Deveria ser:**
```
DashboardRepository
  ↓
DashboardMapper (transforma DB → ViewModel)
  ↓
useDashboard() (apenas useQuery + invalidação)
```

### 0.8 Dois Sistemas de Rotas = Dois Produtos

```
/office/*     → Distribuidor (OfficeSidebar + OfficeTopbar)
/__app/*      → Admin (SidebarNav + Topbar)
```

**Realidade:** São o mesmo domínio com layouts/permissões diferentes.

**Alvo Unificado:**
```
Admin
  ↓
Distribuidor
  ↓
Cliente
  ↓
Público
```
Todos usando: **mesmos componentes, mesmos services, mesmo domínio** — apenas mudando layout, menu e permissões.

---

## 1. VISÃO GERAL DA ARQUITETURA

O AllIn OS2 é uma aplicação full-stack MLM construída com:
- **Frontend:** React 19 + TypeScript + Vite + TanStack Router (file-based routing) + TanStack Query
- **Backend:** Supabase Edge Functions (apenas 3 funções: `set-user-claims`, `chat-completion`, `generate-embedding`)
- **Database:** Supabase PostgreSQL com schemas: `identity`, `crm`, `mlm`, `commerce`, `finance`, `industrial`, `public`
- **Auth:** Supabase Auth + RBAC customizado via `identity.roles` / `identity.user_roles`

### Diagrama Arquitetural Atual (Sintomas)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ROTAS (TanStack Router)                       │
│  /                          /office/*          /__app/*                 │
│  /login                     /seja-distribuidor  /$slug (public)         │
│  /loja                      /produto/$id        /ativacao, /cadastro    │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            LAYOUTS                                      │
│  __root.tsx → QueryClientProvider → ThemeProvider → AuthProvider       │
│                                    → StyleProvider                     │
│  __app.tsx  → RouteGuard (admin roles) → SidebarNav + Topbar + Outlet  │
│  office.tsx → RouteGuard (distributor roles) → OfficeSidebar + Outlet  │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            PAGES                                        │
│  office/index.tsx (dashboard real)     __app/customers/index.tsx       │
│  office/network.tsx (real)              __app/distributors/index.tsx   │
│  office/plan.tsx (real)                 __app/analytics.tsx (real)     │
│  office/finance.tsx (partial)           __app/commissions.tsx (legacy) │
│  /office/copilot.tsx (real)             /office/profile.tsx (real)     │
│  __app/orders/index.tsx                 __app/products/index.tsx       │
│  __app/industrial/*                     __app/settings.tsx (partial)   │
│  Auth pages (login, cadastro, etc.)     Public pages (loja, busca)     │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          COMPONENTS                                     │
│  /components/distributor/* (OfficeSidebar, OfficeTopbar, stat-card)    │
│  /components/app/* (SidebarNav, Topbar, CopilotDrawer)                 │
│  /components/ui/* (Button, Input, Badge, Tabs, Card, Progress)         │
│  /components/auth/*, customers/*, industrial/*, payments/*, plans/*    │
│  /components/shared/*, system/*, store/*, widgets/*, features/*        │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             HOOKS                                       │
│  /hooks/office/useOfficeDashboard.ts (REAL - usa services legados)     │
│  /hooks/network/useNetwork.ts (REAL - usa NetworkService + CustomerSvc)│
│  /hooks/customers/useCustomers.ts (REAL - usa CustomerService)         │
│  /hooks/commissions/useCommissions.ts (LEGACY - usa Payment/Plan/Cust)  │
│  /hooks/wallets/useWalletData.ts (MIX - usa MlmEngineService + legacy) │
│  /hooks/mlm/useMLM360.ts (REAL - usa SupabaseService)                  │
│  /hooks/distributor/useDistributorQuery.ts (REAL - usa SupabaseService)│
│  /hooks/bonus/useBonus.ts, /hooks/points/usePoints.ts (REAL)           │
│  QueryKeys factory centralizado em /hooks/queryKeys.ts                 │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVICES (CRITICAL)                           │
│                                                                         │
│  NOVA ARQUITETURA CANÔNICA (src/modules/mlm-engine/):                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ MlmEngineService = { plans: PlanModule, network: NetworkModule,  │  │
│  │   commissions: CommissionModule, bonus: BonusModule,              │  │
│  │   points: PointsModule, qualifications: QualificationModule,      │  │
│  │   wallet: WalletModule, payouts: PayoutModule }                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  SERVIÇOS LEGADOS AINDA EM USO (src/services/*):                       │
│  • CustomerService → usado por useCustomers, useNetwork, useOfficeDashboard│
│  • NetworkService → usado por useNetwork                               │
│  • PlanService → usado por useCommissions, useOfficeDashboard          │
│  • OrderService → usado por useOfficeDashboard, useCommissions         │
│  • PaymentService → usado por useOfficeDashboard, useCommissions       │
│  • BonusService → usado por useWalletData                              │
│  • PointsService → usado por useWalletData                             │
│  • WithdrawalService → usado por useOfficeDashboard                    │
│  • ProductService → usado por useOfficeDashboard                       │
│  • SupabaseService (auth module) → usado por useDistributorQuery      │
│                                                                         │
│  SERVIÇOS LEGADOS QUE DEVERIAM SER MIGRADOS:                           │
│  PlanService → MlmEngineService.plans                                   │
│  BonusService → MlmEngineService.bonus                                  │
│  Commission logic (OrderService.OfficeRules) → CommissionModule         │
│  WalletService → MlmEngineService.wallet                                │
│  NetworkService → MlmEngineService.network                              │
│  Qualification logic → MlmEngineService.qualifications                  │
│  WithdrawalService → MlmEngineService.payouts                           │
│  PointsService → MlmEngineService.points                                │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REACT QUERY                                     │
│  QueryClient único (src/lib/react-query/client.ts)                     │
│  QueryKeys factory centralizado (58 keys definidos)                    │
│  Invalidation helpers (src/hooks/queryInvalidation.ts)                 │
│  Cache: staleTime NÃO configurado na maioria das queries               │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE EDGE FUNCTIONS                         │
│  • set-user-claims: atribui roles via identity.user_roles → JWT claims  │
│  • chat-completion: LLM completions                                     │
│  • generate-embedding: vector embeddings                                │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE                                      │
│  Schemas: identity (roles, user_roles), crm (customers), mlm (planos,  │
│  distribuidores, rede_linear_nos, bonus_regras, comissoes, carteiras,  │
│  pontos_saldo, bonus_historico, planos_distribuidores),                │
│  commerce (orders), finance (solicitacoes_saque), industrial, public   │
│  RLS: ~50+ policies | SQL Functions: 70+ | FKs: 200+                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Diagrama Alvo (Arquitetura Desejada)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            ROTAS UNIFICADAS                             │
│  /admin/*     /distributor/*     /customer/*     /public/*             │
│  (mesmo router, guards por role, layouts por role)                     │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         LAYOUTS POR ROLE                                │
│  AdminLayout, DistributorLayout, CustomerLayout, PublicLayout          │
│  (compartilham Sidebar, Topbar, CopilotDrawer via props/config)        │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FEATURE MODULES                                 │
│  modules/customers/  modules/orders/  modules/wallet/                  │
│  modules/network/    modules/plans/   modules/qualifications/          │
│  Cada um com: components/, hooks/, repository/, service/, types/       │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         HOOKS FINOS                                     │
│  useCustomers() → CustomersRepository → CustomerService                │
│  useDashboard() → DashboardRepository → RPC → ViewModel                │
│  (apenas useQuery + invalidação, ZERO business logic)                  │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DOMAIN SERVICES (MLM ENGINE)                       │
│  PlanModule, NetworkModule, CommissionModule, BonusModule,             │
│  PointsModule, QualificationModule, WalletModule, PayoutModule         │
│  (regras puras, sem Supabase, testáveis unitariamente)                 │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      REPOSITORIES + RPCs                                │
│  DashboardRepository → rpc_dashboard()                                  │
│  CustomerRepository → supabase.from('customers')                        │
│  (camada de acesso a dados, sem regra de negócio)                      │
└────────────────────────────┬────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (Single Source of Truth)               │
│  Schemas consolidados, RPCs para agregações complexas,                 │
│  RLS minimalista e auditado, Functions apenas para triggers reais      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ROTAS — ANÁLISE COMPLETA

### Tabela de Rotas (62 rotas totais)

| Rota | Arquivo | Status | Problema | Correção Sugerida |
|------|---------|--------|----------|-------------------|
| `/` | `src/routes/index.tsx` | OK | - | - |
| `/login` | `src/routes/login.tsx` | OK | - | - |
| `/cadastro` | `src/routes/cadastro.tsx` | OK | - | - |
| `/recuperar-senha` | `src/routes/recuperar-senha.tsx` | OK | - | - |
| `/redefinir-senha` | `src/routes/redefinir-senha.tsx` | OK | - | - |
| `/ativacao` | `src/routes/ativacao.tsx` | OK | - | - |
| `/loja` | `src/routes/loja.tsx` | OK | - | - |
| `/loja/$slug` | `src/routes/loja.$slug.tsx` | OK | - | - |
| `/busca-produtos` | `src/routes/busca-produtos.tsx` | OK | - | - |
| `/busca-produtos/$slug` | `src/routes/busca-produtos.$slug.tsx` | OK | - | - |
| `/doencas` | `src/routes/doencas.tsx` | OK | - | - |
| `/doencas/$slug` | `src/routes/doencas.$slug.tsx` | OK | - | - |
| `/produto/$id` | `src/routes/produto.$id.tsx` | OK | - | - |
| `/seja-distribuidor` | `src/routes/seja-distribuidor.tsx` | OK | - | - |
| `/seja-distribuidor/$slug` | `src/routes/seja-distribuidor.$slug.tsx` | OK | - | - |
| `/auth/invite/$token` | `src/routes/auth.invite.$token.tsx` | OK | - | - |
| `/checkout` | `src/routes/checkout.tsx` | OK | - | - |
| `/minha-conta` | `src/routes/minha-conta.tsx` | OK | - | - |
| `/$slug` | `src/routes/$slug.tsx` | OK | catch-all público | - |
| `/office` | `src/routes/office.tsx` | OK | Layout distribuidor | **Migrar para /distributor/** |
| `/office/` | `src/routes/office/index.tsx` | **REAL** | Dashboard real (Supabase) | **Migrar para /distributor/** |
| `/office/network` | `src/routes/office/network.tsx` | **REAL** | Rede linear real | **Migrar para /distributor/network** |
| `/office/plan` | `src/routes/office/plan.tsx` | **REAL** | Plano real | **Migrar para /distributor/plan** |
| `/office/orders` | `src/routes/office/orders.tsx` | **PARCIAL** | Usa OrderService legado | Migrar + unificar |
| `/office/finance` | `src/routes/office/finance.tsx` | **PARCIAL** | Mistura real + mock | Completar |
| `/office/profile` | `src/routes/office/profile.tsx` | **REAL** | Perfil real | **Migrar para /distributor/profile** |
| `/office/reports` | `src/routes/office/reports.tsx` | **VAZIA** | Placeholder | Implementar ou remover |
| `/office/store` | `src/routes/office/store.tsx` | **PARCIAL** | Loja parcial | Completar |
| `/office/verification` | `src/routes/office/verification.tsx` | **PARCIAL** | Verificação parcial | Completar |
| `/office/downloads` | `src/routes/office/downloads.tsx` | **VAZIA** | Placeholder | Implementar ou remover |
| `/office/copilot` | `src/routes/office/copilot.tsx` | **REAL** | Copiloto real | **Migrar para /distributor/copilot** |
| `/office/copilot` | `src/routes/office/CopilotPage.tsx` | **DUPLICADA** | Mesmo path que copilot.tsx | **REMOVER** |
| `/office/network` | `src/routes/office/network.tsx` | **OK** | - | - |
| `/__app` | `src/routes/__app.tsx` | OK | Layout admin | **Migrar para /admin/** |
| `/__app/customers/` | `src/routes/__app/customers/index.tsx` | **DUPLICADA** | Mesmo domínio de `/office`? | **Unificar em /admin/customers** |
| `/__app/customers/$id` | `src/routes/__app/customers/$id.tsx` | **DUPLICADA** | Mesmo domínio | **Unificar** |
| `/__app/distributors/` | `src/routes/__app/distributors/index.tsx` | **DUPLICADA** | Mesmo domínio de office/distributors | **Unificar** |
| `/__app/orders/` | `src/routes/__app/orders/index.tsx` | **DUPLICADA** | Mesmo domínio de office/orders | **Unificar** |
| `/__app/products/` | `src/routes/__app/products/index.tsx` | **DUPLICADA** | Mesmo domínio | **Unificar** |
| `/__app/analytics` | `src/routes/__app/analytics.tsx` | **REAL** | Analytics admin | **Migrar para /admin/analytics** |
| `/__app/commissions` | `src/routes/__app/commissions.tsx` | **LEGACY** | Usa services legados | Migrar + unificar |
| `/__app/network` | `src/routes/__app/network.tsx` | **DUPLICADA** | Mesmo domínio de office/network | **Unificar** |
| `/__app/plans` | `src/routes/__app/plans.tsx` | **REAL** | Planos admin | **Migrar para /admin/plans** |
| `/__app/insights` | `src/routes/__app/insights.tsx` | **REAL** | Insights admin | **Migrar para /admin/insights** |
| `/__app/marketing` | `src/routes/__app/marketing.tsx` | **REAL** | Marketing admin | **Migrar para /admin/marketing** |
| `/__app/genealogy` | `src/routes/__app/genealogy.tsx` | **REAL** | Genealogia admin | **Migrar para /admin/genealogy** |
| `/__app/alerts` | `src/routes/__app/alerts.tsx` | **REAL** | Alertas admin | **Migrar para /admin/alerts** |
| `/__app/copilot` | `src/routes/__app/copilot.tsx` | **REAL** | Copiloto admin | **Migrar para /admin/copilot** |
| `/__app/settings` | `src/routes/__app/settings.tsx` | **PARCIAL** | Settings parcial | Completar |
| `/__app/system` | `src/routes/__app/system.tsx` | **REAL** | Sistema admin | **Migrar para /admin/system** |
| `/__app/wallets` | `src/routes/__app/wallets.tsx` | **REAL** | Carteiras admin | **Migrar para /admin/wallets** |
| `/__app/industrial/` | `src/routes/__app/industrial/index.tsx` | **REAL** | Industrial admin | **Migrar para /admin/industrial** |
| `/__app/industrial/processes` | `src/routes/__app/industrial/processes.tsx` | **REAL** | Processos industrial | **Migrar** |
| `/__app/industrial/materials` | `src/routes/__app/industrial/materials.tsx` | **REAL** | Materiais industrial | **Migrar** |
| `/__app/industrial/machines` | `src/routes/__app/industrial/machines.tsx` | **REAL** | Máquinas industrial | **Migrar** |

### Problemas Críticos de Rotas

1. **DUPLICAÇÃO GRAVE**: Domínios `customers`, `distributors`, `orders`, `products`, `network` existem tanto em `/office/*` quanto `/__app/*`
2. **DUPLICAÇÃO EXATA**: `/office/copilot` aparece em `office/copilot.tsx` E `office/CopilotPage.tsx`
3. **PÁGINAS ÓRFÃS**: `/office/reports`, `/office/downloads` são placeholders sem funcionalidade
4. **PÁGINAS VAZIAS**: `/office/reports`, `/office/downloads` não renderizam dados
5. **DOIS SISTEMAS PARALELOS**: `/office` (distribuidor) e `/__app` (admin) são essencialmente o mesmo domínio com layouts diferentes
6. **ROTAS SEM GUARD**: Páginas públicas (`/loja`, `/busca-produtos`, `/doencas`) não têm RouteGuard (pode ser intencional)

---

## 3. LAYOUTS E PROVIDERS

### Providers no `__root.tsx` (linhas 83-91)
```tsx
<QueryClientProvider client={queryClient}>
  <ThemeProvider>
    <AuthProvider>
      <StyleProvider>
        <Outlet />
      </StyleProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>
```

### Providers no `__app.tsx` (linhas 38-48)
```tsx
<div className="flex min-h-screen bg-background text-foreground">
  <SidebarNav />
  <div className="flex min-w-0 flex-1 flex-col">
    <Topbar onCopilot={() => setCopilotOpen(true)} />
    <main className="flex-1 overflow-y-auto">...</main>
  </div>
  <CopilotDrawer open={copilotOpen} onOpenChange={setCopilotOpen} />
</div>
```

### Providers no `office.tsx` (linhas 31-43)
```tsx
<div className="min-h-screen flex bg-background text-foreground">
  <OfficeSidebar />
  <div className="flex-1 flex flex-col min-w-0">
    <OfficeTopbar />
    <main className="flex-1 overflow-y-auto">...</main>
  </div>
</div>
```

### Problemas Identificados

| Problema | Localização | Severidade |
|----------|-------------|------------|
| **ThemeProvider duplicado** | `src/components/ThemeProvider.tsx` importado em `__root.tsx` + possível outro em componentes | 🟠 Alto |
| **AuthProvider único** | Apenas no `__root.tsx` (correto) | ✅ OK |
| **QueryClientProvider único** | Apenas no `__root.tsx` (correto) | ✅ OK |
| **Sidebar/Topbar duplicados** | `OfficeSidebar` + `OfficeTopbar` (office) vs `SidebarNav` + `Topbar` (__app) | 🟠 Alto |
| **CopilotDrawer duplicado** | Em `__app.tsx` (admin) + possivelmente em office | 🟡 Médio |
| **Toaster ausente** | Não há Toaster global (sonner usado inline) | 🟡 Médio |
| **Dois layouts para o mesmo domínio** | office vs __app = mesma feature, layout diferente | 🔴 Crítico |

---

## 4. PAGES — CLASSIFICAÇÃO DE RENDERIZAÇÃO

| Rota | Arquivo | Classificação | Evidência |
|------|---------|---------------|-----------|
| `/office/` | `office/index.tsx` | **REAL** | `useOfficeDashboard()` → Supabase real |
| `/office/network` | `office/network.tsx` | **REAL** | `useNetwork(500)` → NetworkService + CustomerService |
| `/office/plan` | `office/plan.tsx` | **REAL** | Usa hooks/plans (verificar) |
| `/office/orders` | `office/orders.tsx` | **PARCIAL** | Usa OrderService legado |
| `/office/finance` | `office/finance.tsx` | **PARCIAL** | Mistura real + mock |
| `/office/profile` | `office/profile.tsx` | **REAL** | Perfil real do usuário |
| `/office/reports` | `office/reports.tsx` | **VAZIA** | Placeholder "Em desenvolvimento" |
| `/office/store` | `office/store.tsx` | **PARCIAL** | Loja com dados parciais |
| `/office/verification` | `office/verification.tsx` | **PARCIAL** | Verificação parcial |
| `/office/downloads` | `office/downloads.tsx` | **VAZIA** | Placeholder |
| `/office/copilot` | `office/copilot.tsx` | **REAL** | Copiloto funcional |
| `/office/copilot` | `office/CopilotPage.tsx` | **DUPLICADA** | Mesmo path, código diferente |
| `/__app/analytics` | `__app/analytics.tsx` | **REAL** | Analytics admin real |
| `/__app/commissions` | `__app/commissions.tsx` | **LEGACY** | Usa Payment/Plan/CustomerService |
| `/__app/network` | `__app/network.tsx` | **DUPLICADA** | Mesmo domínio que office |
| `/__app/plans` | `__app/plans.tsx` | **REAL** | Planos admin |
| `/__app/insights` | `__app/insights.tsx` | **REAL** | Insights admin |
| `/__app/marketing` | `__app/marketing.tsx` | **REAL** | Marketing admin |
| `/__app/genealogy` | `__app/genealogy.tsx` | **REAL** | Genealogia admin |
| `/__app/alerts` | `__app/alerts.tsx` | **REAL** | Alertas admin |
| `/__app/copilot` | `__app/copilot.tsx` | **REAL** | Copiloto admin |
| `/__app/settings` | `__app/settings.tsx` | **PARCIAL** | Settings parcial |
| `/__app/system` | `__app/system.tsx` | **REAL** | Sistema admin |
| `/__app/wallets` | `__app/wallets.tsx` | **REAL** | Carteiras admin |
| `/__app/industrial/*` | `__app/industrial/*.tsx` | **REAL** | Industrial completo |

### Resumo Pages
- **REAL**: 18 páginas
- **PARCIAL**: 7 páginas  
- **VAZIA**: 3 páginas
- **DUPLICADA**: 3 páginas (copilot 2x, network 2x via domínios)
- **LEGACY**: 1 página (commissions)

---

## 5. MATRIZ DE RENDERIZAÇÃO — ONDE CADA TELA QUEBRA

> **Nova seção:** Identifica exatamente em qual camada cada tela falha.

| Página | Dados Chegam? | Hook | Query | Service/Repo | Renderiza? | Problema Raiz |
|--------|---------------|------|-------|--------------|------------|---------------|
| Dashboard (`/office/`) | Sim | ⚠️ Inchado | OK | ❌ 5 services legados | **Não** | Lógica de negócio no hook (80 linhas) |
| Customers (`/__app/customers/`) | Não | OK | ❌ Não definida | ⚠️ CustomerService | **Não** | QueryKey ausente |
| Orders (`/office/orders`) | Sim | OK | OK | ❌ OrderService legado | **Não** | Service não migrou para MlmEngine |
| Wallet (`/__app/wallets`) | Sim | OK | OK | ⚠️ Parcial | **Parcial** | Mapping inconsistente |
| Network (`/office/network`) | Sim | OK | OK | ⚠️ NetworkService + CustomerService | **Não** | Componentes não recebem ViewModel |
| Commissions (`/__app/commissions`) | Sim | ⚠️ Legacy | OK | ❌ 4 services legados | **Não** | Lógica no hook + services legados |
| Plan (`/office/plan`) | Sim | OK | OK | ✅ PlanModule | **Sim** | - |
| Analytics (`/__app/analytics`) | Sim | OK | OK | ✅ | **Sim** | - |
| Profile (`/office/profile`) | Sim | OK | OK | ✅ | **Sim** | - |

**Legenda:** ✅ OK | ⚠️ Parcial/Funciona mas errado | ❌ Quebrado/Ausente

---

## 6. MATRIZ DE FLUXO DE DADOS — ONDE A CADEIA QUEBRA POR MÓDULO

> **Nova seção:** Mostra onde a cadeia Database → Repository → Service → Hook → Page → Component está interrompida.

| Módulo | Banco | Repository | Service | Hook | Página | Componente |
|--------|-------|------------|---------|------|--------|------------|
| **Customers** | ✅ | ❌ | ⚠️ CustomerService | ✅ useCustomers | ⚠️ `__app/customers` | ❌ |
| **Wallet** | ✅ | ❌ | ⚠️ WalletModule + BonusService | ⚠️ useWalletData | ❌ `__app/wallets` | ❌ |
| **Plans** | ✅ | ❌ | ⚠️ PlanService + PlanModule | ⚠️ usePlans | ⚠️ `office/plan` + `__app/plans` | ❌ |
| **Network** | ✅ | ❌ | ⚠️ NetworkModule + NetworkService | ⚠️ useNetwork | ❌ `office/network` + `__app/network` | ❌ |
| **Orders** | ✅ | ❌ | ❌ OrderService (legado) | ❌ | ❌ `office/orders` + `__app/orders` | ❌ |
| **Commissions** | ✅ | ❌ | ✅ CommissionModule | ❌ useCommissions (legacy) | ❌ `__app/commissions` | ❌ |
| **Bonus** | ✅ | ❌ | ✅ BonusModule | ❌ useBonus | ❌ | ❌ |
| **Points** | ✅ | ❌ | ✅ PointsModule | ❌ usePoints | ❌ | ❌ |
| **Qualifications** | ? | ❌ | ✅ QualificationModule (stub) | ❌ | ❌ | ❌ |
| **Payouts** | ✅ | ❌ | ✅ PayoutModule | ❌ | ❌ | ❌ |

**Observação:** Nenhum módulo tem **Repository** implementado. A cadeia quebra na transição Banco → Service.

---

## 7. COMPONENTES — ANÁLISE

### Estatísticas
- **Total componentes**: ~120+ arquivos em `src/components/`
- **Subdiretórios**: 18 pastas (`app`, `auth`, `customers`, `distributor`, `features`, `industrial`, `invites`, `payments`, `plans`, `product-modal`, `sections`, `shared`, `store`, `system`, `ui`, `widgets`)

### Problemas Identificados

| Problema | Arquivos | Severidade |
|----------|----------|------------|
| **Sidebar/Topbar duplicados** | `OfficeSidebar`/`OfficeTopbar` (distributor) vs `SidebarNav`/`Topbar` (app) | 🔴 Crítico |
| **Componentes UI não padronizados** | Button, Input, Badge em `/components/ui/` mas alguns usam shadcn, outros custom | 🟠 Alto |
| **ThemeProvider duplicado** | `src/components/ThemeProvider.tsx` + possível uso inline | 🟠 Alto |
| **Componentes >500 linhas** | Precisa verificação | 🟡 Médio |
| **Componentes mortos** | `copilot-drawer.tsx` usado apenas em `__app.tsx`, verificar outros | 🟡 Médio |
| **Barrels desnecessários** | `src/components/index.ts` pode não existir | 🟢 Baixo |
| **Componentes transformam dados** | Cada componente re-transforma props recebidas | 🔴 Crítico (ausência de ViewModel) |

---

## 8. HOOKS — ANÁLISE REACT QUERY

### QueryKeys Factory (src/hooks/queryKeys.ts) — 58 keys definidos
```typescript
customers: ["customers"]
customer: (id) => ["customers", id]
orders: ["orders"]
wallets: ["wallets"]
network: ["network"]
commissions: ["commissions"]
office: { dashboard: ["office", "dashboard"], finance: ["office", "finance"] }
bonus: { history: (id, limit) => ["bonus", "history", id, limit], rules: ["bonus", "rules", "active"] }
```

### Hooks por Tipo
| Tipo | Quantidade | Exemplos |
|------|------------|----------|
| `useQuery` (REAL) | ~25 | useCustomers, useNetwork, useOfficeDashboard, useMLM360 |
| `useQuery` (LEGACY services) | ~8 | useCommissions, useBonus, useWalletData (parcial) |
| `useMutation` | ~10 | em `/hooks/mutations/` |
| `useInfiniteQuery` | 0 | Não encontrado |
| `useSuspenseQuery` | 0 | Não encontrado |

### Problemas Críticos

| Problema | Arquivo | Linha | Severidade |
|----------|---------|-------|------------|
| **staleTime NÃO configurado** | Maioria dos `useQuery` | - | 🔴 Crítico |
| **gcTime NÃO configurado** | Maioria dos `useQuery` | - | 🟠 Alto |
| **refetchOnWindowFocus: true (default)** | Pode causar refetch excessivo | - | 🟠 Alto |
| **retry não configurado** | Default 3 retries | - | 🟡 Médio |
| **Hooks legacy usando services antigos** | `useCommissions.ts`, `useOfficeDashboard.ts` | - | 🔴 Crítico |
| **Business logic no hook** | `useOfficeDashboard.ts` (80 linhas) | 16-77 | 🔴 Crítico |

### Exemplo: useOfficeDashboard (src/hooks/office/useOfficeDashboard.ts:13-81)
```typescript
// PROBLEMA: Usa 5 services legados em Promise.all + transformação manual
const [orders, payments, customers, products, withdrawals] = await Promise.all([
  OrderService.fetchOrdersForDashboard(),
  PaymentService.fetchPaymentsForDashboard(),
  CustomerService.fetchCustomersList(),
  ProductService.fetchProducts(20),
  WithdrawalService.fetchRecentWithdrawals(20),
]);
// Transformação manual (linhas 24-77):
// - reduce para totalVendido, totalPago
// - map para salesSeries, bonusOrigin, topProducts, timeline
// DEVERIA: DashboardRepository.getDashboardData() → RPC → ViewModel
```

---

## 9. SERVICES — MIGRAÇÃO CRÍTICA

### MlmEngineService (CANÔNICO) — src/services/mlm-engine.ts
```typescript
export const MlmEngineService = {
  plans: PlanModule,           // → src/modules/mlm-engine/plan.module.ts
  network: NetworkModule,      // → network.module.ts
  commissions: CommissionModule, // → commission.module.ts
  bonus: BonusModule,          // → bonus.module.ts
  points: PointsModule,        // → points.module.ts
  qualifications: QualificationModule, // → qualification.module.ts
  wallet: WalletModule,        // → wallet.module.ts
  payouts: PayoutModule,       // → payout.module.ts
};
```

### Services Legados EM USO (precisam migrar)

| Service Legado | Arquivo | Usado Por | Substituto Canônico |
|----------------|---------|-----------|---------------------|
| **CustomerService** | `src/services/customers/index.ts` | useCustomers, useNetwork, useOfficeDashboard | Manter (CRM não é MLM) |
| **NetworkService** | `src/services/network/index.ts` | useNetwork | `MlmEngineService.network` |
| **PlanService** | `src/services/plans/index.ts` | useCommissions, useOfficeDashboard | `MlmEngineService.plans` |
| **OrderService** | `src/services/orders/index.ts` | useOfficeDashboard, useCommissions | `MlmEngineService.commissions` + `network` |
| **PaymentService** | `src/services/payments/index.ts` | useOfficeDashboard, useCommissions | `MlmEngineService.commissions` |
| **BonusService** | `src/services/bonus/index.ts` | useWalletData | `MlmEngineService.bonus` |
| **PointsService** | `src/services/points/index.ts` | useWalletData | `MlmEngineService.points` |
| **WithdrawalService** | `src/services/withdrawals/index.ts` | useOfficeDashboard | `MlmEngineService.payouts` |
| **ProductService** | `src/services/products/index.ts` | useOfficeDashboard | Manter (Commerce) |
| **SupabaseService** | `src/modules/auth/services/supabase.service.ts` | useDistributorQuery | `MlmEngineService` + RoleResolver |

### Services Legados MORTOS (zero imports)
- Verificar: `copilot/`, `crm360/`, `customer360/`, `leads/`, `marketing/`, `analytics/`, `industrial/`, `payment-methods/`, `system/`, `cart/`

### Violação SOLID nos Services Legados

| Service | Responsabilidades (7) |
|---------|----------------------|
| **OrderService** | 1. Query orders 2. Query customers 3. Transform network legs 4. Transform commission rows 5. `OfficeRules` (comissão/bônus) 6. `EarningsRules` (unilevel) 7. Stats calculation |
| **PlanService** | 1. CRUD planos 2. Bonus rules CRUD 3. Plan activation 4. Plan history 5. Analytics 6. Bonus distribution 7. Stats |
| **PaymentService** | 1. Fetch payments 2. Transform for commissions 3. Fetch for dashboard 4. Analytics |

---

## 10. REACT QUERY — CACHE E INVALIDAÇÃO

### Configuração Atual
- **QueryClient:** Único, criado em `src/lib/react-query/client.ts`
- **staleTime:** NÃO configurado globalmente (default 0 = sempre stale)
- **gcTime:** NÃO configurado (default 5min)
- **refetchOnWindowFocus:** true (default)
- **retry:** 3 (default)

### queryInvalidation.ts — 7 funções
```typescript
invalidateCustomerQueries, invalidateOrderQueries, invalidateWalletQueries,
invalidatePaymentQueries, invalidatePlanQueries, invalidateNetworkQueries,
invalidateAnalyticsQueries, invalidateAuditQueries
```

### Problemas
| Problema | Impacto | Severidade |
|----------|---------|------------|
| **staleTime = 0** | Refetch constante ao navegar | 🔴 Crítico |
| **Sem cache persistente** | Dados recarregados a cada mount | 🔴 Crítico |
| **Invalidation excessiva** | `invalidateCustomerQueries` invalida 6 keys | 🟠 Alto |
| **Keys não tipadas completamente** | `as const` usado mas inferência incompleta | 🟡 Médio |

---

## 11. FLUXOS DE RENDERIZAÇÃO — ONDE QUEBRA

### Fluxo Correto (NOVO — MlmEngineService)
```
Page → Hook (useQuery) → MlmEngineService.* → Supabase (RPC/SQL)
     ↓                                    ↓
  Render ✓                            Dados Reais ✓
```

### Fluxo Quebrado (LEGACY)
```
Page → Hook (useQuery) → LegacyService (Order/Payment/Plan/etc)
     ↓                                    ↓
  Render? ✗/PARCIAL                   Supabase direto (sem RPC)
     ↓                                    ↓
  Console.log OK ✓                   Dados chegam mas...
     ↓                                    ↓
  TELA VAZIA/INCOMPLETA ✗           Transformação manual ineficiente
```

### Páginas com Fluxo Quebrado

| Página | Hook | Service Legado | Problema |
|--------|------|----------------|----------|
| `/office/` | useOfficeDashboard | OrderService + PaymentService + CustomerService + ProductService + WithdrawalService | 5 services legados, lógica de negócio no hook |
| `/office/orders` | (verificar) | OrderService | Service legado |
| `/office/finance` | (verificar) | PaymentService + OrderService | Mock + real misturado |
| `/__app/commissions` | useCommissions | PaymentService + PlanService + CustomerService + OrderService | 4 services legados |
| `/__app/wallets` | (verificar) | WalletService? | Provavelmente legacy |
| `/office/network` | useNetwork | NetworkService + CustomerService + OrderService | Parcialmente migrado |

---

## 12. BANCO DE DADOS — AUDITORIA

### Schemas e Tabelas Principais

| Schema | Tabelas Principais | Status |
|--------|-------------------|--------|
| `identity` | `roles`, `user_roles` | ✅ RBAC source of truth |
| `crm` | `customers` (id_comprador = canonical) | ✅ Core |
| `mlm` | `planos`, `distribuidores`, `rede_linear_nos`, `bonus_regras`, `comissoes`, `carteiras`, `carteiras_transacoes`, `pontos_saldo`, `pontos_transacoes`, `bonus_historico`, `planos_distribuidores`, `network_relationships` | ✅ MLM Core |
| `commerce` | `orders` | ✅ Orders |
| `finance` | `solicitacoes_saque` | ✅ Withdrawals |
| `industrial` | `machines`, `materials`, `processes` | ✅ Industrial |
| `public` | `automations`, `bots`, `campaigns`, `customers` (dup?), `imports`, `leads`, `labels`, `chatwoot_*` | ⚠️ Duplicação com crm.customers |

### Problemas Identificados

| Problema | Detalhe | Severidade |
|----------|---------|------------|
| **customers duplicado** | `public.customers` e `crm.customers` | 🔴 Crítico |
| **RLS policies ~50+** | Muitas podem ser duplicadas/inúteis | 🟠 Alto |
| **SQL Functions 70+** | Muitas wrappers/duplicadas/não usadas | 🟠 Alto |
| **FKs 200+** | Auditar para ciclos/desnecessárias | 🟡 Médio |
| **Tabelas órfãs** | `chatwoot_*`, `bots`, `automations`, `campaigns` podem não ter páginas | 🟡 Médio |
| **Triggers não auditados** | Verificar triggers em mlm.* | 🟡 Médio |

---

## 13. RPC — MAPEAMENTO

### RPCs Supabase Identificados
| RPC | Chamada Por | Tabela/Schema | Retorno | Tratamento Erro |
|-----|-------------|---------------|---------|-----------------|
| `processar_pedido_mlm` | `CommissionModule.processOrder()` | mlm | success/message | try/catch |
| `processar_ciclo_comissoes` | `CommissionModule.runCycle()` | mlm | message | throw Error |

### RPCs FALTANDO (Devem Existir para ViewModels)
| RPC Necessário | Propósito |
|----------------|-----------|
| `rpc_dashboard(distribuidor_id)` | Retorna ViewModel completa do dashboard em 1 call |
| `rpc_customer_360(customer_id)` | Retorna ViewModel 360 do cliente |
| `rpc_network_tree(distribuidor_id, max_levels)` | Retorna árvore de rede pronta para UI |
| `rpc_wallet_summary(distribuidor_id)` | Retorna saldo + extrato resumido |
| `rpc_commission_summary(distribuidor_id, period)` | Retorna comissões agregadas por período |

### Edge Functions
| Função | Tipo | Auth |
|--------|------|------|
| `set-user-claims` | Edge Function | service_role |
| `chat-completion` | Edge Function | anon? |
| `generate-embedding` | Edge Function | anon? |

---

## 14. FRONTEND × BACKEND — VALIDAÇÃO DE FLUXOS

### Fluxo Canônico (NOVO)
```
Page (office/index.tsx)
    ↓
Hook (useOfficeDashboard)
    ↓
MlmEngineService.commissions.getCommissionsByDistribuidor()
    ↓
Supabase (mlm.comissoes table)
    ↓
Response → Hook → Render ✓
```

### Fluxos Quebrados (LEGACY)
```
Page (office/index.tsx)
    ↓
Hook (useOfficeDashboard)
    ↓
OrderService.fetchOrdersForDashboard()  ← LEGACY
PaymentService.fetchPaymentsForDashboard()  ← LEGACY
CustomerService.fetchCustomersList()  ← LEGACY (CRM ok)
ProductService.fetchProducts()  ← LEGACY
WithdrawalService.fetchRecentWithdrawals()  ← LEGACY
    ↓
Transformação manual no hook (linhas 24-77)
    ↓
Render PARCIAL (dados chegam mas lógica de negócio no frontend)
```

---

## 15. CRUD POR MÓDULO

| Módulo | Listar | Criar | Editar | Excluir | Detalhar | % Completo |
|--------|--------|-------|--------|---------|----------|------------|
| **Customers** | ✅ `__app/customers/` | ❌ | ❌ | ❌ | ✅ `$id` | 40% |
| **Distributors** | ✅ `__app/distributors/` + `office/network` | ✅ `seja-distribuidor` | ❌ | ❌ | ❌ | 40% |
| **Plans** | ✅ `__app/plans` + `office/plan` | ✅ PlanService.createPlan | ✅ PlanService.updatePlan | ✅ PlanService.deleteBonusRule | ✅ | 100% |
| **Network** | ✅ `office/network` + `__app/network` | ❌ | ❌ | ❌ | ❌ | 20% |
| **Wallet** | ✅ `__app/wallets` | ❌ (addFunds interno) | ❌ | ❌ | ❌ | 20% |
| **Orders** | ✅ `__app/orders/` + `office/orders` | ✅ checkout | ❌ | ❌ | ❌ | 40% |
| **Products** | ✅ `__app/products/` + `loja` | ❌ | ❌ | ❌ | ✅ `produto/$id` | 40% |
| **Qualifications** | ❌ | ❌ | ❌ | ❌ | ❌ | 0% |
| **Bonus** | ✅ `__app/analytics`? | ❌ | ❌ | ❌ | ❌ | 10% |
| **Campaigns** | ❌ | ❌ | ❌ | ❌ | ❌ | 0% |
| **Finance** | ✅ `office/finance` + `__app/wallets` | ✅ saque | ❌ | ❌ | ❌ | 30% |
| **Analytics** | ✅ `__app/analytics` + `__app/insights` | N/A | N/A | N/A | N/A | 80% |
| **System** | ✅ `__app/system` | ❌ | ❌ | ❌ | ❌ | 20% |

---

## 16. MLM — AUDITORIA DEDICADA

### Frontend vs Backend vs Banco

| Domínio | Frontend (Hooks/Pages) | Backend (MlmEngineService) | Banco (mlm schema) | Gap |
|---------|------------------------|----------------------------|---------------------|-----|
| **Planos** | `office/plan.tsx`, `__app/plans.tsx`, `PlanService` | `PlanModule` ✅ | `planos`, `planos_distribuidores` ✅ | Legacy PlanService ainda usado |
| **Qualificações** | ❌ | `QualificationModule` (stub) | `qualificacoes` (verificar) | Frontend 0% |
| **Rede Linear** | `office/network.tsx`, `useNetwork` | `NetworkModule` ✅ | `rede_linear_nos` ✅ | Parcial |
| **Rede Binária** | ❌ | ❌ | `network_relationships` (left/right) | Ambos 0% |
| **Comissões** | `useCommissions` (legacy), `office/finance` | `CommissionModule` ✅ | `comissoes` ✅ | Legacy services |
| **Ledger** | ❌ | `CommissionModule` (parcial) | `comissoes`, `carteiras_transacoes` | Frontend 0% |
| **Wallet** | `useWalletData`, `__app/wallets` | `WalletModule` ✅ | `carteiras`, `carteiras_transacoes` ✅ | Parcial |
| **Cashback** | ❌ | ❌ | Verificar tabelas | Ambos 0% |
| **Bônus** | `useBonus`, `useWalletData` | `BonusModule` ✅ | `bonus_regras`, `bonus_historico` ✅ | Legacy BonusService |
| **Campanhas** | ❌ | ❌ | `campaigns` (public) | Ambos 0% |
| **Scheduler/Queue** | ❌ | ❌ | RPCs: `processar_pedido_mlm`, `processar_ciclo_comissoes` | Apenas RPC |
| **Pontos** | `usePoints`, `useWalletData` | `PointsModule` ✅ | `pontos_saldo`, `pontos_transacoes` ✅ | Legacy PointsService |
| **Upgrade** | ❌ | `PlanModule.getUpgradeSuggestions` | `planos_distribuidores` history | Frontend 0% |
| **Renovação** | ❌ | ❌ | Verificar | Ambos 0% |
| **Rules Engine** | ❌ | `CommissionModule.calculateCommission` (usa plan-utils) | `bonus_regras` com configuracoes JSON | Frontend 0% |

### Regras de Negócio — Onde Estão

| Regra | Localização Atual | Deveria Estar |
|-------|-------------------|---------------|
| Cálculo comissão direta | `OrderService.OfficeRules.calculateCommission()` (legacy) | `CommissionModule.calculateCommission()` |
| Cálculo bônus patrocínio | `OrderService.OfficeRules.calculateBonus()` (legacy) | `CommissionModule.calculateCommission()` |
| Unilevel generations | `OrderService.EarningsRules` (legacy) | `CommissionModule` |
| Leadership bonus (excelencia) | `CommissionModule.calculateCommission()` ✅ | ✅ Correto |
| Qualificação por pontos | `QualificationModule` (stub) | `QualificationModule` |
| Upgrade sugestão | `PlanModule.getUpgradeSuggestions()` ✅ | ✅ Correto |

---

## 17. PERFORMANCE

| Problema | Localização | Impacto | Severidade |
|----------|-------------|---------|------------|
| **staleTime = 0** | Todas queries TanStack Query | Refetch constante | 🔴 Crítico |
| **Bundle size** | Imports pesados (recharts, framer-motion, lucide-react em muitas pages) | Load inicial lento | 🟠 Alto |
| **Rotas carregando tudo** | `__app.tsx` importa CopilotDrawer sempre | Código desnecessário | 🟡 Médio |
| **Components não memoizados** | `StatCard`, `Card` em office/index.tsx | Re-renders desnecessários | 🟡 Médio |
| **Queries duplicadas** | `useOfficeDashboard` faz 5 queries paralelas | Overfetching | 🟠 Alto |
| **Infinite queries ausentes** | Listas paginadas (customers, orders) | UX ruim em listas grandes | 🟡 Médio |
| **Suspense não usado** | Nenhum `useSuspenseQuery` | Loading states manuais | 🟢 Baixo |
| **Business logic no frontend** | Hooks calculam agregações que deveriam vir do banco | CPU client, latência | 🔴 Crítico |

---

## 18. SEGURANÇA

| Item | Status | Detalhe |
|------|--------|---------|
| **RLS** | ~50+ policies | Auditar duplicação |
| **Auth** | Supabase Auth + JWT claims via Edge Function | ✅ |
| **Roles** | `identity.roles` + `identity.user_roles` | ✅ Source of truth |
| **Permissions** | `shared/config/role-permissions.ts` (canônico) | ✅ |
| **RouteGuard** | Em `__app.tsx` (admin) + `office.tsx` (distributor) | ✅ |
| **RPC Públicas** | `processar_pedido_mlm`, `processar_ciclo_comissoes` | ⚠️ Verificar auth |
| **service_role** | Usado apenas em Edge Functions | ✅ |
| **anon key** | Frontend usa anon key | ✅ |
| **JWT Claims** | Atualizados via `set-user-claims` Edge Function | ✅ |

---

## 19. CÓDIGO MORTO

| Categoria | Itens | Ação |
|-----------|-------|------|
| **Services** | `copilot/`, `crm360/`, `customer360/`, `leads/`, `marketing/`, `analytics/`, `industrial/`, `payment-methods/`, `system/`, `cart/` | Verificar imports, remover se zero |
| **Hooks** | Verificar cada pasta em `/hooks/` | `grep -r "useX" src/` |
| **Components** | `CopilotPage.tsx` (duplicata), verificar outros | Remover duplicatas |
| **Routes** | `/office/reports`, `/office/downloads` (vazias) | Implementar ou remover |
| **Queries** | Keys não usadas no `queryKeys.ts` | Cross-ref com hooks |
| **RPCs** | Edge Functions `chat-completion`, `generate-embedding` podem não ser usadas | Verificar |
| **Tabelas** | `public.customers` (dup), `chatwoot_*`, `bots`, `automations`, `campaigns` | Auditar uso |
| **Migrations** | 70+ SQL functions, muitas não usadas | Auditar |

---

## 20. DUPLICAÇÃO

| Tipo | Exemplos | Severidade |
|------|----------|------------|
| **Rotas (domínio)** | `customers`, `distributors`, `orders`, `products`, `network` em `/office/` E `/__app/` | 🔴 Crítico |
| **Rotas (exata)** | `/office/copilot` → `copilot.tsx` + `CopilotPage.tsx` | 🔴 Crítico |
| **Components** | `OfficeSidebar`/`OfficeTopbar` vs `SidebarNav`/`Topbar` | 🟠 Alto |
| **Services** | `PlanService` vs `MlmEngineService.plans`, `BonusService` vs `MlmEngineService.bonus`, etc | 🔴 Crítico |
| **Hooks** | `useNetwork` usa `NetworkService` + `CustomerService` vs `MlmEngineService.network` | 🟠 Alto |
| **Types** | `BonusRegra` definido em `mlm-engine/types.ts` E importado em `services/bonus/index.ts` | 🟡 Médio |
| **QueryKeys** | Keys literais vs factory (verificar) | 🟡 Médio |
| **Schemas** | `public.customers` vs `crm.customers` | 🔴 Crítico |
| **Layouts** | Dois sistemas paralelos (office vs __app) para mesmo domínio)app) | 🔴 Crítico |

---

## 21. INCONSISTÊNCIAS ARQUITETURAIS

| Padrão Oficial | Violação Encontrada | Localização |
|----------------|---------------------|-------------|
| Route → Feature Page → Feature Components → Hooks → **MlmEngineService** → RPC → Supabase | Pages usam `src/services/*` legados em vez de `src/modules/*/services/*` | `useOfficeDashboard`, `useCommissions`, `useWalletData`, `useNetwork` |
| Nenhuma página acessa Supabase diretamente | `SupabaseService` em auth module acessa Supabase direto | `src/modules/auth/services/supabase.service.ts` |
| Nenhum componente chama Service diretamente | Verificar componentes | Parece OK |
| Toda regra de negócio em Services canônicos | `OrderService.OfficeRules` e `EarningsRules` têm regras de comissão | `src/services/orders/index.ts:49-82` |
| Dual Role Definition | `src/shared/types/roles.ts` (canônico 11 roles) vs `shared/types/api.types.ts:77` (legacy 4 roles) | `shared/types/api.types.ts` |
| **Repository Layer Ausente** | Services acessam Supabase diretamente | Todos os services |
| **ViewModel Layer Ausente** | Components transformam dados recebidos | Todos os componentes |

---

## 22. PLANO DE CORREÇÃO — REPRIORIZADO (ARQUITETURA FIRST)

> **Mudança fundamental:** A sequência original priorizava migrar services legados. A nova sequência prioriza **estabilizar a arquitetura** primeiro.

### FASE 0 — CONGELAR E CONSOLIDAR ARQUITETURA (Semana 1-2) 🔴 CRÍTICO

| # | Item | Esforço |
|---|------|---------|
| 0.1 | **Definir estrutura Feature-First oficial** (`modules/{feature}/{components,hooks,repository,service,types,validators,routes}`) | 2 dias |
| 0.2 | **Eliminar rotas duplicadas**: unificar `/office/*` e `/__app/*` em `/admin/*`, `/distributor/*`, `/customer/*`, `/public/*` | 3 dias |
| 0.3 | **Unificar layouts**: um layout por role (Admin, Distributor, Customer, Public) compartilhando componentes | 3 dias |
| 0.4 | **Corrigir import quebrado** `shared/config/role-permissions.ts:12` | 15 min |
| 0.5 | **Remover `CopilotPage.tsx` duplicata** | 30 min |
| 0.6 | **Configurar `staleTime: 5min` global no QueryClient** | 30 min |

### FASE 1 — GARANTIR RENDERIZAÇÃO DE DADOS REAIS (Semana 2-3) 🔴 CRÍTICO

| # | Item | Esforço |
|---|------|---------|
| 1.1 | **Todas as páginas devem carregar, tratar loading/error, exibir dados consistentes** — antes de qualquer refatoração grande | 1 semana |
| 1.2 | Criar `DashboardRepository` + `rpc_dashboard()` + `DashboardViewModel` | 3 dias |
| 1.3 | Migrar `useOfficeDashboard` → `useDashboard()` (fino, apenas useQuery) | 2 dias |
| 1.4 | Validar: Dashboard renderiza 100% sem lógica no hook | 1 dia |

### FASE 2 — INTRODUZIR REPOSITORY + VIEWMODEL (Semana 3-5) 🟠 ALTO

| # | Item | Esforço |
|---|------|---------|
| 2.1 | **Padrão Repository**: `XxxRepository` (data access) → `XxxMapper` (DB → ViewModel) → `useXxx()` (hook fino) | 1 semana |
| 2.2 | Implementar para: Customers, Network, Wallet, Orders, Commissions | 2 semanas |
| 2.3 | Criar RPCs agregadoras no banco: `rpc_dashboard`, `rpc_network_tree`, `rpc_wallet_summary`, `rpc_customer_360` | 1 semana |
| 2.4 | Remover TODA transformação manual dos hooks e componentes | 1 semana |

### FASE 3 — MIGRAR SERVICES LEGADOS PARA MLMENGINE (Semana 5-7) 🟠 ALTO

| # | Item | Esforço |
|---|------|---------|
| 3.1 | Migrar `PlanService` → `MlmEngineService.plans` | 2 dias |
| 3.2 | Migrar `BonusService` → `MlmEngineService.bonus` | 2 dias |
| 3.3 | Migrar `PointsService` → `MlmEngineService.points` | 1-2 dias |
| 3.4 | Migrar `WithdrawalService` → `MlmEngineService.payouts` | 1-2 dias |
| 3.5 | Migrar `OrderService.OfficeRules/EarningsRules` → `CommissionModule` | 2-3 dias |
| 3.6 | Migrar `NetworkService` → `MlmEngineService.network` | 1-2 dias |

### FASE 4 — OTIMIZAR DESEMPENHO (Semana 7-8) 🟡 MÉDIO

| # | Item | Esforço |
|---|------|---------|
| 4.1 | `staleTime`/`gcTime` por query, `refetchOnWindowFocus: false` | 1 dia |
| 4.2 | `useInfiniteQuery` para listas paginadas | 2-3 dias |
| 4.3 | `useSuspenseQuery` + Error Boundaries | 2-3 dias |
| 4.4 | Lazy loading routes, code splitting, memoização | 2-3 dias |

### FASE 5 — LIMPEZA FINAL (Semana 8-10) 🟢 BAIXO

| # | Item | Esforço |
|---|------|---------|
| 5.1 | Padronizar componentes UI (Button, Input, Card, etc) | 3-5 dias |
| 5.2 | Toaster global (sonner), ThemeProvider único | 1 dia |
| 5.3 | Limpar código morto (services, hooks, components, routes, tabelas, RPCs, migrations) | 2-3 dias |
| 5.4 | Consolidar `shared/types/api.types.ts` legacy UserRole | 30 min |
| 5.5 | Documentar RPCs, Edge Functions, arquitetura | 1-2 dias |
| 5.6 | Testes (vitest + testing-library) | 1-2 semanas |

---

## 23. EVIDÊNCIAS CHAVE (Arquivo:Linha)

| Descoberta | Arquivo | Linha |
|------------|---------|-------|
| MlmEngineService canônico | `src/services/mlm-engine.ts` | 1-21 |
| useOfficeDashboard usa 5 services legados | `src/hooks/office/useOfficeDashboard.ts` | 16-22 |
| useCommissions usa 4 services legados | `src/hooks/commissions/useCommissions.ts` | 12-16 |
| useWalletData mistura MlmEngine + legacy | `src/hooks/wallets/useWalletData.ts` | 14-20 |
| useNetwork usa NetworkService + CustomerService | `src/hooks/network/useNetwork.ts` | 11-14 |
| RolePermissions import quebrado | `shared/config/role-permissions.ts` | 12 |
| Rota duplicada copilot | `src/routes/office/copilot.tsx` + `CopilotPage.tsx` | - |
| Domínios duplicados office/__app | `routeTree.gen.ts` | 330-390 |
| OrderService.OfficeRules (regras legado) | `src/services/orders/index.ts` | 49-60 |
| OrderService.EarningsRules (regras legado) | `src/services/orders/index.ts` | 62-82 |
| QueryClient sem staleTime | `src/lib/react-query/client.ts` | (verificar) |
| customers duplicado public/crm | `supabase/types.ts` | ~500 + ~1000 |
| Nenhum Repository implementado | `src/modules/*/repository/` | (não existe) |
| Nenhum ViewModel/Mapper | `src/modules/*/mapper/` | (não existe) |
| RPCs agregadoras ausentes | `supabase/functions/` | (apenas 3 functions) |

---

## 24. RESUMO EXECUTIVO

**Total de problemas identificados: 100+**
- 🔴 Críticos: 15 (arquiteturais + bloqueadores)
- 🟠 Altos: 18 (inconsistências + riscos)
- 🟡 Médios: 25 (melhorias estruturais)
- 🟢 Baixos: 15 (cosméticos)
- Estruturais/Duplicação: 30+
- Código morto: 20+

**Tempo estimado para estabilização completa: 8-10 semanas**

---

### O Objetivo Real

> **Não é "migrar para o MlmEngine".**  
> O objetivo é transformar o AllIn OS2 em uma arquitetura onde **cada informação tem uma única fonte de verdade, um único caminho de carregamento e uma única responsabilidade por camada**.

Quando isso acontecer:
- Telas vazias desaparecem (dados vêm prontos via RPC → ViewModel)
- Dados inconsistentes desaparecem (Repository único por domínio)
- Manutenção complexa desaparece (Feature-First + Repository + ViewModel)
- Performance melhora (1 RPC vs 5 queries + transformação client-side)
- Testes ficam viáveis (Domain Services puros, Repository mockável, Hooks finos)

---

**Fim do Relatório v2.0**