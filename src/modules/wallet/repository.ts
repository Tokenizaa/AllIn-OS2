import { supabase } from "@/lib/supabase/client";
import type { WalletViewModel } from "./types";

export const WalletRepository = {
  /**
   * Busca ViewModel completa da wallet via RPC única
   * Substitui múltiplas queries + transformação manual no hook
   */
  async getWalletData(customerId: string): Promise<WalletViewModel> {
    const { data, error } = await supabase.rpc("rpc_wallet_data", {
      p_customer_id: customerId,
    });

    if (error) {
      console.error("[WalletRepository] RPC error:", error);
      throw new Error(error.message || "Failed to fetch wallet data");
    }

    return data as WalletViewModel;
  },
};