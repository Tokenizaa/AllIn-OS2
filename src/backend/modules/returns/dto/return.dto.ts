import { z } from "zod";

export const returnReasonSchema = z.enum([
  "defective_product",
  "wrong_item",
  "no_longer_needed",
  "damaged_shipping",
  "not_as_described",
  "other",
]);

export const returnStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "processing",
  "completed",
  "cancelled",
]);

export const returnItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  reason: returnReasonSchema,
  condition: z.string().optional(),
});

export const returnSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  items: z.array(returnItemSchema),
  total_refund_amount: z.number().min(0),
  status: returnStatusSchema,
  reason: returnReasonSchema,
  description: z.string().optional(),
  refund_method: z.enum(["original_payment", "store_credit", "bank_transfer"]).optional(),
  refund_account_details: z.record(z.any()).nullable(),
  approved_at: z.string().datetime().nullable(),
  approved_by: z.string().uuid().nullable(),
  rejected_at: z.string().datetime().nullable(),
  rejected_by: z.string().uuid().nullable(),
  rejection_reason: z.string().nullable(),
  completed_at: z.string().datetime().nullable(),
  tracking_number: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Return = z.infer<typeof returnSchema>;
export type ReturnReason = z.infer<typeof returnReasonSchema>;
export type ReturnStatus = z.infer<typeof returnStatusSchema>;
export type ReturnItem = z.infer<typeof returnItemSchema>;

export const createReturnSchema = z.object({
  order_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  items: z.array(returnItemSchema),
  reason: returnReasonSchema,
  description: z.string().optional(),
  refund_method: z.enum(["original_payment", "store_credit", "bank_transfer"]).optional(),
  refund_account_details: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateReturnDto = z.infer<typeof createReturnSchema>;

export const updateReturnSchema = z.object({
  status: returnStatusSchema.optional(),
  description: z.string().optional(),
  refund_method: z.enum(["original_payment", "store_credit", "bank_transfer"]).optional(),
  refund_account_details: z.record(z.any()).optional(),
  rejection_reason: z.string().optional(),
  tracking_number: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateReturnDto = z.infer<typeof updateReturnSchema>;

export const returnStatsSchema = z.object({
  total_returns: z.number(),
  pending_returns: z.number(),
  approved_returns: z.number(),
  rejected_returns: z.number(),
  completed_returns: z.number(),
  total_refund_amount: z.number(),
  average_processing_time_hours: z.number(),
});

export type ReturnStats = z.infer<typeof returnStatsSchema>;
