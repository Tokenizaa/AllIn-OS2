/**
 * Admin API
 * 
 * API endpoints para administração.
 */

import { AdminService } from '../services/admin.service';
import { Request, Response } from 'express';

export class AdminAPI {
  private service: AdminService;

  constructor() {
    this.service = new AdminService();
  }

  /**
   * POST /api/admin/change-username
   * Altera username de distribuidor
   */
  async changeUsername(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.changeUsername(req.body);
      res.json(result);
    } catch (error) {
      console.error('Error changing username:', error);
      res.status(500).json({ error: 'Failed to change username' });
    }
  }

  /**
   * POST /api/admin/change-sponsor
   * Altera patrocinador de distribuidor
   */
  async changeSponsor(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.changeSponsor(req.body);
      res.json(result);
    } catch (error) {
      console.error('Error changing sponsor:', error);
      res.status(500).json({ error: 'Failed to change sponsor' });
    }
  }

  /**
   * GET /api/admin/username-history/:distributorId
   * Busca histórico de mudanças de username
   */
  async getUsernameChangeHistory(req: Request, res: Response): Promise<void> {
    try {
      const { distributorId } = req.params;
      const history = await this.service.getUsernameChangeHistory(distributorId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching username change history:', error);
      res.status(500).json({ error: 'Failed to fetch username change history' });
    }
  }

  /**
   * GET /api/admin/sponsor-history/:distributorId
   * Busca histórico de mudanças de patrocinador
   */
  async getSponsorChangeHistory(req: Request, res: Response): Promise<void> {
    try {
      const { distributorId } = req.params;
      const history = await this.service.getSponsorChangeHistory(distributorId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching sponsor change history:', error);
      res.status(500).json({ error: 'Failed to fetch sponsor change history' });
    }
  }

  /**
   * GET /api/admin/actions/recent
   * Busca ações administrativas recentes
   */
  async getRecentAdminActions(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const actions = await this.service.getRecentAdminActions(limit);
      res.json(actions);
    } catch (error) {
      console.error('Error fetching recent admin actions:', error);
      res.status(500).json({ error: 'Failed to fetch recent admin actions' });
    }
  }

  /**
   * GET /api/admin/actions/type/:type
   * Busca ações administrativas por tipo
   */
  async getAdminActionsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const actions = await this.service.getAdminActionsByType(type);
      res.json(actions);
    } catch (error) {
      console.error('Error fetching admin actions by type:', error);
      res.status(500).json({ error: 'Failed to fetch admin actions by type' });
    }
  }

  /**
   * GET /api/admin/actions/user/:userId
   * Busca ações administrativas por usuário
   */
  async getAdminActionsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const actions = await this.service.getAdminActionsByUser(userId);
      res.json(actions);
    } catch (error) {
      console.error('Error fetching admin actions by user:', error);
      res.status(500).json({ error: 'Failed to fetch admin actions by user' });
    }
  }

  /**
   * POST /api/admin/activate-distributor
   * Ativa distribuidor
   */
  async activateDistributor(req: Request, res: Response): Promise<void> {
    try {
      const { distributorId, reason, userId, userName } = req.body;
      const result = await this.service.activateDistributor(distributorId, reason, userId, userName);
      res.json(result);
    } catch (error) {
      console.error('Error activating distributor:', error);
      res.status(500).json({ error: 'Failed to activate distributor' });
    }
  }

  /**
   * POST /api/admin/deactivate-distributor
   * Desativa distribuidor
   */
  async deactivateDistributor(req: Request, res: Response): Promise<void> {
    try {
      const { distributorId, reason, userId, userName } = req.body;
      const result = await this.service.deactivateDistributor(distributorId, reason, userId, userName);
      res.json(result);
    } catch (error) {
      console.error('Error deactivating distributor:', error);
      res.status(500).json({ error: 'Failed to deactivate distributor' });
    }
  }
}
