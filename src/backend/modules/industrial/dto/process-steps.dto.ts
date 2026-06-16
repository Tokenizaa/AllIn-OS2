import { z } from 'zod';

export const processStepSchema = z.object({
  id: z.string().uuid(),
  processo_id: z.string().uuid(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  sequencia: z.number(),
  entradas: z.array(z.any()).optional(),
  saidas: z.array(z.any()).optional(),
  maquinas: z.array(z.any()).optional(),
  responsaveis: z.array(z.any()).optional(),
  tempo_padrao_minutos: z.number().optional(),
  tempo_padrao_unidade_segundos: z.number().optional(),
  capacidade_unidades_hora: z.number().optional(),
  perda_prevista_percentual: z.number().optional(),
  status: z.string().default('active'),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createProcessStepSchema = z.object({
  processo_id: z.string().uuid(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  sequencia: z.number(),
  entradas: z.array(z.any()).optional(),
  saidas: z.array(z.any()).optional(),
  maquinas: z.array(z.any()).optional(),
  responsaveis: z.array(z.any()).optional(),
  tempo_padrao_minutos: z.number().optional(),
  tempo_padrao_unidade_segundos: z.number().optional(),
  capacidade_unidades_hora: z.number().optional(),
  perda_prevista_percentual: z.number().optional(),
  status: z.string().default('active'),
  observacoes: z.string().optional(),
});

export const updateProcessStepSchema = z.object({
  processo_id: z.string().uuid().optional(),
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  sequencia: z.number().optional(),
  entradas: z.array(z.any()).optional(),
  saidas: z.array(z.any()).optional(),
  maquinas: z.array(z.any()).optional(),
  responsaveis: z.array(z.any()).optional(),
  tempo_padrao_minutos: z.number().optional(),
  tempo_padrao_unidade_segundos: z.number().optional(),
  capacidade_unidades_hora: z.number().optional(),
  perda_prevista_percentual: z.number().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ProcessStep = z.infer<typeof processStepSchema>;
export type CreateProcessStepDTO = z.infer<typeof createProcessStepSchema>;
export type UpdateProcessStepDTO = z.infer<typeof updateProcessStepSchema>;
export type ProcessStepResponseDTO = ProcessStep;
