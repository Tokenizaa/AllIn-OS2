// ============================================================================
// FINANCE SERVICE - ALLIN OS 2.0
// Serviço para gestão financeira
// ============================================================================

import { ApiClient } from '../client';
import { DistribuidorContaBancaria, SolicitacaoSaque } from '../types';

export class FinanceService {
  constructor(private client: ApiClient) {}

  /**
   * Lista contas bancárias do distribuidor
   */
  async listContasBancarias(distribuidorId: number): Promise<DistribuidorContaBancaria[]> {
    const response = await this.client.get<DistribuidorContaBancaria[]>(`/v1/distribuidor-conta-bancaria?id=${distribuidorId}`);
    return response.data;
  }

  /**
   * Lista solicitações de saque de distribuidores
   */
  async listSolicitacoesSaque(filters?: {
    limit?: number;
    page?: number;
    distribuidor_id?: number;
    status?: string;
    data_pedido__maior_igual?: string;
    data_pedido__menor_igual?: string;
  }): Promise<SolicitacaoSaque[]> {
    const response = await this.client.getWithFilters<SolicitacaoSaque[]>('/v1/solicitacoes-saque', filters || {});
    return response.data;
  }

  /**
   * Cria nova solicitação de saque
   */
  async createSolicitacaoSaque(saque: Partial<SolicitacaoSaque>): Promise<SolicitacaoSaque> {
    const response = await this.client.post<SolicitacaoSaque>('/v1/solicitacoes-saque', saque);
    return response.data;
  }

  /**
   * Confirma solicitação de saque
   */
  async confirmarSaque(saqueId: number): Promise<void> {
    await this.client.post('/v1/solicitacoes-saque/Confirmar', { id: saqueId });
  }

  /**
   * Estorna solicitação de saque
   */
  async estornarSaque(saqueId: number): Promise<void> {
    await this.client.post('/v1/solicitacoes-saque/Estornar', { id: saqueId });
  }

  /**
   * Reverte solicitação de saque
   */
  async reverterSaque(saqueId: number): Promise<void> {
    await this.client.post('/v1/solicitacoes-saque/Reverter', { id: saqueId });
  }

  /**
   * Lista solicitações de saque de CDs
   */
  async listSolicitacoesSaqueCD(filters?: {
    limit?: number;
    page?: number;
    cd_id?: number;
    status?: string;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/solicitacoes-saque-cd', filters || {});
    return response.data;
  }

  /**
   * Confirma solicitação de saque de CD
   */
  async confirmarSaqueCD(saqueId: number): Promise<void> {
    await this.client.post('/v1/solicitacoes-saque-cd/Confirmar', { id: saqueId });
  }

  /**
   * Estorna solicitação de saque de CD
   */
  async estornarSaqueCD(saqueId: number): Promise<void> {
    await this.client.post('/v1/solicitacoes-saque-cd/Estornar', { id: saqueId });
  }

  /**
   * Reverte solicitação de saque de CD
   */
  async reverterSaqueCD(saqueId: number): Promise<void> {
    await this.client.post('/v1/solicitacoes-saque-cd/Reverter', { id: saqueId });
  }
}
