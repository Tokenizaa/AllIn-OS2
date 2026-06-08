# MANDATORY CORRECTIONS

**Data:** 7 de Junho de 2026  
**Projeto:** AllIn-OS2  
**Objetivo:** Registrar correções aplicadas e pendentes

---

# RESUMO EXECUTIVO

**Status:** ⚠️ CORREÇÕES PENDENTES

A maioria das correções identificadas requer implementação de código ou criação de tabelas. Algumas correções podem ser aplicadas via SQL imediatamente.

---

# CORREÇÕES APLICADAS

## Nenhuma correção aplicada nesta fase

**Observação:** Esta fase foi de auditoria e documentação. Correções serão aplicadas em fase subsequente após aprovação.

---

# CORREÇÕES PENDENTES - CRÍTICAS

## 1. Type Mismatch: order_items.order_id

**Problema:** order_items.order_id é TEXT mas orders.id é UUID, impedindo joins

**Arquivo:** N/A (schema do banco)

**Tabela:** order_items

**Impacto:** CRÍTICO
- Joins entre orders e order_items falham
- Queries de detalhes de pedido não funcionam
- Validação de totais de pedido não é possível

**Solução:**
```sql
-- Converter order_items.order_id para UUID
ALTER TABLE order_items 
ALTER COLUMN order_id TYPE UUID 
USING order_id::uuid;

-- Criar índice
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

**Resultado:** PENDENTE (aguardando aprovação)

---

## 2. Tabela Ausente: wallet_transactions

**Problema:** Tabela wallet_transactions não existe, impossibilitando histórico de transações

**Arquivo:** N/A (schema do banco)

**Tabela:** wallet_transactions

**Impacto:** CRÍTICO
- Não há histórico de transações de carteira
- Auditoria financeira é impossível
- Reconciliação não pode ser feita

**Solução:**
```sql
-- Criar tabela wallet_transactions
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'freeze', 'unfreeze', 'withdrawal', 'deposit')),
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    balance_before NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    reference_id TEXT,
    reference_type TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);
```

**Resultado:** PENDENTE (aguardando aprovação)

---

## 3. Tabela Ausente: bonus_transactions

**Problema:** Tabela bonus_transactions não existe, impossibilitando histórico de bônus

**Arquivo:** N/A (schema do banco)

**Tabela:** bonus_transactions

**Impacto:** CRÍTICO
- Não há histórico de bônus
- Auditoria de bônus é impossível
- Expiração de bônus não pode ser implementada

**Solução:**
```sql
-- Criar tabela bonus_transactions
CREATE TABLE bonus_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bonus_wallet_id UUID NOT NULL REFERENCES bonus_wallets(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'used', 'expired', 'forfeited', 'transferred')),
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    balance_before NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    source_type TEXT,
    source_id TEXT,
    reference_id TEXT,
    reference_type TEXT,
    description TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_bonus_transactions_bonus_wallet_id ON bonus_transactions(bonus_wallet_id);
CREATE INDEX idx_bonus_transactions_created_at ON bonus_transactions(created_at);
CREATE INDEX idx_bonus_transactions_expires_at ON bonus_transactions(expires_at);
```

**Resultado:** PENDENTE (aguardando aprovação)

---

## 4. Tabela Ausente: commissions

**Problema:** Tabela commissions não existe, impossibilitando cálculo e pagamento de comissões

**Arquivo:** N/A (schema do banco)

**Tabela:** commissions

**Impacto:** CRÍTICO
- Comissões não podem ser calculadas
- Distribuidores não recebem pagamentos
- Sistema MLM não funciona

**Solução:**
```sql
-- Criar tabela commissions
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    order_id UUID REFERENCES orders(id),
    commission_type TEXT NOT NULL, -- 'direct', 'indirect', 'leadership', 'bonus'
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    percentage NUMERIC CHECK (percentage >= 0 AND percentage <= 100),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    payment_id UUID REFERENCES payments(id),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_commissions_customer_id ON commissions(customer_id);
CREATE INDEX idx_commissions_order_id ON commissions(order_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_created_at ON commissions(created_at);
```

**Resultado:** PENDENTE (aguardando aprovação)

---

## 5. Tabela Ausente: customer_qualifications

**Problema:** Tabela customer_qualifications não existe, impossibilitando rastreamento de qualificações

**Arquivo:** N/A (schema do banco)

**Tabela:** customer_qualifications

**Impacto:** CRÍTICO
- Qualificações não podem ser rastreadas
- Progresso de distribuidores não é visível
- Sistema de níveis não funciona

**Solução:**
```sql
-- Criar tabela customer_qualifications
CREATE TABLE customer_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    qualification_id TEXT NOT NULL,
    qualification_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    requirements_met JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_customer_qualifications_customer_id ON customer_qualifications(customer_id);
CREATE INDEX idx_customer_qualifications_status ON customer_qualifications(status);
CREATE INDEX idx_customer_qualifications_achievement_date ON customer_qualifications(achieved_at);
```

**Resultado:** PENDENTE (aguardando aprovação)

---

# CORREÇÕES PENDENTES - ALTAS

## 6. Pipeline de Atualização de Analytics

**Problema:** customer_metrics e customer_scores estão estagnados desde 2026-05-17

**Arquivo:** src/backend/modules/analytics/services/analytics.service.ts

**Tabela:** customer_metrics, customer_scores

**Impacto:** ALTO
- Analytics não refletem dados atuais
- Scores não são atualizados
- Decisões baseadas em dados incorretos

**Solução:**
```typescript
// Criar AnalyticsUpdateService
export class AnalyticsUpdateService {
  async updateCustomerMetrics(customerId: string): Promise<void> {
    // Calcular total_gasto, ticket_medio, ltv, etc.
    // Atualizar customer_metrics
  }

  async updateCustomerScores(customerId: string): Promise<void> {
    // Calcular churn_score, engagement_score, etc.
    // Atualizar customer_scores
  }

  async updateAllMetrics(): Promise<void> {
    // Atualizar todos os customers
    // Executar diariamente via pg_cron
  }
}
```

**Resultado:** PENDENTE (requer implementação de código)

---

## 7. Criação de CommissionService

**Problema:** Não há serviço para cálculo de comissões

**Arquivo:** src/backend/modules/commissions/services/commission.service.ts (novo)

**Tabela:** commissions

**Impacto:** ALTO
- Comissões não são calculadas automaticamente
- Distribuidores não recebem pagamentos
- Sistema MLM não funciona

**Solução:**
```typescript
// Criar CommissionService
export class CommissionService {
  async calculateDirectCommission(orderId: string): Promise<void> {
    // Calcular comissão direta para patrocinador
  }

  async calculateIndirectCommission(orderId: string): Promise<void> {
    // Calcular comissões indiretas para uplines
  }

  async processOrderCommissions(orderId: string): Promise<void> {
    // Processar todas as comissões de um pedido
  }
}
```

**Resultado:** PENDENTE (requer implementação de código)

---

## 8. Criação de QualificationService

**Problema:** Não há serviço para atualização de qualificações

**Arquivo:** src/backend/modules/qualifications/services/qualification.service.ts (novo)

**Tabela:** customer_qualifications

**Impacto:** ALTO
- Qualificações não são atualizadas automaticamente
- Progresso não é rastreado
- Sistema de níveis não funciona

**Solução:**
```typescript
// Criar QualificationService
export class QualificationService {
  async checkQualificationUpgrade(customerId: string): Promise<void> {
    // Verificar se customer atingiu requisitos para upgrade
  }

  async updateQualification(customerId: string, newQualification: string): Promise<void> {
    // Atualizar qualificação do customer
  }

  async processQualifications(): Promise<void> {
    // Processar todos os customers
    // Executar diariamente via pg_cron
  }
}
```

**Resultado:** PENDENTE (requer implementação de código)

---

# CORREÇÕES PENDENTES - MÉDIAS

## 9. Job de Expiração de Bônus

**Problema:** Função expireOldBonuses existe mas não há job agendado

**Arquivo:** N/A (requer pg_cron)

**Tabela:** bonus_transactions

**Impacto:** MÉDIO
- Bônus não expiram automaticamente
- Saldo de bônus pode ficar incorreto
- Regras de expiração não são aplicadas

**Solução:**
```sql
-- Instalar pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Criar job diário
SELECT cron.schedule(
  'expire-old-bonuses',
  '0 2 * * *', -- 2 AM diariamente
  $$SELECT expire_old_bonuses()$$
);
```

**Resultado:** PENDENTE (aguardando aprovação)

---

## 10. Atualização de Views para Scrape

**Problema:** Views referenciam customers_backup em vez de customers (scrape)

**Arquivo:** N/A (views do banco)

**Tabela:** customer_360_view, network_tree_view, etc.

**Impacto:** MÉDIO
- Views não refletem dados do scrape
- Dados estão desatualizados
- Scrape em andamento não é utilizado

**Solução:**
```sql
-- Atualizar customer_360_view
CREATE OR REPLACE VIEW customer_360_view AS
SELECT c.*, w.balance, bw.balance as bonus_balance
FROM customers c
LEFT JOIN wallets w ON w.customer_id = c.id
LEFT JOIN bonus_wallets bw ON bw.customer_id = c.id;

-- Atualizar network_tree_view
CREATE OR REPLACE VIEW network_tree_view AS
SELECT c.*, nr.sponsor_id, nr.level
FROM customers c
LEFT JOIN network_relationships nr ON nr.customer_id = c.id;
```

**Resultado:** PENDENTE (aguardando scrape completo)

---

# CORREÇÕES PENDENTES - BAIXAS

## 11. Limpeza de Campos Legados

**Problema:** Tabelas têm campos legados redundantes

**Arquivo:** N/A (schema do banco)

**Tabela:** orders, customers

**Impacto:** BAIXO
- Confusão de campos
- Manutenção mais complexa
- Possível inconsistência

**Solução:**
```sql
-- Remover campos legados após migração
ALTER TABLE orders DROP COLUMN numero_pedido;
ALTER TABLE orders DROP COLUMN id_comprador;
ALTER TABLE orders DROP COLUMN comprador;
-- ... (outros campos legados)
```

**Resultado:** PENDENTE (aguardando validação de uso)

---

# PRIORIDADE DE IMPLEMENTAÇÃO

## Fase 1 - Críticas (Bloqueiam Operação)

1. **Type Mismatch: order_items.order_id** - SQL
2. **Tabela Ausente: wallet_transactions** - SQL
3. **Tabela Ausente: bonus_transactions** - SQL
4. **Tabela Ausente: commissions** - SQL
5. **Tabela Ausente: customer_qualifications** - SQL

## Fase 2 - Altas (Impactam Qualidade)

6. **Pipeline de Atualização de Analytics** - TypeScript
7. **Criação de CommissionService** - TypeScript
8. **Criação de QualificationService** - TypeScript

## Fase 3 - Médias (Melhorias Futuras)

9. **Job de Expiração de Bônus** - SQL (pg_cron)
10. **Atualização de Views para Scrape** - SQL

## Fase 4 - Baixas (Limpeza)

11. **Limpeza de Campos Legados** - SQL

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Correções Aplicadas | 0/11 | 0% |
| Correções Críticas Pendentes | 5/11 | 45% |
| Correções Altas Pendentes | 3/11 | 27% |
| Correções Médias Pendentes | 2/11 | 18% |
| Correções Baixas Pendentes | 1/11 | 9% |
| **Corrections Readiness** | **0/10** | **❌ Crítico** |

---

# CONCLUSÃO

Nenhuma correção foi aplicada nesta fase de auditoria. Foram identificadas 11 correções necessárias, sendo 5 críticas que bloqueiam operações do sistema.

**Recomendação Imediata:**
1. Aplicar correções críticas via SQL (Fase 1)
2. Implementar serviços TypeScript (Fase 2)
3. Configurar jobs agendados (Fase 3)
4. Limpar campos legados (Fase 4)

**Após correções, o sistema estará pronto para:**
- Joins funcionais entre orders e order_items
- Histórico completo de transações
- Cálculo automático de comissões
- Rastreamento de qualificações
- Analytics atualizados automaticamente

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
