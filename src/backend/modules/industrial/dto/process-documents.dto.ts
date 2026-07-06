import { z } from 'zod';

export const processDocumentSchema = z.object({
  id: z.string().uuid(),
  processo_id: z.string().uuid(),
  tipo: z.string(), // sop, instrucao, procedimento, desenho, video
  titulo: z.string().min(1),
  descricao: z.string().optional(),
  nome_arquivo: z.string().optional(),
  url_arquivo: z.string().optional(),
  tamanho_bytes: z.bigint().optional(),
  tipo_mime: z.string().optional(),
  versao: z.string().optional(),
  data_documento: z.string().or(z.date()).optional(),
  categoria: z.string().optional(), // operacional, seguranca, qualidade, treinamento
  confidencialidade: z.string().default('interno'), // publico, interno, confidencial
  idioma: z.string().default('pt-BR'),
  tags: z.array(z.any()).optional(),
  uploaded_by: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createProcessDocumentSchema = z.object({
  processo_id: z.string().uuid(),
  tipo: z.string(),
  titulo: z.string().min(1),
  descricao: z.string().optional(),
  nome_arquivo: z.string().optional(),
  url_arquivo: z.string().optional(),
  tamanho_bytes: z.bigint().optional(),
  tipo_mime: z.string().optional(),
  versao: z.string().optional(),
  data_documento: z.string().or(z.date()).optional(),
  categoria: z.string().optional(),
  confidencialidade: z.string().default('interno'),
  idioma: z.string().default('pt-BR'),
  tags: z.array(z.any()).optional(),
});

export const updateProcessDocumentSchema = z.object({
  processo_id: z.string().uuid().optional(),
  tipo: z.string().optional(),
  titulo: z.string().min(1).optional(),
  descricao: z.string().optional(),
  nome_arquivo: z.string().optional(),
  url_arquivo: z.string().optional(),
  tamanho_bytes: z.bigint().optional(),
  tipo_mime: z.string().optional(),
  versao: z.string().optional(),
  data_documento: z.string().or(z.date()).optional(),
  categoria: z.string().optional(),
  confidencialidade: z.string().optional(),
  idioma: z.string().optional(),
  tags: z.array(z.any()).optional(),
});

export type ProcessDocument = z.infer<typeof processDocumentSchema>;
export type CreateProcessDocumentDTO = z.infer<typeof createProcessDocumentSchema>;
export type UpdateProcessDocumentDTO = z.infer<typeof updateProcessDocumentSchema>;
export type ProcessDocumentResponseDTO = ProcessDocument;
