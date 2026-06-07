import { supabase } from "@/lib/supabase-client";

export const WalletService = {
  async fetchWalletByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("customer_id", customerId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchWalletTransactionsByWalletId(walletId: string) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchPointsWalletByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("points_wallets")
      .select("*")
      .eq("customer_id", customerId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createWallet(customerId: string) {
    const { data, error } = await supabase
      .from("wallets")
      .insert({
        customer_id: customerId,
        balance: 0,
        available_balance: 0,
        frozen_balance: 0,
        currency: "BRL",
        status: "active"
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createPointsWallet(customerId: string) {
    const { data, error } = await supabase
      .from("points_wallets")
      .insert({
        customer_id: customerId,
        balance: 0,
        available_balance: 0,
        frozen_balance: 0,
        total_earned: 0,
        total_redeemed: 0,
        currency: "PTS",
        status: "active"
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createWalletTransaction(
    walletId: string,
    transaction_type: string,
    amount: number,
    balance_before: number,
    balance_after: number,
    description: string
  ) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: walletId,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        description,
        reference_type: "adjustment",
        reference_id: "manual-" + Date.now().toString().slice(-6),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateWalletBalance(walletId: string, balance: number) {
    const { data, error } = await supabase
      .from("wallets")
      .update({
        balance,
        available_balance: balance,
        updated_at: new Date().toISOString()
      })
      .eq("id", walletId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async fetchWithdrawals(userId?: string) {
    let query = supabase
      .from("withdrawals")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async fetchRecentWithdrawals(limit = 5) {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchWorkspaceSettings() {
    const { data, error } = await supabase
      .from("workspace_settings")
      .select("balance_available, balance_blocked, balance_pending, total_year, total_month")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async approveWithdrawals(withdrawalIds: string[]) {
    const { data, error } = await supabase
      .from("withdrawals")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .in("id", withdrawalIds)
      .select();
    if (error) throw error;
    return data || [];
  },

  async rejectWithdrawals(withdrawalIds: string[]) {
    const { data, error } = await supabase
      .from("withdrawals")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .in("id", withdrawalIds)
      .select();
    if (error) throw error;
    return data || [];
  },
};
