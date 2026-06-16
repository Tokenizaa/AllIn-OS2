# Plano de Migração de Services para HTTP Client

## Status Atual

A Fase 2 da refatoração frontend/backend foi concluída com sucesso:
- ✅ Fase 2.1: Consolidar services vs API helpers (removido `src/lib/api`)
- ✅ Fase 2.2: Remover acesso direto ao Supabase (hooks já usam services)
- ✅ Fase 2.3: Implementar cache centralizado (React Query configurado)

## Services que Ainda Usam Supabase Diretamente

Os seguintes services em `src/services/` ainda acessam o Supabase diretamente. Eles funcionam como uma camada de abstração adequada, mas podem ser migrados para usar o HTTP client no futuro.

### Alta Prioridade (Core Business)

1. **src/services/customers/index.ts**
   - `fetchCustomerById()`
   - `fetchCustomers()`
   - `createCustomer()`
   - `updateCustomer()`
   - **Razão:** Core do sistema de clientes
   - **Complexidade:** Alta

2. **src/services/plans/index.ts**
   - `fetchActivePlans()`
   - `fetchPlanById()`
   - **Razão:** Sistema de planos MLM
   - **Complexidade:** Média

3. **src/services/orders/index.ts**
   - `fetchOrdersForDashboard()`
   - `fetchOrderById()`
   - **Razão:** Sistema de pedidos
   - **Complexidade:** Alta

4. **src/services/payments/index.ts**
   - `fetchPaymentsForDashboard()`
   - **Razão:** Sistema de pagamentos
   - **Complexidade:** Alta

### Média Prioridade

5. **src/services/products/index.ts**
   - `fetchProducts()`
   - **Razão:** Catálogo de produtos
   - **Complexidade:** Média

6. **src/services/wallets/index.ts**
   - `fetchWalletByidComprador()`
   - **Razão:** Sistema de carteiras
   - **Complexidade:** Média

7. **src/services/network/index.ts**
   - `fetchNetworkRelationships()`
   - **Razão:** Sistema de rede MLM
   - **Complexidade:** Alta

### Baixa Prioridade

8. **src/services/profiles/index.ts**
   - `fetchUserProfile()`
   - **Razão:** Perfis de usuário
   - **Complexidade:** Baixa

9. **src/services/leads/index.ts**
   - `fetchLeads()`
   - **Razão:** Sistema de leads
   - **Complexidade:** Baixa

10. **src/services/featureFlags.ts**
    - `fetchFeatureFlags()`
    - **Razão:** Feature flags
    - **Complexidade:** Baixa

## Estratégia de Migração

### Pré-requisitos

1. **Backend HTTP Server** já está implementado (Fase 1)
2. **HTTP Client** já está configurado (Fase 1)
3. **Tipos compartilhados** já estão definidos (Fase 1)

### Passos para Migração de Cada Service

1. **Verificar se o endpoint existe no backend HTTP server**
   - Se não existir, adicionar a rota em `src/backend/server/routes/`
   - Adicionar o método correspondente no `src/lib/api-client/http-client.ts`

2. **Migrar o service para usar o HTTP client**
   - Substituir `supabase.from('table').select()` por `httpClient.method()`
   - Manter a mesma interface do service para não quebrar hooks

3. **Atualizar tipos se necessário**
   - Usar tipos de `shared/types/api.types.ts`
   - Garantir compatibilidade com hooks existentes

4. **Testar**
   - Verificar se hooks funcionam corretamente
   - Validar cache do React Query

5. **Remover import do Supabase**
   - Remover `import { supabase } from "@/lib/supabase-client"`

## Ordem Sugerida de Migração

1. **Fase 3.1:** Services de alta prioridade (customers, plans, orders, payments)
2. **Fase 3.2:** Services de média prioridade (products, wallets, network)
3. **Fase 3.3:** Services de baixa prioridade (profiles, leads, featureFlags)

## Benefícios da Migração

- **Separação completa frontend/backend:** Frontend não acessa banco diretamente
- **Segurança:** Frontend usa apenas API HTTP, não tem credenciais de banco
- **Escalabilidade:** Backend pode ser movido para servidor separado
- **Manutenibilidade:** Contrato de API claro e documentado
- **Testabilidade:** Facilita testes com mocks da API

## Notas

- A migração não é urgente pois os services já funcionam como camada de abstração
- A prioridade deve ser dada a features críticas do negócio
- Cada service pode ser migrado independentemente
- Hooks não precisam ser alterados se a interface do service for mantida
