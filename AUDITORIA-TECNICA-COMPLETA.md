# AUDITORIA TÉCNICA COMPLETA — AllIn-OS2

> **Data:** 06/07/2026
> **Stack:** Vite 7 + React 19 + Express + Supabase/PostgreSQL + Tailwind CSS v4
> **Supabase Project:** `imeadfnlgzphumuawdyt`
> **Git Branch:** `master`

---

## SUMÁRIO EXECUTIVO

| Área | Status | Risco |
|------|--------|-------|
| Arquitetura Geral | Híbrida (duas camadas de dados convivendo) | Alto |
| Database Schema (16 tabelas) | 76 migrations, mas 7 sem PK | Alto |
| RLS Policies | Inconsistente — algumas públicas, genéricas, sem tenant isolation | Crítico |
| Auth/JWT | Duas credenciais (anon + service_role) convivendo | Médio |
| Documentação vs Código | Documentação desatualizada, schemas divergem | Médio |
| Modularização | 33 módulos planejados, ~5 implementados parcialmente | Médio |
| Performance | Sem índices, sem paginação, service_role bypassa RLS | Alto |

**Pontuação geral de maturidade: 4/10 — Estrutura promissora com dívidas técnicas graves.**

---

## 1. ARQUITETURA GERAL

### 1.1 Stack Declarada vs Real

| Camada | Declarado (docs) | Real (código) | Status |
|--------|-------------------|----------------|--------|
| Frontend Framework | React 19 | React 19 | ✅ |
| Build Tool | Vite 7 | Vite 7 | ✅ |
| Router | TanStack Router | TanStack Router | ✅ |
| Data Fetching | React Query v5 | React Query v5 | ✅ |
| Backend | Express (modular) | Express (modular) | ✅ |
| Database | Supabase/PostgreSQL | Supabase/PostgreSQL | ✅ |
| CSS | Tailwind CSS 4 | Tailwind CSS 4 | ✅ |
| UI Library | Radix UI + shadcn/ui | Radix UI (sem shadcn) | ⚠️ Parcial |

### 1.2 Estrutura de Diretórios (Raiz)

```
AllIn-OS2/
├── src/                    # Frontend React (Vite)
│   ├── components/         # UI Components (shadcn-style + Radix)
│   ├── routes/             # TanStack Router (~25 rotas)
│   ├── modules/            # Módulos de negócio
│   │   ├── auth/           # Auth (context + hooks + service)
│   │   ├── customers/      # Clientes
│   │   └── payments/       # Pagamentos
│   ├── shared/             # Shared types, roles, permissions
│   ├── lib/                # Utilitários
│   └── providers/          # Context providers (cascata)
├── backend/                # Backend Express
│   ├── src/
│   │   ├── modules/        # Módulos backend
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   └── payments/
│   │   ├── middleware/      # Express middlewares
│   │   └── config/         # Config
│   └── server.ts           # Entry point
├── docs/                   # Documentação
│   ├── architecture/
│   ├── decisions/
│   ├── database/
│   ├── api/
│   ├── industrial/
│   ├── mlm/
│   └── security/
├── supabase/
│   └── migrations/         # 76 migrations SQL
└── package.json
```

### 1.3 Fluxo de Dados — Duas Camadas Convivendo

**NOVO PADRÃO (recomendado):**
```
Route → TanStack Query Hook → Service → httpClient → Express Backend → Supabase (service_role key)
                                                                              → RLS bypassado
```

**LEGADO (ainda em uso):**
```
Route → Context → Service → Supabase diretamente (anon key)
                             → RLS enforced
```

**⚠️ PROBLEMA:** As duas camadas convivem no mesmo código. Componentes ora chamam `useQuery` com hooks, ora chamam contextos que acessam Supabase direto. Isso gera inconsistência de dados, duplicação de lógica e riscos de segurança.

---

## 2. SUPABASE DATABASE — ANÁLISE COMPLETA

### 2.1 Tabelas Públicas (16 tabelas)

| # | Tabela | PK | RLS | Migrations | Status |
|---|--------|----|-----|------------|--------|
| 1 | `profiles` | ✅ uuid PK | ✅ | 001-008, 019, 031 | ✅ |
| 2 | `customers` | ✅ uuid PK | ✅ | 053, 056, 059, 060, 061 | ✅ |
| 3 | `contas_receber` | ❌ | ✅ (anon_select) | 018 | ⚠️ Sem PK |
| 4 | `custos_producao_real` | ❌ | ✅ (anon_select) | 020 | ⚠️ Sem PK |
| 5 | `capacidades` | ❌ | ✅ (anon_select) | 033 | ⚠️ Sem PK |
| 6 | `equipment_costs` | ❌ | ✅ | 048 | ⚠️ Sem PK |
| 7 | `roles` | ❌ | ✅ | 026 | ⚠️ Sem PK |
| 8 | `permissions` | ❌ | ✅ | 026 | ⚠️ Sem PK |
| 9 | `user_roles` | ❌ | ✅ | 026 | ⚠️ Sem PK |
| 10 | `role_permissions` | ❌ | ✅ | 026 | ⚠️ Sem PK |
| 11 | `user_role_history` | ❌ | ✅ | 026 | ⚠️ Sem PK |
| 12 | `system_logs` | ❌ | ✅ | 026 | ⚠️ Sem PK |
| 13 | `copilot_chats` | ✅ uuid PK | ✅ (user_id) | 038 | ✅ |
| 14 | `copilot_messages` | ✅ uuid PK | ✅ (user_id) | 038 | ✅ |
| 15 | `changelog` | ❌ | ✅ | 042 | ⚠️ Sem PK |
| 16 | `contas_pagar` | ❌ | ✅ | 062 | ⚠️ Sem PK |

**📊 9 de 16 tabelas (56%) não têm Primary Key definida.** Isso impede joins eficientes, upserts, atualizações pontuais e compromete a integridade referencial.

### 2.2 Schemas Customizados (4 schemas via migrations 034-041)

- `crm` — Gestão de relacionamento com clientes
- `mlm` — Rede de distribuição multinível
- `commerce` — E-commerce
- `logistics` — Logística

**Status:** Schemas criados mas **sem tabelas populadas**. Nenhuma migration posterior adicionou tabelas nesses schemas.

### 2.3 Colunas Específicas por Tabela

#### profiles
| Coluna | Tipo | Default | Notas |
|--------|------|---------|-------|
| id | uuid | gen_random_uuid() | PK |
| email | text | — | UNIQUE |
| full_name | text | — | — |
| avatar_url | text | — | — |
| phone | text | — | — |
| distributor_id | uuid | — | FK para profiles? |
| role | user_role | 'cliente'::user_role | ENUM |
| status | text | 'active'::text | — |
| metadata | jsonb | '{}'::jsonb | — |
| permissions | jsonb | '{}'::jsonb | — |
| created_at | timestamptz | now() | — |
| updated_at | timestamptz | now() | — |

#### customers
| Coluna | Tipo | Notas |
|--------|------|-------|
| id | uuid | PK |
| name | text | — |
| document | text | CPF/CNPJ |
| email | text | — |
| phone | text | — |
| address | jsonb | Endereço completo |
| type | customer_type | ENUM: PF/PJ |
| status | text | active/inactive |
| metadata | jsonb | — |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

#### contas_receber
| Coluna | Tipo | Default | Notas |
|--------|------|---------|-------|
| id | uuid | gen_random_uuid() | Sem PK constraint! |
| cliente_id | uuid | — | — |
| valor | numeric | — | — |
| data_vencimento | date | — | — |
| data_pagamento | date | — | — |
| status | text | 'pendente'::text | — |
| descricao | text | — | — |
| created_at | timestamptz | now() | — |

### 2.4 Tipos ENUM Customizados

```sql
user_role:     'admin' | 'distribuidor' | 'gerente' | 'operador' | 'cliente' | 'visitante'
customer_type: 'PF' | 'PJ'
```

### 2.5 Migrations — Problemas Estruturais

| Problema | Detalhes |
|----------|----------|
| **Duplicatas** | Migrations `056`, `059`, `060`, `061`, `062`, `064` aparecem 2x cada |
| **Ordem quebrada** | Migração `056` (add columns to customers) criou colunas que migrations anteriores já usavam |
| **Migration 048** | Cria `equipment_costs` com FK para `equipment_id` mas tabela `equipment` nunca foi criada |
| **Migration sem PK** | `system_logs`, `user_role_history`, etc. criados sem PK constraint |
| **Schemas vazios** | crm, mlm, commerce, logistics criados mas nunca povoados |

---

## 3. RLS POLICIES — AUDIT DE SEGURANÇA

### 3.1 Políticas por Tabela

| Tabela | Políticas | Nível de Risco |
|--------|-----------|-----------------|
| profiles | Authenticated CRUD | ⚠️ Médio |
| customers | Authenticated CRUD | ⚠️ Médio |
| contas_receber | Authenticated CRUD + **anon_select (anon)** | 🔴 **Crítico** |
| custos_producao_real | Authenticated CRUD + **anon_select (anon)** | 🔴 **Crítico** |
| capacidades | Authenticated CRUD + **anon_select (anon)** | 🔴 **Crítico** |
| equipment_costs | Authenticated CRUD | ⚠️ Médio |
| roles | Authenticated CRUD | ⚠️ Médio |
| permissions | Authenticated CRUD | ⚠️ Médio |
| user_roles | Authenticated CRUD | ⚠️ Médio |
| role_permissions | Authenticated CRUD | ⚠️ Médio |
| user_role_history | Authenticated CRUD | ⚠️ Médio |
| system_logs | Authenticated CRUD | ⚠️ Médio |
| copilot_chats | user_id isolation | ✅ Bom |
| copilot_messages | user_id isolation | ✅ Bom |
| changelog | Authenticated CRUD | ⚠️ Médio |
| contas_pagar | Authenticated (select/insert) | ⚠️ Médio |

### 3.2 Problemas Críticos de RLS

1. **🔴 Acesso anônimo a dados financeiros e de custos:**
   - `contas_receber`: política `anon_select` permite que QUALQUER pessoa (não autenticada) LEIA contas a receber
   - `custos_producao_real`: política `anon_select` permite que QUALQUER pessoa LEIA custos de produção
   - `capacidades`: política `anon_select` permite que QUALQUER pessoa LEIA capacidades

2. **🔴 Sem tenant isolation:**
   - Todas as políticas usam `USING (true)` — qualquer usuário autenticado vê TODOS os registros de TODAS as empresas/usuários
   - `profiles` permite que qualquer usuário autenticado veja e edite qualquer perfil

3. **🟡 Service Role Key no Backend:**
   - Backend usa `service_role` key que **bypassa completamente RLS**
   - Se o backend for comprometido, atacante tem acesso irrestrito ao banco

### 3.3 Recomendações de RLS

```sql
-- Tenant isolation básica para profiles
CREATE POLICY "users_can_read_own_profile"
ON profiles FOR SELECT
USING (id = auth.uid());

-- Tenant isolation para customers (se associado a distributor)
CREATE POLICY "distributors_read_own_customers"
ON customers FOR SELECT
USING (distributor_id = auth.uid());
```

---

## 4. AUTH & AUTORIZAÇÃO

### 4.1 Arquitetura de Auth

```
Frontend                          Backend
─────────                         ───────
1. Supabase Auth (email/password)
2. Anon key (sbp_...)             Service role key (svc_...)
3. JWT token                      JWT validation middleware
4. AuthContext (React)            Express middleware chain:
   ├─ session                        ├─ authenticate (JWT verify)
   ├─ user                           ├─ optionalAuth (tenta mas não falha)
   ├─ profile                        └─ requireRole (RBAC check)
   ├─ loading
   ├─ signIn
   ├─ signOut
   └─ Supabase client (anon)
```

### 4.2 Módulo de Auth — Análise de Código

**Frontend (`src/modules/auth/`):**
- `AuthContext.tsx` — Provider com estado de sessão, usuário, profile, loading
- `AuthProvider.tsx` — Wrapper do contexto
- `AuthGuard.tsx` — Componente de proteção de rota
- `useAuth.ts` — Hook de acesso ao contexto
- `types.ts` — Tipos de auth
- `authService.ts` — Serviço de auth (chama Supabase direto ou Express?)

**Backend (`backend/src/modules/auth/`):**
- Rotas de auth via Express
- Middleware `authenticate` valida JWT do Supabase
- Middleware `requireRole` verifica papel do usuário

### 4.3 Roles & Permissions System

**Definido em `src/shared/types/`:**
- `roles.ts`: `UserRole = 'admin' | 'distribuidor' | 'gerente' | 'operador' | 'cliente' | 'visitante'`
- `permissions.ts`: `Permission` interface com 11 módulos (dashboard, analytics, finance, support, network, orders, products, marketing, settings, system, industrial) × 5 ações (read, write, delete, manage, all)

**Tabelas no Supabase:** roles, permissions, user_roles, role_permissions, user_role_history — todas criadas (migration 026) mas:
- ❌ Nenhuma PK definida
- ❌ Nenhum dado populado
- ❌ Nenhuma constraint de unicidade
- ❌ Nenhum índice

**⚠️ Roles no código vs banco estão dessincronizados:**
- Código TS: `'admin' | 'distribuidor' | 'gerente' | 'operador' | 'cliente' | 'visitante'`
- ENUM no banco: `user_role` — mesmo conteúdo
- Mas tabela `roles` (relacional) nunca foi populada

---

## 5. BACKEND EXPRESS

### 5.1 Módulos Implementados vs Planejados

| Módulo | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Auth | ✅ | ✅ | Completo |
| Customers | ✅ (parcial) | ✅ (parcial) | Parcial |
| Payments | ✅ (parcial) | ⚠️ | Parcial |
| Products | ❌ | ❌ | Não iniciado |
| Orders | ❌ | ❌ | Não iniciado |
| MLM/Network | ❌ | ❌ | Não iniciado |
| Industrial | ❌ | ❌ | Não iniciado |
| Marketing | ❌ | ❌ | Não iniciado |
| Support | ❌ | ❌ | Não iniciado |
| Settings | ❌ | ⚠️ (StoreSettingsProvider) | Parcial |
| Analytics | ❌ | ❌ | Não iniciado |
| Logistics | ❌ | ❌ | Não iniciado |
| **Total: ~33 módulos** | **~3** | **~4** | **~15% complete** |

### 5.2 Estrutura do Backend

```
backend/src/
├── config/
│   └── env.ts            # Variáveis de ambiente
├── middleware/
│   ├── authenticate.ts   # JWT validation
│   ├── optionalAuth.ts   # Optional JWT (não falha)
│   ├── requireRole.ts    # RBAC check
│   └── errorHandler.ts   # Global error handler
├── modules/
│   ├── auth/
│   │   ├── authRoutes.ts
│   │   └── authService.ts
│   ├── customers/
│   │   ├── customerRoutes.ts
│   │   ├── customerService.ts
│   │   └── customerValidation.ts
│   └── payments/
│       └── ...
├── routes/
│   └── index.ts          # Route aggregator
├── services/
│   └── supabase.ts       # Supabase client (service_role key)
└── server.ts             # Entry point (Express app)
```

### 5.3 Pontos de Atenção no Backend

1. **Service Role Key:** O client Supabase no backend usa `service_role` key. Isso significa que **todo middleware de autorização no backend é puramente cosmético** — se um atacante conseguir chamar o backend diretamente (ignorando middlewares), ele tem acesso total ao banco.

2. **Tratamento de Erros:** Error handler implementado mas sem padronização de formato de erro.

3. **Validação:** Apenas `customers` tem arquivo de validação (Zod). Demais módulos sem validação de entrada.

4. **Rotas Expostas:** Sem rate limiting, sem proteção contra ataques de força bruta.

---

## 6. FRONTEND REACT

### 6.1 Estrutura de Rotas (TanStack Router)

```
__root.tsx                  → Root layout com providers
├── index.tsx               → Dashboard
├── login.tsx               → Login
├── register.tsx            → Register
├── dashboard.tsx           → Dashboard (autenticado)
├── customers/
│   ├── index.tsx           → Lista clientes
│   ├── new.tsx             → Novo cliente
│   └── $customerId.tsx     → Detalhe cliente
├── payments/
│   ├── index.tsx           → Lista pagamentos
│   └── $paymentId.tsx      → Detalhe pagamento
├── settings/
│   └── index.tsx           → Configurações
├── admin/
│   └── index.tsx           → Admin panel
├── network/                → MLM/Network
│   ├── index.tsx
│   └── members.tsx
├── products/
│   ├── index.tsx
│   └── catalog.tsx
├── support/
│   └── index.tsx
├── analytics/
│   └── index.tsx
├── marketing/
│   └── index.tsx
├── industrial/
│   ├── index.tsx
│   ├── production.tsx
│   └── quality.tsx
├── logistics/
│   └── index.tsx
├── finance/
│   ├── index.tsx
│   ├── receivables.tsx
│   └── payables.tsx
└── reports/
    └── index.tsx
```

**Total:** ~25 rotas definidas com conteúdo variado (algumas com componentes completos, outras com placeholders).

### 6.2 Context Providers (Cascata)

```
ThemeProvider
└── AuthProvider
    └── DistributorProvider
        └── StoreSettingsProvider
            └── CartProvider
                └── ProductsProvider
                    └── StyleProvider
                        └── Router
```

**Problema:** Cascata profunda de providers. Cada provider adiciona complexidade. `DistributorProvider` e `StoreSettingsProvider` fazem queries no Supabase na montagem. Se qualquer provider falhar, a aplicação inteira pode quebrar (sem Error Boundaries).

### 6.3 Módulos do Frontend

| Módulo | Status | Componentes |
|--------|--------|-------------|
| Auth | ✅ Completo | AuthProvider, AuthGuard, Login, Register |
| Customers | ⚠️ Parcial | List, New, Detail |
| Payments | ⚠️ Parcial | List, Detail |
| Network | 🟡 Esqueleto | Index, Members |
| Products | 🟡 Esqueleto | Index, Catalog |
| Support | 🟡 Esqueleto | Index |
| Analytics | 🟡 Esqueleto | Index |
| Marketing | 🟡 Esqueleto | Index |
| Industrial | 🟡 Esqueleto | Index, Production, Quality |
| Logistics | 🟡 Esqueleto | Index |
| Finance | 🟡 Esqueleto | Index, Receivables, Payables |
| Reports | 🟡 Esqueleto | Index |
| Settings | ⚠️ Parcial | Index, StoreSettingsProvider |
| Admin | 🟡 Esqueleto | Index |

---

## 7. DOCUMENTAÇÃO — ANÁLISE DE CONSISTÊNCIA

### 7.1 Documentos vs Realidade

| Documento | Arquivo(s) | Consistência com Código |
|-----------|-----------|------------------------|
| `docs/architecture/overview.md` | Overview da arquitetura | ⚠️ Desatualizado — descreve monolito, mas já tem modularização |
| `docs/database/schema.md` | Schema do banco | 🔴 Divergente — descreve tabelas que não existem mais, omite colunas atuais |
| `docs/api/rest-api.md` | Endpoints da API | ⚠️ Parcial — documenta apenas auth e customers |
| `docs/security/authorization.md` | RBAC e autorização | ⚠️ Descreve sistema de permissões que não está totalmente implementado |
| `docs/decisions/*.md` | ADRs | ⚠️ Alguns desatualizados, decisões tomadas mas não documentadas (ex: dual data layer) |
| `docs/mlm/*.md` | MLM | ✅ Existe mas MLM não implementado |

### 7.2 Documentação Faltante

- ❌ **Data Flow Diagram** — Fluxo entre frontend → backend → Supabase não documentado
- ❌ **Component Tree** — Árvore de componentes React não documentada
- ❌ **Migration Guide** — Como rodar/debuggar migrations
- ❌ **Env Variables List** — Lista completa de variáveis de ambiente
- ❌ **Error Codes** — Códigos de erro padronizados
- ❌ **Testing Strategy** — Estratégia de testes (não existem testes no repositório)

---

## 8. SEGURANÇA — VULNERABILIDADES IDENTIFICADAS

### 🔴 Críticas

| ID | Vulnerabilidade | Local | Impacto |
|----|-----------------|-------|---------|
| C-01 | `anon_select` em tabelas financeiras | contas_receber, custos_producao_real, capacidades | Dados financeiros expostos publicamente |
| C-02 | Service Role Key no backend | backend/src/services/supabase.ts | Acesso irrestrito se backend comprometido |
| C-03 | Sem tenant isolation | Todas as tabelas (exceto copilot) | Usuário A vê dados do Usuário B |
| C-04 | Profiles sem isolation | profiles tabela | Qualquer auth vê/edita qualquer profile |

### 🟡 Altas

| ID | Vulnerabilidade | Local | Impacto |
|----|-----------------|-------|---------|
| A-01 | Sem rate limiting | Backend Express | Força bruta em login |
| A-02 | Sem input validation na maioria dos módulos | Backend | Injeção, XSS |
| A-03 | JWT armazenado em variável React state | AuthContext | Vulnerável a XSS |
| A-04 | service_role exposta em logs de erro potencial | Backend | Vazamento de credenciais |
| A-05 | Sem CORS configurado explicitamente | Backend server.ts | Potencial CORS misconfig |

### 🟡 Médias

| ID | Vulnerabilidade | Local | Impacto |
|----|-----------------|-------|---------|
| M-01 | Sem CSP headers | Frontend | XSS |
| M-02 | Tokens sem refresh automático | Auth module | Sessão expirada sem tratamento |
| M-03 | Sem sanitização em inputs de busca | Frontend | XSS potencial |
| M-04 | Provider cascade sem error boundaries | Frontend providers | Falha em um provider quebra app |
| M-05 | Sem logging de acesso | Backend | Auditoria impossível |

---

## 9. PERFORMANCE — GARGALOS IDENTIFICADOS

| ID | Problema | Local | Impacto |
|----|----------|-------|---------|
| P-01 | **N+1 queries** potenciais em cascata de providers | Frontend providers | Múltiplas queries no mount |
| P-02 | **Sem índices** no banco | Todas as tabelas | Full table scans em produção |
| P-03 | **Sem paginação** em listas | customers, payments, etc. | Degradação com >1000 registros |
| P-04 | **Sem lazy loading** de rotas | TanStack Router | Bundle grande, hydration lento |
| P-05 | **Provider cascade síncrono** | Frontend | Bloqueio de render até todos providers carregarem |
| P-06 | **Sem memo** em componentes de lista | Vários | Re-renders desnecessários |
| P-07 | **Sem compressão** no backend | Express server | Payloads grandes sem gzip |

---

## 10. QUALIDADE DE CÓDIGO — OBSERVAÇÕES

### 10.1 Pontos Fortes
- ✅ TypeScript estrito em todo o código
- ✅ Modularização clara (src/modules/)
- ✅ Separação de responsabilidades (Route → Hook → Service)
- ✅ Uso de Zod para validação (parcial)
- ✅ Padrão consistente de nomenclatura

### 10.2 Pontos Fracos
- ❌ **Zero testes** — nenhum arquivo de teste encontrado
- ❌ **Muitos placeholders** — ~70% das rotas têm apenas esqueletos
- ❌ **Duas camadas de dados** — supabase direto + backend Express, sem padronização
- ❌ **Provider hell** — 7+ níveis de providers aninhados
- ❌ **Sem error boundaries** — qualquer erro em provider quebra a árvore
- ❌ **Código morto** — imports não utilizados, arquivos órfãos
- ❌ **Mutations órfãs** — migrations duplicadas (056, 059-062, 064)

---

## 11. GAPS FUNCIONAIS

| Funcionalidade | Status | Prioridade | Esforço |
|----------------|--------|-----------|---------|
| RBAC funcional (roles + permissions) | ❌ Não implementado | Crítica | 3 dias |
| RLS com tenant isolation | ❌ Não implementado | Crítica | 2 dias |
| Remoção de anon_select policies | ❌ Não implementado | Crítica | 1 dia |
| Testes automatizados | ❌ Não iniciado | Alta | 5 dias |
| Correção de migrations duplicadas | ❌ Não iniciado | Alta | 1 dia |
| Adição de PKs faltantes | ❌ Não iniciado | Alta | 1 dia |
| Lazy loading de rotas | ❌ Não iniciado | Alta | 1 dia |
| Paginação em listas | ⚠️ Não iniciado | Alta | 2 dias |
| Índices de banco | ❌ Não iniciado | Média | 1 dia |
| Modularização completa (33 módulos) | ⚠️ ~15% complete | Média | 30+ dias |
| Schemas customizados (crm, mlm, etc.) | 🟡 Skeleton | Média | 10+ dias |
| Rate limiting | ❌ Não iniciado | Média | 0.5 dia |
| Error boundaries | ❌ Não iniciado | Média | 0.5 dia |
| Providers refactor | ❌ Não iniciado | Baixa | 2 dias |
| Code splitting | ❌ Não iniciado | Baixa | 1 dia |

---

## 12. RECOMENDAÇÕES PRIORIZADAS

### Imediatas (Semana 1)

1. **🔴 Remover políticas `anon_select`** de contas_receber, custos_producao_real, capacidades
2. **🔴 Implementar tenant isolation** em todas as tabelas (por distributor_id ou user_id)
3. **🔴 Adicionar Primary Keys** em todas as tabelas que não têm
4. **🟡 Corrigir migrations duplicadas** (consolidar em migration única)
5. **🟡 Adicionar índices** nas colunas mais consultadas

### Curto Prazo (Semanas 2-3)

6. **🟡 Padronizar camada de dados** — escolher entre rota direta ao Supabase ou via Express (e migrar completamente)
7. **🟡 Adicionar rate limiting** ao backend Express
8. **🟡 Implementar refresh automático de JWT** no frontend
9. **🟡 Adicionar Error Boundaries** nos providers
10. **🟡 Implementar lazy loading** nas rotas do TanStack Router

### Médio Prazo (Semanas 4-8)

11. **🟢 Escrever testes** (vitest + Playwright)
12. **🟢 Implementar paginação** em todas as listas
13. **🟢 Refatorar provider cascade** (consolidar providers, usar composição)
14. **🟢 Atualizar documentação** para refletir arquitetura real
15. **🟢 Implementar logging estruturado** no backend

### Longo Prazo (Meses 2-3)

16. **Poplar schemas customizados** (crm, mlm, commerce, logistics)
17. **Implementar módulos faltantes** (~28 módulos restantes)
18. **Dashboards e analytics**
19. **CI/CD pipeline**
20. **Monitoramento e observabilidade**

---

## 13. MÉTRICAS DO PROJETO

| Métrica | Valor |
|---------|-------|
| Arquivos de código | ~180 |
| Rotas frontend | ~25 |
| Módulos backend implementados | ~3 de ~33 |
| Tabelas no Supabase | 16 |
| Migrations SQL | 76 (com 6 duplicatas) |
| Schemas PostgreSQL | 5 (public + 4 custom vazios) |
| Providers React | 7+ (cascata) |
| Testes | 0 |
| RLS policies totais | ~40 |
| Políticas anon_select | 3 (crítico) |
| Tabelas sem PK | 9 de 16 |
| Documentos de arquitetura | ~15 |
| ADRs | ~8 |

---

## 14. CONCLUSÃO

**AllIn-OS2** é um projeto full-stack ambicioso com arquitetura moderna (React 19 + Vite 7 + Supabase) mas que sofre de:

1. **Duas camadas de dados conflitantes** — necessidade de padronização urgente
2. **RLS policies inseguras** — dados financeiros expostos publicamente, sem tenant isolation
3. **Integridade de banco comprometida** — 56% das tabelas sem PK, migrations duplicadas
4. **Projeto ~15% completo** — módulos extensos por implementar
5. **Dívida técnica acumulada** — zero testes, placeholders, provider hell

**O projeto está em estágio alpha avançado com fundação técnica sólida mas requer ações corretivas imediatas de segurança antes de qualquer deploy em produção.**

---

*Relatório gerado em 06/07/2026 via auditoria automatizada multi-agente.*
