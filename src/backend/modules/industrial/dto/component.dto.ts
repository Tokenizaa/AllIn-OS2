import { z } from 'zod';

export const componentSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  categoria: z.string().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createComponentSchema = z.object({
  nome: z.string().min(1),
  categoria: z.string().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
});

export const updateComponentSchema = z.object({
  nome: z.string().min(1).optional(),
  categoria: z.string().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
});

export type Component = z.infer<typeof componentSchema>;
export type CreateComponentDTO = z.infer<typeof createComponentSchema>;
export type UpdateComponentDTO = z.infer<typeof updateComponentSchema>;
export type ComponentResponseDTO = Component;
