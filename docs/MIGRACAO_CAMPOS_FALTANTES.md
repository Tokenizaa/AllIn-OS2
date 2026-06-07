# Migração de Campos Faltantes

**Data:** 6 de Junho de 2026  
**Objetivo:** Documentar campos que existem nos arquivos originais mas não foram migrados para o Supabase

## Campos Identificados

### 1. hora_pagamento / Hora_pagamento

**Fonte:** `user_compras_allin_geral.xlsx`  
**Campo Original:** `Hora_pagamento` (755 NULLs de 22,195 registros)  
**Status:** NÃO migrado

**Descrição:** Hora do pagamento do pedido. Usado em conjunto com `data_pagamento` para precisão temporal.

**Impacto:** Médio - Permite análise mais precisa de horários de pico de pagamentos.

**SQL para Adicionar Campo:**
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS hora_pagamento TIME;

-- Comentário sobre o campo
COMMENT ON COLUMN orders.hora_pagamento IS 'Hora do pagamento do pedido (formato HH:MM:SS)';
```

**Migração de Dados:**
```sql
-- Se os dados estiverem disponíveis em formato string, converter para TIME
UPDATE orders 
SET hora_pagamento = TO_TIMESTAMP(hora_pagamento_text, 'HH24:MI:SS')::TIME
WHERE hora_pagamento_text IS NOT NULL;
```

---

### 2. custo_frete / Custo_de_Frete

**Fonte:** `relatorio_de_pedidos_detalhado.xlsx`  
**Campo Original:** `Custo_de_Frete`  
**Status:** NÃO migrado

**Descrição:** Custo do frete para o pedido. Importante para cálculo de margem de lucro.

**Impacto:** Alto - Essencial para análise de rentabilidade e cálculo de comissões líquidas.

**SQL para Adicionar Campo:**
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS custo_frete DECIMAL(10,2);

-- Comentário sobre o campo
COMMENT ON COLUMN orders.custo_frete IS 'Custo do frete do pedido em BRL';
```

**Migração de Dados:**
```sql
-- Se os dados estiverem disponíveis como string, converter para DECIMAL
UPDATE orders 
SET custo_frete = CAST(REPLACE(REPLACE(custo_frete_text, 'R$', ''), ',', '.') AS DECIMAL(10,2))
WHERE custo_frete_text IS NOT NULL;
```

---

## Prioridade de Implementação

### Alta Prioridade
1. **custo_frete** - Essencial para cálculo de margem e comissões

### Média Prioridade
2. **hora_pagamento** - Útil para análise de padrões temporais

---

## Plano de Ação

### Fase 1: Adicionar Campos ao Schema
1. Executar SQL para adicionar `custo_frete` à tabela `orders`
2. Executar SQL para adicionar `hora_pagamento` à tabela `orders`

### Fase 2: Migrar Dados
1. Extrair dados dos arquivos originais Excel
2. Mapear para os registros correspondentes no Supabase
3. Executar UPDATE em lote para popular os campos

### Fase 3: Validar
1. Verificar contagem de registros migrados
2. Validar integridade dos dados (valores nulos esperados vs inesperados)
3. Testar funcionalidades que dependem desses campos

---

## Notas Adicionais

- Os campos `hora_pagamento` e `data_pagamento` devem ser usados juntos para criar timestamps completos
- O campo `custo_frete` deve ser subtraído do valor total para calcular margem líquida
- Considerar adicionar índices se esses campos forem usados frequentemente em queries

**Status:** Documentado para implementação futura. Requer acesso aos arquivos originais para extração de dados.
