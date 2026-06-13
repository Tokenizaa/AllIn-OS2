/**
 * CD Balance API
 * 
 * API endpoints para gerenciar saldo de Centro de Distribuição (CD).
 */

import { CDBalanceService } from '../services/cd-balance.service';
import { Request, Response } from 'express';

export class CDBalanceAPI {
  private service: CDBalanceService;

  constructor() {
    this.service = new CDBalanceService();
  }

  /**
   * POST /api/admin/cd-balance/movements
   * Cria movimentação de saldo
   */
  async createMovement(req: Request, res: Response): Promise<void> {
    try {
      const movement = await this.service.createMovement(req.body);
      res.json(movement);
    } catch (error) {
      console.error('Error creating CD balance movement:', error);
      res.status(500).json({ error: 'Failed to create CD balance movement' });
    }
  }

  /**
   * GET /api/admin/cd-balance/movements/cd/:cdId
   * Busca movimentações por CD
   */
  async getMovementsByCD(req: Request, res: Response): Promise<void> {
    try {
      const { cdId } = req.params;
      const movements = await this.service.getMovementsByCD(parseInt(cdId));
      res.json(movements);
    } catch (error) {
      console.error('Error fetching CD movements:', error);
      res.status(500).json({ error: 'Failed to fetch CD movements' });
    }
  }

  /**
   * GET /api/admin/cd-balance/movements/type/:type
   * Busca movimentações por tipo
   */
  async getMovementsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const movements = await this.service.getMovementsByType(type);
      res.json(movements);
    } catch (error) {
      console.error('Error fetching movements by type:', error);
      res.status(500).json({ error: 'Failed to fetch movements by type' });
    }
  }

  /**
   * GET /api/admin/cd-balance/movements/recent
   * Busca movimentações recentes
   */
  async getRecentMovements(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const movements = await this.service.getRecentMovements(limit);
      res.json(movements);
    } catch (error) {
      console.error('Error fetching recent movements:', error);
      res.status(500).json({ error: 'Failed to fetch recent movements' });
    }
  }

  /**
   * GET /api/admin/cd-balance/balance/:cdId
   * Busca saldo atual de um CD
   */
  async getCDBalance(req: Request, res: Response): Promise<void> {
    try {
      const { cdId } = req.params;
      const balance = await this.service.getCDBalance(parseInt(cdId));
      res.json(balance);
    } catch (error) {
      console.error('Error fetching CD balance:', error);
      res.status(500).json({ error: 'Failed to fetch CD balance' });
    }
  }

  /**
   * GET /api/admin/cd-balance/summary
   * Busca resumo de saldos de todos os CDs
   */
  async getBalanceSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await this.service.getBalanceSummary();
      res.json(summary);
    } catch (error) {
      console.error('Error fetching balance summary:', error);
      res.status(500).json({ error: 'Failed to fetch balance summary' });
    }
  }

  /**
   * POST /api/admin/cd-balance/credit
   * Credita saldo em CD
   */
  async creditBalance(req: Request, res: Response): Promise<void> {
    try {
      const { cdId, amount, reason, userId, userName, referenceId, referenceType } = req.body;
      const movement = await this.service.creditBalance(
        cdId,
        amount,
        reason,
        userId,
        userName,
        referenceId,
        referenceType
      );
      res.json(movement);
    } catch (error) {
      console.error('Error crediting CD balance:', error);
      res.status(500).json({ error: 'Failed to credit CD balance' });
    }
  }

  /**
   * POST /api/admin/cd-balance/debit
   * Debita saldo de CD
   */
  async debitBalance(req: Request, res: Response): Promise<void> {
    try {
      const { cdId, amount, reason, userId, userName, referenceId, referenceType } = req.body;
      const movement = await this.service.debitBalance(
        cdId,
        amount,
        reason,
        userId,
        userName,
        referenceId,
        referenceType
      );
      res.json(movement);
    } catch (error) {
      console.error('Error debiting CD balance:', error);
      res.status(500).json({ error: 'Failed to debit CD balance' });
    }
  }

  /**
   * POST /api/admin/cd-balance/transfer
   * Transfere saldo entre CDs
   */
  async transferBalance(req: Request, res: Response): Promise<void> {
    try {
      const { fromCdId, toCdId, amount, reason, userId, userName } = req.body;
      const result = await this.service.transferBalance(
        fromCdId,
        toCdId,
        amount,
        reason,
        userId,
        userName
      );
      res.json(result);
    } catch (error) {
      console.error('Error transferring CD balance:', error);
      res.status(500).json({ error: 'Failed to transfer CD balance' });
    }
  }

  /**
   * POST /api/admin/cd-balance/adjust
   * Ajusta saldo manualmente
   */
  async adjustBalance(req: Request, res: Response): Promise<void> {
    try {
      const { cdId, newAmount, reason, userId, userName } = req.body;
      const movement = await this.service.adjustBalance(
        cdId,
        newAmount,
        reason,
        userId,
        userName
      );
      res.json(movement);
    } catch (error) {
      console.error('Error adjusting CD balance:', error);
      res.status(500).json({ error: 'Failed to adjust CD balance' });
    }
  }
}
