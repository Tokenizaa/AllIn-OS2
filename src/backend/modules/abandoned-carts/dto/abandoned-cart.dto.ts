import { z } from "zod";

export const abandonedCartSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_email: z.string().email(),
  customer_name: z.string(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),
  total_amount: z.number().min(0),
  abandoned_at: z.string().datetime(),
  recovery_email_sent: z.boolean().default(false),
  recovery_email_sent_at: z.string().datetime().nullable(),
  recovered: z.boolean().default(false),
  recovered_at: z.string().datetime().nullable(),
  recovered_order_id: z.string().uuid().nullable(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type AbandonedCart = z.infer<typeof abandonedCartSchema>;

export const createAbandonedCartSchema = z.object({
  customer_id: z.string().uuid(),
  customer_email: z.string().email(),
  customer_name: z.string(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),
  total_amount: z.number().min(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateAbandonedCartDto = z.infer<typeof createAbandonedCartSchema>;

export const updateAbandonedCartSchema = z.object({
  recovery_email_sent: z.boolean().optional(),
  recovery_email_sent_at: z.string().datetime().optional(),
  recovered: z.boolean().optional(),
  recovered_at: z.string().datetime().optional(),
  recovered_order_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateAbandonedCartDto = z.infer<typeof updateAbandonedCartSchema>;

export const abandonedCartStatsSchema = z.object({
  total_abandoned: z.number(),
  total_recovered: z.number(),
  recovery_rate: z.number(),
  total_revenue_recovered: z.number(),
  total_revenue_lost: z.number(),
  average_abandonment_time_hours: z.number(),
});

export type AbandonedCartStats = z.infer<typeof abandonedCartStatsSchema>;
