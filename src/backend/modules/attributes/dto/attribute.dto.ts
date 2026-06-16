import { z } from "zod";

export const attributeTypeSchema = z.enum(["text", "number", "boolean", "select", "multiselect", "date", "color"]);

export const attributeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  type: attributeTypeSchema,
  description: z.string().nullable(),
  is_required: z.boolean().default(false),
  is_filterable: z.boolean().default(false),
  is_searchable: z.boolean().default(false),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
    sort_order: z.number().default(0),
  })).optional(),
  default_value: z.any().nullable(),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Attribute = z.infer<typeof attributeSchema>;
export type AttributeType = z.infer<typeof attributeTypeSchema>;

export const createAttributeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: attributeTypeSchema,
  description: z.string().optional(),
  is_required: z.boolean().default(false),
  is_filterable: z.boolean().default(false),
  is_searchable: z.boolean().default(false),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
    sort_order: z.number().default(0),
  })).optional(),
  default_value: z.any().optional(),
  sort_order: z.number().default(0),
  metadata: z.record(z.any()).optional(),
});

export type CreateAttributeDto = z.infer<typeof createAttributeSchema>;

export const updateAttributeSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  type: attributeTypeSchema.optional(),
  description: z.string().optional(),
  is_required: z.boolean().optional(),
  is_filterable: z.boolean().optional(),
  is_searchable: z.boolean().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
    sort_order: z.number().default(0),
  })).optional(),
  default_value: z.any().optional(),
  sort_order: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateAttributeDto = z.infer<typeof updateAttributeSchema>;

export const productAttributeValueSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  attribute_id: z.string().uuid(),
  value: z.any(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ProductAttributeValue = z.infer<typeof productAttributeValueSchema>;

export const createProductAttributeValueSchema = z.object({
  product_id: z.string().uuid(),
  attribute_id: z.string().uuid(),
  value: z.any(),
});

export type CreateProductAttributeValueDto = z.infer<typeof createProductAttributeValueSchema>;

export const updateProductAttributeValueSchema = z.object({
  value: z.any().optional(),
});

export type UpdateProductAttributeValueDto = z.infer<typeof updateProductAttributeValueSchema>;
