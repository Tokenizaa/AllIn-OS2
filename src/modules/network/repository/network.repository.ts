import { supabase } from "@/lib/supabase/client";
import type { NetworkNode } from "@/modules/mlm-engine";

export const NetworkRepository = {
  /**
   * Busca ViewModel da rede linear via RPC única
   * Substitui NetworkService + CustomerService + OrderService
   */
  async getNetworkTree(distribuidorId: string, maxLevels = 3): Promise<NetworkNode[]> {
    const { data, error } = await supabase.rpc("rpc_network_tree", {
      p_distribuidor_id: distribuidorId,
      p_max_levels: maxLevels,
    });

    if (error) {
      console.error("[NetworkRepository] RPC error:", error);
      throw new Error(error.message || "Failed to fetch network data");
    }

    return (data || []) as NetworkNode[];
  },
};