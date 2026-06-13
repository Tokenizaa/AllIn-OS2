/**
 * Custom Field Repository
 * 
 * Repository para operações de database relacionadas a campos personalizados para pedidos.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface CustomField extends BaseEntity {
  name: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  required: boolean;
  placeholder?: string;
  default_value?: string;
  validation?: {
    min_length?: number;
    max_length?: number;
    pattern?: string;
    min_value?: number;
    max_value?: number;
  };
  order: number;
  active: boolean;
}

export class CustomFieldRepository extends BaseRepository<CustomField> {
  constructor() {
    super('custom_fields', 'commerce');
  }

  /**
   * Busca campos ativos
   */
  async findActive(): Promise<CustomField[]> {
    return this.findAll({
      filters: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Busca campos inativos
   */
  async findInactive(): Promise<CustomField[]> {
    return this.findAll({
      filters: { active: false },
    });
  }

  /**
   * Busca por key
   */
  async findByKey(key: string): Promise<CustomField[]> {
    return this.findAll({
      filters: { key },
    });
  }

  /**
   * Busca por tipo
   */
  async findByType(type: string): Promise<CustomField[]> {
    return this.findAll({
      filters: { type },
    });
  }

  /**
   * Ativa campo
   */
  async activate(id: string): Promise<CustomField> {
    return this.update(id, { active: true });
  }

  /**
   * Desativa campo
   */
  async deactivate(id: string): Promise<CustomField> {
    return this.update(id, { active: false });
  }
}

export interface CustomFieldValue extends BaseEntity {
  custom_field_id: string;
  order_id: string;
  value: string;
}

export class CustomFieldValueRepository extends BaseRepository<CustomFieldValue> {
  constructor() {
    super('custom_field_values', 'commerce');
  }

  /**
   * Busca valores por pedido
   */
  async findByOrderId(orderId: string): Promise<CustomFieldValue[]> {
    return this.findAll({
      filters: { order_id: orderId },
    });
  }

  /**
   * Busca valores por campo
   */
  async findByCustomFieldId(customFieldId: string): Promise<CustomFieldValue[]> {
    return this.findAll({
      filters: { custom_field_id: customFieldId },
    });
  }

  /**
   * Busca valor por pedido e campo
   */
  async findByOrderIdAndCustomFieldId(orderId: string, customFieldId: string): Promise<CustomFieldValue[]> {
    return this.findAll({
      filters: { order_id: orderId, custom_field_id: customFieldId },
    });
  }

  /**
   * Cria ou atualiza valor
   */
  async upsert(orderId: string, customFieldId: string, value: string): Promise<CustomFieldValue> {
    const existing = await this.findByOrderIdAndCustomFieldId(orderId, customFieldId);
    
    if (existing.length > 0) {
      return this.update(existing[0].id, { value });
    }
    
    return this.create({
      custom_field_id: customFieldId,
      order_id: orderId,
      value,
    });
  }
}
