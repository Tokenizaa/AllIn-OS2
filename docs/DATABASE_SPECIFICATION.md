# AllIn-OS2 Database Specification

**Generated from**: 107 migration files (001–085 + 20260718*)
**Last updated**: 2026-07-21

---

## Table of Contents

1. [Schema Organization](#1-schema-organization)
2. [DDL Per Table](#2-ddl-per-table)
3. [Views](#3-views)
4. [Triggers](#4-triggers)
5. [RLS Policies](#5-rls-policies)
6. [Enums & Custom Types](#6-enums--custom-types)
7. [Functions & Procedures](#7-functions--procedures)
8. [Indexes](#8-indexes)
9. [Dead / Orphan Tables](#9-dead--orphan-tables)
10. [Missing Tables (referenced but never created)](#10-missing-tables-referenced-but-never-created)
11. [Cross-Schema Dependency Graph](#11-cross-schema-dependency-graph)
12. [Dual-Key Refactor Status](#12-dual-key-refactor-status)

---

## 1. Schema Organization

| Schema | Purpose | Created In |
|--------|---------|-----------|
| `public` | Legacy + auth user metadata + copilot tables | Original |
| `identity` | Users, roles, permissions, MFA | 035 |
| `crm` | Customers, distributors profiles, documents | 035 |
| `mlm` | Distributors, plans, bonuses, commissions, binary tree, qualifications, notifications, API audit | 035 |
| `commerce` | Products, orders, order items, payments, coupons, tipo_pedido | 035 |
| `finance` | Withdrawals, wallets, wallet transactions | 035 |
| `logistics` | Warehouses, inventory, shipments, entregas | 035 |
| `location` | States, cities, addresses | 035 |
| `system` | Audit logs, configs, feature flags, integrations, notifications | 035 |
| `industrial` | Machines, materials, processes, BOM, capacity, timing, empresa | 058 |

---

## 2. DDL Per Table

### 2.1 Schema: `identity`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `identity.users` | 001→035 | `auth_user_id TEXT` | Maps to `auth.users.id` |
| `identity.roles` | 001→035 | `id UUID` | RBAC source of truth |
| `identity.user_roles` | 001→035 | `id UUID` | FK→users, FK→roles |
| `identity.permissions` | 001→035 | `id UUID` | Granular permissions |
| `identity.role_permissions` | 001→035 | `role_id UUID, permission_id UUID` | Composite PK |
| `identity.mfa_factors` | 20260718194800 | `id UUID` | FK→users(auth_user_id) |

```sql
CREATE TABLE identity.users (
  auth_user_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE identity.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE identity.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES identity.users(auth_user_id),
  role_id UUID NOT NULL REFERENCES identity.roles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE identity.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module, action, resource)
);

CREATE TABLE identity.role_permissions (
  role_id UUID NOT NULL REFERENCES identity.roles(id),
  permission_id UUID NOT NULL REFERENCES identity.permissions(id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE identity.mfa_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES identity.users(auth_user_id),
  factor_type TEXT NOT NULL,
  secret TEXT NOT NULL,
  friendly_name TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.2 Schema: `crm`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `crm.customers` | 001→035 | `id UUID` | Core customer entity; `customer_id` = canonical |
| `crm.customer_profiles` | 082 | `id UUID` | Dual-key profile, FK→customers(id) |
| `crm.distributor_profiles` | 082 | `id UUID` | Dual-key profile, FK→customers(id) |
| `crm.customer_distributor` | 082 | `customer_id UUID, distributor_id UUID` | Junction table |
| `crm.customer_documents` | 085 | `id UUID` | FK→customers(id) |

```sql
CREATE TABLE crm.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_comprador TEXT UNIQUE,          -- legacy AllIn bridge
  allin_id INTEGER UNIQUE,           -- legacy AllIn bridge
  auth_user_id TEXT UNIQUE,
  nome_completo TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf_cnpj TEXT,
  tipo_cliente TEXT DEFAULT 'customer',
  patrocinador_id UUID,              -- FK→crm.customers(id) (added 042)
  distribuidor_id UUID,              -- FK→crm.customers(id) (added 042)
  plan_id UUID,                      -- added 085
  qualification TEXT,                -- added 085
  usuario TEXT,                      -- added 085
  data_nascimento DATE,
  genero TEXT,
  endereco_completo TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  numero_endereco TEXT,
  complemento_endereco TEXT,
  bairro TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE crm.customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES crm.customers(id),
  auth_user_id TEXT NOT NULL,
  needs_manual_review BOOLEAN DEFAULT FALSE,
  review_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm.distributor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES crm.customers(id),
  auth_user_id TEXT NOT NULL,
  distribuidor_id UUID NOT NULL,  -- FK→mlm.distribuidores
  plan_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm.customer_distributor (
  customer_id UUID NOT NULL REFERENCES crm.customers(id),
  distributor_id UUID NOT NULL REFERENCES crm.customers(id),
  relationship_type TEXT DEFAULT 'patrocinador',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (customer_id, distributor_id)
);

CREATE TABLE crm.customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES crm.customers(id),
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.3 Schema: `mlm`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `mlm.distribuidores` | 002→035 | `id UUID` | **Dual ID**: `allin_id` (integer) + `id` (UUID) |
| `mlm.planos` | 003→035 | `id UUID` | Plan definitions |
| `mlm.planos_distribuidores` | 003→035 | `id UUID` | FK→distribuidores, FK→planos |
| `mlm.bonificacoes` | 004→035 | `id UUID` | Bonus records |
| `mlm.comissoes` | 005→035 | `id UUID` | Commission records |
| `mlm.rede_binaria` | 006→035 | `id UUID` | Binary tree structure |
| `mlm.niveis` | 007→035 | `id UUID` | Level definitions |
| `mlm.regras_comissionamento` | 008→035 | `id UUID` | Commission rules |
| `mlm.qualificacoes` | 009→035 | `id UUID` | Qualification records |
| `mlm.qualificacoes_requisitos` | 20260718194810 | `id UUID` | Qualification requirements |
| `mlm.carteiras` | 010→035 | `id UUID` | Wallets (legacy, **not** `finance.wallets`) |
| `mlm.solicitacoes_saque` | 011→035 | `id UUID` | Legacy withdrawal requests |
| `mlm.notificacoes` | 20260718194810 | `id UUID` | Notifications |
| `mlm.api_audit` | 20260718194810 | `id UUID` | API audit log |
| `mlm.historico_saldo_distribuidor` | 012→035 | `id UUID` | Balance history |
| `mlm.historico_pedido` | 032→035 | `id UUID` | Order history |
| `mlm.historico_status_pedido` | 032→035 | `id UUID` | Order status history |
| `mlm.bonuses_paid` | 075 | `id UUID` | Paid bonuses (network RPC) |
| `mlm.commissions_pending` | 075 | `id UUID` | Pending commissions (network RPC) |
| `mlm.rewards` | 075 | `id UUID` | Rewards (network RPC) |

```sql
-- Key tables (abbreviated - see migrations 002-012, 032, 075 for full DDL)
CREATE TABLE mlm.distribuidores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allin_id INTEGER,                  -- legacy bridge (NOT unique after 057 revert)
  auth_user_id TEXT,
  nome_completo TEXT NOT NULL,
  email TEXT,
  cpf_cnpj TEXT,
  nivel TEXT DEFAULT 'distribuidor',
  status TEXT DEFAULT 'pendente',
  patrocinador_id UUID,              -- FK→distribuidores(id)
  patrocinador_nome TEXT,
  rede_lado TEXT,
  rede_indice INTEGER,
  plano TEXT,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE mlm.planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  max_geracoes INTEGER DEFAULT 5,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mlm.rede_binaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribuidor_id UUID NOT NULL,
  pai_id UUID,
  lado TEXT CHECK (lado IN ('esquerdo', 'direito')),
  nivel INTEGER DEFAULT 0,
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mlm.comissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribuidor_id UUID NOT NULL,
  tipo TEXT NOT NULL,
  valor NUMERIC(10,2),
  geracao INTEGER,
  status TEXT DEFAULT 'pendente',
  data_calculo DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mlm.carteiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribuidor_id UUID NOT NULL,
  saldo NUMERIC(10,2) DEFAULT 0,
  bloqueado NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.4 Schema: `commerce`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `commerce.products` | 013→035 | `id UUID` | Product catalog |
| `commerce.pedidos` | 014→035 | `id UUID` | Orders |
| `commerce.items_pedido` | 015→035 | `id UUID` | Order items |
| `commerce.pagamentos` | 016→035 | `id UUID` | Payments |
| `commerce.cupons` | 017→035 | `id UUID` | Coupons |
| `commerce.tipos_campo_pedido` | 033→035 | `id UUID` | Order field types |
| `commerce.tipos_campo_pedido` | 20260718194801 | `id UUID` | **Duplicate** migration (same table name) |

```sql
CREATE TABLE commerce.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_comprador TEXT,
  allin_id INTEGER,
  distribuidor_comprador_id UUID,
  distribuidor_indicador_id UUID,
  valor_total NUMERIC(10,2),
  pagamento_confirmado BOOLEAN DEFAULT false,
  comissoes_geradas BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pendente',
  tipo_nome TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commerce.items_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES commerce.pedidos(id),
  produto_id UUID REFERENCES commerce.products(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commerce.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  estoque INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.5 Schema: `finance`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `finance.solicitacoes_saque` | 011→035 | `id UUID` | Withdrawal requests |
| `finance.wallets` | **NOT CREATED** | — | RLS applied in 081 but table never defined |
| `finance.points_wallets` | **NOT CREATED** | — | RLS applied in 081 but table never defined |
| `finance.wallet_transactions` | 20260718194804 | `id UUID` | FK→finance.wallets(id) — **orphan** |

```sql
-- finance.wallets is REFERENCED but NEVER CREATED (see §10)
-- finance.points_wallets is REFERENCED but NEVER CREATED (see §10)

CREATE TABLE finance.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES finance.wallets(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL,
  reference_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.6 Schema: `logistics`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `logistics.estoque` | 018→035 | `id UUID` | Inventory |
| `logistics.estoque_itens` | 018→035 | `id UUID` | Inventory items |
| `logistics.envios` | 019→035 | `id UUID` | Shipments |
| `logistics.romaneios` | 020→035 | `id UUID` | Shipping manifests |
| `logistics.itens_romaneio` | 020→035 | `id UUID` | Manifest items |
| `logistics.entregas` | 20260718194805 | `id UUID` | Delivery records |

```sql
CREATE TABLE logistics.entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL,
  status TEXT DEFAULT 'pendente',
  destinatario_nome TEXT,
  destinatario_documento TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  transportadora TEXT,
  tracking_code TEXT,
  data_previsao DATE,
  data_entrega TIMESTAMPTZ,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.7 Schema: `location`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `location.states` | 021→035 | `id UUID` | Brazilian states |
| `location.cities` | 021→035 | `id UUID` | Cities, FK→states |
| `location.addresses` | 022→035 | `id UUID` | Addresses |

---

### 2.8 Schema: `system`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `system.audit_logs` | 023→035 | `id UUID` | Audit trail |
| `system.system_configs` | 024→035 | `id UUID` | System configuration |
| `system.feature_flags` | 025→035 | `id UUID` | Feature flags |
| `system.integrations` | 026→035 | `id UUID` | External integrations |
| `system.notifications` | 027→035 | `id UUID` | System notifications |

---

### 2.9 Schema: `industrial`

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `industrial.empresa` | 068 | `id UUID` | Migrated from `public.empresas` |
| `industrial.materiais` | 068 | `id UUID` | Migrated from `public.materias_primas` |
| `industrial.maquinas` | 058 | `id UUID` | Machines |
| `industrial.maquinas_capacidade` | 058 | `id UUID` | Machine capacity |
| `industrial.maquinas_ciclos` | 058 | `id UUID` | Machine cycles |
| `industrial.maquinas_custos` | 058 | `id UUID` | Machine costs |
| `industrial.maquinas_manutencao` | 058 | `id UUID` | Machine maintenance |
| `industrial.maquinas_tempos` | 058 | `id UUID` | Machine timing |
| `industrial.processos` | 058 | `id UUID` | Manufacturing processes |
| `industrial.processos_maquinas` | 058 | `id UUID` | Process↔Machine junction |
| `industrial.roteiros` | 058 | `id UUID` | Manufacturing routes |
| `industrial.roteiros_passos` | 058 | `id UUID` | Route steps |
| `industrial.bom` | 058 | `id UUID` | Bill of materials |
| `industrial.bom_itens` | 058 | `id UUID` | BOM items |
| `industrial.bom_substituicoes` | 058 | `id UUID` | BOM material substitutions |
| `industrial.centros_trabalho` | 058 | `id UUID` | Work centers |
| `industrial.tipos_maquina` | 058 | `id UUID` | Machine types |
| `industrial.tipos_processo` | 058 | `id UUID` | Process types |
| `industrial.unidades_medida` | 058 | `id UUID` | Units of measure |

---

### 2.10 Schema: `public` (Legacy + Auth Metadata)

| Table | Created | PK Type | Notes |
|-------|---------|---------|-------|
| `public.user_profiles` | 001 | `id UUID` | Original user profiles (legacy) |
| `public.admin_users` | 001 | `id UUID` | Admin users (legacy) |
| `public.empresas` | 032 | `id UUID` | **Migrated to** `industrial.empresa` (068) |
| `public.materias_primas` | 032 | `id UUID` | **Migrated to** `industrial.materiais` (068) |
| `public.pedidos` | 032 | `id UUID` | **Migrated to** `commerce.pedidos` (040) |
| `public.itens_pedido` | 032 | `id UUID` | **Migrated to** `commerce.items_pedido` (040) |
| `public.distribuidores` | 032 | `id UUID` | **Migrated to** `mlm.distribuidores` (039) |
| `public.planos` | 032 | `id UUID` | **Migrated to** `mlm.planos` (039) |
| `public.bonificacoes` | 032 | `id UUID` | **Migrated to** `mlm.bonificacoes` (039) |
| `public.comissoes` | 032 | `id UUID` | **Migrated to** `mlm.comissoes` (039) |
| `public.rede_binaria` | 032 | `id UUID` | **Migrated to** `mlm.rede_binaria` (039) |
| `public.niveis` | 032 | `id UUID` | **Migrated to** `mlm.niveis` (039) |
| `public.regras_comissionamento` | 032 | `id UUID` | **Migrated to** `mlm.regras_comissionamento` (039) |
| `public.qualificacoes` | 032 | `id UUID` | **Migrated to** `mlm.qualificacoes` (039) |
| `public.carteiras` | 032 | `id UUID` | **Migrated to** `mlm.carteiras` (039) |
| `public.solicitacoes_saque` | 032 | `id UUID` | **Migrated to** `finance.solicitacoes_saque` (041) |
| `public.historico_saldo_distribuidor` | 032 | `id UUID` | **Migrated to** `mlm.historico_saldo_distribuidor` (039) |
| `public.historico_pedido` | 032 | `id UUID` | **Migrated to** `mlm.historico_pedido` (039) |
| `public.historico_status_pedido` | 032 | `id UUID` | **Migrated to** `mlm.historico_status_pedido` (039) |
| `public.estoque` | 032 | `id UUID` | **Migrated to** `logistics.estoque` (038) |
| `public.estoque_itens` | 032 | `id UUID` | **Migrated to** `logistics.estoque_itens` (038) |
| `public.envios` | 032 | `id UUID` | **Migrated to** `logistics.envios` (038) |
| `public.romaneios` | 032 | `id UUID` | **Migrated to** `logistics.romaneios` (038) |
| `public.itens_romaneio` | 032 | `id UUID` | **Migrated to** `logistics.itens_romaneio` (038) |
| `public.cupons` | 032 | `id UUID` | **Migrated to** `commerce.cupons` (040) |
| `public.products` | 032 | `id UUID` | **Migrated to** `commerce.products` (040) |
| `public.pagamentos` | 032 | `id UUID` | **Migrated to** `commerce.pagamentos` (040) |
| `public.tipos_campo_pedido` | 033 | `id UUID` | **Migrated to** `commerce.tipos_campo_pedido` (040) |
| `public.sync_log` | 20260718194811 | `id UUID` | Sync log |
| `public.migration_backfill_log` | 083 | `id UUID` | Dual-key migration log |
| `public.copilot_chat_sessions` | 059 | `id UUID` | Copilot chat sessions |
| `public.copilot_chat_messages` | 059 | `id UUID` | Copilot chat messages |
| `public.copilot_chat_usage` | 059 | `id UUID` | Copilot chat usage stats |

---

## 3. Views

| View | Created | Purpose |
|------|---------|---------|
| `mlm.view_rede_binaria` | 006 | Binary tree with parent names |
| `mlm.view_comissoes_distribuidor` | 005 | Commissions per distributor |
| `mlm.view_bonus_distribuidor` | 004 | Bonuses per distributor |
| `mlm.view_qualificacoes_distribuidor` | 009 | Qualifications per distributor |
| `mlm.view_ranking_distribuidores` | 007 | Distributor ranking |
| `mlm.view_estatisticas_rede` | 008 | Network statistics |
| `mlm.view_dashboard_distribuidor` | 010 | Distributor dashboard |
| `mlm.view_historico_completo` | 012 | Complete history |
| `mlm.view_pedido_completo` | 014 | Order details |
| `mlm.view_pagamento_completo` | 016 | Payment details |
| `mlm.view_estoque_produto` | 018 | Product inventory |
| `mlm.view_romaneio_completo` | 020 | Shipping manifest details |
| `mlm.view_cliente_completo` | 022 | Customer details |
| `mlm.view_auditoria_completa` | 023 | Full audit trail |
| `mlm.view_config_sistema` | 024 | System config |
| `mlm.view_integracao_completa` | 026 | Integration details |
| `mlm.view_notificacao_completa` | 027 | Notification details |
| `mlm.view_historico_pedido_completo` | 032 | Complete order history |
| `mlm.view_pedido_detalhado` | 032 | Detailed orders |
| `mlm.view_pagamento_detalhado` | 032 | Detailed payments |
| `mlm.view_estoque_detalhado` | 032 | Detailed inventory |
| `mlm.view_romaneio_detalhado` | 032 | Detailed shipping |
| `mlm.view_cliente_detalhado` | 032 | Detailed customers |
| `mlm.view_auditoria_detalhada` | 032 | Detailed audit |
| `mlm.view_config_detalhada` | 032 | Detailed config |
| `mlm.view_integracao_detalhada` | 032 | Detailed integrations |
| `mlm.view_notificacao_detalhada` | 032 | Detailed notifications |
| `industrial.view_maquinas_resumo` | 058 | Machine summary |
| `industrial.view_processos_resumo` | 058 | Process summary |
| `industrial.view_bom_resumo` | 058 | BOM summary |

---

## 4. Triggers

| Trigger | Table | Event | Function | Created |
|---------|-------|-------|----------|---------|
| `trg_set_user_claims` | `auth.users` | INSERT/UPDATE | `set_user_claims()` | 053 |
| `trigger_processar_pedido_pagamento` | `pedidos` (public/commerce?) | UPDATE WHEN pagamento_confirmado=true | `processar_pedido_mlm(NEW.id)` | 065 |
| `trg_audit_distribuidores` | `mlm.distribuidores` | INSERT/UPDATE/DELETE | `mlm.audit_distribuidores()` | 067 |
| `trg_audit_planos` | `mlm.planos` | INSERT/UPDATE/DELETE | `mlm.audit_planos()` | 067 |
| `trg_audit_comissoes` | `mlm.comissoes` | INSERT/UPDATE/DELETE | `mlm.audit_comissoes()` | 067 |
| `trg_audit_pedido` | `commerce.pedidos` | INSERT/UPDATE/DELETE | `mlm.audit_pedido()` | 067 |
| `trg_audit_pagamento` | `commerce.pagamentos` | INSERT/UPDATE/DELETE | `mlm.audit_pagamento()` | 067 |

---

## 5. RLS Policies

### 5.1 Domain Tables (066–067)

All domain tables (`mlm.*`, `crm.*`, `commerce.*`, `finance.*`, `logistics.*`, `system.*`, `location.*`, `identity.*`, `industrial.*`) have RLS enabled with:
- **admin_master_full_access**: Full CRUD for ADMIN_MASTER role
- **service_role_all**: Full CRUD for service_role
- **authenticated_read**: SELECT for authenticated users
- **owner_read**: SELECT for record owner (where applicable)
- **owner_update**: UPDATE for record owner (where applicable)

### 5.2 Legacy Public Tables (066)

`public.user_profiles`, `public.admin_users`, `public.empresas`, `public.materias_primas` — all have RLS with admin_master_full_access, service_role_all, authenticated_read.

### 5.3 Finance Tables (081) — **Problematic**

`finance.wallets` and `finance.points_wallets` have RLS policies created in 081 but **the tables were never created** in any migration. See §10.

### 5.4 Public Sync Tables (20260718194809–20260718194810)

`public.sync_log`, `mlm.notificacoes`, `mlm.api_audit`, `mlm.qualificacoes_requisitos` — all have RLS with admin_full_access, service_role_all, authenticated_read.

### 5.5 Copilot Tables (080)

`public.copilot_chat_sessions`, `public.copilot_chat_messages`, `public.copilot_chat_usage` — all have RLS with admin_master_full_access, service_role_all, authenticated_read, owner_read.

---

## 6. Enums & Custom Types

| Type | Values | Created |
|------|--------|---------|
| `mlm.status_pedido` | `pendente`, `processando`, `enviado`, `entregue`, `cancelado` | 032 |
| `mlm.tipo_pedido` | `plano`, `produto`, `upgrade` | 032 |
| `mlm.status_pagamento` | `pendente`, `confirmado`, `rejeitado`, `reembolsado` | 032 |
| `mlm.tipo_pagamento` | `pix`, `boleto`, `cartao`, `transferencia` | 032 |
| `mlm.status_envio` | `pendente`, `enviado`, `entregue`, `devolvido` | 032 |
| `mlm.tipo_notificacao` | `sistema`, `pedido`, `pagamento`, `envio`, `bonus`, `comissao` | 032 |

---

## 7. Functions & Procedures

### 7.1 Core MLM Processing

| Function | Schema | Created | Purpose |
|----------|--------|---------|---------|
| `processar_pedido_mlm(pedido_id UUID)` | public | 062 | Main entry: routes to plan/product processor |
| `processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)` | public | 063 | Plan purchase: creates/updates distributor |
| `processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)` | public | 064 | Product purchase: generates commissions/bonuses |
| `set_user_claims()` | public | 053 | Trigger: sets JWT claims on auth.users |
| `mlm.processar_pedido(pedido_id UUID)` | mlm | 069 | Alternative MLM order processor |
| `mlm.processar_pedido_completo(pedido_id UUID)` | mlm | 070 | Complete order processor |
| `mlm.processar_pedido_rpc(pedido_id UUID)` | mlm | 071 | RPC wrapper for order processing |
| `mlm.processar_pedido_event(event_data JSONB)` | mlm | 072 | Event-driven order processing |
| `mlm.processar_pedido_final(pedido_id UUID)` | mlm | 073 | Final order processor |

### 7.2 Network & Tree Operations

| Function | Schema | Created | Purpose |
|----------|--------|---------|---------|
| `mlm.get_network_tree(root_distributor_id UUID, max_depth INTEGER)` | mlm | 074 | Returns SETOF `mlm.network_tree_node` |
| `mlm.get_network_stats(root_distributor_id UUID)` | mlm | 075 | Network statistics |
| `mlm.get_network_overview(root_id UUID, depth INTEGER)` | mlm | 075 | Network overview |
| `mlm.get_network_node(node_id UUID)` | mlm | 075 | Single node info |
| `mlm.get_network_path(start_id UUID, end_id UUID)` | mlm | 075 | Path between nodes |
| `mlm.build_network_tree(root_id UUID, depth INTEGER)` | mlm | 075 | Tree builder |
| `mlm.update_network_positions(root_id UUID)` | mlm | 075 | Position updater |
| `mlm.get_network_statistics(root_id UUID)` | mlm | 075 | Statistics |
| `mlm.get_network_leaf_nodes(root_id UUID)` | mlm | 075 | Leaf nodes |
| `mlm.get_network_level(root_id UUID, level INTEGER)` | mlm | 075 | Level query |
| `mlm.calculate_network_metrics(root_id UUID)` | mlm | 075 | Metrics calculator |
| `mlm.get_network_visualization(root_id UUID, depth INTEGER)` | mlm | 075 | Visualization data |
| `mlm.search_network_distributors(root_id UUID, search_term TEXT)` | mlm | 075 | Search distributors |

### 7.3 RPC Functions (Frontend Call)

| Function | Schema | Created | Purpose |
|----------|--------|---------|---------|
| `mlm.rpc_commissions_dashboard(p_limit INT)` | mlm | 078 | Commissions dashboard ViewModel |
| `finance.rpc_office_finance(p_user_id TEXT)` | finance | 078→079 | Office finance ViewModel |
| `mlm.rpc_get_network_tree(p_root_id UUID, p_depth INT)` | mlm | 084 | **Replaces** broken 075 version |
| `mlm.rpc_get_network_analytics(p_root_id UUID)` | mlm | 075 | Network analytics |
| `mlm.rpc_get_downline_summary(p_root_id UUID, p_depth INT)` | mlm | 075 | Downline summary |
| `mlm.rpc_get_network_search(p_root_id UUID, p_search TEXT)` | mlm | 075 | Network search |
| `mlm.rpc_get_network_node_detail(p_node_id UUID)` | mlm | 075 | Node detail |

### 7.4 Audit Functions

| Function | Schema | Created | Purpose |
|----------|--------|---------|---------|
| `mlm.audit_distribuidores()` | mlm | 067 | Audit trigger for distribuidores |
| `mlm.audit_planos()` | mlm | 067 | Audit trigger for planos |
| `mlm.audit_comissoes()` | mlm | 067 | Audit trigger for comissoes |
| `mlm.audit_pedido()` | mlm | 067 | Audit trigger for pedidos |
| `mlm.audit_pagamento()` | mlm | 067 | Audit trigger for pagamentos |
| `mlm.log_api_call(...)` | mlm | 20260718194810 | API call logger |
| `system.log_sync_event(...)` | public | 20260718194811 | Sync event logger |

### 7.5 Helper Functions

| Function | Schema | Created | Purpose |
|----------|--------|---------|---------|
| `mlm.update_updated_at_column()` | mlm | 067 | Trigger for updated_at |
| `mlm.update_customer_updated_at()` | mlm | 067 | Trigger for crm.customers |
| `mlm.update_distribuidor_updated_at()` | mlm | 067 | Trigger for mlm.distribuidores |
| `mlm.update_pedido_updated_at()` | mlm | 067 | Trigger for commerce.pedidos |
| `mlm.update_pagamento_updated_at()` | mlm | 067 | Trigger for commerce.pagamentos |
| `mlm.get_user_role(user_id UUID)` | mlm | 053 | Get user role |
| `mlm.user_has_permission(user_id UUID, permission TEXT)` | mlm | 053 | Check permission |
| `mlm.get_customer_by_auth_id(auth_id TEXT)` | mlm | 053 | Customer lookup |
| `mlm.get_distributor_by_auth_id(auth_id TEXT)` | mlm | 053 | Distributor lookup |

---

## 8. Indexes

| Index | Table | Column(s) | Created |
|-------|-------|-----------|---------|
| `idx_mlm_rede_binaria_pai_id` | `mlm.rede_binaria` | `pai_id` WHERE pai_id IS NOT NULL | 20260718194808 |
| `idx_mlm_comissoes_data_calculo` | `mlm.comissoes` | `data_calculo` | 20260718194808 |
| `idx_mlm_comissoes_tipo` | `mlm.comissoes` | `tipo` | 20260718194808 |
| `idx_mlm_bonuses_paid_distributor` | `mlm.bonuses_paid` | `distributor_id` | 20260718194808 |
| `idx_mlm_commissions_pending_distributor` | `mlm.commissions_pending` | `distributor_id` | 20260718194808 |
| `idx_mlm_rewards_distributor` | `mlm.rewards` | `distributor_id` | 20260718194808 |
| `idx_commerce_pedidos_created` | `commerce.pedidos` | `created_at` | 20260718194808 |
| `idx_commerce_items_pedido_pedido` | `commerce.items_pedido` | `pedido_id` | 20260718194808 |
| `idx_finance_wallet_transactions_wallet` | `finance.wallet_transactions` | `wallet_id` | 20260718194808 |
| `idx_identity_user_roles_user` | `identity.user_roles` | `user_id` | 20260718194808 |

---

## 9. Dead / Orphan Tables

These tables exist in `public` schema but are **legacy** — their data has been migrated to domain schemas (035–041). They should be dropped after confirming no frontend references remain:

| Table | Status | Migrated To |
|-------|--------|-------------|
| `public.user_profiles` | Legacy | `identity.users` (via auth metadata) |
| `public.admin_users` | Legacy | `identity.users` + `identity.user_roles` |
| `public.empresas` | Migrated (068) | `industrial.empresa` |
| `public.materias_primas` | Migrated (068) | `industrial.materiais` |
| `public.pedidos` | Migrated (040) | `commerce.pedidos` |
| `public.itens_pedido` | Migrated (040) | `commerce.items_pedido` |
| `public.distribuidores` | Migrated (039) | `mlm.distribuidores` |
| `public.planos` | Migrated (039) | `mlm.planos` |
| `public.bonificacoes` | Migrated (039) | `mlm.bonificacoes` |
| `public.comissoes` | Migrated (039) | `mlm.comissoes` |
| `public.rede_binaria` | Migrated (039) | `mlm.rede_binaria` |
| `public.niveis` | Migrated (039) | `mlm.niveis` |
| `public.regras_comissionamento` | Migrated (039) | `mlm.regras_comissionamento` |
| `public.qualificacoes` | Migrated (039) | `mlm.qualificacoes` |
| `public.carteiras` | Migrated (039) | `mlm.carteiras` |
| `public.solicitacoes_saque` | Migrated (041) | `finance.solicitacoes_saque` |
| `public.historico_saldo_distribuidor` | Migrated (039) | `mlm.historico_saldo_distribuidor` |
| `public.historico_pedido` | Migrated (039) | `mlm.historico_pedido` |
| `public.historico_status_pedido` | Migrated (039) | `mlm.historico_status_pedido` |
| `public.estoque` | Migrated (038) | `logistics.estoque` |
| `public.estoque_itens` | Migrated (038) | `logistics.estoque_itens` |
| `public.envios` | Migrated (038) | `logistics.envios` |
| `public.romaneios` | Migrated (038) | `logistics.romaneios` |
| `public.itens_romaneio` | Migrated (038) | `logistics.itens_romaneio` |
| `public.cupons` | Migrated (040) | `commerce.cupons` |
| `public.products` | Migrated (040) | `commerce.products` |
| `public.pagamentos` | Migrated (040) | `commerce.pagamentos` |
| `public.tipos_campo_pedido` | Migrated (040) | `commerce.tipos_campo_pedido` |

**Still alive (intentionally in public):**

| Table | Purpose |
|-------|---------|
| `public.migration_backfill_log` | Dual-key migration tracking (083) |
| `public.sync_log` | AllIn sync log (20260718194811) |
| `public.copilot_chat_sessions` | Copilot sessions (059) |
| `public.copilot_chat_messages` | Copilot messages (059) |
| `public.copilot_chat_usage` | Copilot usage (059) |

---

## 10. Missing Tables (referenced but never created)

These tables are **referenced** in migrations but **no CREATE TABLE exists** in any of the 107 migrations:

| Table | Referenced In | Problem |
|-------|---------------|---------|
| `finance.wallets` | 081 (RLS), 20260718194804 (FK from wallet_transactions), 078/079 (RPC reads) | Table **never created** |
| `finance.points_wallets` | 081 (RLS) | Table **never created** |

**Impact**: `finance.wallet_transactions` (created 20260718194804) has a FK to `finance.wallets` which doesn't exist. The 081 migration adds RLS policies to `finance.wallets` and `finance.points_wallets`, but these tables were never created. The RPC functions `rpc_office_finance` (078/079) read from `mlm.carteiras` instead, suggesting `finance.wallets` was planned but never implemented.

**Resolution needed**: Either:
1. Create `finance.wallets` and `finance.points_wallets` tables, OR
2. Remove RLS policies from 081 and the FK from `finance.wallet_transactions`

---

## 11. Cross-Schema Dependency Graph

```
identity.users ←─────────────────────────────────────────────────┐
  │                                                               │
  ├─→ identity.user_roles ─→ identity.roles                      │
  ├─→ identity.role_permissions ─→ identity.permissions           │
  ├─→ identity.mfa_factors                                      │
  ├─→ crm.customers.auth_user_id                                │
  ├─→ mlm.distribuidores.auth_user_id                           │
  └─→ system.audit_logs.user_id                                │
                                                                │
crm.customers ←─────────────────────────────────────────────────┤
  │                                                               │
  ├─→ crm.customer_profiles (FK customer_id)                    │
  ├─→ crm.distributor_profiles (FK customer_id)                 │
  ├─→ crm.customer_distributor (FK customer_id, distributor_id) │
  ├─→ crm.customer_documents (FK customer_id)                   │
  ├─→ commerce.pedidos.id_comprador (TEXT)                       │
  ├─→ mlm.distribuidores (via auth_user_id join)                │
  └─→ mlm.qualificacoes (FK customer_id)                        │
                                                                │
mlm.distribuidores ←────────────────────────────────────────────┤
  │                                                               │
  ├─→ mlm.rede_binaria.distribuidor_id, pai_id (self-referential)│
  ├─→ mlm.planos_distribuidores (FK distribuidor_id, plan_id)   │
  ├─→ mlm.bonificacoes (FK distribuidor_id)                     │
  ├─→ mlm.comissoes (FK distribuidor_id)                        │
  ├─→ mlm.carteiras (FK distribuidor_id)                        │
  ├─→ mlm.solicitacoes_saque (FK distribuidor_id)               │
  ├─→ mlm.historico_saldo_distribuidor (FK distribuidor_id)     │
  ├─→ mlm.bonuses_paid.distributor_id                            │
  ├─→ mlm.commissions_pending.distributor_id                     │
  ├─→ mlm.rewards.distributor_id                                 │
  ├─→ mlm.api_audit.distributor_id                               │
  ├─→ mlm.notificacoes.distributor_id                            │
  ├─→ crm.distributor_profiles.distribuidor_id                  │
  ├─→ commerce.pedidos.distribuidor_comprador_id                 │
  └─→ commerce.pedidos.distribuidor_indicador_id                 │
                                                                │
mlm.planos ←────────────────────────────────────────────────────┤
  │                                                               │
  ├─→ mlm.planos_distribuidores (FK plan_id)                    │
  ├─→ mlm.regras_comissionamento (FK plan_id)                   │
  └─→ crm.customers.plan_id                                     │
                                                                │
commerce.pedidos ←──────────────────────────────────────────────┤
  │                                                               │
  ├─→ commerce.items_pedido (FK pedido_id)                      │
  ├─→ commerce.pagamentos (FK pedido_id)                        │
  ├─→ mlm.historico_pedido (FK pedido_id)                       │
  ├─→ mlm.historico_status_pedido (FK pedido_id)                │
  ├─→ logistics.envios.pedido_id                                 │
  └─→ logistics.entregas.pedido_id                               │
                                                                │
commerce.products ←─────────────────────────────────────────────┤
  │                                                               │
  └─→ commerce.items_pedido (FK produto_id)                     │
                                                                │
mlm.rede_binaria (self-referential tree) ───────────────────────┤
  │                                                               │
  ├─→ pai_id → distribuidor_id (parent)                         │
  └─→ distribuidor_id (child)                                    │
                                                                │
finance.wallet_transactions ────────────────────────────────────┤
  │                                                               │
  └─→ finance.wallets (FK) — TABLE MISSING                      │
                                                                │
logistics.entregas ←────────────────────────────────────────────┘
  (references commerce.pedidos by pedido_id)
```

---

## 12. Dual-Key Refactor Status

### Completed (082–083)
- `crm.customer_profiles` created — maps `auth_user_id` → `customer_id`
- `crm.distributor_profiles` created — maps `auth_user_id` → `customer_id` + `distribuidor_id`
- `crm.customer_distributor` junction created
- `crm.customers.patrocinador_id` and `distribuidor_id` converted to UUID (042)
- `crm.customer_profiles.needs_manual_review` added (083)
- `public.migration_backfill_log` created (083)

### Remaining (from IDENTITY_MIGRATION_MASTER_PLAN.md)
- **Phase 2**: Key-Resolution Service — gradual migration of ~247 occurrences across ~54 files from `id_comprador`/`allin_id` to `customer_id`
- **Phase 3**: Legacy bridge columns (`id_comprador`, `allin_id`) remain for AllIn API compatibility — **do not remove**

---

## Appendix A: Migration Chronology

| Phase | Migrations | Description |
|-------|-----------|-------------|
| Foundation | 001–031 | Extensions, schemas, tables (public), views, RLS, triggers, indexes |
| Schema Migration | 032–041 | Table migrations: public → domain schemas |
| ID Type Fixes | 042–044, 057 | TEXT→UUID→TEXT reversions for distribuidores; UUID for customers |
| Legacy Cleanup | 045–056 | View recreations, RLS disable for migration, old function cleanup |
| Auth & Claims | 053, 055 | JWT claims, user metadata, profile sync |
| Industrial | 058 | Industrial schema: machines, materials, processes, BOM |
| Copilot | 059 | Copilot chat tables in public |
| MLM Processing | 062–065 | Order processing functions + trigger |
| Audit & Triggers | 067 | Audit triggers for all domain tables |
| DB Cleanup | 068 | Migration of remaining public tables to domain schemas |
| RPC Functions | 069–079 | Order processing, network tree, finance RPCs |
| RLS Cleanup | 080 | Copilot RLS |
| Finance RLS | 081 | RLS for wallets/wallet_transactions (**tables missing**) |
| Dual-Key MVP | 082–083 | Key-Resolution Service tables |
| Network Fix | 084 | Replaces broken 075 network RPC |
| Schema Drift Fix | 085 | Adds missing columns to crm.customers, creates crm.customer_documents |
| Performance | 20260718194808 | Indexes for hot paths |
| Latest Additions | 20260718194800–20260718194811 | mfa_factors, wallet_transactions, entregas, qualificacoes_requisitos, notificacoes, api_audit, sync_log |
