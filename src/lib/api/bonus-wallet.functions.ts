import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

// Validation schemas
const earnBonusSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  sourceType: z.enum(['purchase', 'referral', 'promotion', 'manual', 'rollback']),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'customer', 'manual']).optional(),
  description: z.string().optional(),
});

const useBonusSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
  description: z.string().optional(),
});

// Get bonus wallet by customer
export const getBonusWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('bonus_wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get bonus wallet' };
  }
};

// Ensure bonus wallet exists
export const ensureBonusWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: existingWallet } = await supabase
      .schema('commerce')
      .from('bonus_wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (existingWallet) {
      return { success: true, data: existingWallet };
    }
    
    const { data: newWallet, error } = await supabase
      .schema('commerce')
      .from('bonus_wallets')
      .insert({
        id_comprador: parsed.idComprador,
        balance: 0,
        available_balance: 0,
        currency: 'BRL',
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data: newWallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure bonus wallet' };
  }
};

// Earn bonus
export const earnBonus = async (data: any) => {
  const parsed = earnBonusSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('earn_bonus', {
      p_id_comprador: parsed.idComprador,
      p_amount: parsed.amount,
      p_source_type: parsed.sourceType,
      p_reference_id: parsed.referenceId,
      p_reference_type: parsed.referenceType,
      p_description: parsed.description,
    });
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to earn bonus' };
  }
};

// Use bonus
export const useBonus = async (data: any) => {
  const parsed = useBonusSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('use_bonus', {
      p_id_comprador: parsed.idComprador,
      p_amount: parsed.amount,
      p_reference_id: parsed.referenceId,
      p_reference_type: parsed.referenceType,
      p_description: parsed.description,
    });
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to use bonus' };
  }
};

// Get available bonus for payment
export const getAvailableBonusForPayment = async (data: { idComprador: string; productId?: string }) => {
  const parsed = z.object({
    idComprador: z.string(),
    productId: z.string().optional(),
  }).parse(data);

  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('bonus_wallets')
      .select('available_balance')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    return { success: true, data: { available_bonus: wallet?.available_balance || 0 } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get available bonus' };
  }
};

// Get bonus wallet transactions
export const getBonusTransactions = async (data: {
  idComprador: string;
  page?: number;
  limit?: number;
  transactionType?: 'earned' | 'used';
}) => {
  const parsed = z.object({
    idComprador: z.string(),
    page: z.number().default(1),
    limit: z.number().default(20),
  }).parse(data);

  try {
    const from = (parsed.page - 1) * parsed.limit;
    const to = from + parsed.limit - 1;

    let query = supabase
      .schema('commerce')
      .from('bonus_transactions')
      .select('*')
      .eq('id_comprador', parsed.idComprador);
    
    if (parsed.transactionType) {
      query = query.eq('transaction_type', parsed.transactionType);
    }
    
    const { data: transactions, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return { success: true, data: transactions || [] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get transactions' };
  }
};

// Get bonus wallet balance
export const getBonusWalletBalance = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('bonus_wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    if (!wallet) {
      return { success: false, error: 'Bonus wallet not found' };
    }
    return {
      success: true,
      data: {
        balance: wallet.balance,
        availableBalance: wallet.available_balance,
        currency: wallet.currency,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get bonus balance' };
  }
};

// Expire old bonuses (admin function)
export const expireOldBonuses = async (data: { daysThreshold?: number }) => {
  const parsed = z.object({ daysThreshold: z.number().default(90) }).parse(data);
  try {
    const { data: result, error } = await supabase.rpc('expire_old_bonuses', {
      p_days_threshold: parsed.daysThreshold,
    });
    
    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to expire old bonuses' };
  }
};
