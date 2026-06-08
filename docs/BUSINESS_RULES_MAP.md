# BUSINESS RULES MAP

**Data:** 7 de Junho de 2026  
**Projeto:** AllIn-OS2  
**Objetivo:** Mapear regras de negócio espalhadas pelo código

---

# RESUMO EXECUTIVO

**Status:** ⚠️ PARCIALMENTE DOCUMENTADO

As regras de negócio estão espalhadas entre:
- Services TypeScript (WalletService, BonusWalletService, PlanService)
- Migrations SQL (triggers, functions)
- Frontend components
- Não há centralização de regras

---

# REGRAS DE CARTEIRA (WALLET)

## Localização

**Arquivo:** `src/backend/modules/payments/services/wallet.service.ts`

## Regras Mapeadas

### 1. Criação Automática de Carteira

**Regra:** Carteira é criada automaticamente quando necessário

**Implementação:**
```typescript
async ensureWalletExists(customerId: string): Promise<Wallet> {
  let wallet = await this.getWalletByCustomerId(customerId);
  if (!wallet) {
    wallet = await this.createWallet(customerId);
  }
  return wallet;
}
```

**Status:** ✅ Implementado

### 2. Validação de Saldo para Débito

**Regra:** Não é possível debitar se saldo disponível for insuficiente

**Implementação:**
```typescript
if (wallet.available_balance < amount) {
  throw new Error('Insufficient balance');
}
```

**Status:** ✅ Implementado

### 3. Validação de Saldo para Congelamento

**Regra:** Não é possível congelar se saldo disponível for insuficiente

**Implementação:**
```typescript
if (wallet.available_balance < amount) {
  throw new Error('Insufficient available balance to freeze');
}
```

**Status:** ✅ Implementado

### 4. Validação de Saldo Congelado para Descongelamento

**Regra:** Não é possível descongelar se saldo congelado for insuficiente

**Implementação:**
```typescript
if (wallet.frozen_balance < amount) {
  throw new Error('Insufficient frozen balance to unfreeze');
}
```

**Status:** ✅ Implementado

### 5. Registro de Transações

**Regra:** Todas as operações de carteira geram registro de transação

**Implementação:**
```typescript
// Create transaction record
const { data: transaction, error: transactionError } = await supabase
  .from('wallet_transactions')
  .insert({
    wallet_id: wallet.id,
    transaction_type: 'credit' | 'debit' | 'freeze' | 'unfreeze',
    amount: amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    reference_id: referenceId,
    reference_type: referenceType,
    description: description,
    metadata: metadata,
  })
```

**Status:** ✅ Implementado

### 6. Eventos de Carteira

**Regra:** Operações de carteira emitem eventos para integração

**Implementação:**
```typescript
eventEmitter.emit({
  type: EventType.WALLET_CREDITED | WALLET_DEBITED,
  timestamp: new Date().toISOString(),
  data: { walletId, customerId, amount, transactionId },
});
```

**Status:** ✅ Implementado

---

# REGRAS DE BÔNUS (BONUS WALLET)

## Localização

**Arquivo:** `src/backend/modules/payments/services/bonus-wallet.service.ts`

## Regras Mapeadas

### 1. Criação Automática de Carteira de Bônus

**Regra:** Carteira de bônus é criada automaticamente quando necessário

**Implementação:**
```typescript
async ensureBonusWalletExists(customerId: string): Promise<BonusWallet> {
  let wallet = await this.getBonusWalletByCustomerId(customerId);
  if (!wallet) {
    wallet = await this.createBonusWallet(customerId);
  }
  return wallet;
}
```

**Status:** ✅ Implementado

### 2. Validação de Saldo para Uso de Bônus

**Regra:** Não é possível usar bônus se saldo disponível for insuficiente

**Implementação:**
```typescript
if (wallet.available_balance < amount) {
  throw new Error('Insufficient bonus balance');
}
```

**Status:** ✅ Implementado

### 3. Regra de Uso Percentual de Bônus

**Regra:** Bônus tem limite de uso percentual (padrão 50%)

**Implementação:**
```typescript
async getAvailableBonusForPayment(customerId: string, productId?: string): Promise<{ available: number; maxUsagePercentage: number }> {
  // Get global bonus usage rule
  const { data: globalRule } = await supabase
    .from('bonus_usage_rules')
    .select('*')
    .eq('scope', 'global')
    .eq('is_active', true)
    .single();

  let maxUsagePercentage = globalRule?.max_usage_percentage || 50;

  // Check product-specific rule if productId provided
  if (productId) {
    const { data: productRule } = await supabase
      .from('bonus_usage_rules')
      .select('*')
      .eq('scope', 'product')
      .eq('scope_id', productId)
      .eq('is_active', true)
      .single();

    if (productRule) {
      maxUsagePercentage = productRule.max_usage_percentage;
    }
  }

  const available = (wallet.available_balance * maxUsagePercentage) / 100;
  return { available, maxUsagePercentage };
}
```

**Status:** ✅ Implementado

### 4. Expiração de Bônus

**Regra:** Bônus expiram automaticamente após data definida

**Implementação:**
```typescript
async expireOldBonuses(): Promise<void> {
  // Get expired bonus transactions
  const { data: expiredTransactions, error } = await supabase
    .from('bonus_transactions')
    .select('*')
    .eq('transaction_type', 'earned')
    .lt('expires_at', now)
    .is('expires_at', null);

  // Expire each transaction
  for (const transaction of expiredTransactions || []) {
    // Update wallet balance
    // Create expired transaction record
  }
}
```

**Status:** ✅ Implementado (mas não há job agendado)

### 5. Rastreamento de Total Ganho e Usado

**Regra:** Carteira de bônus rastreia total_ganho e total_usado

**Implementação:**
```typescript
update({
  total_earned: wallet.total_earned + amount,  // ao ganhar
  total_used: wallet.total_used + amount,       // ao usar
})
```

**Status:** ✅ Implementado

---

# REGRAS DE PLANOS (PLAN)

## Localização

**Arquivo:** `src/backend/modules/plans/services/plan.service.ts`

## Regras Mapeadas

### 1. Apenas Um Plano Ativo por Cliente

**Regra:** Cliente não pode ter mais de um plano ativo simultaneamente

**Implementação:**
```typescript
async activateCustomerPlan(dto: ActivateCustomerPlanDto): Promise<CustomerPlan> {
  // Check if customer already has an active plan
  const existingActive = await this.customerPlanRepository.findActiveByCustomerId(dto.customer_id);
  if (existingActive) {
    throw new Error("Customer already has an active plan");
  }
  // ...
}
```

**Status:** ✅ Implementado

### 2. Validação de Plano Ativo

**Regra:** Apenas planos ativos podem ser ativados por clientes

**Implementação:**
```typescript
const plan = await this.planRepository.findById(dto.plan_id);
if (!plan) {
  throw new Error("Plan not found");
}
if (!plan.is_active) {
  throw new Error("Plan is not active");
}
```

**Status:** ✅ Implementado

### 3. Cascata de Deleção de Bônus

**Regra:** Ao deletar plano, bônus associados são deletados primeiro

**Implementação:**
```typescript
async delete(id: string): Promise<void> {
  // Delete associated bonuses first
  await this.planBonusRepository.deleteByPlanId(id);
  await this.planRepository.delete(id);
}
```

**Status:** ✅ Implementado

---

# REGRAS DE REDE (NETWORK)

## Localização

**Status:** ❌ NÃO MAPEADO

**Observação:** NetworkService existe mas não foi auditado nesta fase

---

# REGRAS DE COMISSÕES (COMMISSIONS)

## Localização

**Status:** ❌ NÃO MAPEADO

**Observação:** Não há CommissionService identificado no código

---

# REGRAS DE QUALIFICAÇÃO (QUALIFICATION)

## Localização

**Status:** ❌ NÃO MAPEADO

**Observação:** QualificationService não existe

---

# REGRAS EM MIGRATIONS SQL

## Triggers Identificados

### 1. LTV Update Trigger

**Migration:** `create_ltv_update_trigger`

**Regra:** LTV é atualizado automaticamente quando customer é modificado

**Status:** ✅ Implementado

### 2. Bonus Calculation Trigger

**Migration:** `create_bonus_calculation_trigger`

**Regra:** Bônus é calculado automaticamente após pagamento

**Status:** ✅ Implementado

---

# REGRAS DUPLICADAS

## Identificadas

1. **Cálculo de Saldo**
   - WalletService: Calcula saldo em TypeScript
   - SQL Triggers: Calcula saldo em SQL
   - **Risco:** Inconsistência se ambos forem usados

2. **Validação de Plano Ativo**
   - PlanService: Valida em TypeScript
   - SQL Constraints: Valida em SQL
   - **Risco:** Baixo (redundância positiva)

---

# REGRAS AUSENTES

## Críticas

1. **Cálculo de Comissões**
   - Não há serviço identificado
   - Não há trigger identificado
   - **Impacto:** Comissões não são calculadas automaticamente

2. **Atualização de Qualificação**
   - Não há serviço identificado
   - Não há trigger identificado
   - **Impacto:** Qualificação não é atualizada automaticamente

3. **Atualização de Network Metrics**
   - Não há serviço identificado
   - Não há trigger identificado
   - **Impacto:** Métricas de rede não são atualizadas automaticamente

4. **Job de Expiração de Bônus**
   - Função existe mas não há job agendado
   - **Impacto:** Bônus não expiram automaticamente

---

# AÇÕES CORRETIVAS PRIORITÁRIAS

## CRÍTICO (Bloqueia Operação)

1. **Criar CommissionService**
   - Implementar cálculo de comissões
   - Criar trigger pós-pagamento
   - Criar job diário de cálculo

2. **Criar QualificationService**
   - Implementar atualização de qualificação
   - Criar trigger pós-upgrade de plano
   - Criar trigger pós-métricas de rede

3. **Criar NetworkMetricsService**
   - Implementar atualização de métricas de rede
   - Criar trigger pós-nova indicação
   - Criar trigger pós-pagamento de downline

4. **Agendar Job de Expiração de Bônus**
   - Instalar pg_cron
   - Criar job diário
   - Chamar expireOldBonuses()

## ALTO (Impacta Qualidade)

5. **Centralizar Regras de Saldo**
   - Escolher TypeScript ou SQL como fonte única
   - Remover duplicação
   - Documentar escolha

6. **Documentar Todas as Regras**
   - Criar documentação centralizada
   - Mapear todas as regras existentes
   - Documentar parâmetros e exceções

## MÉDIO (Melhorias Futuras)

7. **Criar Rule Engine**
   - Centralizar todas as regras
   - Permitir configuração dinâmica
   - Implementar versionamento de regras

8. **Implementar Testes de Regras**
   - Testes unitários para cada regra
   - Testes de integração
   - Testes de regressão

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Documentação de Regras | 3/10 | ⚠️ Parcial |
| Centralização de Regras | 2/10 | ❌ Crítico |
| Implementação de Regras Críticas | 4/10 | ⚠️ Parcial |
| Ausência de Regras Críticas | 0/10 | ❌ Crítico |
| Duplicação de Regras | 5/10 | ⚠️ Parcial |
| **Business Rules Readiness** | **2.8/10** | **❌ Crítico** |

---

# CONCLUSÃO

O sistema tem **regras de negócio parcialmente implementadas e espalhadas**. As regras de carteira e bônus estão bem implementadas, mas regras críticas como comissões, qualificação e métricas de rede estão ausentes.

**Recomendação Imediata:**
1. Criar CommissionService
2. Criar QualificationService
3. Criar NetworkMetricsService
4. Agendar job de expiração de bônus
5. Centralizar documentação de regras

**Após correções, o sistema estará pronto para:**
- Cálculo automático de comissões
- Atualização automática de qualificações
- Atualização automática de métricas de rede
- Expiração automática de bônus

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
