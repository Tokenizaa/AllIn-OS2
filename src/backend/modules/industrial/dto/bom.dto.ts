import { z } from 'zod';

export const bomSchema = z.object({
  id: z.string().uuid(),
  produto_id: z.string().uuid(),
  componente_id: z.string().uuid(),
  quantidade: z.number(),
  unidade_medida: z.string().optional(),
  sequencia: z.number().optional(),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createBOMSchema = z.object({
  produto_id: z.string().uuid(),
  componente_id: z.string().uuid(),
  quantidade: z.number(),
  unidade_medida: z.string().optional(),
  sequencia: z.number().optional(),
  observacoes: z.string().optional(),
});

export const updateBOMSchema = z.object({
  produto_id: z.string().uuid().optional(),
  componente_id: z.string().uuid().optional(),
  quantidade: z.number().optional(),
  unidade_medida: z.string().optional(),
  sequencia: z.number().optional(),
  observacoes: z.string().optional(),
});

export type BOM = z.infer<typeof bomSchema>;
export type CreateBOMDTO = z.infer<typeof createBOMSchema>;
export type UpdateBOMDTO = z.infer<typeof updateBOMSchema>;
export type BOMResponseDTO = BOM;
