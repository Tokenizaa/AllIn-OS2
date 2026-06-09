import { z } from 'zod';
import { walletService } from '../../backend/modules/payments/services/wallet.service';

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
    const result = await walletService.getWalletByidComprador(parsed.idComprador);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get wallet' };
  }
};

// Ensure wallet exists
export const ensureWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const result = await walletService.ensureWalletExists(parsed.idComprador);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure wallet' };
  }
};

// Credit wallet
export const creditWallet = async (data: any) => {
  const parsed = creditWalletSchema.parse(data);
  try {
    const result = await walletService.creditWallet(
      parsed.idComprador,
      parsed.amount,
      parsed.description,
      parsed.referenceId,
      parsed.referenceType
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to credit wallet' };
  }
};

// Debit wallet
export const debitWallet = async (data: any) => {
  const parsed = debitWalletSchema.parse(data);
  try {
    const result = await walletService.debitWallet(
      parsed.idComprador,
      parsed.amount,
      parsed.description,
      parsed.referenceId,
      parsed.referenceType
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to debit wallet' };
  }
};

// Freeze wallet funds
export const freezeWallet = async (data: any) => {
  const parsed = freezeWalletSchema.parse(data);
  try {
    const result = await walletService.freezeBalance(
      parsed.idComprador,
      parsed.amount,
      parsed.referenceId,
      parsed.referenceType
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to freeze wallet' };
  }
};

// Unfreeze wallet funds
export const unfreezeWallet = async (data: any) => {
  const parsed = unfreezeWalletSchema.parse(data);
  try {
    const result = await walletService.unfreezeBalance(
      parsed.idComprador,
      parsed.amount,
      parsed.referenceId,
      parsed.referenceType
    );
    return { success: true, data: result };
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
    const result = await walletService.getTransactions(
      parsed.idComprador,
      parsed.limit,
      0
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get transactions' };
  }
};

// Get wallet balance
export const getWalletBalance = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const wallet = await walletService.getWalletByidComprador(parsed.idComprador);
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
