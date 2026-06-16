/**
 * Carrier Repository
 * 
 * Repository para operações de database relacionadas a transportadoras.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface Carrier extends BaseEntity {
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  website?: string;
  contact_person?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  tracking_url?: string;
  api_key?: string;
  api_endpoint?: string;
  active: boolean;
  delivery_time_days?: number;
  minimum_weight?: number;
  maximum_weight?: number;
  notes?: string;
}

export class CarrierRepository extends BaseRepository<Carrier> {
  constructor() {
    super('transportadoras', 'logistics');
  }

  /**
   * Busca transportadoras ativas
   */
  async findActive(): Promise<Carrier[]> {
    return this.findAll({
      filters: { active: true },
    });
  }

  /**
   * Busca transportadoras inativas
   */
  async findInactive(): Promise<Carrier[]> {
    return this.findAll({
      filters: { active: false },
    });
  }

  /**
   * Busca por nome
   */
  async findByName(name: string): Promise<Carrier[]> {
    return this.findAll({
      filters: { name },
    });
  }

  /**
   * Busca por CNPJ
   */
  async findByCNPJ(cnpj: string): Promise<Carrier[]> {
    return this.findAll({
      filters: { cnpj },
    });
  }

  /**
   * Ativa transportadora
   */
  async activate(id: string): Promise<Carrier> {
    return this.update(id, { active: true });
  }

  /**
   * Desativa transportadora
   */
  async deactivate(id: string): Promise<Carrier> {
    return this.update(id, { active: false });
  }

  /**
   * Busca estatísticas
   */
  async getStats(): Promise<{
    total_carriers: number;
    active_carriers: number;
    inactive_carriers: number;
    average_delivery_time: number;
  }> {
    const [allCarriers, activeCarriers, inactiveCarriers] = await Promise.all([
      this.findAll(),
      this.findActive(),
      this.findInactive(),
    ]);

    const totalDeliveryTime = activeCarriers.reduce(
      (sum, carrier) => sum + (carrier.delivery_time_days || 0),
      0
    );
    const averageDeliveryTime = activeCarriers.length > 0 
      ? totalDeliveryTime / activeCarriers.length 
      : 0;

    return {
      total_carriers: allCarriers.length,
      active_carriers: activeCarriers.length,
      inactive_carriers: inactiveCarriers.length,
      average_delivery_time: averageDeliveryTime,
    };
  }
}
