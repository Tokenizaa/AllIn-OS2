# Arquitetura Alvo — AllIn-OS2

> **Propósito deste documento**: Definir a arquitetura única e consolidada para a qual todo o
> código do AllIn-OS2 deve convergir. Serve como guia normativo para todos os sprints de
> refatoração futuros.
>
> **Status**: Sprint 1 — Documento Oficial de Arquitetura Alvo
>
> **Última atualização**: Julho 2026

---

## Stack Oficial

| Camada | Tecnologia | Versão Mínima | Justificativa |
|---|---|---|---|
| **Framework Frontend** | React | ^19.2.0 | Ecossistema maduro, suporte a Server Components futuro |
| **Linguagem** | TypeScript | ^5.8.3 | Type safety em toda a aplicação |
| **Bundler / Dev Server** | Vite | ^7.3.1 | Build rápido, HMR nativo, plugin Tailwind 4 |
| **Roteamento** | TanStack Router | ^1.168.25 | Type-safe, nested layouts, loaders, suporte a lazy loading |
| **Data Fetching & Cache** | TanStack Query (React Query) | ^5.83.0 | Cache declarativo, deduplicação de requisições, stale-while-revalidate |
| **Backend HTTP** | Express | ^5.2.1 | Maduro, leve, vasta gama de middlewares |
| **Database / Backend** | Supabase | JS client ^2.106.2 | Database gerenciado, auth embutido, RLS, realtime |
| **Estilização** | Tailwind CSS 4 | ^4.2.1 | Utility-first, suporta CSS nativo (oklch, @theme) |
| **Componentes Base** | Radix UI | 1.x | Headless, acessível, composição via slots |
| **Validação** | Zod | ^3.24.2 | Schemas compartilháveis frontend/backend |
| **Formulários** | React Hook Form | ^7.71.2 | Performático, integrado com Zod via resolvers |
| **Gráficos** | Recharts | ^2.15.4 | Componentes React, responsivo, customizável |
| **Animações** | Framer Motion | ^12.40.0 | Declarativo, suporte a gestos e layout animations |
| **Notificações** | Sonner | ^2.0.7 | Leve, acessível, suporte a toast |
| **Ícones** | Lucide React | ^0.575.0 | Conjunto completo, tree-shakeable |
| **Gerenciamento de Estado** | TanStack Query (server state) + Context (UI state) | — | Sem biblioteca de estado global (Redux/Zustand) |
| **Linter** | ESLint Flat Config | ^9.32.0 | Configuração moderna, plugins React e Hooks |
| **Formatador** | Prettier | ^3.7.3 | Formatação consistente obrigatória |

---

## Diagrama de Fluxo

`
+----------------------------+     +------------------+     +-------------------+
|  Route (TanStack Router)   |---->|  Loader / Hook   |---->|  Service (camada  |
|  /office/orders            |     |  useQuery(       |     |  de acesso dados) |
|                            |     |    queryKey,     |     |  supabase.from()  |
|                            |     |    queryFn)      |     |  .select()        |
+----------------------------+     +------------------+     +--------+----------+
                                                                     |
                                                                     v
+----------------------------+     +------------------+     +--------+----------+
|  Component (React+Tailwind)|<----|  TanStack Query  |<----|  Supabase Client  |
|  {data, isLoading, error}  |     |  Cache (staleTime |     |  (ANON_KEY + RLS) |
|                            |     |   = 5 min)        |     |                   |
+----------------------------+     +------------------+     +--------+----------+
                                                                     |
                                                              +------v--------+
                                                              |   SUPABASE    |
                                                              |  (Database,   |
                                                              |   Auth, RLS,  |
                                                              |   Realtime)   |
                                                              +------+--------+
                                                                     |
                                  +----------------------------------+
                                  |
                     +------------v------------+
                     |   EXPRESS BACKEND        |
                     |   (SERVICE_ROLE_KEY)     |
                     |                          |
                     |  • Webhooks              |
                     |  • Admin operations      |
                     |  • Email                 |
                     |  • MLM pesado            |
                     |  • Integração AllIn API  |
                     +-------------------------+
`

**Fluxo padrão de dados (leitura):**
1. Rota TanStack chama um **Loader** ou um **Custom Hook**
2. Hook usa useQuery do TanStack Query com queryKey tipada e queryFn
3. queryFn chama um **Service** localizado em src/services/<dominio>/
4. Service faz a requisição ao **Supabase** via supabase.from(...).select(...)
5. Retorno passa pelo TanStack Query (cache, staleTime, retry)
6. Componente consome o dado com { data, isLoading, error }

**Fluxo padrão de dados (escrita/mutação):**
1. Componente chama useMutation do TanStack Query
2. Mutation chama um método do Service (insert/update/delete)
3. Após sucesso, invalida queries relacionadas via invalidateQueries
4. Componente re-renderiza com dados atualizados

---

## Padrões Aprovados

### 1. TanStack Query para todo server state

**USAR** useQuery e useMutation para qualquer dado vindo do Supabase.

`	ypescript
// Correto — Hook com TanStack Query
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { CustomerService } from "@/services/customers";

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: () => CustomerService.fetchCustomersList(),
  });
}
`

`	ypescript
// Correto — Mutação com invalidação
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateCustomerQueries } from "@/hooks/queryInvalidation";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string }) => CustomerService.updateCustomer(data.id, data),
    onSuccess: (_data, variables) => {
      invalidateCustomerQueries(queryClient, variables.id);
    },
  });
}
`

### 2. Query keys centralizadas e tipadas

**USAR** o arquivo src/hooks/queryKeys.ts como única fonte de chaves de cache.
**USAR** src/hooks/queryInvalidation.ts para funções de invalidação agrupadas.

### 3. Services como funções puras de acesso a dados

**USAR** src/services/<dominio>/index.ts com export nomeado {Dominio}Service.
Service **NUNCA** deve importar hooks, contexto ou estado React.
Service **SEMPRE** retorna Promise com dado tipado.

`	ypescript
// Correto — Service puro
import { supabase } from "@/lib/supabase/client";

export const OrderService = {
  async fetchOrdersForDashboard() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .limit(300)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
};
`

### 4. Hooks como thin wrappers do TanStack Query

**USAR** hooks em src/hooks/<dominio>/ que apenas envolvem useQuery/useMutation.
Hooks podem transformar dados (mapping) ou combinar múltiplas queries.
Hooks **NÃO** devem conter lógica de acesso a dados diretamente.

`	ypescript
// Correto — Hook é thin wrapper
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: () => CustomerService.fetchCustomerById(id),
    enabled: !!id,
  });
}
`

### 5. Loaders do TanStack Router para data preloading

**USAR** eforeLoad ou loader nas rotas para buscar dados críticos antes da renderização.
Loaders devem chamar diretamente os Services (não hooks).
Loaders podem usar queryClient.fetchQuery para popular o cache.

`	ypescript
// Correto — Loader de rota
import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/lib/react-query/client";
import { ProductService } from "@/services/products";

export const Route = createFileRoute("/produto/")({
  loader: async ({ params }) => {
    await queryClient.fetchQuery({
      queryKey: ["products", params.id],
      queryFn: () => ProductService.fetchProductById(params.id),
    });
  },
  component: ProductDetailPage,
});
`

### 6. Schemas compartilhados em src/shared/types/

**USAR** src/shared/types/ para tipos e enums usados por frontend e backend.
Enums oficiais de roles, permissões, status ficam aqui.

### 7. Components como pasta plana ou agrupada por domínio

**USAR** src/components/<dominio>/ para componentes de domínio.
**USAR** src/components/ui/ para componentes base (shadcn/ui style).
**USAR** src/components/shared/ para componentes reutilizáveis entre domínios.

### 8. Utilitários em src/lib/

**USAR** src/lib/supabase/client.ts como única fonte do cliente Supabase.
**USAR** src/lib/react-query/client.ts para configuração do TanStack Query.
**USAR** src/lib/utils.ts para funções utilitárias genéricas (ex: cn()).
**USAR** src/config/env.ts para validação de variáveis de ambiente.

---

## Padrões Removidos

Estes padrões **NÃO** devem mais ser usados. Código existente deve ser migrado nos próximos sprints.

### useEffect + useState para data fetching

**REMOVIDO** — Não use useEffect para buscar dados.
**Substituir por**: useQuery do TanStack Query.

### Context API para server state

**REMOVIDO** — Context API não deve transportar dados do servidor.
**Substituir por**: TanStack Query + Context APENAS para UI state (sidebar aberta/fechada, modal ativo).

### httpClient / ApiClient legado (src/api/client.ts)

**REMOVIDO** — ApiClient para AllIn API legada.
**Substituir por**: Chamadas diretas ao Supabase via Services.

### Flat services soltos em src/services/*.ts

**REMOVIDO** — services como arquivo solto (ex: productsService.ts).
**Substituir por**: Service dentro de src/services/<dominio>/index.ts.

### Funções soltas em src/lib/api/

**REMOVIDO** — Funções avulsas em lib/api/ (ex: getWalletBalance).
**Substituir por**: Métodos no Service correspondente (WalletService.fetchWalletBalance).

### Distribuidor via Context API (src/lib/distributor-context.tsx)

**REMOVIDO** — DistributorProvider será removido.
**Substituir por**: Hook useDistributorQuery em src/hooks/distributor/ usando TanStack Query.

### Backend Express como proxy de dados

**Substituir por**: Express backend serve apenas para operações que exigem SERVICE_ROLE_KEY.

### Duplicação de definição de tipos entre frontend e backend

**Substituir por**: Tipos compartilhados em src/shared/types/.

---

## Estrutura Final de Pastas

Abaixo está a estrutura **alvo** para a qual todo o código deve convergir.
Pastas marcadas com (!) existem hoje mas precisam de ajustes.
Pastas marcadas com (!!) precisam ser migradas para o padrão.

`
src/
├── main.tsx                          # Entry point (RouterProvider)
├── router.tsx                        # Config TanStack Router
├── routeTree.gen.ts                  # Gerado automaticamente
├── styles.css                        # Globais + Tailwind
│
├── config/
│   └── env.ts                        # Validação de env vars
│
├── lib/                              # Infraestrutura
│   ├── supabase/
│   │   ├── client.ts                 # Frontend + Backend factories
│   │   └── index.ts
│   ├── react-query/
│   │   └── client.ts                 # QueryClient + cacheKeys
│   ├── utils.ts                      # cn() e utilidades
│   ├── network-resilience.ts
│   ├── error-capture.ts
│   └── api/                          # (!!) REMOVER
│
├── shared/                           # Código frontend/backend
│   ├── types/
│   │   ├── roles.ts                  # UserRole enum
│   │   └── ...
│   └── config/
│
├── types/
│   ├── products.ts
│   └── ...
│
├── routes/                           # TanStack Router (file-based)
│   ├── __root.tsx                    # Root layout + providers
│   ├── _app.tsx                      # App layout
│   ├── _app/
│   ├── index.tsx
│   ├── login.tsx
│   ├── cadastro.tsx
│   ├── office.tsx
│   ├── office/
│   │   ├── index.tsx
│   │   ├── Dashboard.tsx
│   │   ├── orders.tsx
│   │   ├── network.tsx
│   │   └── ...
│   ├── loja..tsx
│   └── ...
│
├── components/
│   ├── ui/                           # 44 Radix components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── shared/
│   │   ├── ErrorDisplay.tsx
│   │   └── ...
│   ├── app/
│   ├── auth/
│   ├── customers/
│   ├── distributor/
│   ├── orders/
│   ├── products/
│   ├── payments/
│   ├── network/
│   ├── features/
│   ├── sections/
│   ├── industrial/
│   ├── system/
│   └── widgets/
│
├── hooks/                            # Thin wrappers TanStack Query
│   ├── queryKeys.ts
│   ├── queryInvalidation.ts
│   ├── use-mobile.tsx
│   ├── customers/
│   │   ├── useCustomers.ts
│   │   ├── useCustomer.ts
│   │   └── useCustomer360.ts
│   ├── orders/
│   ├── products/
│   │   ├── useProducts.ts
│   │   └── useProductDetail.ts
│   ├── distributor/
│   ├── mutations/
│   ├── office/
│   ├── analytics/
│   ├── network/
│   ├── payments/
│   ├── wallets/
│   ├── finance/
│   ├── commissions/
│   └── ...
│
├── services/                         # Acesso a dados (Supabase)
│   ├── customers/index.ts            # CustomerService
│   ├── orders/index.ts               # OrderService
│   ├── products/index.ts             # ProductService
│   ├── payments/index.ts             # PaymentService
│   ├── wallets/index.ts              # WalletService
│   ├── network/index.ts              # NetworkService
│   ├── plans/index.ts                # PlanService
│   ├── profiles/index.ts             # ProfileService
│   ├── leads/index.ts                # LeadService
│   ├── customer360/index.ts          # Customer360Service
│   ├── crm360/index.ts               # CRM360Service
│   ├── finance360/index.ts           # Finance360Service
│   ├── mlm360/index.ts               # MLM360Service
│   ├── analytics/index.ts            # AnalyticsService
│   ├── profile360/index.ts           # Profile360Service
│   │
│   │   # Serviços a migrar:
│   ├── productsService.ts            # (!!) REMOVER
│   ├── cartService.ts                # (!!) Padronizar
│   ├── commissions.ts                # (!!) Migrar p/ services/commissions/
│   ├── automations.ts                # (!!) Migrar p/ services/crm/
│   ├── customer-notes.ts             # (!!) Migrar p/ services/crm/
│   ├── documents.ts                  # (!!) Migrar p/ services/crm/
│   ├── featureFlags.ts               # (!!) Migrar p/ services/system/
│   ├── copilot.service.ts            # (!!) Migrar p/ services/copilot/
│   ├── industrial.service.ts         # (!!) Migrar p/ services/industrial/
│   └── referralTrackingService.ts    # (!!) Migrar p/ services/network/
│
├── modules/
│   ├── auth/
│   │   ├── index.ts
│   │   ├── context/                  # AuthContext + AuthProvider
│   │   ├── hooks/                    # useAuth, usePermissions
│   │   ├── services/                 # auth.service, supabase.service
│   │   ├── guards/                   # RouteGuard
│   │   ├── permissions/
│   │   └── utils/
│   ├── industrial/
│   └── plans/
│
├── contexts/                         # (!!) APENAS UI state
│   ├── CartContext.tsx               # (!!) REFATORAR
│   ├── ProductsContext.tsx            # (!!) REMOVER
│   ├── StoreSettingsContext.tsx       # (!) Manter se UI state
│   └── StyleContext.tsx              # (!) Manter se UI state
│
├── api/
│   └── client.ts                     # (!!) REMOVER
│
├── utils/
│   ├── priceFormatter.ts
│   └── leadFormatter.ts
│
└── backend/
    ├── server/
    │   ├── index.ts
    │   └── middleware/
    ├── modules/
    │   ├── admin/
    │   ├── mlm/
    │   ├── finance/
    │   ├── products/
    │   ├── logistics/
    │   ├── inventory/
    │   ├── commissions/
    │   ├── dashboard/
    │   ├── copilot/
    │   ├── embeddings/
    │   └── ... (25 módulos total)
    ├── infra/database/
    └── shared/
`

---

## Responsabilidades por Camada

### Components (src/components/)
- Renderizar UI com dados recebidos de hooks ou props
- Estado local de UI (input de formulário, toggle, animação)
- Compor componentes Radix UI + Tailwind para criar experiência visual
- **NÃO** devem chamar Supabase diretamente
- **NÃO** devem conter lógica de negócio

### Hooks (src/hooks/)
- Thin wrappers sobre useQuery e useMutation
- Combinar múltiplos Services quando necessário
- Transformar dados para o formato esperado pelos componentes
- **NÃO** devem conter chamadas diretas ao Supabase
- **NÃO** devem gerenciar estado de UI (useState para loading, etc.)

### Services (src/services/)
- Única camada que faz chamadas ao Supabase (supabase.from(...))
- Métodos de consulta (etch*, get*, list*)
- Métodos de mutação (create*, update*, delete*)
- Tratamento de erros (throw Error com mensagem amigável)
- **NÃO** devem importar hooks, contexto ou componentes React

### Routes (src/routes/)
- Definir tree de rotas com TanStack Router
- Usar loader / eforeLoad para pre-carregar dados críticos
- Usar RouteGuard para proteção de rotas por role
- Layout aninhado via _app.tsx e office.tsx

### Modules (src/modules/)
- Módulos autônomos que encapsulam contexto, hooks, serviços e componentes de um domínio
- uth/ é o módulo principal — gerencia autenticação, autorização e permissões
- Podem ter seu próprio estado de UI (stores), mas NÃO devem ter server state

### Backend (src/backend/)
- Servidor Express para operações que exigem SERVICE_ROLE_KEY
- Webhooks de gateways de pagamento
- Operações administrativas que bypassam RLS
- Jobs agendados (cálculo de comissões MLM, etc.)
- Integrações com APIs externas (AllIn legado, Chatwoot, OpenAI)
- **NÃO** deve expor endpoints CRUD que o frontend pode fazer direto via Supabase

### Supabase
- Database principal (PostgreSQL)
- Autenticação nativa (Supabase Auth)
- RLS (Row Level Security) para controle de acesso
- Realtime subscriptions para dados que precisam de atualização em tempo real
- Views materializadas para dados agregados (ex: crm.customer_360_view)

---

## Fluxo Completo dos Dados

### Cenário 1: Leitura de dados (ex: listar pedidos)

`
1. Rota /office/orders
   -> TanStack Router renderiza OrdersPage.tsx

2. OrdersPage.tsx
   -> Chama useOrders() hook

3. useOrders()
   -> useQuery({
        queryKey: queryKeys.orders,
        queryFn: () => OrderService.fetchOrdersList()
      })

4. OrderService.fetchOrdersList()
   -> supabase.from("orders").select("*").range(...).order(...)

5. Supabase
   -> Aplica RLS (distribuidor ve apenas seus pedidos)
   -> Retorna dados para o Service -> Hook -> Componente

6. TanStack Query cacheia o resultado (staleTime: 5 min)
`

### Cenário 2: Escrita de dados (ex: criar pedido)

`
1. Componente (formulario de checkout)
   -> Chama useMutation com mutationFn

2. useMutation
   -> Chama OrderService.createOrder(orderData)

3. OrderService.createOrder(orderData)
   -> supabase.from("orders").insert(orderData)

4. Apos sucesso:
   -> invalidateOrderQueries(queryClient)
   -> invalidateCustomerQueries(queryClient, customerId)
   -> toast.success("Pedido criado com sucesso!")

5. TanStack Query re-fetch as queries invalidadas
   -> Componentes atualizam automaticamente
`

### Cenário 3: Operacao server-side (ex: webhook de pagamento)

`
1. Gateway de pagamento envia POST para /api/webhooks/payment

2. Express backend recebe a requisicao
   -> Middleware valida assinatura do webhook

3. Servico backend (admin/services/payment-webhook.service.ts)
   -> Usa getBackendClient() (SERVICE_ROLE_KEY)
   -> Atualiza status do pagamento
   -> Dispara calculo de comissao
   -> Envia email de confirmacao

4. Frontend (se ouvindo via Realtime)
   -> Recebe atualizacao e atualiza UI
`

---

## Supabase: O Que Vai Para Onde

| Schema | Tabelas | Responsabilidade | Acesso |
|---|---|---|---|
| **auth** | users, sessions, refresh_tokens | Autenticacao nativa Supabase | ANON_KEY (via RLS) |
| **identity** | roles, user_roles | Definicao de papeis e permissoes | Admin + RLS |
| **crm** | customers, customer_notes, customer_360_view, leads, customer_metrics, customer_scores | Dados de clientes, CRM e leads | ANON_KEY (via RLS) |
| **commerce** | produtos, orders, order_items, cart_items, categories | Catalogo de produtos, pedidos, carrinho | ANON_KEY (via RLS) |
| **finance** | wallets, points_wallets, wallet_transactions, withdrawals | Carteiras, transacoes financeiras | ANON_KEY (via RLS) |
| **mlm** | planos, planos_distribuidores, network_relationships, bonus_calculations, qualifications | Rede MLM, planos, bonus, qualificacoes | ANON_KEY (via RLS) |
| **system** | audit_log, config, feature_flags | Logs de auditoria, configuracoes do sistema | SERVICE_ROLE_KEY |

**Regra geral:** Frontend usa supabase (ANON_KEY, singleton) para queries com RLS.
Backend usa getBackendClient() (SERVICE_ROLE_KEY) para operacoes administrativas.

---

## Backend Node: O Que Permanece

O backend Express **nao** sera eliminado — ele sera **reduzido ao essencial**.
Permanecem:

| Funcionalidade | Modulo | Motivo |
|---|---|---|
| **Health Check** | server/index.ts | Monitoramento basico |
| **Webhooks de Pagamento** | backend/modules/finance/ | Assinatura secreta, SERVICE_ROLE_KEY |
| **Calculo de Comissoes MLM** | backend/modules/mlm/ | Operacao pesada, requer SERVICE_ROLE_KEY |
| **Recalculo de Rede** | backend/modules/mlm/ | Atualizacao em lote de network_relationships |
| **Geracao de Relatorios** | backend/shared/reports/ | Exportacao de dados (CSV, PDF) |
| **Integracao AllIn API** | backend/shared/services/ | Ponte para sistema legado AllIn |
| **Embeddings / IA** | backend/modules/embeddings/ | OpenAI, vetores, busca semantica |
| **Chatwoot** | backend/shared/chatwoot/ | Integracao com suporte |
| **Jobs Agendados** | backend/shared/scripts/ | Tarefas periodicas (cron) |
| **Admin Operations** | backend/modules/admin/ | Operacoes que exigem SERVICE_ROLE_KEY |

**O que SAI do backend** (ja removido ou em remocao):
- CRUD de produtos -> Supabase direto
- CRUD de clientes -> Supabase direto
- CRUD de pedidos -> Supabase direto
- Autenticacao -> Supabase Auth
- Qualquer query que pode ser feita com RLS

---

## Regras de Migracao

### Prioridade para os proximos sprints:

| Sprint | Foco | Acao |
|---|---|---|
| **Sprint 1** (atual) | Documentar arquitetura alvo | Criar e validar este documento |
| **Sprint 2** | Eliminar Context API para server state | Migrar CartContext, ProductsContext, StoreSettingsContext para TanStack Query |
| **Sprint 3** | Padronizar Services | Mover services soltos (productsService.ts, cartService.ts, etc.) para services/<dominio>/ |
| **Sprint 4** | Remover src/lib/api/ | Migrar funcoes para Services correspondentes |
| **Sprint 5** | Remover src/api/client.ts | Eliminar ApiClient legado (se nao houver dependencias) |
| **Sprint 6** | Padronizar hooks | Garantir que todos os hooks sigam o padrao thin wrapper |
| **Sprint 7** | Eliminar distributor-context.tsx | Substituir por hooks TanStack Query |
| **Sprint 8** | Backend cleanup | Garantir que backend so tenha o essencial |

### Regras praticas para o dia a dia:

1. **Todo novo codigo DEVE** seguir a arquitetura alvo (TanStack Query + Services + Hooks thin wrapper)
2. **Todo codigo antigo DEVE** ser migrado quando for tocado (principio "scout rule")
3. **Pull requests** que introduzem novo useEffect + useState para data fetching devem ser **rejeitados**
4. **Import de @tanstack/react-query** e obrigatorio em hooks de dados; useState/useEffect sao permitidos apenas para UI state
5. **Services nunca importam** nada de components/, hooks/ ou contexts/
6. **Context API** e permitida apenas para estado puro de UI (tema, sidebar aberta/fechada, modal ativo)
7. **Query keys** devem sempre ser adicionadas em src/hooks/queryKeys.ts antes de criar um novo hook
8. **Invalidacao de cache** deve usar as funcoes em src/hooks/queryInvalidation.ts

---

## Glossario da Arquitetura

| Termo | Definicao |
|---|---|
| **Service** | Classe/objeto em src/services/<dominio>/index.ts que encapsula chamadas ao Supabase. Puro, sem dependencia React. |
| **Hook (Custom)** | Funcao em src/hooks/<dominio>/ que usa useQuery/useMutation para expor dados a componentes. Thin wrapper do Service. |
| **Query Key** | Tupla nomeada em src/hooks/queryKeys.ts que identifica unicamente um cache do TanStack Query. |
| **Cache Invalidation** | Processo de invalidar queries relacionadas apos uma mutacao, usando queryClient.invalidateQueries(). |
| **TanStack Router Loader** | Funcao executada antes de renderizar uma rota para pre-carregar dados no cache. |
| **Route Guard** | Componente que protege rotas verificando permissoes do usuario (RouteGuard em modules/auth/guards/). |
| **RLS (Row Level Security)** | Politicas de seguranca no PostgreSQL do Supabase que restringem acesso a linhas por usuario/role. |
| **ANON_KEY** | Chave publica do Supabase usada no frontend. Permite apenas operacoes autorizadas por RLS. |
| **SERVICE_ROLE_KEY** | Chave de administrador do Supabase usada apenas no backend. Bypassa RLS. |
| **Module** | Diretorio em src/modules/ que agrupa contexto, hooks, servicos e componentes de um dominio autonomo. |
| **Server State** | Dados que vem do servidor (Supabase). Gerenciado por TanStack Query. |
| **UI State** | Estado local da interface (modal aberto/fechado, input values, etc.). Gerenciado por useState, Context ou Zustand (se necessario). |
| **Stale Time** | Tempo (em ms) que o TanStack Query considera um dado "fresco" antes de re-busca-lo. Padrao: 5 minutos. |
| **Optimistic Update** | Atualizacao imediata da UI antes da confirmacao do servidor, com rollback em caso de erro. |
| **Schema (Supabase)** | Namespace logico que organiza tabelas: crm, commerce, finance, mlm, identity, system. |
| **id_comprador** | Chave de negocio canonica usada em todo o sistema (texto, nao UUID). 247 ocorrencias em 54 arquivos. |
