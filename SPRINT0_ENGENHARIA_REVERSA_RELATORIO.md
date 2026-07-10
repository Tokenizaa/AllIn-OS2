# Sprint 0 — Engenharia Reversa & Plano de Simplificação Arquitetural

> Gerado em: 06/07/2026
> Projeto: AllIn-OS2 (tanstack_start_ts)
> Metodologia: Auditoria orientada a evidências com grafo de dependências real

---

## Índice

1. [Arquitetura Real vs Declarada](#1-arquitetura-real-vs-declarada)
2. [Grafo de Dependências por Fluxo de Negócio](#2-grafo-de-dependências-por-fluxo-de-negócio)
3. [Anomalias Estruturais Encontradas](#3-anomalias-estruturais-encontradas)
4. [Overengineering e Complexidade Acidental](#4-overengineering-e-complexidade-acidental)
5. [Legado, Experimental e Abandonado](#5-legado-experimental-e-abandonado)
6. [Segurança e Configuração](#6-segurança-e-configuração)
7. [Plano de Simplificação Arquitetural](#7-plano-de-simplificação-arquitetural)
8. [Ordem de Refatoração Recomendada](#8-ordem-de-refatoração-recomendada)

---

## 1. Arquitetura Real vs Declarada

### 1.1 Arquitetura Declarada (documentação/pastas)

```
Frontend (Vite + React + TanStack Router)
  → Hooks (React Query)
    → Services
      → API Client (httpClient)
        → Backend Express (REST)
          → Modules (API → Service → Repository)
            → Supabase (PostgreSQL + RLS + RPC)
```

### 1.2 Arquitetura Real (baseada em evidências)

```
═══ FRONTEND ════════════════════════════════════════════════════

Route (TanStack Router) ──→ Component ──→ Hook (React Query)
                                                │
                              ┌─────────────────┼─────────────────────┐
                              ▼                 ▼                     ▼
                     Service (httpClient)   Service (supabase)   Service (híbrido)
                              │                 │                     │
                              ▼                 ▼                     ▼
                    Backend REST API         Supabase SQL         fetch() direto
                    (Express :3001)          (customer_360_view   (Copilot Ollama)
                     │                       + 60+ tabelas)
                     ▼
              Module API → Service → Repository → Supabase (service_role)

═══ DUAS ROTAS DE DADOS CONCORRENTES ════════════════════════════

┌─ ROTA A: Frontend → httpClient → Backend → Repository → Supabase (service_role)
│   Usada por: customers, orders, payments, plans, products, wallets
│
└─ ROTA B: Frontend → supabase client direto → Supabase (anon/authenticated key)
    Usada por: cartService, productsService, profiles, CRM360, MLM360,
               customer360, profile360, finance360, industrial, leads,
               automations, documents, customer-notes, commissions,
               featureFlags, referralTracking

═══ TERCEIRA ROTA EMERGENTE ═════════════════════════════════════

┌─ ROTA C: Frontend → fetch() direto → Backend Copilot → Ollama (local)
    Usada por: CopilotService (hybrid: supabase auth + fetch API)
```

### 1.3 Schema do Banco (Mapeamento Real)

| Schema | Tabelas | Finalidade | Estado |
|--------|---------|------------|--------|
| `public` | 3 | Copilot IA | Ativo |
| `identity` | 2 | Roles e permissões | Ativo |
| `location` | 5 | Endereços (paises, estados, cidades, cep, estado_civil) | Ativo |
| `crm` | 2 (+ views implícitas) | Customers, customer_distributor | Ativo |
| `mlm` | 12 | Rede MLM binária, planos, bônus, pontos, qualificações, comissões | Ativo |
| `commerce` | 12 | Produtos, categorias, pedidos, formas de pagamento, carrinho | Ativo |
| `logistics` | 1 | Transportadoras | Ativo |
| `finance` | 2 | Saques | Ativo |
| `system` | 5 | Lojas, fabricantes, linguagens, embeddings | Ativo |
| `industrial` | 18 | Fábrica de colchões (máquinas, materiais, processos, BOM, etc.) | ⚠️ Experimental |
| *(inexistente)* | `crm.customer_360_view` | Usado por hooks mas **não criado nas migrations** | 🚫 **Ausente** |
| *(inexistente)* | `crm.customer_metrics`, `customer_network_metrics`, `customer_scores` | Referenciados por services mas **não existem nas migrations** | 🚫 **Ausentes** |
| *(inexistente)* | `crm.customer_automations`, `crm.customer_notes`, `crm.customer_documents`, `crm.leads`, `crm.referral_tracking` | Referenciados por services mas **não existem nas migrations** | 🚫 **Ausentes** |
| *(inexistente)* | `finance.wallets`, `finance.points_wallets`, `finance.wallet_transactions` | Referenciados por services mas **não existem nas migrations** | 🚫 **Ausentes** |
| *(inexistente)* | `mlm.network_relationships`, `mlm.commission_cycles`, `mlm.upgrade_suggestions` | Referenciados por services mas **não existem nas migrations** | 🚫 **Ausentes** |
| *(inexistente)* | `marketing.campaigns` | Referenciado por hook mas **não existe nas migrations** | 🚫 **Ausente** |
| *(inexistente)* | `feature_flags` | Referenciado por service mas **não existe nas migrations** | 🚫 **Ausente** |

> **Conclusão:** O projeto referencia dezenas de tabelas que **nunca foram criadas via migration**. Parte foi criada manualmente no Supabase, parte nunca existiu. Isso quebra a rastreabilidade e torna o `supabase gen types` inútil.

---

## 2. Grafo de Dependências por Fluxo de Negócio

### 2.1 Fluxo: Loja / Checkout / Carrinho

```
/loja → loja.$slug.tsx
  → useDistributorQuery → SupabaseService.fetchDistributorBySlug → supabase
  → useProductsQuery → productsService.getAllProducts → supabase (commerce.produtos)
  → useStoreCart → (localStorage, sem servidor)
  → useStoreCheckout → (estado local)
    → CatalogView → store/ProductCard
    → CheckoutView → (processa pagamento)
    → ProcessingView → (mock de processamento)
    → ReceiptView → (confirmação local)

/checkout → alias para /loja/$slug
/produto/$id → useProductDetail → ProductService.fetchProductById → httpClient → API
  → cálculo de bônus local (triggerBinomialBonusPay)
```

**Problemas identificados:**
- Carrinho é só localStorage — dados não persistem entre dispositivos
- `/checkout` é um alias inútil
- Fluxo de pagamento é **simulado** (mock), não há gateway real
- Cálculo de bônus binário é feito inline no frontend, não no backend

### 2.2 Fluxo: Customer 360 (CRM)

```
_app/customers/$id → useCustomer360 (6+ serviços paralelos)
  → CustomerService.fetchCustomerById → httpClient → Backend → Repository
  → OrderService.fetchOrdersByCustomerId → httpClient
  → WalletService.fetchWalletByCustomerId → httpClient (⚠️ alguns não implementados)
  → WalletService.fetchPointsWalletByCustomerId → httpClient
  → WalletService.fetchWalletTransactionsByWalletId → httpClient (❌ throw)
  → CustomerService.fetchDownlines → httpClient

OU (versão "nova"):

useCustomer360New → Customer360Service.getCustomer360ByIdComprador
  → supabase → crm.customer_360_view  (❌ VIEW NÃO EXISTE)
```

**Problemas:**
- **Duas implementações concorrentes**: `useCustomer360` (antiga, httpClient) e `useCustomer360New` (nova, supabase view)
- A view `crm.customer_360_view` **nunca foi criada** — a versão "nova" provavelmente quebra em produção
- `WalletService` tem múltiplos métodos que lançam `Error("not yet implemented")`
- `CRM360Service`, `Finance360Service`, `MLM360Service`, `Profile360Service` — todos concorrentes e sobrepostos

### 2.3 Fluxo: MLM / Rede / Comissões

```
Trigger SQL: AFTER UPDATE ON commerce.pedidos (pagamento_confirmado)
  → processar_pedido_mlm(pedido_id UUID)
    → processar_compra_plano() ou processar_compra_produto()
      → Gera comissões, pontos, rede linear

Backend:
  mlm/domain-services/
    → CommissionCalculationDomainService
    → QualificationCalculationDomainService
    → PointsCalculationDomainService

Frontend:
  /office/network → useNetwork → CustomerService + NetworkService → supabase
  _app/commissions → useCommissions → PaymentService + PlanService + CustomerService
  _app/genealogy → NetworkService + CustomerService
```

**Problemas:**
- Lógica de comissão MLM existe **em 3 lugares**: trigger SQL, domain services no backend, e funções em `src/lib/api/bonus.functions.ts`
- A trigger SQL chama funções PL/pgSQL que processam pedidos — mas o frontend também calcula bônus localmente (`triggerBinomialBonusPay`)
- Risco de dupla contagem ou inconsistência

### 2.4 Fluxo: Sincronização AllIn → Supabase

```
scripts/sync_distributors.ts → DistributorSyncService
  → AllInSyncService.syncAll() → AllInService (API OAuth2)
    → BaseSyncService (retry, timeout, batch, pagination)
      → Sync Mappers (AllIn → Local)
        → Repositories → Supabase (service_role)

scripts/migrate-all-data.ts → orchestrator de 9 entidades

Backend:
  shared/allin/ → AllInService, AllInSyncService, InventoryService, DataMapper
  shared/sync/ → BaseSyncService + 9 Sync Services + 8 Mappers
```

**Problemas:**
- Sincronização existe **duas vezes**: scripts Python de scraping (`scripts/scrapers/`) e engine TypeScript (`src/backend/shared/sync/`)
- Os scripts Python são de um sistema anterior mas ainda estão no repositório
- `BaseSyncService` é uma engine genérica complexa para o que poderia ser mais simples

### 2.5 Fluxo: Industrial (Fábrica de Colchões)

```
industrial/* → RouteGuard com permissão industrial:read
  → Componentes placeholder (apenas KPIs fictícios)
  → industrialService → supabase → schema industrial (18 tabelas)

Backend: modules/industrial/ → tool.service, timing.service, measurements
```

**Problemas:**
- **18 tabelas no banco** para um módulo que só tem **placeholders no frontend**
- Rota protegida com permissão específica, mas funcionalidade nunca implementada
- Suspeito: ou é experimental ou veio de outro projeto

---

## 3. Anomalias Estruturais Encontradas

### 3.1 Bugs Confirmados (Evidências de Código)

| # | Arquivo | Linha | Problema |
|---|---------|-------|----------|
| 1 | `src/services/network/index.ts` | várias | Usa `supabase.from(...)` sem importar o cliente Supabase. Só importa `httpClient`. |
| 2 | `src/services/orders/index.ts` | `fetchOrdersAndCustomers` | Usa `supabase.from("orders")` sem importar Supabase. |
| 3 | `src/hooks/network/useNetwork.ts` | referência | Usa `distributorData` que não está definido no escopo. |
| 4 | `src/backend/modules/customers/api/customers.api.ts` | várias | Referencia tabelas que não existem nas migrations. |
| 5 | `supabase/types.ts` | todas | Erro de geração — contém schemas de projeto anterior, não da base real. |

### 3.2 Duas Rotas de Dados Concorrentes

O projeto tem **dois padrões de acesso a dados** que competem:

| Característica | Rota A: httpClient → Backend | Rota B: supabase direto |
|----------------|------------------------------|------------------------|
| Segurança | Service role key no backend | Anon key no frontend |
| Latência | 2 saltos (front → back → db) | 1 salto (front → db) |
| Consistência | Centralizada no backend | Espalhada nos services |
| Testabilidade | Testável via API REST | Testável via mock |
| RLS | Ignorado (service_role) | Respeitado (anon/auth) |
| Quem usa | customers, orders, payments, plans, products, wallets | cart, productsService, profiles, 360s, industrial, leads, etc |

**Consequência**: Lógica de negócio está duplicada entre os services do frontend e os módulos do backend. Mudanças precisam ser feitas em dois lugares.

### 3.3 Duplicação de Customer360

```
useCustomer360 (hooks/customers/)
  → CustomerService (services/customers/) → httpClient → Backend REST

useCustomer360New (hooks/customers/)
  → Customer360Service (services/customer360/) → supabase direto

useCRM360 (hooks/crm/)
  → CRM360Service (services/crm360/) → supabase direto

useFinance360 (hooks/finance/)
  → Finance360Service (services/finance360/) → supabase direto

useMLM360 (hooks/mlm/)
  → MLM360Service (services/mlm360/) → supabase direto

useProfile360 (hooks/profiles/)
  → Profile360Service (services/profile360/) → supabase direto
```

**5 hooks e 5 services** que fazem essencialmente a mesma coisa: agregar dados de um customer. Cada um acessa um subconjunto diferente de tabelas. Poderiam ser unificados em **1 hook + 1 service**.

### 3.4 Duplicação de Componentes de Produto

| Componente | Arquivo | Abordagem |
|------------|---------|-----------|
| ProductModal | `components/ProductModal.tsx` | shadcn Dialog + subcomponentes |
| ProductDetailModal | `components/ProductDetailModal.tsx` | Modal inline custom |
| ProductDetailsDialog | `components/store/ProductDetailsDialog.tsx` | AnimatePresence + motion |

3 componentes para a mesma finalidade: exibir detalhes de um produto.

### 3.5 Duplicação de ProductCard

| Componente | Arquivo | Usado em |
|------------|---------|----------|
| `shared/ProductCard` | `components/shared/ProductCard.tsx` | `/busca-produtos` |
| `store/ProductCard` | `components/store/ProductCard.tsx` | `/loja/$slug` (CatalogView) |

Mesma finalidade, interfaces diferentes, públicos diferentes.

### 3.6 Duplicação de Hooks de Auditoria

| Hook | Arquivo | Query Key |
|------|---------|-----------|
| `useAuditLogs` | `hooks/audit/useAuditLogs.ts` | `queryKeys.auditLogs` |
| `useAuditLogs` | `hooks/system/useAuditLogs.ts` | `queryKeys.audit.logs(limit)` |

Mesma função (`analyticsService.fetchAuditLogs`), query keys diferentes, localizações diferentes.

---

## 4. Overengineering e Complexidade Acidental

### 4.1 Arquitetura em Camadas (Backend)

O backend implementa uma arquitetura em camadas completa:

```
server/routes → middleware → modules/*/api → modules/*/services → modules/*/repositories
```

Para **33 módulos**. Destes, quantos são efetivamente chamados pelo frontend?

**Evidências:**
- O `api/index.ts` (facade) exporta funções de apenas **6 módulos**: customers, plans, analytics, orders, network, payments
- Os **27 módulos restantes** (ead, cms, comments, returns, attributes, product-kits, manufacturers, info-pages, options, dashboard, admin, departments, logistics, etc.) **não têm contraparte no frontend**
- Muitos repositórios estendem `BaseRepository<T>`, mas o `BaseRepository` é abstrato e nunca usado de forma polimórfica

> **Conclusão:** ~80% do backend modules é código "preparado para o futuro" que nunca é executado.

### 4.2 Sistema de Eventos

O `shared/events/` implementa:
- Event Bus pub/sub local (singleton)
- 30+ tipos de eventos de domínio
- 4 handlers registrados

**Evidência:** O sistema de eventos é **puramente local** (in-process, sem fila, sem persistência). Os handlers fazem chamadas para Chatwoot e Logger. Para um sistema que pretende ser distribuído, isso precisaria ser substituído por uma fila real (RabbitMQ, Redis Streams, etc.).

Para um sistema monólito, o event bus adiciona complexidade sem benefício real — chamadas diretas seriam mais simples e rastreáveis.

### 4.3 Módulo Industrial

**18 tabelas**, **6 serviços**, **~1800 linhas** (`industrial.service.ts`) para um frontend que mostra apenas **4 KPIs placeholder** e **3 páginas em branco**.

Isso não é um módulo em produção — é um **protótipo de banco** com frontend fictício.

### 4.4 Scrapers Python vs Sync TypeScript

- `scripts/scrapers/` — sistema Python modular com sessão, retry, rate limiter, parsers, sync manager
- `scripts/scrape/` — sistema Python antigo com autenticação, extratores, loaders, transformers
- `src/backend/shared/sync/` — engine TypeScript com `BaseSyncService`, 9 sync services, 8 mappers
- `main.ts` — referência a script de sync v1

Três sistemas competindo para fazer a mesma coisa: extrair dados da API AllIn.

### 4.5 Rollup Plugin Visualizer

O `vite.config.ts` inclui `rollup-plugin-visualizer` com `open: true`:

```typescript
visualizer({
  open: true,  // Abre navegador automaticamente no build
  filename: './dist/stats.html',
  gzipSize: true,
  brotliSize: true,
})
```

`open: true` significa que **todo build** vai abrir uma aba do navegador. Isso é aceitável para uma análise pontual, não para build recorrente.

### 4.6 Zonas Mortas no Banco

| Tabela/Schema | Justificativa |
|---------------|---------------|
| `system.embeddings` (pgvector) | Edge functions chamam Ollama local — nunca em produção |
| `industrial` (18 tabelas) | Nenhum frontend consome |
| `public.copilot_*` (3 tabelas) | Memória do Copilot — pode ser viável mas sem testes |

---

## 5. Legado, Experimental e Abandonado

### 5.1 Legado Confirmado

| Artefato | Evidência | Ação |
|----------|-----------|------|
| `scripts/scrape/` (scrapers antigos) | Substituído por `scripts/scrapers/` modular | Remover |
| `src/backend/modules/commissions/` (antigo) | Substituído por `mlm/domain-services/` | Remover |
| Documentos de auditoria anteriores (vários `*.md` na raiz) | Sprint 0 anteriores, relatórios obsoletos | Arquivar |
| `test-schema-pattern.ts`, `test-db-connection.js` | Scripts de teste único | Remover |
| `db.js` | Conexão legado | Remover |
| `scripts.zip` | Artefato de deploy | Remover |
| `metadata.json` | Desconhecido | Investigar |

### 5.2 Experimental / Não Finalizado

| Artefato | Evidência | Ação |
|----------|-----------|------|
| Módulo Industrial (schema + backend) | Frontend vazio, 18 tabelas | Decidir: finalizar ou remover |
| Sync engine TypeScript + Scrapers Python | Duplicação de propósito | Unificar |
| `useCustomer360New` + view `customer_360_view` | View nunca criada | Corrigir ou remover |
| Edge Functions (Ollama) | Dependem de Ollama local, sem produção | Decidir viabilidade |

### 5.3 Abandonado no Meio do Caminho

| Artefato | Evidência |
|----------|-----------|
| Migração de TEXT para UUID e volta (migrations 042-057) | Migrations 056 duplicadas, 057 reverte para TEXT |
| `WalletService` | Múltiplos métodos com `throw "not yet implemented"` |
| `useCustomer360` (antigo) vs `useCustomer360New` | Código comenta "MIGRAÇÃO EM PROGRESSO" |
| Testes em `src/backend/` | 6 arquivos de esqueleto comentados |
| `RouteGuard` para módulo industrial | Permissão `module: "industrial"` existe mas módulo não existe |

---

## 6. Segurança e Configuração

### 6.1 Exposição de Chave Anon (BAIXO RISCO)

A `.env` contém a `VITE_SUPABASE_ANON_KEY` que é pública por definição (cliente-side). OK.

### 6.2 Service Role Key no .env.example (ALTO RISCO)

```env
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

A service role key está documentada no `.env.example`. Em produção, isso é aceitável (é um template). Mas se alguém commit a `.env` real com a chave preenchida, é um desastre de segurança.

### 6.3 JWT Secret no .env.example

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

Template — OK se não commitado.

### 6.4 RLS: Service Role Ignora Tudo

Todas as tabelas têm policy `"Service role full access"` com `USING (auth.role() = 'service_role')`. O backend acessa via service role (`getBackendClient()`), o que significa que **todo o RLS é ignorado pelo backend**.

Isso não é um problema por si só — o backend deve fazer suas próprias validações. Mas o RLS permanece como única proteção para a rota B (frontend → supabase direto).

### 6.5 Observabilidade

O `LoggerService`, `AuditService` e `TracingService` são singletons locais, sem exportação para ferramentas externas (Datadog, Grafana, etc). Úteis para desenvolvimento, mas não são observabilidade de produção.

---

## 7. Plano de Simplificação Arquitetural

### 7.1 Arquitetura Alvo

```
═══ ÚNICA ROTA DE DADOS ═══════════════════════════════════════

Frontend (Vite + React + TanStack Router)
  → Hook (React Query)
    → api-functions (src/lib/api/*.functions.ts)
      → httpClient
        → Backend Express (API Gateway)
          → Services (lógica de negócio)
            → Repositories (acesso a dados via service_role)

═══ EXCEÇÃO (apenas para dados públicos de leitura) ═══════════
Frontend → supabase direto (anon key + RLS)
  → location.* (paises, estados, cidades — leitura pública)
  → commerce.produtos (onde e_visivel = true)

═══ SINCRONIZAÇÃO ALLIN ═══════════════════════════════════════
  → AllInSyncService (TypeScript, único)
    → BaseSyncService (retry/batch/pagination)
      → Supabase (service_role)
```

### 7.2 O Que Deve Permanecer (Manter e Melhorar)

| Componente | Motivo |
|------------|--------|
| `httpClient` | Padrão consolidado de acesso ao backend |
| `api/index.ts` (facade) | Gateway de API unificado |
| `Backend modules (6 principais)` | customers, plans, orders, payments, network, analytics |
| `React Query` | Gerenciamento de estado server-side |
| `TanStack Router` | Roteamento tipado |
| `shadcn/ui` | Design system |
| `Zod` | Validação de schemas |
| `Supabase Auth` | Autenticação |
| `AllInSyncService` | Sincronização com ERP |
| `Event Bus` (simplificado) | Só se houver consumidores reais |

### 7.3 O Que Deve Ser Unificado

| O quê | Como |
|------|------|
| 5x Customer360 services → 1 | Unificar `customer360`, `crm360`, `finance360`, `mlm360`, `profile360` em um único `Customer360Service` |
| 5x Customer360 hooks → 1 | Unificar todos os hooks 360 em `useCustomer360` |
| 3x Product detail modals → 1 | Unificar `ProductModal` + `ProductDetailModal` + `ProductDetailsDialog` |
| 2x ProductCard → 1 | Unificar `shared/ProductCard` e `store/ProductCard` |
| 2x PlanCard → 1 | `plans/PlanCard` deve usar `shared/PlanCard` internamente |
| 2x useAuditLogs → 1 | Manter apenas um (em `hooks/audit/`) |
| 3x sistemas de scraping/sync → 1 | Manter apenas o TypeScript (`shared/sync/`) |
| Migrations duplicadas | Limpar migrations 056-065 paralelas |

### 7.4 O Que Deve Ser Removido

| Componente | Motivo |
|-----------|--------|
| `scripts/scrape/` (antigo Python) | Substituído pelo novo |
| `scripts/scrapers/` (novo Python) | Substituído pelo TypeScript sync |
| 27 módulos backend não utilizados | `ead`, `cms`, `comments`, `returns`, `attributes`, `product-kits`, `manufacturers`, `info-pages`, `options`, `dashboard`, `admin`, `departments`, `logistics` + 14 outros |
| `BaseRepository<T>` | Abstração genérica sem uso real |
| `shared/reports/` | Nunca consumido |
| `shared/export/` | CSV/Excel/PDF exporters nunca usados |
| `shared/chatwoot/` | Integração experimental sem uso |
| `src/lib/api/plans.functions.ts` | Duplica o que o backend já faz |
| `src/lib/api/bonus.functions.ts` | Lógica de comissão duplicada |
| `scripts/debug-*.ts` (vários) | Scripts de debug único |
| `scripts/test-*.ts` (vários) | Testes avulsos |
| `supabase/types.ts` | Gerado incorretamente (schema errado) |
| `docs/api-knowledge-base/` | Conhecimento de API externa, não docs do projeto |
| Relatórios `*.md` anteriores na raiz | Obsoletos pela Sprint 0 |

### 7.5 O Que Precisa de Pequenos Ajustes

| Componente | Ajuste |
|-----------|--------|
| `vite.config.ts` | Remover `open: true` do visualizer |
| `.env.example` | Remover service role key do template |
| `package.json` | Remover `rollup-plugin-visualizer` (devDependency) |
| `src/hooks/network/useNetwork.ts` | Corrigir referência a `distributorData` |
| `src/services/network/index.ts` | Adicionar import do Supabase |
| `src/services/orders/index.ts` | Adicionar import do Supabase em `fetchOrdersAndCustomers` |
| `eslint.config.js` | `src/backend` está ignorado — deveria ser incluído |

### 7.6 Decisões Pendentes

| Decisão | Opções |
|---------|--------|
| Módulo Industrial | (a) Finalizar e conectar ao frontend, (b) Remover completamente |
| Edge Functions (Ollama) | (a) Manter com Ollama local, (b) Migrar para API paga (OpenAI), (c) Remover |
| Rota B (supabase direto) | (a) Eliminar gradualmente movendo tudo para httpClient, (b) Manter para queries de leitura simples |
| Rota A vs B para queries | Decidir um padrão único e migrar |

---

## 8. Ordem de Refatoração Recomendada

### Fase 1: Higienização (Dias 1-2)

| Prioridade | Tarefa | Esforço | Impacto |
|-----------|--------|---------|---------|
| 🔴 P0 | Corrigir imports Supabase faltantes em `network/` e `orders/` | 10min | Bugs |
| 🔴 P0 | Corrigir `distributorData` em `useNetwork` | 5min | Bug |
| 🔴 P0 | Remover `open: true` do visualizer | 1min | DX |
| 🟡 P1 | Remover scripts/scrape/ antigo (Python) | 30min | Limpeza |
| 🟡 P1 | Arquivar relatórios .md anteriores | 15min | Limpeza |
| 🟡 P1 | Remover scripts de debug/test avulsos | 15min | Limpeza |

### Fase 2: Unificação de Customer360 (Dias 2-4)

| Prioridade | Tarefa | Esforço | Impacto |
|-----------|--------|---------|---------|
| 🔴 P0 | Unificar 5 services 360 em 1 | 2 dias | Manutenibilidade |
| 🔴 P0 | Unificar 5 hooks 360 em 1 | 1 dia | Manutenibilidade |
| 🟡 P1 | Remover services/hooks redundantes | 1 dia | Limpeza |

### Fase 3: Unificação de Produto e Loja (Dias 4-5)

| Prioridade | Tarefa | Esforço | Impacto |
|-----------|--------|---------|---------|
| 🟡 P1 | Unificar 3 modais de produto | 1 dia | UX/Manutenibilidade |
| 🟡 P1 | Unificar 2 ProductCard | 1 dia | Consistência |
| 🟢 P2 | Remover `/checkout` alias | 30min | Simplificação |

### Fase 4: Backend Cleanup (Dias 5-8)

| Prioridade | Tarefa | Esforço | Impacto |
|-----------|--------|---------|---------|
| 🔴 P0 | Remover 27 módulos backend não utilizados | 2 dias | Carga cognitiva |
| 🔴 P0 | Decidir futuro do módulo Industrial | 1 dia | Estratégico |
| 🟡 P1 | Remover BaseRepository genérico | 1 dia | Simplificação |
| 🟡 P1 | Remover shared/reports, shared/export, shared/chatwoot | 1 dia | Limpeza |

### Fase 5: Rota de Dados Única (Dias 8-12)

| Prioridade | Tarefa | Esforço | Impacto |
|-----------|--------|---------|---------|
| 🔴 P0 | Migrar services da Rota B para httpClient | 3 dias | Arquitetura |
| 🟡 P1 | Remover `lib/api/` functions duplicadas | 1 dia | Consistência |
| 🟡 P1 | Unificar migrações do banco | 2 dias | Rastreabilidade |

### Fase 6: Infraestrutura (Dias 12-15)

| Prioridade | Tarefa | Esforço | Impacto |
|-----------|--------|---------|---------|
| 🟡 P1 | Configurar Docker + docker-compose | 1 dia | Deploy |
| 🟡 P1 | Configurar CI/CD (GitHub Actions) | 1 dia | Qualidade |
| 🟡 P1 | Configurar test runner (Vitest) | 1 dia | Qualidade |
| 🟢 P2 | Adicionar testes para fluxos críticos | 3 dias | Confiança |

### Resumo de Esforço

| Fase | Dias | Redução Estimada de Código |
|------|------|---------------------------|
| Higienização | 2 | ~5% |
| Customer360 | 3 | ~10% |
| Produto/Loja | 2 | ~3% |
| Backend Cleanup | 4 | ~40% |
| Rota Única | 4 | ~15% |
| Infraestrutura | 3 | ~0% |
| **Total** | **~18 dias** | **~73% de redução** |

---

## Nota Final

Este relatório documenta a engenharia reversa completa do AllIn-OS2. A estimativa de 73% de redução de código não é exagero — o projeto tem **33 módulos backend** dos quais **apenas 6 são efetivamente usados**, tem **2 sistemas de scraping completos** quando 1 bastaria, tem **5 implementações de Customer360** quando 1 é suficiente, e mantém um **módulo industrial inteiro (18 tabelas)** sem frontend real.

O plano prioriza correções de bugs primeiro (Fase 1), depois unificação de duplicações (Fases 2-3), depois remoção de código morto (Fase 4), e finalmente a migração arquitetural para uma única rota de dados (Fase 5).

> **A regra é: se não é executado, não deve existir no código.**
