# FINANCIAL SOURCE OF TRUTH

**Data:** 7 de Junho de 2026  
**Projeto Supabase:** sistema-allin (isjsydhuqurneswstlyx)  
**Objetivo:** Definir fonte única de verdade para dados financeiros

---

# RESUMO EXECUTIVO

**Status:** ⚠️ PARCIALMENTE PREPARADO

A auditoria revelou que a estrutura financeira existe, mas há **gaps críticos de dados**:

- Todas as carteiras têm saldo zero (exceto 1 bonus_wallet)
- Não há tabela de transactions
- Não há registros de saques
- Pagamentos existem (43,717) mas não há conciliação com carteiras

---

# ENTIDADES MAPEADAS

## Carteiras

| Tabela | Registros | Saldo Zero | Saldo Positivo | Saldo Negativo | Status |
|--------|-----------|------------|----------------|----------------|--------|
| wallets | 1,631 | 1,631 (100%) | 0 | 0 | ❌ Vazia |
| bonus_wallets | 1,631 | 1,630 (99.9%) | 1 (0.1%) | 0 | ⚠️ Quase vazia |
| points_wallets | 1,631 | 1,631 (100%) | 0 | 0 | ❌ Vazia |

## Pagamentos

| Tabela | Registros | COMPLETED | PENDING | Status |
|--------|-----------|-----------|---------|--------|
| payments | 43,717 | 42,963 (98.3%) | 754 (1.7%) | ✅ OK |

## Saques

| Tabela | Registros | Status |
|--------|-----------|--------|
| withdrawals | 0 | ❌ Vazia |

## Transações

| Tabela | Registros | Status |
|--------|-----------|--------|
| transactions | ❌ NÃO EXISTE | ❌ Ausente |

---

# FONTES OFICIAIS DEFINIDAS

## Saldo Oficial

**Fonte Oficial:** `wallets.balance`

**Status:** ❌ NÃO CONFIÁVEL
- 100% dos registros têm saldo zero
- Não há histórico de movimentações
- Não há tabela de transactions para validar

**Problema:** Impossível determinar saldo real sem histórico

## Comissão Oficial

**Fonte Oficial:** ❌ NÃO DEFINIDA

**Status:** ❌ AUSENTE
- Não há tabela de commissions
- Não há tabela de bonus_transactions
- Não há cálculo de comissões documentado

**Problema:** Não é possível determinar comissão oficial

## Extrato Oficial

**Fonte Oficial:** ❌ NÃO DEFINIDA

**Status:** ❌ AUSENTE
- Não há tabela de transactions
- Não há tabela de ledger
- Não há histórico de movimentações

**Problema:** Não é possível gerar extrato oficial

## Saques Oficiais

**Fonte Oficial:** `withdrawals`

**Status:** ❌ VAZIA
- 0 registros
- Tabela existe mas não é utilizada

**Problema:** Não há histórico de saques

---

# ANÁLISE DE PAGAMENTOS

## Distribuição por Status

| Status | Quantidade | Valor Total | Percentual |
|--------|-----------|-------------|------------|
| COMPLETED | 42,963 | R$ 10.032.545,80 | 98.3% |
| PENDING | 754 | R$ 244.295,89 | 1.7% |

**Total Processado:** R$ 10.276.841,68

## Integridade Referencial

| Tipo | Quantidade | Percentual |
|------|-----------|------------|
| Pagamentos com customer válido | 43,714 | 99.99% |
| Pagamentos com customer órfão | 3 | 0.007% |
| Pagamentos sem customer_id | 3 | 0.007% |

**Status:** ✅ Excelente - Quase todos os pagamentos têm customer válido

## Gateway

Pagamentos usam múltiplos gateways (identificados em metadata):
- gateway_transaction_id presente
- webhook_received tracking
- webhook_processed_at timestamp

**Status:** ✅ OK - Infraestrutura de pagamentos funcional

---

# PROBLEMAS CRÍTICOS

## 1. Carteiras Vazias

**Problema:**
- wallets: 100% com saldo zero
- bonus_wallets: 99.9% com saldo zero
- points_wallets: 100% com saldo zero

**Impacto:** CRÍTICO
- Impossível determinar saldo real dos clientes
- Não há rastreabilidade de movimentações
- Cálculos financeiros não podem ser validados

**Causa Provável:**
- Carteiras foram criadas mas nunca foram alimentadas
- Falta de pipeline de conciliação payments → wallets
- Falta de triggers para atualização automática

**Solução:**
```sql
-- Criar tabela de transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    wallet_type TEXT NOT NULL, -- 'main', 'bonus', 'points'
    type TEXT NOT NULL, -- 'credit', 'debit', 'freeze', 'unfreeze'
    amount NUMERIC NOT NULL,
    balance_after NUMERIC,
    description TEXT,
    reference_id UUID, -- payment_id, withdrawal_id, etc.
    reference_type TEXT, -- 'payment', 'withdrawal', 'bonus', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Criar índices
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_reference ON transactions(reference_id, reference_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Conciliar payments com wallets
INSERT INTO transactions (wallet_id, wallet_type, type, amount, balance_after, description, reference_id, reference_type)
SELECT 
    w.id as wallet_id,
    'main' as wallet_type,
    'credit' as type,
    p.amount as amount,
    w.balance + p.amount as balance_after,
    'Payment received' as description,
    p.id as reference_id,
    'payment' as reference_type
FROM payments p
JOIN wallets w ON p.customer_id = w.customer_id
WHERE p.status = 'COMPLETED'
AND p.customer_id IS NOT NULL;

-- Atualizar saldos
UPDATE wallets w
SET balance = (
    SELECT COALESCE(SUM(t.amount), 0)
    FROM transactions t
    WHERE t.wallet_id = w.id
    AND t.type = 'credit'
) - (
    SELECT COALESCE(SUM(t.amount), 0)
    FROM transactions t
    WHERE t.wallet_id = w.id
    AND t.type = 'debit'
);
```

## 2. Ausência de Tabela de Transactions

**Problema:**
- Não há tabela de transactions
- Não há histórico de movimentações
- Não há ledger transacional

**Impacto:** CRÍTICO
- Impossível rastrear movimentações
- Impossível auditar operações
- Impossível conciliar saldos

**Solução:** Criar tabela de transactions (ver solução acima)

## 3. Ausência de Comissões

**Problema:**
- Não há tabela de commissions
- Não há tabela de bonus_transactions
- Não há cálculo de comissões documentado

**Impacto:** ALTO
- Não é possível determinar comissão oficial
- Distribuidores não podem ver suas comissões
- Cálculos de bônus não podem ser validados

**Solução:**
```sql
-- Criar tabela de commissions
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    order_id UUID REFERENCES orders(id),
    type TEXT NOT NULL, -- 'direct', 'indirect', 'bonus', 'qualification'
    amount NUMERIC NOT NULL,
    percentage NUMERIC,
    level INTEGER,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid'
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Criar índices
CREATE INDEX idx_commissions_customer_id ON commissions(customer_id);
CREATE INDEX idx_commissions_order_id ON commissions(order_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_calculated_at ON commissions(calculated_at DESC);
```

## 4. Ausência de Saques

**Problema:**
- Tabela withdrawals existe mas está vazia (0 registros)
- Não há histórico de saques

**Impacto:** MÉDIO
- Não é possível rastrear saques
- Não é possível auditar pagamentos a distribuidores

**Solução:**
- Implementar pipeline de processamento de saques
- Criar triggers para registrar saques em transactions
- Implementar validações de saldo antes de aprovar saques

---

# ARQUITETURA FINANCEIRA PROPOSTA

## Fluxo de Dados

```
Payments (43,717 registros)
    ↓
Conciliação
    ↓
Transactions (NOVA)
    ↓
Wallets (atualização automática)
    ↓
Withdrawals (quando solicitado)
    ↓
Bonus Transactions (NOVA)
    ↓
Commissions (NOVA)
```

## Tabela Mestra

| Entidade | Fonte Oficial | Status |
|----------|---------------|--------|
| Saldo Principal | wallets.balance | ❌ Vazio |
| Saldo de Bônus | bonus_wallets.balance | ⚠️ Quase vazio |
| Saldo de Pontos | points_wallets.balance | ❌ Vazio |
| Pagamentos | payments | ✅ OK |
| Extrato | transactions | ❌ Não existe |
| Saques | withdrawals | ❌ Vazio |
| Comissões | commissions | ❌ Não existe |

---

# AÇÕES CORRETIVAS PRIORITÁRIAS

## CRÍTICO (Bloqueia Operação)

1. **Criar tabela de transactions**
   - Definir estrutura completa
   - Criar índices de performance
   - Implementar triggers de atualização

2. **Conciliar payments com wallets**
   - Migrar pagamentos COMPLETED para transactions
   - Atualizar saldos das carteiras
   - Validar consistência

3. **Criar tabela de commissions**
   - Definir estrutura
   - Implementar cálculo de comissões
   - Criar triggers automáticos

## ALTO (Impacta Qualidade)

4. **Implementar pipeline de saques**
   - Criar validações de saldo
   - Implementar aprovação manual
   - Registrar em transactions

5. **Criar tabela de bonus_transactions**
   - Rastrear ganhos de bônus
   - Rastrear uso de bônus
   - Implementar expiração

## MÉDIO (Melhorias Futuras)

6. **Implementar conciliação automática**
   - Trigger pós-payment
   - Trigger pós-withdrawal
   - Trigger pós-bonus

7. **Criar views de extrato**
   - View consolidada de transactions
   - View de saldo por período
   - View de movimentações por tipo

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Integridade de Saldos | 0/10 | ❌ Crítico |
| Histórico de Transações | 0/10 | ❌ Crítico |
| Conciliação de Pagamentos | 2/10 | ❌ Crítico |
| Rastreabilidade de Saques | 0/10 | ❌ Crítico |
| Cálculo de Comissões | 0/10 | ❌ Crítico |
| **Financial Readiness** | **0.4/10** | **❌ Crítico** |

---

# CONCLUSÃO

O sistema financeiro **NÃO possui uma fonte única de verdade confiável**. Embora a estrutura de pagamentos exista e funcione (43,717 pagamentos processados), não há:

- Ledger transacional
- Histórico de movimentações
- Conciliação com carteiras
- Cálculo de comissões
- Processamento de saques

**Recomendação Imediata:**
1. Criar tabela de transactions
2. Conciliar payments com wallets
3. Implementar pipeline de comissões
4. Implementar pipeline de saques

**Após correções, o sistema estará pronto para:**
- Extratos confiáveis
- Cálculos financeiros corretos
- Auditoria completa
- Dashboard financeiro funcional

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
