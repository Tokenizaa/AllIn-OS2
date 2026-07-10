import { supabase } from "@/lib/supabase/client";

/**
 * PaymentService — Pagamentos de pedidos
 *
 * Sprint 6 — Domain Consolidation (PAYMENTS REDESIGN).
 *
 * FONTE DA VERDADE: `commerce.pedidos_pagamentos` (pagamentos de pedidos)
 *
 * Esta versão substitui a antiga PaymentService que consultava tabelas inexistentes
 * (`payments`, `wallets`, etc). Agora usa apenas tabelas REAIS do banco.
 *
 * Sprint 6 — Sprint 6 — Decisão arquitetural:
 *   - Removido `payment.service.ts` (re-export morto)
 *   - Removido `payment.types.ts` (type genérico Record<string, any>)
 *   - Hooks pagos devem ser migrados gradualmente para este novo service
 */

export interface PedidoPagamento {
  id: string;
  pedido_id: string;
  forma_pagamento_id: string;
  valor: number;
  status: string;
  data_pagamento: string;
  codigo_transacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface PagamentoFiltros {
  pedido_id?: string;
  forma_pagamento_id?: string;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

export const PaymentService = {
  /**
   * Busca pagamentos de pedidos com paginação e filtros.
   * FONTE: commerce.pedidos_pagamentos
   */
  async fetchPayments(options: { limit?: number; offset?: number; filtros?: PagamentoFiltros } = {}) {
    const { limit = 50, offset = 0, filtros = {} } = options;

    let query = supabase
      .schema('commerce')
      .from('pedidos_pagamentos')
      .select('*')
      .order('data_pagamento', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filtros.pedido_id) query = query.eq('pedido_id', filtros.pedido_id);
    if (filtros.forma_pagamento_id) query = query.eq('forma_pagamento_id', filtros.forma_pagamento_id);
    if (filtros.status) query = query.eq('status', filtros.status);
    if (filtros.data_inicio) query = query.gte('data_pagamento', filtros.data_inicio);
    if (filtros.data_fim) query = query.lte('data_pagamento', filtros.data_fim);

    const { data, error } = await query;
    if (error) throw new Error(error.message || "Failed to fetch payments");
    return (data || []) as PedidoPagamento[];
  },

  /**
   * Busca pagamentos recentes (últimos N).
   * Substitui `fetchRecentPayments(limit)` do legacy service.
   */
  async fetchRecentPayments(limit = 5) {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos_pagamentos')
      .select('*')
      .order('data_pagamento', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message || "Failed to fetch recent payments");
    return (data || []) as PedidoPagamento[];
  },

  /**
   * Busca pagamentos para comissão (BX).
   */
  async fetchPaymentsForCommissions(limit = 18) {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos_pagamentos')
      .select('*')
      .eq('status', 'aprovado')
      .order('data_pagamento', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message || "Failed to fetch commission payments");
    return (data || []) as PedidoPagamento[];
  },

  /**
   * Busca pagamentos de dashboard.
   */
  async fetchPaymentsForDashboard(limit = 300) {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos_pagamentos')
      .select('*')
      .order('data_pagamento', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message || "Failed to fetch dashboard payments");
    return (data || []) as PedidoPagamento[];
  },

  /**
   * Busca pagamentos para relatórios.
   */
  async fetchPaymentsForReports(limit = 500) {
    return this.fetchPayments({ limit });
  },

  /**
   * Busca pagamento por ID.
   */
  async fetchPaymentById(id: string) {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos_pagamentos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message || "Failed to fetch payment by ID");
    return data as PedidoPagamento | null;
  },

  /**
   * Busca pagamentos de um pedido específico.
   */
  async fetchPaymentsByPedido(pedidoId: string) {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos_pagamentos')
      .select('*')
      .eq('pedido_id', pedidoId)
      .order('data_pagamento', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch pedido payments");
    return (data || []) as PedidoPagamento[];
  },
};
