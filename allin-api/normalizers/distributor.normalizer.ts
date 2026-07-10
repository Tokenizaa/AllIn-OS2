/**
 * Distributor Normalizer
 * Sanitizes and validates distributor data from the API
 */

import { z } from 'zod';

const DistributorSchema = z.object({
  id: z.number(),
  codigo: z.string().min(1),
  nome: z.string().min(1).max(255),
  usuario: z.string().min(1).max(100),
  email: z.string().email(),
  telefone: z.string().optional(),
  cpf: z.string().regex(/^\d{11}$/),
  status: z.string(),
  data_ativacao: z.string().datetime().optional(),
  id_patrocinador: z.number().optional(),
  codigo_patrocinador: z.string().optional(),
  id_plano: z.number().optional(),
  nome_plano: z.string().optional(),
  nivel_qualificacao: z.string().optional(),
  data_cadastro: z.string().datetime(),
  data_atualizacao: z.string().datetime(),
});

export class DistributorNormalizer {
  static normalize(data: any): any {
    try {
      const sanitized = this.sanitize(data);
      const validated = DistributorSchema.parse(sanitized);
      return this.enrich(validated);
    } catch (error) {
      throw new Error(`Invalid distributor data: ${error.message}`);
    }
  }

  private static sanitize(data: any): any {
    return {
      id: Number(data.id),
      codigo: String(data.codigo || '').trim(),
      nome: String(data.nome || '').trim(),
      usuario: String(data.usuario || '').trim().toLowerCase(),
      email: String(data.email || '').trim().toLowerCase(),
      telefone: data.telefone ? String(data.telefone).trim() : undefined,
      cpf: String(data.cpf || '').replace(/\D/g, ''),
      status: String(data.status || '').trim(),
      data_ativacao: data.data_ativacao || null,
      id_patrocinador: data.id_patrocinador ? Number(data.id_patrocinador) : undefined,
      codigo_patrocinador: data.codigo_patrocinador ? String(data.codigo_patrocinador).trim() : undefined,
      id_plano: data.id_plano ? Number(data.id_plano) : undefined,
      nome_plano: data.nome_plano ? String(data.nome_plano).trim() : undefined,
      nivel_qualificacao: data.nivel_qualificacao ? String(data.nivel_qualificacao).trim() : undefined,
      data_cadastro: data.data_cadastro,
      data_atualizacao: data.data_atualizacao,
    };
  }

  private static enrich(data: any): any {
    // Add computed fields
    return {
      ...data,
      fullName: data.nome,
      initials: data.nome.split(' ').map(n => n[0]).join('').toUpperCase(),
      isQualified: !!data.nivel_qualificacao && data.nivel_qualificacao !== 'Não Qualificado',
    };
  }
}
