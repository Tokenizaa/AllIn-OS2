// ============================================================================
// LOGISTICS SERVICE - ALLIN OS 2.0
// Serviço para gestão de logística e transporte
// ============================================================================

import { ApiClient } from '../client';
import { Transportadora } from '../types';

export class LogisticsService {
  constructor(private client: ApiClient) {}

  /**
   * Calcula formas de frete disponíveis
   */
  async calcularFormasFrete(dadosFrete: {
    cep_origem: string;
    cep_destino: string;
    valor_pedido: number;
    peso: number;
    volume?: number;
  }): Promise<any[]> {
    const response = await this.client.post<any[]>('/v1/formas-frete', dadosFrete);
    return response.data;
  }

  /**
   * Lista transportadoras cadastradas
   */
  async listTransportadoras(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
    situacao?: number;
  }): Promise<Transportadora[]> {
    const response = await this.client.getWithFilters<Transportadora[]>('/v1/transportadoras', filters || {});
    return response.data;
  }
}
