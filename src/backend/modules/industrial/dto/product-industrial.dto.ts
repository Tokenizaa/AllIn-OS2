import { z } from 'zod';

export const productIndustrialSchema = z.object({
  id: z.string().uuid(),
  modelo: z.string().min(1),
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),
  linha: z.string().optional(),
  colecao: z.string().optional(),
  largura_cm: z.number().optional(),
  comprimento_cm: z.number().optional(),
  altura_cm: z.number().optional(),
  densidade_kg_m3: z.number().optional(),
  composicao: z.string().optional(),
  tipo_espuma: z.string().optional(),
  numero_camadas: z.number().optional(),
  firmeza: z.string().optional(),
  garantia_meses: z.number().optional(),
  peso_kg: z.number().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
  observacoes_tecnicas: z.string().optional(),
  normas_tecnicas: z.string().optional(),
  certificacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createProductIndustrialSchema = z.object({
  modelo: z.string().min(1),
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),
  linha: z.string().optional(),
  colecao: z.string().optional(),
  largura_cm: z.number().optional(),
  comprimento_cm: z.number().optional(),
  altura_cm: z.number().optional(),
  densidade_kg_m3: z.number().optional(),
  composicao: z.string().optional(),
  tipo_espuma: z.string().optional(),
  numero_camadas: z.number().optional(),
  firmeza: z.string().optional(),
  garantia_meses: z.number().optional(),
  peso_kg: z.number().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
  observacoes_tecnicas: z.string().optional(),
  normas_tecnicas: z.string().optional(),
  certificacoes: z.string().optional(),
});

export const updateProductIndustrialSchema = z.object({
  modelo: z.string().min(1).optional(),
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),
  linha: z.string().optional(),
  colecao: z.string().optional(),
  largura_cm: z.number().optional(),
  comprimento_cm: z.number().optional(),
  altura_cm: z.number().optional(),
  densidade_kg_m3: z.number().optional(),
  composicao: z.string().optional(),
  tipo_espuma: z.string().optional(),
  numero_camadas: z.number().optional(),
  firmeza: z.string().optional(),
  garantia_meses: z.number().optional(),
  peso_kg: z.number().optional(),
  especificacoes: z.any().optional(),
  observacoes: z.string().optional(),
  observacoes_tecnicas: z.string().optional(),
  normas_tecnicas: z.string().optional(),
  certificacoes: z.string().optional(),
});

export type ProductIndustrial = z.infer<typeof productIndustrialSchema>;
export type CreateProductIndustrialDTO = z.infer<typeof createProductIndustrialSchema>;
export type UpdateProductIndustrialDTO = z.infer<typeof updateProductIndustrialSchema>;
export type ProductIndustrialResponseDTO = ProductIndustrial;
