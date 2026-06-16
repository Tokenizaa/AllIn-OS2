





# Análise do Frontend - Documento analise_global_refat_geral.md

## Resumo da Arquitetura Atual

**Stack:** Vite + React + TanStack Router (file-based routing)

**Estrutura Principal:**
- Rotas em [src/routes](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/routes:0:0-0:0) (file-based)
- Componentes em [src/components](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/components:0:0-0:0)
- Services/Hooks em [src/services](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services:0:0-0:0), [src/hooks](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks:0:0-0:0), `src/lib/api`
- Integração direta com Supabase
- Backend completo em [src/backend](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend:0:0-0:0) (mesmo workspace)

## 🔴 Problemas Críticos Identificados

### 1. Mistura Frontend + Backend no Mesmo Workspace

**Problema:** [src/backend](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend:0:0-0:0) contém módulos, repositórios, APIs e serviços completos no mesmo workspace do frontend.

**Impacto:**
- Dificulta distinguir código browser vs server
- Aumenta ruído arquitetural
- Viola separação de concerns

**Status:** ❌ **CRÍTICO**

---

### 2. Camadas Duplicadas de Acesso a Dados

**Problema:** [src/services](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services:0:0-0:0) e `src/lib/api` têm responsabilidades sobrepostas.

**Exemplo:**
- [src/services/productsService.ts](cci:7://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/productsService.ts:0:0-0:0) vs `src/services/products/index.ts`
- `src/lib/api/plans.functions.ts` vs [src/services/plans](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/plans:0:0-0:0)
- Hooks que acessam Supabase diretamente

**Impacto:**
- Difícil padronizar cache, erros, invalidação
- Confusão sobre qual camada usar
- Manutenção complexa

**Status:** ❌ **ALTA PRIORIDADE**

---

### 3. Acesso Direto ao Banco em Muitos Pontos

**Problema:** Hooks e services importam `supabase` ou `supabase-client` diretamente.

**Exemplos identificados no documento:**
- `src/hooks/mutations/wallets/useUpdateWalletBalance.ts`
- `src/hooks/marketing/useCampaigns.ts`

**Impacto:**
- Lógica de dados espalhada
- Difícil testar
- Viola princípio de encapsulamento

**Status:** ❌ **ALTA PRIORIDADE**

---

### 4. Segurança Frágil no Client Supabase

**Problema:** [src/lib/supabase/client.ts](cci:7://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase/client.ts:0:0-0:0) não loga mais env vars (foi corrigido), mas ainda expõe [getBackendClient()](cci:1://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/lib/supabase/client.ts:80:0-113:1) que pode ser chamado do browser.

**Análise atual do código:**
```typescript
export function getBackendClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION...");
  }
  // ...
}
```

**Status:** ✅ **PARCIALMENTE CORRIGIDO** (tem validação de window)

---

### 5. Legado e Duplicidade

**Problemas identificados:**
- `src/routes/office/reports.tsx.bak` (arquivo abandonado)
- Duplicidade semântica: [products](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/products:0:0-0:0) vs `produtos` (tabelas diferentes)
- `productsService` vs `services/products/index.ts`

**Status:** ⚠️ **MÉDIA PRIORIDADE**

---

### 6. RBAC Depende de Convenção por Path

**Problema:** [RouteGuard.tsx](cci:7://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/modules/auth/guards/RouteGuard.tsx:0:0-0:0) usa regex por rota para mapear permissões.

```typescript
const PATH_PERMISSION_MAP = [
  { pattern: /^\/system(?:\/|$)/, permission: { module: "system", action: "read" } },
  { pattern: /^\/wallets(?:\/|$)/, permission: { module: "finance", action: "read" } },
  // ...
];
```

**Risco:** Fácil esquecer de atualizar matriz ao adicionar rotas novas.

**Status:** ⚠️ **MÉDIA PRIORIDADE**

---

### 7. Mistura de Dados de Domínio com UI

**Problema:** Componentes de domínio espalhados em `src/components/*` e `src/routes/*`.

**Exemplos:**
- [src/components/customers/](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/customers:0:0-0:0)
- [src/components/plans/](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/plans:0:0-0:0)
- [src/components/distributor/](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/components/distributor:0:0-0:0)
- Páginas com muita lógica de montagem local

**Impacto:** Reduz clareza de ownership.

**Status:** ⚠️ **MÉDIA PRIORIDADE**

---

## 📊 Inventário Atual (Validado)

### Rotas: 100+ rotas documentadas
- Públicas: 17 rotas
- Autenticadas (_app): 20 rotas
- Office: 12 rotas

### Componentes: 158 arquivos
- UI genérica: 44 componentes
- Domain components: customers, plans, payments, distributor, etc.
- Layout: sidebar, topbar, copilot-drawer
- Features: cart, products

### Services: 38 arquivos
- Domain services: products, plans, payments, orders, customers, network, finance
- 360 services: profile360, finance360, mlm360, crm360
- Helpers: featureFlags, documents, referralTracking

### Hooks: 56 arquivos
- Por domínio: products, plans, payments, orders, customers, network, finance, analytics, office, marketing, mlm, alerts, copilot, audit
- Mutations: wallets

---

## 🎯 Plano de Refatoração Priorizado

### Fase 1: Separação Frontend/Backend (CRÍTICA - 1-2 semanas)

**1.1 Mover Backend para Repositório Separado**
- Criar monorepo ou mover [src/backend](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend:0:0-0:0) para repositório dedicado
- Configurar workspace separado
- Estabelecer contrato de API entre frontend e backend
- **Estimativa:** 3-5 dias

**1.2 Definir Contrato de API**
- Documentar endpoints REST/GraphQL que frontend consumirá
- Criar tipos TypeScript compartilhados
- Implementar client HTTP centralizado
- **Estimativa:** 2-3 dias

---

### Fase 2: Unificar Camada de Acesso a Dados (ALTA - 1-2 semanas)

**2.1 Consolidar Services vs API Helpers**
- Decidir qual camada manter (recomendado: [src/services](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services:0:0-0:0) como única camada)
- Migrar lógica de `src/lib/api` para [src/services](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services:0:0-0:0)
- Remover duplicações
- **Estimativa:** 3-4 dias

**2.2 Remover Acesso Direto ao Supabase**
- Criar wrappers para todas as operações de banco
- Centralizar queries em services
- Atualizar hooks para usar services
- **Estimativa:** 4-5 dias

**2.3 Implementar Cache Centralizado**
- Adicionar camada de cache (React Query ou similar)
- Padronizar invalidação de cache
- **Estimativa:** 2-3 dias

---

### Fase 3: Limpeza de Legado (MÉDIA - 1 semana)

**3.1 Remover Arquivos Legado**
- Deletar `src/routes/office/reports.tsx.bak`
- Remover componentes não utilizados
- **Estimativa:** 1 dia

**3.2 Unificar Nomenclatura de Tabelas**
- Decidir entre [products](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/products:0:0-0:0) vs `produtos`
- Migrar dados se necessário
- Atualizar todos os references
- **Estimativa:** 2-3 dias

**3.3 Consolidar Services Duplicados**
- Unificar `productsService` e `services/products/index.ts`
- Remover duplicações em outros domínios
- **Estimativa:** 2-3 dias

---

### Fase 4: Melhorar RBAC (MÉDIA - 3-5 dias)

**4.1 Automatizar Mapeamento de Permissões**
- Criar decorator ou metadata para rotas
- Gerar `PATH_PERMISSION_MAP` automaticamente
- Adicionar testes para garantir cobertura
- **Estimativa:** 2-3 dias

**4.2 Adicionar Validação em Tempo de Build**
- Verificar se todas as rotas têm permissões mapeadas
- Falhar build se houver rotas sem permissão
- **Estimativa:** 1-2 dias

---

### Fase 5: Separar Domínio de UI (BAIXA - 1-2 semanas)

**5.1 Criar View-Models**
- Extrair lógica de componentes para view-models
- Usar hooks como orquestradores
- **Estimativa:** 3-5 dias

**5.2 Reorganizar Componentes de Domínio**
- Mover componentes de domínio para `src/features/`
- Manter [src/components](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/components:0:0-0:0) apenas para UI genérica
- **Estimativa:** 2-3 dias

**5.3 Criar Padrão de Feature Modules**
- Estrutura: `src/features/[domain]/components/`, [hooks/](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/hooks:0:0-0:0), [services/](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services:0:0-0:0)
- Aplicar a 2-3 domínios como exemplo
- **Estimativa:** 3-4 dias

---

### Fase 6: Documentação (BAIXA - 1 semana)

**6.1 Criar Tabela Página → Componentes → Hooks → Banco**
- Documentar fluxo de dados por página
- Mapear dependências
- **Estimativa:** 2-3 dias

**6.2 Criar Mapa Visual de Dependências**
- Usar ferramenta de visualização
- Documentar camadas críticas
- **Estimativa:** 2 dias

**6.3 Criar Checklist de Refatoração**
- Documentar padrões a seguir
- Criar guia de contribuição
- **Estimativa:** 1-2 dias

---

## 📋 Checklist Imediato (Próximos 2 Semanas)

- [ ] Decidir arquitetura: monorepo vs repositórios separados
- [ ] Criar contrato de API inicial
- [ ] Consolidar [src/services](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services:0:0-0:0) e `src/lib/api`
- [ ] Remover arquivos `.bak`
- [ ] Unificar nomenclatura [products](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services/products:0:0-0:0) vs `produtos`
- [ ] Adicionar validação de build para RBAC

---

## 🎯 Recomendação Imediata

**Priorizar Fase 1 (Separação Frontend/Backend)** pois é o problema mais crítico e impacta todas as outras decisões arquiteturais. Sem essa separação, qualquer refatoração será temporária e propensa a regressões.

Análise concluída. O documento identifica 7 problemas arquiteturais no frontend, sendo os mais críticos:

1. **Mistura frontend/backend** - [src/backend](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/backend:0:0-0:0) no mesmo workspace
2. **Camadas duplicadas** - [src/services](cci:9://file:///c:/Users/LG/Downloads/netto1/AllIn-OS2/src/services:0:0-0:0) e `src/lib/api` com responsabilidades sobrepostas
3. **Acesso direto ao banco** - Hooks importando Supabase diretamente

Criei um plano de refatoração em 6 fases priorizadas, começando pela separação frontend/backend (Fase 1). O documento também oferece transformar a auditoria em documentação mais formal com tabelas de mapeamento e mapas de dependências.

Qual ação você gostaria que eu execute?