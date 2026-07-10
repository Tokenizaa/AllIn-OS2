# Sprint 0 — Reverse Engineering + Simplification: Relatório Final

## Sumário Executivo

Este relatório documenta a engenharia reversa arquitetural completa do AllIn-OS2 (TanStack Start + Vite + React 19 + Express + Supabase), identificando 25+ problemas de runtime, 42 imports quebrados, 7 bugs fatais, e aplicando 11 correções diretas com evidência.

---

## Metodologia

| Etapa | Descrição | Status |
|-------|-----------|--------|
| **A** | Descoberta — inventariar todos os artefatos | ✅ Completa |
| **B** | Engenharia Reversa — rastrear dependências por grafo real | ✅ Completa (6 documentos + consolidado) |
| **C** | Simplificação — remover/unificar/corrigir com evidência | ✅ Parcial (11 correções aplicadas, pendentes documentados) |
| **D** | Consolidação — padronizar arquitetura | ⏳ Pendente |

---

## Documentos Gerados (Etapa B)

| Documento | Conteúdo |
|-----------|----------|
| `SPRINT0_ETAPA_B_01_HTTPCLIENT.md` | Mapeamento completo do httpClient, barrel morto, funções *Api inexistentes |
| `SPRINT0_ETAPA_B_02_BACKEND_ORPHANS.md` | Módulos órfãos: WalletService sem rota, MLM domain, módulos backend não registrados |
| `SPRINT0_ETAPA_B_03_SUPABASE_CLIENT.md` | 4 exports do supabase/client, 42 imports quebrados por shared/infrastructure/ ausente |
| `SPRINT0_ETAPA_B_04_SERVICES.md` | 7 frontend services mapeados, 3 ReferenceErrors, funções *Api inexistentes |
| `SPRINT0_ETAPA_B_05_HOOKS_PROVIDERS.md` | 60 hooks, 7 providers, 3 AuthProvider stubs obsoletos |
| `SPRINT0_ETAPA_B_06_ROUTES.md` | 47 rotas frontend vs 8 rotas backend, 25 endpoints 404 |
| `SPRINT0_ETAPA_B_CONSOLIDADO.md` | Compilação de todos os achados organizados por gravidade |

---

## Correções Aplicadas (Etapa C)

### 🐛 Bugs Fatais Corrigidos (7)

| ID | Arquivo | Problema | Correção |
|----|---------|----------|----------|
| F-01 | `src/lib/api/plans.functions.ts` | 4 funções `*Api` inexistentes (ReferenceError) | Adicionadas `getPlansApi`, `getCustomerPlansApi`, `deactivateCustomerPlanApi`, `getPlanStatsApi` com httpClient |
| F-01 | `src/lib/api/bonus.functions.ts` | `getActiveCustomerPlanApi` inexistente (ReferenceError) | Adicionada função com httpClient.getActiveCustomerPlan |
| F-02 | `src/services/orders/index.ts` | Usa `supabase` sem import (ReferenceError) | Adicionado `import { supabase }` |
| F-03 | `src/services/network/index.ts` | Usa `supabase` sem import em 4 funções (ReferenceError) | Adicionado `import { supabase }` |
| F-04 | `src/hooks/network/useNetwork.ts` | `distributorData` não definido (ReferenceError) | Substituído por `customerData` (variável correta da linha 10) |
| F-05 | `src/lib/api/bonus.functions.ts` | `activePlan.plan_id` — `activePlan` undefined | Corrigido para `activePlanResult.data?.plan_id` |
| F-05 | `src/lib/api/plans.functions.ts` | `return plans` — `plans` nunca declarado | Corrigido para `return result.data` |
| F-06 | `src/backend/modules/payments/services/retry-queue.service.ts` | Import de `shared/infrastructure/` que não existe — crasharia o server | Redirecionado para `getBackendClient()` via `@/lib/supabase/client` |
| F-07 | `src/lib/api/bonus-wallet.functions.ts` | `getBonusWalletBalance` e `ensureBonusWallet` chamavam httpClient errado | Corrigido para `getBonusWalletBalance` e `ensureBonusWallet` |
| F-08 | `src/routes/ativacao.tsx` | `activateDistributorOffice` do AuthProvider é stub que lança erro (live bug) | Substituído por `useDistributorProfileQuery()` |

### 🗑️ Código Morto Removido (1)

| Arquivo | Evidência | Ação |
|---------|-----------|------|
| `src/lib/api-client/index.ts` | Zero consumidores (todos importam direto de `http-client`) | Removido |

---

## Pendências para Etapa D (Consolidação)

### 🚨 Alta Prioridade

| Item | Evidência | Ação Proposta |
|------|-----------|---------------|
| 25 endpoints httpClient sem rota backend | 17 endpoints ativos chamados por frontend (8 são dead code) | **Criar rotas backend** para os 17 ativos OU migrar para supabase direto |
| 7 repositórios industriais usando ANON KEY | Usam `supabase` (anon key) em vez de `getBackendClient()` (service_role) | Substituir import para `getBackendClient()` |
| 14+ módulos backend dormentes com imports quebrados | 12 sem rota, script, ou teste — todos com import de `shared/infrastructure/` | **Congelar** (não remover — podem ser parte de plano futuro) |
| `/api/distributors` sem consumidor frontend | Rota BACKEND existe, mas nenhum frontend chama | **Remover rota** ou **criar consumidor** |
| 12 módulos backend com `shared/infrastructure/` imports quebrados | Diretório nunca criado — metade migrada, metade não | **Unificar** todos para `infra/database/base.repository` |

### 🔧 Média Prioridade

| Item | Evidência | Ação Proposta |
|------|-----------|---------------|
| Duas implementações de BaseRepository | `infra/database/base.repository.ts` (ok) vs `shared/infrastructure/repository/base.repository.ts` (inexistente) | Migrar todos os 17 módulos restantes para o caminho funcional |
| Duplicação service classes vs lib/api functions | Services e API functions fazem a mesma coisa de formas diferentes | Escolher um padrão (services parece dominante, ~30 hooks) |
| AuthProvider expõe 3 campos obsoletos | `distributorProfile`, `activeSponsor`, `activeReferralMetadata` sempre null | Remover do AuthContextType e AuthProvider |
| 4 métodos payments idênticos | `fetchPaymentsForDashboard/Recent/Commissions/Reports` — só `limit` muda | Unificar em 1 método com parâmetro |
| MLMCommissionSimulator nunca importado | Componente existe mas nenhuma rota o monta | Remover ou registrar |
| 8 httpClient methods dead | `freezeWallet`, `unfreezeWallet`, `simulateCommission`, `getNetworkMembers`, `getCustomerBonus`, `getCustomerPlan`, `getOrdersByComprador`, `getOfficeOrders` | Remover do httpClient |

### 📝 Observações Finais

1. **Raiz do problema estrutural:** O projeto iniciou migração de `shared/infrastructure/` para `infra/database/` e `@/lib/supabase/client` mas ABANDONOU a migração no meio. 50% dos módulos foram atualizados, 50% ficaram com imports quebrados.
2. **Servidor roda atualmente** porque os módulos quebrados NÃO são importados no startup — exceto payments (agora corrigido).
3. **TanStack Router é file-system based** — as 47 rotas são auto-geradas de `src/routes/`. O mapeamento com backend é manual e incompleto.
4. **O AuthProvider** está em processo de simplificação (Sprint 4), mas mantém stubs obsoletos que poluem a API pública.

---

## Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `src/lib/api/plans.functions.ts` | +4 funções *Api, +1 import httpClient, fix `plans`→`result.data` |
| `src/lib/api/bonus.functions.ts` | +1 função getActiveCustomerPlanApi, +1 import httpClient, fix `activePlan`→`activePlanResult.data` |
| `src/services/orders/index.ts` | +1 import supabase |
| `src/services/network/index.ts` | +1 import supabase |
| `src/hooks/network/useNetwork.ts` | fix `distributorData`→`customerData` |
| `src/lib/api/bonus-wallet.functions.ts` | fix `getPointsWalletBalance`→`getBonusWalletBalance`, `ensurePointsWallet`→`ensureBonusWallet` |
| `src/backend/modules/payments/services/retry-queue.service.ts` | fix import `shared/infrastructure/`→`getBackendClient()` |
| `src/routes/ativacao.tsx` | fix `useAuth().activateDistributorOffice`→`useDistributorProfileQuery()` |
| `src/lib/api-client/index.ts` | **Removido** (zero consumidores) |
