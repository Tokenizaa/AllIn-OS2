import { supabase } from "@/lib/supabase/client";
import type { CommissionsViewModel } from "./types";

export const CommissionsRepository = {
  async getDashboardData(limit = 100): Promise<CommissionsViewModel> {
    const { data, error } = await supabase.rpc("rpc_commissions_dashboard", {
      p_limit: limit,
    });

    if (error) {
      console.error("[CommissionsRepository] RPC error:", error);
      throw new Error(error.message || "Failed to fetch commissions data");
    }

    return data as CommissionsViewModel;
  },
};
