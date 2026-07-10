import { supabase } from "@/lib/supabase/client";

/**
 * WithdrawalService — Solicitações de Saque
 *
 * Sprint 6 — Domain Consolidation (PAYMENTS REDESIGN).
 *
 * FONTE DA VERDADE:
 *   - `finance.solicitacoes_saque` — saques de distribuidores
 *   - `finance.solicitacoes_saque_cd` — saques de centros de distribuição
 *
 * Esta versão substitui WalletService.fetchWithdrawals que chamava métodos inexistentes.
 */

export type WithdrawalStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'processado' | 'cancelado' | 'revertido';

export interface SolicitacaoSaque {
  id: string;
  distribuidor_id?: string;
  auth_user_id?: string;
  distribuidor_nome?: string;
  distribuidor_usuario?: string;
  valor_solicitado: number;
  total_taxas?: number;
  valor_a_depositar: number;
  status_id: number;
  status_descricao?: WithdrawalStatus | string;
  data_pedido: string;
  data_apuracao?: string;
  banco?: string;
  tipo_conta?: string;
  agencia?: string;
  numero?: string;
  nome_titular?: string;
  documento_titular?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const WithdrawalService = {
  /**
   * Lista todas as solicitações de saque de distribuidores.
   */
  async fetchWithdrawals(options: { status?: WithdrawalStatus; limit?: number } = {}) {
    const { status, limit = 100 } = options;

    let query = supabase
      .schema('finance')
      .from('solicitacoes_saque')
      .select('*')
      .is('deleted_at', null)
      .order('data_pedido', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status_descricao', status);

    const { data, error } = await query;
    if (error) throw new Error(error.message || "Failed to fetch withdrawals");
    return (data || []) as SolicitacaoSaque[];
  },

  /**
   * Busca saques recentes (últimos N).
   * Substitui o método inexistente `WalletService.fetchRecentWithdrawals`.
   */
  async fetchRecentWithdrawals(limit = 5) {
    return this.fetchWithdrawals({ limit });
  },

  /**
   * Busca saques pendentes (não aprovados ainda).
   */
  async fetchPendingWithdrawals() {
    return this.fetchWithdrawals({ status: 'pendente' });
  },

  /**
   * Busca saques aprovados.
   */
  async fetchApprovedWithdrawals() {
    return this.fetchWithdrawals({ status: 'aprovado' });
  },

  /**
   * Busca saques de um distribuidor específico.
   */
  async fetchWithdrawalsByDistribuidor(distribuidorId: string) {
    const { data, error } = await supabase
      .schema('finance')
      .from('solicitacoes_saque')
      .select('*')
      .eq('distribuidor_id', distribuidorId)
      .is('deleted_at', null)
      .order('data_pedido', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch distributor withdrawals");
    return (data || []) as SolicitacaoSaque[];
  },

  /**
   * Soma dos saques por status (totals para dashboard).
   */
  async getWithdrawalsSummary() {
    const { data, error } = await supabase
      .schema('finance')
      .from('solicitacoes_saque')
      .select('status_descricao, valor_solicitado')
      .is('deleted_at', null);
    if (error) throw new Error(error.message || "Failed to fetch withdrawals summary");
    return data || [];
  },

  // ============================================================
  // Solicitações de Saque de Centro de Distribuição (CD)
  // ============================================================

  /**
   * Lista saques de centros de distribuição.
   */
  async fetchCdWithdrawals(options: { limit?: number } = {}) {
    const { limit = 100 } = options;
    const { data, error } = await supabase
      .schema('finance')
      .from('solicitacoes_saque_cd')
      .select('*')
      .order('data_pedido', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message || "Failed to fetch CD withdrawals");
    return data || [];
  },
};
