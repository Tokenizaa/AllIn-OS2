/**
 * CD Balance Service
 * 
 * Service para gerenciar saldo de Centro de Distribuição (CD).
 */

import { CDBalanceMovementRepository } from '../repositories/cd-balance.repository';
import {
  CDBalanceMovement,
  CreateCDBalanceMovementDTO,
  CDBalance,
  CDBalanceSummary,
} from '../dto/cd-balance.dto';

export class CDBalanceService {
  private repository: CDBalanceMovementRepository;

  constructor() {
    this.repository = new CDBalanceMovementRepository();
  }

  /**
   * Cria movimentação de saldo
   */
  async createMovement(dto: CreateCDBalanceMovementDTO): Promise<CDBalanceMovement> {
    // Busca saldo atual
    const previousBalance = await this.repository.getCurrentBalance(dto.cd_id);
    let newBalance = previousBalance;

    // Calcula novo saldo baseado no tipo de movimentação
    switch (dto.movement_type) {
      case 'credit':
      case 'transfer_in':
        newBalance = previousBalance + dto.amount;
        break;
      case 'debit':
      case 'transfer_out':
        newBalance = Math.max(0, previousBalance - dto.amount);
        break;
    }

    // Cria movimentação
    const movement = await this.repository.createMovement({
      cd_id: dto.cd_id,
      cd_name: `CD ${dto.cd_id}`,
      amount: dto.amount,
      movement_type: dto.movement_type,
      reason: dto.reason,
      reference_id: dto.reference_id,
      reference_type: dto.reference_type,
      previous_balance: previousBalance,
      new_balance: newBalance,
      user_id: dto.user_id,
      user_name: dto.user_name,
      notes: dto.notes,
    });

    return movement;
  }

  /**
   * Busca movimentações por CD
   */
  async getMovementsByCD(cdId: number): Promise<CDBalanceMovement[]> {
    return this.repository.findByCD(cdId);
  }

  /**
   * Busca movimentações por tipo
   */
  async getMovementsByType(movementType: string): Promise<CDBalanceMovement[]> {
    return this.repository.findByMovementType(movementType);
  }

  /**
   * Busca movimentações recentes
   */
  async getRecentMovements(limit: number = 50): Promise<CDBalanceMovement[]> {
    return this.repository.findRecent(limit);
  }

  /**
   * Busca saldo atual de um CD
   */
  async getCDBalance(cdId: number): Promise<CDBalance> {
    const currentBalance = await this.repository.getCurrentBalance(cdId);
    const movements = await this.repository.findByCD(cdId);

    return {
      cd_id: cdId,
      cd_name: `CD ${cdId}`,
      current_balance: currentBalance,
      available_balance: currentBalance, // Simplificação: assume que todo saldo está disponível
      pending_balance: 0, // Simplificação: não há saldo pendente
      last_movement: movements[movements.length - 1],
    };
  }

  /**
   * Busca resumo de saldos de todos os CDs
   */
  async getBalanceSummary(): Promise<CDBalanceSummary> {
    const summary = await this.repository.getBalanceSummary();
    const recentMovements = await this.repository.findRecent(10);

    return {
      ...summary,
      recent_movements: recentMovements,
    };
  }

  /**
   * Credita saldo em CD
   */
  async creditBalance(
    cdId: number,
    amount: number,
    reason: string,
    userId: string,
    userName: string,
    referenceId?: string,
    referenceType?: 'order' | 'adjustment' | 'transfer'
  ): Promise<CDBalanceMovement> {
    return this.createMovement({
      cd_id: cdId,
      amount,
      movement_type: 'credit',
      reason,
      reference_id: referenceId,
      reference_type: referenceType,
      user_id: userId,
      user_name: userName,
    });
  }

  /**
   * Debita saldo de CD
   */
  async debitBalance(
    cdId: number,
    amount: number,
    reason: string,
    userId: string,
    userName: string,
    referenceId?: string,
    referenceType?: 'order' | 'adjustment' | 'transfer'
  ): Promise<CDBalanceMovement> {
    return this.createMovement({
      cd_id: cdId,
      amount,
      movement_type: 'debit',
      reason,
      reference_id: referenceId,
      reference_type: referenceType,
      user_id: userId,
      user_name: userName,
    });
  }

  /**
   * Transfere saldo entre CDs
   */
  async transferBalance(
    fromCdId: number,
    toCdId: number,
    amount: number,
    reason: string,
    userId: string,
    userName: string
  ): Promise<{ fromMovement: CDBalanceMovement; toMovement: CDBalanceMovement }> {
    // Debita do CD de origem
    const fromMovement = await this.debitBalance(
      fromCdId,
      amount,
      reason,
      userId,
      userName,
      undefined,
      'transfer'
    );

    // Credita no CD de destino
    const toMovement = await this.creditBalance(
      toCdId,
      amount,
      reason,
      userId,
      userName,
      undefined,
      'transfer'
    );

    return {
      fromMovement,
      toMovement,
    };
  }

  /**
   * Ajusta saldo manualmente
   */
  async adjustBalance(
    cdId: number,
    newAmount: number,
    reason: string,
    userId: string,
    userName: string
  ): Promise<CDBalanceMovement> {
    const currentBalance = await this.repository.getCurrentBalance(cdId);
    const difference = newAmount - currentBalance;
    const movementType = difference >= 0 ? 'credit' : 'debit';

    return this.createMovement({
      cd_id: cdId,
      amount: Math.abs(difference),
      movement_type,
      reason,
      reference_type: 'adjustment',
      user_id: userId,
      user_name: userName,
    });
  }
}
