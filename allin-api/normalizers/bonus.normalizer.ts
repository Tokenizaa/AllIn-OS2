/**
 * Bonus Normalizer
 * Sanitizes and validates bonus data from the API
 */

import { z } from 'zod';

const BonusSchema = z.object({
  id: z.number(),
  distribuidor_id: z.number(),
  distribuidor_codigo: z.string(),
  distribuidor_nome: z.string(),
  tipo: z.string(),
  valor: z.number(),
  status: z.string(),
  periodo: z.string(),
  descricao: z.string(),
  pedido_id: z.number().optional(),
  data_cadastro: z.string().datetime(),
  data_pagamento: z.string().datetime().optional(),
});

export class BonusNormalizer {
  static normalize(data: any): any {
    try {
      const sanitized = this.sanitize(data);
      const validated = BonusSchema.parse(sanitized);
      return this.enrich(validated);
    } catch (error) {
      throw new Error(`Invalid bonus data: ${error.message}`);
    }
  }

  private static sanitize(data: any): any {
    return {
      id: Number(data.id),
      distribuidor_id: Number(data.distribuidor_id),
      distribuidor_codigo: String(data.distribuidor_codigo || '').trim(),
      distribuidor_nome: String(data.distribuidor_nome || '').trim(),
      tipo: String(data.tipo || '').trim(),
      valor: Number(data.valor || 0),
      status: String(data.status || '').trim(),
      periodo: String(data.periodo || '').trim(),
      descricao: String(data.descricao || '').trim(),
      pedido_id: data.pedido_id ? Number(data.pedido_id) : undefined,
      data_cadastro: data.data_cadastro,
      data_pagamento: data.data_pagamento || null,
    };
  }

  private static enrich(data: any): any {
    // Add computed fields
    const isPaid = data.status === 'Pago' || !!data.data_pagamento;
    const isPending = data.status === 'Pendente';
    const isCancelled = data.status === 'Cancelado';
    const daysSinceCreated = this.calculateDaysSince(data.data_cadastro);
    const daysUntilPaid = data.data_pagamento 
      ? this.calculateDaysBetween(data.data_cadastro, data.data_pagamento)
      : null;

    return {
      ...data,
      isPaid,
      isPending,
      isCancelled,
      daysSinceCreated,
      daysUntilPaid,
      absoluteValue: Math.abs(data.valor),
    };
  }

  private static calculateDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private static calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
