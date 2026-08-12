import { supabase } from "@/lib/supabase/client";
import type { Qualificacao, QualificacaoHistorico } from "./types";

export const QualificationModule = {
  async getQualificationLevels(): Promise<Qualificacao[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("qualificacoes")
      .select("*")
      .order("pontos_minimos", { ascending: true });

    if (error) throw error;
    return (data || []) as Qualificacao[];
  },

  async getDistribuidorLevel(distribuidorId: string): Promise<string> {
    const { data: historico } = await supabase
      .schema("mlm")
      .from("qualificacoes_historico")
      .select("nivel_novo")
      .eq("distribuidor_id", distribuidorId)
      .order("data_mudanca", { ascending: false })
      .limit(1)
      .single();

    return historico?.nivel_novo || "inativo";
  },

  async recalcularQualificacao(): Promise<QualificacaoHistorico[]> {
    const levels = await this.getQualificationLevels();
    if (levels.length === 0) return [];

    const { data: saldos } = await supabase
      .schema("mlm")
      .from("pontos_saldo")
      .select("distribuidor_id, saldo_acumulado");

    if (!saldos) return [];

    const updates: QualificacaoHistorico[] = [];

    for (const saldo of saldos) {
      const currentLevel = await this.getDistribuidorLevel(saldo.distribuidor_id);
      let newLevel = "inativo";

      for (const level of levels) {
        if (saldo.saldo_acumulado >= level.pontos_minimos) {
          newLevel = level.codigo;
        }
      }

      if (newLevel !== currentLevel) {
        const { data: inserted } = await supabase
          .schema("mlm")
          .from("qualificacoes_historico")
          .insert({
            distribuidor_id: saldo.distribuidor_id,
            nivel_anterior: currentLevel,
            nivel_novo: newLevel,
            data_mudanca: new Date().toISOString(),
            pontos_acumulados: saldo.saldo_acumulado,
          })
          .select()
          .single();

        if (inserted) {
          updates.push(inserted as QualificacaoHistorico);
        }
      }
    }

    return updates;
  },

  async getHistory(distribuidorId: string): Promise<QualificacaoHistorico[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("qualificacoes_historico")
      .select("*")
      .eq("distribuidor_id", distribuidorId)
      .order("data_mudanca", { ascending: false });

    if (error) throw error;
    return (data || []) as QualificacaoHistorico[];
  },
};
