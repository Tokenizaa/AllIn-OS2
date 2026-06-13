// ============================================================================
// SYSTEM SERVICE - ALLIN OS 2.0
// Serviço para gestão do sistema
// ============================================================================

import { ApiClient } from '../client';
import { HealthCheck, Linguagem, Loja } from '../types';

export class SystemService {
  constructor(private client: ApiClient) {}

  /**
   * Verifica status da API
   */
  async ping(): Promise<HealthCheck> {
    const response = await this.client.get<HealthCheck>('/v1/ping');
    return response.data;
  }

  /**
   * Lista extensões ativas na loja virtual
   */
  async listExtensoes(filters?: {
    limit?: number;
    page?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/extensoes', filters || {});
    return response.data;
  }

  /**
   * Lista linguagens/idiomas
   */
  async listLinguagens(filters?: {
    limit?: number;
    page?: number;
    status?: number;
    padrao?: boolean;
  }): Promise<Linguagem[]> {
    const response = await this.client.getWithFilters<Linguagem[]>('/v1/linguagens', filters || {});
    return response.data;
  }
}
