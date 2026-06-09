import { logger } from '../../../shared/observability/logger.service';
import { supabase } from '../../../shared/infrastructure/supabase/client';
import { eventEmitter } from '../../../shared/events/event-emitter';
import { EventType } from '../../../shared/events/event-types';

export interface PointsWallet {
  id: string;
  id_comprador: string;
  balance: number;
  available_balance: number;
  frozen_balance: number;
  total_earned: number;
  total_redeemed: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  points_wallet_id: string;
  transaction_type: 'earned' | 'redeemed' | 'expired' | 'forfeited' | 'transferred';
  amount: number;
  balance_before: number;
  balance_after: number;
  source_type?: string;
  source_id?: string;
  reference_id?: string;
  reference_type?: string;
  description?: string;
  expires_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export class PointsWalletService {
  private static instance: PointsWalletService;

  private constructor() {}

  static getInstance(): PointsWalletService {
    if (!PointsWalletService.instance) {
      PointsWalletService.instance = new PointsWalletService();
    }
    return PointsWalletService.instance;
  }

  async getPointsWalletByidComprador(idComprador: string): Promise<PointsWallet | null> {
    try {
      const { data, error } = await supabase
        .from('points_wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .single();

      if (error) {
        logger.error('Failed to get points wallet', 'points-wallet-service', { error, idComprador });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error getting points wallet', 'points-wallet-service', { error, idComprador });
      return null;
    }
  }

  async createPointsWallet(idComprador: string): Promise<PointsWallet> {
    logger.info('Creating points wallet', 'points-wallet-service', { idComprador });

    try {
      const { data, error } = await supabase
        .from('points_wallets')
        .insert({
          id_comprador: idComprador,
          balance: 0,
          available_balance: 0,
          frozen_balance: 0,
          total_earned: 0,
          total_redeemed: 0,
          currency: 'PTS',
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create points wallet', 'points-wallet-service', { error, idComprador });
        throw error;
      }

      logger.info('Points wallet created successfully', 'points-wallet-service', { walletId: data.id, idComprador });
      return data;
    } catch (error) {
      logger.error('Error creating points wallet', 'points-wallet-service', { error, idComprador });
      throw error;
    }
  }

  async ensurePointsWalletExists(idComprador: string): Promise<PointsWallet> {
    let wallet = await this.getPointsWalletByidComprador(idComprador);
    if (!wallet) {
      wallet = await this.createPointsWallet(idComprador);
    }
    return wallet;
  }

  async earnPoints(
    idComprador: string,
    amount: number,
    sourceType: string,
    sourceId?: string,
    description?: string,
    expiresAt?: Date,
    metadata?: Record<string, any>
  ): Promise<PointsTransaction> {
    logger.info('Earning points', 'points-wallet-service', { idComprador, amount, sourceType });

    try {
      const wallet = await this.ensurePointsWalletExists(idComprador);

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore + amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('points_wallets')
        .update({
          balance: wallet.balance + amount,
          available_balance: balanceAfter,
          total_earned: wallet.total_earned + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to update points wallet', 'points-wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          points_wallet_id: wallet.id,
          transaction_type: 'earned',
          amount: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          source_type: sourceType,
          source_id: sourceId,
          description: description,
          expires_at: expiresAt ? expiresAt.toISOString() : undefined,
          metadata: metadata,
        })
        .select()
        .single();

      if (transactionError) {
        logger.error('Failed to create points transaction', 'points-wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Points earned successfully', 'points-wallet-service', { walletId: wallet.id, amount, transactionId: transaction.id });

      // Emit points earned event
      eventEmitter.emit({
        type: EventType.POINTS_EARNED,
        timestamp: new Date().toISOString(),
        data: {
          walletId: wallet.id,
          idComprador,
          amount,
          sourceType,
          transactionId: transaction.id,
        },
      });

      return transaction;
    } catch (error) {
      logger.error('Error earning points', 'points-wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async redeemPoints(
    idComprador: string,
    amount: number,
    referenceId?: string,
    referenceType?: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<PointsTransaction> {
    logger.info('Redeeming points', 'points-wallet-service', { idComprador, amount });

    try {
      const wallet = await this.ensurePointsWalletExists(idComprador);

      if (wallet.available_balance < amount) {
        throw new Error('Insufficient points balance');
      }

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore - amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('points_wallets')
        .update({
          balance: wallet.balance - amount,
          available_balance: balanceAfter,
          total_redeemed: wallet.total_redeemed + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to update points wallet', 'points-wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          points_wallet_id: wallet.id,
          transaction_type: 'redeemed',
          amount: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          reference_id: referenceId,
          reference_type: referenceType,
          description: description,
          metadata: metadata,
        })
        .select()
        .single();

      if (transactionError) {
        logger.error('Failed to create points transaction', 'points-wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Points redeemed successfully', 'points-wallet-service', { walletId: wallet.id, amount, transactionId: transaction.id });

      // Emit points redeemed event
      eventEmitter.emit({
        type: EventType.POINTS_REDEEMED,
        timestamp: new Date().toISOString(),
        data: {
          walletId: wallet.id,
          idComprador,
          amount,
          referenceId,
          transactionId: transaction.id,
        },
      });

      return transaction;
    } catch (error) {
      logger.error('Error redeeming points', 'points-wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async convertPointsToCurrency(points: number, conversionRate: number = 0.01): Promise<number> {
    return points * conversionRate;
  }

  async convertCurrencyToPoints(currency: number, conversionRate: number = 0.01): Promise<number> {
    return currency / conversionRate;
  }

  async getAvailablePointsForPayment(idComprador: string, productId?: string): Promise<{ available: number; maxUsagePercentage: number; currencyValue: number }> {
    try {
      const wallet = await this.getPointsWalletByidComprador(idComprador);
      if (!wallet) {
        return { available: 0, maxUsagePercentage: 50, currencyValue: 0 };
      }

      // Get global points usage rule
      const { data: globalRule } = await supabase
        .from('bonus_usage_rules')
        .select('*')
        .eq('scope', 'global')
        .eq('is_active', true)
        .single();

      let maxUsagePercentage = globalRule?.max_usage_percentage || 50;

      // Check product-specific rule if productId provided
      if (productId) {
        const { data: productRule } = await supabase
          .from('bonus_usage_rules')
          .select('*')
          .eq('scope', 'product')
          .eq('scope_id', productId)
          .eq('is_active', true)
          .single();

        if (productRule) {
          maxUsagePercentage = productRule.max_usage_percentage;
        }
      }

      const available = (wallet.available_balance * maxUsagePercentage) / 100;
      const currencyValue = await this.convertPointsToCurrency(available);

      return { available, maxUsagePercentage, currencyValue };
    } catch (error) {
      logger.error('Error getting available points', 'points-wallet-service', { error, idComprador });
      return { available: 0, maxUsagePercentage: 50, currencyValue: 0 };
    }
  }

  async getPointsTransactions(
    idComprador: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PointsTransaction[]> {
    try {
      const wallet = await this.getPointsWalletByidComprador(idComprador);
      if (!wallet) {
        return [];
      }

      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('points_wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Failed to get points transactions', 'points-wallet-service', { error, idComprador });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting points transactions', 'points-wallet-service', { error, idComprador });
      return [];
    }
  }

  async expireOldPoints(): Promise<void> {
    logger.info('Expiring old points', 'points-wallet-service');

    try {
      const now = new Date().toISOString();

      // Get expired points transactions
      const { data: expiredTransactions, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('transaction_type', 'earned')
        .lt('expires_at', now)
        .is('expires_at', null);

      if (error) {
        logger.error('Failed to get expired points', 'points-wallet-service', { error });
        return;
      }

      for (const transaction of expiredTransactions || []) {
        const wallet = await this.getPointsWalletByidComprador(transaction.points_wallet_id);
        if (!wallet) continue;

        const balanceBefore = wallet.available_balance;
        const amountToExpire = Math.min(transaction.amount, wallet.available_balance);
        const balanceAfter = balanceBefore - amountToExpire;

        // Update wallet
        await supabase
          .from('points_wallets')
          .update({
            balance: wallet.balance - amountToExpire,
            available_balance: balanceAfter,
            updated_at: new Date().toISOString(),
          })
          .eq('id', wallet.id);

        // Create expired transaction
        await supabase
          .from('points_transactions')
          .insert({
            points_wallet_id: wallet.id,
            transaction_type: 'expired',
            amount: amountToExpire,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: 'Points expired',
            reference_id: transaction.id,
            reference_type: 'points_transaction',
          });

        logger.info('Points expired', 'points-wallet-service', { walletId: wallet.id, amount: amountToExpire });
      }
    } catch (error) {
      logger.error('Error expiring old points', 'points-wallet-service', { error });
    }
  }
}

export const pointsWalletService = PointsWalletService.getInstance();
