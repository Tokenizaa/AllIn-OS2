import { z } from 'zod';

export const capacitySchema = z.object({
  id: z.string().uuid(),
  maquina_id: z.string().uuid(),
  capacidade_teorica: z.number().optional(),
  capacidade_observada: z.number().optional(),
  unidade_medida: z.string().optional(),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createCapacitySchema = z.object({
  maquina_id: z.string().uuid(),
  capacidade_teorica: z.number().optional(),
  capacidade_observada: z.number().optional(),
  unidade_medida: z.string().optional(),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  observacoes: z.string().optional(),
});

export const updateCapacitySchema = z.object({
  maquina_id: z.string().uuid().optional(),
  capacidade_teorica: z.number().optional(),
  capacidade_observada: z.number().optional(),
  unidade_medida: z.string().optional(),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  observacoes: z.string().optional(),
});

export type Capacity = z.infer<typeof capacitySchema>;
export type CreateCapacityDTO = z.infer<typeof createCapacitySchema>;
export type UpdateCapacityDTO = z.infer<typeof updateCapacitySchema>;
export type CapacityResponseDTO = Capacity;
