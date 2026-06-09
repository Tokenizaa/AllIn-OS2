import { z } from 'zod';
import { bonusWalletService } from '../../backend/modules/payments/services/bonus-wallet.service';

// Validation schemas
const earnBonusSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  sourceType: z.enum(['purchase', 'referral', 'promotion', 'manual', 'rollback']),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'customer', 'manual']).optional(),
  description: z.string().optional(),
});

const useBonusSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
  description: z.string().optional(),
});

// Get bonus wallet by customer
export const getBonusWallet = async (data: { customerId: string }) => {
  const parsed = z.object({ customerId: z.string().uuid() }).parse(data);
  try {
    const result = await bonusWalletService.getBonusWalletByCustomerId(parsed.customerId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get bonus wallet' };
  }
};

// Ensure bonus wallet exists
export const ensureBonusWallet = async (data: { customerId: string }) => {
  const parsed = z.object({ customerId: z.string().uuid() }).parse(data);
  try {
    const result = await (bonusWalletService as any).ensureBonusWallet(parsed.customerId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure bonus wallet' };
  }
};

// Earn bonus
export const earnBonus = async (data: any) => {
  const parsed = earnBonusSchema.parse(data);
  try {
    const result = await (bonusWalletService as any).earnBonus(
      parsed.customerId,
      parsed.amount,
      parsed.sourceType,
      parsed.referenceId,
      parsed.referenceType,
      parsed.description as any
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to earn bonus' };
  }
};

// Use bonus
export const useBonus = async (data: any) => {
  const parsed = useBonusSchema.parse(data);
  try {
    const result = await bonusWalletService.useBonus(
      parsed.customerId,
      parsed.amount,
      parsed.referenceId,
      parsed.referenceType,
      parsed.description
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to use bonus' };
  }
};

// Get available bonus for payment
export const getAvailableBonusForPayment = async (data: { customerId: string; productId?: string }) => {
  const parsed = z.object({
    customerId: z.string().uuid(),
    productId: z.string().optional(),
  }).parse(data);

  try {
    const result = await bonusWalletService.getAvailableBonusForPayment(
      parsed.customerId,
      parsed.productId
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get available bonus' };
  }
};

// Get bonus wallet transactions
export const getBonusTransactions = async (data: {
  customerId: string;
  page?: number;
  limit?: number;
  transactionType?: 'earned' | 'used';
}) => {
  const parsed = z.object({
    customerId: z.string().uuid(),
    page: z.number().default(1),
    limit: z.number().default(20),
    transactionType: z.enum(['earned', 'used']).optional(),
  }).parse(data);

  try {
    const result = await (bonusWalletService as any).getTransactions(
      parsed.customerId,
      parsed.page,
      parsed.limit,
      parsed.transactionType
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get transactions' };
  }
};

// Get bonus wallet balance
export const getBonusWalletBalance = async (data: { customerId: string }) => {
  const parsed = z.object({ customerId: z.string().uuid() }).parse(data);
  try {
    const wallet = await bonusWalletService.getBonusWalletByCustomerId(parsed.customerId);
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
    const result = await (bonusWalletService as any).expireOldBonuses(parsed.daysThreshold);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to expire old bonuses' };
  }
};
