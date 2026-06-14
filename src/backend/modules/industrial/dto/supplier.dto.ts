import { z } from 'zod';

export const supplierSchema = z.object({
  id: z.string().uuid(),
  razao_social: z.string().min(1),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().optional(),
  contato_nome: z.string().optional(),
  contato_email: z.string().email().optional(),
  contato_telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  status: z.string().default('active'),
  condicoes_pagamento: z.string().optional(),
  prazo_entrega_padrao: z.number().optional(),
  observacoes: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createSupplierSchema = z.object({
  razao_social: z.string().min(1),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().optional(),
  contato_nome: z.string().optional(),
  contato_email: z.string().email().optional(),
  contato_telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  status: z.string().default('active'),
  condicoes_pagamento: z.string().optional(),
  prazo_entrega_padrao: z.number().optional(),
  observacoes: z.string().optional(),
});

export const updateSupplierSchema = z.object({
  razao_social: z.string().min(1).optional(),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().optional(),
  contato_nome: z.string().optional(),
  contato_email: z.string().email().optional(),
  contato_telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  status: z.string().optional(),
  condicoes_pagamento: z.string().optional(),
  prazo_entrega_padrao: z.number().optional(),
  observacoes: z.string().optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;
export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierDTO = z.infer<typeof updateSupplierSchema>;
export type SupplierResponseDTO = Supplier;
