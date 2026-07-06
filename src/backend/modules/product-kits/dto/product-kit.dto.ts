import { z } from "zod";

export const productKitItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export const productKitSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image_url: z.string().url().nullable(),
  items: z.array(productKitItemSchema),
  total_price: z.number().min(0),
  discount_percentage: z.number().min(0).max(100).default(0),
  discounted_price: z.number().min(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  stock_quantity: z.number().default(0),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ProductKit = z.infer<typeof productKitSchema>;
export type ProductKitItem = z.infer<typeof productKitItemSchema>;

export const createProductKitSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  items: z.array(productKitItemSchema),
  discount_percentage: z.number().min(0).max(100).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  stock_quantity: z.number().default(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateProductKitDto = z.infer<typeof createProductKitSchema>;

export const updateProductKitSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  items: z.array(productKitItemSchema).optional(),
  discount_percentage: z.number().min(0).max(100).optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  stock_quantity: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateProductKitDto = z.infer<typeof updateProductKitSchema>;
