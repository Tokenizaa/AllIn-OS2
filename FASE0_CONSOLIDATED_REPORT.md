# FASE 0 - Relatório Consolidado de Performance Baseline

## Data: 2026-06-18

## Objetivo
Medir performance baseline antes de qualquer refatoração para identificar gargalos reais e evitar mudanças desnecessárias.

## Ferramentas Configuradas

✅ React DevTools Profiler (via @welldone-software/why-did-you-render)
✅ Bundle Analyzer (via rollup-plugin-visualizer)
✅ Build analysis realizado

## Achados Críticos

### 1. Bundle Principal Enorme (🚨 PRIORIDADE MÁXIMA)

**Problema**: Chunk principal com 1,031.17 kB (gzip: 254.66 kB)

**Impacto**:
- 49.5% do bundle total está no chunk principal
- Todo o código carrega antes de qualquer interação
- Usuários públicos carregam código admin
- Usuários admin carregam código público que nunca visitam
- Tempo de carregamento inicial muito alto

**Causa Raiz**:
- Falta de code splitting por rota
- Todas as rotas (públicas e admin) no mesmo chunk
- Nenhum lazy loading implementado

**Benefício da Correção**: Redução estimada de 60-70% no chunk inicial

---

### 2. Arquivos Monolíticos Confirmados (🔴 PRIORIDADE ALTA)

**Problema**: Múltiplos arquivos > 15 KB com responsabilidades misturadas

**Arquivos identificados**:
- $slug.tsx: 26.38 KB (494 linhas) - rota pública com múltiplas responsabilidades
- industrial.api.ts: 26.36 KB - API service
- sidebar.tsx: 24.2 KB - componente UI
- ativacao.tsx: 22.39 KB - rota pública
- allin.service.ts: 21.35 KB - API service
- user-management.tsx: 18.9 KB - componente admin
- http-client.ts: 18.83 KB - utilitário HTTP
- sync.service.ts: 16.51 KB - service
- ProductInfo.tsx: 16.2 KB - componente
- auth.invite.$token.tsx: 15.64 KB - rota auth

**Impacto**:
- Dificuldade de manutenção
- Baixa reutilização
- Contribuem para o bundle grande

**Benefício da Correção**: Melhoria na manutenibilidade e redução do bundle

---

### 3. Context API como Store Global (🔴 PRIORIDADE ALTA)

**Problema**: 7 providers aninhados, 4 deles para dados

**Providers identificados**:
- QueryClientProvider (infraestrutura - OK)
- ThemeProvider (infraestrutura - OK)
- AuthProvider (dados + infraestrutura - REDUZIR)
- DistributorProvider (dados - ELIMINAR)
- StoreSettingsProvider (dados - ELIMINAR)
- CartProvider (dados - ELIMINAR)
- ProductsProvider (dados - ELIMINAR)
- StyleProvider (infraestrutura - OK)

**Impacto**:
- Re-renderizações globais
- Cascata de renders
- Dados carregados via useEffect sem cache

**Benefício da Correção**: Redução estimada de 60-80% de renders globais

---

### 4. useEffect para Sincronização de URL (🔴 PRIORIDADE ALTA)

**Problema**: 3 rotas usando useEffect para copiar URL para Context

**Arquivos identificados**:
- $slug.tsx (linhas 28-32)
- seja-distribuidor.$slug.tsx (linhas 28-32)
- loja.$slug.tsx (linhas 35-39)

**Impacto**:
- 2-4 renders por navegação
- Cascata de re-renderizações
- Anti-pattern (URL já é o estado)

**Benefício da Correção**: Eliminação de renders desnecessários

---

### 5. Chamadas Diretas ao Supabase sem Cache (🟡 PRIORIDADE MÉDIA)

**Problema**: 11+ chamadas diretas sem TanStack Query

**Impacto**:
- Sem cache
- Sem deduplicação
- Sem staleTime
- N+1 queries possíveis

**Benefício da Correção**: Redução estimada de 70-90% de chamadas ao Supabase

---

### 6. CSS Grande (🟡 PRIORIDADE MÉDIA)

**Problema**: CSS com 175.29 kB (gzip: 24.44 kB)

**Impacto**:
- Possivelmente Tailwind sem purging adequado
- Estilos não utilizados sendo incluídos

**Benefício da Correção**: Redução de 10-20% no CSS

---

## Lista Priorizada de Gargalos

### 🚨 Sprint 1 (Semana 2) - Code Splitting (IMPACTO: MUITO ALTO)

1. **Implementar lazy loading por rota**
   - Separar rotas públicas de admin
   - Lazy loading de cada rota individual
   - Meta: Chunk inicial < 300 kB (gzip)
   - Benefício: Redução de 60-70% no chunk inicial

### 🔴 Sprint 2 (Semana 3) - Eliminar Context API de DADOS (IMPACTO: ALTO)

2. **Eliminar DistributorProvider**
   - Migrar para TanStack Query
   - Usar loader do TanStack Router
   - Benefício: Redução de renders globais

3. **Eliminar ProductsProvider**
   - Migrar para TanStack Query
   - Benefício: Redução de renders globais

4. **Eliminar CartProvider**
   - Migrar para TanStack Query
   - Benefício: Redução de renders globais

5. **Eliminar StoreSettingsProvider**
   - Migrar para TanStack Query
   - Benefício: Redução de renders globais

6. **Reduzir AuthProvider**
   - Manter apenas: session, user, login, logout
   - Migrar resto para TanStack Query
   - Benefício: Redução de renders globais

### 🔴 Sprint 3 (Semana 4) - Implementar Loaders Estratégicos (IMPACTO: ALTO)

7. **Implementar loader em $slug.tsx**
   - Dados críticos pré-carregados
   - Eliminar useEffect de sincronização
   - Benefício: Eliminar renders desnecessários

8. **Implementar loader em seja-distribuidor.$slug.tsx**
   - Dados críticos pré-carregados
   - Eliminar useEffect de sincronização
   - Benefício: Eliminar renders desnecessários

9. **Implementar loader em loja.$slug.tsx**
   - Dados críticos pré-carregados
   - Eliminar useEffect de sincronização
   - Benefício: Eliminar renders desnecessários

### 🟡 Sprint 4 (Semana 5) - Migrar para TanStack Query (IMPACTO: ALTO)

10. **Migrar SupabaseService.fetchDistributorBySlug**
    - Configurar staleTime: 5 minutos
    - Benefício: Cache automático, deduplicação

11. **Migrar SupabaseService.fetchUserProfile**
    - Configurar staleTime: 5 minutos
    - Benefício: Cache automático, deduplicação

12. **Migrar SupabaseService.fetchDistributorProfile**
    - Configurar staleTime: 5 minutos
    - Benefício: Cache automático, deduplicação

13. **Migrar productsService.getAllProducts**
    - Configurar staleTime: 10 minutos
    - Benefício: Cache automático, deduplicação

14. **Migrar cartService.getCartItems**
    - Configurar staleTime: 0 (sempre fresco)
    - Benefício: Cache automático, deduplicação

### 🟡 Sprint 5 (Semana 6) - Quebrar Páginas Monolíticas (IMPACTO: MÉDIO)

15. **Quebrar $slug.tsx em componentes**
    - 494 → ~100 linhas
    - Separar responsabilidades
    - Benefício: Manutenibilidade

16. **Refatorar AuthProvider**
    - 350 → ~50 linhas
    - Separar hooks especializados
    - Benefício: Manutenibilidade

17. **Quebrar _app/customers/index.tsx em componentes**
    - 321 → ~150 linhas
    - Separar responsabilidades
    - Benefício: Manutenibilidade

### 🟢 Sprint 6 (Semana 7) - Otimizar Estado Local (IMPACTO: MÉDIO)

18. **Migrar filtros administrativos para URL params**
    - Estado compartilhável e bookmarkable
    - Benefício: UX melhorada

19. **Migrar dados do banco de useState para TanStack Query**
    - Apenas dados do banco
    - Manter useState para UI state
    - Benefício: Cache automático

### 🟢 Sprint 7 (Semana 8) - Otimizações Adicionais (IMPACTO: VARIÁVEL)

20. **Otimizar CSS**
    - Verificar purging do Tailwind
    - Remover estilos não utilizados
    - Benefício: Redução de 10-20% no CSS

21. **Lazy loading de componentes pesados**
    - Gráficos, tabelas complexas
    - Benefício: Redução de 10-15% no chunk inicial

22. **Adicionar React.memo onde necessário**
    - Baseado em análise do React Profiler
    - Benefício: Redução de renders

23. **Implementar virtualização em tabelas grandes**
    - Se existirem tabelas com 500+ itens
    - Benefício: Performance de scroll

---

## Métricas Atuais vs Meta

### Bundle Size

| Métrica | Atual | Meta | Status |
|---------|-------|------|--------|
| Chunk principal (bruto) | 1,031 kB | < 500 kB | 🔴 Crítico |
| Chunk principal (gzip) | 255 kB | < 200 kB | 🔴 Crítico |
| Bundle total (gzip) | 542 kB | < 300 kB | 🔴 Crítico |

### Performance

| Métrica | Atual | Meta | Status |
|---------|-------|------|--------|
| Tempo de navegação | 2-4s | < 1s | 🔴 Crítico |
| Renders por navegação | 4-8 | 1-2 | 🔴 Crítico |
| Chamadas ao Supabase | 5-10/página | 1-3/página | 🔴 Crítico |

---

## Conclusão

A FASE 0 confirmou os problemas identificados na auditoria e revelou o gargalo principal: **bundle principal enorme devido à falta de code splitting**.

**Próximo passo imediato**: Implementar code splitting por rota (Sprint 1) para reduzir o chunk inicial em 60-70%.

**Impacto estimado total**: Melhoria de 70-90% no tempo de navegação após implementação completa do plano.

---

## Relatórios Detalhados

- [Bundle Analysis](./FASE0_BUNDLE_ANALYSIS.md)
- [Large Files Analysis](./FASE0_LARGE_FILES_ANALYSIS.md)
- [Auditoria Estrutural Completa](./AUDITORIA_ESTRUTURAL_COMPLETA.md)
