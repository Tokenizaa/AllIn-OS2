import { z } from 'zod';

export const processSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  tipo_processo: z.string().optional(), // recebimento, corte, montagem, costura, fechamento, embalagem, expedicao
  sequencia: z.number().optional(),
  entradas: z.array(z.any()).optional(),
  saidas: z.array(z.any()).optional(),
  maquinas: z.array(z.any()).optional(),
  responsaveis: z.array(z.any()).optional(),
  tempo_padrao_minutos: z.number().optional(),
  capacidade_unidades_hora: z.number().optional(),
  perda_prevista_percentual: z.number().optional(),
  setup_time_minutos: z.number().optional(),
  lote_minimo: z.number().optional(),
  lote_maximo: z.number().optional(),
  tempo_padrao_unidade_segundos: z.number().optional(),
  eficiencia_padrao: z.number().optional(),
  status: z.string().default('active'),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createProcessSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  tipo_processo: z.string().optional(),
  sequencia: z.number().optional(),
  entradas: z.array(z.any()).optional(),
  saidas: z.array(z.any()).optional(),
  maquinas: z.array(z.any()).optional(),
  responsaveis: z.array(z.any()).optional(),
  tempo_padrao_minutos: z.number().optional(),
  capacidade_unidades_hora: z.number().optional(),
  perda_prevista_percentual: z.number().optional(),
  setup_time_minutos: z.number().optional(),
  lote_minimo: z.number().optional(),
  lote_maximo: z.number().optional(),
  tempo_padrao_unidade_segundos: z.number().optional(),
  eficiencia_padrao: z.number().optional(),
  status: z.string().default('active'),
  observacoes: z.string().optional(),
});

export const updateProcessSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  tipo_processo: z.string().optional(),
  sequencia: z.number().optional(),
  entradas: z.array(z.any()).optional(),
  saidas: z.array(z.any()).optional(),
  maquinas: z.array(z.any()).optional(),
  responsaveis: z.array(z.any()).optional(),
  tempo_padrao_minutos: z.number().optional(),
  capacidade_unidades_hora: z.number().optional(),
  perda_prevista_percentual: z.number().optional(),
  setup_time_minutos: z.number().optional(),
  lote_minimo: z.number().optional(),
  lote_maximo: z.number().optional(),
  tempo_padrao_unidade_segundos: z.number().optional(),
  eficiencia_padrao: z.number().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
});

export type Process = z.infer<typeof processSchema>;
export type CreateProcessDTO = z.infer<typeof createProcessSchema>;
export type UpdateProcessDTO = z.infer<typeof updateProcessSchema>;
export type ProcessResponseDTO = Process;
