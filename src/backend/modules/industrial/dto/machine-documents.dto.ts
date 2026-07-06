import { z } from 'zod';

export const machineDocumentSchema = z.object({
  id: z.string().uuid(),
  maquina_id: z.string().uuid(),
  tipo: z.string(), // manual, certificado, esquema, desenho, procedimento
  titulo: z.string().min(1),
  descricao: z.string().optional(),
  nome_arquivo: z.string().optional(),
  url_arquivo: z.string().optional(),
  tamanho_bytes: z.bigint().optional(),
  tipo_mime: z.string().optional(),
  versao: z.string().optional(),
  data_documento: z.string().or(z.date()).optional(),
  categoria: z.string().optional(), // tecnico, seguranca, operacional, qualidade
  confidencialidade: z.string().default('interno'), // publico, interno, confidencial
  idioma: z.string().default('pt-BR'),
  tags: z.array(z.any()).optional(),
  uploaded_by: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createMachineDocumentSchema = z.object({
  maquina_id: z.string().uuid(),
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

export const updateMachineDocumentSchema = z.object({
  maquina_id: z.string().uuid().optional(),
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

export type MachineDocument = z.infer<typeof machineDocumentSchema>;
export type CreateMachineDocumentDTO = z.infer<typeof createMachineDocumentSchema>;
export type UpdateMachineDocumentDTO = z.infer<typeof updateMachineDocumentSchema>;
export type MachineDocumentResponseDTO = MachineDocument;
