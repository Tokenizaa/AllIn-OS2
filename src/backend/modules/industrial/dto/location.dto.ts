import { z } from 'zod';

export const locationSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  tipo: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  descricao: z.string().optional(),
  area_m2: z.number().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createLocationSchema = z.object({
  nome: z.string().min(1),
  tipo: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  descricao: z.string().optional(),
  area_m2: z.number().optional(),
});

export const updateLocationSchema = z.object({
  nome: z.string().min(1).optional(),
  tipo: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  descricao: z.string().optional(),
  area_m2: z.number().optional(),
});

export type Location = z.infer<typeof locationSchema>;
export type CreateLocationDTO = z.infer<typeof createLocationSchema>;
export type UpdateLocationDTO = z.infer<typeof updateLocationSchema>;
export type LocationResponseDTO = Location;
