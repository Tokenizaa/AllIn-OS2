import { supabase } from "@/lib/supabase/client";
import type { BonusRegra } from "./types";

export const BonusModule = {
  async getBonusRules(planId?: string): Promise<BonusRegra[]> {
    let query = supabase
      .schema("mlm")
      .from("bonus_regras")
      .select("*")
      .eq("is_active", true);

    if (planId) {
      query = query.eq("plan_id", planId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as BonusRegra[];
  },

  async createBonusRule(data: {
    nome: string;
    tipo: string;
    porcentagem: number;
    geracao?: number;
    plan_id?: string;
    configuracoes?: Record<string, any>;
  }): Promise<BonusRegra> {
    const { data: rule, error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .insert({
        ...data,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return rule as BonusRegra;
  },

  async updateBonusRule(id: string, updates: Partial<BonusRegra>): Promise<BonusRegra> {
    const { data: rule, error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return rule as BonusRegra;
  },

  async deleteBonusRule(id: string): Promise<void> {
    const { error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getBonusHistory(distribuidorId: string) {
    const { data, error } = await supabase
      .schema("mlm")
      .from("bonus_historico")
      .select("*")
      .eq("distribuidor_id", distribuidorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
