import { z } from "zod";

export const optionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(["select", "radio", "checkbox", "color", "text", "number"]),
  description: z.string().nullable(),
  is_required: z.boolean().default(false),
  values: z.array(z.object({
    id: z.string().uuid(),
    label: z.string(),
    value: z.string(),
    sort_order: z.number().default(0),
    price_adjustment: z.number().default(0),
    is_default: z.boolean().default(false),
  })),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Option = z.infer<typeof optionSchema>;
export type OptionValue = z.infer<typeof optionSchema.shape.values.element>;

export const createOptionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(["select", "radio", "checkbox", "color", "text", "number"]),
  description: z.string().optional(),
  is_required: z.boolean().default(false),
  values: z.array(z.object({
    label: z.string(),
    value: z.string(),
    sort_order: z.number().default(0),
    price_adjustment: z.number().default(0),
    is_default: z.boolean().default(false),
  })),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateOptionDto = z.infer<typeof createOptionSchema>;

export const updateOptionSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  type: z.enum(["select", "radio", "checkbox", "color", "text", "number"]).optional(),
  description: z.string().optional(),
  is_required: z.boolean().optional(),
  values: z.array(z.object({
    label: z.string(),
    value: z.string(),
    sort_order: z.number().default(0),
    price_adjustment: z.number().default(0),
    is_default: z.boolean().default(false),
  })).optional(),
  sort_order: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateOptionDto = z.infer<typeof updateOptionSchema>;

export const productOptionValueSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  option_id: z.string().uuid(),
  option_value_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ProductOptionValue = z.infer<typeof productOptionValueSchema>;

export const createProductOptionValueSchema = z.object({
  product_id: z.string().uuid(),
  option_id: z.string().uuid(),
  option_value_id: z.string().uuid(),
});

export type CreateProductOptionValueDto = z.infer<typeof createProductOptionValueSchema>;
