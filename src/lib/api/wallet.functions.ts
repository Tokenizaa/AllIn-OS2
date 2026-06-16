import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

// Validation schemas
const creditWalletSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'refund', 'bonus', 'manual']).optional(),
});

const debitWalletSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'withdrawal', 'manual']).optional(),
});

const freezeWalletSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
});

const unfreezeWalletSchema = z.object({
  idComprador: z.string(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
});

// Get wallet by customer
export const getWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get wallet' };
  }
};

// Ensure wallet exists
export const ensureWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    // Check if wallet exists
    const { data: existingWallet } = await supabase
      .schema('commerce')
      .from('wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (existingWallet) {
      return { success: true, data: existingWallet };
    }
    
    // Create new wallet
    const { data: newWallet, error } = await supabase
      .schema('commerce')
      .from('wallets')
      .insert({
        id_comprador: parsed.idComprador,
        balance: 0,
        available_balance: 0,
        frozen_balance: 0,
        currency: 'BRL',
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data: newWallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure wallet' };
  }
};

// Credit wallet
export const creditWallet = async (data: any) => {
  const parsed = creditWalletSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('credit_wallet', {
      p_id_comprador: parsed.idComprador,
      p_amount: parsed.amount,
      p_description: parsed.description,
      p_reference_id: parsed.referenceId,
      p_reference_type: parsed.referenceType,
    });
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to credit wallet' };
  }
};

// Debit wallet
export const debitWallet = async (data: any) => {
  const parsed = debitWalletSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('debit_wallet', {
      p_id_comprador: parsed.idComprador,
      p_amount: parsed.amount,
      p_description: parsed.description,
      p_reference_id: parsed.referenceId,
      p_reference_type: parsed.referenceType,
    });
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to debit wallet' };
  }
};

// Freeze wallet funds
export const freezeWallet = async (data: any) => {
  const parsed = freezeWalletSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('freeze_wallet_balance', {
      p_id_comprador: parsed.idComprador,
      p_amount: parsed.amount,
      p_reference_id: parsed.referenceId,
      p_reference_type: parsed.referenceType,
    });
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to freeze wallet' };
  }
};

// Unfreeze wallet funds
export const unfreezeWallet = async (data: any) => {
  const parsed = unfreezeWalletSchema.parse(data);
  try {
    const { data: wallet, error } = await supabase.rpc('unfreeze_wallet_balance', {
      p_id_comprador: parsed.idComprador,
      p_amount: parsed.amount,
      p_reference_id: parsed.referenceId,
      p_reference_type: parsed.referenceType,
    });
    
    if (error) throw error;
    return { success: true, data: wallet };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to unfreeze wallet' };
  }
};

// Get wallet transactions
export const getWalletTransactions = async (data: {
  idComprador: string;
  page?: number;
  limit?: number;
  transactionType?: 'credit' | 'debit' | 'freeze' | 'unfreeze';
}) => {
  const parsed = z.object({
    idComprador: z.string(),
    page: z.number().default(1),
    limit: z.number().default(20),
    transactionType: z.enum(['credit', 'debit', 'freeze', 'unfreeze']).optional(),
  }).parse(data);

  try {
    const from = (parsed.page - 1) * parsed.limit;
    const to = from + parsed.limit - 1;

    let query = supabase
      .schema('commerce')
      .from('wallet_transactions')
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

// Get wallet balance
export const getWalletBalance = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const { data: wallet, error } = await supabase
      .schema('commerce')
      .from('wallets')
      .select('*')
      .eq('id_comprador', parsed.idComprador)
      .single();
    
    if (error) throw error;
    if (!wallet) {
      return { success: false, error: 'Wallet not found' };
    }
    return {
      success: true,
      data: {
        balance: wallet.balance,
        availableBalance: wallet.available_balance,
        frozenBalance: wallet.frozen_balance,
        currency: wallet.currency,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get wallet balance' };
  }
};
