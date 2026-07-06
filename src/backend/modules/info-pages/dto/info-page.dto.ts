import { z } from "zod";

export const infoPageSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  summary: z.string().nullable(),
  is_published: z.boolean().default(false),
  published_at: z.string().datetime().nullable(),
  author_id: z.string().uuid().nullable(),
  category: z.string().nullable(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type InfoPage = z.infer<typeof infoPageSchema>;

export const createInfoPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  summary: z.string().optional(),
  is_published: z.boolean().default(false),
  author_id: z.string().uuid().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
});

export type CreateInfoPageDto = z.infer<typeof createInfoPageSchema>;

export const updateInfoPageSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().optional(),
  summary: z.string().optional(),
  is_published: z.boolean().optional(),
  author_id: z.string().uuid().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateInfoPageDto = z.infer<typeof updateInfoPageSchema>;
