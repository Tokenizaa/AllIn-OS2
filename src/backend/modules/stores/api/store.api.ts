/**
 * Store API
 * 
 * API endpoints para lojas virtuais.
 */

import { StoreService } from '../services/store.service';
import { Request, Response } from 'express';

export class StoreAPI {
  private service: StoreService;

  constructor() {
    this.service = new StoreService();
  }

  /**
   * POST /api/stores
   * Cria nova loja
   */
  async createStore(req: Request, res: Response): Promise<void> {
    try {
      const store = await this.service.create(req.body);
      res.json(store);
    } catch (error) {
      console.error('Error creating store:', error);
      res.status(500).json({ error: 'Failed to create store' });
    }
  }

  /**
   * GET /api/stores/:id
   * Busca loja por ID
   */
  async getStoreById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const store = await this.service.findById(id);
      if (!store) {
        res.status(404).json({ error: 'Store not found' });
        return;
      }
      res.json(store);
    } catch (error) {
      console.error('Error fetching store:', error);
      res.status(500).json({ error: 'Failed to fetch store' });
    }
  }

  /**
   * GET /api/stores/slug/:slug
   * Busca loja por slug
   */
  async getStoreBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const store = await this.service.findBySlug(slug);
      if (!store) {
        res.status(404).json({ error: 'Store not found' });
        return;
      }
      res.json(store);
    } catch (error) {
      console.error('Error fetching store by slug:', error);
      res.status(500).json({ error: 'Failed to fetch store by slug' });
    }
  }

  /**
   * GET /api/stores/store-id/:storeId
   * Busca loja por store_id
   */
  async getStoreByStoreId(req: Request, res: Response): Promise<void> {
    try {
      const { storeId } = req.params;
      const store = await this.service.findByStoreId(parseInt(storeId));
      if (!store) {
        res.status(404).json({ error: 'Store not found' });
        return;
      }
      res.json(store);
    } catch (error) {
      console.error('Error fetching store by store_id:', error);
      res.status(500).json({ error: 'Failed to fetch store by store_id' });
    }
  }

  /**
   * GET /api/stores
   * Busca todas as lojas
   */
  async getAllStores(req: Request, res: Response): Promise<void> {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const stores = await this.service.findAll(activeOnly);
      res.json(stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      res.status(500).json({ error: 'Failed to fetch stores' });
    }
  }

  /**
   * PUT /api/stores/:id
   * Atualiza loja
   */
  async updateStore(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const store = await this.service.update(id, req.body);
      res.json(store);
    } catch (error) {
      console.error('Error updating store:', error);
      res.status(500).json({ error: 'Failed to update store' });
    }
  }

  /**
   * DELETE /api/stores/:id
   * Deleta loja
   */
  async deleteStore(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting store:', error);
      res.status(500).json({ error: 'Failed to delete store' });
    }
  }

  /**
   * POST /api/stores/:id/activate
   * Ativa loja
   */
  async activateStore(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const store = await this.service.activate(id);
      res.json(store);
    } catch (error) {
      console.error('Error activating store:', error);
      res.status(500).json({ error: 'Failed to activate store' });
    }
  }

  /**
   * POST /api/stores/:id/deactivate
   * Desativa loja
   */
  async deactivateStore(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const store = await this.service.deactivate(id);
      res.json(store);
    } catch (error) {
      console.error('Error deactivating store:', error);
      res.status(500).json({ error: 'Failed to deactivate store' });
    }
  }

  /**
   * GET /api/stores/stats
   * Busca estatísticas
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.service.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching store stats:', error);
      res.status(500).json({ error: 'Failed to fetch store stats' });
    }
  }
}
