import { supabase } from "@/lib/supabase/client";

export interface Saque {
  id: string;
  user: string;
  valor: number;
  metodo: string;
  status: string;
  risco: boolean;
  data_pedido: string;
}

export interface WithdrawalsSummary {
  total: number;
  pending: number;
  approved: number;
  anomalies: number;
}

export interface WithdrawalsViewModel {
  saques: Saque[];
  summary: WithdrawalsSummary;
}

export const WithdrawalsRepository = {
  async getDashboardData(): Promise<WithdrawalsViewModel> {
    const { data, error } = await supabase.rpc("rpc_withdrawals_dashboard");

    if (error) {
      console.error("[WithdrawalsRepository] RPC error:", error);
      throw new Error(error.message || "Failed to fetch withdrawals data");
    }

    return data as WithdrawalsViewModel;
  },
};