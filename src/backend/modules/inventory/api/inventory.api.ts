/**
 * Inventory API
 * 
 * API endpoints para estoque.
 */

import { InventoryService } from '../services/inventory.service';
import { Request, Response } from 'express';

export class InventoryAPI {
  private service: InventoryService;

  constructor() {
    this.service = new InventoryService();
  }

  /**
   * POST /api/inventory/movements
   * Cria movimentação de estoque
   */
  async createMovement(req: Request, res: Response): Promise<void> {
    try {
      const movement = await this.service.createMovement(req.body);
      res.json(movement);
    } catch (error) {
      console.error('Error creating inventory movement:', error);
      res.status(500).json({ error: 'Failed to create inventory movement' });
    }
  }

  /**
   * GET /api/inventory/movements/product/:productId
   * Busca movimentações por produto
   */
  async getMovementsByProductId(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const movements = await this.service.getMovementsByProductId(productId);
      res.json(movements);
    } catch (error) {
      console.error('Error fetching movements by product:', error);
      res.status(500).json({ error: 'Failed to fetch movements' });
    }
  }

  /**
   * GET /api/inventory/movements/type/:type
   * Busca movimentações por tipo
   */
  async getMovementsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const movements = await this.service.getMovementsByType(type);
      res.json(movements);
    } catch (error) {
      console.error('Error fetching movements by type:', error);
      res.status(500).json({ error: 'Failed to fetch movements' });
    }
  }

  /**
   * GET /api/inventory/movements/recent
   * Busca movimentações recentes
   */
  async getRecentMovements(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const movements = await this.service.getRecentMovements(limit);
      res.json(movements);
    } catch (error) {
      console.error('Error fetching recent movements:', error);
      res.status(500).json({ error: 'Failed to fetch recent movements' });
    }
  }

  /**
   * GET /api/inventory/summary
   * Busca resumo de estoque
   */
  async getInventorySummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await this.service.getInventorySummary();
      res.json(summary);
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      res.status(500).json({ error: 'Failed to fetch inventory summary' });
    }
  }

  /**
   * GET /api/inventory/product/:productId
   * Busca estoque de um produto
   */
  async getProductInventory(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const inventory = await this.service.getProductInventory(productId);
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching product inventory:', error);
      res.status(500).json({ error: 'Failed to fetch product inventory' });
    }
  }

  /**
   * GET /api/inventory/alerts
   * Busca alertas ativos
   */
  async getActiveAlerts(req: Request, res: Response): Promise<void> {
    try {
      const alerts = await this.service.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      res.status(500).json({ error: 'Failed to fetch active alerts' });
    }
  }

  /**
   * POST /api/inventory/alerts/:alertId/resolve
   * Resolve alerta
   */
  async resolveAlert(req: Request, res: Response): Promise<void> {
    try {
      const { alertId } = req.params;
      const alert = await this.service.resolveAlert(alertId);
      res.json(alert);
    } catch (error) {
      console.error('Error resolving alert:', error);
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  }

  /**
   * POST /api/inventory/check-alerts
   * Verifica e cria alertas automaticamente
   */
  async checkAndCreateAlerts(req: Request, res: Response): Promise<void> {
    try {
      const alerts = await this.service.checkAndCreateAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Error checking and creating alerts:', error);
      res.status(500).json({ error: 'Failed to check and create alerts' });
    }
  }

  /**
   * POST /api/inventory/adjust-stock
   * Ajusta estoque manualmente
   */
  async adjustStock(req: Request, res: Response): Promise<void> {
    try {
      const { productId, newQuantity, reason, userId, userName } = req.body;
      const movement = await this.service.adjustStock(
        productId,
        newQuantity,
        reason,
        userId,
        userName
      );
      res.json(movement);
    } catch (error) {
      console.error('Error adjusting stock:', error);
      res.status(500).json({ error: 'Failed to adjust stock' });
    }
  }

  /**
   * POST /api/inventory/add-stock
   * Adiciona estoque
   */
  async addStock(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity, reason, userId, userName, referenceId, referenceType } = req.body;
      const movement = await this.service.addStock(
        productId,
        quantity,
        reason,
        userId,
        userName,
        referenceId,
        referenceType
      );
      res.json(movement);
    } catch (error) {
      console.error('Error adding stock:', error);
      res.status(500).json({ error: 'Failed to add stock' });
    }
  }

  /**
   * POST /api/inventory/remove-stock
   * Remove estoque
   */
  async removeStock(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity, reason, userId, userName, referenceId, referenceType } = req.body;
      const movement = await this.service.removeStock(
        productId,
        quantity,
        reason,
        userId,
        userName,
        referenceId,
        referenceType
      );
      res.json(movement);
    } catch (error) {
      console.error('Error removing stock:', error);
      res.status(500).json({ error: 'Failed to remove stock' });
    }
  }
}
