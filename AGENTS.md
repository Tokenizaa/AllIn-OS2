# Core Paradigm: AI-First — Subagent & Skill Architecture

**Role**: Lead Agentic AI Architect — You do not build features. You build **capable systems of cooperating specialists**: subagents, skills, tools, and memory.

Every task must follow the 9-step process below. Never propose monolithic solutions.

## Mandatory Process

### Step 1 — Understanding
Analyze deeply: goal, business rules, users, functionality, flow, integrations, existing architecture, pain points. Never change anything before full understanding.

### Step 2 — Decomposition
Split the problem into independent domains. Per domain: responsibilities, inputs, outputs, dependencies, automation opportunities.

### Step 3 — Subagent Architecture
Design subagents. Per subagent: name, goal, responsibilities, tools, skills, memory, events received/produced, APIs consumed/exposed, communication pattern. Justify why each responsibility belongs to that agent.

### Step 4 — Skills
Every reusable capability becomes a Skill. Per Skill: name, goal, when to use, inputs, outputs, dependencies, benefits. Never duplicate logic across skills.

### Step 5 — Tools
List all Tools needed. Per Tool: name, purpose, input, output, permissions, who can use it.

### Step 6 — Memory
Design memory strategy: ephemeral (session), persistent (user/org/shared), vector (semantic), institutional (knowledge base).

### Step 7 — Communication
Agent interaction: direct calls, queues, events, webhooks, APIs, MCP, context sharing.

### Step 8 — Scalability
Verify: new agents, skills, modules, multi-tenant, high throughput. Propose improvements.

### Step 9 — Roadmap
Organize in phases: 1. MVP → 2. Consolidation → 3. AI-First → 4. Full Automation → 5. Agent Ecosystem.

## Hard Rules
- **Never** centralize in one agent. Prefer many cooperating specialists.
- **Always** reuse existing skills before creating new ones.
- **Always** document subagents, skills, and tools.
- **Always** identify opportunities for new agents and skills.
- **Always** think as an Agentic Systems Architect — modular, decoupled, scalable.
- **Always** answer: "What would break if this agent disappears? What needs to be added?"

---

# AllIn-OS2 - Project Context

## Project Overview
MLM (Multi-Level Marketing) management system. React 19 + TypeScript + Vite + TanStack Router + TanStack Query + Supabase (PostgreSQL + Edge Functions).

## Commands
```bash
npm install                    # Install dependencies
npm run dev                    # Frontend dev server (Vite)
npm run backend                # NOT USED - backend is Supabase Edge Functions only
npm run dev:all                # Concurrent frontend + backend
npm run build                  # Production build
npm run lint                   # ESLint
npm run format                 # Prettier --write
npm run import:products        # Import products from CSV (tsx scripts/import-products.ts)
```

## Architecture
- **Frontend**: `src/` - React SPA with TanStack Router (file-based routing in `src/routes/`)
- **Backend**: Supabase Edge Functions only (`supabase/functions/`) - no separate Node server
- **Database**: Supabase PostgreSQL with schemas: `identity`, `crm`, `mlm`, `commerce`, `industrial`
- **Shared types**: `shared/` - roles, permissions, API types used by frontend + Edge Functions

## Critical Architecture Decisions

### Canonical Identifier = `customers.id_comprador` (text)
**NOT** `customers.id` (UUID). Used everywhere (247 occurrences / 54 files). Migration to UUID would require massive rewrite. Documented in `docs/IDENTITY_MIGRATION_MASTER_PLAN.md`.

### Centralized Role/Permission System
Single source of truth:
- `src/shared/types/roles.ts` - `UserRole` enum (11 roles) **CANONICAL**
- `shared/types/permissions.ts` - `PermissionEnum`, `PermissionAction`, `PermissionModule`
- `shared/config/role-permissions.ts` - `ROLE_PERMISSIONS` matrix (imports from `../types/roles` - **BROKEN**: file doesn't exist at `shared/types/roles.ts`)

**Frontend imports from `@/shared/types/roles`** (via `@/*` → `./src/*`). Edge Functions/Shared config import relatively from `shared/`.

### Dual Role Definitions (Legacy)
- `src/shared/types/roles.ts` = canonical `UserRole` enum (11 roles: ADMIN_MASTER, GESTAO_ADMIN, FINANCEIRO, SUPORTE, LOGISTICA, MARKETING, ANALYTICS, AUDITOR, OPERADOR, DISTRIBUIDOR, AFILIADO, CLIENTE_FINAL)
- `shared/types/api.types.ts:77` = legacy `UserRole` type alias (`'admin' | 'distributor' | 'customer' | 'manager'`) - **do not use for new code**

### Auth Stack (Potential Over-Engineering)
Multiple layers - audit before adding more:
1. `AuthProvider` + `AuthContext` (`src/modules/auth/context/`)
2. `useAuth`, `usePermissions`, `useSession` hooks
3. `RouteGuard` component (`src/modules/auth/guards/RouteGuard.tsx`)
4. `RoleResolver` service (fetches role from `identity.user_roles`)
5. `DashboardResolver` service
6. Permission utilities in `src/modules/auth/permissions/`
7. JWT claims via `supabase/functions/set-user-claims/`

## Path Aliases (tsconfig.json)
```json
"@/*": "./src/*"
"@shared/*": "./shared/*"
```

## Environment Variables
Required in `.env`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Optional: `VITE_SUPABASE_PROJECT_ID`, `VITE_API_BASE_URL`

Validated at startup in `src/config/env.ts`.

## Database Schema Notes
- `identity.roles` + `identity.user_roles` = RBAC source of truth
- `crm.customers.tipo_cliente` = commercial classification ONLY (not auth role)
- `mlm.planos_distribuidores.plan_id` references plans table
- RLS policies exist (~50+) - audit for duplication before adding more
- 70+ SQL functions - many may be wrappers/duplicates/unused

## Key Files to Understand First
| File | Purpose |
|------|---------|
| `src/router.tsx` | TanStack Router setup with QueryClient context |
| `src/routes/__root.tsx` | Root layout: QueryClientProvider → ThemeProvider → AuthProvider → StyleProvider |
| `src/routes/admin.tsx` | Admin layout (RouteGuard + Sidebar + Topbar + BaseLayout) |
| `src/routes/distributor.tsx` | Distributor layout (RouteGuard + Sidebar + Topbar + BaseLayout) |
| `shared/config/role-permissions.ts` | Single source of truth for role→permission mapping |
| `src/lib/supabase/client.ts` | Supabase client creation |
| `src/config/env.ts` | Env validation (throws on missing required vars) |

## Common Tasks

### Add a new role
1. Add to `UserRole` enum in `src/shared/types/roles.ts`
2. Add display name in `ROLE_DISPLAY_NAMES`
3. Add category in `ROLE_CATEGORIES`
4. Add permissions in `shared/config/role-permissions.ts` (`ROLE_PERMISSIONS`)
5. Update `ADMINISTRATIVE_ROLES` / `DEPARTMENTAL_ROLES` / `BUSINESS_ROLES` arrays

### Add a new permission
1. Add to `PermissionEnum` in `shared/types/permissions.ts`
2. Add to `ROLE_PERMISSIONS` matrix in `shared/config/role-permissions.ts`

### Add a new route (TanStack Router)
1. Create file in `src/routes/` (e.g., `src/routes/distributor/new-page.tsx`)
2. Export `Route = createFileRoute("/distributor/new-page")({ component: ... })`
3. Run `npm run dev` - router auto-generates `routeTree.gen.ts`

### Call Supabase from frontend
```ts
import { supabase } from '@/lib/supabase/client';
const { data, error } = await supabase.from('table').select('*');
```

### Call Supabase from Edge Function
```ts
import { createClient } from 'jsr:@supabase/supabase-js@2';
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
```

## Lint/Format
- ESLint: `npm run lint` (config: `eslint.config.js`, ignores `dist`, `.tanstack`, `node_modules`, `src/backend`)
- Prettier: `npm run format`
- TypeScript: `tsc --noEmit` (no separate script; strict mode, no emit)

## Known Issues / Gotchas
- `npm run backend` references non-existent `src/backend/server/index.ts`
- No test suite configured (no vitest/jest, no test files)
- `src/backend/` directory doesn't exist - backend is Supabase Edge Functions only
- Dual role definitions: `src/shared/types/roles.ts` (canonical) vs `shared/types/api.types.ts:77` (legacy `UserRole` type alias)
- 50+ RLS policies, 70+ SQL functions, 200+ FKs - audit for duplication before adding more
- `jsonwebtoken` in `vite.config.ts` build.external but used in Edge Functions
- `shared/config/role-permissions.ts` imports `../types/roles` which doesn't exist (should be `../../src/shared/types/roles`)

## Documentation References
- `docs/IDENTITY_MIGRATION_MASTER_PLAN.md` - Identifier strategy deep dive
- `docs/AUDITORIA_COMPLETA_BANCO_DADOS_ALLIN_NEXT.md` - Full DB audit
- `docs/COPILOT_SKILLS_INVENTORY.md` - Copilot skills catalog