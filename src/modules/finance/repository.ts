import { supabase } from "@/lib/supabase/client";

export interface WalletStats {
  balance_available: number;
  balance_blocked: number;
  balance_pending: number;
  total_year: number;
  total_month: number;
}

export interface WithdrawalRow {
  id: string;
  description: string | null;
  type: string | null;
  amount: number | null;
  created_at: string | null;
}

export interface OfficeFinanceViewModel {
  wallet: WalletStats;
  withdrawals: WithdrawalRow[];
}

export const OfficeFinanceRepository = {
  async getDashboardData(userId: string): Promise<OfficeFinanceViewModel> {
    const { data, error } = await supabase.rpc("rpc_office_finance", {
      p_user_id: userId,
    });

    if (error) {
      console.error("[OfficeFinanceRepository] RPC error:", error);
      throw new Error(error.message || "Failed to fetch finance data");
    }

    return data as OfficeFinanceViewModel;
  },
};