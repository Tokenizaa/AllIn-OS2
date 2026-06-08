# CUSTOMER360 SOURCE OF TRUTH

**Data:** 7 de Junho de 2026  
**Projeto Supabase:** sistema-allin (isjsydhuqurneswstlyx)  
**Objetivo:** Definir fonte única de verdade para Customer360

---

# RESUMO EXECUTIVO

**Status:** ❌ CRÍTICO - Fonte de Verdade Quebrada

A auditoria revelou uma **falha crítica de arquitetura de dados**: a tabela `customers` atual (28 registros) NÃO é a fonte de verdade. Todas as tabelas relacionadas (wallets, customer_plans, network_metrics) referenciam a tabela `customers_backup` (1,631 registros).

---

# ENTIDADES MAPEADAS

## Tabela Principal

| Tabela | Registros | Status | Fonte Oficial |
|--------|-----------|--------|---------------|
| customers | 28 | ❌ Não é fonte de verdade | customers_backup |
| customers_backup | 1,631 | ✅ Fonte de verdade real | customers_backup |

## Tabelas Relacionadas

| Tabela | Registros | Referência | Status |
|--------|-----------|------------|--------|
| wallets | 1,631 | customers_backup | ✅ OK |
| bonus_wallets | 1,631 | customers_backup | ✅ OK |
| points_wallets | 1,631 | customers_backup | ✅ OK |
| customer_plans | 1,631 | customers_backup | ✅ OK |
| network_relationships | 995 | customers_backup | ✅ OK |
| customer_network_metrics | 1,631 | customers_backup | ✅ OK |
| orders | 21 | customers_backup (parcial) | ⚠️ Parcial |
| profiles | 7 | auth.users | ✅ OK |

---

# IDENTIFICADORES

## customer_id

**Fonte Oficial:** `customers_backup.id` (UUID)

**Uso:**
- wallets.customer_id
- bonus_wallets.customer_id
- points_wallets.customer_id
- customer_plans.customer_id
- orders.customer_id (11 de 21)

**Status:** ✅ Consistente em todas as tabelas que referenciam customers_backup

## user_id

**Fonte Oficial:** `auth.users.id` (UUID)

**Uso:**
- profiles.user_id
- payments.user_id
- orders.user_id

**Status:** ❌ CRÍTICO
- customers_backup: 0 registros com user_id
- customers: 0 registros com user_id
- profiles: 7 registros com user_id

**Problema:** Não há link entre customers e auth.users

## distributor_id

**Fonte Oficial:** ❌ NÃO EXISTE

**Status:** ❌ Não há campo separado para distributor_id
- O sistema usa customer_id para representar distribuidores
- Não há distinção entre cliente e distribuidor na tabela

## network_id

**Fonte Oficial:** `customers_backup.path` (array de UUIDs)

**Uso:**
- network_relationships
- customer_network_metrics

**Status:** ✅ OK

## wallet_id

**Fonte Oficial:** `wallets.id`, `bonus_wallets.id`, `points_wallets.id` (UUID)

**Status:** ✅ OK - Cada wallet tem seu próprio ID

## sponsor_id

**Fonte Oficial:** `customers_backup.sponsor_id` (UUID)

**Uso:**
- network_relationships
- customer_network_metrics

**Status:** ⚠️ PARCIAL
- customers_backup: 995 de 1,631 (61%) com sponsor_id
- customers: 0 de 28 (0%) com sponsor_id

## qualification_id

**Fonte Oficial:** `qualifications.id` (UUID) - NÃO é customer-specific

**Status:** ❌ INCORRETO
- A tabela `qualifications` define qualificações de PLANO, não de cliente
- Não há tabela `customer_qualifications`
- Qualificação de cliente deve ser derivada de customer_plans + network metrics

---

# PROBLEMAS CRÍTICOS

## 1. Tabela customers Não é Fonte de Verdade

**Problema:**
- Tabela `customers` tem apenas 28 registros
- Todas as tabelas relacionadas referenciam `customers_backup` (1,631 registros)
- A tabela `customers` foi recriada recentemente, quebrando todos os relacionamentos

**Impacto:** CRÍTICO
- Queries que usam `customers` retornam dados incompletos
- Joins com `customers` falham
- Customer360 view pode estar incorreta

**Solução:**
```sql
-- Restaurar customers a partir de customers_backup
DROP TABLE customers;
ALTER TABLE customers_backup RENAME TO customers;
```

## 2. Ausência de user_id em customers

**Problema:**
- 0 de 1,631 customers têm user_id
- Não há link entre customers e auth.users
- Impossível aplicar RLS baseado em user_id

**Impacto:** CRÍTICO
- RLS policies não funcionam corretamente
- Não é possível identificar qual usuário é qual customer
- Autenticação não está conectada ao CRM

**Solução:**
```sql
-- Mapear user_id para customers (requer dados de auth.users)
UPDATE customers c
SET user_id = (
    SELECT au.id 
    FROM auth.users au 
    WHERE au.email = c.email 
    LIMIT 1
)
WHERE c.email IS NOT NULL;
```

## 3. Ausência de distributor_id

**Problema:**
- Não há distinção entre cliente e distribuidor
- O sistema usa customer_id para ambos
- Não há tabela separada de distribuidores

**Impacto:** MÉDIO
- Confusão conceitual
- Dificulta implementação de regras específicas para distribuidores
- Customer360 mistura clientes e distribuidores

**Solução:**
- Adicionar campo `customer_type` em customers (cliente_final, distribuidor, afiliado)
- OU criar tabela separada `distributors`

## 4. Qualification Não é Customer-Specific

**Problema:**
- Tabela `qualifications` define qualificações de PLANO
- Não há tabela `customer_qualifications`
- Qualificação atual de cliente não está armazenada

**Impacto:** ALTO
- Não é possível saber qualificação atual de um cliente
- Cálculos de bônus podem estar incorretos
- Customer360 não mostra qualificação

**Solução:**
```sql
-- Criar tabela customer_qualifications
CREATE TABLE customer_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    qualification_id UUID NOT NULL REFERENCES qualifications(id),
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice
CREATE INDEX idx_customer_qualifications_customer_id ON customer_qualifications(customer_id);
CREATE INDEX idx_customer_qualifications_status ON customer_qualifications(status);
```

---

# MATRIZ DE RELACIONAMENTOS

## customers → profiles

| customers | profiles | Relação | Status |
|-----------|----------|---------|--------|
| 28 registros | 7 registros | user_id | ❌ Quebrada (0 matches) |

**Problema:** Não há link entre customers e profiles

## customers → wallets

| customers | wallets | Relação | Status |
|-----------|---------|---------|--------|
| 28 registros | 1,631 registros | customer_id | ❌ Quebrada (0 matches) |

**Problema:** wallets referenciam customers_backup, não customers

## customers → orders

| customers | orders | Relação | Status |
|-----------|--------|---------|--------|
| 28 registros | 21 registros | customer_id | ⚠️ Parcial (10 matches) |

**Problema:** 11 orders sem customer_id ou com customer_id órfão

## customers → network_relationships

| customers | network_relationships | Relação | Status |
|-----------|----------------------|---------|--------|
| 28 registros | 995 registros | customer_id | ❌ Quebrada (0 matches) |

**Problema:** network_relationships referenciam customers_backup

---

# FONTES OFICIAIS DEFINIDAS

## Cliente

**Fonte Oficial:** `customers_backup` (deve ser renomeado para `customers`)

**Campos Críticos:**
- id (UUID) - Identificador único
- nome (TEXT) - Nome do cliente
- email (TEXT) - Email do cliente
- telefone (TEXT) - Telefone do cliente
- cpf (TEXT) - CPF do cliente
- sponsor_id (UUID) - Patrocinador
- plan_id (UUID) - Plano atual
- path (UUID[]) - Caminho na rede
- customer_type (TEXT) - Tipo de cliente (ADICIONAR)

## Perfil

**Fonte Oficial:** `profiles`

**Campos Críticos:**
- id (UUID) - Identificador único
- user_id (UUID) - Link com auth.users
- role (TEXT) - Role do usuário
- status (TEXT) - Status do perfil

## Carteira

**Fonte Oficial:** `wallets` (carteira principal)

**Campos Críticos:**
- id (UUID) - Identificador único
- customer_id (UUID) - Link com customers
- balance (NUMERIC) - Saldo atual
- available_balance (NUMERIC) - Saldo disponível

## Carteira de Bônus

**Fonte Oficial:** `bonus_wallets`

**Campos Críticos:**
- id (UUID) - Identificador único
- customer_id (UUID) - Link com customers
- balance (NUMERIC) - Saldo de bônus
- available_balance (NUMERIC) - Bônus disponível

## Carteira de Pontos

**Fonte Oficial:** `points_wallets`

**Campos Críticos:**
- id (UUID) - Identificador único
- customer_id (UUID) - Link com customers
- balance (NUMERIC) - Saldo de pontos
- available_balance (NUMERIC) - Pontos disponíveis

## Plano do Cliente

**Fonte Oficial:** `customer_plans`

**Campos Críticos:**
- id (UUID) - Identificador único
- customer_id (UUID) - Link com customers
- plan_id (UUID) - Link com plans
- status (TEXT) - Status do plano
- activated_at (TIMESTAMP) - Data de ativação
- expires_at (TIMESTAMP) - Data de expiração

## Rede

**Fonte Oficial:** `network_relationships`

**Campos Críticos:**
- customer_id (UUID) - Cliente
- sponsor_id (UUID) - Patrocinador
- depth (INTEGER) - Profundidade na rede
- path (UUID[]) - Caminho completo

## Métricas de Rede

**Fonte Oficial:** `customer_network_metrics`

**Campos Críticos:**
- customer_id (UUID) - Cliente
- total_downlines (INTEGER) - Total de downlines
- active_downlines (INTEGER) - Downlines ativos
- total_volume (NUMERIC) - Volume total

---

# AÇÕES CORRETIVAS PRIORITÁRIAS

## CRÍTICO (Bloqueia Operação)

1. **Restaurar customers a partir de customers_backup**
   ```sql
   DROP TABLE customers;
   ALTER TABLE customers_backup RENAME TO customers;
   ```

2. **Mapear user_id para customers**
   - Requer dados de auth.users
   - Criar mapeamento email → user_id
   - Atualizar customers.user_id

3. **Criar tabela customer_qualifications**
   - Definir estrutura
   - Migrar qualificações atuais
   - Criar triggers para atualização

## ALTO (Impacta Qualidade)

4. **Adicionar campo customer_type**
   ```sql
   ALTER TABLE customers ADD COLUMN customer_type TEXT DEFAULT 'cliente_final';
   ```

5. **Validar relacionamentos**
   - Verificar todos os joins
   - Corrigir referências órfãs
   - Atualizar views

## MÉDIO (Melhorias Futuras)

6. **Criar índices de performance**
   - customer_id em todas as tabelas relacionadas
   - Composite indexes para queries frequentes

7. **Implementar triggers de integridade**
   - Trigger para atualizar customer_type
   - Trigger para atualizar network metrics
   - Trigger para validar qualificações

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Integridade de Identificadores | 2/10 | ❌ Crítico |
| Consistência de Relacionamentos | 1/10 | ❌ Crítico |
| Qualidade de Dados | 3/10 | ❌ Crítico |
| Fonte Única de Verdade | 0/10 | ❌ Crítico |
| **Customer360 Readiness** | **1.5/10** | **❌ Crítico** |

---

# CONCLUSÃO

O sistema atual **NÃO possui uma fonte única de verdade para Customer360**. A tabela `customers` foi recriada recentemente e todos os relacionamentos foram quebrados. A fonte de verdade real é `customers_backup`, mas isso não está documentado nem refletido no código.

**Recomendação Imediata:**
1. Restaurar customers a partir de customers_backup
2. Mapear user_id para customers
3. Validar todos os relacionamentos
4. Atualizar documentação

**Após correções, o sistema estará pronto para:**
- Customer360 confiável
- Cálculos de bônus corretos
- RLS funcional
- Analytics baseados em dados reais

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
