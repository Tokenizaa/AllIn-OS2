import { supabase } from "@/lib/supabase/client";
import type { DashboardViewModel } from "../types";

export const DashboardRepository = {
  /**
   * Busca ViewModel completa do dashboard via RPC única
   * Substitui 5 queries paralelas + transformação manual no frontend
   */
  async getDashboardData(distribuidorId: string): Promise<DashboardViewModel> {
    const { data, error } = await supabase.rpc("rpc_dashboard", {
      p_distribuidor_id: distribuidorId,
    });

    if (error) {
      console.error("[DashboardRepository] RPC error:", error);
      throw new Error(error.message || "Failed to fetch dashboard data");
    }

    // RPC já retorna ViewModel tipada - apenas validar estrutura
    return data as DashboardViewModel;
  },
};