/**
 * Bank Account Service
 * 
 * Service responsável pela gestão de contas bancárias.
 */

import { supabase } from "../../../shared/infrastructure/supabase/client";

export interface BankAccount {
  id: string;
  distributorId: string;
  bankCode: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  variation?: string;
  agency: string;
  accountNumber: string;
  operation?: string;
  accountHolderName: string;
  accountHolderType: 'individual' | 'corporate';
  accountHolderDocument: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBankAccountDTO {
  distributorId: string;
  bankCode: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  variation?: string;
  agency: string;
  accountNumber: string;
  operation?: string;
  accountHolderName: string;
  accountHolderType: 'individual' | 'corporate';
  accountHolderDocument: string;
  isPrimary?: boolean;
}

export interface UpdateBankAccountDTO {
  bankCode?: string;
  bankName?: string;
  accountType?: 'checking' | 'savings';
  variation?: string;
  agency?: string;
  accountNumber?: string;
  operation?: string;
  accountHolderName?: string;
  accountHolderType?: 'individual' | 'corporate';
  accountHolderDocument?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export class BankAccountService {
  private static instance: BankAccountService;

  private constructor() {}

  static getInstance(): BankAccountService {
    if (!BankAccountService.instance) {
      BankAccountService.instance = new BankAccountService();
    }
    return BankAccountService.instance;
  }

  /**
   * Cria conta bancária
   * 
   * @param dto Dados da conta
   * @returns Conta criada
   */
  async createBankAccount(dto: CreateBankAccountDTO): Promise<BankAccount> {
    try {
      // Se for marcada como primary, desmarcar outras contas primary
      if (dto.isPrimary) {
        await this.unsetPrimaryAccounts(dto.distributorId);
      }

      const { data, error } = await supabase
        .from('finance.contas_bancarias')
        .insert({
          distribuidor_id: dto.distributorId,
          codigo_banco: dto.bankCode,
          nome_banco: dto.bankName,
          tipo_conta: dto.accountType,
          variacao: dto.variation,
          agencia: dto.agency,
          numero_conta: dto.accountNumber,
          operacao: dto.operation,
          nome_titular: dto.accountHolderName,
          tipo_titular: dto.accountHolderType,
          documento_titular: dto.accountHolderDocument,
          is_principal: dto.isPrimary || false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create bank account');

      return this.mapToBankAccount(data);
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw error;
    }
  }

  /**
   * Busca conta bancária por ID
   * 
   * @param id ID da conta
   * @returns Conta ou null
   */
  async getBankAccountById(id: string): Promise<BankAccount | null> {
    try {
      const { data, error } = await supabase
        .from('finance.contas_bancarias')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapToBankAccount(data);
    } catch (error) {
      console.error('Error getting bank account:', error);
      throw error;
    }
  }

  /**
   * Busca contas bancárias de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param activeOnly Buscar apenas ativas
   * @returns Lista de contas
   */
  async getDistributorBankAccounts(
    distributorId: string,
    activeOnly: boolean = true
  ): Promise<BankAccount[]> {
    try {
      let query = supabase
        .from('finance.contas_bancarias')
        .select()
        .eq('distribuidor_id', distributorId)
        .order('is_principal', { ascending: false })
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return [];

      return data.map(item => this.mapToBankAccount(item));
    } catch (error) {
      console.error('Error getting distributor bank accounts:', error);
      throw error;
    }
  }

  /**
   * Busca conta principal de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @returns Conta principal ou null
   */
  async getPrimaryBankAccount(distributorId: string): Promise<BankAccount | null> {
    try {
      const { data, error } = await supabase
        .from('finance.contas_bancarias')
        .select()
        .eq('distribuidor_id', distributorId)
        .eq('is_principal', true)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return this.mapToBankAccount(data);
    } catch (error) {
      console.error('Error getting primary bank account:', error);
      throw error;
    }
  }

  /**
   * Atualiza conta bancária
   * 
   * @param id ID da conta
   * @param dto Dados para atualização
   * @returns Conta atualizada
   */
  async updateBankAccount(id: string, dto: UpdateBankAccountDTO): Promise<BankAccount> {
    try {
      // Se estiver marcando como primary, desmarcar outras
      if (dto.isPrimary) {
        const account = await this.getBankAccountById(id);
        if (account) {
          await this.unsetPrimaryAccounts(account.distributorId);
        }
      }

      const updateData: any = {};

      if (dto.bankCode !== undefined) updateData.codigo_banco = dto.bankCode;
      if (dto.bankName !== undefined) updateData.nome_banco = dto.bankName;
      if (dto.accountType !== undefined) updateData.tipo_conta = dto.accountType;
      if (dto.variation !== undefined) updateData.variacao = dto.variation;
      if (dto.agency !== undefined) updateData.agencia = dto.agency;
      if (dto.accountNumber !== undefined) updateData.numero_conta = dto.accountNumber;
      if (dto.operation !== undefined) updateData.operacao = dto.operation;
      if (dto.accountHolderName !== undefined) updateData.nome_titular = dto.accountHolderName;
      if (dto.accountHolderType !== undefined) updateData.tipo_titular = dto.accountHolderType;
      if (dto.accountHolderDocument !== undefined) updateData.documento_titular = dto.accountHolderDocument;
      if (dto.isPrimary !== undefined) updateData.is_principal = dto.isPrimary;
      if (dto.isActive !== undefined) updateData.is_active = dto.isActive;

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('finance.contas_bancarias')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update bank account');

      return this.mapToBankAccount(data);
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw error;
    }
  }

  /**
   * Define conta como principal
   * 
   * @param id ID da conta
   * @returns Conta atualizada
   */
  async setAsPrimary(id: string): Promise<BankAccount> {
    try {
      const account = await this.getBankAccountById(id);
      if (!account) throw new Error('Bank account not found');

      // Desmarcar outras contas como primary
      await this.unsetPrimaryAccounts(account.distributorId);

      // Marcar esta conta como primary
      return await this.updateBankAccount(id, { isPrimary: true });
    } catch (error) {
      console.error('Error setting bank account as primary:', error);
      throw error;
    }
  }

  /**
   * Desativa conta bancária
   * 
   * @param id ID da conta
   * @returns true se desativou com sucesso
   */
  async deactivateBankAccount(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('finance.contas_bancarias')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deactivating bank account:', error);
      throw error;
    }
  }

  /**
   * Remove conta bancária
   * 
   * @param id ID da conta
   * @returns true se removeu com sucesso
   */
  async deleteBankAccount(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('finance.contas_bancarias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error;
    }
  }

  /**
   * Desmarca todas as contas de um distribuidor como primary
   * 
   * @param distributorId ID do distribuidor
   */
  private async unsetPrimaryAccounts(distributorId: string): Promise<void> {
    try {
      await supabase
        .from('finance.contas_bancarias')
        .update({ is_principal: false, updated_at: new Date().toISOString() })
        .eq('distribuidor_id', distributorId)
        .eq('is_principal', true);
    } catch (error) {
      console.error('Error unsetting primary accounts:', error);
      throw error;
    }
  }

  /**
   * Mapeia dados do database para entidade BankAccount
   * 
   * @param data Dados do database
   * @returns Entidade BankAccount
   */
  private mapToBankAccount(data: any): BankAccount {
    return {
      id: data.id,
      distributorId: data.distribuidor_id,
      bankCode: data.codigo_banco,
      bankName: data.nome_banco,
      accountType: data.tipo_conta,
      variation: data.variacao,
      agency: data.agencia,
      accountNumber: data.numero_conta,
      operation: data.operacao,
      accountHolderName: data.nome_titular,
      accountHolderType: data.tipo_titular,
      accountHolderDocument: data.documento_titular,
      isPrimary: data.is_principal,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
