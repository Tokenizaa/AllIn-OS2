# Implementação de Cálculo Real de LTV no Banco

**Data:** 6 de Junho de 2026  
**Objetivo:** Migrar cálculo de LTV do frontend para o banco de dados para performance e consistência

## Problema Atual

O LTV (Lifetime Value) é calculado no frontend no hook `useCustomers`:
```typescript
const statsMap: Record<string, { count: number; ltv: number }> = {};
if (allOrders) {
  allOrders.forEach((o: any) => {
    const cid = o.customer_id;
    if (!cid) return;
    if (!statsMap[cid]) {
      statsMap[cid] = { count: 0, ltv: 0 };
    }
    statsMap[cid].count += 1;

    const isPaid = ["pago", "entregue", "enviado"].includes(
      (o.status_pedido || o.status || "").toLowerCase()
    );
    if (isPaid) {
      statsMap[cid].ltv += Number(o.valor_total_pedido || o.valor_total || 0);
    }
  });
}
```

**Problemas:**
- Performance: Recalcula toda vez que a página carrega
- Inconsistência: Diferentes partes do sistema podem ter cálculos diferentes
- Escalabilidade: Não escala com grande volume de dados

## Solução Proposta

### 1. Adicionar Coluna LTV à Tabela Customers

```sql
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS ltv DECIMAL(15,2) DEFAULT 0;

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS ltv_updated_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN customers.ltv IS 'Lifetime Value total do cliente (soma de pedidos pagos)';
COMMENT ON COLUMN customers.total_orders IS 'Número total de pedidos do cliente';
COMMENT ON COLUMN customers.ltv_updated_at IS 'Timestamp da última atualização do LTV';
```

### 2. Criar Trigger para Atualizar LTV Automaticamente

```sql
-- Função para atualizar LTV quando um pedido é inserido ou atualizado
CREATE OR REPLACE FUNCTION update_customer_ltv()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Novo pedido: incrementar total_orders e ltv se pago
    IF NEW.status_pedido IN ('pago', 'entregue', 'enviado') OR NEW.status IN ('pago', 'entregue', 'enviado') THEN
      UPDATE customers 
      SET 
        ltv = ltv + COALESCE(NEW.valor_total_pedido, NEW.valor_total, 0),
        total_orders = total_orders + 1,
        ltv_updated_at = NOW()
      WHERE id = NEW.customer_id;
    ELSE
      UPDATE customers 
      SET 
        total_orders = total_orders + 1,
        ltv_updated_at = NOW()
      WHERE id = NEW.customer_id;
    END IF;
    
    RETURN NEW;
  
  ELSIF TG_OP = 'UPDATE' THEN
    -- Pedido atualizado: recalcular diferença
    IF OLD.status_pedido NOT IN ('pago', 'entregue', 'enviado') AND OLD.status NOT IN ('pago', 'entregue', 'enviado') THEN
      -- Era não pago, agora pode ser pago
      IF NEW.status_pedido IN ('pago', 'entregue', 'enviado') OR NEW.status IN ('pago', 'entregue', 'enviado') THEN
        UPDATE customers 
        SET 
          ltv = ltv + COALESCE(NEW.valor_total_pedido, NEW.valor_total, 0),
          ltv_updated_at = NOW()
        WHERE id = NEW.customer_id;
      END IF;
    ELSIF OLD.status_pedido IN ('pago', 'entregue', 'enviado') OR OLD.status IN ('pago', 'entregue', 'enviado') THEN
      -- Era pago, agora pode não ser pago
      IF NEW.status_pedido NOT IN ('pago', 'entregue', 'enviado') AND NEW.status NOT IN ('pago', 'entregue', 'enviado') THEN
        UPDATE customers 
        SET 
          ltv = ltv - COALESCE(OLD.valor_total_pedido, OLD.valor_total, 0),
          ltv_updated_at = NOW()
        WHERE id = NEW.customer_id;
      ELSIF NEW.valor_total_pedido != OLD.valor_total_pedido OR NEW.valor_total != OLD.valor_total THEN
        -- Valor mudou, atualizar diferença
        UPDATE customers 
        SET 
          ltv = ltv + COALESCE(NEW.valor_total_pedido, NEW.valor_total, 0) - COALESCE(OLD.valor_total_pedido, OLD.valor_total, 0),
          ltv_updated_at = NOW()
        WHERE id = NEW.customer_id;
      END IF;
    END IF;
    
    RETURN NEW;
  
  ELSIF TG_OP = 'DELETE' THEN
    -- Pedido deletado: decrementar se era pago
    IF OLD.status_pedido IN ('pago', 'entregue', 'enviado') OR OLD.status IN ('pago', 'entregue', 'enviado') THEN
      UPDATE customers 
      SET 
        ltv = ltv - COALESCE(OLD.valor_total_pedido, OLD.valor_total, 0),
        total_orders = GREATEST(total_orders - 1, 0),
        ltv_updated_at = NOW()
      WHERE id = OLD.customer_id;
    ELSE
      UPDATE customers 
      SET 
        total_orders = GREATEST(total_orders - 1, 0),
        ltv_updated_at = NOW()
      WHERE id = OLD.customer_id;
    END IF;
    
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_update_customer_ltv ON orders;
CREATE TRIGGER trigger_update_customer_ltv
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_customer_ltv();
```

### 3. Script de Migração Inicial

```sql
-- Calcular LTV inicial para todos os customers existentes
UPDATE customers c
SET 
  ltv = COALESCE((
    SELECT COALESCE(SUM(o.valor_total_pedido), SUM(o.valor_total), 0)
    FROM orders o
    WHERE o.customer_id = c.id
    AND (o.status_pedido IN ('pago', 'entregue', 'enviado') OR o.status IN ('pago', 'entregue', 'enviado'))
  ), 0),
  total_orders = COALESCE((
    SELECT COUNT(*)
    FROM orders o
    WHERE o.customer_id = c.id
  ), 0),
  ltv_updated_at = NOW();
```

### 4. Atualizar Serviço para Usar LTV do Banco

```typescript
// src/services/customers/index.ts
async fetchCustomersWithOrderStats(page = 1, pageSize = 15) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: customerData, error: customerError, count: customerCount } = await supabase
    .from("customers")
    .select("id, user_id, usuario, id_comprador, qualification, status, telefone, created_at, nome_completo, ltv, total_orders", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (customerError) throw customerError;

  // Removido cálculo de orderStats do frontend - agora usa ltv do banco
  return {
    customers: customerData || [],
    totalCount: customerCount || 0,
    page,
    pageSize,
  };
}
```

### 5. Atualizar Frontend para Usar LTV do Banco

```typescript
// src/routes/_app/customers/index.tsx
const customers = (data as any)?.customers || [];
// Removido: const orderStats = (data as any)?.orderStats || {};

// Usar ltv diretamente do customer
const stats = { count: c.total_orders || 0, ltv: c.ltv || 0 };
```

## Benefícios

1. **Performance:** LTV calculado automaticamente pelo banco, não precisa recalcular a cada carregamento
2. **Consistência:** Única fonte de verdade para LTV
3. **Escalabilidade:** Escala com volume de dados
4. **Manutenibilidade:** Lógica centralizada no banco

## Plano de Implementação

### Fase 1: Schema
1. Adicionar colunas `ltv`, `total_orders`, `ltv_updated_at` à tabela `customers`
2. Executar script de migração inicial para popular dados históricos

### Fase 2: Trigger
1. Criar função `update_customer_ltv()`
2. Criar trigger na tabela `orders`
3. Testar trigger com inserts/updates/deletes

### Fase 3: Código
1. Atualizar `CustomerService.fetchCustomersWithOrderStats()` para usar LTV do banco
2. Atualizar frontend para usar `c.ltv` e `c.total_orders`
3. Remover cálculo de `orderStats` do frontend

### Fase 4: Validação
1. Verificar se LTVs calculados correspondem aos valores anteriores
2. Testar performance com volume de dados
3. Verificar consistência após operações CRUD

**Status:** Documentado para implementação. Requer execução de SQL e atualização de código.
