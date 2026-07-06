import { z } from "zod";

export const manufacturerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  logo_url: z.string().url().nullable(),
  website_url: z.string().url().nullable(),
  country: z.string().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Manufacturer = z.infer<typeof manufacturerSchema>;

export const createManufacturerSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  country: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateManufacturerDto = z.infer<typeof createManufacturerSchema>;

export const updateManufacturerSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  country: z.string().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateManufacturerDto = z.infer<typeof updateManufacturerSchema>;
