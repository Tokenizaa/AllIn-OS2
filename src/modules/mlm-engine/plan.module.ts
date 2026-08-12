import { supabase } from "@/lib/supabase/client";
import type { Plan, PlanAssignment, UpgradeSuggestion } from "./types";

export const PlanModule = {
  async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("planos")
      .select("*")
      .eq("ativo", true)
      .order("preco", { ascending: true });

    if (error) throw error;
    return (data || []) as Plan[];
  },

  async getPlanById(planId: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("planos")
      .select("*")
      .eq("id", planId)
      .single();

    if (error) return null;
    return data as Plan;
  },

  async getPlanRules(planId: string) {
    const { data, error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .select("*")
      .eq("plan_id", planId)
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  },

  async activatePlan(distribuidorId: string, planoId: string): Promise<PlanAssignment> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("planos_distribuidores")
      .upsert(
        {
          distribuidor_id: distribuidorId,
          plano_id: planoId,
          data_ativacao: new Date().toISOString(),
          ativo: true,
          status: "active",
        },
        { onConflict: "distribuidor_id" }
      )
      .select()
      .single();

    if (error) throw error;
    return data as PlanAssignment;
  },

  async getPlanHistory(distribuidorId: string): Promise<PlanAssignment[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("planos_distribuidores")
      .select("*, planos(*)")
      .eq("distribuidor_id", distribuidorId)
      .order("data_ativacao", { ascending: false });

    if (error) throw error;
    return (data || []) as PlanAssignment[];
  },

  async getUpgradeSuggestions(distribuidorId: string): Promise<UpgradeSuggestion[]> {
    const plans = await this.getPlans();
    const history = await this.getPlanHistory(distribuidorId);
    const current = history[0];

    if (!current || plans.length <= 1) return [];

    const currentPlanIndex = plans.findIndex((p) => p.id === current.plano_id);
    if (currentPlanIndex < 0 || currentPlanIndex >= plans.length - 1) return [];

    const nextPlan = plans[currentPlanIndex + 1];
    return [
      {
        plano_atual: plans[currentPlanIndex].nome,
        plano_sugerido: nextPlan.nome,
        motivo: "Upgrade disponível para próximo plano",
        pontos_necessarios: 0,
      },
    ];
  },
};
