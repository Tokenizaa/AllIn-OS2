# TABLE FUNCTIONAL SPECIFICATION — AllIn-OS2
## Complete Platform Reverse Engineering Document

> Generated: 2026-07-21 | Version: 1.0 | Sources: 107 migrations, 6 Edge Functions, 10 RPCs, 385 TS files

---

## 1. PLATFORM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AllIn-OS2 Platform Architecture                  │
│                                                                         │
│   ┌──────────┐    ┌──────────────────┐    ┌──────────────────────────┐  │
│   │ React 19 │    │ TanStack Router  │    │   TanStack Query (REST)  │  │
│   │  + TS    │◄──►│   (File-based)   │◄──►│  + Supabase JS Client   │  │
│   └──────────┘    └──────────────────┘    └───────────┬──────────────┘  │
│                                                        │                │
│   ┌─────────────────────────────────────────────────────┼────────────┐  │
│   │                    Supabase                        │            │  │
│   │  ┌─────────────┐  ┌──────────┐  ┌──────────────────┘            │  │
│   │  │ PostgreSQL  │  │ Edge    │  │  RPC Functions (10)            │  │
│   │  │ (10 schemas)│  │Functions│  │  rpc_dashboard, rpc_wallet...  │  │
│   │  │ ~75 tables  │  │ (6)     │  └───────────────────────────────┘  │
│   │  │ 0 views     │  └──────────┘                                    │
│   │  │ 75 triggers │                                                 │
│   │  │ 6 enums     │                                                 │
│   │  └─────────────┘                                                 │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│   Auth: AuthProvider + AuthContext + RouteGuard + JWT Claims            │
│   Roles: RBAC via identity.roles + identity.user_roles (11 roles)      │
│   External: AllIn API (sync), Ollama (copilot), Resend (email)         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, TanStack Router, TanStack Query |
| Backend | Supabase (PostgreSQL + Edge Functions only — no Node server) |
| Database | Supabase PostgreSQL (pgvector, pg_graphql extensions) |
| Auth | Supabase Auth + custom JWT claims + RBAC |
| External APIs | AllIn (legacy ERP sync), Ollama (AI copilot) |

### Schema Organization (10 schemas)

| Schema | Purpose | Tables | Primary Key Strategy | Created In |
|--------|---------|--------|---------------------|------------|
| `public` | Legacy + auth metadata + copilot | 12 | Mixed UUID + SERIAL | Original |
| `identity` | Users, roles, permissions | 6 | UUID | 035 |
| `crm` | Customers, profiles, documents, distributor info | 5 | UUID | 035 |
| `mlm` | MLM core: distributors, plans, commissions, wallets, network | 17 | UUID | 035 |
| `commerce` | Products, orders, payments, coupons | 7 | UUID | 035 |
| `finance` | Withdrawals, wallets (planned), wallet transactions | 4 | UUID | 035 |
| `logistics` | Warehouses, inventory, shipments, deliveries | 7 | UUID | 035 |
| `location` | States, cities, addresses | 3 | UUID | 035 |
| `system` | Audit logs, configs, integrations, notifications | 5 | UUID | 035 |
| `industrial` | Machines, materials, processes, BOM | 20 | UUID | 058 |

**Total: ~75 real tables** (verified by QA — initial claim of "90+" was overcounted; "30 views" was false — there are 0 views; 75 triggers exist, not 7)

---

## 2. DATA ARCHITECTURE

### Schema: `public` (Legacy + Auth Metadata + Copilot)

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `public.user_profiles` | Original user profiles (legacy) | Low | Legacy | 001 |
| `public.admin_users` | Admin users (legacy) | Low | Legacy | 001 |
| `public.empresas` | Companies (migrated to industrial.empresa in 068) | Low | Migrated | 032 |
| `public.materias_primas` | Raw materials (migrated to industrial.materiais) | Low | Migrated | 032 |
| `public.pedidos` | Orders (migrated to commerce.pedidos in 040) | Low | Migrated | 032 |
| `public.itens_pedido` | Order items (migrated to commerce.items_pedido) | Low | Migrated | 032 |
| `public.distribuidores` | Distributors (migrated to mlm.distribuidores in 039) | Low | Migrated | 032 |
| `public.planos` | Plans (migrated to mlm.planos in 039) | Low | Migrated | 032 |
| `public.bonificacoes` | Bonuses (migrated to mlm.bonificacoes in 039) | Low | Migrated | 032 |
| `public.comissoes` | Commissions (migrated to mlm.comissoes in 039) | Low | Migrated | 032 |
| `public.rede_binaria` | Binary tree (migrated to mlm.rede_binaria in 039) | Low | Migrated | 032 |
| `public.niveis` | Levels (migrated to mlm.niveis in 039) | Low | Migrated | 032 |
| `public.regras_comissionamento` | Commission rules (migrated to mlm.* in 039) | Low | Migrated | 032 |
| `public.qualificacoes` | Qualifications (migrated to mlm.qualificacoes in 039) | Low | Migrated | 032 |
| `public.carteiras` | Wallets (migrated to mlm.carteiras in 039) | Low | Migrated | 032 |
| `public.solicitacoes_saque` | Withdrawals (migrated to finance.* in 041) | Low | Migrated | 032 |
| `public.historico_saldo_distribuidor` | Balance history (migrated to mlm.* in 039) | Low | Migrated | 032 |
| `public.historico_pedido` | Order history (migrated to mlm.* in 039) | Low | Migrated | 032 |
| `public.historico_status_pedido` | Order status history (migrated to mlm.* in 039) | Low | Migrated | 032 |
| `public.estoque` | Inventory (migrated to logistics.estoque in 038) | Low | Migrated | 032 |
| `public.estoque_itens` | Inventory items (migrated to logistics.* in 038) | Low | Migrated | 032 |
| `public.envios` | Shipments (migrated to logistics.envios in 038) | Low | Migrated | 032 |
| `public.romaneios` | Manifests (migrated to logistics.romaneios in 038) | Low | Migrated | 032 |
| `public.itens_romaneio` | Manifest items (migrated to logistics.* in 038) | Low | Migrated | 032 |
| `public.cupons` | Coupons (migrated to commerce.cupons in 040) | Low | Migrated | 032 |
| `public.products` | Products (migrated to commerce.products in 040) | Low | Migrated | 032 |
| `public.pagamentos` | Payments (migrated to commerce.pagamentos in 040) | Low | Migrated | 032 |
| `public.tipos_campo_pedido` | Order field types (migrated to commerce.* in 040) | Low | Migrated | 033 |
| `public.sync_log` | AllIn sync log | Medium | Primary | 20260718... |
| `public.migration_backfill_log` | Dual-key migration tracking | Low | Primary | 083 |
| `public.copilot_chat_sessions` | Copilot conversation sessions | Low | Primary | 059 |
| `public.copilot_chat_messages` | Copilot messages | Low | Primary | 059 |
| `public.copilot_chat_usage` | Copilot usage statistics | Low | Primary | 059 |

### Schema: `identity`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `identity.users` | Maps to `auth.users.id`, RBAC user registry | Medium | ✅ Primary | 001→035 |
| `identity.roles` | RBAC roles (11 roles) | Low | ✅ Primary | 001→035 |
| `identity.user_roles` | User↔Role assignments | Medium | ✅ Primary | 001→035 |
| `identity.permissions` | Granular permissions | Low | ✅ Primary | 001→035 |
| `identity.role_permissions` | Role↔Permission assignments | Low | ✅ Primary | 001→035 |
| `identity.mfa_factors` | Multi-factor authentication factors | Low | ✅ Primary | 20260718... |

### Schema: `crm`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `crm.customers` | Core customer entity; `customer_id` = canonical internal key | High | ✅ Primary | 001→035 |
| `crm.customer_profiles` | Dual-key profile linking auth_user_id → customer_id | Medium | ✅ Primary | 082 |
| `crm.distributor_profiles` | Dual-key profile linking auth_user_id → customer_id + distribuidor_id | Medium | ✅ Primary | 082 |
| `crm.customer_distributor` | Junction table customer ↔ distributor relationships | Medium | ✅ Primary | 082 |
| `crm.customer_documents` | Document storage for customer verification | Low | ✅ Primary | 085 |

### Schema: `mlm`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `mlm.distribuidores` | Core distributor entity; dual ID (`allin_id` + `id`) | Medium | ✅ Primary | 002→035 |
| `mlm.planos` | Plan definitions (Afiliado, Avanco, Excelencia) | Low | ✅ Primary | 003→035 |
| `mlm.planos_distribuidores` | Distributor↔Plan assignments | Medium | ✅ Primary | 003→035 |
| `mlm.bonificacoes` | Bonus records | Medium | ✅ Primary | 004→035 |
| `mlm.comissoes` | Commission records | High | ✅ Primary | 005→035 |
| `mlm.rede_binaria` | Binary tree structure (legacy) | Medium | Legacy | 006→035 |
| `mlm.niveis` | Level definitions | Low | ✅ Primary | 007→035 |
| `mlm.regras_comissionamento` | Commission rules | Low | ✅ Primary | 008→035 |
| `mlm.qualificacoes` | Qualification records | Medium | ✅ Primary | 009→035 |
| `mlm.qualificacoes_requisitos` | Qualification requirements | Low | ✅ Primary | 20260718... |
| `mlm.carteiras` | Wallet accounts (primary wallet system — **not** `finance.wallets`) | Medium | ✅ Primary | 010→035 |
| `mlm.solicitacoes_saque` | Legacy withdrawal requests | Medium | Legacy | 011→035 |
| `mlm.notificacoes` | System notifications | Medium | ✅ Primary | 20260718... |
| `mlm.api_audit` | API audit log | Medium | ✅ Primary | 20260718... |
| `mlm.historico_saldo_distribuidor` | Balance history (wallet) | High | ✅ Primary | 012→035 |
| `mlm.historico_pedido` | Order history (MLM context) | Medium | ⚙️ Derived | 032→035 |
| `mlm.historico_status_pedido` | Order status history (MLM context) | Medium | ⚙️ Derived | 032→035 |
| `mlm.bonuses_paid` | Paid bonuses tracking (network RPC) | High | ✅ Primary | 075 |
| `mlm.commissions_pending` | Pending commissions (network RPC) | High | ✅ Primary | 075 |
| `mlm.rewards` | Rewards (network RPC) | Medium | ✅ Primary | 075 |

### Schema: `commerce`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `commerce.products` | Product catalog (Portuguese names) | Medium | ✅ Primary | 013→035 |
| `commerce.pedidos` | Orders (core order table) | High | ✅ Primary | 014→035 |
| `commerce.items_pedido` | Order items (GENERATED column for subtotal) | High | ✅ Primary | 015→035 |
| `commerce.pagamentos` | Payments | Medium | ✅ Primary | 016→035 |
| `commerce.cupons` | Coupons/discounts | Low | ✅ Primary | 017→035 |
| `commerce.tipos_campo_pedido` | Order field type definitions | Low | ✅ Primary | 033→035 |

### Schema: `finance`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `finance.solicitacoes_saque` | Withdrawal requests (primary) | Medium | ✅ Primary | 011→035 |
| `finance.wallets` | **NEVER CREATED** — referenced in 081 RLS | — | ❌ Missing | — |
| `finance.points_wallets` | **NEVER CREATED** — referenced in 081 RLS | — | ❌ Missing | — |
| `finance.wallet_transactions` | **Orphan** — FK references `finance.wallets` (missing) | — | ❌ Orphan | 20260718... |

### Schema: `logistics`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `logistics.estoque` | Inventory (warehouse level) | Medium | ✅ Primary | 018→035 |
| `logistics.estoque_itens` | Inventory items (product level) | High | ✅ Primary | 018→035 |
| `logistics.envios` | Shipments | Medium | ✅ Primary | 019→035 |
| `logistics.romaneios` | Shipping manifests | Low | ✅ Primary | 020→035 |
| `logistics.itens_romaneio` | Manifest items | Medium | ✅ Primary | 020→035 |
| `logistics.entregas` | Delivery records | Medium | ✅ Primary | 20260718... |

### Schema: `location`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `location.states` | Brazilian states (UF) | Low | ✅ Primary | 021→035 |
| `location.cities` | Cities (FK→states) | Medium | ✅ Primary | 021→035 |
| `location.addresses` | Address records | Medium | ✅ Primary | 022→035 |

### Schema: `system`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `system.audit_logs` | Audit trail for all operations | High | ✅ Primary | 023→035 |
| `system.system_configs` | System configuration key-value store | Low | ✅ Primary | 024→035 |
| `system.feature_flags` | Feature flags (is_global column expected) | Low | ✅ Primary | 025→035 |
| `system.integrations` | External integration configs | Low | ✅ Primary | 026→035 |
| `system.notifications` | System notification records | Medium | ✅ Primary | 027→035 |

### Schema: `industrial`

| Table | Purpose | Est. Rows | Type | Created In |
|-------|---------|-----------|------|------------|
| `industrial.empresa` | Company info (migrated from public.empresas) | Low | ✅ Primary | 068 |
| `industrial.materiais` | Materials (migrated from public.materias_primas) | Low | ✅ Primary | 068 |
| `industrial.maquinas` | Machines/equipment | Low | ✅ Primary | 058 |
| `industrial.maquinas_capacidade` | Machine capacity records | Medium | ✅ Primary | 058 |
| `industrial.maquinas_ciclos` | Machine cycle definitions | Medium | ✅ Primary | 058 |
| `industrial.maquinas_custos` | Machine cost records | Medium | ✅ Primary | 058 |
| `industrial.maquinas_manutencao` | Machine maintenance records | Medium | ✅ Primary | 058 |
| `industrial.maquinas_tempos` | Machine timing records | Medium | ✅ Primary | 058 |
| `industrial.processos` | Manufacturing process definitions | Low | ✅ Primary | 058 |
| `industrial.processos_maquinas` | Process↔Machine junction | Medium | ✅ Primary | 058 |
| `industrial.roteiros` | Manufacturing route definitions | Low | ✅ Primary | 058 |
| `industrial.roteiros_passos` | Route steps | Medium | ✅ Primary | 058 |
| `industrial.bom` | Bill of Materials headers | Low | ✅ Primary | 058 |
| `industrial.bom_itens` | BOM component items | Medium | ✅ Primary | 058 |
| `industrial.bom_substituicoes` | BOM material substitutions | Low | ✅ Primary | 058 |
| `industrial.centros_trabalho` | Work centers | Low | ✅ Primary | 058 |
| `industrial.tipos_maquina` | Machine type catalog | Low | ✅ Primary | 058 |
| `industrial.tipos_processo` | Process type catalog | Low | ✅ Primary | 058 |
| `industrial.unidades_medida` | Units of measure catalog | Low | ✅ Primary | 058 |

---

## 3. DEPENDENCY GRAPH

### Schema Dependency Diagram

```
identity ──→ crm ──→ mlm ──→ commerce
  │                  │         │
  │                  ├───────→ finance
  │                  │         │
  │                  └───────→ logistics
  │                            │
  └─────→ system               │
                                │
public (legacy tables) ──→ industrial (via 068 migration)
```

### Cross-Table Foreign Key Dependencies

| Source Table | References | Type | Created |
|-------------|-----------|------|---------|
| `identity.user_roles.user_id` | `identity.users(auth_user_id)` | FK | 035 |
| `identity.user_roles.role_id` | `identity.roles(id)` | FK | 035 |
| `identity.role_permissions.role_id` | `identity.roles(id)` | FK | 035 |
| `identity.role_permissions.permission_id` | `identity.permissions(id)` | FK | 035 |
| `identity.mfa_factors.user_id` | `identity.users(auth_user_id)` | FK | 20260718 |
| `crm.customers.auth_user_id` | `identity.users(auth_user_id)` | FK (logical) | 035 |
| `crm.customers.patrocinador_id` | `crm.customers(id)` | Self-FK | 042 |
| `crm.customers.distribuidor_id` | `crm.customers(id)` | FK | 042 |
| `crm.customer_profiles.customer_id` | `crm.customers(id)` | FK | 082 |
| `crm.distributor_profiles.customer_id` | `crm.customers(id)` | FK | 082 |
| `crm.distributor_profiles.distribuidor_id` | `mlm.distribuidores(id)` | FK (logical) | 082 |
| `crm.customer_distributor.customer_id` | `crm.customers(id)` | FK | 082 |
| `crm.customer_distributor.distributor_id` | `crm.customers(id)` | FK | 082 |
| `crm.customer_documents.customer_id` | `crm.customers(id)` | FK | 085 |
| `mlm.distribuidores.auth_user_id` | `identity.users(auth_user_id)` | FK (logical) | 035 |
| `mlm.distribuidores.customer_id` | `crm.customers(id)` | FK (logical, 084) | 035 |
| `mlm.planos_distribuidores.distribuidor_id` | `mlm.distribuidores(id)` | FK | 035 |
| `mlm.planos_distribuidores.plan_id` | `mlm.planos(id)` | FK | 035 |
| `mlm.bonificacoes.distribuidor_id` | `mlm.distribuidores(id)` | FK | 035 |
| `mlm.comissoes.distribuidor_id` | `mlm.distribuidores(id)` | FK | 035 |
| `mlm.carteiras.distribuidor_id` | `mlm.distribuidores(id)` | FK | 035 |
| `mlm.solicitacoes_saque.distribuidor_id` | `mlm.distribuidores(id)` | FK | 035 |
| `mlm.historico_saldo_distribuidor.distribuidor_id` | `mlm.distribuidores(id)` | FK | 035 |
| `mlm.historico_pedido.pedido_id` | `commerce.pedidos(id)` | FK | 035 |
| `mlm.historico_status_pedido.pedido_id` | `commerce.pedidos(id)` | FK | 035 |
| `mlm.rede_binaria.distribuidor_id` | `mlm.distribuidores(id)` | FK | 035 |
| `mlm.rede_binaria.pai_id` | `mlm.distribuidores(id)` | Self-FK | 035 |
| `mlm.bonuses_paid.distributor_id` | `mlm.distribuidores(id)` | FK (logical) | 075 |
| `mlm.commissions_pending.distributor_id` | `mlm.distribuidores(id)` | FK (logical) | 075 |
| `mlm.rewards.distributor_id` | `mlm.distribuidores(id)` | FK (logical) | 075 |
| `mlm.api_audit.distributor_id` | `mlm.distribuidores(id)` | FK (logical) | 20260718 |
| `mlm.notificacoes.distributor_id` | `mlm.distribuidores(id)` | FK (logical) | 20260718 |
| `commerce.items_pedido.pedido_id` | `commerce.pedidos(id)` | FK | 035 |
| `commerce.items_pedido.produto_id` | `commerce.products(id)` | FK | 035 |
| `commerce.pagamentos.pedido_id` | `commerce.pedidos(id)` | FK | 035 |
| `logistics.envios.pedido_id` | `commerce.pedidos(id)` | FK (logical) | 035 |
| `logistics.entregas.pedido_id` | `commerce.pedidos(id)` | FK (logical) | 20260718 |
| `finance.wallet_transactions.wallet_id` | `finance.wallets(id)` | **FK to MISSING table** | 20260718 |
| `finance.solicitacoes_saque.distribuidor_id` | `mlm.distribuidores(id)` | FK (logical) | 035 |

---

## 4. FUNCTIONAL FLOWS

### Flow 1: Order → Commission Processing

```
1. Payment confirmed on commerce.pedidos (pagamento_confirmado = true)
2. Trigger `trigger_processar_pedido_pagamento` fires (065)
3. Calls `processar_pedido_mlm(pedido_id)` (062)
4. Identifies order type: plano vs produto
5. Routes to:
   a. `processar_compra_plano` (063) — creates/updates mlm.distribuidores + mlm.planos_distribuidores
   b. `processar_compra_produto` (064) — generates:
      - Comissão direta (direct commission)
      - Bônus patrocinador (sponsor bonus)
      - Comissões de geração (generation commissions, up to 3 levels)
      - Bônus de liderança (leadership bonus)
      - Pontos para a rede (network points)
6. Updates commerce.pedidos: comissoes_geradas = true
```

**Evidence**: `supabase/migrations/062_mlm_processar_pedido.sql:9-76` (062), `063:6-242` (063), `064:6-396` (064), `065:1` (trigger)

### Flow 2: Plan Purchase → Distributor Activation

```
1. Customer buys a plan (tipo_nome ILIKE '%Plano%' or '%plano%')
2. Plan identification: "afiliado" → 0 activation pts, "avanco" → 100 pts, "excelencia" → 500 pts
3. If buyer is NOT a distributor:
   - New mlm.distribuidores record created
   - Inserted into mlm.rede_linear_nos under sponsor
4. If buyer IS a distributor:
   - Existing distributor found by distribuidor_comprador_id or allin_id
5. mlm.planos_distribuidores upserted (or updated)
6. Points generated in mlm.pontos_saldo + mlm.pontos_transacoes
7. Qualification commented out (mlm.qualificacoes doesn't have distribuidor_id)
```

**Evidence**: `supabase/migrations/063_mlm_processar_compra_plano.sql:6-242`

### Flow 3: Wallet Credit → Withdrawal

```
1. Commissions are credited to mlm.carteiras (saldo)
2. Available balance = saldo - bloqueado
3. Distributor requests withdrawal → finance.solicitacoes_saque
4. RPCs read mlm.carteiras (not finance.wallets — which doesn't exist)
5. mlm.carteiras_transacoes tracks wallet movements
```

**Evidence**: `supabase/migrations/074_mlm_engine_wallet_rpc.sql:39-56` (reads mlm.carteiras), `078_finance_office_rpc.sql:34-49` (same)

### Flow 4: AllIn Sync

```
1. Edge Function `allin-sync` called via POST
2. Authenticates with AllIn API (client_credentials)
3. Paginates through AllIn endpoints:
   - /v1/distribuidores → crm.customers + mlm.distribuidores
   - /v1/clientes → crm.customers
   - /v1/produtos → commerce.produtos
   - /v1/pedidos → commerce.pedidos
   - /v1/pedidos/Itens → commerce.pedidos_itens
   - /v1/estoque-total-produtos → commerce.produto_estoque
   - /v1/rede-linear-nos → mlm.network_node
4. Writes sync logs to public.sync_log
```

**Evidence**: `supabase/functions/allin-sync/index.ts:150-572` (all sync functions)

### Flow 5: Dashboard Aggregation

```
1. Frontend calls mlm.rpc_dashboard(p_distribuidor_id TEXT) (073)
2. RPC queries 7 CTEs in parallel:
   - orders_cte: commerce.orders (WRONG TABLE — should be commerce.pedidos)
   - payments_cte: finance.pagamentos (NON-EXISTENT TABLE)
   - withdrawals_cte: finance.solicitacoes_saque
   - network_cte: crm.customers
   - wallet_cte: mlm.carteiras
   - commission_cte: mlm.comissoes
   - qualification_cte: crm.customers
3. Returns JSON with: stats, salesSeries, bonusOrigin, topProducts, timeline, goals, aiInsights
4. Contains `window.location.origin` (JavaScript in SQL → P0 crash)
```

**Evidence**: `supabase/migrations/073_mlm_engine_dashboard_rpc.sql:4-265`

---

## 5. PER-TABLE SPECIFICATION

For each table: Category, Origin, Dependencies, Consumers, Criticity, Status, Generation Rules, Update Rules, Integrity Constraints, Problems, Recommendations.

### identity.users

| Field | Value |
|-------|-------|
| **Category** | Auth / Identity |
| **Origin** | Migration 001→035 |
| **Dependencies** | None |
| **Consumers** | identity.user_roles, crm.customers, mlm.distribuidores, system.audit_logs |
| **Criticity** | Critical |
| **Status** | ✅ Active |
| **Generation Rules** | Created via auth.user insert (trigger set_user_claims) |
| **Update Rules** | updated_at via trigger |
| **Integrity Constraints** | PK = auth_user_id TEXT; email UNIQUE NOT NULL |
| **Problems** | TEXT PK (not UUID) complicates joins; no explicit FK from auth.users |
| **Recommendations** | Consider adding UUID PK alongside for performance |

### identity.roles

| Field | Value |
|-------|-------|
| **Category** | Auth / RBAC |
| **Origin** | Migration 001→035 |
| **Dependencies** | None |
| **Consumers** | identity.user_roles, identity.role_permissions |
| **Criticity** | Critical |
| **Status** | ✅ Active |
| **Generation Rules** | Seeded in 080 (canonical roles) |
| **Problems** | None known |
| **Recommendations** | Add seed script for CI/CD environments |

### identity.user_roles

| Field | Value |
|-------|-------|
| **Category** | Auth / RBAC |
| **Origin** | Migration 001→035 |
| **Dependencies** | identity.users, identity.roles |
| **Consumers** | RouteGuard, RoleResolver, auth hooks |
| **Criticity** | Critical |
| **Status** | ✅ Active |
| **Integrity Constraints** | UNIQUE(user_id, role_id) |
| **Problems** | None known |
| **Recommendations** | Add composite index on (user_id, role_id) |

### crm.customers

| Field | Value |
|-------|-------|
| **Category** | CRM |
| **Origin** | Migration 001→035 |
| **Dependencies** | identity.users (logical), self-referential patrocinador_id |
| **Consumers** | All MLM services, CRM360, Distributor360, all RPCs, allin-sync, 30+ hooks |
| **Criticity** | **Critical** — central entity |
| **Status** | ✅ Active |
| **Generation Rules** | Created by allin-sync or manual admin; plan purchase creates via crm sync path |
| **Update Rules** | updated_at via trigger (mlm.update_customer_updated_at) |
| **Integrity Constraints** | UNIQUE(id_comprador), UNIQUE(allin_id), UNIQUE(auth_user_id) |
| **Problems** | Phantom columns referenced by frontend: `patrocinador_comprador`, `nome_produto`, `product_name`, `estado`, `status` (crm.customers has `tipo_cliente` not `status`); `cliente_nome`, `cliente_email` etc. used in 063/064 but not in real table; migration 085 added `qualification`, `usuario`, `plan_id` as text columns (schema drift fix) |
| **Recommendations** | Add missing columns properly typed; run audit against all frontend queries |

### mlm.distribuidores

| Field | Value |
|-------|-------|
| **Category** | MLM Core |
| **Origin** | Migration 002→035 |
| **Dependencies** | crm.customers (via customer_id, auth_user_id), self-referential patrocinador_id |
| **Consumers** | All MLM modules, CommissionEngine, WalletEngine, all RPCs, allin-sync |
| **Criticity** | **Critical** |
| **Status** | ✅ Active |
| **Generation Rules** | Created by processar_compra_plano or allin-sync |
| **Update Rules** | updated_at via trigger (mlm.update_distribuidor_updated_at) |
| **Integrity Constraints** | allin_id was UNIQUE before 057 revert; now nullable with duplicates possible |
| **Problems** | Dual ID strategy (`allin_id` + `id` UUID) causes confusion; migration 057 reverted distribuidores ids from UUID back to TEXT breaking ALL JOINs; `customer_id` column added (084) but not populated for existing records; `patrocinador_id` stores distribuidor UUID but as TEXT |
| **Recommendations** | Complete dual-key migration; backfill customer_id for existing rows |

### mlm.planos

| Field | Value |
|-------|-------|
| **Category** | MLM Plans |
| **Origin** | Migration 003→035 |
| **Dependencies** | None |
| **Consumers** | PlanService (frontend uses WRONG table name `plan`), mlm.planos_distribuidores, mlm.regras_comissionamento, rpc_commissions_dashboard |
| **Criticity** | High |
| **Status** | ✅ Active |
| **Problems** | Frontend `PlanService` queries `mlm.plan` instead of `mlm.planos` (C-6: plan table naming mismatch — HIGH); `is_active` checked as `1` (number) but column type is BOOLEAN; `PlanService` has 0 imports (dead code?) |
| **Recommendations** | Fix PlanService to use `mlm.planos` and boolean comparison; verify if PlanService is used anywhere |

### mlm.comissoes

| Field | Value |
|-------|-------|
| **Category** | MLM Commissions |
| **Origin** | Migration 005→035 |
| **Dependencies** | mlm.distribuidores, commerce.pedidos |
| **Consumers** | CommissionEngine, rpc_commissions_dashboard, rpc_wallet_data, rpc_dashboard |
| **Criticity** | **Critical** |
| **Status** | ✅ Active |
| **Generation Rules** | Generated by processar_compra_produto (064) — direct, sponsor, generation up to 3 levels, leadership |
| **Problems** | rpc_commissions_dashboard queries `c.deleted_at IS NULL` but column doesn't exist (P0); `status` values differ between SQL ('pendente', 'pago') and frontend ('processando', 'pago'); commission table naming mismatch between frontend English names and Portuguese DB names (C-8) |
| **Recommendations** | Add `deleted_at` column to mlm.comissoes or remove filter; reconcile status values |

### mlm.carteiras

| Field | Value |
|-------|-------|
| **Category** | MLM Wallet |
| **Origin** | Migration 010→035 |
| **Dependencies** | mlm.distribuidores |
| **Consumers** | WalletEngine, rpc_wallet_data, rpc_office_finance, rpc_dashboard, Distributor360, various hooks |
| **Criticity** | High |
| **Status** | ✅ Active |
| **Generation Rules** | Auto-created via trigger or manually at distributor creation |
| **Problems** | `finance.wallets` was planned but never created — `finance.wallet_transactions` has FK to non-existent table; mlm.carteiras is the real wallet; Two conflicting formulas for available balance: SQL uses `saldo - bloqueado`, frontend has different calculation; Race condition in wallet updates (read-modify-write without locks — P2) |
| **Recommendations** | Either create finance.wallets and migrate mlm.carteiras, or remove finance.wallets references; add row-level locking for wallet updates |

### commerce.pedidos

| Field | Value |
|-------|-------|
| **Category** | Commerce Orders |
| **Origin** | Migration 014→035 |
| **Dependencies** | crm.customers (via id_comprador), mlm.distribuidores (via distribuidor_comprador_id, distribuidor_indicador_id) |
| **Consumers** | OrderService, OrderEngine, MLM processors, rpc_dashboard, Dashboard |
| **Criticity** | **Critical** |
| **Status** | ✅ Active |
| **Generation Rules** | Created by allin-sync or manual order entry |
| **Problems** | rpc_dashboard (073) queries `commerce.orders` instead of `commerce.pedidos` (P0 crash); phantom columns queried: `valor_total_pedido`, `product_name`, `nome_produto`, `patrocinador_comprador`; `cliente_id` queried by frontend (Distributor360, Customer360) but column might not exist |
| **Recommendations** | Fix rpc_dashboard to use `commerce.pedidos`; add missing columns or fix queries |

### finance.wallets

| Field | Value |
|-------|-------|
| **Category** | Finance (plannned but missing) |
| **Origin** | **NEVER CREATED** |
| **Dependencies** | N/A |
| **Consumers** | RLS policies in 081, FK from finance.wallet_transactions, Customer360Service (queries for it) |
| **Criticity** | **P0** |
| **Status** | ❌ Missing |
| **Problems** | Table referenced in 081 RLS policies but never created; `finance.wallet_transactions` has FK to non-existent table; `Customer360Service.fetchFinanceWallet` queries `finance.wallets` which will always return null; all RPCs (078/079) read from `mlm.carteiras` instead |
| **Recommendations** | Either create the table with proper migration, or remove all references (RLS policies, FK constraint, frontend queries) and keep using mlm.carteiras |

### finance.wallet_transactions

| Field | Value |
|-------|-------|
| **Category** | Finance (orphan) |
| **Origin** | Migration 20260718194804 |
| **Dependencies** | finance.wallets (MISSING — FK constraint will fail on INSERT) |
| **Consumers** | Customer360Service |
| **Criticity** | **P0** |
| **Status** | ❌ Orphan |
| **Problems** | FK to non-existent table `finance.wallets`; no DML will succeed; index `idx_finance_wallet_transactions_wallet` created referencing this |
| **Recommendations** | Fix FK target to `mlm.carteiras` or create `finance.wallets` |

(Continues in part 2...)

### commerce.products

| Field | Value |
|-------|-------|
| **Category** | Commerce Products |
| **Origin** | Migration 013→035 |
| **Dependencies** | None |
| **Consumers** | productsService (frontend), allin-sync, commerce.items_pedido |
| **Criticity** | High |
| **Status** | ✅ Active |
| **Problems** | Dual product tables: `commerce.products` (Portuguese, current) vs allin-sync writes to `commerce.produtos` (different table?); frontend has both `ProductService` (public.products — dead?) and `productsService` (commerce.produtos) |
| **Recommendations** | Consolidate product table access; verify if commerce.produtos exists or is another phantom table |

### system.feature_flags

| Field | Value |
|-------|-------|
| **Category** | System |
| **Origin** | Migration 025→035 |
| **Dependencies** | None |
| **Consumers** | FeatureFlagService (frontend) |
| **Criticity** | Low |
| **Status** | ✅ Active |
| **Problems** | Frontend queries `is_global` column but schema doesn't include it in spec |
| **Recommendations** | Verify column exists in actual DDL |

---

## 6. BUSINESS ENGINES

### 6.1 MLM Engine

**Purpose**: Process MLM orders, manage distributor lifecycle, coordinate commissions and points generation.

**Inputs**:
- `processar_pedido_mlm(pedido_id UUID)` — main entry point (062)
- Triggered by `UPDATE commerce.pedidos SET pagamento_confirmado = true` (065)
- `processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)` (063)
- `processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)` (064)

**Processing Steps**:
1. Identifies plan type: Afiliado, Avanco, or Excelencia
2. Identifies sponsor via priority: distribuidor_indicador_id > metadata->>patrocinador_comprador
3. Creates/updates distributor record
4. Generates commissions, bonuses, and points
5. Marks order as processed (comissoes_geradas = true)

**Outputs**:
- New/updated `mlm.distribuidores` records
- `mlm.planos_distribuidores` assignments
- `mlm.comissoes` records (direct, sponsor, generation, leadership)
- `mlm.pontos_saldo` + `mlm.pontos_transacoes` records
- `mlm.rede_linear_nos` (linear network)

**Consumers**: All MLM processing, dashboard RPC, wallet RPC

**Evidence**: `supabase/migrations/062-065`

### 6.2 Commission Engine

**Purpose**: Calculate and distribute commissions from product purchases.

**Inputs**:
- `processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)` (064)
- `mlm.bonus_regras` — commission rules config

**Formulas**:
- Direct commission: `ROUND(valor * (porcentagem / 100), 2)`
- Sponsor bonus: same formula, assigned to patrocinador_id
- Generation commissions (up to 3 levels): same formula per level
- Leadership bonus: conditional on `diretos_ativos >= 4` (4-7 = tier 1, 8+ = tier 2)
- Points: `FLOOR(valor / 10)` per R$10 spent (1pt per R$10)

**Outputs**:
- `mlm.comissoes` records with tipo='direto'|'patrocinador'|'geracao'|'lideranca'
- Default rate: 25% direct commission (`src/services/orders/index.ts:8`)

**Consumers**: rpc_commissions_dashboard, rpc_wallet_data, Distributor360

**Evidence**: `supabase/migrations/064_mlm_processar_compra_produto.sql:86-248`

### 6.3 Points Engine

**Purpose**: Manage loyalty/qualification points for distributors.

**Inputs**:
- `processar_compra_produto` (product purchase — pontos_produto)
- `processar_compra_plano` (plan purchase — pontos_ativacao)
- `mlm.pontos_saldo` — current points balance
- `mlm.pontos_transacoes` — transaction history

**Formulas**:
- Product points: `FLOOR(valor / 10)` (1 point per R$10) — `064:83`
- Activation points: Afiliado=0, Avanco=100, Excelencia=500 — `063:29-35`
- Network points distribution (5 levels, 50% decay): `FLOOR(pontos_upline * 0.5)` — `064:315`
- Points types in SQL: `'ativacao'`, `'qualificacao'`, `'rede'` — `064:209,234,282,343`
- Points types in frontend: `'ganho'`, `'uso'`, `'bonus'`, `'estorno'`, `'vencimento'`, `'transferencia'` — `src/services/points/index.ts:30`

**Conflict C-1**: Points transaction types naming mismatch (HIGH severity). SQL uses `'ativacao'`, `'qualificacao'`, `'rede'`. Frontend TypeScript defines `'ganho' | 'uso' | 'bonus' | 'estorno' | 'vencimento' | 'transferencia'`. These are completely different sets.

**Outputs**: Updated `mlm.pontos_saldo`, new `mlm.pontos_transacoes` records

**Consumers**: PointsService (frontend), rpc_wallet_data (074), Distributor360

### 6.4 Wallet Engine

**Purpose**: Manage distributor financial wallets (saldo, bloqueado).

**Inputs**:
- Commissions credited to `mlm.carteiras.saldo`
- `mlm.carteiras.bloqueado` for frozen amounts
- `finance.solicitacoes_saque` for withdrawals

**Formulas**:
- Available balance (SQL): `saldo - bloqueado` — `074:47`, `078_finance_office_rpc.sql:36`, `079:36`
- Available balance (frontend): `saldoDisponivel`, `GREATEST(0, saldo - withdrawals)` — `073:181`
- **Conflict C-2**: Available balance formula mismatch (HIGH). SQL in 074/078 uses `saldo - bloqueado`. Dashboard RPC (073) uses `saldo - total_sacado` (withdrawals, not bloqueado). These are DIFFERENT formulas producing different results.

**Conflicting Wallet Systems**:
- `mlm.carteiras` — EXISTS, used by all RPCs and production code
- `finance.wallets` — PLANNED but NEVER CREATED, has RLS policies in migration 081
- Both serve the same purpose; `finance.wallets` was likely intended to replace `mlm.carteiras` but was never implemented

**Consumers**: rpc_wallet_data (074), rpc_office_finance (078/079), rpc_dashboard (073), Distributor360Service, hooks (useWalletActions, useCreateWalletTransaction, etc.)

### 6.5 Sync Engine

**Purpose**: Synchronize data between AllIn legacy ERP and the new platform.

**Inputs**:
- AllIn API endpoints (distribuidores, clientes, produtos, pedidos, estoque, rede)
- POST request with optional `{ entities: string[] }` body

**Processing**:
1. Authenticate with AllIn API (client_credentials OAuth)
2. Paginate through each endpoint (100 items per page)
3. Map AllIn fields to database columns
4. Upsert into target tables
5. Write sync logs to public.sync_log

**Outputs**:
- `mlm.distribuidores` — upserted via `allin_id` conflict
- `crm.customers` — upserted via `allin_id` conflict
- `commerce.produtos` — upserted via `allin_id` (table may be `commerce.products` instead)
- `commerce.pedidos` — upserted via `allin_id`
- `commerce.pedidos_itens` — upserted via `allin_id`
- `commerce.produto_estoque` — upserted (may be phantom table)
- `mlm.network_node` — upserted via `person_id` (may be phantom table)

**Problems**:
- Writes to `commerce.produtos` but DB has `commerce.products` (table name mismatch)
- Writes to `commerce.pedidos_itens` but DB has `commerce.items_pedido` (table name mismatch)
- Writes to `mlm.network_node` but DB has `mlm.rede_linear_nos` (table name mismatch)
- Stub frontend (`src/services/allin-sync/index.ts`) returns empty results — no integration
- Uses `allin_synced_at` but column doesn't exist in target tables

**Evidence**: `supabase/functions/allin-sync/index.ts:150-572`

---

## 7. PROJECTIONS / READ MODELS

### 7.1 RPC Functions (ViewModels)

The system has 0 database views (verified by QA — initial claim of 30 was false). Instead, all aggregated data comes from 10 RPC functions:

| RPC | Schema | Returns | Purpose | Created |
|-----|--------|---------|---------|---------|
| `rpc_dashboard(p_distribuidor_id TEXT)` | mlm | JSONB | Distributor dashboard: stats, sales, bonus, timeline, goals, AI insights | 073 |
| `rpc_wallet_data(p_customer_id TEXT)` | mlm | JSONB | Wallet: balance, recent/bonus/points transactions | 074 |
| `rpc_network_tree(p_distribuidor_id TEXT, p_max_levels INT)` | mlm | SETOF rows | Network tree (downline) as flat rows | 075→084 (replaced) |
| `rpc_commissions_dashboard(p_limit INT)` | mlm | JSONB | Admin commissions dashboard: rows, plans, customers | 078 |
| `rpc_office_finance(p_user_id TEXT)` | finance | JSONB | Office finance: wallet + withdrawals | 078→079 (overwritten) |
| `rpc_get_network_analytics(p_root_id UUID)` | mlm | (network analytics) | Network analytics | 075 |
| `rpc_get_downline_summary(p_root_id UUID, p_depth INT)` | mlm | (downline summary) | Downline summary | 075 |
| `rpc_get_network_search(p_root_id UUID, p_search TEXT)` | mlm | (network search) | Network search | 075 |
| `rpc_get_network_node_detail(p_node_id UUID)` | mlm | (node detail) | Network node detail | 075 |
| `mlm.rpc_plans_with_rules` | mlm | (plans) | Plans with commission rules | 077 |

### 7.2 Client-Side Aggregations

The following services perform client-side aggregation (bypassing RPCs):

| Service | Source Tables | Aggregation |
|---------|--------------|-------------|
| `Distributor360Service.computeMetrics` | commerce.pedidos | Total spent, LTV, ticket_medio, order count, last order |
| `Customer360Service.fetchComputedMetrics` | commerce.pedidos | Same as above, client-side |
| `PointsService.getPointsSummary` | mlm.pontos_transacoes | Total gain/use/bonus/refund |
| `AnalyticsService.fetchAuditLogs` | system.audit_logs (queries `audit_log`) | Audit trail |
| `CheckoutRules.calculateCartCommission` | mlm.planos (via resolvePlanConfig) | Cart commission calculation |
| `OrderService.transformCommissionRows` | (any) | Transforms payment rows to commission format |

---

## 8. CONSUMERS

### Per-Table Consumer Mapping

| Table | Frontend Services | Frontend Hooks | RPCs/Backend | Pages/Modules |
|-------|-----------------|----------------|-------------|---------------|
| identity.users | CopilotService | — | assign-role EF, set-user-claims EF | AuthProvider |
| identity.roles | — | usePermissions | — | RouteGuard |
| identity.user_roles | — | useAuth, useSession, usePermissions | RoleResolver | RouteGuard, auth context |
| crm.customers | CustomerService, Distributor360Service, Customer360Service, OrderService | useCustomers, useCustomerListInfinite, useCustomer360New, useDistributor360 | allin-sync, rpc_dashboard, rpc_network_tree, rpc_commissions_dashboard | Customers module, CRM360 |
| crm.customer_documents | CustomerDocumentsService | — | — | CRM360 |
| mlm.distribuidores | Distributor360Service, NetworkService, MlmEngineService | useDistributorQuery, useDistributorProfileQuery, useNetwork | allin-sync, rpc_dashboard, rpc_wallet_data, rpc_network_tree, rpc_commissions_dashboard, rpc_office_finance | MLM modules, Distributor360 |
| mlm.planos | PlanService (WRONG TABLE), MlmEngineService | useUpgradeSuggestions | rpc_commissions_dashboard | MLM modules |
| mlm.planos_distribuidores | PlanService (WRONG TABLE) | — | 064 | MLM modules |
| mlm.comissoes | MlmEngineService | useCommissions | rpc_commissions_dashboard, rpc_wallet_data, rpc_dashboard | Commissions dashboard |
| mlm.bonus_regras | — | — | 064 (commission calc) | — |
| mlm.carteiras | MlmEngineService.wallet | useWalletActions, useCreateWalletTransaction, useUpdateWalletBalance | rpc_wallet_data, rpc_office_finance, rpc_dashboard | Wallet module |
| mlm.pontos_saldo | PointsService, MlmEngineService.points | usePoints, useCreatePointsWallet | rpc_wallet_data | Wallet/Points module |
| mlm.pontos_transacoes | PointsService | usePoints | rpc_wallet_data | Wallet/Points module |
| mlm.rede_binaria | — | — | — | (legacy, replaced by rede_linear_nos) |
| mlm.rede_linear_nos | NetworkService (WRONG TABLE), Distributor360Service | useNetwork | 063, 064, 075, 084 | Network tree |
| mlm.bonus_historico | Distributor360Service | — | rpc_wallet_data | Distributor360 |
| mlm.historico_pedido | — | — | — | (archive/history) |
| commerce.pedidos | OrderService, Distributor360Service, Customer360Service | useOrders, useOrderList, useOrderListInfinite | rpc_dashboard (WRONG TABLE), 062-064 | Orders module |
| commerce.items_pedido | Customer360Service | — | — | Orders module |
| commerce.products | productsService, ProductService (legacy) | useProducts, useProductDetail, useProductsQuery | allin-sync | Products module |
| commerce.cupons | CheckoutRules | — | — | Checkout |
| commerce.pagamentos | PaymentService | usePayments, usePaymentHistoryFilters | rpc_dashboard (WRONG TABLE) | Payments module |
| finance.solicitacoes_saque | WithdrawalService | useWithdrawals | rpc_office_finance, rpc_dashboard | Finance module |
| finance.wallet_transactions | Customer360Service | — | — | (dead — FK fails) |
| logistics.* | — | — | — | (not integrated yet) |
| location.* | Customer360Service (city resolution) | — | — | CRM |
| system.audit_logs | AnalyticsService | useAuditLogs | — | Audit module |
| system.feature_flags | FeatureFlagService | — | — | Admin |
| industrial.* | industrialService | — | — | Industrial module |
| public.sync_log | allinSyncFacade | useAllinSync | allin-sync EF | Admin sync |
| public.copilot_* | CopilotService | useCopilot | chat-completion EF, generate-embedding EF | Copilot module |

---

## 9. BUSINESS RULES

### 9.1 Eligibility Rules (5 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-E1 | Plan purchase creates a new distributor if buyer is not one | `063:66-121` | CRITICAL |
| R-E2 | Activation points: Afiliado=0, Avanco=100, Excelencia=500 | `063:29-35` | HIGH |
| R-E3 | Qualification levels based on accumulated points: Bronze(<1000)→Prata(<2000)→Ouro(<5000)→Platina(<10000)→Diamante(>=10000) | `064:373-383` (commented out — disabled because qualificacoes table doesn't support distribuidor_id) | MEDIUM |
| R-E4 | Auto-upgrade to next plan tier based on current plan (Afiliado→Avanco→Excelencia) | `073:166-178` | MEDIUM |
| R-E5 | Leadership bonus triggers at 4+ active directs (4-7 = tier 1, 8+ = tier 2) | `064:201-246` | HIGH |

### 9.2 Commission Rules (7 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-C1 | Direct commission: percentage-based on order value, read from bonus_regras | `064:88-108` | CRITICAL |
| R-C2 | Sponsor bonus: same formula, credited to patrocinador_id | `064:113-135` | CRITICAL |
| R-C3 | Generation commission: up to 3 levels deep (only for Avanco/Excelencia) | `064:140-183` | CRITICAL |
| R-C4 | Commission rounding: ROUND(valor * (porcentagem / 100), 2) | `064:96-103` | HIGH |
| R-C5 | Commission status lifecycle: 'pendente' → (processado) → 'pago' | `064:101` | HIGH |
| R-C6 | Cycle processing: commissions are created with 'pendente' status, processed per cycle | `078_mlm_commissions_rpc.sql:18` (references cycles) | MEDIUM |
| R-C7 | Default commission rate: 25% direct commission (hardcoded fallback) | `src/services/orders/index.ts:8` | MEDIUM |

### 9.3 Points Rules (6 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-P1 | 1 point per R$10 spent on products | `064:83` | HIGH |
| R-P2 | 50% decay per level in network points distribution (up to 5 levels) | `064:315` | HIGH |
| R-P3 | Maximum 5 levels for network points distribution | `064:305` | HIGH |
| R-P4 | Points transaction types (SQL): 'ativacao', 'qualificacao', 'rede' | `064:209,234,282,343` | HIGH |
| R-P5 | Points expiration: not implemented (columns `data_validade_inicio`, `data_validade_fim` exist in frontend types but not in DB) | `src/services/points/index.ts:41-42` | LOW |
| R-P6 | No minimum withdrawal for points (no points withdrawal/redemption implemented) | — | MEDIUM |

### 9.4 Wallet Rules (5 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-W1 | Available balance (SQL): saldo - bloqueado | `074:47`, `078:36`, `079:36` | CRITICAL |
| R-W2 | Available balance (Dashboard RPC): saldo - total_sacado (withdrawals) | `073:181` | HIGH |
| R-W3 | Withdrawal deducts from wallet balance | `mlm.solicitacoes_saque` → manual | HIGH |
| R-W4 | Auto-creation: wallet created on distributor creation | (no explicit trigger found) | MEDIUM |
| R-W5 | Two conflicting wallet systems: mlm.carteiras (real) vs finance.wallets (planned, never created) | Schema §10 | HIGH |

### 9.5 Order Rules (8 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-O1 | MLM processing triggers on payment confirmation (pagamento_confirmado = true) | `062:27-29` | CRITICAL |
| R-O2 | Pre-conditions: pedido exists, pagamento_confirmado=true, comissoes_geradas=false | `062:21-36` | CRITICAL |
| R-O3 | Order classification: 'Plano'/'plano' in tipo_nome → plan, otherwise product | `062:42` | HIGH |
| R-O4 | Zero-value orders are skipped (no commissions generated) | `064:24-27` | HIGH |
| R-O5 | Payment status mock: `processando` for first 2, `pago` for rest | `src/services/orders/index.ts:116-117` | LOW |
| R-O6 | Coupon discount: ALLIN10 = 10% discount | `src/services/orders/index.ts:23` | MEDIUM |
| R-O7 | Checkout required fields: distributor_comprador_id etc. | (frontend form validation) | MEDIUM |
| R-O8 | Active order filter: only non-canceled, non-deleted orders used for metrics | `src/services/distributor360/index.ts:345` | MEDIUM |

### 9.6 Network Rules (7 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-N1 | Binary tree: left/right sides via perna_esquerda_id/perna_direita_id | `084:96-109` | HIGH |
| R-N2 | Sponsor resolution priority: distribuidor_indicador_id > metadata->>patrocinador_comprador | `063:52-63` | CRITICAL |
| R-N3 | Upline traversal: maximum 10 (but only 3 used in actual generation commissions) | `064:149` (WHILE geracao_atual < 3) | HIGH |
| R-N4 | Downline query: maximum 3 levels deep (default in rpc_network_tree) | `084:4-5` (p_max_levels INT DEFAULT 3) | HIGH |
| R-N5 | Linha calculation (084): 0=root, 1=left (perna_esquerda_id), 2=right (perna_direita_id) | `084:96-109` | HIGH |
| R-N6 | Multi-key resolution for rpc_network_tree: UUID → usuario → allin_id → id_comprador | `084:30-55` | HIGH |
| R-N7 | Network returns flat SETOF rows (084) NOT hierarchical JSON (075) | `084:8-22` | MEDIUM |

### 9.7 Sync Rules (4 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-S1 | allin-sync is a stub on frontend (returns empty array) | `src/services/allin-sync/index.ts:23-25` | HIGH |
| R-S2 | allin_id used as bridge identifier (legacy AllIn compatibility) | All sync functions | HIGH |
| R-S3 | Bonus historic lookup key: `distribuidor_id = allinId || distribuidorId` | `src/services/distributor360/index.ts:186` | MEDIUM |
| R-S4 | allin_synced_at timestamp written but column may not exist in target tables | `allin-sync/index.ts:192,231` | MEDIUM |

### 9.8 Validation Rules (6 rules)

| # | Rule | Evidence | Severity |
|---|------|----------|----------|
| R-V1 | Email normalization: trunc to 20 chars | `allin-sync/index.ts:106` | LOW |
| R-V2 | Phone validation: 10-13 digits (loose) | (implied) | LOW |
| R-V3 | Name minimum: 3 characters | (implied) | LOW |
| R-V4 | UUID regex validation via isUuid() | `src/services/distributor360/index.ts:24` | MEDIUM |
| R-V5 | Zod schema validation for checkout | (checkout module) | MEDIUM |
| R-V6 | City ID resolution (numeric → name lookup via location.cidades) | `src/services/customer360/index.ts:393-409` | LOW |

### 9.9 Constants (11 groups, 30+ hardcoded values)

| # | Constant | Value | Location |
|---|----------|-------|----------|
| K-1 | ALLIN_API_BASE_URL | `https://allinbrasil.com.br/api` | `allin-sync/index.ts:5` |
| K-2 | ALLIN_CLIENT_ID | `ALLINCRMW_8ebae0074` | `allin-sync/index.ts:6` |
| K-3 | Default commission rate | 0.25 (25%) | `src/services/orders/index.ts:8` |
| K-4 | Default points per unit | 20 | `src/services/orders/index.ts:19` |
| K-5 | Coupon ALLIN10 discount | 10% | `src/services/orders/index.ts:23` |
| K-6 | Activation points | Afiliado=0, Avanco=100, Excelencia=500 | `063:29-35` |
| K-7 | Generation commission depth | 3 (geracao_atual < 3) | `064:149` |
| K-8 | Points distribution depth | 5 levels | `064:305` |
| K-9 | Points decay rate | 50% per level | `064:315` |
| K-10 | Points per R$ | 1pt per R$10 | `064:83` |
| K-11 | Pagination limit | 100 items per page | `allin-sync/index.ts:93` |

(Continued in part 3...)

## 10. FORMULAS

### 10.1 Commission Calculation
```
valor_comissao = ROUND(valor_total_pedido * (regra.porcentagem / 100), 2)

Where:
  regra: mlm.bonus_regras record with tipo='direto'|'patrocinador'|'geracao'|'lideranca'
  porcentagem: percentage from bonus_regras.configuracoes
  All decimals rounded to 2 places
```
**Source**: supabase/migrations/064_mlm_processar_compra_produto.sql:96-103

### 10.2 Points Calculation
```
puntos_produto = FLOOR(valor_total_pedido / 10)    -- 1pt per R$10

puntos_ativacao:
  Afiliado   = 0
  Avanco     = 100
  Excelencia = 500

Network points (50% decay per level, max 5 levels):
  level_1 = FLOOR(puntos_produto * 0.5)
  level_2 = FLOOR(level_1 * 0.5)
  level_3 = FLOOR(level_2 * 0.5)
  level_4 = FLOOR(level_3 * 0.5)
  level_5 = FLOOR(level_4 * 0.5)
```
**Source**: 064:83, 064:315

### 10.3 Wallet Balance
```
-- SQL version (074, 078, 079):
available_balance = saldo - bloqueado

-- Dashboard RPC version (073):
available_balance = GREATEST(0, saldo - total_sacado)

-- Frontend PointsService formula:
saldo_disponivel = saldo_atual - saldo_bloqueado
```
**Source**: 074:47, 073:181, 078:36, 079:36, src/services/points/index.ts:19-20

### 10.4 Qualification Scoring (Commented Out)
```
IF pontos_totais >= 10000 THEN 'Diamante'
ELSIF pontos_totais >= 5000 THEN 'Platina'
ELSIF pontos_totais >= 2000 THEN 'Ouro'
ELSIF pontos_totais >= 1000 THEN 'Prata'
ELSE 'Bronze'
```
**Source**: 064:373-383 (commented out - qualificacoes table doesnt support distribuidor_id)

### 10.5 Dashboard Aggregation Formulas
```
saldoDisponivel    = GREATEST(0, wallet_saldo - total_withdrawn)
comissaoAcumulada  = SUM(comissoes.valor_comissao) WHERE status = 'pago'
totalVendido       = SUM(orders.valor_total) in current month
pedidosMes         = COUNT(orders) in current month
redeTotal          = COUNT(customers) WHERE patrocinador = current
ticketMedio        = AVG(orders.valor_total)
conversaoLoja      = ROUND((pedidosMes / redeTotal) * 100)
progresso          = CASE plan WHEN 'Afiliado' THEN 33 WHEN 'Avanco' THEN 66 ELSE 100
```
**Source**: supabase/migrations/073_mlm_engine_dashboard_rpc.sql:60-178

### 10.6 LTV / Customer Metrics (frontend)
```
total_gasto  = SUM(valor_total) WHERE NOT cancelado AND NOT deleted_at
ltv          = total_gasto
ticket_medio = total_gasto / COUNT(active_orders)
```
**Source**: src/services/distributor360/index.ts:345-358

---

## 11. INCONSISTENCIES AND CONFLICTS

### 11.1 C-1: Points Transaction Types Naming Mismatch (HIGH)

| Source | Types |
|--------|-------|
| SQL (064) | 'ativacao', 'qualificacao', 'rede' |
| Frontend TS (src/services/points/index.ts:30) | 'ganho', 'uso', 'bonus', 'estorno', 'vencimento', 'transferencia' |

**Impact**: frontend filtering by type will never match SQL records. All points display will show no filtering.

### 11.2 C-2: Available Balance Formula Mismatch (HIGH)

| Source | Formula |
|--------|---------|
| Wallet RPC 074, Office RPC 078/079 | saldo - bloqueado |
| Dashboard RPC 073 | saldo - total_sacado (withdrawals) |
| Frontend PointsService | saldo_atual - saldo_bloqueado |

**Impact**: Dashboard shows different available balance than wallet page for same user.

### 11.3 C-3: Network Node Linha Calculation Mismatch (MEDIUM)

| Source | Line Calculation |
|--------|-----------------|
| SQL 084 (new) | 0=root, 1=left (perna_esquerda_id), 2=right (perna_direita_id) |
| Frontend NetworkService (legacy) | Calculates from network_node table columns |

**Impact**: Different line numbers in network tree display.

### 11.4 C-4: Points Lookup Key Mismatch (HIGH)

| Source | Key |
|--------|-----|
| SQL rpc_wallet_data (074:42) | `distribuidor_id` (UUID from mlm.distribuidores) |
| Frontend Distributor360Service.fetchPoints (distributor360/index.ts:218) | `distribuidor_id = allinId` (integer) |

**Impact**: Points lookup fails on frontend because integer allinId doesnt match UUID-based distribuidor_id.

### 11.5 C-5: Bonus Lookup Key Mismatch (MEDIUM)

| Source | Key |
|--------|-----|
| SQL rpc_wallet_data (074:84) | `distribuidor_id` (UUID) |
| Frontend Distributor360Service.fetchBonus (distributor360/index.ts:186) | `distribuidor_id = allinId || distribuidorId` |

**Impact**: Bonus lookup uses wrong key depending on available data.

### 11.6 C-6: Plan Table Naming Mismatch (HIGH)

| Source | Table Name |
|--------|-----------|
| DB | `mlm.planos` |
| Frontend PlanService | `mlm.plan` (wrong - will 404/error) |
| allin-sync | Writes to `commerce.produtos` (different table entirely) |

**Impact**: PlanService from frontend cannot load plans. PlanService has 0 imports (dead code?).

### 11.7 C-7: Bonus Rule Table Naming Mismatch (HIGH)

| Source | Table Name |
|--------|-----------|
| DB | `mlm.bonus_regras` |
| Frontend PlanService | `mlm.plan_bonus_rule` (wrong) |

**Impact**: PlanService.getPlanBonuses() cannot load bonus rules.

### 11.8 C-8: Commission Table Naming Mismatch (HIGH)

| Source | Table Name |
|--------|-----------|
| DB | `mlm.comissoes` |
| Frontend types | `Commission`, `CommissionsRow` (English names) |

**Impact**: Type mapping mismatch between DB columns (Portuguese) and TypeScript interfaces (English).

### 11.9 C-9: Qualification Update Gap (MEDIUM)

| Source | Behavior |
|--------|----------|
| SQL 064 | Qualification update is **commented out** (line 222-236: "tabela qualificacoes no tem coluna distribuidor_id") |
| Frontend | Expects qualification to be auto-updated on purchase |

**Impact**: Qualification never updated on database side after purchases.

### 11.10 C-10: Network Tree Return Format (LOW)

| Source | Return Format |
|--------|---------------|
| SQL 075 (original, broken) | JSONB (nested) |
| SQL 084 (replacement) | SETOF rows (flat) |
| Frontend | Expects flat array |

**Impact**: Already fixed by migration 084.

### 11.11 P0 Runtime Crashes (8 found by QA)

| # | Location | Problem | Evidence |
|---|----------|---------|----------|
| P0-1 | `rpc_dashboard` 073:197 | `window.location.origin` in PL/pgSQL (JavaScript in SQL) | 073:197 |
| P0-2 | `rpc_dashboard` 073:67 | `FROM commerce.orders` -- table is `commerce.pedidos` | 073:67 |
| P0-3 | `rpc_dashboard` 073:74 | `FROM finance.pagamentos` -- table doesnt exist | 073:74 |
| P0-4 | `rpc_dashboard` 073:65,113,116,136 | Phantom columns: `valor_total_pedido`, `patrocinador_comprador`, `product_name`, `estado` | 073:65,113,116,136 |
| P0-5 | `rpc_commissions_dashboard` 078:28 | `c.deleted_at IS NULL` -- column doesnt exist | 078_mlm_commissions_rpc.sql:28 |
| P0-6 | `rpc_commissions_dashboard` 078:45 | `c.patrocinador_comprador` -- column doesnt exist | 078_mlm_commissions_rpc.sql:45 |
| P0-7 | `finance.wallet_transactions` FK | FK to `finance.wallets` -- table never created | 20260718194804 |
| P0-8 | All RPCs 062-064 | Tables referenced without schema prefix after migration 038 | 062:18, 064:19 |

### 11.12 P1 Silent Failures (15+ found)

- `PlanService` queries `mlm.plan` (should be `mlm.planos`) -- returns no data
- `PlanService` queries `mlm.plan_bonus_rule` (should be `mlm.bonus_regras`)
- `NetworkService` queries `mlm.network_node` (table may be `mlm.rede_linear_nos`)
- `AnalyticsService` queries `system.audit_log` (should be `system.audit_logs`)
- `MarketingService` queries `marketing.campaigns` (schema `marketing` may not exist)
- `MarketingService` queries `mlm.upgrade_suggestions` (phantom table)
- `Customer360Service` queries `finance.wallets` (table never created)
- `Customer360Service` queries `crm.customer_metrics` (phantom table)
- `Customer360Service` queries `crm.customer_scores` (phantom table)
- `Customer360Service` queries `crm.customer_product_affinities` (phantom table)
- `Customer360Service` queries `crm.v_customer_canonical` (phantom view)
- `LeadService` queries `crm.leads` (phantom table)
- `CustomerService.fetchDownlines` queries `patrocinador_comprador` (phantom column)
- `industrialService` queries English-named tables: `locations`, `machines`, `materials`, etc. (DB has Portuguese names)
- `allin-sync` writes to `commerce.produtos`, `commerce.pedidos_itens`, `mlm.network_node`, `commerce.produto_estoque` (may all be phantom tables)

### 11.13 P2 Data Integrity Issues (3 found)

| # | Issue | Details |
|---|-------|---------|
| P2-1 | Wallet race condition | RPCs use read-modify-write without row-level locking or atomic UPDATE |
| P2-2 | `comissoes.deleted_at` missing | Filtered in rpc_commissions_dashboard but column doesnt exist |
| P2-3 | `is_active` typed number vs boolean | Frontend queries `1` (number) on BOOLEAN column in multiple places |

### 11.14 P3 Dead Code (10+ found)

| # | Dead Code | Details |
|---|-----------|---------|
| P3-1 | `078_finance_office_rpc.sql` | Immediately overwritten by `079_finance_office_rpc.sql` |
| P3-2 | `075_mlm_engine_network_rpc.sql` | Superseded by `084_fix_rpc_network_tree.sql` |
| P3-3 | `PlanService` (src/services/plans/index.ts) | 0 imports -- entirely unused |
| P3-4 | `ProductService` (src/services/products/index.ts) | Uses `public.products` which is legacy |
| P3-5 | `allinSyncFacade` (src/services/allin-sync/index.ts) | Returns empty arrays -- no real integration |
| P3-6 | Duplicate `tipos_campo_pedido` migration | Created in `20260718194801` after already existing in `033` |
| P3-7 | Legacy `public.*` tables | 28+ tables with data migrated to domain schemas |
| P3-8 | `CartService.cart_items` table | Created in `066_create_cart_items.sql` but never referenced again |
| P3-9 | Migration 056_disable_rls_for_migration | One-time fix that should have been removed |

### 11.15 P4 Schema Drift (20+ found)

All TypeScript interfaces in frontend services use English names while database uses Portuguese. Every frontend service that queries actual tables with wrong names falls into this category. Key ones:
- `plan` vs `planos`
- `bonus_historico` (exists) vs `bonus`/`bonuses` (queried)
- `wallet_transactions` vs `carteiras_transacoes`
- `rede_linear_nos` vs `network_node`
- `items_pedido` vs `order_items`

---

## 12. DERIVED vs PRIMARY DATA

| Table | Type | Source | Description |
|-------|------|--------|-------------|
| identity.users | Primary | -- | Auth user registry |
| identity.roles | Primary | -- | RBAC role definitions |
| identity.user_roles | Primary | identity.users + identity.roles | User-role assignments |
| identity.permissions | Primary | -- | Permission definitions |
| identity.role_permissions | Primary | identity.roles + identity.permissions | Role-permission mappings |
| crm.customers | Primary | allin-sync, manual creation | Core customer data |
| crm.customer_profiles | Derived | crm.customers + identity.users | Dual-key mapping |
| crm.distributor_profiles | Derived | crm.customers + identity.users + mlm.distribuidores | Dual-key mapping |
| crm.customer_distributor | Primary | -- | Relationship junction |
| crm.customer_documents | Primary | File uploads | Document storage |
| mlm.distribuidores | Primary | allin-sync, processar_compra_plano | Distributor records |
| mlm.planos | Primary | Admin crud | Plan definitions |
| mlm.planos_distribuidores | Primary | processar_compra_plano | Plan assignments |
| mlm.comissoes | Derived | processar_compra_produto | Computed from orders + rules |
| mlm.bonificacoes | Derived | MLM engine | Bonus records |
| mlm.carteiras | Primary | Auto-created on distributor creation | Wallet accounts |
| mlm.pontos_saldo | Derived | processar_compra_plano, processar_compra_produto | Points balance |
| mlm.pontos_transacoes | Derived | processar_* functions | Points tx history |
| mlm.rede_linear_nos | Primary | processar_compra_plano | Linear network tree |
| mlm.rede_binaria | Legacy | -- | Binary tree (unused?) |
| mlm.qualificacoes | Primary | Admin definition | Qualification levels |
| mlm.qualificacoes_requisitos | Primary | Admin definition | Qualification requirements |
| mlm.bonus_regras | Primary | Admin configuration | Commission rule definitions |
| commerce.pedidos | Primary | allin-sync, order creation | Orders |
| commerce.items_pedido | Derived | From order submission | Order line items |
| commerce.products | Primary | Admin, allin-sync | Product catalog |
| commerce.pagamentos | Primary | allin-sync, payment gateway | Payment records |
| finance.solicitacoes_saque | Primary | Withdrawal requests | Withdrawal records |
| finance.wallet_transactions | Orphan | -- | FK to non-existent table |
| logistics.* | Primary | Manual/logistics ops | Inventory, shipments |
| location.* | Primary | Seed data | Cities, states |
| system.audit_logs | Derived | Triggers from domain tables | Audit trail |
| system.feature_flags | Primary | Admin configuration | Feature toggles |
| industrial.* | Primary | Manual entry | Industrial operations |
| public.sync_log | Derived | allin-sync function | Sync audit |

---

## 13. RECOMMENDATIONS

### Urgent (fix immediately)

| # | Recommendation | Severity | Effort |
|---|---------------|----------|--------|
| 1 | Remove `window.location.origin` from rpc_dashboard (073:197) | P0 | Minutes |
| 2 | Fix rpc_dashboard table refs: commerce.orders -> commerce.pedidos, finance.pagamentos -> commerce.pagamentos | P0 | Hours |
| 3 | Add phantom columns to tables or fix SQL: `valor_total_pedido`, `patrocinador_comprador`, `product_name` in 073 | P0 | Hours |
| 4 | Add `deleted_at` column to mlm.comissoes or remove filter in rpc_commissions_dashboard | P0 | Minutes |
| 5 | Fix rpc_commissions_dashboard: remove `c.patrocinador_comprador` reference | P0 | Minutes |
| 6 | Fix FK on finance.wallet_transactions or create finance.wallets | P0 | Hours |
| 7 | All RPCs: add schema prefix to table references (select from `mlm.distribuidores` not `distribuidores`) | P0 | Hours |

### High Priority

| # | Recommendation | Severity | Effort |
|---|---------------|----------|--------|
| 8 | Fix PlanService to use `mlm.planos` and boolean comparison not `= 1` | P1/HIGH | Minutes |
| 9 | Fix all frontend services with wrong table names (plan_bonus_rule, network_node, audit_log, etc.) | P1 | Days |
| 10 | Fix allin-sync to write to correct table names (commerce.products, commerce.items_pedido, etc.) | P1 | Hours |
| 11 | Add `comissoes.deleted_at` column or remove from queries | P2 | Minutes |
| 12 | Add row-level locking to wallet updates (SELECT ... FOR UPDATE) | P2 | Hours |
| 13 | Fix is_active queries from integer to boolean comparison | P2 | Hours |
| 14 | Fix points lookup key (allinId integer vs UUID) in Distributor360 | P1/HIGH | Hours |
| 15 | Unify available balance formula across all RPCs and frontend | HIGH | Days |
| 16 | Create finance.wallets or remove references (decide which direction) | P0/HIGH | Days |

### Medium Priority

| # | Recommendation | Severity | Effort |
|---|---------------|----------|--------|
| 17 | Implement qualification updates (uncomment+fix the code in 064) | MEDIUM | Hours |
| 18 | Clean up 28+ legacy public.* tables | MEDIUM | Days |
| 19 | Remove overwritten RPCs (078_finance_office_rpc) | LOW | Hours |
| 20 | Remove superseded RPCs (075 network) | LOW | Hours |
| 21 | Unify points transaction types (SQL vs frontend) | MEDIUM | Days |
| 22 | Remove phantom table queries from frontend services | MEDIUM | Days |
| 23 | Fix CopilotService.healthCheck to use actual endpoint | LOW | Hours |
| 24 | Fix allin-sync facade to actually call the Edge Function | MEDIUM | Days |

### Low Priority

| # | Recommendation | Severity | Effort |
|---|---------------|----------|--------|
| 25 | Add TypeScript type alignment (English vs Portuguese column names) | P4 | Weeks |
| 26 | Remove PlanService if confirmed unused (0 imports) | LOW | Hours |
| 27 | Merge conflicting wallet system (mlm.carteiras vs finance.wallets) | P4 | Weeks |
| 28 | Unit/integration test suite for all RPCs | LOW | Weeks |

---

## 14. CORRECTION ROADMAP

### Phase 1: P0 Fixes (1-2 days)

| Step | Action | Owner |
|------|--------|-------|
| 1.1 | Fix rpc_dashboard (073) -- table refs, phantom columns, window.location | Backend |
| 1.2 | Fix rpc_commissions_dashboard (078) -- deleted_at, patrocinador_comprador | Backend |
| 1.3 | Fix finance.wallet_transactions FK or RLS policies on finance.wallets | DBA |
| 1.4 | Add schema prefixes to all RPC references | DBA |
| 1.5 | Deploy fixes as new migration, re-run GRANT EXECUTE | DBA |

### Phase 2: P1 Fixes (1 week)

| Step | Action | Owner |
|------|--------|-------|
| 2.1 | Fix table names in all frontend services | Frontend |
| 2.2 | Fix table names in allin-sync Edge Function | Backend |
| 2.3 | Fix lookup keys in Distributor360 (allinId vs UUID) | Frontend |
| 2.4 | Add missing columns tracked in migration 085 | DBA |
| 2.5 | Fix is_active integer vs boolean across codebase | Frontend |

### Phase 3: P2 Fixes (1 week)

| Step | Action | Owner |
|------|--------|-------|
| 3.1 | Add row-level locking to wallet operations | DBA |
| 3.2 | Add deleted_at to mlm.comissoes or fix queries | DBA |
| 3.3 | Unify available balance formula (saldo - bloqueado everywhere) | All |
| 3.4 | Unify points transaction types between SQL and TS | All |

### Phase 4: P3 Cleanup (1 week)

| Step | Action | Owner |
|------|--------|-------|
| 4.1 | Drop 28+ legacy public.* tables (after confirming no references) | DBA |
| 4.2 | Remove overwritten/superseded RPCs (078_finance, 075_network) | DBA |
| 4.3 | Remove confirmed dead code (PlanService, ProductService, allinSyncFacade) | Frontend |
| 4.4 | Remove duplicate tipocampo_pedido migration | DBA |

### Phase 5: P4 Alignment (2-3 weeks)

| Step | Action | Owner |
|------|--------|-------|
| 5.1 | TypeScript type alignment across all services | Frontend |
| 5.2 | Complete dual-key migration (customer_id canonical) | Both |
| 5.3 | Merge conflicting wallet systems | Arch/DBA |
| 5.4 | Add RPC integration tests | QA |

---

## 15. TRACEABILITY MATRIX

| Rule ID | Evidence | Affected Tables | Affected Services | Severity |
|---------|----------|----------------|-------------------|----------|
| R-E1 | 063:66-121 | mlm.distribuidores, mlm.planos_distribuidores | OrderService, MlmEngine | CRITICAL |
| R-E2 | 063:29-35 | mlm.pontos_saldo, mlm.pontos_transacoes | PointsEngine | HIGH |
| R-E3 | 064:373-383 (commented) | mlm.qualificacoes (no distribuidor_id column) | (disabled) | MEDIUM |
| R-E4 | 073:166-178 | crm.customers.plan_id | rpc_dashboard | MEDIUM |
| R-E5 | 064:201-246 | mlm.comissoes, mlm.bonus_regras | CommissionEngine | HIGH |
| R-C1 | 064:88-108 | mlm.comissoes, mlm.bonus_regras | CommissionEngine | CRITICAL |
| R-C2 | 064:113-135 | mlm.comissoes | CommissionEngine | CRITICAL |
| R-C3 | 064:140-183 | mlm.comissoes, mlm.rede_linear_nos | CommissionEngine | CRITICAL |
| R-C4 | 064:96-103 | mlm.comissoes | CommissionEngine | HIGH |
| R-C5 | 064:101 | mlm.comissoes | CommissionEngine | HIGH |
| R-C6 | 078_mlm_commissions_rpc.sql:18 | mlm.comissoes | rpc_commissions_dashboard | MEDIUM |
| R-C7 | src/services/orders/index.ts:8 | mlm.bonus_regras | CheckoutRules | MEDIUM |
| R-P1 | 064:83 | mlm.pontos_transacoes | PointsEngine | HIGH |
| R-P2 | 064:315 | mlm.pontos_saldo | PointsEngine | HIGH |
| R-P3 | 064:305 | mlm.pontos_saldo | PointsEngine | HIGH |
| R-P4 | 064:209,234,282,343 | mlm.pontos_transacoes | PointsEngine | HIGH |
| R-P5 | src/services/points/index.ts:41-42 | mlm.pontos_transacoes | PointsService | LOW |
| R-P6 | -- | mlm.pontos_saldo | -- | MEDIUM |
| R-W1 | 074:47, 078:36, 079:36 | mlm.carteiras | Wallet RPCs | CRITICAL |
| R-W2 | 073:181 | mlm.carteiras, finance.solicitacoes_saque | rpc_dashboard | HIGH |
| R-W3 | -- | mlm.carteiras, finance.solicitacoes_saque | WithdrawalService | HIGH |
| R-W4 | -- | mlm.carteiras | MlmEngine | MEDIUM |
| R-W5 | 081, 20260718... | mlm.carteiras, finance.wallets (missing) | -- | HIGH |
| R-O1 | 062:27-29 | commerce.pedidos | MLM trigger | CRITICAL |
| R-O2 | 062:21-36 | commerce.pedidos | processar_pedido_mlm | CRITICAL |
| R-O3 | 062:42 | commerce.pedidos | processar_pedido_mlm | HIGH |
| R-O4 | 064:24-27 | mlm.comissoes | processar_compra_produto | HIGH |
| R-O5 | src/services/orders/index.ts:116-117 | -- | OrderService | LOW |
| R-O6 | src/services/orders/index.ts:23 | commerce.cupons | CheckoutRules | MEDIUM |
| R-O7 | -- | -- | Checkout | MEDIUM |
| R-O8 | src/services/distributor360/index.ts:345 | commerce.pedidos | Distributor360 | MEDIUM |
| R-N1 | 084:96-109 | mlm.distribuidores.perna_* | rpc_network_tree | HIGH |
| R-N2 | 063:52-63 | commerce.pedidos, mlm.distribuidores | processar_* | CRITICAL |
| R-N3 | 064:149 | mlm.rede_linear_nos | CommissionEngine | HIGH |
| R-N4 | 084:4-5 | mlm.distribuidores | rpc_network_tree | HIGH |
| R-N5 | 084:96-109 | mlm.distribuidores | rpc_network_tree | HIGH |
| R-N6 | 084:30-55 | mlm.distribuidores, crm.customers | rpc_network_tree | HIGH |
| R-N7 | 084:8-22 | mlm.distribuidores | rpc_network_tree | MEDIUM |
| R-S1 | src/services/allin-sync/index.ts:23-25 | -- | allinSyncFacade | HIGH |
| R-S2 | allin-sync/index.ts:160-192 | crm.customers, mlm.distribuidores | allin-sync EF | HIGH |
| R-S3 | src/services/distributor360/index.ts:186 | mlm.bonus_historico | Distributor360 | MEDIUM |
| R-S4 | allin-sync/index.ts:192,231 | crm.customers, mlm.distribuidores | allin-sync EF | MEDIUM |
| R-V1 | allin-sync/index.ts:106 | crm.customers | allin-sync | LOW |
| R-V4 | src/services/distributor360/index.ts:24 | mlm.distribuidores | Distributor360 | MEDIUM |
| R-V6 | src/services/customer360/index.ts:393-409 | location.cidades | Customer360 | LOW |
| C-1 | 064 vs PointsService | mlm.pontos_transacoes | PointsEngine, PointsService | HIGH |
| C-2 | 074:47 vs 073:181 | mlm.carteiras | Wallet/Dashboard RPCs | HIGH |
| C-3 | 084 vs NetworkService | mlm.distribuidores, mlm.network_node | rpc_network_tree | MEDIUM |
| C-4 | 074:42 vs distributor360:218 | mlm.pontos_saldo | rpc_wallet_data, Distributor360 | HIGH |
| C-5 | 074:84 vs distributor360:186 | mlm.bonus_historico | rpc_wallet_data, Distributor360 | MEDIUM |
| C-6 | DB vs PlanService | mlm.planos | PlanService (0 imports) | HIGH |
| C-7 | DB vs PlanService | mlm.bonus_regras | PlanService | HIGH |
| C-8 | DB vs frontend types | mlm.comissoes | Multiple | HIGH |
| C-9 | 064:222-236 | mlm.qualificacoes | MlmEngine | MEDIUM |
| C-10 | 075 vs 084 | mlm.rede_linear_nos | rpc_network_tree | LOW |
| P0-1 | 073:197 | -- | rpc_dashboard | P0 |
| P0-2 | 073:67 | commerce.pedidos (via wrong name) | rpc_dashboard | P0 |
| P0-3 | 073:74 | (table doesn't exist) | rpc_dashboard | P0 |
| P0-4 | 073:65,113,116,136 | crm.customers (phantom cols) | rpc_dashboard | P0 |
| P0-5 | 078_mlm_commissions_rpc:28 | mlm.comissoes | rpc_commissions_dashboard | P0 |
| P0-6 | 078_mlm_commissions_rpc:45 | crm.customers | rpc_commissions_dashboard | P0 |
| P0-7 | 20260718194804 | finance.wallet_transactions | -- | P0 |
| P2-1 | 074 (no FOR UPDATE) | mlm.carteiras | Wallet RPC | P2 |
| P2-2 | 078 | mlm.comissoes | rpc_commissions | P2 |
| P2-3 | PlanService is_active=1 | mlm.planos | PlanService | P2 |

---

## APPENDIX A: Phantom Tables (referenced but never created)

These 21+ tables are queried by frontend services but do NOT exist in any migration:

| Table | Referenced In 
File | Problem |
|-------|----------|---------|
| `finance.wallets` | C360 service, 081 RLS, FK in wallet_transactions | Major |
| `finance.points_wallets` | 081 RLS | Major |
| `mlm.plan` | PlanService | Major |
| `mlm.plan_bonus_rule` | PlanService | Major |
| `mlm.network_node` | NetworkService, allin-sync | Major |
| `marketing.campaigns` | MarketingService | Major |
| `mlm.upgrade_suggestions` | MarketingService | Major |
| `crm.leads` | LeadService | Major |
| `crm.v_customer_canonical` | Customer360Service | Major |
| `crm.customer_metrics` | Customer360Service | Major |
| `crm.customer_scores` | Customer360Service | Major |
| `crm.customer_product_affinities` | Customer360Service | Major |
| `crm.user_roles_view` | CopilotService | Medium |
| `commerce.produtos` | allin-sync writes to it | Medium |
| `commerce.pedidos_itens` | allin-sync writes to it | Medium |
| `commerce.produto_estoque` | allin-sync writes to it | Medium |
| `finance.solicitacoes_saque_cd` | WithdrawalService | Low |
| `locations` | industrialService | Low |
| `machines` | industrialService | Low |
| `materials` (without schema) | industrialService | Low |
| `suppliers` (without schema) | industrialService | Low |

---

## APPENDIX B: Migration Chronology

| Phase | Migrations | Description |
|-------|-----------|-------------|
| Foundation | 001-031 | Extensions, schemas, tables (public), views, RLS, triggers, indexes |
| Schema Migration | 032-041 | Table migrations: public -> domain schemas |
| ID Type Fixes | 042-044, 057 | TEXT -> UUID -> TEXT reversions; UUID for customers |
| Legacy Cleanup | 045-056 | View recreations, RLS disable, old function cleanup |
| Auth and Claims | 053, 055 | JWT claims, user metadata, profile sync |
| Industrial | 058 | Industrial schema: machines, materials, processes, BOM |
| Copilot | 059 | Copilot chat tables |
| MLM Processing | 062-065 | Order processing functions + trigger |
| Audit and Triggers | 067 | Audit triggers for all domain tables |
| DB Cleanup | 068 | Migration of remaining public tables to domain |
| RPC Functions | 069-079 | Order processing, network tree, finance RPCs |
| RLS Cleanup | 080 | Copilot RLS |
| Finance RLS | 081 | RLS for wallets/wallet_transactions (tables missing) |
| Dual-Key MVP | 082-083 | Key-Resolution Service tables |
| Network Fix | 084 | Replaces broken 075 network RPC |
| Schema Drift Fix | 085 | Adds missing columns, creates crm.customer_documents |
| Performance | 20260718194808 | Indexes for hot paths |
| Latest Additions | 20260718194800-11 | MFA, wallet transactions, deliveries, qual reqs, notifs, api_audit, sync_log |

---

## APPENDIX C: Enums and Custom Types

| Type | Values | Created |
|------|--------|---------|
| `mlm.status_pedido` | pendente, processando, enviado, entregue, cancelado | 032 |
| `mlm.tipo_pedido` | plano, produto, upgrade | 032 |
| `mlm.status_pagamento` | pendente, confirmado, rejeitado, reembolsado | 032 |
| `mlm.tipo_pagamento` | pix, boleto, cartao, transferencia | 032 |
| `mlm.status_envio` | pendente, enviado, entregue, devolvido | 032 |
| `mlm.tipo_notificacao` | sistema, pedido, pagamento, envio, bonus, comissao | 032 |

---

## APPENDIX D: Key File References

| File | Purpose |
|------|---------|
| supabase/migrations/062_mlm_processar_pedido.sql | Main MLM order processor |
| supabase/migrations/063_mlm_processar_compra_plano.sql | Plan purchase processing |
| supabase/migrations/064_mlm_processar_compro_produto.sql | Product purchase + commissions |
| supabase/migrations/073_mlm_engine_dashboard_rpc.sql | Dashboard ViewModel (BROKEN) |
| supabase/migrations/074_mlm_engine_wallet_rpc.sql | Wallet ViewModel |
| supabase/migrations/075_mlm_engine_network_rpc.sql | Network tree (superseded by 084) |
| supabase/migrations/078_mlm_commissions_rpc.sql | Commissions dashboard (BROKEN) |
| supabase/migrations/078-079_finance_office_rpc.sql | Office finance (079 overwrites 078) |
| supabase/migrations/084_fix_rpc_network_tree.sql | Fixed network tree RPC |
| supabase/migrations/085_add_missing_customers_columns.sql | Schema drift fixes |
| supabase/functions/allin-sync/index.ts | AllIn sync Edge Function |
| src/services/plans/index.ts | PlanService (WRONG TABLE NAMES) |
| src/services/network/index.ts | NetworkService (WRONG TABLE NAME) |
| src/services/payments/index.ts | PaymentService (WRONG TABLE NAME) |
| src/services/customers/index.ts | CustomerService (phantom columns) |
| src/services/customer360/index.ts | Customer360Service (phantom tables) |
| src/services/distributor360/index.ts | Distributor360Service |
| src/services/points/index.ts | PointsService |
| src/services/orders/index.ts | OrderService + CheckoutRules |
| src/services/analytics/index.ts | AnalyticsService (wrong table name) |
| src/services/marketing/index.ts | MarketingService (phantom schema) |
| src/services/cart/index.ts | cartService (carts table) |
| src/services/industrial/index.ts | industrialService (English table names) |
| src/services/withdrawals/index.ts | WithdrawalService |
| src/services/copilot/index.ts | CopilotService (phantom view) |
| src/services/allin-sync/index.ts | allinSyncFacade (stub) |
