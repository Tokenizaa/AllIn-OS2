/**
 * Order Normalizer
 * Sanitizes and validates order data from the API
 */

import { z } from 'zod';

const OrderSchema = z.object({
  id: z.number(),
  numero_pedido: z.string().min(1),
  distribuidor_id: z.number(),
  distribuidor_codigo: z.string(),
  distribuidor_nome: z.string(),
  valor_total: z.number().min(0),
  status: z.string(),
  forma_pagamento: z.string(),
  status_pagamento: z.string(),
  data_pedido: z.string().datetime(),
  data_pagamento: z.string().datetime().optional(),
  data_envio: z.string().datetime().optional(),
  data_entrega: z.string().datetime().optional(),
  data_cadastro: z.string().datetime(),
  data_atualizacao: z.string().datetime(),
});

export class OrderNormalizer {
  static normalize(data: any): any {
    try {
      const sanitized = this.sanitize(data);
      const validated = OrderSchema.parse(sanitized);
      return this.enrich(validated);
    } catch (error) {
      throw new Error(`Invalid order data: ${error.message}`);
    }
  }

  private static sanitize(data: any): any {
    return {
      id: Number(data.id),
      numero_pedido: String(data.numero_pedido || '').trim(),
      distribuidor_id: Number(data.distribuidor_id),
      distribuidor_codigo: String(data.distribuidor_codigo || '').trim(),
      distribuidor_nome: String(data.distribuidor_nome || '').trim(),
      valor_total: Number(data.valor_total || 0),
      status: String(data.status || '').trim(),
      forma_pagamento: String(data.forma_pagamento || '').trim(),
      status_pagamento: String(data.status_pagamento || '').trim(),
      data_pedido: data.data_pedido,
      data_pagamento: data.data_pagamento || null,
      data_envio: data.data_envio || null,
      data_entrega: data.data_entrega || null,
      data_cadastro: data.data_cadastro,
      data_atualizacao: data.data_atualizacao,
    };
  }

  private static enrich(data: any): any {
    // Add computed fields
    const isPaid = data.status === 'Pago' || data.status_pagamento === 'Pago';
    const isShipped = data.status === 'Enviado' || !!data.data_envio;
    const isDelivered = data.status === 'Entregue' || !!data.data_entrega;

    return {
      ...data,
      isPaid,
      isShipped,
      isDelivered,
      daysSinceOrder: this.calculateDaysSince(data.data_pedido),
    };
  }

  private static calculateDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
