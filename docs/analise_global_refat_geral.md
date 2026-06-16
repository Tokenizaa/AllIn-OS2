**Resumo Executivo**

O frontend é um app Vite + React + TanStack Router com arquitetura híbrida:

- navegação file-based em [`src/routes`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes)
- shell global em [`src/routes/__root.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/__root.tsx)
- área autenticada em [`src/routes/_app.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app.tsx)
- área office em [`src/routes/office.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office.tsx)
- uma camada grande de services/hook wrappers em [`src/services`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services), [`src/lib/api`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api) e [`src/hooks`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks)
- integração forte com Supabase via [`src/lib/supabase/client.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase/client.ts) e [`src/lib/supabase-client.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase-client.ts)

O ponto mais importante: o repo mistura frontend com um backend completo em [`src/backend`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend), então a fronteira entre UI, domínio e acesso a dados não está limpa. Há muitas consultas diretas ao Supabase no frontend, além de uma segunda camada `services` com responsabilidade parecida.

**Mapa da Arquitetura**

- Padrão principal: arquitetura file-based por rota, com composição por componentes e serviços.
- Organização real:
  - páginas e layouts em `src/routes`
  - componentes visuais em `src/components`
  - lógica de dados em `src/hooks`, `src/services`, `src/lib/api`
  - autenticação e RBAC em `src/modules/auth`
  - integração Supabase centralizada em `src/lib/supabase`
  - código backend e módulos de domínio em `src/backend`

- Fluxo típico:
  - rota -> componente de página -> hook/service -> Supabase
  - em alguns casos a rota chama service diretamente, sem hook intermediário
  - autenticação usa contexto global e services específicos

- O que está bom:
  - rotas separadas por domínio
  - vários componentes reutilizáveis
  - client Supabase centralizado
  - RBAC explícito via `RouteGuard` e matriz de permissões

- O que está frágil:
  - duas camadas de acesso a dados com sobreposição (`src/services` e `src/lib/api`)
  - frontend acessando banco diretamente em muitos pontos
  - grande massa de código backend no mesmo repositório, o que aumenta acoplamento conceitual
  - logging de variáveis sensíveis no client Supabase
  - duplicações/legado em rotas e componentes

**Inventário de Rotas e Páginas**

Baseado nos arquivos em [`src/routes`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes):

| Tipo | Rota | Arquivo | Responsabilidade |
|---|---|---|---|
| Pública | `/` | [`src/routes/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/index.tsx) | Home pública, redireciona usuário autenticado por role, define distribuidor padrão |
| Pública | `/login` | [`src/routes/login.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/login.tsx) | Login |
| Pública | `/cadastro` | [`src/routes/cadastro.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/cadastro.tsx) | Cadastro |
| Pública | `/recuperar-senha` | [`src/routes/recuperar-senha.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/recuperar-senha.tsx) | Recuperação de senha |
| Pública | `/redefinir-senha` | [`src/routes/redefinir-senha.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/redefinir-senha.tsx) | Redefinição de senha |
| Pública | `/ativacao` | [`src/routes/ativacao.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/ativacao.tsx) | Ativação/autorização inicial |
| Pública | `/auth/invite/$token` | [`src/routes/auth.invite.$token.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/auth.invite.$token.tsx) | Aceite de convite por token |
| Pública | `/busca-produtos` | [`src/routes/busca-produtos.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/busca-produtos.tsx) | Busca/listagem de produtos |
| Pública | `/busca-produtos/$slug` | [`src/routes/busca-produtos.$slug.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/busca-produtos.$slug.tsx) | Detalhe da busca por slug |
| Pública | `/produto/$id` | [`src/routes/produto.$id.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/produto.$id.tsx) | Detalhe de produto |
| Pública | `/loja` | [`src/routes/loja.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/loja.tsx) | Loja pública/catalogo |
| Pública | `/loja/$slug` | [`src/routes/loja.$slug.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/loja.$slug.tsx) | Loja por slug |
| Pública | `/doencas` | [`src/routes/doencas.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/doencas.tsx) | Página institucional de doenças |
| Pública | `/doencas/$slug` | [`src/routes/doencas.$slug.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/doencas.$slug.tsx) | Detalhe por doença |
| Pública | `/seja-distribuidor` | [`src/routes/seja-distribuidor.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/seja-distribuidor.tsx) | Landing page de distribuição |
| Pública | `/seja-distribuidor/$slug` | [`src/routes/seja-distribuidor.$slug.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/seja-distribuidor.$slug.tsx) | Variante por slug |
| Pública | `/checkout` | [`src/routes/checkout.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/checkout.tsx) | Checkout público |
| Pública/Legada | `/$slug` | [`src/routes/$slug.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/$slug.tsx) | Rota genérica legada ou fallback |
| Autenticada | `/_app` | [`src/routes/_app.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app.tsx) | Shell autenticado, sidebar/topbar/copilot |
| Autenticada | `/_app/products` | [`src/routes/_app/products/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/products/index.tsx) | Catálogo interno de produtos |
| Autenticada | `/_app/orders` | [`src/routes/_app/orders/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/orders/index.tsx) | Pedidos |
| Autenticada | `/_app/customers` | [`src/routes/_app/customers/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/customers/index.tsx) | Listagem de clientes |
| Autenticada | `/_app/customers/$id` | [`src/routes/_app/customers/$id.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/customers/$id.tsx) | Perfil 360 de cliente |
| Autenticada | `/_app/network` | [`src/routes/_app/network.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/network.tsx) | Rede |
| Autenticada | `/_app/genealogy` | [`src/routes/_app/genealogy.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/genealogy.tsx) | Genealogia |
| Autenticada | `/_app/plans` | [`src/routes/_app/plans.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/plans.tsx) | Planos |
| Autenticada | `/_app/commissions` | [`src/routes/_app/commissions.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/commissions.tsx) | Comissões |
| Autenticada | `/_app/analytics` | [`src/routes/_app/analytics.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/analytics.tsx) | Analytics |
| Autenticada | `/_app/insights` | [`src/routes/_app/insights.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/insights.tsx) | Insights |
| Autenticada | `/_app/wallets` | [`src/routes/_app/wallets.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/wallets.tsx) | Carteiras |
| Autenticada | `/_app/marketing` | [`src/routes/_app/marketing.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/marketing.tsx) | Marketing |
| Autenticada | `/_app/settings` | [`src/routes/_app/settings.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/settings.tsx) | Configurações |
| Autenticada | `/_app/system` | [`src/routes/_app/system.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/system.tsx) | Sistema / auditoria |
| Autenticada | `/_app/alerts` | [`src/routes/_app/alerts.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/alerts.tsx) | Alertas |
| Autenticada | `/_app/copilot` | [`src/routes/_app/copilot.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/copilot.tsx) | Copilot |
| Autenticada | `/_app/industrial` | [`src/routes/_app/industrial/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/industrial/index.tsx) | Módulo industrial |
| Autenticada | `/_app/industrial/processes` | [`src/routes/_app/industrial/processes.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/industrial/processes.tsx) | Processos industriais |
| Autenticada | `/_app/industrial/materials` | [`src/routes/_app/industrial/materials.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/industrial/materials.tsx) | Materiais industriais |
| Autenticada | `/_app/industrial/machines` | [`src/routes/_app/industrial/machines.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/industrial/machines.tsx) | Máquinas industriais |
| Office | `/office` | [`src/routes/office.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office.tsx) | Shell office |
| Office | `/office/` | [`src/routes/office/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/index.tsx) | Dashboard office |
| Office | `/office/store` | [`src/routes/office/store.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/store.tsx) | Loja interna |
| Office | `/office/reports` | [`src/routes/office/reports.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/reports.tsx) | Relatórios |
| Office | `/office/profile` | [`src/routes/office/profile.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/profile.tsx) | Perfil |
| Office | `/office/plan` | [`src/routes/office/plan.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/plan.tsx) | Plano |
| Office | `/office/orders` | [`src/routes/office/orders.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/orders.tsx) | Pedidos |
| Office | `/office/network` | [`src/routes/office/network.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/network.tsx) | Rede |
| Office | `/office/finance` | [`src/routes/office/finance.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/finance.tsx) | Financeiro |
| Office | `/office/downloads` | [`src/routes/office/downloads.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/downloads.tsx) | Downloads |
| Office | `/office/verification` | [`src/routes/office/verification.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/verification.tsx) | Verificação/KYC |
| Office | `/office/copilot` | [`src/routes/office/copilot.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/copilot.tsx) | Copilot office |

Observações importantes:
- [`src/routes/office/reports.tsx.bak`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/reports.tsx.bak) é legado/duplicado.
- [`src/routes/README.md`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/README.md) confirma que o roteamento é file-based.
- A home pública redireciona usuários autenticados por role em [`src/routes/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/index.tsx).

**Inventário de Componentes**

A base de componentes está bem dividida por responsabilidade, mas com muita repetição funcional.

- Layout e navegação:
  - [`src/components/app/public-header.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/app/public-header.tsx)
  - [`src/components/app/sidebar-nav.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/app/sidebar-nav.tsx)
  - [`src/components/app/topbar.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/app/topbar.tsx)
  - [`src/components/app/copilot-drawer.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/app/copilot-drawer.tsx)
  - [`src/components/distributor/sidebar.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/distributor/sidebar.tsx)
  - [`src/components/distributor/topbar.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/distributor/topbar.tsx)
  - [`src/components/MobileBottomNav.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/MobileBottomNav.tsx)

- UI genérica:
  - toda a árvore em [`src/components/ui`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ui)
  - exemplos: [`button.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ui/button.tsx), [`card.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ui/card.tsx), [`dialog.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ui/dialog.tsx), [`table.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ui/table.tsx)

- Landing/public:
  - [`src/components/sections`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/sections)
  - [`src/components/shared`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/shared)
  - [`src/components/Footer.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/Footer.tsx)
  - [`src/components/ReviewsAndContact.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ReviewsAndContact.tsx)
  - [`src/components/ProductsSection.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ProductsSection.tsx)
  - [`src/components/ProductSearch.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/ProductSearch.tsx)

- Store:
  - [`src/components/store`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/store)
  - [`src/components/features/cart/CartSidebar.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/features/cart/CartSidebar.tsx)
  - [`src/components/features/products/ProductGallery.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/features/products/ProductGallery.tsx)

- Auth/system:
  - [`src/components/auth/login-view.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/auth/login-view.tsx)
  - [`src/components/auth/test-accounts-fill.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/auth/test-accounts-fill.tsx)
  - [`src/components/system/user-management.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/system/user-management.tsx)
  - [`src/components/system/invites-management.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/system/invites-management.tsx)
  - [`src/components/system/rbac-utils.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/system/rbac-utils.ts)

- Domain components:
  - [`src/components/customers`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/customers)
  - [`src/components/plans`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/plans)
  - [`src/components/payments`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/payments)
  - [`src/components/invites`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/invites)
  - [`src/components/distributor`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/distributor)
  - [`src/components/widgets`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/widgets)

- Componentes de página específicos:
  - [`src/routes/office/Dashboard.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/Dashboard.tsx)
  - [`src/routes/office/ProfilePage.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/ProfilePage.tsx)
  - [`src/routes/office/OrdersPage.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/OrdersPage.tsx)
  - [`src/routes/office/NetworkPage.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/NetworkPage.tsx)
  - [`src/routes/office/PlanPage.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/PlanPage.tsx)
  - [`src/routes/office/FinancePage.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/FinancePage.tsx)
  - [`src/routes/office/DownloadsPage.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/DownloadsPage.tsx)
  - [`src/routes/office/CopilotPage.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/CopilotPage.tsx)

**Hooks e Services**

Aqui está o principal acoplamento do app: muita lógica de dados foi extraída para hooks e services, mas ainda com várias consultas diretas ao banco.

- Auth:
  - [`src/modules/auth/hooks`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/hooks)
  - [`src/modules/auth/services/auth.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/auth.service.ts)
  - [`src/modules/auth/services/supabase.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/supabase.service.ts)
  - [`src/modules/auth/services/profile.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/profile.service.ts)
  - [`src/modules/auth/services/invite.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/invite.service.ts)
  - [`src/modules/auth/services/audit.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/audit.service.ts)

- Domínios principais em `src/hooks`:
  - [`src/hooks/products`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/products)
  - [`src/hooks/plans`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/plans)
  - [`src/hooks/payments`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/payments)
  - [`src/hooks/orders`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/orders)
  - [`src/hooks/customers`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/customers)
  - [`src/hooks/network`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/network)
  - [`src/hooks/finance`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/finance)
  - [`src/hooks/analytics`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/analytics)
  - [`src/hooks/office`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/office)
  - [`src/hooks/marketing`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/marketing)
  - [`src/hooks/mlm`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/mlm)
  - [`src/hooks/alerts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/alerts)
  - [`src/hooks/copilot`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/copilot)
  - [`src/hooks/audit`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/audit)
  - [`src/hooks/mutations/wallets`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/mutations/wallets)
  - [`src/hooks/store`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/store)

- Services de domínio:
  - [`src/services/productsService.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/productsService.ts)
  - [`src/services/products`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/products)
  - [`src/services/plans`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/plans)
  - [`src/services/payments`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/payments)
  - [`src/services/orders`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/orders)
  - [`src/services/customers`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/customers)
  - [`src/services/network`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/network)
  - [`src/services/finance360`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/finance360)
  - [`src/services/profile360`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/profile360)
  - [`src/services/mlm360`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/mlm360)
  - [`src/services/referralTrackingService.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/referralTrackingService.ts)
  - [`src/services/documents.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/documents.ts)
  - [`src/services/featureFlags.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/featureFlags.ts)
  - [`src/services/industrial.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/industrial.service.ts)

- API helpers:
  - [`src/lib/api/wallet.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/wallet.functions.ts)
  - [`src/lib/api/points-wallet.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/points-wallet.functions.ts)
  - [`src/lib/api/plans.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/plans.functions.ts)
  - [`src/lib/api/payment.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/payment.functions.ts)
  - [`src/lib/api/discount.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/discount.functions.ts)
  - [`src/lib/api/bonus.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/bonus.functions.ts)
  - [`src/lib/api/bonus-wallet.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/bonus-wallet.functions.ts)

**Fluxo de Dados por Página**

Alguns fluxos confirmados no código:

- Home pública em [`src/routes/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/index.tsx)
  - usa [`useDistributor`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/distributor-context.tsx)
  - usa [`useAuth`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/hooks/useAuth.ts)
  - redireciona por role com [`getPrimaryPathForRole`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/navigation.ts)

- Loja pública em [`src/routes/loja.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/loja.tsx)
  - usa [`StyleProvider`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/contexts/StyleContext.tsx)
  - usa [`useToast`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/use-toast.ts)
  - usa [`useProductsFromCSV`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/useProductsFromCSV.ts)
  - monta catálogo com componentes de store/public header/cart

- Catálogo interno em [`src/routes/_app/products/index.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/_app/products/index.tsx)
  - chama [`productsService.getAllProducts()`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/productsService.ts)
  - exibe cards com estoque, destaque e status

- Auth e sessão
  - [`src/modules/auth/context/AuthProvider.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/context/AuthProvider.tsx) é o orquestrador
  - usa [`SupabaseService`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/supabase.service.ts)
  - usa [`AuthService`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/auth.service.ts)
  - usa [`InviteService`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/invite.service.ts)
  - usa [`ProfileService`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/profile.service.ts)
  - usa [`AuditService`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/audit.service.ts)
  - usa [`referralTrackingService`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/referralTrackingService.ts)

- Guards e RBAC
  - [`src/modules/auth/guards/RouteGuard.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/guards/RouteGuard.tsx)
  - mapeia path -> permission via regex
  - autoriza por role e permissão usando [`ROLE_PERMISSIONS`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/permissions/permissions.ts)

**Integrações com Banco e API**

A aplicação fala com Supabase de três maneiras:

1. acesso direto do frontend
2. services de domínio
3. helpers em `src/lib/api`

**Supabase client**

- [`src/lib/supabase/client.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase/client.ts)
  - cria client browser com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  - também tenta ler `process.env`
  - faz `console.log` dos valores de ambiente, o que é risco de exposição operacional
  - exporta também um `getBackendClient()` para service role

**Tabelas/views/RPCs identificados no frontend**

- `wallets`
- `wallet_transactions`
- `points_wallets`
- `points_transactions`
- `withdrawals`
- `workspace_settings`
- `referral_tracking`
- `customers`
- `customer_bonus_view`
- `planos_distribuidores`
- `roles`
- `user_roles`
- `customer_360_view`
- `customer_metrics`
- `customer_network_metrics`
- `customer_scores`
- `products`
- `produtos`
- `plans`
- `plan_bonuses`
- `customer_plans`
- `payments`
- `payment_splits`
- `financial_audit_logs`
- `coupons`
- `discount_rules`
- `bonus_wallets`
- `bonus_transactions`
- `campaigns`
- `network_relationships`
- `admin_invites`
- `admin_users`
- `profiles`
- `distribuidores`
- `solicitacoes_saque`
- `distribuidor_temas`
- `customer_documents`
- `feature flags table` via [`src/services/featureFlags.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/featureFlags.ts) com nome configurável
- `crm.customers` via schema explícito em vários pontos

RPCs identificados:
- `credit_wallet`
- `debit_wallet`
- `freeze_wallet_balance`
- `unfreeze_wallet_balance`
- `earn_points`
- `redeem_points`
- `convert_currency_to_points`
- `convert_points_to_currency`
- `expire_old_points`
- `create_payment`
- `process_hybrid_payment`
- `calculate_hybrid_payment_preview`
- `get_payment_stats`
- `create_payment_split`
- `process_split_payment`
- `get_financial_summary`
- `retry_payment`
- `calculate_discount`
- `validate_coupon`
- `earn_bonus`
- `use_bonus`
- `expire_old_bonuses`

**Cadeias de Integração Relevantes**

- Auth:
  - [`src/modules/auth/services/auth.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/services/auth.service.ts)
  - usa Supabase Auth com `signInWithPassword`, `signUp`, `signOut`, `getUser`
  - combina auth user com dados em `crm.customers`, `customers`, `admin_users`, `distribuidores`

- Perfil 360:
  - [`src/services/profile360/index.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/profile360/index.ts)
  - lê `customer_360_view`, `customers`, `customer_metrics`, `customer_network_metrics`, `customer_scores`

- Financeiro:
  - [`src/services/finance360/index.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/finance360/index.ts)
  - lê `customers`, `wallets`, `points_wallets`, `wallet_transactions`

- MLM/Rede:
  - [`src/services/mlm360/index.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/mlm360/index.ts)
  - lê `customers`, `network_relationships`

- Produtos:
  - [`src/services/productsService.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/productsService.ts)
  - lê `produtos`
  - [`src/services/products/index.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/products/index.ts)
  - lê `products`

- Planos:
  - [`src/lib/api/plans.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/plans.functions.ts)
  - manipula `plans`, `plan_bonuses`, `customer_plans`

- Pagamentos:
  - [`src/lib/api/payment.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/payment.functions.ts)
  - manipula `payments`, `payment_splits`, `financial_audit_logs` e várias RPCs financeiras

- Carteiras:
  - [`src/lib/api/wallet.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/wallet.functions.ts)
  - [`src/lib/api/points-wallet.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/points-wallet.functions.ts)
  - [`src/lib/api/bonus-wallet.functions.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api/bonus-wallet.functions.ts)

- Orders:
  - services em [`src/services/orders`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/orders)
  - backend paralelo em [`src/backend/modules/orders`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend/modules/orders)

- Industrial:
  - frontend service pesado em [`src/services/industrial.service.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/industrial.service.ts)
  - também existe módulo backend completo em [`src/backend/modules/industrial`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend/modules/industrial)

**Problemas Arquiteturais e Riscos**

1. Mistura de frontend e backend no mesmo recorte de código
- O diretório [`src/backend`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend) contém módulos, repositórios, APIs e serviços completos.
- Isso aumenta o ruído arquitetural e dificulta distinguir o que é executado no browser versus server.

2. Camadas duplicadas de acesso a dados
- [`src/services`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/services) e [`src/lib/api`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/api) fazem papéis parecidos.
- Na prática, o app tem service layer, API helper layer e acesso direto em alguns hooks.
- Isso torna mais difícil padronizar cache, erros e invalidação.

3. Acesso direto ao banco em muitos pontos
- Vários hooks e services importam [`supabase`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase/client.ts) ou [`supabase-client`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase-client.ts) diretamente.
- Exemplo claro: [`src/hooks/mutations/wallets/useUpdateWalletBalance.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/mutations/wallets/useUpdateWalletBalance.ts) e [`src/hooks/marketing/useCampaigns.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks/marketing/useCampaigns.ts).

4. Segurança/observabilidade frágil no client Supabase
- [`src/lib/supabase/client.ts`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase/client.ts) loga variáveis de ambiente no browser/dev console.
- Isso não é ideal mesmo que o anon key seja público, porque vaza configuração e dificulta hardening.

5. Legado/duplicidade
- [`src/routes/office/reports.tsx.bak`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes/office/reports.tsx.bak) indica migração incompleta ou arquivo abandonado.
- Existe também duplicidade semântica entre `productsService`, `services/products/index.ts` e hooks que consomem fontes diferentes (`products` vs `produtos`).

6. RBAC é explícito, mas depende de convenção por path
- [`src/modules/auth/guards/RouteGuard.tsx`](C:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/guards/RouteGuard.tsx) usa regex por rota para mapear permissões.
- Isso funciona, mas é fácil esquecer rotas novas se a matriz não for atualizada.

7. Mistura de dados de domínio com componentes de UI
- Há componentes de domínio espalhados em `src/components/*` e `src/routes/*`, o que reduz clareza de ownership.
- Algumas páginas fazem muito trabalho de montagem local em vez de delegar a hooks ou view-models.

**Conclusão Objetiva**

A arquitetura do frontend é funcional, mas híbrida e com acoplamento alto ao Supabase. A separação por rotas e componentes existe, e o fluxo de auth/RBAC está claro, porém o projeto sofre com:
- camadas sobrepostas de data access
- backend no mesmo workspace
- duplicação de modelos de dados
- legados e tabelas com nomes divergentes
- exposição desnecessária de configuração no client

Se quiser, eu posso transformar esta auditoria em uma documentação mais formal em Markdown com:
1. tabela página -> componentes -> hooks -> banco,
2. mapa visual de dependências,
3. ou checklist de refatoração priorizada.