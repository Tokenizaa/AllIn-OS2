# FASE 16 — ALINHAMENTO BACKEND E FRONTEND

**Data**: 8 de Junho de 2026  
**Projeto**: sistema-allin  
**Status**: EM ANDAMENTO

---

## Resumo Executivo

O backend e frontend ainda usam `customer_id` (UUID) em muitos lugares, mas as tabelas do banco foram consolidadas para usar `id_comprador` (TEXT) como identificador principal. É necessário migrar todo o código para usar o padrão legado.

---

## Análise de Uso de customer_id

### Backend (558 ocorrências em 60 arquivos)

**Arquivos mais críticos:**
1. wallet.service.ts (35 matches)
2. payment.handlers.ts (33 matches)
3. bonus-wallet.service.ts (31 matches)
4. points-wallet.service.ts (31 matches)
5. qualification.service.ts (27 matches)
6. realtime-payment.service.ts (23 matches)
7. hybrid-payment.service.ts (21 matches)
8. wallet.functions.ts (20 matches)
9. bonus-wallet.functions.ts (19 matches)
10. points-wallet.functions.ts (19 matches)

### Frontend (123 ocorrências em 37 arquivos)

**Arquivos mais críticos:**
1. commission.service.ts (11 matches)
2. bonus.functions.ts (11 matches)
3. qualification.service.ts (9 matches)
4. payment.service.ts (8 matches)
5. analytics-update.service.ts (6 matches)
6. network/index.ts (6 matches)
7. plans.functions.ts (5 matches)
8. genealogy.tsx (5 matches)
9. order.service.ts (4 matches)
10. discount-engine.service.ts (4 matches)

---

## Problema Identificado

**Incompatibilidade entre Código e Banco:**

- **Código**: Usa `customer_id` (UUID)
- **Banco**: Usa `id_comprador` (TEXT)

**Impacto:**
- Queries falharão ao tentar acessar tabelas com `customer_id`
- Sistema não funcionará após consolidação do banco
- Erros em tempo de execução

---

## Plano de Migração

### FASE 1: Backend - Serviços Core

**Arquivos a atualizar:**

1. **wallet.service.ts** (35 matches)
   - Mudar `customer_id` para `id_comprador`
   - Atualizar interface Wallet
   - Atualizar todos os métodos

2. **bonus-wallet.service.ts** (31 matches)
   - Mudar `customer_id` para `id_comprador`
   - Atualizar interface BonusWallet
   - Atualizar todos os métodos

3. **points-wallet.service.ts** (31 matches)
   - Mudar `customer_id` para `id_comprador`
   - Atualizar interface PointsWallet
   - Atualizar todos os métodos

4. **payment.service.ts** (8 matches)
   - Mudar `customer_id` para `id_comprador`
   - Atualizar DTOs
   - Atualizar queries

5. **qualification.service.ts** (27 matches)
   - Mudar `customer_id` para `id_comprador`
   - Atualizar interfaces
   - Atualizar queries

### FASE 2: Backend - Functions

**Arquivos a atualizar:**

1. **wallet.functions.ts** (20 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar schemas de validação
   - Atualizar chamadas de serviço

2. **bonus-wallet.functions.ts** (19 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar schemas de validação
   - Atualizar chamadas de serviço

3. **points-wallet.functions.ts** (19 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar schemas de validação
   - Atualizar chamadas de serviço

4. **bonus.functions.ts** (11 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar queries

5. **plans.functions.ts** (5 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar queries

### FASE 3: Backend - Handlers e APIs

**Arquivos a atualizar:**

1. **payment.handlers.ts** (33 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar lógica de handlers

2. **realtime-payment.service.ts** (23 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar lógica de pagamento

3. **hybrid-payment.service.ts** (21 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar lógica de pagamento

4. **fraud-detection.service.ts** (13 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar lógica de detecção

### FASE 4: Frontend - Hooks

**Arquivos a atualizar:**

1. **useWalletData.ts** (11 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar query keys
   - Atualizar chamadas de API

2. **useWalletActions.ts** (5 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar ações

3. **useCustomer360.ts** (8 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar queries

4. **useCustomer360Data.ts** (8 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar queries

### FASE 5: Frontend - Componentes

**Arquivos a atualizar:**

1. **genealogy.tsx** (7 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar queries de rede

2. **orders/index.tsx** (4 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar queries de pedidos

3. **wallet-dashboard.tsx** (4 matches)
   - Mudar `customerId` para `idComprador`
   - Atualizar exibição de carteira

---

## Estratégia de Migração

### Opção A: Substituição Global (Recomendada)

**Vantagens:**
- Mais rápido
- Consistente
- Menos chance de esquecer algo

**Desvantagens:**
- Pode quebrar código que realmente precisa de UUID

**Implementação:**
1. Usar find/replace global de `customerId` para `idComprador`
2. Revisar manualmente casos especiais
3. Atualizar tipos TypeScript
4. Testar sistema completo

### Opção B: Migração Gradual

**Vantagens:**
- Mais seguro
- Permite testar por módulo

**Desvantagens:**
- Mais lento
- Maior chance de inconsistência temporária

**Implementação:**
1. Migrar módulo por módulo
2. Testar cada módulo
3. Manter compatibilidade temporária
4. Remover código antigo após validação

---

## Recomendação

**Adotar Opção A (Substituição Global)** com as seguintes precauções:

1. **Backup completo** do código antes de iniciar
2. **Substituição global** de `customerId` → `idComprador`
3. **Atualização de tipos** TypeScript
4. **Revisão manual** de casos especiais (auth.users, etc.)
5. **Testes completos** do sistema
6. **Rollback** se necessário

---

## Próximos Passos

1. ✅ Análise de uso de customer_id
2. ⏳ Criar script de substituição global
3. ⏳ Aplicar substituição no backend
4. ⏳ Aplicar substituição no frontend
5. ⏳ Atualizar tipos TypeScript
6. ⏳ Revisar casos especiais
7. ⏳ Testar sistema completo
8. ⏳ Gerar relatório final

---

**Status**: EM ANDAMENTO  
**Próxima Etapa**: Criar script de substituição global
