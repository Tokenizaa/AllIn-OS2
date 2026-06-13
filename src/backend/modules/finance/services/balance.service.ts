/**
 * Balance Service
 * 
 * Service responsável pela gestão de saldos financeiros.
 */

import { supabase } from "../../../shared/infrastructure/supabase/client";

export interface Balance {
  distributorId: string;
  availableBalance: number;
  blockedBalance: number;
  totalBalance: number;
  pendingWithdrawals: number;
  pendingCommissions: number;
  lastUpdatedAt: Date;
}

export interface BalanceTransaction {
  id: string;
  distributorId: string;
  type: 'credit' | 'debit' | 'block' | 'unblock' | 'adjustment';
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: 'commission' | 'withdrawal' | 'refund' | 'penalty' | 'bonus';
  createdAt: Date;
}

export class BalanceService {
  private static instance: BalanceService;

  private constructor() {}

  static getInstance(): BalanceService {
    if (!BalanceService.instance) {
      BalanceService.instance = new BalanceService();
    }
    return BalanceService.instance;
  }

  /**
   * Busca saldo de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @returns Saldo ou null
   */
  async getBalance(distributorId: string): Promise<Balance | null> {
    try {
      const { data, error } = await supabase
        .from('finance.saldos')
        .select()
        .eq('distribuidor_id', distributorId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return this.mapToBalance(data);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Cria ou atualiza saldo de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor a creditar/debitar
   * @param type Tipo de transação
   * @param description Descrição
   * @param referenceId ID de referência
   * @param referenceType Tipo de referência
   * @returns Saldo atualizado
   */
  async updateBalance(
    distributorId: string,
    amount: number,
    type: 'credit' | 'debit' | 'block' | 'unblock' | 'adjustment',
    description: string,
    referenceId?: string,
    referenceType?: BalanceTransaction['referenceType']
  ): Promise<Balance> {
    try {
      // Buscar saldo atual
      const currentBalance = await this.getBalance(distributorId);

      let newAvailableBalance = currentBalance?.availableBalance || 0;
      let newBlockedBalance = currentBalance?.blockedBalance || 0;

      switch (type) {
        case 'credit':
          newAvailableBalance += amount;
          break;
        case 'debit':
          newAvailableBalance -= amount;
          break;
        case 'block':
          newAvailableBalance -= amount;
          newBlockedBalance += amount;
          break;
        case 'unblock':
          newBlockedBalance -= amount;
          newAvailableBalance += amount;
          break;
        case 'adjustment':
          newAvailableBalance += amount;
          break;
      }

      // Atualizar ou criar saldo
      if (currentBalance) {
        const { error } = await supabase
          .from('finance.saldos')
          .update({
            saldo_disponivel: newAvailableBalance,
            saldo_bloqueado: newBlockedBalance,
            saldo_total: newAvailableBalance + newBlockedBalance,
            updated_at: new Date().toISOString(),
          })
          .eq('distribuidor_id', distributorId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('finance.saldos')
          .insert({
            distribuidor_id: distributorId,
            saldo_disponivel: newAvailableBalance,
            saldo_bloqueado: newBlockedBalance,
            saldo_total: newAvailableBalance + newBlockedBalance,
            saques_pendentes: 0,
            comissoes_pendentes: 0,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      // Criar transação
      await this.createTransaction(
        distributorId,
        type,
        amount,
        description,
        referenceId,
        referenceType
      );

      // Buscar saldo atualizado
      return await this.getBalance(distributorId);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }

  /**
   * Busca transações de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param limit Limite de resultados
   * @returns Lista de transações
   */
  async getTransactions(distributorId: string, limit: number = 50): Promise<BalanceTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('finance.transacoes_saldo')
        .select()
        .eq('distribuidor_id', distributorId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      if (!data) return [];

      return data.map(item => this.mapToTransaction(item));
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  /**
   * Cria transação de saldo
   * 
   * @param distributorId ID do distribuidor
   * @param type Tipo de transação
   * @param amount Valor
   * @param description Descrição
   * @param referenceId ID de referência
   * @param referenceType Tipo de referência
   * @returns Transação criada
   */
  private async createTransaction(
    distributorId: string,
    type: BalanceTransaction['type'],
    amount: number,
    description: string,
    referenceId?: string,
    referenceType?: BalanceTransaction['referenceType']
  ): Promise<BalanceTransaction> {
    try {
      const { data, error } = await supabase
        .from('finance.transacoes_saldo')
        .insert({
          distribuidor_id: distributorId,
          tipo: type,
          valor: amount,
          descricao: description,
          referencia_id: referenceId,
          referencia_tipo: referenceType,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create transaction');

      return this.mapToTransaction(data);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Mapeia dados do database para entidade Balance
   * 
   * @param data Dados do database
   * @returns Entidade Balance
   */
  private mapToBalance(data: any): Balance {
    return {
      distributorId: data.distribuidor_id,
      availableBalance: parseFloat(data.saldo_disponivel),
      blockedBalance: parseFloat(data.saldo_bloqueado),
      totalBalance: parseFloat(data.saldo_total),
      pendingWithdrawals: parseFloat(data.saques_pendentes || 0),
      pendingCommissions: parseFloat(data.comissoes_pendentes || 0),
      lastUpdatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Mapeia dados do database para entidade BalanceTransaction
   * 
   * @param data Dados do database
   * @returns Entidade BalanceTransaction
   */
  private mapToTransaction(data: any): BalanceTransaction {
    return {
      id: data.id,
      distributorId: data.distribuidor_id,
      type: data.tipo,
      amount: parseFloat(data.valor),
      description: data.descricao,
      referenceId: data.referencia_id,
      referenceType: data.referencia_tipo,
      createdAt: new Date(data.created_at),
    };
  }
}
