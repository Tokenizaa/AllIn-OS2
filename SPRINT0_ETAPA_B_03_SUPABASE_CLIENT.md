# Sprint 0 — Etapa B #03: Engenharia Reversa — supabase/client

## Objetivo
Rastrear completa e exaustivamente o artefato `src/lib/supabase/client.ts`, suas exportações, consumidores diretos e indiretos, e identificar gaps, inconsistências e riscos arquiteturais.

---

## 1. Definição do Arquivo

**Arquivo:** `src/lib/supabase/client.ts`
**Barrel:** `src/lib/supabase/index.ts` (re-exporta todos os 4 exports)

### 1.1 Exportações

| Export | Tipo | Key | Singleton? | Proteção Runtime |
|---|---|---|---|---|
| `supabase` | `SupabaseClient` | `VITE_SUPABASE_ANON_KEY` (pública) | Sim — criado no `import` (linha 55) | Não |
| `getFrontendClient()` | `SupabaseClient` | `VITE_SUPABASE_ANON_KEY` (pública) | Sim — lazy singleton | Não |
| `getBackendClient()` | `SupabaseClient` | `SUPABASE_SERVICE_ROLE_KEY` (admin) | Não — cria nova instância | `typeof window !== "undefined"` → throw |
| `getSupabaseAdminClient()` | `SupabaseClient` | `SUPABASE_SERVICE_ROLE_KEY` | Delegado para `getBackendClient()` | Mesmo |

### 1.2 Observações sobre `supabase` (frontend singleton)
- Criado no **load do módulo** (`export const supabase = getFrontendClient()`)
- Isso significa que qualquer import de `supabase` aciona a leitura de env vars e criação do client
- Se as env vars não estiverem definidas no momento do import, o erro só aparece quando `getFrontendClient()` é chamado — mas como é chamado na inicialização do módulo, o erro ocorre no load

### 1.3 Observações sobre `getBackendClient()`
- Requer `SUPABASE_SERVICE_ROLE_KEY` de `process.env` (não VITE_)
- Fallback para `VITE_SUPABASE_URL` se `SUPABASE_URL` não estiver definido
- `autoRefreshToken: false`, `persistSession: false` — correto para backend
- **Proteção de runtime:** `typeof window !== "undefined"` → throw com mensagem de segurança

---

## 2. Consumidores Diretos

### 2.1 `supabase` (frontend anon key) — 39 referências

**Serviços backend que usam `supabase` (ANON KEY) em vez de service_role:**
> **⚠️ GRAVE:** Serviços backend estão usando a chave anônima (pública) para operações de banco. Isso significa que estão sujeitos a RLS policies — qualquer operação que exija bypass de RLS (escritas administrativas, operações em schemas não-públicos, etc.) pode falhar silenciosamente ou ser bloqueada.

- `analytics/services/analytics-update.service.ts` — **import quebrado** (aponta para `shared/infrastructure/supabase/client` que não existe)
- `qualifications/services/qualification.service.ts` — **import quebrado**
- `finance/services/withdrawal.service.ts` — **import quebrado**
- `finance/services/bank-account.service.ts` — **import quebrado**
- `finance/services/balance.service.ts` — **import quebrado**
- `commissions/services/commission.service.ts` — **import quebrado**
- `embeddings/services/embedding.service.ts` — **import quebrado**
- `logistics/services/carrier.service.ts` — **import quebrado**
- `payments/services/bonus-wallet.service.ts` — **import quebrado**
- `payments/services/financial-audit.service.ts` — **import quebrado**
- `payments/services/discount-engine.service.ts` — **import quebrado**
- `payments/services/payment-split.service.ts` — **import quebrado**
- `payments/services/points-wallet.service.ts` — **import quebrado**
- `payments/services/retry-queue.service.ts` — **import quebrado**
- `payments/services/wallet.service.ts` — **import quebrado**
- `payments/services/webhook-processor.service.ts` — **import quebrado**

### 2.2 `getBackendClient()` (service_role key) — usos corretos

- `infra/database/base.repository.ts` — **CORRETO** (usa getBackendClient)
- `payments/services/fraud-detection.service.ts` — **CORRETO** (importa de `shared/infrastructure/supabase/client` mas o caminho está **quebrado** — não resolve)
- `backend/modules/auth/services/auth.service.ts` — **CORRETO** (importa de `@/lib/supabase/client`)

### 2.3 `getFrontendClient()`
- `backend/modules/auth/services/auth.service.ts` — **CORRETO** (usa para verificar sessão do usuário no middleware)

### 2.4 Industrial repositories (14 arquivos)
- Importam `@/backend/shared/infrastructure/repository/base.repository` — **QUEBRADO** (caminho não existe)

---

## 3. Consumidores Indiretos

### 3.1 Via `BaseRepository` — Cadeia Funcional

```
infra/database/base.repository.ts → getBackendClient() → service_role
  ├── customers (repositories/customer.repository.ts)
  ├── orders (repositories/order.repository.ts)
  ├── plans (repositories/plan.repository.ts)
  ├── payments (repositories/payment.repository.ts)
  ├── network (repositories/network.repository.ts)
  ├── auth (services/auth.service.ts)
  ├── profiles (repositories/profile.repository.ts)
  ├── distributors (repositories/distributor.repository.ts)
  ├── departments (repositories/department.repository.ts)
  ├── manufacturers (repositories/manufacturer.repository.ts)
  ├── comments (repositories/comment.repository.ts)
  ├── attributes (repositories/attribute.repository.ts)
  ├── options (repositories/option.repository.ts)
  ├── info-pages (repositories/info-page.repository.ts)
  ├── product-kits (repositories/product-kit.repository.ts)
  ├── returns (repositories/return.repository.ts)
  ├── abandoned-carts (repositories/abandoned-cart.repository.ts)
  ├── copilot (repositories/copilot.repository.ts)
  ├── analytics (repositories/analytics.repository.ts)
  └── dashboard (repositories/dashboard.repository.ts)
```

### 3.2 Via `BaseRepository` — Cadeia Quebrada

Estes módulos importam de `shared/infrastructure/repository/base.repository` (NÃO EXISTE):

```
shared/infrastructure/repository/base.repository → ??? → ???
  ├── industrial (14 repositories)
  ├── commissions (commission.repository.ts)
  ├── stores (store.repository.ts)
  ├── logistics (carrier.repository.ts)
  ├── cms (website.repository.ts)
  ├── inventory (inventory.repository.ts)
  ├── qualifications (qualification.repository.ts)
  ├── admin (3 repositories)
  ├── ead (2 repositories)
  ├── products (product.repository.ts)
  ├── orders (custom-field.repository.ts)
  └── dashboard (dashboard.repository.ts)
```

---

## 4. Arquivos que Usam `supabase` (anon key) no Frontend

### 4.1 Hooks
- `src/hooks/useAuth.ts`
- `src/hooks/useProfile.ts`
- `src/hooks/usePermissions.ts`
- `src/hooks/useNotifications.ts`
- `src/hooks/useSession.ts`
- `src/hooks/useSupabase.ts`

### 4.2 Providers
- `src/providers/auth-provider.tsx`

### 4.3 Services (via httpClient — rota A)
- `src/services/auth.service.ts`
- `src/services/customers.service.ts`
- `src/services/distributors.service.ts`
- `src/services/network.service.ts`
- `src/services/orders.service.ts`
- `src/services/plans.service.ts`
- `src/services/payments.service.ts`

---

## 5. ACHADOS CRÍTICOS

### 5.1 🚨 Diretório `shared/infrastructure/` NÃO EXISTE

**Evidência:** `Test-Path src/backend/shared/infrastructure` → `False`

**Impacto:** ~42 imports quebrados em 20+ módulos.

**Provável causa:** Refatoração onde `shared/infrastructure/` foi renomeado/deletado mas os módulos não foram atualizados.

### 5.2 🚨 /api/payments e /api/analytics vão crashar em runtime

`/api/payments` (8 services) e `/api/analytics` (1 service) são ROTAS REGISTRADAS que importam caminhos quebrados. Isso quebrará o startup do servidor Express.

### 5.3 🚨 Serviços backend usando ANON KEY

Se os imports de `shared/infrastructure/supabase/client` fossem resolvidos, eles estariam usando o client `supabase` (anon key) para operações backend. Isso significa:
- Operações sujeitas a RLS policies (podem falhar)
- Sem privilégios administrativos (service_role)
- **Potencial risco de segurança** se exposto diretamente

### 5.4 🔶 Duas implementações de BaseRepository

| Origem | Client | Status |
|---|---|---|
| `infra/database/base.repository.ts` | `getBackendClient()` (service_role) | ✅ Funcional |
| `shared/infrastructure/repository/base.repository.ts` | Desconhecido (arquivo não existe) | ❌ Quebrado |

### 5.5 🔶 Industrial usa caminho `@/backend/` que não existe em path aliases do tsconfig

`@/` mapeia para `./src/*`. Portanto `@/backend/shared/...` resolve para `./src/backend/shared/...` que não contém o diretório `infrastructure/`.

---

## 6. Próximas Investigações na Pipeline

1. **Etapa B #04:** Investigar services backend que usam `supabase` (anon key) — mapear exatamente quais operações de escrita/leitura seriam impactadas caso os imports fossem corrigidos para `getBackendClient()`
2. **Etapa B #05:** Cruzar os 7 services rota A (via httpClient) com as 5 funções ausentes detectadas no httpClient
3. **Etapa B #06:** Mapear hooks + providers
4. **Etapa B #07:** Mapear TanStack Router routes vs backend routes registradas
