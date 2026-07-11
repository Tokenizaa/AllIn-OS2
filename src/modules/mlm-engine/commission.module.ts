import { supabase } from "@/lib/supabase/client";
import type { Commission, CommissionBreakdown, BonusRegra } from "./types";
import { z } from "zod";
import { normalizePlanName, getRuleByType, fetchBonusRulesForPlan, resolvePlanConfig } from "@/lib/plan-utils";

export const CommissionModule = {
  async processOrder(pedidoId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.rpc("processar_pedido_mlm" as any, { pedido_id: pedidoId } as any);
      if (error) throw error;
      return { success: true, message: "Pedido processado via trigger SQL." };
    } catch (err: any) {
      return { success: false, message: err.message || "Erro ao processar pedido." };
    }
  },

  async calculateCommission(distribuidorId: string, valor: number): Promise<CommissionBreakdown> {
    const { data: activePlan } = await supabase
      .schema("mlm")
      .from("planos_distribuidores")
      .select("*, planos(*)")
      .eq("distribuidor_id", distribuidorId)
      .eq("status", "active")
      .limit(1)
      .single();

    if (!activePlan?.planos) {
      return { direct: 0, sponsor: 0, generations: [], leadership: 0, total: 0 };
    }

    const planName = normalizePlanName(activePlan.planos.nome || "");
    if (!planName) {
      return { direct: 0, sponsor: 0, generations: [], leadership: 0, total: 0 };
    }

    const rules = await fetchBonusRulesForPlan(planName);
    const directRule = getRuleByType(rules, "direto");
    const sponsorRule = getRuleByType(rules, "patrocinador");

    const direct = valor * ((directRule?.porcentagem || 0) / 100);
    const sponsor = valor * ((sponsorRule?.porcentagem || 0) / 100);

    const generations: CommissionBreakdown["generations"] = [];
    for (let g = 1; g <= (activePlan.planos.max_geracoes || 3); g++) {
      const genRule = getRuleByType(rules, "geracao", g);
      if (genRule) {
        generations.push({
          generation: g,
          percentage: genRule.porcentagem,
          amount: valor * (genRule.porcentagem / 100),
        });
      }
    }

    let leadership = 0;
    if (planName === "excelencia") {
      const leaderRule = getRuleByType(rules, "lideranca");
      if (leaderRule) {
        leadership = valor * (leaderRule.porcentagem / 100);
      }
    }

    return {
      direct,
      sponsor,
      generations,
      leadership,
      total: direct + sponsor + generations.reduce((s, g) => s + g.amount, 0) + leadership,
    };
  },

  async getPendingCommissions(): Promise<Commission[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("comissoes")
      .select("*")
      .eq("status", "pendente")
      .order("data_calculo", { ascending: false });

    if (error) throw error;
    return (data || []) as Commission[];
  },

  async getCommissionsByDistribuidor(distribuidorId: string): Promise<Commission[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("comissoes")
      .select("*")
      .eq("distribuidor_id", distribuidorId)
      .order("data_calculo", { ascending: false });

    if (error) throw error;
    return (data || []) as Commission[];
  },

  async getCommissionTotal(distribuidorId: string, periodo?: string): Promise<number> {
    let query = supabase
      .schema("mlm")
      .from("comissoes")
      .select("valor_comissao")
      .eq("distribuidor_id", distribuidorId)
      .eq("status", "pago");

    if (periodo) {
      query = query.gte("data_pagamento", `${periodo}-01-01`).lte("data_pagamento", `${periodo}-12-31`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).reduce((sum, c) => sum + Number(c.valor_comissao || 0), 0);
  },

  async fetchAllCommissions(limit = 100): Promise<Commission[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("comissoes")
      .select("*")
      .order("data_calculo", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Commission[];
  },

  async runCycle(): Promise<{ message: string }> {
    const { data, error } = await supabase.rpc("processar_ciclo_comissoes" as any);
    if (error) throw new Error(error.message || "Failed to run commission cycle");
    return { message: data?.message || "Ciclo processado com sucesso" };
  },

  async simulateCommission(data: { seller_id: string; order_amount: number }) {
    const parsed = z.object({
      seller_id: z.string().uuid(),
      order_amount: z.number().min(0),
    }).parse(data);

    const { planName, rules } = await resolvePlanConfig(parsed.seller_id);
    if (!planName || rules.length === 0) return { error: "Seller has no active plan", simulation: null };

    const directRule = getRuleByType(rules, "direto");
    const direct_commission = parsed.order_amount * ((directRule?.porcentagem || 0) / 100);

    const generations = (rules as BonusRegra[])
      .filter((r) => r.tipo === "geracao" && r.geracao !== null)
      .sort((a, b) => (a.geracao || 0) - (b.geracao || 0))
      .map((r) => ({
        generation: r.geracao || 0,
        percentage: r.porcentagem,
        amount: parsed.order_amount * (r.porcentagem / 100),
      }));

    const liderancaRule = getRuleByType(rules, "lideranca");
    const extraDirects = liderancaRule
      ? [{
          minDirects: Number(liderancaRule.configuracoes?.min_diretos || 0),
          percentage: liderancaRule.porcentagem,
          amount: parsed.order_amount * (liderancaRule.porcentagem / 100),
        }]
      : [];

    const direct_bonuses = extraDirects.map((bonus) => ({
      required_directs: bonus.minDirects,
      actual_directs: bonus.minDirects,
      percentage: bonus.percentage,
      amount: bonus.amount,
    }));

    return {
      simulation: {
        plan: {
          name: planName,
          slug: planName,
          price: 0,
        },
        order_amount: parsed.order_amount,
        direct_commission,
        mlm_commissions: generations,
        direct_bonuses,
        total_commission:
          direct_commission +
          generations.reduce((sum, item) => sum + item.amount, 0) +
          extraDirects.reduce((sum, item) => sum + item.amount, 0),
        breakdown: {
          direct: direct_commission,
          mlm: generations.reduce((sum, item) => sum + item.amount, 0),
          direct_bonus: extraDirects.reduce((sum, item) => sum + item.amount, 0),
        },
      },
    };
  },
};