/**
 * Store Products API
 * 
 * API endpoints para gerenciar produtos em lojas.
 */

import { StoreProductsService } from '../services/store-products.service';
import { Request, Response } from 'express';

export class StoreProductsAPI {
  private service: StoreProductsService;

  constructor() {
    this.service = new StoreProductsService();
  }

  /**
   * POST /api/admin/store-products/enable
   * Habilita produto em loja
   */
  async enableProductInStore(req: Request, res: Response): Promise<void> {
    try {
      const assignment = await this.service.enableProductInStore(req.body);
      res.json(assignment);
    } catch (error) {
      console.error('Error enabling product in store:', error);
      res.status(500).json({ error: 'Failed to enable product in store' });
    }
  }

  /**
   * POST /api/admin/store-products/disable
   * Desabilita produto em loja
   */
  async disableProductInStore(req: Request, res: Response): Promise<void> {
    try {
      const assignment = await this.service.disableProductInStore(req.body);
      res.json(assignment);
    } catch (error) {
      console.error('Error disabling product in store:', error);
      res.status(500).json({ error: 'Failed to disable product in store' });
    }
  }

  /**
   * GET /api/admin/store-products/product/:productId
   * Busca atribuições por produto
   */
  async getProductAssignments(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const assignments = await this.service.getProductAssignments(productId);
      res.json(assignments);
    } catch (error) {
      console.error('Error fetching product assignments:', error);
      res.status(500).json({ error: 'Failed to fetch product assignments' });
    }
  }

  /**
   * GET /api/admin/store-products/store/:storeId
   * Busca produtos por loja
   */
  async getStoreProducts(req: Request, res: Response): Promise<void> {
    try {
      const { storeId } = req.params;
      const products = await this.service.getStoreProducts(parseInt(storeId));
      res.json(products);
    } catch (error) {
      console.error('Error fetching store products:', error);
      res.status(500).json({ error: 'Failed to fetch store products' });
    }
  }

  /**
   * GET /api/admin/store-products/availability/:productId
   * Busca disponibilidade de produto em lojas
   */
  async getProductStoreAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const availability = await this.service.getProductStoreAvailability(productId);
      res.json(availability);
    } catch (error) {
      console.error('Error fetching product store availability:', error);
      res.status(500).json({ error: 'Failed to fetch product store availability' });
    }
  }

  /**
   * POST /api/admin/store-products/enable-multiple
   * Habilita produto em múltiplas lojas
   */
  async enableProductInMultipleStores(req: Request, res: Response): Promise<void> {
    try {
      const { productId, storeIds, reason, userId, userName } = req.body;
      const assignments = await this.service.enableProductInMultipleStores(
        productId,
        storeIds,
        reason,
        userId,
        userName
      );
      res.json(assignments);
    } catch (error) {
      console.error('Error enabling product in multiple stores:', error);
      res.status(500).json({ error: 'Failed to enable product in multiple stores' });
    }
  }

  /**
   * POST /api/admin/store-products/disable-multiple
   * Desabilita produto em múltiplas lojas
   */
  async disableProductInMultipleStores(req: Request, res: Response): Promise<void> {
    try {
      const { productId, storeIds, reason, userId, userName } = req.body;
      const assignments = await this.service.disableProductInMultipleStores(
        productId,
        storeIds,
        reason,
        userId,
        userName
      );
      res.json(assignments);
    } catch (error) {
      console.error('Error disabling product in multiple stores:', error);
      res.status(500).json({ error: 'Failed to disable product in multiple stores' });
    }
  }

  /**
   * POST /api/admin/store-products/enable-all
   * Habilita produto em todas as lojas
   */
  async enableProductInAllStores(req: Request, res: Response): Promise<void> {
    try {
      const { productId, reason, userId, userName } = req.body;
      const assignments = await this.service.enableProductInAllStores(
        productId,
        reason,
        userId,
        userName
      );
      res.json(assignments);
    } catch (error) {
      console.error('Error enabling product in all stores:', error);
      res.status(500).json({ error: 'Failed to enable product in all stores' });
    }
  }

  /**
   * POST /api/admin/store-products/disable-all
   * Desabilita produto em todas as lojas
   */
  async disableProductInAllStores(req: Request, res: Response): Promise<void> {
    try {
      const { productId, reason, userId, userName } = req.body;
      const assignments = await this.service.disableProductInAllStores(
        productId,
        reason,
        userId,
        userName
      );
      res.json(assignments);
    } catch (error) {
      console.error('Error disabling product in all stores:', error);
      res.status(500).json({ error: 'Failed to disable product in all stores' });
    }
  }
}
