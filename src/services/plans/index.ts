import { z } from "zod";
import { supabase } from "@/lib/supabase/client";

export const PlanService = {
  async fetchActivePlans() {
    const { data, error } = await supabase.schema("mlm").from("planos").select("*");
    if (error) throw new Error(error.message || "Failed to fetch active plans");
    return data || [];
  },

  async getAllPlans() {
    const { data, error } = await supabase.schema("mlm").from("planos").select("*");
    if (error) throw new Error(error.message || "Failed to fetch plans");
    return data || [];
  },

  async getPlanBonuses(data: { planId: string }) {
    const parsed = z.object({ planId: z.string() }).parse(data);
    const { data: bonuses, error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .select("*")
      .eq("plan_id", parsed.planId);
    if (error) throw new Error(error.message || "Failed to fetch plan bonuses");
    return bonuses;
  },

  async createPlan(data: {
    nome: string;
    slug: string;
    description?: string;
    preco: number;
    ativo?: boolean;
    max_geracoes?: number;
    metadata?: any;
  }) {
    const parsed = z.object({
      nome: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      preco: z.number().min(0),
      ativo: z.boolean().default(true),
      max_geracoes: z.number().min(1).default(3),
      metadata: z.record(z.any()).optional(),
    }).parse(data);

    const { data: plan, error } = await supabase
      .schema("mlm")
      .from("planos")
      .insert({
        ...parsed,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to create plan");
    return plan;
  },

  async updatePlan(data: {
    id: string;
    nome?: string;
    description?: string;
    preco?: number;
    ativo?: boolean;
    max_geracoes?: number;
    metadata?: any;
  }) {
    const parsed = z.object({
      id: z.string().uuid(),
      nome: z.string().min(1).optional(),
      description: z.string().optional(),
      preco: z.number().min(0).optional(),
      ativo: z.boolean().optional(),
      max_geracoes: z.number().min(1).optional(),
      metadata: z.record(z.any()).optional(),
    }).parse(data);

    const { id, ...updateData } = parsed;
    const { data: plan, error } = await supabase
      .schema("mlm")
      .from("planos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to update plan");
    return plan;
  },

  async createBonusRule(data: {
    nome: string;
    tipo: string;
    porcentagem: number;
    geracao?: number;
    plan_id?: string;
    configuracoes?: Record<string, any>;
  }) {
    const parsed = z.object({
      nome: z.string().min(1),
      tipo: z.string().min(1),
      porcentagem: z.number().min(0).max(100),
      geracao: z.number().min(0).optional(),
      plan_id: z.string().uuid().optional(),
      configuracoes: z.record(z.any()).optional(),
    }).parse(data);

    const { data: bonus, error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .insert({
        ...parsed,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to create bonus rule");
    return bonus;
  },

  async deleteBonusRule(data: { id: string }) {
    const parsed = z.object({ id: z.string().uuid() }).parse(data);
    const { error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .delete()
      .eq("id", parsed.id);
    if (error) throw new Error(error.message || "Failed to delete bonus rule");
    return { success: true };
  },

  async activatePlan(data: {
    distribuidor_id: string;
    plano_id: string;
  }) {
    const parsed = z.object({
      distribuidor_id: z.string().uuid(),
      plano_id: z.string().uuid(),
    }).parse(data);

    const { data: planAssignment, error } = await supabase
      .schema("mlm")
      .from("planos_distribuidores")
      .upsert({
        distribuidor_id: parsed.distribuidor_id,
        plano_id: parsed.plano_id,
        data_ativacao: new Date().toISOString(),
        ativo: true,
        status: "active",
      }, { onConflict: "distribuidor_id" })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to activate plan");
    return planAssignment;
  },

  async deactivatePlan(data: { distribuidor_id: string }) {
    const parsed = z.object({ distribuidor_id: z.string().uuid() }).parse(data);
    const { error } = await supabase
      .schema("mlm")
      .from("planos_distribuidores")
      .update({ status: "inactive", ativo: false })
      .eq("distribuidor_id", parsed.distribuidor_id);
    if (error) throw new Error(error.message || "Failed to deactivate plan");
    return { success: true };
  },

  async getPlanHistory(data: { distribuidorId: string }) {
    const parsed = z.object({ distribuidorId: z.string().uuid() }).parse(data);
    const { data: plans, error } = await supabase
      .schema("mlm")
      .from("planos_distribuidores")
      .select("*, planos(*)")
      .eq("distribuidor_id", parsed.distribuidorId);
    if (error) throw new Error(error.message || "Failed to fetch plan history");
    return plans;
  },

  async getPlanAnalytics() {
    const { data: plans, error } = await supabase
      .schema("mlm")
      .from("planos")
      .select("*");
    if (error) throw new Error(error.message || "Failed to fetch plan analytics");
    return plans;
  },

  async getBonusDistribution() {
    const { data: bonuses, error } = await supabase
      .schema("mlm")
      .from("bonus_regras")
      .select("*");
    if (error) throw new Error(error.message || "Failed to fetch bonus distribution");
    return bonuses;
  },

  async getPlanStats() {
    const { data, error } = await supabase.schema("mlm").from("planos").select("*");
    if (error) throw new Error(error.message || "Failed to fetch plan stats");
    return { total: (data || []).length, plans: data || [] };
  },
};
