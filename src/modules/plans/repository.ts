import { supabase } from "@/lib/supabase/client";

export interface Plan {
  id: string;
  nome: string;
  slug?: string;
  description?: string;
  preco: number;
  ativo: boolean;
  max_geracoes: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface BonusRule {
  id: string;
  nome: string;
  tipo: "direto" | "patrocinador" | "geracao" | "lideranca";
  geracao: number | null;
  porcentagem: number;
  valor_fixo?: number;
  pontos_minimos?: number;
  volume_minimo?: number;
  diretos_minimos?: number;
  periodo_tipo?: string;
  periodo_dias?: number;
  data_inicio?: string;
  data_fim?: string;
  configuracoes: Record<string, any> | null;
  descricao?: string;
  is_active: boolean;
  plan_id: string | null;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface PlansViewModel {
  plans: Plan[];
  activeRules: BonusRule[];
}

export const PlansRepository = {
  async getPlansWithRules(): Promise<PlansViewModel> {
    const { data, error } = await supabase.rpc("rpc_plans_with_rules");

    if (error) {
      console.error("[PlansRepository] RPC error:", error);
      throw new Error(error.message || "Failed to fetch plans");
    }

    return data as PlansViewModel;
  },
};