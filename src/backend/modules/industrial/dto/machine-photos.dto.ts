import { z } from 'zod';

export const machinePhotoSchema = z.object({
  id: z.string().uuid(),
  maquina_id: z.string().uuid(),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  url_foto: z.string().min(1),
  url_thumbnail: z.string().optional(),
  largura: z.number().optional(),
  altura: z.number().optional(),
  tamanho_bytes: z.bigint().optional(),
  tipo_mime: z.string().optional(),
  categoria: z.string().optional(), // geral, detalhe, manutencao, instalacao, problema
  ordem: z.number().default(0),
  data_foto: z.string().or(z.date()).optional(),
  local_foto: z.string().optional(),
  tags: z.array(z.any()).optional(),
  uploaded_by: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createMachinePhotoSchema = z.object({
  maquina_id: z.string().uuid(),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  url_foto: z.string().min(1),
  url_thumbnail: z.string().optional(),
  largura: z.number().optional(),
  altura: z.number().optional(),
  tamanho_bytes: z.bigint().optional(),
  tipo_mime: z.string().optional(),
  categoria: z.string().optional(),
  ordem: z.number().default(0),
  data_foto: z.string().or(z.date()).optional(),
  local_foto: z.string().optional(),
  tags: z.array(z.any()).optional(),
});

export const updateMachinePhotoSchema = z.object({
  maquina_id: z.string().uuid().optional(),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  url_foto: z.string().min(1).optional(),
  url_thumbnail: z.string().optional(),
  largura: z.number().optional(),
  altura: z.number().optional(),
  tamanho_bytes: z.bigint().optional(),
  tipo_mime: z.string().optional(),
  categoria: z.string().optional(),
  ordem: z.number().optional(),
  data_foto: z.string().or(z.date()).optional(),
  local_foto: z.string().optional(),
  tags: z.array(z.any()).optional(),
});

export type MachinePhoto = z.infer<typeof machinePhotoSchema>;
export type CreateMachinePhotoDTO = z.infer<typeof createMachinePhotoSchema>;
export type UpdateMachinePhotoDTO = z.infer<typeof updateMachinePhotoSchema>;
export type MachinePhotoResponseDTO = MachinePhoto;
