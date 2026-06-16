import { z } from 'zod';

export const capacityHistorySchema = z.object({
  id: z.string().uuid(),
  capacity_id: z.string().uuid(),
  data_registro: z.string().or(z.date()),
  periodo: z.string(), // diario, semanal, mensal
  capacidade_planejada: z.number().optional(),
  capacidade_realizada: z.number().optional(),
  capacidade_utilizada: z.number().optional(),
  capacidade_disponivel: z.number().optional(),
  eficiencia_percentual: z.number().optional(),
  maquina_id: z.string().uuid().nullable().optional(),
  processo_id: z.string().uuid().nullable().optional(),
  setor_id: z.string().uuid().nullable().optional(),
  observacoes: z.string().optional(),
  tags: z.array(z.any()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createCapacityHistorySchema = z.object({
  capacity_id: z.string().uuid(),
  data_registro: z.string().or(z.date()),
  periodo: z.string(),
  capacidade_planejada: z.number().optional(),
  capacidade_realizada: z.number().optional(),
  capacidade_utilizada: z.number().optional(),
  capacidade_disponivel: z.number().optional(),
  eficiencia_percentual: z.number().optional(),
  maquina_id: z.string().uuid().nullable().optional(),
  processo_id: z.string().uuid().nullable().optional(),
  setor_id: z.string().uuid().nullable().optional(),
  observacoes: z.string().optional(),
  tags: z.array(z.any()).optional(),
});

export const updateCapacityHistorySchema = z.object({
  capacity_id: z.string().uuid().optional(),
  data_registro: z.string().or(z.date()).optional(),
  periodo: z.string().optional(),
  capacidade_planejada: z.number().optional(),
  capacidade_realizada: z.number().optional(),
  capacidade_utilizada: z.number().optional(),
  capacidade_disponivel: z.number().optional(),
  eficiencia_percentual: z.number().optional(),
  maquina_id: z.string().uuid().nullable().optional(),
  processo_id: z.string().uuid().nullable().optional(),
  setor_id: z.string().uuid().nullable().optional(),
  observacoes: z.string().optional(),
  tags: z.array(z.any()).optional(),
});

export type CapacityHistory = z.infer<typeof capacityHistorySchema>;
export type CreateCapacityHistoryDTO = z.infer<typeof createCapacityHistorySchema>;
export type UpdateCapacityHistoryDTO = z.infer<typeof updateCapacityHistorySchema>;
export type CapacityHistoryResponseDTO = CapacityHistory;
