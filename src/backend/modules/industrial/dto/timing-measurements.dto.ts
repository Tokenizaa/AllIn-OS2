import { z } from 'zod';

export const timingMeasurementSchema = z.object({
  id: z.string().uuid(),
  timing_record_id: z.string().uuid(),
  numero_medicao: z.number(),
  duracao_segundos: z.number(),
  maquina_id: z.string().uuid().nullable().optional(),
  processo_id: z.string().uuid().nullable().optional(),
  operador_id: z.string().uuid().nullable().optional(),
  condicoes_ambiente: z.string().optional(),
  temperatura_ambiente: z.number().optional(),
  umidade_percentual: z.number().optional(),
  observacoes: z.string().optional(),
  status: z.string().default('valid'),
  tags: z.array(z.any()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createTimingMeasurementSchema = z.object({
  timing_record_id: z.string().uuid(),
  numero_medicao: z.number(),
  duracao_segundos: z.number(),
  maquina_id: z.string().uuid().nullable().optional(),
  processo_id: z.string().uuid().nullable().optional(),
  operador_id: z.string().uuid().nullable().optional(),
  condicoes_ambiente: z.string().optional(),
  temperatura_ambiente: z.number().optional(),
  umidade_percentual: z.number().optional(),
  observacoes: z.string().optional(),
  status: z.string().default('valid'),
  tags: z.array(z.any()).optional(),
});

export const updateTimingMeasurementSchema = z.object({
  timing_record_id: z.string().uuid().optional(),
  numero_medicao: z.number().optional(),
  duracao_segundos: z.number().optional(),
  maquina_id: z.string().uuid().nullable().optional(),
  processo_id: z.string().uuid().nullable().optional(),
  operador_id: z.string().uuid().nullable().optional(),
  condicoes_ambiente: z.string().optional(),
  temperatura_ambiente: z.number().optional(),
  umidade_percentual: z.number().optional(),
  observacoes: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.any()).optional(),
});

export type TimingMeasurement = z.infer<typeof timingMeasurementSchema>;
export type CreateTimingMeasurementDTO = z.infer<typeof createTimingMeasurementSchema>;
export type UpdateTimingMeasurementDTO = z.infer<typeof updateTimingMeasurementSchema>;
export type TimingMeasurementResponseDTO = TimingMeasurement;
