import { z } from "zod";

export const orderSchema = z.object({
  id: z.string().uuid(),
  comprador: z.string().nullable().optional(),
  usuario: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  valor_total: z.union([z.string(), z.number()]).nullable().optional(),
  forma_pagamento: z.string().nullable().optional(),
  pedido_pago: z.string().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
  data_criacao_pedido: z.string().nullable().optional(),
  data_pagamento_pedido: z.string().nullable().optional(),
  informacoes_produtos: z.string().nullable().optional(),
  pagamentos: z.string().nullable().optional(),
  loja: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
});

export type Order = z.infer<typeof orderSchema>;

export const createOrderSchema = z.object({
  comprador: z.string().optional(),
  usuario: z.string().optional(),
  valor_total: z.union([z.string(), z.number()]).optional(),
  forma_pagamento: z.string().optional(),
  pedido_pago: z.string().optional(),
  status: z.string().optional(),
  data_criacao_pedido: z.string().optional(),
  data_pagamento_pedido: z.string().optional(),
  informacoes_produtos: z.string().optional(),
  pagamentos: z.string().optional(),
  loja: z.string().optional(),
  user_id: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  status: z.string().optional(),
  valor_total: z.union([z.string(), z.number()]).optional(),
  forma_pagamento: z.string().optional(),
  pedido_pago: z.string().optional(),
  data_criacao_pedido: z.string().optional(),
  data_pagamento_pedido: z.string().optional(),
  informacoes_produtos: z.string().optional(),
  pagamentos: z.string().optional(),
  loja: z.string().optional(),
});

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().nullable().optional(),
  import_id: z.string().nullable().optional(),
  produto: z.string().nullable().optional(),
  quantidade: z.union([z.string(), z.number()]).nullable().optional(),
  valor: z.union([z.string(), z.number()]).nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
  user_id: z.string().nullable().optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSummarySchema = z.object({
  id: z.string().uuid(),
  id_comprador: z.string().nullable().optional(),
  customer_name: z.string(),
  status: z.string(),
  total_amount: z.number(),
  payment_status: z.string(),
  item_count: z.number(),
  created_at: z.string().datetime().nullable().optional(),
});

export type OrderSummary = z.infer<typeof orderSummarySchema>;
