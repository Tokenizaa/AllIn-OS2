/**
 * Custom Field API
 * 
 * API endpoints para campos personalizados de pedidos.
 */

import { CustomFieldService } from '../services/custom-field.service';
import { Request, Response } from 'express';

export class CustomFieldAPI {
  private service: CustomFieldService;

  constructor() {
    this.service = new CustomFieldService();
  }

  /**
   * POST /api/orders/custom-fields
   * Cria novo campo personalizado
   */
  async createField(req: Request, res: Response): Promise<void> {
    try {
      const field = await this.service.createField(req.body);
      res.json(field);
    } catch (error) {
      console.error('Error creating custom field:', error);
      res.status(500).json({ error: 'Failed to create custom field' });
    }
  }

  /**
   * GET /api/orders/custom-fields/:id
   * Busca campo por ID
   */
  async getFieldById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const field = await this.service.findFieldById(idValue);
      if (!field) {
        res.status(404).json({ error: 'Custom field not found' });
        return;
      }
      res.json(field);
    } catch (error) {
      console.error('Error fetching custom field:', error);
      res.status(500).json({ error: 'Failed to fetch custom field' });
    }
  }

  /**
   * GET /api/orders/custom-fields/key/:key
   * Busca campo por key
   */
  async getFieldByKey(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const keyValue = Array.isArray(key) ? key[0] : key;
      const field = await this.service.findFieldByKey(keyValue);
      if (!field) {
        res.status(404).json({ error: 'Custom field not found' });
        return;
      }
      res.json(field);
    } catch (error) {
      console.error('Error fetching custom field by key:', error);
      res.status(500).json({ error: 'Failed to fetch custom field by key' });
    }
  }

  /**
   * GET /api/orders/custom-fields
   * Busca todos os campos
   */
  async getAllFields(req: Request, res: Response): Promise<void> {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const fields = await this.service.findAllFields(activeOnly);
      res.json(fields);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      res.status(500).json({ error: 'Failed to fetch custom fields' });
    }
  }

  /**
   * PUT /api/orders/custom-fields/:id
   * Atualiza campo
   */
  async updateField(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const field = await this.service.updateField(idValue, req.body);
      res.json(field);
    } catch (error) {
      console.error('Error updating custom field:', error);
      res.status(500).json({ error: 'Failed to update custom field' });
    }
  }

  /**
   * DELETE /api/orders/custom-fields/:id
   * Deleta campo
   */
  async deleteField(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      await this.service.deleteField(idValue);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting custom field:', error);
      res.status(500).json({ error: 'Failed to delete custom field' });
    }
  }

  /**
   * POST /api/orders/custom-fields/:id/activate
   * Ativa campo
   */
  async activateField(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const field = await this.service.activateField(idValue);
      res.json(field);
    } catch (error) {
      console.error('Error activating custom field:', error);
      res.status(500).json({ error: 'Failed to activate custom field' });
    }
  }

  /**
   * POST /api/orders/custom-fields/:id/deactivate
   * Desativa campo
   */
  async deactivateField(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const field = await this.service.deactivateField(idValue);
      res.json(field);
    } catch (error) {
      console.error('Error deactivating custom field:', error);
      res.status(500).json({ error: 'Failed to deactivate custom field' });
    }
  }

  /**
   * POST /api/orders/custom-field-values
   * Cria valor de campo personalizado
   */
  async createValue(req: Request, res: Response): Promise<void> {
    try {
      const value = await this.service.createValue(req.body);
      res.json(value);
    } catch (error) {
      console.error('Error creating custom field value:', error);
      res.status(500).json({ error: 'Failed to create custom field value' });
    }
  }

  /**
   * PUT /api/orders/custom-field-values/:id
   * Atualiza valor de campo personalizado
   */
  async updateValue(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const value = await this.service.updateValue(idValue, req.body);
      res.json(value);
    } catch (error) {
      console.error('Error updating custom field value:', error);
      res.status(500).json({ error: 'Failed to update custom field value' });
    }
  }

  /**
   * GET /api/orders/custom-field-values/order/:orderId
   * Busca valores por pedido
   */
  async getValuesByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const orderIdValue = Array.isArray(orderId) ? orderId[0] : orderId;
      const values = await this.service.findValuesByOrderId(orderIdValue);
      res.json(values);
    } catch (error) {
      console.error('Error fetching custom field values:', error);
      res.status(500).json({ error: 'Failed to fetch custom field values' });
    }
  }

  /**
   * GET /api/orders/custom-field-values/field/:customFieldId
   * Busca valores por campo
   */
  async getValuesByCustomFieldId(req: Request, res: Response): Promise<void> {
    try {
      const { customFieldId } = req.params;
      const customFieldIdValue = Array.isArray(customFieldId) ? customFieldId[0] : customFieldId;
      const values = await this.service.findValuesByCustomFieldId(customFieldIdValue);
      res.json(values);
    } catch (error) {
      console.error('Error fetching custom field values by field:', error);
      res.status(500).json({ error: 'Failed to fetch custom field values by field' });
    }
  }

  /**
   * POST /api/orders/custom-field-values/upsert
   * Cria ou atualiza valor
   */
  async upsertValue(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, customFieldId, value } = req.body;
      const fieldValue = await this.service.upsertValue(orderId, customFieldId, value);
      res.json(fieldValue);
    } catch (error) {
      console.error('Error upserting custom field value:', error);
      res.status(500).json({ error: 'Failed to upsert custom field value' });
    }
  }

  /**
   * GET /api/orders/custom-fields/with-values/:orderId
   * Busca campos com valores para um pedido
   */
  async getFieldsWithValues(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const orderIdValue = Array.isArray(orderId) ? orderId[0] : orderId;
      const fields = await this.service.findFieldsWithValues(orderIdValue);
      res.json(fields);
    } catch (error) {
      console.error('Error fetching fields with values:', error);
      res.status(500).json({ error: 'Failed to fetch fields with values' });
    }
  }
}
