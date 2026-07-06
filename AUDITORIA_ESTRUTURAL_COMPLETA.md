# Auditoria Estrutural Completa - AllIn OS 2.0

## Executive Summary

Esta auditoria identificou **problemas arquiteturais sistêmicos** que explicam a lentidão da aplicação. Os problemas não são isolados, mas padrões recorrentes em toda a codebase.

**Nota de Revisão Arquitetural**: A auditoria original identificou corretamente o problema central - a aplicação usa Context API como mecanismo de carregamento de dados enquanto já possui TanStack Router e TanStack Query, mas quase não aproveita seus recursos. Entretanto, esta versão revisada incorpora medição de performance baseline antes de refatoração, refinamento das conclusões sobre Context API (diferenciando dados vs infraestrutura), e análise adicional de bundle, virtualização, waterfalls e índices do banco.

### Impacto Estimado (Após FASE 0 de Medição)
- **Redução potencial de renders**: 60-80%
- **Redução potencial de chamadas ao Supabase**: 70-90%
- **Melhoria no tempo de navegação**: 3-5x mais rápido
- **Redução do bundle size**: 30-40% com code splitting

**Importante**: Estimativas serão refinadas após FASE 0 de medição de performance baseline.

---

## 🔴 Problemas Críticos Identificados

### 1. Context API como "Store Global" (Anti-Pattern)

**Localização**: `src/routes/__root.tsx`

**Problema**:
```tsx
<QueryClientProvider client={queryClient}>
  <ThemeProvider>
    <AuthProvider>
      <DistributorProvider>
        <StoreSettingsProvider>
          <CartProvider>
            <ProductsProvider>
              <StyleProvider>
                <Outlet />
              </StyleProvider>
            </ProductsProvider>
          </CartProvider>
        </StoreSettingsProvider>
      </DistributorProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>
```

**Impacto**:
- 7 providers aninhados
- Qualquer mudança em qualquer provider causa re-renderização de toda a árvore
- DistributorProvider e AuthProvider são os mais pesados
- Sem memoização adequada

**Refinamento Arquitetural**: Context API não é ruim per se. Ela é excelente para:
- Theme
- Auth Session
- Locale
- Feature Flags
- Modal Manager
- Toasts

O problema é Context para dados (produtos, clientes, pedidos, carrinho).

**Solução**:
- **Eliminar Contexts de DADOS**: DistributorProvider, ProductsProvider, CartProvider, StoreSettingsProvider
- **Manter Contexts de INFRAESTRUTURA**: ThemeProvider, AuthProvider (reduzido), StyleProvider
- Mover dados para TanStack Query com cache
- Eliminar DistributorProvider (usar loader)
- Reduzir AuthProvider ao mínimo essencial (session, user, login, logout)
- Usar React.memo nos providers restantes

---

### 2. useEffect para Sincronização de URL → Contexto

**Localização**: Múltiplos arquivos
- `src/routes/$slug.tsx` (linhas 28-32)
- `src/routes/seja-distribuidor.$slug.tsx` (linhas 28-32)
- `src/routes/loja.$slug.tsx` (linhas 35-39)

**Problema**:
```tsx
const params = useParams({ strict: false }) as { slug?: string };
const routeSlug = params.slug?.toLowerCase().trim();

useEffect(() => {
  if (routeSlug) {
    setDistributorBySlug(routeSlug);
  }
}, [routeSlug, setDistributorBySlug]);
```

**Impacto**:
- 2-4 renders por navegação
- URL muda → params mudam → effect dispara → context muda → render
- Cascata de re-renderizações

**Solução**:
```tsx
// Usar loader do TanStack Router
export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    return await queryClient.ensureQueryData({
      queryKey: ['distributor', params.slug],
      queryFn: () => fetchDistributorBySlug(params.slug)
    });
  },
  component: DistributorPage
});

// No componente
const { data: distributor } = useSuspenseQuery({
  queryKey: ['distributor', params.slug],
  queryFn: () => fetchDistributorBySlug(params.slug)
});
```

---

### 3. Chamadas Diretas ao Supabase sem Cache

**Localização**: 
- `src/modules/auth/services/supabase.service.ts` (7 chamadas diretas)
- `src/lib/distributor-context.tsx` (2 chamadas diretas)
- `src/routes/ativacao.tsx` (2 chamadas diretas)

**Problema**:
```tsx
// Sem cache, sem deduplicação, sem staleTime
const distributorData = await SupabaseService.fetchDistributorBySlug(activeSlug);
```

**Impacto**:
- Cada navegação faz nova requisição
- N+1 queries em listas
- Sem background refresh
- Sem deduplicação de requisições simultâneas

**Solução**:
```tsx
// Com TanStack Query
const { data: distributor } = useQuery({
  queryKey: ['distributor', slug],
  queryFn: () => fetchDistributorBySlug(slug),
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 10 * 60 * 1000, // 10 minutos
});
```

---

### 4. Duplicação de Estado

**Localização**: `src/routes/$slug.tsx`

**Problema**:
```tsx
const params = useParams({ strict: false }) as { slug?: string };
const routeSlug = params.slug?.toLowerCase().trim();
// ↓
const { currentDistributor, setDistributorBySlug } = useDistributor();
// ↓
const sponsorSlug = currentDistributor.slug;
```

**Impacto**:
- 4 estados para a mesma informação
- Cascata de atualizações
- Sincronização manual propensa a bugs

**Solução**:
```tsx
// Única fonte de verdade
const { data: distributor } = useSuspenseQuery({
  queryKey: ['distributor', params.slug],
  queryFn: () => fetchDistributorBySlug(params.slug)
});

const sponsorSlug = distributor.slug;
```

---

### 5. Páginas Enormes com Responsabilidades Misturadas

**Localização**:
- `src/routes/$slug.tsx` (494 linhas)
- `src/modules/auth/context/AuthProvider.tsx` (350 linhas)
- `src/routes/_app/customers/index.tsx` (321 linhas)

**Problema**:
```tsx
// $slug.tsx faz TUDO:
- Busca distribuidor
- Busca produtos
- Gerencia lead capture
- Gerencia carrinho
- Gerencia checkout
- Exibe perfil
- Exibe vitrine
- Exibe formulário de registro
```

**Impacto**:
- Dificuldade de manutenção
- Re-renderizações desnecessárias
- Baixa reutilização
- Testes complexos

**Solução**:
```tsx
// Separar em componentes menores
// $slug.tsx (apenas orquestração)
export const Route = createFileRoute("/$slug")({
  loader: async ({ params, context }) => {
    const [distributor, products] = await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ['distributor', params.slug],
        queryFn: () => fetchDistributorBySlug(params.slug)
      }),
      context.queryClient.ensureQueryData({
        queryKey: ['products'],
        queryFn: () => fetchProducts()
      })
    ]);
    return { distributor, products };
  },
  component: DistributorPage
});

// Componentes separados
- DistributorProfile
- DistributorVitrine
- LeadCaptureForm
- RegistrationFlow
```

---

### 6. useState Excessivo

**Estatística**: 245 matches em 64 arquivos

**Problema**:
```tsx
// Exemplo típico
const [q, setQ] = useState("");
const [planoFilter, setPlanoFilter] = useState<string>("all");
const [cidadeFilter, setCidadeFilter] = useState<string>("all");
const [currentPage, setCurrentPage] = useState<number>(1);
const [pageSize, setPageSize] = useState<number>(15);
// ... mais 10+ states
```

**Impacto**:
- Estado local fragmentado
- Dificuldade de debug
- Re-renderizações frequentes
- Sem persistência

**Refinamento Arquitetural**: useState não é o problema per se. useState é perfeito para:
- Modal aberto/fechado
- Input fields
- Aba ativa
- Accordion state
- Stepper/wizard temporário

O problema é useState para:
- Dados do banco
- Arrays enormes
- Cache manual
- Filtros administrativos (deveriam estar na URL)

**Solução**:
```tsx
// ✅ useState para UI state (manter)
const [isModalOpen, setIsModalOpen] = useState(false);
const [activeTab, setActiveTab] = useState(0);

// ❌ useState para dados do banco (migrar para TanStack Query)
const [products, setProducts] = useState([]); // MIGRAR
const [customers, setCustomers] = useState([]); // MIGRAR

// ❌ useState para filtros administrativos (migrar para URL)
const [currentPage, setCurrentPage] = useState(1); // MIGRAR
const [filter, setFilter] = useState("all"); // MIGRAR

// ✅ Usar URL search params para filtros administrativos
const search = useSearch({
  q: "",
  planoFilter: "all",
  cidadeFilter: "all",
  currentPage: 1,
  pageSize: 15
});

// Estado compartilhável e bookmarkable
```

---

### 7. AuthProvider Monolítico (350 linhas)

**Localização**: `src/modules/auth/context/AuthProvider.tsx`

**Problema**:
```tsx
// Faz TUDO:
- Gerencia sessão
- Busca perfil
- Busca perfil de distribuidor
- Gerencia sponsor
- Gerencia referral tracking
- Login/Logout/Register
- Update profile
- Change role
- Activate distributor office
- Clear sponsor
```

**Impacto**:
- 2 useEffects pesados
- Múltiplas chamadas ao Supabase
- Re-renderizações globais
- Dificuldade de teste

**Solução**:
```tsx
// Separar em hooks especializados
- useAuthSession (apenas sessão)
- useUserProfile (TanStack Query)
- useDistributorProfile (TanStack Query)
- useSponsorTracking (TanStack Query)
- useAuthActions (métodos auth)
```

---

### 8. CartContext com useEffect (206 linhas)

**Localização**: `src/contexts/CartContext.tsx`

**Problema**:
```tsx
useEffect(() => {
  if (!user?.id) {
    setItems([]);
    return;
  }

  const loadCart = async () => {
    setLoading(true);
    try {
      const supabaseItems = await cartService.getCartItems(user.id);
      // ... mapeamento
      setItems(mappedItems);
    } finally {
      setLoading(false);
    }
  };

  loadCart();
}, [user?.id]);
```

**Impacto**:
- Carrinho recarrega a cada mudança de user
- Sem cache
- Sem otimização de updates

**Solução**:
```tsx
const { data: cartItems } = useQuery({
  queryKey: ['cart', user?.id],
  queryFn: () => cartService.getCartItems(user.id),
  enabled: !!user?.id,
  staleTime: 0 // sempre fresco
});
```

---

### 9. ProductsContext com useEffect (123 linhas)

**Localização**: `src/contexts/ProductsContext.tsx`

**Problema**:
```tsx
useEffect(() => {
  loadData();
}, [loadData]);

const loadData = useCallback(async () => {
  try {
    setLoading(true);
    const productsData = await productsService.getAllProducts();
    setProducts(productsData as any);
    // ... extração de categorias
  } finally {
    setLoading(false);
  }
}, []);
```

**Impacto**:
- Produtos carregados em toda a aplicação
- Sem cache
- Sem invalidação
- Categorias recalculadas a cada render

**Solução**:
```tsx
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsService.getAllProducts(),
  staleTime: 10 * 60 * 1000 // 10 minutos
});

const categories = useMemo(() => {
  // extrair categorias de products
}, [products]);
```

---

### 10. DistributorContext com useEffect (128 linhas)

**Localização**: `src/lib/distributor-context.tsx`

**Problema**:
```tsx
useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      setCurrentDistributor(await resolveDistributor(slug));
    } finally {
      setLoading(false);
    }
  })();
}, [slug]);
```

**Impacto**:
- Contexto desnecessário
- Pode ser substituído por loader
- Re-renderizações globais

**Solução**: ELIMINAR - usar loader do TanStack Router

---

## � Análises Adicionais (Faltantes na Auditoria Original)

### 11. Re-render Tree - Quem Renderiza e Por Quê

**Status**: Não analisado - Requer React Profiler

**Problema**: A auditoria identificou "muitos renders" mas não quantificou:
- Quem renderiza?
- Por quê?
- Quantas vezes?
- Qual o custo?

**Solução - FASE 0**:
```bash
# Instalar React DevTools Profiler
npm install --save-dev @welldone-software/why-did-you-render

# Configurar no main.tsx
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
  });
}
```

**Análise necessária**:
```
AppShell
↓ Sidebar (renderiza X vezes)
↓ Outlet
↓ Customers
↓ CustomerTable (renderiza Y vezes)
↓ CustomerRow (renderiza Z vezes)
```

---

### 12. Bundle Analysis - Tamanho e Chunks

**Status**: Não analisado - Requer bundle analyzer

**Problema**: Metade da lentidão pode ser JavaScript, não React.

**Solução - FASE 0**:
```bash
# Instalar bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Configurar no vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      filename: './dist/stats.html'
    })
  ]
});
```

**Análise necessária**:
- Tamanho total do bundle
- Maiores chunks
- Dependências pesadas
- Oportunidades de code splitting

---

### 13. React.memo - Componentes Frequentemente Renderizados

**Status**: Não analisado

**Problema**: Componentes que renderizam centenas de vezes sem motivo:
- Sidebar
- Menu
- Cards
- Table
- Avatar

**Solução - FASE 0**:
```tsx
// Identificar com React Profiler
// Aplicar React.memo onde necessário
const Sidebar = React.memo(function Sidebar({ items }) {
  // ...
});

// Ou usar useMemo para valores derivados
const filteredItems = useMemo(() => 
  items.filter(item => item.active),
  [items]
);
```

---

### 14. Virtualização - Tabelas Grandes

**Status**: Não analisado

**Problema**: Se existem tabelas com 500+ clientes ou 300+ produtos sem virtualização, vai travar.

**Solução - FASE 0**:
```tsx
// Usar react-window ou react-virtual
import { FixedSizeList } from 'react-window';

const CustomerTable = ({ customers }) => (
  <FixedSizeList
    height={600}
    itemCount={customers.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <CustomerRow customer={customers[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

---

### 15. Suspense vs Loading Manual

**Status**: Não analisado

**Problema**: Hoje a aplicação usa muito:
```tsx
const [loading, setLoading] = useState(true);
// ...
setLoading(false);
```

**Solução**:
```tsx
// Com TanStack Query + Suspense
import { Suspense } from 'react';

function CustomersPage() {
  return (
    <Suspense fallback={<CustomerSkeleton />}>
      <CustomerList />
    </Suspense>
  );
}

function CustomerList() {
  const { data } = useSuspenseQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  });
  // data é garantido
}
```

---

### 16. Waterfall - Queries Sequenciais

**Status**: Não analisado

**Problema**: Queries sequenciais que podem ser paralelas:
```tsx
// ❌ Waterfall
const user = await fetchUser();
const company = await fetchCompany(user.companyId);
const orders = await fetchOrders(user.id);
const products = await fetchProducts();
```

**Solução**:
```tsx
// ✅ Paralelo
const [user, company, orders, products] = await Promise.all([
  fetchUser(),
  fetchCompany(),
  fetchOrders(),
  fetchProducts()
]);
```

---

### 17. Network vs React Performance

**Status**: Não analisado

**Problema**: Pode ser que:
- Supabase: 800ms
- React: 50ms

Nesse caso, não adianta refatorar React.

**Solução - FASE 0**:
```bash
# Medir com Chrome DevTools Network tab
# Identificar gargalos de rede vs render
```

---

### 18. Índices do Banco de Dados

**Status**: Não analisado

**Problema**: Consultas sem índice:
```sql
-- Sem índice em usuario
SELECT * FROM mlm.distribuidores WHERE usuario = 'joao';

-- Sem índice em email
SELECT * FROM crm.customers WHERE email = 'joao@email.com';

-- Sem índice em patrocinador_id
SELECT * FROM mlm.distribuidores WHERE patrocinador_id = 'abc123';
```

**Solução - FASE 0**:
```sql
-- Criar índices
CREATE INDEX idx_distribuidores_usuario ON mlm.distribuidores(usuario);
CREATE INDEX idx_customers_email ON crm.customers(email);
CREATE INDEX idx_distribuidores_patrocinador ON mlm.distribuidores(patrocinador_id);
```

---

## �� Estatísticas da Auditoria

### useEffect por Arquivo
- 75 matches em 36 arquivos
- Média de 2.1 useEffects por arquivo
- Top offenders:
  - `src/modules/auth/context/AuthProvider.tsx` (2 useEffects pesados)
  - `src/contexts/CartContext.tsx` (2 useEffects)
  - `src/contexts/ProductsContext.tsx` (2 useEffects)
  - `src/lib/distributor-context.tsx` (2 useEffects)

### useState por Arquivo
- 245 matches em 64 arquivos
- Média de 3.8 useState por arquivo
- Top offenders:
  - `src/routes/cadastro.tsx` (10 useState)
  - `src/routes/auth.invite.$token.tsx` (9 useState)
  - `src/components/ProductSearch.tsx` (7 useState)

### Tamanho de Arquivos
- `src/routes/$slug.tsx`: 494 linhas
- `src/modules/auth/context/AuthProvider.tsx`: 350 linhas
- `src/routes/_app/customers/index.tsx`: 321 linhas
- `src/contexts/CartContext.tsx`: 206 linhas

### Uso de TanStack Router
- 106 rotas com `createFileRoute`
- **0 rotas com loader**
- **0 rotas com prefetch**
- Apenas navegação básica

### Uso de TanStack Query
- QueryClient criado mas subutilizado
- Apenas 2 arquivos usam `useQuery`:
  - `src/components/plans/MLMCommissionSimulator.tsx`
  - `src/routes/_app/system.tsx`
- **Sem cache configurado**
- **Sem staleTime**
- **Sem invalidation**

---

## 🎯 Plano de Refatoração Prioritário (Revisado)

### FASE 0: Performance Baseline (CRÍTICO - Antes de Qualquer Refatoração)

**Objetivo**: Medir tudo antes de refatorar para evitar mudanças desnecessárias.

**Sprint 1 - Semana 1**:
- [ ] Configurar React DevTools Profiler
- [ ] Instalar @welldone-software/why-did-you-render
- [ ] Configurar rollup-plugin-visualizer
- [ ] Rodar `vite build` e analisar bundle
- [ ] Medir Web Vitals (Lighthouse)
- [ ] Medir tempo de rede vs React (Chrome DevTools)
- [ ] Identificar gargalos reais (network vs render vs bundle)

**Entregáveis**:
- Relatório de re-render tree (quem renderiza, por quê, quantas vezes)
- Relatório de bundle analysis (tamanho, chunks, dependências pesadas)
- Relatório de Web Vitals (LCP, FID, CLS)
- Relatório de Network (tempo de Supabase vs React)
- Lista priorizada de gargalos reais

**Importante**: Sem medição, qualquer otimização vira chute.

---

### Fase 1: Eliminar Context API de DADOS (Impacto Alto)

**Arquivos**:
1. Eliminar `DistributorProvider` → usar loaders
2. Eliminar `ProductsContext` → usar TanStack Query
3. Eliminar `CartContext` → usar TanStack Query
4. Eliminar `StoreSettingsContext` → usar TanStack Query
5. Manter `ThemeProvider` (infraestrutura)
6. Manter `AuthProvider` (reduzido - apenas session, user, login, logout)
7. Eliminar `StyleContext` → usar CSS variables

**Benefício**: Redução de 60-80% de renders globais

---

### Fase 2: Implementar Loaders Estratégicos (Impacto Alto)

**Refinamento Arquitetural**: TanStack Router Loader serve para dados necessários antes da tela abrir. Nem tudo deve virar loader.

**Exemplo do que NÃO deve ser loader**:
```tsx
// ❌ Não faz sentido esperar tudo
loader: async () => {
  const [user, orders, charts, alerts, notifications, feed] = await Promise.all([
    fetchUser(),
    fetchOrders(),
    fetchCharts(),
    fetchAlerts(),
    fetchNotifications(),
    fetchFeed()
  ]);
}
```

**Exemplo do que DEVE ser loader**:
```tsx
// ✅ Apenas dados críticos
loader: async ({ params, context }) => {
  return await context.queryClient.ensureQueryData({
    queryKey: ['distributor', params.slug],
    queryFn: () => fetchDistributorBySlug(params.slug)
  });
}

// O resto como queries paralelas no componente
const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
const { data: charts } = useQuery({ queryKey: ['charts'], queryFn: fetchCharts });
```

**Arquivos prioritários**:
1. `src/routes/$slug.tsx` - loader para distribuidor (crítico)
2. `src/routes/seja-distribuidor.$slug.tsx` - loader para distribuidor (crítico)
3. `src/routes/loja.$slug.tsx` - loader para distribuidor (crítico)
4. `src/routes/_app/customers/index.tsx` - loader para metadados (opcional)
5. `src/routes/_app/products/index.tsx` - loader para metadados (opcional)

**Benefício**: Eliminar useEffects de sincronização, dados críticos pré-carregados

---

### Fase 3: Migrar para TanStack Query (Impacto Alto)

**Serviços a migrar**:
1. `SupabaseService.fetchDistributorBySlug` → query
2. `SupabaseService.fetchUserProfile` → query
3. `SupabaseService.fetchDistributorProfile` → query
4. `productsService.getAllProducts` → query
5. `cartService.getCartItems` → query

**Configuração padrão**:
```tsx
{
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 10 * 60 * 1000, // 10 minutos
  retry: 1,
  refetchOnWindowFocus: false
}
```

**Benefício**: Cache automático, deduplicação, background refresh

---

### Fase 4: Quebrar Páginas Monolíticas (Impacto Médio)

**Arquivos**:
1. `src/routes/$slug.tsx` (494 → ~100 linhas)
2. `src/modules/auth/context/AuthProvider.tsx` (350 → ~50 linhas)
3. `src/routes/_app/customers/index.tsx` (321 → ~150 linhas)

**Estrutura**:
- Componentes menores e focados
- Composição em vez de herança
- Separação de concerns

---

### Fase 5: Otimizar Estado Local (Impacto Médio)

**Refinamento Arquitetural**: Não eliminar useState. Migrar apenas useState para:
- Dados do banco → TanStack Query
- Filtros administrativos → URL params
- Arrays enormes → TanStack Query

**Manter useState para**:
- Modal aberto/fechado
- Input fields
- Aba ativa
- Accordion state
- Stepper/wizard temporário

**Substituir por**:
1. URL search params para filtros/paginação administrativos
2. TanStack Query para dados assíncronos
3. React Hook Form para formulários
4. Zustand/Jotai para estado complexo (se necessário)

**Benefício**: Estado compartilhável, bookmarkable, testável

---

### Fase 6: Code Splitting (Impacto Médio)

**Implementar**:
1. Lazy loading de rotas admin
2. Lazy loading de componentes pesados
3. Dynamic imports para bibliotecas grandes

**Benefício**: Redução de 30-40% no bundle inicial

---

### Fase 7: Otimizações Baseadas em FASE 0 (Impacto Variável)

**Depende dos resultados da FASE 0**:
- [ ] Adicionar React.memo em componentes que renderizam excessivamente
- [ ] Implementar virtualização em tabelas grandes (500+ itens)
- [ ] Migrar loading manual para Suspense
- [ ] Converter waterfalls para queries paralelas
- [ ] Criar índices no banco para consultas lentas
- [ ] Otimizar bundle baseado em análise

**Benefício**: Atacar gargalos reais identificados na medição

---

## 📋 Checklist de Implementação (Revisado)

### Sprint 1 - FASE 0: Performance Baseline (Semana 1)
- [ ] Configurar React DevTools Profiler
- [ ] Instalar @welldone-software/why-did-you-render
- [ ] Configurar rollup-plugin-visualizer
- [ ] Rodar `vite build` e analisar bundle
- [ ] Medir Web Vitals (Lighthouse)
- [ ] Medir tempo de rede vs React (Chrome DevTools)
- [ ] Identificar gargalos reais (network vs render vs bundle)
- [ ] Criar relatório de re-render tree
- [ ] Criar relatório de bundle analysis
- [ ] Criar lista priorizada de gargalos

### Sprint 2 - Fase 1: Eliminar Context API de DADOS (Semana 2)
- [ ] Eliminar DistributorProvider
- [ ] Eliminar ProductsContext
- [ ] Eliminar CartContext
- [ ] Eliminar StoreSettingsContext
- [ ] Eliminar StyleContext
- [ ] Reduzir AuthProvider (apenas session, user, login, logout)
- [ ] Manter ThemeProvider (infraestrutura)

### Sprint 3 - Fase 2: Implementar Loaders Estratégicos (Semana 3)
- [ ] Implementar loader em $slug.tsx (crítico)
- [ ] Implementar loader em seja-distribuidor.$slug.tsx (crítico)
- [ ] Implementar loader em loja.$slug.tsx (crítico)
- [ ] Eliminar useEffect de sincronização em rotas com slug

### Sprint 4 - Fase 3: Migrar para TanStack Query (Semana 4)
- [ ] Migrar fetchDistributorBySlug para TanStack Query
- [ ] Migrar fetchUserProfile para TanStack Query
- [ ] Migrar fetchDistributorProfile para TanStack Query
- [ ] Migrar productsService.getAllProducts para TanStack Query
- [ ] Migrar cartService.getCartItems para TanStack Query
- [ ] Configurar staleTime padrão (5 minutos)

### Sprint 5 - Fase 4: Quebrar Páginas Monolíticas (Semana 5)
- [ ] Quebrar $slug.tsx em componentes (494 → ~100 linhas)
- [ ] Refatorar AuthProvider (350 → ~50 linhas)
- [ ] Quebrar _app/customers/index.tsx em componentes (321 → ~150 linhas)

### Sprint 6 - Fase 5: Otimizar Estado Local (Semana 6)
- [ ] Migrar filtros administrativos para URL params
- [ ] Migrar dados do banco de useState para TanStack Query
- [ ] Manter useState para UI state (modais, inputs, abas)

### Sprint 7 - Fase 6: Code Splitting (Semana 7)
- [ ] Lazy loading de rotas admin
- [ ] Lazy loading de componentes pesados
- [ ] Dynamic imports para bibliotecas grandes

### Sprint 8 - Fase 7: Otimizações Baseadas em FASE 0 (Semana 8)
- [ ] Adicionar React.memo (se necessário)
- [ ] Implementar virtualização (se necessário)
- [ ] Migrar para Suspense (se necessário)
- [ ] Converter waterfalls para paralelo (se necessário)
- [ ] Criar índices no banco (se necessário)
- [ ] Otimizar bundle (se necessário)

---

## 🎓 Padrões Recomendados

### Padrão 1: Loader + Query
```tsx
// loader
export const Route = createFileRoute("/$slug")({
  loader: async ({ params, context }) => {
    return await context.queryClient.ensureQueryData({
      queryKey: ['distributor', params.slug],
      queryFn: () => fetchDistributorBySlug(params.slug)
    });
  },
  component: DistributorPage
});

// componente
function DistributorPage() {
  const params = useParams({ from: "/$slug" });
  const { data: distributor } = useSuspenseQuery({
    queryKey: ['distributor', params.slug],
    queryFn: () => fetchDistributorBySlug(params.slug)
  });
  
  return <DistributorProfile distributor={distributor} />;
}
```

### Padrão 2: URL Params para Filtros
```tsx
const search = useSearch({
  q: "",
  filter: "all",
  page: 1
});

// URL: /customers?q=joao&filter=active&page=2
// Bookmarkable, compartilhável, estado único
```

### Padrão 3: Componentes Pequenos
```tsx
// ❌ Monolítico
function CustomersPage() {
  // 321 linhas
}

// ✅ Composto
function CustomersPage() {
  const { data } = useCustomers();
  return (
    <>
      <CustomerHeader stats={data.stats} />
      <CustomerFilters />
      <CustomerTable customers={data.customers} />
      <CustomerPagination />
    </>
  );
}
```

---

## 📈 Métricas de Sucesso

### Antes
- Tempo de navegação: 2-4 segundos
- Renders por navegação: 4-8
- Chamadas ao Supabase: 5-10 por página
- Bundle inicial: ~2MB

### Depois (Estimado)
- Tempo de navegação: 0.5-1 segundo
- Renders por navegação: 1-2
- Chamadas ao Supabase: 1-3 por página
- Bundle inicial: ~1.2MB

---

## 🔗 Recursos

### Documentação
- [TanStack Router Loaders](https://tanstack.com/router/latest/docs/framework/react/guide/loaders)
- [TanStack Query Caching](https://tanstack.com/query/latest/docs/react/guides/caching)
- [React Performance](https://react.dev/learn/render-and-commit)

### Ferramentas
- React DevTools Profiler
- TanStack Query DevTools
- Bundle analyzer

---

## Conclusão (Revisada)

A arquitetura atual sofre de **problemas sistêmicos** que causam lentidão generalizada. O problema central identificado é: **a aplicação usa Context API como mecanismo de carregamento de dados, enquanto já possui TanStack Router e TanStack Query, mas quase não aproveita seus recursos**. Isso cria acoplamento, renderizações em cascata e consultas repetidas.

### Problemas Confirmados
1. **Context API de DADOS como store global** (4 providers de dados aninhados)
2. **useEffect para sincronização de URL → Contexto** (anti-pattern em 3 rotas)
3. **Chamadas diretas ao Supabase sem cache** (11+ chamadas diretas)
4. **Páginas monolíticas** (300-500 linhas com responsabilidades misturadas)
5. **useState para dados do banco** (245 matches, mas apenas parte é problema)

### Correções Importantes da Revisão Arquitetural
- **Context API não é ruim per se** - excelente para infraestrutura (Theme, Auth Session, Locale, Feature Flags), ruim para dados (produtos, clientes, pedidos)
- **Nem tudo deve virar Loader** - apenas dados críticos pré-carregados, o resto como queries paralelas
- **useState não é o problema** - perfeito para UI state (modais, inputs, abas), problema apenas para dados do banco e filtros administrativos
- **Medição antes de refatoração** - FASE 0 de performance baseline é crítica para evitar mudanças desnecessárias

### O Que Faltou na Auditoria Original
- Re-render tree (quem renderiza, por quê, quantas vezes)
- Bundle analysis (tamanho, chunks, dependências pesadas)
- React.memo (quais componentes renderizam centenas de vezes)
- Virtualização (tabelas com 500+ itens)
- Suspense (vs loading manual)
- Waterfall (queries sequenciais vs paralelas)
- Network vs React (Supabase 800ms vs React 50ms)
- Índices do banco (consultas sem índice)

### Plano Reforçado
A implementação do plano de refatoração revisado deve resultar em **melhoria de 70-90% no tempo de navegação**, mas isso exige uma **reestruturação arquitetural gradual** com medição baseline primeiro (FASE 0), não apenas otimizações pontuais.

### Próximos Passos Imediatos
1. **Sprint 1 (Semana 1)**: Configurar ferramentas de medição, rodar React Profiler, bundle analyzer, Lighthouse, identificar gargalos reais
2. **Sprint 2-8**: Refatoração gradual baseada em dados reais da FASE 0, não em suposições

A boa notícia é que a base tecnológica (React + TanStack Router + TanStack Query + Supabase) já oferece praticamente tudo o que é necessário para alcançar esse resultado.
