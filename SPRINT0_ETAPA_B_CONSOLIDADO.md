# Sprint 0 — Etapa B: Engenharia Reversa — Relatório Consolidado

> **Metodologia:** 4 etapas — Descoberta (A) → Engenharia Reversa (B) → Simplificação (C) → Consolidação (D)
> **Status da Etapa B:** ✅ Completa
> **Próximo:** Etapa C — Simplificação

---

## Sumário Executivo

| Métrica | Valor |
|---------|-------|
| Artefatos investigados | httpClient, supabase/client, BaseRepository, 7 services, 60 hooks, 7 providers, 47 rotas frontend, 33 módulos backend, 25+ routes backend |
| Documentos gerados | 6 (B #01 a B #06) |
| Bugs fatais encontrados | **7** (crash em runtime) |
| Imports quebrados | **42+** em 20+ módulos backend |
| Endpoints 404 | **25** (frontend chama, backend não tem) |
| Módulos dormentes | **14+** (backend, sem rota HTTP) |
| Segurança: anon key em backend | **7** repositórios |
| Arquivos com import faltando | **3** (`supabase` não importado) |
| Rotas backend sem consumidor | **4** (`/api/distributors/*`) |

---

## 🚨 Categoria Fatal — Crash em Runtime

### F-01: 5 funções `*Api` inexistentes
- **Onde:** `src/lib/api/plans.functions.ts` (4) e `src/lib/api/bonus.functions.ts` (1)
- **Funções:** `getPlansApi`, `getCustomerPlansApi`, `deactivateCustomerPlanApi`, `getPlanStatsApi`, `getActiveCustomerPlanApi`
- **Impacto:** ReferenceError se qualquer hook que chama estas funções for montado
- **Padrão:** `<nome>Api` — evidência de refatoração incompleta

### F-02: `orders/index.ts` usa `supabase` sem import
- **Onde:** `src/services/orders/index.ts` (linhas 42-44), função `fetchOrdersAndCustomers`
- **Impacto:** ReferenceError: `supabase is not defined`

### F-03: `network/index.ts` usa `supabase` sem import (4 funções)
- **Onde:** `src/services/network/index.ts` (linhas 10, 20, 30, 40)
- **Funções:** `fetchRecentNetworkRelationships`, `fetchSponsorRelationship`, `fetchUplineRelationships`, `countDirectRelationships`
- **Impacto:** ReferenceError se qualquer uma for chamada

### F-04: `useNetwork.ts` — `distributorData` não definido
- **Onde:** `src/hooks/network/useNetwork.ts:20`
- **Problema:** Deveria ser `customerData`
- **Impacto:** ReferenceError

### F-05: `bonus.functions.ts` — `activePlan` não definido + `getActiveCustomerPlanApi` inexistente
- **Onde:** `src/lib/api/bonus.functions.ts:80-85`
- **Problema 1:** `getActiveCustomerPlanApi` não existe
- **Problema 2:** `activePlan.plan_id` — `activePlan` nunca declarado (deveria ser `activePlanResult.data.plan_id`)
- **Impacto:** ReferenceError duplo

### F-06: `/api/payments` vai crashar no startup do servidor
- **Onde:** `src/backend/modules/payments/services/` (8 arquivos)
- **Problema:** Todos importam de `../../../shared/infrastructure/supabase/client` — diretório não existe
- **Rota registrada:** Sim — em `server/index.ts` — **crashará o startup**

### F-07: `/api/analytics` vai crashar no startup do servidor
- **Onde:** `src/backend/modules/analytics/services/analytics-update.service.ts`
- **Problema:** Import de `../../../shared/infrastructure/supabase/client` — não existe
- **Rota registrada:** Sim — **crashará o startup**

---

## 🔶 Categoria Grave — Funcionalidade Impactada

### G-01: 25 endpoints httpClient sem rota backend (404)
- **Produtos:** `GET /api/products`, `GET /api/products/:id`, `GET /api/products/stores`
- **Wallets:** 10 endpoints (`/api/wallets/*`)
- **MLM:** `POST /api/mlm/simulate`
- **Customers sub:** 7 endpoints (`/api/customers/*` extras)
- **Orders sub:** 4 endpoints (`/api/orders/*` extras)
- **Impacto:** 404 em produção para qualquer página que tente carregar estes dados via httpClient

### G-02: `shared/infrastructure/` não existe — 42 imports quebrados
- **20+ módulos backend** com imports quebrados:
  - `payments/` (8 services) — **rota registrada** → crasha
  - `analytics/` (1 service) — **rota registrada** → crasha
  - `industrial/` (14 repositories) — dormente
  - `commissions/`, `stores/`, `logistics/`, `cms/`, `inventory/`, `qualifications/`, `admin/`, `ead/`, `products/`, `dashboard/`, `finance/`, `embeddings/`, `orders/custom-field/` — dormentes
- **Três caminhos quebrados diferentes:**
  - `../../../shared/infrastructure/supabase/client` (19 arquivos)
  - `../../../shared/infrastructure/repository/base.repository` (17 arquivos)
  - `../../../shared/infra/database/supabase` (3 arquivos)
  - `@/backend/shared/infrastructure/repository/base.repository` (14 industrial)

### G-03: 7 repositórios industriais usando ANON KEY no backend
- `timing-measurements`, `machine-maintenance`, `process-steps`, `process-documents`, `machine-photos`, `machine-documents`, `capacity-history`
- **Risco:** Operações CRUD usando chave anônima → sujeitas a RLS → podem falhar com 403
- **Deveriam usar:** `getBackendClient()` (service_role) como os demais

### G-04: AuthProvider expõe 3 métodos stub que lançam erro
- `updateDistributorProfile`, `clearSponsor`, `activateDistributorOffice`
- **Impacto:** Qualquer componente legado que chame estes métodos via `useAuth()` quebra

---

## 🔧 Categoria Moderada — Dívida Técnica

### D-01: Duas implementações de BaseRepository
| Origem | Client | Status |
|--------|--------|--------|
| `infra/database/base.repository.ts` | `getBackendClient()` (service_role) | ✅ Funcional (20 módulos) |
| `shared/infrastructure/repository/base.repository.ts` | ??? (arquivo não existe) | ❌ Quebrado (17 módulos) |

**Evidência de refatoração incompleta:** O antigo `shared/infrastructure/` foi removido mas os módulos não foram migrados.

### D-02: Duplicação wallet functions (3 arquivos)
- `src/lib/api/wallet.functions.ts`
- `src/lib/api/bonus-wallet.functions.ts`
- `src/lib/api/points-wallet.functions.ts`
- `bonus-wallet.functions.ts` chama `getPointsWalletBalance` (função errada) — erro de cópia
- `bonus.functions.ts` ainda tem MLM commission logic no frontend

### D-03: Barrel `@/lib/api-client/index.ts` nunca importado
- Exporta `httpClient` mas ninguém usa — todos importam diretamente de `/http-client`

### D-04: 14+ módulos backend não registrados (código dormente)
Módulos com API files mas sem rota HTTP: industrial, stores, cms, admin, ead, dashboard, abandoned-carts, attributes, comments, copilot, departments, info-pages, manufacturers, options, product-kits, returns

### D-05: `/api/distributors` — rota sem consumidor frontend
Backend tem rota completa de distribuidores (GET /, GET /stats, GET /usuario/:usuario, GET /:id) mas o frontend nunca chama via httpClient.

### D-06: Duplicação de padrão service (services vs lib/api)
- `services/*/index.ts` — wrappers sobre httpClient
- `lib/api/*.functions.ts` — funções que também chamam httpClient (ou supabase direto)
- MESMA responsabilidade, implementações diferentes

### D-07: 4 métodos payments service idênticos
`fetchPaymentsForDashboard`, `fetchRecentPayments`, `fetchPaymentsForCommissions`, `fetchPaymentsForReports` — todos chamam `httpClient.getPayments()` com apenas `limit` diferente (300, 5, 18, 500)

---

## 📝 Observações Adicionais

1. **auth.service.ts** frontend está em `src/modules/auth/services/` (não em `src/services/`) — não usa httpClient, usa supabase.auth direto
2. **Projeto não tem `src/providers/`** — providers espalhados em 4 diretórios (contexts, components, lib, modules/auth/context)
3. **Nenhum hook importa** de caminhos quebrados (só backend tem esse problema)
4. **7 services frontend** usam httpClient com ~22 hooks e dezenas de componentes dependentes
5. **Task check-in:** Nenhum hook ou componente importa de caminhos quebrados

---

## Lições Aprendidas

1. **Refatoração com 2 padrões simultâneos = disaster:** O projeto tem evidência clara de uma migração de `shared/infrastructure/` para `infra/database/` e `@/lib/supabase/client` que nunca foi concluída. Metade dos módulos foram atualizados, metade não.
2. **Endpoints sem backend = falsa sensação de funcionalidade:** O frontend chama felizmente 25 endpoints que retornam 404. Usuários veem telas vazias sem erro visível.
3. **Código dormente não é inofensivo:** Módulos backend não registrados têm imports quebrados — se alguém tentar registrar, não funciona.
4. **Singletons anon key em backend:** 7 repositórios backend usam `supabase` (anon key exportado como singleton do módulo `@/lib/supabase/client`) — isso passou despercebido por usar o mesmo import path que o frontend
