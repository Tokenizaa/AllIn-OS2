import { z } from 'zod';

export const timingRecordSchema = z.object({
  id: z.string().uuid(),
  processo_id: z.string().uuid().nullable().optional(),
  maquina_id: z.string().uuid().nullable().optional(),
  operador_id: z.string().uuid().nullable().optional(),
  inicio: z.string().or(z.date()),
  fim: z.string().or(z.date()).nullable().optional(),
  duracao_segundos: z.number().optional(),
  data_hora_inicio: z.string().or(z.date()).optional(),
  data_hora_fim: z.string().or(z.date()).optional(),
  numero_medicao: z.number().optional(),
  produto_id: z.string().uuid().nullable().optional(),
  quantidade_produzida: z.number().optional(),
  condicoes_ambiente: z.string().optional(),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createTimingRecordSchema = z.object({
  processo_id: z.string().uuid().nullable().optional(),
  maquina_id: z.string().uuid().nullable().optional(),
  operador_id: z.string().uuid().nullable().optional(),
  inicio: z.string().or(z.date()),
  fim: z.string().or(z.date()).nullable().optional(),
  duracao_segundos: z.number().optional(),
  data_hora_inicio: z.string().or(z.date()).optional(),
  data_hora_fim: z.string().or(z.date()).optional(),
  numero_medicao: z.number().optional(),
  produto_id: z.string().uuid().nullable().optional(),
  quantidade_produzida: z.number().optional(),
  condicoes_ambiente: z.string().optional(),
  observacoes: z.string().optional(),
});

export const updateTimingRecordSchema = z.object({
  processo_id: z.string().uuid().nullable().optional(),
  maquina_id: z.string().uuid().nullable().optional(),
  operador_id: z.string().uuid().nullable().optional(),
  inicio: z.string().or(z.date()).optional(),
  fim: z.string().or(z.date()).nullable().optional(),
  duracao_segundos: z.number().optional(),
  data_hora_inicio: z.string().or(z.date()).optional(),
  data_hora_fim: z.string().or(z.date()).optional(),
  numero_medicao: z.number().optional(),
  produto_id: z.string().uuid().nullable().optional(),
  quantidade_produzida: z.number().optional(),
  condicoes_ambiente: z.string().optional(),
  observacoes: z.string().optional(),
});

export type TimingRecord = z.infer<typeof timingRecordSchema>;
export type CreateTimingRecordDTO = z.infer<typeof createTimingRecordSchema>;
export type UpdateTimingRecordDTO = z.infer<typeof updateTimingRecordSchema>;
export type TimingRecordResponseDTO = TimingRecord;
