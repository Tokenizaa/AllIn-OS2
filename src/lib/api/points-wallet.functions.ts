import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

// Validation schemas
const earnPointsSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  sourceType: z.enum(['purchase', 'referral', 'promotion', 'manual', 'rollback']),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'customer', 'manual']).optional(),
  description: z.string().optional(),
});

const redeemPointsSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
  description: z.string().optional(),
});

const convertCurrencyToPointsSchema = z.object({
  amount: z.number().positive(),
});

const convertPointsToCurrencySchema = z.object({
  points: z.number().positive(),
});

// Get points wallet by customer
export const getPointsWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('points_wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get points wallet' };
  }
};

// Ensure points wallet exists
export const ensurePointsWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: existingWallet } = await supabase
      .schema('commerce')
      .from('points_wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (existingWallet) {
      return { success: true, data: existingWallet };
    }
    
    const { data: newWallet, error } = await supabase
      .schema('commerce')
      .from('points_wallets')
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
    return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure points wallet' };
  }
};

// Earn points
export const earnPoints = async (data: any) => {
  const parsed = earnPointsSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('earn_points', {
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
    return { success: false, error: error instanceof Error ? error.message : 'Failed to earn points' };
  }
};

// Redeem points
export const redeemPoints = async (data: any) => {
  const parsed = redeemPointsSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('redeem_points', {
      p_id_comprador: parsed.idComprador,
      p_amount: parsed.amount,
      p_reference_id: parsed.referenceId,
      p_reference_type: parsed.referenceType,
      p_description: parsed.description,
    });
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to redeem points' };
  }
};

// Get available points for payment
export const getAvailablePointsForPayment = async (data: { idComprador: string; productId?: string }) => {
  const parsed = z.object({
    idComprador: z.string(),
    productId: z.string().optional(),
  }).parse(data);

  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('points_wallets')
      .select('available_balance')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    return { success: true, data: { available_points: wallet?.available_balance || 0 } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get available points' };
  }
};

// Get points wallet transactions
export const getPointsTransactions = async (data: {
  idComprador: string;
  page?: number;
  limit?: number;
  transactionType?: 'earned' | 'redeemed';
}) => {
  const parsed = z.object({
    idComprador: z.string(),
    page: z.number().default(1),
    limit: z.number().default(20),
    transactionType: z.enum(['earned', 'redeemed']).optional(),
  }).parse(data);

  try {
    const from = (parsed.page - 1) * parsed.limit;
    const to = from + parsed.limit - 1;

    let query = supabase
      .schema('commerce')
      .from('points_transactions')
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

// Get points wallet balance
export const getPointsWalletBalance = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('points_wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    if (!wallet) {
      return { success: false, error: 'Points wallet not found' };
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
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get points balance' };
  }
};

// Convert currency to points
export const convertCurrencyToPoints = async (data: { amount: number }) => {
  const parsed = convertCurrencyToPointsSchema.parse(data);
  try {
    const { data: result, error } = await supabase.rpc('convert_currency_to_points', {
      p_amount: parsed.amount,
    });
    
    if (error) throw error;
    return { success: true, data: { points: result } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to convert currency to points' };
  }
};

// Convert points to currency
export const convertPointsToCurrency = async (data: { points: number }) => {
  const parsed = convertPointsToCurrencySchema.parse(data);
  try {
    const { data: result, error } = await supabase.rpc('convert_points_to_currency', {
      p_points: parsed.points,
    });
    
    if (error) throw error;
    return { success: true, data: { amount: result } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to convert points to currency' };
  }
};

// Expire old points (admin function)
export const expireOldPoints = async (data: { daysThreshold?: number }) => {
  const parsed = z.object({ daysThreshold: z.number().default(365) }).parse(data);
  try {
    const { data: result, error } = await supabase.rpc('expire_old_points', {
      p_days_threshold: parsed.daysThreshold,
    });
    
    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to expire old points' };
  }
};
