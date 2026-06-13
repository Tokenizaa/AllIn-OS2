// ============================================================================
// CRM SERVICE - ALLIN OS 2.0
// Serviço para gestão de relacionamento com clientes
// ============================================================================

import { ApiClient } from '../client';
import { Cliente, TipoPessoa } from '../types';

export class CRMService {
  constructor(private client: ApiClient) {}

  /**
   * Lista clientes
   */
  async listClientes(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
    email__contem?: string;
    cpf__contem?: string;
    ativo?: boolean;
  }): Promise<Cliente[]> {
    const response = await this.client.getWithFilters<Cliente[]>('/v1/clientes', filters || {});
    return response.data;
  }

  /**
   * Cria novo cliente
   */
  async createCliente(cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await this.client.post<Cliente>('/v1/clientes', cliente);
    return response.data;
  }

  /**
   * Atualiza senha do cliente
   */
  async updateSenha(clienteId: number, novaSenha: string): Promise<void> {
    await this.client.post('/v1/clientes/AtualizarSenha', {
      id: clienteId,
      senha: novaSenha,
    });
  }

  /**
   * Lista contas do cliente
   */
  async listContasCliente(clienteId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/clientes/Contas?id=${clienteId}`);
    return response.data;
  }

  /**
   * Cria conta para cliente
   */
  async createContaCliente(clienteId: number, conta: any): Promise<any> {
    const response = await this.client.post<any>('/v1/clientes/Contas', {
      cliente_id: clienteId,
      ...conta,
    });
    return response.data;
  }

  /**
   * Lista endereços do cliente
   */
  async listEnderecosCliente(clienteId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/clientes/Enderecos?id=${clienteId}`);
    return response.data;
  }

  /**
   * Gera token de login do cliente
   */
  async generateTokenLogin(email: string, senha: string): Promise<any> {
    const response = await this.client.post<any>('/v1/clientes/TokenLogin', {
      email,
      senha,
    });
    return response.data;
  }

  /**
   * Lista tipos de pessoa
   */
  async listTiposPessoa(filters?: {
    limit?: number;
    page?: number;
    ativo?: boolean;
  }): Promise<TipoPessoa[]> {
    const response = await this.client.getWithFilters<TipoPessoa[]>('/v1/tipos-pessoa', filters || {});
    return response.data;
  }
}
