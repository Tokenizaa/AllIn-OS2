/**
 * CD Balance Repository
 * 
 * Repository para operações de database relacionadas a saldo de Centro de Distribuição (CD).
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface CDBalanceMovement extends BaseEntity {
  cd_id: number;
  cd_name: string;
  amount: number;
  movement_type: 'credit' | 'debit' | 'transfer_in' | 'transfer_out';
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'adjustment' | 'transfer';
  previous_balance: number;
  new_balance: number;
  user_id: string;
  user_name: string;
  notes?: string;
}

export class CDBalanceMovementRepository extends BaseRepository<CDBalanceMovement> {
  constructor() {
    super('cd_balance_movements', 'commerce');
  }

  /**
   * Busca movimentações por CD
   */
  async findByCD(cdId: number): Promise<CDBalanceMovement[]> {
    return this.findAll({
      filters: { cd_id: cdId },
    });
  }

  /**
   * Busca movimentações por tipo
   */
  async findByMovementType(movementType: string): Promise<CDBalanceMovement[]> {
    return this.findAll({
      filters: { movement_type: movementType },
    });
  }

  /**
   * Busca movimentações recentes
   */
  async findRecent(limit: number = 50): Promise<CDBalanceMovement[]> {
    return this.findAll({
      limit,
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Cria movimentação de saldo
   */
  async createMovement(movement: Omit<CDBalanceMovement, 'id' | 'created_at' | 'updated_at'>): Promise<CDBalanceMovement> {
    return this.create(movement);
  }

  /**
   * Busca saldo atual de um CD
   */
  async getCurrentBalance(cdId: number): Promise<number> {
    const movements = await this.findByCD(cdId);
    if (movements.length === 0) {
      return 0;
    }
    // Retorna o saldo da última movimentação
    const lastMovement = movements[movements.length - 1];
    return lastMovement.new_balance;
  }

  /**
   * Busca resumo de saldos de todos os CDs
   */
  async getBalanceSummary(): Promise<{
    total_cds: number;
    total_balance: number;
    total_available: number;
    total_pending: number;
  }> {
    // Simplificação: assume CDs de 1 a 10
    const cdIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let totalBalance = 0;
    let totalAvailable = 0;
    let totalPending = 0;

    for (const cdId of cdIds) {
      const balance = await this.getCurrentBalance(cdId);
      totalBalance += balance;
      totalAvailable += balance; // Simplificação: assume que todo saldo está disponível
      totalPending += 0; // Simplificação: não há saldo pendente
    }

    return {
      total_cds: cdIds.length,
      total_balance: totalBalance,
      total_available: totalAvailable,
      total_pending: totalPending,
    };
  }
}
