import { z } from "zod";
z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  amount: z.number(),
  status: z.enum(["pending", "processing", "approved", "rejected", "refunded", "cancelled", "failed"]),
  payment_method: z.string(),
  payment_gateway: z.string(),
  gateway_transaction_id: z.string().nullable(),
  gateway_response: z.record(z.any()).nullable(),
  metadata: z.record(z.any()).nullable().optional(),
  amount_paid: z.number().nullable().optional(),
  currency: z.string().optional(),
  payment_method_type: z.string().optional(),
  paid_at: z.string().datetime().nullable(),
  refunded_at: z.string().datetime().nullable().optional(),
  cancelled_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});
const createPaymentSchema = z.object({
  order_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  amount: z.number().min(0),
  payment_method: z.string(),
  payment_gateway: z.string()
});
const updatePaymentSchema = z.object({
  status: z.enum(["pending", "processing", "approved", "rejected", "refunded", "cancelled", "failed"]).optional(),
  gateway_transaction_id: z.string().optional(),
  gateway_response: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  amount_paid: z.number().optional(),
  currency: z.string().optional(),
  payment_method_type: z.string().optional(),
  paid_at: z.string().datetime().optional(),
  refunded_at: z.string().datetime().optional(),
  cancelled_at: z.string().datetime().optional()
});
const webhookPayloadSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  timestamp: z.string()
});
export {
  createPaymentSchema as c,
  updatePaymentSchema as u,
  webhookPayloadSchema as w
};
