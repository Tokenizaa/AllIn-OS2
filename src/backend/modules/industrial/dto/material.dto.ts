import { z } from 'zod';

export const materialSchema = z.object({
  id: z.string().uuid(),
  codigo: z.string().min(1),
  descricao: z.string().min(1),
  categoria: z.string().optional(),
  unidade_medida: z.string().min(1),
  estoque_atual: z.number().default(0),
  estoque_minimo: z.number().default(0),
  estoque_maximo: z.number().optional(),
  custo_unitario: z.number().optional(),
  custo_medio: z.number().optional(),
  fornecedor_padrao_id: z.string().uuid().nullable().optional(),
  localizacao_id: z.string().uuid().nullable().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createMaterialSchema = z.object({
  codigo: z.string().min(1),
  descricao: z.string().min(1),
  categoria: z.string().optional(),
  unidade_medida: z.string().min(1),
  estoque_atual: z.number().default(0),
  estoque_minimo: z.number().default(0),
  estoque_maximo: z.number().optional(),
  custo_unitario: z.number().optional(),
  custo_medio: z.number().optional(),
  fornecedor_padrao_id: z.string().uuid().nullable().optional(),
  localizacao_id: z.string().uuid().nullable().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
});

export const updateMaterialSchema = z.object({
  codigo: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  categoria: z.string().optional(),
  unidade_medida: z.string().min(1).optional(),
  estoque_atual: z.number().optional(),
  estoque_minimo: z.number().optional(),
  estoque_maximo: z.number().optional(),
  custo_unitario: z.number().optional(),
  custo_medio: z.number().optional(),
  fornecedor_padrao_id: z.string().uuid().nullable().optional(),
  localizacao_id: z.string().uuid().nullable().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
});

export type Material = z.infer<typeof materialSchema>;
export type CreateMaterialDTO = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialDTO = z.infer<typeof updateMaterialSchema>;
export type MaterialResponseDTO = Material;
