import { z } from 'zod';
import { pointsWalletService } from '../../backend/modules/payments/services/points-wallet.service';

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
    const result = await pointsWalletService.getPointsWalletByidComprador(parsed.idComprador);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get points wallet' };
  }
};

// Ensure points wallet exists
export const ensurePointsWallet = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const result = await pointsWalletService.ensurePointsWalletExists(parsed.idComprador);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure points wallet' };
  }
};

// Earn points
export const earnPoints = async (data: any) => {
  const parsed = earnPointsSchema.parse(data);
  try {
    const result = await pointsWalletService.earnPoints(
      parsed.idComprador,
      parsed.amount,
      parsed.sourceType,
      parsed.referenceId,
      parsed.referenceType,
      parsed.description as any
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to earn points' };
  }
};

// Redeem points
export const redeemPoints = async (data: any) => {
  const parsed = redeemPointsSchema.parse(data);
  try {
    const result = await pointsWalletService.redeemPoints(
      parsed.idComprador,
      parsed.amount,
      parsed.referenceId,
      parsed.referenceType,
      parsed.description
    );
    return { success: true, data: result };
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
    const result = await pointsWalletService.getAvailablePointsForPayment(
      parsed.idComprador,
      parsed.productId
    );
    return { success: true, data: result };
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
    const result = await pointsWalletService.getTransactions(
      parsed.idComprador,
      parsed.limit,
      0,
      parsed.transactionType
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get transactions' };
  }
};

// Get points wallet balance
export const getPointsWalletBalance = async (data: { idComprador: string }) => {
  const parsed = z.object({ idComprador: z.string() }).parse(data);
  try {
    const wallet = await pointsWalletService.getPointsWalletByidComprador(parsed.idComprador);
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
    const result = await pointsWalletService.convertCurrencyToPoints(parsed.amount);
    return { success: true, data: { points: result } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to convert currency to points' };
  }
};

// Convert points to currency
export const convertPointsToCurrency = async (data: { points: number }) => {
  const parsed = convertPointsToCurrencySchema.parse(data);
  try {
    const result = await pointsWalletService.convertPointsToCurrency(parsed.points);
    return { success: true, data: { amount: result } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to convert points to currency' };
  }
};

// Expire old points (admin function)
export const expireOldPoints = async (data: { daysThreshold?: number }) => {
  const parsed = z.object({ daysThreshold: z.number().default(365) }).parse(data);
  try {
    const result = await (pointsWalletService as any).expireOldPoints(parsed.daysThreshold);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to expire old points' };
  }
};
