/**
 * Dashboard Service
 * 
 * Service para gerenciar dados do dashboard.
 */

import { DashboardRepository } from '../repositories/dashboard.repository';
import {
  DashboardStats,
  SalesTrend,
  TopDistributor,
  TopProduct,
  RecentOrder,
  CommissionOverview,
  NetworkOverview,
  DashboardResponse,
} from '../dto/dashboard.dto';

export class DashboardService {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  /**
   * Busca dados completos do dashboard
   */
  async getDashboard(period: 'today' | 'week' | 'month' | 'year' | 'all' = 'month'): Promise<DashboardResponse> {
    const { periodStart, periodEnd } = this.getPeriodDates(period);

    const [
      stats,
      salesTrend,
      topDistributors,
      topProducts,
      recentOrders,
      commissionOverview,
      networkOverview,
    ] = await Promise.all([
      this.getStats(periodStart, periodEnd, period),
      this.getSalesTrend(periodStart, periodEnd),
      this.getTopDistributors(),
      this.getTopProducts(),
      this.getRecentOrders(),
      this.getCommissionOverview(periodStart, periodEnd),
      this.getNetworkOverview(),
    ]);

    return {
      stats,
      salesTrend,
      topDistributors,
      topProducts,
      recentOrders,
      commissionOverview,
      networkOverview,
    };
  }

  /**
   * Busca estatísticas do dashboard
   */
  async getStats(periodStart: Date, periodEnd: Date, period: string): Promise<DashboardStats> {
    const stats = await this.repository.getStats(periodStart, periodEnd);
    
    return {
      ...stats,
      period: period as any,
      periodStart,
      periodEnd,
    };
  }

  /**
   * Busca tendência de vendas
   */
  async getSalesTrend(periodStart: Date, periodEnd: Date): Promise<SalesTrend[]> {
    return this.repository.getSalesTrend(periodStart, periodEnd);
  }

  /**
   * Busca top distribuidores
   */
  async getTopDistributors(limit: number = 10): Promise<TopDistributor[]> {
    return this.repository.getTopDistributors(limit);
  }

  /**
   * Busca top produtos
   */
  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    return this.repository.getTopProducts(limit);
  }

  /**
   * Busca pedidos recentes
   */
  async getRecentOrders(limit: number = 10): Promise<RecentOrder[]> {
    return this.repository.getRecentOrders(limit);
  }

  /**
   * Busca visão geral de comissões
   */
  async getCommissionOverview(periodStart: Date, periodEnd: Date): Promise<CommissionOverview> {
    return this.repository.getCommissionOverview(periodStart, periodEnd);
  }

  /**
   * Busca visão geral da rede
   */
  async getNetworkOverview(): Promise<NetworkOverview> {
    return this.repository.getNetworkOverview();
  }

  /**
   * Calcula datas do período
   */
  private getPeriodDates(period: 'today' | 'week' | 'month' | 'year' | 'all'): {
    periodStart: Date;
    periodEnd: Date;
  } {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setHours(23, 59, 59, 999);

    let periodStart: Date;

    switch (period) {
      case 'today':
        periodStart = new Date(now);
        periodStart.setHours(0, 0, 0, 0);
        break;
      case 'week':
        periodStart = new Date(now);
        periodStart.setDate(periodStart.getDate() - 7);
        periodStart.setHours(0, 0, 0, 0);
        break;
      case 'month':
        periodStart = new Date(now);
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);
        break;
      case 'year':
        periodStart = new Date(now);
        periodStart.setMonth(0, 1);
        periodStart.setHours(0, 0, 0, 0);
        break;
      case 'all':
        periodStart = new Date(0);
        break;
      default:
        periodStart = new Date(now);
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);
    }

    return { periodStart, periodEnd };
  }
}
