import { supabase } from "@/lib/supabase/client";

export const WalletService = {
  async fetchWalletByidComprador(idComprador: string) {
    try {
      const { data, error } = await supabase
        .schema('finance')
        .from('wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .single();
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async getWalletBalance(data: { customerId: string }) {
    try {
      const { data: wallet, error } = await supabase
        .schema('finance')
        .from('wallets')
        .select('balance, available_balance, frozen_balance, currency')
        .eq('id_comprador', data.customerId)
        .single();
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: wallet };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async getWalletTransactions(data: { customerId: string; limit?: number; transactionType?: string }) {
    try {
      let query = supabase
        .schema('finance')
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', data.customerId)
        .order('created_at', { ascending: false });
      if (data.limit) query = query.limit(data.limit);
      if (data.transactionType) query = query.eq('transaction_type', data.transactionType);
      const { data: transactions, error } = await query;
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: transactions || [] };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async fetchWalletTransactionsByWalletId(walletId: string) {
    try {
      const { data, error } = await supabase
        .schema('finance')
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false });
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: data || [] };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async creditWallet(data: { customerId: string; amount: number; description: string; referenceType?: string }) {
    try {
      const walletRes = await this.ensureWallet({ customerId: data.customerId });
      if (!walletRes.success) return walletRes;
      const wallet = walletRes.data;
      const { data: updated, error } = await supabase
        .schema('finance')
        .from('wallets')
        .update({ balance: wallet.balance + data.amount })
        .eq('id', wallet.id)
        .select()
        .single();
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: updated };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async debitWallet(data: { customerId: string; amount: number; description: string; referenceType?: string }) {
    try {
      const walletRes = await this.ensureWallet({ customerId: data.customerId });
      if (!walletRes.success) return walletRes;
      const wallet = walletRes.data;
      const { data: updated, error } = await supabase
        .schema('finance')
        .from('wallets')
        .update({ balance: wallet.balance - data.amount })
        .eq('id', wallet.id)
        .select()
        .single();
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: updated };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async ensureWallet(data: { customerId: string }) {
    try {
      const { data: existing, error: findError } = await supabase
        .schema('finance')
        .from('wallets')
        .select('*')
        .eq('id_comprador', data.customerId)
        .maybeSingle();
      if (findError) return { success: false, data: null, error: findError.message };
      if (existing) return { success: true, data: existing };
      const { data: created, error: createError } = await supabase
        .schema('finance')
        .from('wallets')
        .insert({ id_comprador: data.customerId, balance: 0, available_balance: 0, frozen_balance: 0, currency: 'BRL' })
        .select()
        .single();
      if (createError) return { success: false, data: null, error: createError.message };
      return { success: true, data: created };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async createWallet(idComprador: string) {
    try {
      const { data: existing, error: findError } = await supabase
        .schema('finance')
        .from('wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .maybeSingle();
      if (findError) return { success: false, data: null, error: findError.message };
      if (existing) return { success: true, data: existing };
      const { data, error: createError } = await supabase
        .schema('finance')
        .from('wallets')
        .insert({ id_comprador: idComprador, balance: 0, available_balance: 0, frozen_balance: 0, currency: 'BRL' })
        .select()
        .single();
      if (createError) return { success: false, data: null, error: createError.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async fetchPointsWalletByidComprador(idComprador: string) {
    try {
      const { data, error } = await supabase
        .from('points_wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .single();
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async getPointsWalletBalance(data: { customerId: string }) {
    try {
      const { data: wallet, error } = await supabase
        .from('points_wallets')
        .select('balance, available_balance, frozen_balance')
        .eq('id_comprador', data.customerId)
        .single();
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: wallet };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async getPointsTransactions(data: { customerId: string; limit?: number }) {
    try {
      let query = supabase
        .from('points_transactions')
        .select('*')
        .eq('id_comprador', data.customerId)
        .order('created_at', { ascending: false });
      if (data.limit) query = query.limit(data.limit);
      const { data: transactions, error } = await query;
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: transactions || [] };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async ensurePointsWallet(data: { customerId: string }) {
    try {
      const { data: existing, error: findError } = await supabase
        .from('points_wallets')
        .select('*')
        .eq('id_comprador', data.customerId)
        .maybeSingle();
      if (findError) return { success: false, data: null, error: findError.message };
      if (existing) return { success: true, data: existing };
      const { data: created, error: createError } = await supabase
        .from('points_wallets')
        .insert({ id_comprador: data.customerId, balance: 0, available_balance: 0, frozen_balance: 0 })
        .select()
        .single();
      if (createError) return { success: false, data: null, error: createError.message };
      return { success: true, data: created };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async createPointsWallet(idComprador: string) {
    try {
      const { data: existing, error: findError } = await supabase
        .from('points_wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .maybeSingle();
      if (findError) return { success: false, data: null, error: findError.message };
      if (existing) return { success: true, data: existing };
      const { data, error: createError } = await supabase
        .from('points_wallets')
        .insert({ id_comprador: idComprador, balance: 0, available_balance: 0, frozen_balance: 0 })
        .select()
        .single();
      if (createError) return { success: false, data: null, error: createError.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async getBonusWalletBalance(data: { customerId: string }) {
    try {
      const { data: wallet, error } = await supabase
        .from('bonus_wallets')
        .select('balance, available_balance, frozen_balance')
        .eq('id_comprador', data.customerId)
        .single();
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: wallet };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async getBonusTransactions(data: { customerId: string; limit?: number }) {
    try {
      let query = supabase
        .from('bonus_transactions')
        .select('*')
        .eq('id_comprador', data.customerId)
        .order('created_at', { ascending: false });
      if (data.limit) query = query.limit(data.limit);
      const { data: transactions, error } = await query;
      if (error) return { success: false, data: null, error: error.message };
      return { success: true, data: transactions || [] };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async ensureBonusWallet(data: { customerId: string }) {
    try {
      const { data: existing, error: findError } = await supabase
        .from('bonus_wallets')
        .select('*')
        .eq('id_comprador', data.customerId)
        .maybeSingle();
      if (findError) return { success: false, data: null, error: findError.message };
      if (existing) return { success: true, data: existing };
      const { data: created, error: createError } = await supabase
        .from('bonus_wallets')
        .insert({ id_comprador: data.customerId, balance: 0, available_balance: 0, frozen_balance: 0 })
        .select()
        .single();
      if (createError) return { success: false, data: null, error: createError.message };
      return { success: true, data: created };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async createBonusWallet(idComprador: string) {
    try {
      const { data: existing, error: findError } = await supabase
        .from('bonus_wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .maybeSingle();
      if (findError) return { success: false, data: null, error: findError.message };
      if (existing) return { success: true, data: existing };
      const { data, error: createError } = await supabase
        .from('bonus_wallets')
        .insert({ id_comprador: idComprador, balance: 0, available_balance: 0, frozen_balance: 0 })
        .select()
        .single();
      if (createError) return { success: false, data: null, error: createError.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null, error: err.message };
    }
  },

  async fetchWithdrawals(data?: any): Promise<{success: boolean, data: any[], error?: string}> {
    try {
      const { data: withdrawals, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return { success: false, data: [], error: error.message };
      return { success: true, data: withdrawals || [] };
    } catch (err: any) {
      return { success: false, data: [], error: err.message };
    }
  },
};
