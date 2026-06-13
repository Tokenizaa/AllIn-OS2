/**
 * Carrier Service
 * 
 * Service responsável pela gestão de transportadoras.
 */

import { supabase } from "../../../shared/infrastructure/supabase/client";

export interface Carrier {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  baseRate: number;
  ratePerKg: number;
  ratePerKm: number;
  freeShippingThreshold: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  apiUrl?: string;
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCarrierDTO {
  name: string;
  code: string;
  baseRate: number;
  ratePerKg: number;
  ratePerKm: number;
  freeShippingThreshold: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  apiUrl?: string;
  apiKey?: string;
}

export interface UpdateCarrierDTO {
  name?: string;
  code?: string;
  isActive?: boolean;
  baseRate?: number;
  ratePerKg?: number;
  ratePerKm?: number;
  freeShippingThreshold?: number;
  minDeliveryTime?: number;
  maxDeliveryTime?: number;
  apiUrl?: string;
  apiKey?: string;
}

export class CarrierService {
  private static instance: CarrierService;

  private constructor() {}

  static getInstance(): CarrierService {
    if (!CarrierService.instance) {
      CarrierService.instance = new CarrierService();
    }
    return CarrierService.instance;
  }

  /**
   * Cria nova transportadora
   * 
   * @param dto Dados da transportadora
   * @returns Transportadora criada
   */
  async createCarrier(dto: CreateCarrierDTO): Promise<Carrier> {
    try {
      const { data, error } = await supabase
        .from('logistics_carriers')
        .insert({
          name: dto.name,
          code: dto.code,
          is_active: true,
          base_rate: dto.baseRate,
          rate_per_kg: dto.ratePerKg,
          rate_per_km: dto.ratePerKm,
          free_shipping_threshold: dto.freeShippingThreshold,
          min_delivery_time: dto.minDeliveryTime,
          max_delivery_time: dto.maxDeliveryTime,
          api_url: dto.apiUrl,
          api_key: dto.apiKey,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create carrier');

      return this.mapToCarrier(data);
    } catch (error) {
      console.error('Error creating carrier:', error);
      throw error;
    }
  }

  /**
   * Busca transportadora por ID
   * 
   * @param id ID da transportadora
   * @returns Transportadora ou null
   */
  async getCarrierById(id: string): Promise<Carrier | null> {
    try {
      const { data, error } = await supabase
        .from('logistics_carriers')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapToCarrier(data);
    } catch (error) {
      console.error('Error getting carrier:', error);
      throw error;
    }
  }

  /**
   * Busca transportadora por código
   * 
   * @param code Código da transportadora
   * @returns Transportadora ou null
   */
  async getCarrierByCode(code: string): Promise<Carrier | null> {
    try {
      const { data, error } = await supabase
        .from('logistics_carriers')
        .select()
        .eq('code', code)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapToCarrier(data);
    } catch (error) {
      console.error('Error getting carrier by code:', error);
      throw error;
    }
  }

  /**
   * Busca todas as transportadoras
   * 
   * @param activeOnly Buscar apenas ativas
   * @returns Lista de transportadoras
   */
  async getAllCarriers(activeOnly: boolean = true): Promise<Carrier[]> {
    try {
      let query = supabase
        .from('logistics_carriers')
        .select()
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return [];

      return data.map(item => this.mapToCarrier(item));
    } catch (error) {
      console.error('Error getting carriers:', error);
      throw error;
    }
  }

  /**
   * Atualiza transportadora
   * 
   * @param id ID da transportadora
   * @param dto Dados para atualização
   * @returns Transportadora atualizada
   */
  async updateCarrier(id: string, dto: UpdateCarrierDTO): Promise<Carrier> {
    try {
      const updateData: any = {};

      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.code !== undefined) updateData.code = dto.code;
      if (dto.isActive !== undefined) updateData.is_active = dto.isActive;
      if (dto.baseRate !== undefined) updateData.base_rate = dto.baseRate;
      if (dto.ratePerKg !== undefined) updateData.rate_per_kg = dto.ratePerKg;
      if (dto.ratePerKm !== undefined) updateData.rate_per_km = dto.ratePerKm;
      if (dto.freeShippingThreshold !== undefined) updateData.free_shipping_threshold = dto.freeShippingThreshold;
      if (dto.minDeliveryTime !== undefined) updateData.min_delivery_time = dto.minDeliveryTime;
      if (dto.maxDeliveryTime !== undefined) updateData.max_delivery_time = dto.maxDeliveryTime;
      if (dto.apiUrl !== undefined) updateData.api_url = dto.apiUrl;
      if (dto.apiKey !== undefined) updateData.api_key = dto.apiKey;

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('logistics_carriers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update carrier');

      return this.mapToCarrier(data);
    } catch (error) {
      console.error('Error updating carrier:', error);
      throw error;
    }
  }

  /**
   * Ativa transportadora
   * 
   * @param id ID da transportadora
   * @returns true se ativou com sucesso
   */
  async activateCarrier(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('logistics_carriers')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error activating carrier:', error);
      throw error;
    }
  }

  /**
   * Desativa transportadora
   * 
   * @param id ID da transportadora
   * @returns true se desativou com sucesso
   */
  async deactivateCarrier(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('logistics_carriers')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deactivating carrier:', error);
      throw error;
    }
  }

  /**
   * Remove transportadora
   * 
   * @param id ID da transportadora
   * @returns true se removeu com sucesso
   */
  async deleteCarrier(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('logistics_carriers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting carrier:', error);
      throw error;
    }
  }

  /**
   * Mapeia dados do database para entidade Carrier
   * 
   * @param data Dados do database
   * @returns Entidade Carrier
   */
  private mapToCarrier(data: any): Carrier {
    return {
      id: data.id,
      name: data.name,
      code: data.code,
      isActive: data.is_active,
      baseRate: data.base_rate,
      ratePerKg: data.rate_per_kg,
      ratePerKm: data.rate_per_km,
      freeShippingThreshold: data.free_shipping_threshold,
      minDeliveryTime: data.min_delivery_time,
      maxDeliveryTime: data.max_delivery_time,
      apiUrl: data.api_url,
      apiKey: data.api_key,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
