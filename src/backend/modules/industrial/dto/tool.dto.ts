import { z } from 'zod';

export const toolSchema = z.object({
  id: z.string().uuid(),
  descricao: z.string().min(1),
  categoria: z.string().optional(),
  localizacao_id: z.string().uuid().nullable().optional(),
  responsavel_id: z.string().uuid().nullable().optional(),
  status: z.string().default('available'),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createToolSchema = z.object({
  descricao: z.string().min(1),
  categoria: z.string().optional(),
  localizacao_id: z.string().uuid().nullable().optional(),
  responsavel_id: z.string().uuid().nullable().optional(),
  status: z.string().default('available'),
  observacoes: z.string().optional(),
});

export const updateToolSchema = z.object({
  descricao: z.string().min(1).optional(),
  categoria: z.string().optional(),
  localizacao_id: z.string().uuid().nullable().optional(),
  responsavel_id: z.string().uuid().nullable().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
});

export type Tool = z.infer<typeof toolSchema>;
export type CreateToolDTO = z.infer<typeof createToolSchema>;
export type UpdateToolDTO = z.infer<typeof updateToolSchema>;
export type ToolResponseDTO = Tool;
