import { z } from 'zod';

export const bomSchema = z.object({
  id: z.string().uuid(),
  produto_id: z.string().uuid(),
  componente_id: z.string().uuid(),
  quantidade: z.number(),
  unidade_medida: z.string().optional(),
  sequencia: z.number().optional(),
  consumo_por_unidade: z.number().optional(),
  perdas_previstas_percentual: z.number().optional(),
  revisao: z.string().optional(),
  versao: z.string().optional(),
  vigencia_inicio: z.string().or(z.date()).optional(),
  vigencia_fim: z.string().or(z.date()).optional(),
  status_vigencia: z.string().optional(),
  custo_unitario: z.number().optional(),
  custo_total: z.number().optional(),
  observacoes: z.string().optional(),
  aprovado_por: z.string().uuid().nullable().optional(),
  data_aprovacao: z.string().or(z.date()).optional(),
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
  consumo_por_unidade: z.number().optional(),
  perdas_previstas_percentual: z.number().optional(),
  revisao: z.string().optional(),
  versao: z.string().optional(),
  vigencia_inicio: z.string().or(z.date()).optional(),
  vigencia_fim: z.string().or(z.date()).optional(),
  status_vigencia: z.string().optional(),
  custo_unitario: z.number().optional(),
  custo_total: z.number().optional(),
  observacoes: z.string().optional(),
  aprovado_por: z.string().uuid().nullable().optional(),
  data_aprovacao: z.string().or(z.date()).optional(),
});

export const updateBOMSchema = z.object({
  produto_id: z.string().uuid().optional(),
  componente_id: z.string().uuid().optional(),
  quantidade: z.number().optional(),
  unidade_medida: z.string().optional(),
  sequencia: z.number().optional(),
  consumo_por_unidade: z.number().optional(),
  perdas_previstas_percentual: z.number().optional(),
  revisao: z.string().optional(),
  versao: z.string().optional(),
  vigencia_inicio: z.string().or(z.date()).optional(),
  vigencia_fim: z.string().or(z.date()).optional(),
  status_vigencia: z.string().optional(),
  custo_unitario: z.number().optional(),
  custo_total: z.number().optional(),
  observacoes: z.string().optional(),
  aprovado_por: z.string().uuid().nullable().optional(),
  data_aprovacao: z.string().or(z.date()).optional(),
});

export type BOM = z.infer<typeof bomSchema>;
export type CreateBOMDTO = z.infer<typeof createBOMSchema>;
export type UpdateBOMDTO = z.infer<typeof updateBOMSchema>;
export type BOMResponseDTO = BOM;
