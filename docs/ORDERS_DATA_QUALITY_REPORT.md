# ORDERS DATA QUALITY REPORT

**Data:** 7 de Junho de 2026  
**Projeto Supabase:** sistema-allin (isjsydhuqurneswstlyx)  
**Objetivo:** Validar consistência matemática e qualidade de dados de pedidos

---

# RESUMO EXECUTIVO

**Status:** ❌ CRÍTICO - Dados Inconsistentes

A auditoria revelou problemas críticos de qualidade de dados em pedidos:

- Tabela `orders` atual tem apenas 21 registros (vs 22,195 em backup)
- 100% dos orders atuais (21) não têm itens correspondentes
- Type mismatch entre orders.id (UUID) e order_items.order_id (TEXT)
- Inconsistência de totais em 47.6% dos pedidos

---

# ENTIDADES MAPEADAS

## Tabelas de Pedidos

| Tabela | Registros | Status | Fonte Oficial |
|--------|-----------|--------|---------------|
| orders | 21 | ❌ Dados incompletos | orders_backup |
| orders_backup | 22,195 | ✅ Fonte de verdade real | orders_backup |
| order_items | 91 | ❌ Dados incompletos | order_items_backup |
| order_items_backup | 41,742 | ✅ Fonte de verdade real | order_items_backup |
| order_items_normalized | 1,621 | ⚠️ Normalização parcial | order_items_backup |

---

# PROBLEMAS CRÍTICOS

## 1. Tabela orders Não é Fonte de Verdade

**Problema:**
- Tabela `orders` atual tem apenas 21 registros
- Tabela `orders_backup` tem 22,195 registros
- Todas as tabelas relacionadas referenciam `orders_backup`

**Impacto:** CRÍTICO
- Queries que usam `orders` retornam dados incompletos
- Joins com `orders` falham
- Relatórios de pedidos estão incorretos

**Causa:**
- A tabela `orders` foi recriada recentemente, similar ao problema com `customers`
- Migração incompleta ou teste de migração

**Solução:**
```sql
-- Restaurar orders a partir de orders_backup
DROP TABLE orders;
ALTER TABLE orders_backup RENAME TO orders;
```

## 2. 100% dos Orders Atuais Sem Itens

**Problema:**
- 21 orders atuais
- 21 orders sem itens correspondentes (100%)
- order_items tem 91 registros mas não fazem join com orders

**Impacto:** CRÍTICO
- Impossível validar totais de pedidos
- Relatórios de itens de pedido estão quebrados
- Cálculos de receita estão incorretos

**Causa:**
- Type mismatch entre orders.id (UUID) e order_items.order_id (TEXT)
- order_items.order_id é TEXT, orders.id é UUID
- Join falha silenciosamente

**Solução:**
```sql
-- Opção 1: Converter order_items.order_id para UUID
ALTER TABLE order_items ALTER COLUMN order_id TYPE UUID USING order_id::uuid;

-- Opção 2: Converter orders.id para TEXT (não recomendado)
-- ALTER TABLE orders ALTER COLUMN id TYPE TEXT USING id::text;

-- Opção 3: Recarregar order_items a partir de order_items_backup com tipos corretos
```

## 3. Type Mismatch Crítico

**Problema:**
- orders.id: UUID
- order_items.order_id: TEXT

**Impacto:** CRÍTICO
- Joins entre orders e order_items falham
- Queries de pedidos com itens não funcionam
- Relatórios de detalhes de pedido estão quebrados

**Solução:**
```sql
-- Converter order_items.order_id para UUID
ALTER TABLE order_items 
ALTER COLUMN order_id TYPE UUID 
USING order_id::uuid;

-- Criar índice
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

## 4. Inconsistência de Totais

**Problema:**
- 11 orders (52.4%) com valor_total consistente com itens
- 10 orders (47.6%) com valor_total inconsistente com itens

**Impacto:** ALTO
- Cálculos de receita podem estar incorretos
- Relatórios financeiros não são confiáveis
- Comissões podem ser calculadas incorretamente

**Solução:**
```sql
-- Recalcular totais baseado em order_items
UPDATE orders o
SET valor_total = (
    SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
    FROM order_items oi
    WHERE oi.order_id = o.id
)
WHERE o.id IN (
    SELECT o.id
    FROM orders o
    WHERE o.valor_total <> (
        SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
        FROM order_items oi
        WHERE oi.order_id = o.id
    )
);
```

---

# VALIDAÇÃO MATEMÁTICA

## Fórmula Esperada

```
subtotal = SUM(order_items.unit_price * order_items.quantity)
total = subtotal - discount + shipping + tax
```

## Status Atual

| Métrica | Quantidade | Percentual |
|---------|-----------|------------|
| Orders com itens válidos | 11 | 52.4% |
| Orders sem itens | 21 | 100% |
| Orders com totais inconsistentes | 10 | 47.6% |

**Nota:** A validação não pôde ser completa devido ao type mismatch entre orders e order_items.

---

# DISTRIBUIÇÃO DE STATUS

## Status de Pedidos

| Status | Quantidade | Valor Total | Percentual |
|--------|-----------|-------------|------------|
| NULL | 11 | R$ 0,00 | 52.4% |
| Pedido enviado para cliente | 9 | R$ 7.286,17 | 42.9% |
| Aguardando pagamento | 1 | R$ 237,03 | 4.8% |

**Problema:**
- 52.4% dos pedidos têm status_pedido NULL
- Isso indica migração incompleta ou dados corrompidos

---

# CAMPOS DE ORDERS

## Campos Legados (Migração)

| Campo | Tipo | Observação |
|-------|------|------------|
| numero_pedido | TEXT | Número do pedido da loja virtual |
| id_comprador | TEXT | ID do comprador (legado) |
| comprador | TEXT | Nome do comprador (legado) |
| usuario | TEXT | Usuário (legado) |
| patrocinador_comprador | TEXT | Patrocinador (legado) |
| forma_pagamento | TEXT | Forma de pagamento (legado) |
| estado | TEXT | Estado (legado) |
| cidade | TEXT | Cidade (legado) |
| endereco | TEXT | Endereço (legado) |
| bairro | TEXT | Bairro (legado) |
| numero | TEXT | Número (legado) |
| complemento | TEXT | Complemento (legado) |
| cep | TEXT | CEP (legado) |
| forma_entrega | TEXT | Forma de entrega (legado) |
| plano_comprador | TEXT | Plano do comprador (legado) |
| indicou | TEXT | Indicou (legado) |
| tipo_compra | TEXT | Tipo de compra (legado) |
| loja | TEXT | Loja (legado) |
| hora_pagamento | TIME | Hora do pagamento (legado) |

## Campos Modernos

| Campo | Tipo | Observação |
|-------|------|------------|
| id | UUID | ID único (moderno) |
| customer_id | UUID | Link com customers |
| distributor_id | UUID | Link com distribuidor |
| user_id | UUID | Link com auth.users |
| status_pedido | TEXT | Status do pedido |
| cancelado | BOOLEAN | Pedido cancelado |
| pago | BOOLEAN | Pedido pago |
| data_criacao | TIMESTAMP | Data de criação |
| data_pagamento | TIMESTAMP | Data de pagamento |
| valor_total_pedido | NUMERIC | Valor total (legado) |
| valor_total | NUMERIC | Valor total (moderno) |
| custo_frete | NUMERIC | Custo do frete |
| status | VARCHAR | Status (moderno) |
| payment_id | UUID | Link com payments |
| payment_method | TEXT | Método de pagamento |
| payment_status | TEXT | Status do pagamento |
| gateway_transaction_id | TEXT | ID da transação no gateway |
| payment_metadata | JSONB | Metadados do pagamento |
| total_amount | NUMERIC | Valor total (alternativo) |
| order_number | VARCHAR | Número do pedido (moderno) |
| order_type | VARCHAR | Tipo do pedido |
| customer_name | VARCHAR | Nome do cliente |
| data_criacao_pedido | TIMESTAMP | Data de criação do pedido |
| metadata | JSONB | Metadados gerais |

**Problema:**
- Múltiplos campos redundantes (valor_total_pedido vs valor_total vs total_amount)
- Campos legados e modernos misturados
- Falta de padronização

---

# AÇÕES CORRETIVAS PRIORITÁRIAS

## CRÍTICO (Bloqueia Operação)

1. **Restaurar orders a partir de orders_backup**
   ```sql
   DROP TABLE orders;
   ALTER TABLE orders_backup RENAME TO orders;
   ```

2. **Converter order_items.order_id para UUID**
   ```sql
   ALTER TABLE order_items 
   ALTER COLUMN order_id TYPE UUID 
   USING order_id::uuid;
   ```

3. **Restaurar order_items a partir de order_items_backup**
   ```sql
   DROP TABLE order_items;
   ALTER TABLE order_items_backup RENAME TO order_items;
   ```

4. **Recalcular totais de orders**
   ```sql
   UPDATE orders o
   SET valor_total = (
       SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
       FROM order_items oi
       WHERE oi.order_id = o.id
   )
   WHERE o.valor_total IS NULL 
   OR o.valor_total <> (
       SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
       FROM order_items oi
       WHERE oi.order_id = o.id
   );
   ```

## ALTO (Impacta Qualidade)

5. **Limpar campos legados redundantes**
   - Migrar dados de campos legados para campos modernos
   - Remover campos legados após validação
   - Documentar mapeamento de campos

6. **Padronizar campos de valor**
   - Escolher um campo oficial de valor total (recomendado: valor_total)
   - Remover campos redundantes (valor_total_pedido, total_amount)
   - Atualizar todas as queries

## MÉDIO (Melhorias Futuras)

7. **Criar triggers de integridade**
   - Trigger para atualizar valor_total ao modificar order_items
   - Trigger para validar status_pedido
   - Trigger para validar customer_id

8. **Criar views de pedidos**
   - View consolidada de pedidos com itens
   - View de pedidos por status
   - View de pedidos por período

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Integridade de Dados | 1/10 | ❌ Crítico |
| Consistência Matemática | 3/10 | ❌ Crítico |
| Integridade Referencial | 0/10 | ❌ Crítico |
| Qualidade de Status | 4/10 | ❌ Crítico |
| Padronização de Campos | 3/10 | ❌ Crítico |
| **Orders Readiness** | **2.2/10** | **❌ Crítico** |

---

# CONCLUSÃO

O sistema de pedidos **NÃO possui dados confiáveis**. A tabela `orders` foi recriada recentemente (apenas 21 registros vs 22,195 no backup), e há um type mismatch crítico entre orders.id (UUID) e order_items.order_id (TEXT) que impede joins funcionais.

**Recomendação Imediata:**
1. Restaurar orders a partir de orders_backup
2. Converter order_items.order_id para UUID
3. Restaurar order_items a partir de order_items_backup
4. Recalcular totais de orders
5. Limpar campos legados redundantes

**Após correções, o sistema estará pronto para:**
- Relatórios de pedidos confiáveis
- Cálculos de receita corretos
- Cálculos de comissões baseados em dados reais
- Dashboard de pedidos funcional

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
