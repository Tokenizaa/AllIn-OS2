/**
 * Custom Field Service
 * 
 * Service para gerenciar campos personalizados para pedidos.
 */

import { CustomFieldRepository, CustomFieldValueRepository } from '../repositories/custom-field.repository';
import {
  CustomField,
  CreateCustomFieldDTO,
  UpdateCustomFieldDTO,
  CustomFieldResponseDTO,
  CustomFieldValue,
  CreateCustomFieldValueDTO,
  UpdateCustomFieldValueDTO,
} from '../dto/custom-fields.dto';

export class CustomFieldService {
  private fieldRepository: CustomFieldRepository;
  private valueRepository: CustomFieldValueRepository;

  constructor() {
    this.fieldRepository = new CustomFieldRepository();
    this.valueRepository = new CustomFieldValueRepository();
  }

  /**
   * Cria novo campo personalizado
   */
  async createField(dto: CreateCustomFieldDTO): Promise<CustomField> {
    // Verifica se a key já existe
    const existingByKey = await this.fieldRepository.findByKey(dto.key);
    if (existingByKey.length > 0) {
      throw new Error('Key already in use');
    }

    return this.fieldRepository.create({
      ...dto,
      required: dto.required ?? false,
      order: dto.order ?? 0,
      active: dto.active ?? true,
    });
  }

  /**
   * Busca campo por ID
   */
  async findFieldById(id: string): Promise<CustomField | null> {
    return this.fieldRepository.findById(id);
  }

  /**
   * Busca campo por key
   */
  async findFieldByKey(key: string): Promise<CustomField | null> {
    const fields = await this.fieldRepository.findByKey(key);
    return fields[0] || null;
  }

  /**
   * Busca todos os campos
   */
  async findAllFields(activeOnly: boolean = true): Promise<CustomField[]> {
    if (activeOnly) {
      return this.fieldRepository.findActive();
    }
    return this.fieldRepository.findAll();
  }

  /**
   * Atualiza campo
   */
  async updateField(id: string, dto: UpdateCustomFieldDTO): Promise<CustomField> {
    const existing = await this.fieldRepository.findById(id);
    if (!existing) {
      throw new Error('Custom field not found');
    }

    // Verifica se a nova key já existe (se estiver sendo alterado)
    if (dto.key && dto.key !== existing.key) {
      const existingByKey = await this.fieldRepository.findByKey(dto.key);
      if (existingByKey.length > 0) {
        throw new Error('Key already in use');
      }
    }

    return this.fieldRepository.update(id, dto);
  }

  /**
   * Deleta campo
   */
  async deleteField(id: string): Promise<void> {
    const existing = await this.fieldRepository.findById(id);
    if (!existing) {
      throw new Error('Custom field not found');
    }

    await this.fieldRepository.delete(id);
  }

  /**
   * Ativa campo
   */
  async activateField(id: string): Promise<CustomField> {
    return this.fieldRepository.activate(id);
  }

  /**
   * Desativa campo
   */
  async deactivateField(id: string): Promise<CustomField> {
    return this.fieldRepository.deactivate(id);
  }

  /**
   * Cria valor de campo personalizado
   */
  async createValue(dto: CreateCustomFieldValueDTO): Promise<CustomFieldValue> {
    return this.valueRepository.create(dto);
  }

  /**
   * Atualiza valor de campo personalizado
   */
  async updateValue(id: string, dto: UpdateCustomFieldValueDTO): Promise<CustomFieldValue> {
    return this.valueRepository.update(id, dto);
  }

  /**
   * Busca valores por pedido
   */
  async findValuesByOrderId(orderId: string): Promise<CustomFieldValue[]> {
    return this.valueRepository.findByOrderId(orderId);
  }

  /**
   * Busca valores por campo
   */
  async findValuesByCustomFieldId(customFieldId: string): Promise<CustomFieldValue[]> {
    return this.valueRepository.findByCustomFieldId(customFieldId);
  }

  /**
   * Cria ou atualiza valor
   */
  async upsertValue(orderId: string, customFieldId: string, value: string): Promise<CustomFieldValue> {
    return this.valueRepository.upsert(orderId, customFieldId, value);
  }

  /**
   * Busca campos com valores para um pedido
   */
  async findFieldsWithValues(orderId: string): Promise<Array<CustomField & { value?: string }>> {
    const fields = await this.fieldRepository.findActive();
    const values = await this.valueRepository.findByOrderId(orderId);

    return fields.map(field => {
      const value = values.find(v => v.custom_field_id === field.id);
      return {
        ...field,
        value: value?.value,
      };
    });
  }

  /**
   * Converte para DTO de resposta
   */
  toResponseDTO(field: CustomField): CustomFieldResponseDTO {
    return {
      id: field.id,
      name: field.name,
      key: field.key,
      type: field.type,
      options: field.options,
      required: field.required,
      placeholder: field.placeholder,
      default_value: field.default_value,
      validation: field.validation,
      order: field.order,
      active: field.active,
      created_at: field.created_at,
      updated_at: field.updated_at,
    };
  }
}
