import { supabase } from "@/lib/supabase/client";

/**
 * PointsService — Pontos de Fidelidade
 *
 * Sprint 6 — Domain Consolidation (PAYMENTS REDESIGN).
 *
 * FONTE DA VERDADE:
 *   - `mlm.pontos_saldo` — saldo de pontos (1 linha por distribuidor)
 *   - `mlm.pontos_transacoes` — histórico de transações
 *
 * Substitui WalletService que consultava `points_wallets` (tabela inexistente).
 */

export interface PontosSaldo {
  id: string;
  distribuidor_id?: string;
  saldo_atual: number;
  saldo_disponivel: number;
  saldo_bloqueado: number;
  saldo_acumulado: number;
  saldo_utilizado: number;
  pontos_mes_atual: number;
  pontos_mes_anterior: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export type PontosTipo = 'ganho' | 'uso' | 'bonus' | 'estorno' | 'vencimento' | 'transferencia';

export interface PontosTransacao {
  id: string;
  distribuidor_id?: string;
  pedido_id?: string;
  tipo: PontosTipo;
  origem?: string;
  quantidade: number;
  saldo_antes: number;
  saldo_depois: number;
  data_validade_inicio?: string;
  data_validade_fim?: string;
  referencia_id?: string;
  referencia_tipo?: string;
  descricao?: string;
  metadata?: any;
  created_at: string;
}

export const PointsService = {
  // ============================================================
  // SALDO DE PONTOS
  // ============================================================

  /**
   * Busca saldo de pontos de um distribuidor.
   */
  async fetchPointsByDistribuidor(distribuidorId: string) {
    const { data, error } = await supabase
      .schema('mlm')
      .from('pontos_saldo')
      .select('*')
      .eq('distribuidor_id', distribuidorId)
      .maybeSingle();
    if (error) throw new Error(error.message || "Failed to fetch points saldo");
    return data as PontosSaldo | null;
  },

  /**
   * Lista todos os saldos (admin/dashboard).
   */
  async fetchAllSaldos(options: { limit?: number } = {}) {
    const { limit = 500 } = options;
    const { data, error } = await supabase
      .schema('mlm')
      .from('pontos_saldo')
      .select('*')
      .order('saldo_atual', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message || "Failed to fetch points saldos");
    return (data || []) as PontosSaldo[];
  },

  // ============================================================
  // TRANSAÇÕES DE PONTOS
  // ============================================================

  /**
   * Histórico de transações de um distribuidor.
   */
  async fetchTransactionsByDistribuidor(distribuidorId: string, options: { limit?: number; tipo?: PontosTipo } = {}) {
    const { limit = 100, tipo } = options;

    let query = supabase
      .schema('mlm')
      .from('pontos_transacoes')
      .select('*')
      .eq('distribuidor_id', distribuidorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (tipo) query = query.eq('tipo', tipo);

    const { data, error } = await query;
    if (error) throw new Error(error.message || "Failed to fetch points transactions");
    return (data || []) as PontosTransacao[];
  },

  /**
   * Lista transações de pontos (todas, sem filtro).
   */
  async fetchAllTransactions(options: { limit?: number; tipo?: PontosTipo } = {}) {
    const { limit = 500, tipo } = options;

    let query = supabase
      .schema('mlm')
      .from('pontos_transacoes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (tipo) query = query.eq('tipo', tipo);

    const { data, error } = await query;
    if (error) throw new Error(error.message || "Failed to fetch all points transactions");
    return (data || []) as PontosTransacao[];
  },

  /**
   * Total ganho/perdido por distribuidor em um período.
   */
  async getPointsSummary(distribuidorId: string) {
    const transacoes = await this.fetchTransactionsByDistribuidor(distribuidorId, { limit: 1000 });
    const summary = {
      total_ganho: 0,
      total_uso: 0,
      total_bonus: 0,
      total_estorno: 0,
    };
    transacoes.forEach((t) => {
      if (t.tipo === 'ganho') summary.total_ganho += t.quantidade;
      else if (t.tipo === 'uso') summary.total_uso += t.quantidade;
      else if (t.tipo === 'bonus') summary.total_bonus += t.quantidade;
      else if (t.tipo === 'estorno') summary.total_estorno += t.quantidade;
    });
    return summary;
  },
};
