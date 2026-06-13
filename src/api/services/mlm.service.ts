// ============================================================================
// MLM SERVICE - ALLIN OS 2.0
// Serviço para gestão de rede Multi-Level Marketing
// ============================================================================

import { ApiClient } from '../client';
import { Distribuidor, RedeLinearNo, Simulacao } from '../types';

export class MLMService {
  constructor(private client: ApiClient) {}

  /**
   * Lista distribuidores
   */
  async listDistribuidores(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
    usuario__contem?: string;
    ativo?: boolean;
  }): Promise<Distribuidor[]> {
    const response = await this.client.getWithFilters<Distribuidor[]>('/v1/distribuidores', filters || {});
    return response.data;
  }

  /**
   * Lista ativações mensais do distribuidor
   */
  async listAtivacoesMensais(distribuidorId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/distribuidores/AtivacoesMensais?id=${distribuidorId}`);
    return response.data;
  }

  /**
   * Retorna plano atual do distribuidor
   */
  async getPlanoAtual(distribuidorId: number): Promise<any> {
    const response = await this.client.get<any>(`/v1/distribuidores/PlanoAtual?id=${distribuidorId}`);
    return response.data;
  }

  /**
   * Retorna qualificação atual do distribuidor
   */
  async getQualificacaoAtual(distribuidorId: number): Promise<any> {
    const response = await this.client.get<any>(`/v1/distribuidores/QualificacaoAtual?id=${distribuidorId}`);
    return response.data;
  }

  /**
   * Lista telefones do distribuidor
   */
  async listTelefones(distribuidorId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/distribuidores/Telefones?id=${distribuidorId}`);
    return response.data;
  }

  /**
   * Lista posições na rede linear
   */
  async listRedeLinearNos(filters?: {
    limit?: number;
    page?: number;
    linha?: number;
    id_distribuidor?: number;
  }): Promise<RedeLinearNo[]> {
    const response = await this.client.getWithFilters<RedeLinearNo[]>('/v1/rede-linear-nos', filters || {});
    return response.data;
  }

  /**
   * Lista downlines na rede linear
   */
  async listRedeLinearDownlines(distribuidorId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/rede-linear-nos/Downlines?id=${distribuidorId}`);
    return response.data;
  }

  /**
   * Lista uplines na rede linear
   */
  async listRedeLinearUplines(distribuidorId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/rede-linear-nos/Uplines?id=${distribuidorId}`);
    return response.data;
  }

  /**
   * Lista simulações de comissão
   */
  async listSimulacoes(filters?: {
    limit?: number;
    page?: number;
    distribuidor_id?: number;
    status?: string;
  }): Promise<Simulacao[]> {
    const response = await this.client.getWithFilters<Simulacao[]>('/v1/simulacao', filters || {});
    return response.data;
  }

  /**
   * Cria nova simulação
   */
  async createSimulacao(simulacao: Partial<Simulacao>): Promise<Simulacao> {
    const response = await this.client.post<Simulacao>('/v1/simulacao', simulacao);
    return response.data;
  }

  /**
   * Cancela simulação
   */
  async cancelSimulacao(simulacaoId: number): Promise<void> {
    await this.client.post('/v1/simulacao/Cancelar', { id: simulacaoId });
  }

  /**
   * Executa simulação
   */
  async executeSimulacao(simulacaoId: number): Promise<any> {
    const response = await this.client.post<any>('/v1/simulacao/Executar', { id: simulacaoId });
    return response.data;
  }

  /**
   * Lista informações de execução da simulação
   */
  async getInformacoesExecucao(simulacaoId: number): Promise<any> {
    const response = await this.client.get<any>(`/v1/simulacao/InformacoesExecucao?id=${simulacaoId}`);
    return response.data;
  }

  /**
   * Retorna bônus e faturamento por mês
   */
  async getSimulacaoBonusFaturamento(filters?: {
    limit?: number;
    page?: number;
    mes?: number;
    ano?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/simulacao-bonus-faturamento', filters || {});
    return response.data;
  }

  /**
   * Lista planos ativos no sistema
   */
  async listSimulacaoPlanos(filters?: {
    limit?: number;
    page?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/simulacao-planos', filters || {});
    return response.data;
  }
}
