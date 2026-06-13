// ============================================================================
// LOCATION SERVICE - ALLIN OS 2.0
// Serviço para gerenciamento de dados geográficos e localização
// ============================================================================

import { ApiClient } from '../client';
import { CEP, Cidade, Estado, EstadoCivil, Pais } from '../types';

export class LocationService {
  constructor(private client: ApiClient) {}

  /**
   * Busca endereço pelo CEP
   */
  async getCEP(id: number): Promise<CEP> {
    const response = await this.client.get<CEP>(`/v1/cep/${id}`);
    return response.data;
  }

  /**
   * Lista cidades cadastradas
   */
  async listCidades(filters?: {
    limit?: number;
    page?: number;
    uf_id?: number;
    pais_id?: number;
    nome__contem?: string;
  }): Promise<Cidade[]> {
    const response = await this.client.getWithFilters<Cidade[]>('/v1/cidades', filters || {});
    return response.data;
  }

  /**
   * Lista estados
   */
  async listEstados(filters?: {
    limit?: number;
    page?: number;
    pais_id?: number;
  }): Promise<Estado[]> {
    const response = await this.client.getWithFilters<Estado[]>('/v1/estados', filters || {});
    return response.data;
  }

  /**
   * Lista tipos de estado civil
   */
  async listEstadosCivil(filters?: {
    limit?: number;
    page?: number;
  }): Promise<EstadoCivil[]> {
    const response = await this.client.getWithFilters<EstadoCivil[]>('/v1/estados-civil', filters || {});
    return response.data;
  }

  /**
   * Lista países
   */
  async listPaises(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
  }): Promise<Pais[]> {
    const response = await this.client.getWithFilters<Pais[]>('/v1/paises', filters || {});
    return response.data;
  }

  /**
   * Cria novo estado
   */
  async createEstado(estado: Partial<Estado>): Promise<Estado> {
    const response = await this.client.post<Estado>('/v1/estados', estado);
    return response.data;
  }

  /**
   * Cria novo país
   */
  async createPais(pais: Partial<Pais>): Promise<Pais> {
    const response = await this.client.post<Pais>('/v1/paises', pais);
    return response.data;
  }
}
