import { z } from 'zod';

export const capacitySchema = z.object({
  id: z.string().uuid(),
  maquina_id: z.string().uuid(),
  processo_id: z.string().uuid().nullable().optional(),
  setor_id: z.string().uuid().nullable().optional(),
  capacidade_teorica: z.number().optional(),
  capacidade_observada: z.number().optional(),
  unidade_medida: z.string().optional(),
  tipo_capacidade: z.string().optional(), // maquina, processo, setor
  periodo: z.string().optional(), // diario, semanal, mensal
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  capacidade_utilizada: z.number().optional(),
  capacidade_disponivel: z.number().optional(),
  eficiencia_percentual: z.number().optional(),
  turno: z.string().optional(), // manha, tarde, noite, integral
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createCapacitySchema = z.object({
  maquina_id: z.string().uuid(),
  processo_id: z.string().uuid().nullable().optional(),
  setor_id: z.string().uuid().nullable().optional(),
  capacidade_teorica: z.number().optional(),
  capacidade_observada: z.number().optional(),
  unidade_medida: z.string().optional(),
  tipo_capacidade: z.string().optional(),
  periodo: z.string().optional(),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  capacidade_utilizada: z.number().optional(),
  capacidade_disponivel: z.number().optional(),
  eficiencia_percentual: z.number().optional(),
  turno: z.string().optional(),
  observacoes: z.string().optional(),
});

export const updateCapacitySchema = z.object({
  maquina_id: z.string().uuid().optional(),
  processo_id: z.string().uuid().nullable().optional(),
  setor_id: z.string().uuid().nullable().optional(),
  capacidade_teorica: z.number().optional(),
  capacidade_observada: z.number().optional(),
  unidade_medida: z.string().optional(),
  tipo_capacidade: z.string().optional(),
  periodo: z.string().optional(),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  capacidade_utilizada: z.number().optional(),
  capacidade_disponivel: z.number().optional(),
  eficiencia_percentual: z.number().optional(),
  turno: z.string().optional(),
  observacoes: z.string().optional(),
});

export type Capacity = z.infer<typeof capacitySchema>;
export type CreateCapacityDTO = z.infer<typeof createCapacitySchema>;
export type UpdateCapacityDTO = z.infer<typeof updateCapacitySchema>;
export type CapacityResponseDTO = Capacity;
