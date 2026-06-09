import { logger } from '../../../shared/observability/logger.service';
import { supabase } from '../../../shared/infrastructure/supabase/client';
import { eventEmitter } from '../../../shared/events/event-emitter';
import { EventType } from '../../../shared/events/event.types';

export interface Wallet {
  id: string;
  id_comprador: string;
  balance: number;
  available_balance: number;
  frozen_balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: 'credit' | 'debit' | 'freeze' | 'unfreeze' | 'withdrawal' | 'deposit';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_id?: string;
  reference_type?: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export class WalletService {
  private static instance: WalletService;

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async getWalletByidComprador(idComprador: string): Promise<Wallet | null> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('id_comprador', idComprador)
        .single();

      if (error) {
        logger.error('Failed to get wallet', 'wallet-service', { error, idComprador });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error getting wallet', 'wallet-service', { error, idComprador });
      return null;
    }
  }

  async createWallet(idComprador: string): Promise<Wallet> {
    logger.info('Creating wallet', 'wallet-service', { idComprador });

    try {
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          id_comprador: idComprador,
          balance: 0,
          available_balance: 0,
          frozen_balance: 0,
          currency: 'BRL',
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create wallet', 'wallet-service', { error, idComprador });
        throw error;
      }

      logger.info('Wallet created successfully', 'wallet-service', { walletId: data.id, idComprador });
      return data;
    } catch (error) {
      logger.error('Error creating wallet', 'wallet-service', { error, idComprador });
      throw error;
    }
  }

  async ensureWalletExists(idComprador: string): Promise<Wallet> {
    let wallet = await this.getWalletByidComprador(idComprador);
    if (!wallet) {
      wallet = await this.createWallet(idComprador);
    }
    return wallet;
  }

  async creditWallet(
    idComprador: string,
    amount: number,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: Record<string, any>
  ): Promise<WalletTransaction> {
    logger.info('Crediting wallet', 'wallet-service', { idComprador, amount });

    try {
      const wallet = await this.ensureWalletExists(idComprador);

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore + amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({
          balance: wallet.balance + amount,
          available_balance: balanceAfter,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to update wallet balance', 'wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          transaction_type: 'credit',
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
        logger.error('Failed to create wallet transaction', 'wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Wallet credited successfully', 'wallet-service', { walletId: wallet.id, amount, transactionId: transaction.id });

      // Emit wallet credited event
      eventEmitter.emit({
        type: EventType.WALLET_CREDITED,
        timestamp: new Date().toISOString(),
        data: {
          walletId: wallet.id,
          idComprador,
          amount,
          transactionId: transaction.id,
        },
      });

      return transaction;
    } catch (error) {
      logger.error('Error crediting wallet', 'wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async debitWallet(
    idComprador: string,
    amount: number,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: Record<string, any>
  ): Promise<WalletTransaction> {
    logger.info('Debiting wallet', 'wallet-service', { idComprador, amount });

    try {
      const wallet = await this.ensureWalletExists(idComprador);

      if (wallet.available_balance < amount) {
        throw new Error('Insufficient balance');
      }

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore - amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({
          balance: wallet.balance - amount,
          available_balance: balanceAfter,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to update wallet balance', 'wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          transaction_type: 'debit',
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
        logger.error('Failed to create wallet transaction', 'wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Wallet debited successfully', 'wallet-service', { walletId: wallet.id, amount, transactionId: transaction.id });

      // Emit wallet debited event
      eventEmitter.emit({
        type: EventType.WALLET_DEBITED,
        timestamp: new Date().toISOString(),
        data: {
          walletId: wallet.id,
          idComprador,
          amount,
          transactionId: transaction.id,
        },
      });

      return transaction;
    } catch (error) {
      logger.error('Error debiting wallet', 'wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async freezeBalance(
    idComprador: string,
    amount: number,
    referenceId?: string,
    referenceType?: string
  ): Promise<WalletTransaction> {
    logger.info('Freezing wallet balance', 'wallet-service', { idComprador, amount });

    try {
      const wallet = await this.ensureWalletExists(idComprador);

      if (wallet.available_balance < amount) {
        throw new Error('Insufficient available balance to freeze');
      }

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore - amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({
          available_balance: balanceAfter,
          frozen_balance: wallet.frozen_balance + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to freeze wallet balance', 'wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          transaction_type: 'freeze',
          amount: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          reference_id: referenceId,
          reference_type: referenceType,
          description: 'Balance frozen',
        })
        .select()
        .single();

      if (transactionError) {
        logger.error('Failed to create wallet transaction', 'wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Wallet balance frozen successfully', 'wallet-service', { walletId: wallet.id, amount });

      return transaction;
    } catch (error) {
      logger.error('Error freezing wallet balance', 'wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async unfreezeBalance(
    idComprador: string,
    amount: number,
    referenceId?: string,
    referenceType?: string
  ): Promise<WalletTransaction> {
    logger.info('Unfreezing wallet balance', 'wallet-service', { idComprador, amount });

    try {
      const wallet = await this.ensureWalletExists(idComprador);

      if (wallet.frozen_balance < amount) {
        throw new Error('Insufficient frozen balance to unfreeze');
      }

      const balanceBefore = wallet.available_balance;
      const balanceAfter = balanceBefore + amount;

      // Update wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({
          available_balance: balanceAfter,
          frozen_balance: wallet.frozen_balance - amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id);

      if (updateError) {
        logger.error('Failed to unfreeze wallet balance', 'wallet-service', { updateError, walletId: wallet.id });
        throw updateError;
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          transaction_type: 'unfreeze',
          amount: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          reference_id: referenceId,
          reference_type: referenceType,
          description: 'Balance unfrozen',
        })
        .select()
        .single();

      if (transactionError) {
        logger.error('Failed to create wallet transaction', 'wallet-service', { transactionError });
        throw transactionError;
      }

      logger.info('Wallet balance unfrozen successfully', 'wallet-service', { walletId: wallet.id, amount });

      return transaction;
    } catch (error) {
      logger.error('Error unfreezing wallet balance', 'wallet-service', { error, idComprador, amount });
      throw error;
    }
  }

  async getTransactions(
    idComprador: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<WalletTransaction[]> {
    try {
      const wallet = await this.getWalletByidComprador(idComprador);
      if (!wallet) {
        return [];
      }

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Failed to get wallet transactions', 'wallet-service', { error, idComprador });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting wallet transactions', 'wallet-service', { error, idComprador });
      return [];
    }
  }
}

export const walletService = WalletService.getInstance();
