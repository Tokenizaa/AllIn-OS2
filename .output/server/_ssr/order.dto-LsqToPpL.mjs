import { o as objectType, s as stringType, u as unionType, n as numberType } from "../_libs/zod.mjs";
objectType({
  id: stringType().uuid(),
  comprador: stringType().nullable().optional(),
  usuario: stringType().nullable().optional(),
  status: stringType().nullable().optional(),
  valor_total: unionType([stringType(), numberType()]).nullable().optional(),
  forma_pagamento: stringType().nullable().optional(),
  pedido_pago: stringType().nullable().optional(),
  created_at: stringType().datetime().nullable().optional(),
  updated_at: stringType().datetime().nullable().optional(),
  data_criacao_pedido: stringType().nullable().optional(),
  data_pagamento_pedido: stringType().nullable().optional(),
  informacoes_produtos: stringType().nullable().optional(),
  pagamentos: stringType().nullable().optional(),
  loja: stringType().nullable().optional(),
  user_id: stringType().nullable().optional()
});
const createOrderSchema = objectType({
  comprador: stringType().optional(),
  usuario: stringType().optional(),
  valor_total: unionType([stringType(), numberType()]).optional(),
  forma_pagamento: stringType().optional(),
  pedido_pago: stringType().optional(),
  status: stringType().optional(),
  data_criacao_pedido: stringType().optional(),
  data_pagamento_pedido: stringType().optional(),
  informacoes_produtos: stringType().optional(),
  pagamentos: stringType().optional(),
  loja: stringType().optional(),
  user_id: stringType().optional()
});
const updateOrderSchema = objectType({
  status: stringType().optional(),
  valor_total: unionType([stringType(), numberType()]).optional(),
  forma_pagamento: stringType().optional(),
  pedido_pago: stringType().optional(),
  data_criacao_pedido: stringType().optional(),
  data_pagamento_pedido: stringType().optional(),
  informacoes_produtos: stringType().optional(),
  pagamentos: stringType().optional(),
  loja: stringType().optional()
});
objectType({
  id: stringType().uuid(),
  order_id: stringType().nullable().optional(),
  import_id: stringType().nullable().optional(),
  produto: stringType().nullable().optional(),
  quantidade: unionType([stringType(), numberType()]).nullable().optional(),
  valor: unionType([stringType(), numberType()]).nullable().optional(),
  created_at: stringType().datetime().nullable().optional(),
  updated_at: stringType().datetime().nullable().optional(),
  user_id: stringType().nullable().optional()
});
objectType({
  id: stringType().uuid(),
  customer_id: stringType().nullable().optional(),
  customer_name: stringType(),
  status: stringType(),
  total_amount: numberType(),
  payment_status: stringType(),
  item_count: numberType(),
  created_at: stringType().datetime().nullable().optional()
});
export {
  createOrderSchema as c,
  updateOrderSchema as u
};
