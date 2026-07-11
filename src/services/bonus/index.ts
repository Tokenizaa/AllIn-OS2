import { supabase } from "@/lib/supabase/client";
import type { BonusRegra } from "@/modules/mlm-engine";

/**
 * BonusService — Bônus MLM
 *
 * Sprint 6 — Domain Consolidation (PAYMENTS REDESIGN).
 *
 * FONTE DA VERDADE:
 *   - `mlm.bonus_historico` — bônus calculados/gerados/aprovados
 *   - `mlm.bonus_regras` — regras de cálculo de bônus
 */

export type BonusStatus = 'calculado' | 'aprovado' | 'pago' | 'cancelado' | 'pendente';

export interface BonusHistorico {
  id: string;
  bonus_regra_id?: string;
  pedido_id?: string;
  distribuidor_id?: string;
  tipo: string;
  geracao?: number;
  valor_base: number;
  porcentagem_aplicada?: number;
  valor_calculado: number;
  periodo_inicio: string;
  periodo_fim: string;
  status?: BonusStatus;
  data_calculo?: string;
  data_aprovacao?: string;
  data_pagamento?: string;
  referencia_id?: string;
  referencia_tipo?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const BonusService = {
  // ============================================================
  // BÔNUS HISTÓRICO
  // ============================================================

  /**
   * Lista histórico de bônus.
   */
  async fetchBonusHistory(options: { distribuidor_id?: string; status?: BonusStatus; limit?: number } = {}) {
    const { distribuidor_id, status, limit = 100 } = options;

    let query = supabase
      .schema('mlm')
      .from('bonus_historico')
      .select('*')
      .order('data_calculo', { ascending: false })
      .limit(limit);

    if (distribuidor_id) query = query.eq('distribuidor_id', distribuidor_id);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw new Error(error.message || "Failed to fetch bonus history");
    return (data || []) as BonusHistorico[];
  },

  /**
   * Busca bônus de um distribuidor específico.
   */
  async fetchBonusByDistribuidor(distribuidorId: string) {
    return this.fetchBonusHistory({ distribuidor_id: distribuidorId });
  },

  /**
   * Busca bônus pendentes.
   */
  async fetchPendingBonus() {
    return this.fetchBonusHistory({ status: 'pendente' });
  },

  /**
   * Busca bônus aprovados.
   */
  async fetchApprovedBonus() {
    return this.fetchBonusHistory({ status: 'aprovado' });
  },

  /**
   * Busca bônus pagos.
   */
  async fetchPaidBonus() {
    return this.fetchBonusHistory({ status: 'pago' });
  },

  /**
   * Soma de bônus por distribuidor.
   */
  async getBonusTotalByDistribuidor(distribuidorId: string) {
    const data = await this.fetchBonusByDistribuidor(distribuidorId);
    return data.reduce((sum, b) => sum + Number(b.valor_calculado || 0), 0);
  },

  // ============================================================
  // BÔNUS REGRAS (canonical type from @/modules/mlm-engine)
  // ============================================================

  /**
   * Lista regras de bônus ativas.
   */
  async fetchActiveRules(): Promise<BonusRegra[]> {
    const { data, error } = await supabase
      .schema('mlm')
      .from('bonus_regras')
      .select('*')
      .eq('is_active', true)
      .order('porcentagem', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch active bonus rules");
    return (data || []) as BonusRegra[];
  },

  /**
   * Busca regra por ID.
   */
  async fetchRuleById(id: string): Promise<BonusRegra | null> {
    const { data, error } = await supabase
      .schema('mlm')
      .from('bonus_regras')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message || "Failed to fetch bonus rule");
    return data as BonusRegra | null;
  },

  /**
   * Lista todas as regras (incluindo inativas).
   */
  async fetchAllRules(): Promise<BonusRegra[]> {
    const { data, error } = await supabase
      .schema('mlm')
      .from('bonus_regras')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch all bonus rules");
    return (data || []) as BonusRegra[];
  },
};
