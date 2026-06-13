/**
 * Withdrawal Service
 * 
 * Service responsável pela gestão de solicitações de saque.
 */

import { supabase } from "../../../shared/infrastructure/supabase/client";
import { WithdrawalValidationDomainService } from "../domain-services";

export interface Withdrawal {
  id: string;
  distributorId: string;
  distributorName: string;
  distributorUsername: string;
  distributorBirthDate: Date;
  amount: number;
  totalFees: number;
  amountToDeposit: number;
  status: 'requested' | 'approved' | 'rejected' | 'deposited' | 'reversed';
  statusDescription: string;
  requestedAt: Date;
  approvedAt?: Date;
  depositedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  bankCode: string;
  accountType: string;
  variation?: string;
  agency: string;
  accountNumber: string;
  operation?: string;
  accountHolderName: string;
  accountHolderType: string;
  accountHolderDocument: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWithdrawalDTO {
  distributorId: string;
  amount: number;
  bankCode: string;
  accountType: string;
  variation?: string;
  agency: string;
  accountNumber: string;
  operation?: string;
  accountHolderName: string;
  accountHolderType: string;
  accountHolderDocument: string;
}

export interface UpdateWithdrawalDTO {
  status?: Withdrawal['status'];
  rejectionReason?: string;
  approvedAt?: Date;
  depositedAt?: Date;
  rejectedAt?: Date;
}

export class WithdrawalService {
  private static instance: WithdrawalService;
  private validationService: WithdrawalValidationDomainService;

  private constructor() {
    this.validationService = WithdrawalValidationDomainService.getInstance();
  }

  static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  /**
   * Cria solicitação de saque
   * 
   * @param dto Dados da solicitação
   * @returns Solicitação criada
   */
  async createWithdrawal(dto: CreateWithdrawalDTO): Promise<Withdrawal> {
    try {
      // Buscar dados do distribuidor
      const { data: distributor, error: distributorError } = await supabase
        .from('mlm.distribuidores')
        .select('nome, usuario, data_nascimento, qualificacao')
        .eq('id', dto.distributorId)
        .single();

      if (distributorError) throw distributorError;
      if (!distributor) throw new Error('Distributor not found');

      // Buscar saldo do distribuidor
      const { data: balance, error: balanceError } = await supabase
        .from('finance.saldos')
        .select('saldo_disponivel')
        .eq('distribuidor_id', dto.distributorId)
        .single();

      if (balanceError && balanceError.code !== 'PGRST116') throw balanceError;

      const availableBalance = balance?.saldo_disponivel || 0;

      // Buscar saques pendentes
      const { data: pendingWithdrawals, error: pendingError } = await supabase
        .from('finance.solicitacoes_saque')
        .select('valor_solicitado')
        .eq('distribuidor_id', dto.distributorId)
        .eq('status', 'requested');

      if (pendingError && pendingError.code !== 'PGRST116') throw pendingError;

      const pendingAmount = pendingWithdrawals?.reduce((sum, w) => sum + (parseFloat(w.valor_solicitado) || 0), 0) || 0;

      // Validar saque usando domain service
      const validation = this.validationService.validateWithdrawal(
        dto.distributorId,
        dto.amount,
        {
          distributorId: dto.distributorId,
          availableBalance,
          blockedBalance: 0,
          totalBalance: availableBalance,
          pendingWithdrawals: pendingAmount,
        },
        {
          minAmount: 50,
          maxAmount: 10000,
          dailyLimit: 5000,
          monthlyLimit: 20000,
          dailyWithdrawals: pendingWithdrawals?.length || 0,
          monthlyWithdrawals: 0,
        },
        distributor.qualificacao || 'none'
      );

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Calcular taxas
      const totalFees = this.validationService.calculateWithdrawalFee(dto.amount, distributor.qualificacao || 'none');
      const amountToDeposit = dto.amount - totalFees;

      // Criar solicitação
      const { data, error } = await supabase
        .from('finance.solicitacoes_saque')
        .insert({
          distribuidor_id: dto.distributorId,
          distribuidor_nome: distributor.nome,
          distribuidor_usuario: distributor.usuario,
          distribuidor_data_nascimento: distributor.data_nascimento,
          valor_solicitado: dto.amount,
          total_taxas: totalFees,
          valor_a_depositar: amountToDeposit,
          status_id: 1,
          status_descricao: 'Solicitado',
          banco: dto.bankCode,
          tipo_conta: dto.accountType,
          variacao: dto.variation,
          agencia: dto.agency,
          numero: dto.accountNumber,
          operacao: dto.operation,
          nome_titular: dto.accountHolderName,
          tipo_titular: dto.accountHolderType,
          documento_titular: dto.accountHolderDocument,
          data_pedido: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create withdrawal');

      return this.mapToWithdrawal(data);
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      throw error;
    }
  }

  /**
   * Busca solicitação de saque por ID
   * 
   * @param id ID da solicitação
   * @returns Solicitação ou null
   */
  async getWithdrawalById(id: string): Promise<Withdrawal | null> {
    try {
      const { data, error } = await supabase
        .from('finance.solicitacoes_saque')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapToWithdrawal(data);
    } catch (error) {
      console.error('Error getting withdrawal:', error);
      throw error;
    }
  }

  /**
   * Busca solicitações de saque de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param status Status para filtrar (opcional)
   * @returns Lista de solicitações
   */
  async getDistributorWithdrawals(
    distributorId: string,
    status?: Withdrawal['status']
  ): Promise<Withdrawal[]> {
    try {
      let query = supabase
        .from('finance.solicitacoes_saque')
        .select()
        .eq('distribuidor_id', distributorId)
        .order('data_pedido', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return [];

      return data.map(item => this.mapToWithdrawal(item));
    } catch (error) {
      console.error('Error getting distributor withdrawals:', error);
      throw error;
    }
  }

  /**
   * Aprova solicitação de saque
   * 
   * @param id ID da solicitação
   * @returns Solicitação atualizada
   */
  async approveWithdrawal(id: string): Promise<Withdrawal> {
    try {
      const { data, error } = await supabase
        .from('finance.solicitacoes_saque')
        .update({
          status_id: 3,
          status_descricao: 'Depositado',
          data_apuracao: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to approve withdrawal');

      return this.mapToWithdrawal(data);
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      throw error;
    }
  }

  /**
   * Rejeita solicitação de saque
   * 
   * @param id ID da solicitação
   * @param reason Motivo da rejeição
   * @returns Solicitação atualizada
   */
  async rejectWithdrawal(id: string, reason: string): Promise<Withdrawal> {
    try {
      const { data, error } = await supabase
        .from('finance.solicitacoes_saque')
        .update({
          status_id: 4,
          status_descricao: 'Estornado',
          data_apuracao: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          motivo_rejeicao: reason,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to reject withdrawal');

      return this.mapToWithdrawal(data);
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      throw error;
    }
  }

  /**
   * Busca todas as solicitações de saque
   * 
   * @param status Status para filtrar (opcional)
   * @returns Lista de solicitações
   */
  async getAllWithdrawals(status?: Withdrawal['status']): Promise<Withdrawal[]> {
    try {
      let query = supabase
        .from('finance.solicitacoes_saque')
        .select()
        .order('data_pedido', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return [];

      return data.map(item => this.mapToWithdrawal(item));
    } catch (error) {
      console.error('Error getting all withdrawals:', error);
      throw error;
    }
  }

  /**
   * Mapeia dados do database para entidade Withdrawal
   * 
   * @param data Dados do database
   * @returns Entidade Withdrawal
   */
  private mapToWithdrawal(data: any): Withdrawal {
    return {
      id: data.id,
      distributorId: data.distribuidor_id,
      distributorName: data.distribuidor_nome,
      distributorUsername: data.distribuidor_usuario,
      distributorBirthDate: new Date(data.distribuidor_data_nascimento),
      amount: parseFloat(data.valor_solicitado),
      totalFees: parseFloat(data.total_taxas),
      amountToDeposit: parseFloat(data.valor_a_depositar),
      status: this.mapStatus(data.status_id),
      statusDescription: data.status_descricao,
      requestedAt: new Date(data.data_pedido),
      approvedAt: data.data_apuracao ? new Date(data.data_apuracao) : undefined,
      bankCode: data.banco,
      accountType: data.tipo_conta,
      variation: data.variacao,
      agency: data.agencia,
      accountNumber: data.numero,
      operation: data.operacao,
      accountHolderName: data.nome_titular,
      accountHolderType: data.tipo_titular,
      accountHolderDocument: data.documento_titular,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Mapeia status ID para status
   * 
   * @param statusId ID do status
   * @returns Status
   */
  private mapStatus(statusId: number): Withdrawal['status'] {
    const statusMap: Record<number, Withdrawal['status']> = {
      1: 'requested',
      2: 'approved',
      3: 'deposited',
      4: 'reversed',
    };

    return statusMap[statusId] || 'requested';
  }
}
