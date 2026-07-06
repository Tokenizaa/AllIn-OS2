import { z } from "zod";

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image_url: z.string().url().nullable(),
  parent_id: z.string().uuid().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Department = z.infer<typeof departmentSchema>;

export const createDepartmentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  parent_id: z.string().uuid().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  parent_id: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;
