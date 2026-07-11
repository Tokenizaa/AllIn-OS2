import { supabase } from "@/lib/supabase/client";
import type { BonusRegra } from "@/modules/mlm-engine/types";

export function normalizePlanName(raw: string): string | null {
  const normalized = raw.toLowerCase().trim();
  if (normalized.includes("afili")) return "afiliado";
  if (normalized.includes("avan")) return "avanco";
  if (normalized.includes("excel")) return "excelencia";
  return null;
}

export function getRuleByType(rules: BonusRegra[], tipo: string, geracao?: number): BonusRegra | undefined {
  return rules.find((r) => r.tipo === tipo && (geracao === undefined || r.geracao === geracao));
}

export async function fetchBonusRulesForPlan(planoNome: string): Promise<BonusRegra[]> {
  const { data, error } = await supabase
    .schema("mlm")
    .from("bonus_regras")
    .select("*")
    .eq("is_active", true)
    .eq("configuracoes->>plano", planoNome.toLowerCase().trim());

  if (error) throw error;
  return (data || []) as BonusRegra[];
}

export async function resolvePlanConfig(distribuidorId: string) {
  const { data: activePlan } = await supabase
    .schema("mlm")
    .from("planos_distribuidores")
    .select("*, planos(*)")
    .eq("distribuidor_id", distribuidorId)
    .eq("status", "active")
    .limit(1)
    .single();

  if (!activePlan?.planos) return { planName: null, rules: [] };

  const planName = normalizePlanName(activePlan.planos.nome || "");
  if (!planName) return { planName, rules: [] };

  const rules = await fetchBonusRulesForPlan(planName);
  return { planName, rules };
}