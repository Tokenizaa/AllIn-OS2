/**
 * Dashboard API
 * 
 * API endpoints para dashboard.
 */

import { DashboardService } from '../services/dashboard.service';
import { Request, Response } from 'express';

export class DashboardAPI {
  private service: DashboardService;

  constructor() {
    this.service = new DashboardService();
  }

  /**
   * GET /api/dashboard
   * Busca dados completos do dashboard
   */
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as 'today' | 'week' | 'month' | 'year' | 'all') || 'month';
      const dashboard = await this.service.getDashboard(period);
      res.json(dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }

  /**
   * GET /api/dashboard/stats
   * Busca estatísticas do dashboard
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as 'today' | 'week' | 'month' | 'year' | 'all') || 'month';
      const { periodStart, periodEnd } = this.service['getPeriodDates'](period);
      const stats = await this.service.getStats(periodStart, periodEnd, period);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  /**
   * GET /api/dashboard/sales-trend
   * Busca tendência de vendas
   */
  async getSalesTrend(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as 'today' | 'week' | 'month' | 'year' | 'all') || 'month';
      const { periodStart, periodEnd } = this.service['getPeriodDates'](period);
      const salesTrend = await this.service.getSalesTrend(periodStart, periodEnd);
      res.json(salesTrend);
    } catch (error) {
      console.error('Error fetching sales trend:', error);
      res.status(500).json({ error: 'Failed to fetch sales trend' });
    }
  }

  /**
   * GET /api/dashboard/top-distributors
   * Busca top distribuidores
   */
  async getTopDistributors(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topDistributors = await this.service.getTopDistributors(limit);
      res.json(topDistributors);
    } catch (error) {
      console.error('Error fetching top distributors:', error);
      res.status(500).json({ error: 'Failed to fetch top distributors' });
    }
  }

  /**
   * GET /api/dashboard/top-products
   * Busca top produtos
   */
  async getTopProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topProducts = await this.service.getTopProducts(limit);
      res.json(topProducts);
    } catch (error) {
      console.error('Error fetching top products:', error);
      res.status(500).json({ error: 'Failed to fetch top products' });
    }
  }

  /**
   * GET /api/dashboard/recent-orders
   * Busca pedidos recentes
   */
  async getRecentOrders(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentOrders = await this.service.getRecentOrders(limit);
      res.json(recentOrders);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      res.status(500).json({ error: 'Failed to fetch recent orders' });
    }
  }

  /**
   * GET /api/dashboard/commission-overview
   * Busca visão geral de comissões
   */
  async getCommissionOverview(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as 'today' | 'week' | 'month' | 'year' | 'all') || 'month';
      const { periodStart, periodEnd } = this.service['getPeriodDates'](period);
      const commissionOverview = await this.service.getCommissionOverview(periodStart, periodEnd);
      res.json(commissionOverview);
    } catch (error) {
      console.error('Error fetching commission overview:', error);
      res.status(500).json({ error: 'Failed to fetch commission overview' });
    }
  }

  /**
   * GET /api/dashboard/network-overview
   * Busca visão geral da rede
   */
  async getNetworkOverview(req: Request, res: Response): Promise<void> {
    try {
      const networkOverview = await this.service.getNetworkOverview();
      res.json(networkOverview);
    } catch (error) {
      console.error('Error fetching network overview:', error);
      res.status(500).json({ error: 'Failed to fetch network overview' });
    }
  }
}
