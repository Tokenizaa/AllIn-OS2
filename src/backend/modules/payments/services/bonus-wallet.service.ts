import { logger } from '../../../shared/observability/logger.service';
import { supabase } from '../../../shared/infrastructure/supabase/client';
import { eventEmitter } from '../../../shared/events/event-emitter';
import { EventType } from '../../../shared/events/event.types';

export interface BonusWallet {
  id: string;
  id_comprador: string;
  balance: number;
  available_balance: number;
  frozen_balance: number;
  total_earned: number;
  total_used: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BonusTransaction {
  id: string;
  bonus_wallet_id: string;
  transaction_type: 'earned' | 'used' | 'expired' | 'forfeited' | 'transferred';
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

export class BonusWalletService {
  private static instance: BonusWalletService;

  private constructor() {}

  static getInstance(): BonusWalletService {
    if (!BonusWalletService.instance) {
      BonusWalletService.instance = new BonusWalletService();
    }
    return BonusWalletService.instance;
  }

  async getBonusWalletByidComprador(idComprador: string): Promise<BonusWallet | null> {
    try {
      const { data, error } = await supabase
        .from('bonus_wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .single();

      if (error) {
        logger.error('Failed to get bonus wallet', 'bonus-wallet-service', { error, idComprador });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error getting bonus wallet', 'bonus-wallet-service', { error, idComprador });
      return null;
    }
  }

  async createBonusWallet(idComprador: string): Promise<BonusWallet> {
    logger.info('Creating bonus wallet', 'bonus-wallet-service', { idComprador });

    try {
      const { data, error } = await supabase
        .from('bonus_wallets')
        .insert({
          id_comprador: idComprador,
          balance: 0,
          available_balance: 0,
          frozen_balance: 0,
          total_earned: 0,
          total_used: 0,
          currency: 'BRL',
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create bonus wallet', 'bonus-wallet-service', { error, idComprador });
        throw error;
      }

      logger.info('Bonus wallet created successfully', 'bonus-wallet-service', { walletId: data.id, idComprador });
      return data;
    } catch (error) {
      logger.error('Error creating bonus wallet', 'bonus-wallet-service', { error, idComprador });
      throw error;
    }
  }

  async ensureBonusWalletExists(idComprador: string): Promise<BonusWallet> {
    let wallet = await this.getBonusWalletByidComprador(idComprador);
    if (!wallet) {
      wallet = await this.createBonusWallet(idComprador);
    }
    return wallet;
  }

  async earnBonus(
    idComprador: string,
    amount: number,
    sourceType: string,
    sourceId?: string,
    description?: string,
    expiresAt?: Date,
    metadata?: Record<string, any>
  ): Promise<BonusTransaction> {
    logger.info('Earning bonus', 'bonus-wallet-service', { idComprador, amount, sourceType });

    try {
      const wallet = await this.ensureBonusWalletExists(idComprador);

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore + amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('bonus_wallets')
        .update({
          balance: wallet.balance + amount,
          available_balance: balanceAfter,
          total_earned: wallet.total_earned + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to update bonus wallet', 'bonus-wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('bonus_transactions')
        .insert({
          bonus_wallet_id: wallet.id,
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
        logger.error('Failed to create bonus transaction', 'bonus-wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Bonus earned successfully', 'bonus-wallet-service', { walletId: wallet.id, amount, transactionId: transaction.id });

      // Emit bonus earned event
      eventEmitter.emit({
        type: EventType.BONUS_EARNED,
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
      logger.error('Error earning bonus', 'bonus-wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async useBonus(
    idComprador: string,
    amount: number,
    referenceId?: string,
    referenceType?: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<BonusTransaction> {
    logger.info('Using bonus', 'bonus-wallet-service', { idComprador, amount });

    try {
      const wallet = await this.ensureBonusWalletExists(idComprador);

      if (wallet.available_balance < amount) {
        throw new Error('Insufficient bonus balance');
      }

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore - amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('bonus_wallets')
        .update({
          balance: wallet.balance - amount,
          available_balance: balanceAfter,
          total_used: wallet.total_used + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to update bonus wallet', 'bonus-wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('bonus_transactions')
        .insert({
          bonus_wallet_id: wallet.id,
          transaction_type: 'used',
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
        logger.error('Failed to create bonus transaction', 'bonus-wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Bonus used successfully', 'bonus-wallet-service', { walletId: wallet.id, amount, transactionId: transaction.id });

      // Emit bonus used event
      eventEmitter.emit({
        type: EventType.BONUS_USED,
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
      logger.error('Error using bonus', 'bonus-wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async getAvailableBonusForPayment(idComprador: string, productId?: string): Promise<{ available: number; maxUsagePercentage: number }> {
    try {
      const wallet = await this.getBonusWalletByidComprador(idComprador);
      if (!wallet) {
        return { available: 0, maxUsagePercentage: 50 };
      }

      // Get global bonus usage rule
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

      return { available, maxUsagePercentage };
    } catch (error) {
      logger.error('Error getting available bonus', 'bonus-wallet-service', { error, idComprador });
      return { available: 0, maxUsagePercentage: 50 };
    }
  }

  async getBonusTransactions(
    idComprador: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<BonusTransaction[]> {
    try {
      const wallet = await this.getBonusWalletByidComprador(idComprador);
      if (!wallet) {
        return [];
      }

      const { data, error } = await supabase
        .from('bonus_transactions')
        .select('*')
        .eq('bonus_wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Failed to get bonus transactions', 'bonus-wallet-service', { error, idComprador });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting bonus transactions', 'bonus-wallet-service', { error, idComprador });
      return [];
    }
  }

  async expireOldBonuses(): Promise<void> {
    logger.info('Expiring old bonuses', 'bonus-wallet-service');

    try {
      const now = new Date().toISOString();

      // Get expired bonus transactions
      const { data: expiredTransactions, error } = await supabase
        .from('bonus_transactions')
        .select('*')
        .eq('transaction_type', 'earned')
        .lt('expires_at', now)
        .is('expires_at', null);

      if (error) {
        logger.error('Failed to get expired bonuses', 'bonus-wallet-service', { error });
        return;
      }

      for (const transaction of expiredTransactions || []) {
        const wallet = await this.getBonusWalletByidComprador(transaction.bonus_wallet_id);
        if (!wallet) continue;

        const balanceBefore = wallet.available_balance;
        const amountToExpire = Math.min(transaction.amount, wallet.available_balance);
        const balanceAfter = balanceBefore - amountToExpire;

        // Update wallet
        await supabase
          .from('bonus_wallets')
          .update({
            balance: wallet.balance - amountToExpire,
            available_balance: balanceAfter,
            updated_at: new Date().toISOString(),
          })
          .eq('id', wallet.id);

        // Create expired transaction
        await supabase
          .from('bonus_transactions')
          .insert({
            bonus_wallet_id: wallet.id,
            transaction_type: 'expired',
            amount: amountToExpire,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: 'Bonus expired',
            reference_id: transaction.id,
            reference_type: 'bonus_transaction',
          });

        logger.info('Bonus expired', 'bonus-wallet-service', { walletId: wallet.id, amount: amountToExpire });
      }
    } catch (error) {
      logger.error('Error expiring old bonuses', 'bonus-wallet-service', { error });
    }
  }
}

export const bonusWalletService = BonusWalletService.getInstance();
