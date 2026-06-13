/**
 * Balance Calculation Domain Service
 * 
 * Domain service contendo lógica pura de cálculo de saldos financeiros.
 * Separado de infraestrutura (database, APIs) para facilitar testes e reuso.
 * 
 * Responsabilidades:
 * - Cálculo de saldo disponível
 * - Cálculo de saldo bloqueado
 * - Histórico de saldo
 * - Ajuste de saldo
 */

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

export interface BalanceSnapshot {
  distributorId: string;
  availableBalance: number;
  blockedBalance: number;
  totalBalance: number;
  pendingWithdrawals: number;
  pendingCommissions: number;
  lastUpdatedAt: Date;
}

export interface BalanceCalculationResult {
  distributorId: string;
  availableBalance: number;
  blockedBalance: number;
  totalBalance: number;
  transactions: BalanceTransaction[];
}

export class BalanceCalculationDomainService {
  private static instance: BalanceCalculationDomainService;

  private constructor() {}

  static getInstance(): BalanceCalculationDomainService {
    if (!BalanceCalculationDomainService.instance) {
      BalanceCalculationDomainService.instance = new BalanceCalculationDomainService();
    }
    return BalanceCalculationDomainService.instance;
  }

  /**
   * Calcula saldo disponível
   * 
   * @param transactions Transações do distribuidor
   * @param pendingWithdrawals Saques pendentes
   * @returns Saldo disponível
   */
  calculateAvailableBalance(
    transactions: BalanceTransaction[],
    pendingWithdrawals: number
  ): number {
    let balance = 0;

    for (const transaction of transactions) {
      switch (transaction.type) {
        case 'credit':
          balance += transaction.amount;
          break;
        case 'debit':
          balance -= transaction.amount;
          break;
        case 'block':
          // Bloqueio não afeta saldo disponível imediatamente
          break;
        case 'unblock':
          balance += transaction.amount;
          break;
        case 'adjustment':
          balance += transaction.amount;
          break;
      }
    }

    // Subtrair saques pendentes
    const availableBalance = balance - pendingWithdrawals;

    return Math.max(0, availableBalance);
  }

  /**
   * Calcula saldo bloqueado
   * 
   * @param transactions Transações do distribuidor
   * @returns Saldo bloqueado
   */
  calculateBlockedBalance(transactions: BalanceTransaction[]): number {
    let blockedBalance = 0;

    for (const transaction of transactions) {
      switch (transaction.type) {
        case 'block':
          blockedBalance += transaction.amount;
          break;
        case 'unblock':
          blockedBalance -= transaction.amount;
          break;
      }
    }

    return Math.max(0, blockedBalance);
  }

  /**
   * Calcula saldo total
   * 
   * @param transactions Transações do distribuidor
   * @returns Saldo total
   */
  calculateTotalBalance(transactions: BalanceTransaction[]): number {
    let balance = 0;

    for (const transaction of transactions) {
      switch (transaction.type) {
        case 'credit':
          balance += transaction.amount;
          break;
        case 'debit':
          balance -= transaction.amount;
          break;
        case 'block':
          balance += transaction.amount;
          break;
        case 'unblock':
          // Unblock não afeta total, apenas transfere de bloqueado para disponível
          break;
        case 'adjustment':
          balance += transaction.amount;
          break;
      }
    }

    return Math.max(0, balance);
  }

  /**
   * Calcula snapshot completo do saldo
   * 
   * @param distributorId ID do distribuidor
   * @param transactions Transações do distribuidor
   * @param pendingWithdrawals Saques pendentes
   * @param pendingCommissions Comissões pendentes
   * @returns Snapshot do saldo
   */
  calculateBalanceSnapshot(
    distributorId: string,
    transactions: BalanceTransaction[],
    pendingWithdrawals: number,
    pendingCommissions: number
  ): BalanceSnapshot {
    const availableBalance = this.calculateAvailableBalance(transactions, pendingWithdrawals);
    const blockedBalance = this.calculateBlockedBalance(transactions);
    const totalBalance = this.calculateTotalBalance(transactions);

    return {
      distributorId,
      availableBalance,
      blockedBalance,
      totalBalance,
      pendingWithdrawals,
      pendingCommissions,
      lastUpdatedAt: new Date(),
    };
  }

  /**
   * Processa transação de crédito
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor a creditar
   * @param description Descrição da transação
   * @param referenceId ID de referência
   * @param referenceType Tipo de referência
   * @returns Transação criada
   */
  createCreditTransaction(
    distributorId: string,
    amount: number,
    description: string,
    referenceId?: string,
    referenceType?: BalanceTransaction['referenceType']
  ): BalanceTransaction {
    return {
      id: this.generateTransactionId(),
      distributorId,
      type: 'credit',
      amount,
      description,
      referenceId,
      referenceType,
      createdAt: new Date(),
    };
  }

  /**
   * Processa transação de débito
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor a debitar
   * @param description Descrição da transação
   * @param referenceId ID de referência
   * @param referenceType Tipo de referência
   * @returns Transação criada
   */
  createDebitTransaction(
    distributorId: string,
    amount: number,
    description: string,
    referenceId?: string,
    referenceType?: BalanceTransaction['referenceType']
  ): BalanceTransaction {
    return {
      id: this.generateTransactionId(),
      distributorId,
      type: 'debit',
      amount,
      description,
      referenceId,
      referenceType,
      createdAt: new Date(),
    };
  }

  /**
   * Processa bloqueio de saldo
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor a bloquear
   * @param description Descrição do bloqueio
   * @param referenceId ID de referência
   * @param referenceType Tipo de referência
   * @returns Transação criada
   */
  createBlockTransaction(
    distributorId: string,
    amount: number,
    description: string,
    referenceId?: string,
    referenceType?: BalanceTransaction['referenceType']
  ): BalanceTransaction {
    return {
      id: this.generateTransactionId(),
      distributorId,
      type: 'block',
      amount,
      description,
      referenceId,
      referenceType,
      createdAt: new Date(),
    };
  }

  /**
   * Processa desbloqueio de saldo
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor a desbloquear
   * @param description Descrição do desbloqueio
   * @param referenceId ID de referência
   * @param referenceType Tipo de referência
   * @returns Transação criada
   */
  createUnblockTransaction(
    distributorId: string,
    amount: number,
    description: string,
    referenceId?: string,
    referenceType?: BalanceTransaction['referenceType']
  ): BalanceTransaction {
    return {
      id: this.generateTransactionId(),
      distributorId,
      type: 'unblock',
      amount,
      description,
      referenceId,
      referenceType,
      createdAt: new Date(),
    };
  }

  /**
   * Processa ajuste de saldo
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor do ajuste (positivo ou negativo)
   * @param description Descrição do ajuste
   * @param referenceId ID de referência
   * @param referenceType Tipo de referência
   * @returns Transação criada
   */
  createAdjustmentTransaction(
    distributorId: string,
    amount: number,
    description: string,
    referenceId?: string,
    referenceType?: BalanceTransaction['referenceType']
  ): BalanceTransaction {
    return {
      id: this.generateTransactionId(),
      distributorId,
      type: 'adjustment',
      amount,
      description,
      referenceId,
      referenceType,
      createdAt: new Date(),
    };
  }

  /**
   * Calcula histórico de saldo em um período
   * 
   * @param transactions Transações do distribuidor
   * @param startDate Data inicial
   * @param endDate Data final
   * @returns Histórico de saldo
   */
  calculateBalanceHistory(
    transactions: BalanceTransaction[],
    startDate: Date,
    endDate: Date
  ): Array<{ date: Date; balance: number }> {
    const history: Array<{ date: Date; balance: number }> = [];
    let balance = 0;

    // Filtrar transações por período
    const periodTransactions = transactions.filter(
      t => t.createdAt >= startDate && t.createdAt <= endDate
    );

    // Ordenar por data
    periodTransactions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Calcular saldo ao longo do tempo
    for (const transaction of periodTransactions) {
      switch (transaction.type) {
        case 'credit':
          balance += transaction.amount;
          break;
        case 'debit':
          balance -= transaction.amount;
          break;
        case 'block':
          balance += transaction.amount;
          break;
        case 'unblock':
          // Unblock não afeta total
          break;
        case 'adjustment':
          balance += transaction.amount;
          break;
      }

      history.push({
        date: transaction.createdAt,
        balance,
      });
    }

    return history;
  }

  /**
   * Valida se há saldo suficiente para uma operação
   * 
   * @param distributorId ID do distribuidor
   * @param amount Valor necessário
   * @param transactions Transações do distribuidor
   * @param pendingWithdrawals Saques pendentes
   * @returns true se há saldo suficiente
   */
  hasSufficientBalance(
    distributorId: string,
    amount: number,
    transactions: BalanceTransaction[],
    pendingWithdrawals: number
  ): boolean {
    const availableBalance = this.calculateAvailableBalance(transactions, pendingWithdrawals);
    return availableBalance >= amount;
  }

  /**
   * Calcula média de saldo em um período
   * 
   * @param history Histórico de saldo
   * @returns Média de saldo
   */
  calculateAverageBalance(history: Array<{ date: Date; balance: number }>): number {
    if (history.length === 0) return 0;

    const total = history.reduce((sum, h) => sum + h.balance, 0);
    return total / history.length;
  }

  /**
   * Calcula saldo mínimo em um período
   * 
   * @param history Histórico de saldo
   * @returns Saldo mínimo
   */
  calculateMinimumBalance(history: Array<{ date: Date; balance: number }>): number {
    if (history.length === 0) return 0;

    return Math.min(...history.map(h => h.balance));
  }

  /**
   * Calcula saldo máximo em um período
   * 
   * @param history Histórico de saldo
   * @returns Saldo máximo
   */
  calculateMaximumBalance(history: Array<{ date: Date; balance: number }>): number {
    if (history.length === 0) return 0;

    return Math.max(...history.map(h => h.balance));
  }

  /**
   * Gera ID de transação
   * 
   * @returns ID único
   */
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Agrupa transações por tipo
   * 
   * @param transactions Transações
   * @returns Transações agrupadas por tipo
   */
  groupTransactionsByType(transactions: BalanceTransaction[]): Record<string, BalanceTransaction[]> {
    const grouped: Record<string, BalanceTransaction[]> = {};

    for (const transaction of transactions) {
      if (!grouped[transaction.type]) {
        grouped[transaction.type] = [];
      }
      grouped[transaction.type].push(transaction);
    }

    return grouped;
  }

  /**
   * Calcula total por tipo de transação
   * 
   * @param transactions Transações
   * @returns Total por tipo
   */
  calculateTotalByType(transactions: BalanceTransaction[]): Record<string, number> {
    const totals: Record<string, number> = {};

    for (const transaction of transactions) {
      if (!totals[transaction.type]) {
        totals[transaction.type] = 0;
      }
      totals[transaction.type] += transaction.amount;
    }

    return totals;
  }

  /**
   * Filtra transações por tipo de referência
   * 
   * @param transactions Transações
   * @param referenceType Tipo de referência
   * @returns Transações filtradas
   */
  filterByReferenceType(
    transactions: BalanceTransaction[],
    referenceType: BalanceTransaction['referenceType']
  ): BalanceTransaction[] {
    return transactions.filter(t => t.referenceType === referenceType);
  }

  /**
   * Filtra transações por período
   * 
   * @param transactions Transações
   * @param startDate Data inicial
   * @param endDate Data final
   * @returns Transações filtradas
   */
  filterByPeriod(
    transactions: BalanceTransaction[],
    startDate: Date,
    endDate: Date
  ): BalanceTransaction[] {
    return transactions.filter(t => t.createdAt >= startDate && t.createdAt <= endDate);
  }
}
