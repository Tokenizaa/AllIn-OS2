/**
 * Dashboard Repository
 * 
 * Repository para operações de database relacionadas ao dashboard.
 */

import { BaseRepository } from "../../../shared/infrastructure/repository/base.repository";
import { supabase } from "../../../shared/infra/database/supabase";

export class DashboardRepository extends BaseRepository<any> {
  constructor() {
    super('dashboard', 'analytics');
  }

  /**
   * Busca estatísticas gerais do dashboard
   */
  async getStats(periodStart: Date, periodEnd: Date): Promise<any> {
    const [
      totalDistributors,
      activeDistributors,
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      activeProducts,
    ] = await Promise.all([
      this.getDistributorCount(),
      this.getActiveDistributorCount(),
      this.getOrderCount(periodStart, periodEnd),
      this.getTotalRevenue(periodStart, periodEnd),
      this.getCustomerCount(),
      this.getProductCount(),
      this.getActiveProductCount(),
    ]);

    return {
      totalDistributors,
      activeDistributors,
      newDistributorsThisMonth: await this.getNewDistributorsCount(periodStart, periodEnd),
      totalNetworkVolume: await this.getTotalNetworkVolume(periodStart, periodEnd),
      totalCommissionsPaid: await this.getTotalCommissionsPaid(periodStart, periodEnd),
      pendingCommissions: await this.getPendingCommissions(),
      totalOrders,
      totalRevenue,
      ordersThisMonth: await this.getOrderCount(periodStart, periodEnd),
      revenueThisMonth: await this.getTotalRevenue(periodStart, periodEnd),
      pendingOrders: await this.getOrderCountByStatus('pending'),
      processingOrders: await this.getOrderCountByStatus('processing'),
      shippedOrders: await this.getOrderCountByStatus('shipped'),
      deliveredOrders: await this.getOrderCountByStatus('delivered'),
      totalCustomers,
      activeCustomers: await this.getActiveCustomerCount(),
      newCustomersThisMonth: await this.getNewCustomersCount(periodStart, periodEnd),
      totalProducts,
      activeProducts,
      lowStockProducts: await this.getLowStockProductCount(),
      outOfStockProducts: await this.getOutOfStockProductCount(),
    };
  }

  /**
   * Busca tendência de vendas
   */
  async getSalesTrend(periodStart: Date, periodEnd: Date): Promise<any[]> {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos')
      .select('created_at, valor_total_pedido')
      .gte('created_at', periodStart.toISOString())
      .lte('created_at', periodEnd.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Agrupar por data
    const grouped = (data || []).reduce((acc: any, order: any) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, orders: 0, revenue: 0, commissions: 0 };
      }
      acc[date].orders += 1;
      acc[date].revenue += Number(order.valor_total_pedido || 0);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  /**
   * Busca top distribuidores
   */
  async getTopDistributors(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .schema('mlm')
      .from('distribuidores')
      .select('id, nome, email, usuario, total_volume, total_comissoes, rede_tamanho, qualificacao')
      .eq('ativo', true)
      .order('total_volume', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((d: any) => ({
      id: d.id,
      name: d.nome,
      email: d.email,
      totalVolume: Number(d.total_volume || 0),
      totalCommissions: Number(d.total_comissoes || 0),
      networkSize: d.rede_tamanho || 0,
      rank: d.qualificacao || 'Sem qualificação',
    }));
  }

  /**
   * Busca top produtos
   */
  async getTopProducts(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('id, nome, categoria, total_vendido, total_receita, estoque')
      .eq('ativo', true)
      .order('total_vendido', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.nome,
      category: p.categoria,
      totalSold: p.total_vendido || 0,
      totalRevenue: Number(p.total_receita || 0),
      stock: p.estoque || 0,
    }));
  }

  /**
   * Busca pedidos recentes
   */
  async getRecentOrders(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos')
      .select('id, usuario, email, valor_total_pedido, status_pedido, pedido_pago, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((order: any) => ({
      id: order.id,
      customerName: order.usuario || 'Cliente',
      customerEmail: order.email || '',
      totalAmount: Number(order.valor_total_pedido || 0),
      status: order.status_pedido || 'pending',
      paymentStatus: order.pedido_pago || 'pending',
      createdAt: new Date(order.created_at),
    }));
  }

  /**
   * Busca visão geral de comissões
   */
  async getCommissionOverview(periodStart: Date, periodEnd: Date): Promise<any> {
    const [totalPaid, totalPending, paidThisMonth, pendingThisMonth] = await Promise.all([
      this.getTotalCommissionsPaid(periodStart, periodEnd),
      this.getPendingCommissions(),
      this.getCommissionsPaidThisMonth(),
      this.getCommissionsPendingThisMonth(),
    ]);

    const recentPayments = await this.getRecentCommissionPayments(5);

    return {
      totalPaid,
      totalPending,
      totalAvailable: totalPaid + totalPending,
      paidThisMonth,
      pendingThisMonth,
      recentPayments,
    };
  }

  /**
   * Busca visão geral da rede
   */
  async getNetworkOverview(): Promise<any> {
    const [totalNodes, activeNodes, depth, width] = await Promise.all([
      this.getTotalNetworkNodes(),
      this.getActiveNetworkNodes(),
      this.getNetworkDepth(),
      this.getNetworkWidth(),
    ]);

    const growthRate = await this.getNetworkGrowthRate();
    const topPerformers = await this.getTopDistributors(5);

    return {
      totalNodes,
      activeNodes,
      depth,
      width,
      growthRate,
      topPerformers,
    };
  }

  // Métodos auxiliares

  private async getDistributorCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('mlm')
      .from('distribuidores')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }

  private async getActiveDistributorCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('mlm')
      .from('distribuidores')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true);

    if (error) throw error;
    return count || 0;
  }

  private async getNewDistributorsCount(start: Date, end: Date): Promise<number> {
    const { count, error } = await supabase
      .schema('mlm')
      .from('distribuidores')
      .select('*', { count: 'exact', head: true })
      .gte('data_cadastro', start.toISOString())
      .lte('data_cadastro', end.toISOString());

    if (error) throw error;
    return count || 0;
  }

  private async getTotalNetworkVolume(start: Date, end: Date): Promise<number> {
    const { data, error } = await supabase
      .schema('mlm')
      .from('distribuidores')
      .select('total_volume');

    if (error) throw error;
    return data?.reduce((sum: number, d: any) => sum + Number(d.total_volume || 0), 0) || 0;
  }

  private async getTotalCommissionsPaid(start: Date, end: Date): Promise<number> {
    const { data, error } = await supabase
      .from('mlm.comissoes')
      .select('valor')
      .gte('data_pagamento', start.toISOString())
      .lte('data_pagamento', end.toISOString())
      .eq('status', 'pago');

    if (error) throw error;
    return data?.reduce((sum: number, c: any) => sum + Number(c.valor || 0), 0) || 0;
  }

  private async getPendingCommissions(): Promise<number> {
    const { data, error } = await supabase
      .from('mlm.comissoes')
      .select('valor')
      .eq('status', 'pendente');

    if (error) throw error;
    return data?.reduce((sum: number, c: any) => sum + Number(c.valor || 0), 0) || 0;
  }

  private async getOrderCount(start: Date, end: Date): Promise<number> {
    const { count, error } = await supabase
      .schema('commerce')
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (error) throw error;
    return count || 0;
  }

  private async getTotalRevenue(start: Date, end: Date): Promise<number> {
    const { data, error } = await supabase
      .schema('commerce')
      .from('pedidos')
      .select('valor_total_pedido')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (error) throw error;
    return data?.reduce((sum: number, o: any) => sum + Number(o.valor_total_pedido || 0), 0) || 0;
  }

  private async getOrderCountByStatus(status: string): Promise<number> {
    const { count, error } = await supabase
      .schema('commerce')
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .eq('status_pedido', status);

    if (error) throw error;
    return count || 0;
  }

  private async getCustomerCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('crm')
      .from('customers')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }

  private async getActiveCustomerCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('crm')
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) throw error;
    return count || 0;
  }

  private async getNewCustomersCount(start: Date, end: Date): Promise<number> {
    const { count, error } = await supabase
      .schema('crm')
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (error) throw error;
    return count || 0;
  }

  private async getProductCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }

  private async getActiveProductCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true);

    if (error) throw error;
    return count || 0;
  }

  private async getLowStockProductCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('*', { count: 'exact', head: true })
      .lt('estoque', supabase.raw('estoque_minimo'))
      .eq('ativo', true);

    if (error) throw error;
    return count || 0;
  }

  private async getOutOfStockProductCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('*', { count: 'exact', head: true })
      .eq('estoque', 0)
      .eq('ativo', true);

    if (error) throw error;
    return count || 0;
  }

  private async getCommissionsPaidThisMonth(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { data, error } = await supabase
      .from('mlm.comissoes')
      .select('valor')
      .gte('data_pagamento', startOfMonth.toISOString())
      .eq('status', 'pago');

    if (error) throw error;
    return data?.reduce((sum: number, c: any) => sum + Number(c.valor || 0), 0) || 0;
  }

  private async getCommissionsPendingThisMonth(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { data, error } = await supabase
      .from('mlm.comissoes')
      .select('valor')
      .gte('created_at', startOfMonth.toISOString())
      .eq('status', 'pendente');

    if (error) throw error;
    return data?.reduce((sum: number, c: any) => sum + Number(c.valor || 0), 0) || 0;
  }

  private async getRecentCommissionPayments(limit: number): Promise<any[]> {
    const { data, error } = await supabase
      .from('mlm.comissoes')
      .select('id, distribuidor_id, valor, status, data_pagamento')
      .eq('status', 'pago')
      .order('data_pagamento', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((c: any) => ({
      id: c.id,
      distributorId: c.distribuidor_id,
      distributorName: 'Distribuidor', // TODO: Join with distribuidores table
      amount: Number(c.valor || 0),
      status: c.status,
      paidAt: new Date(c.data_pagamento),
    }));
  }

  private async getTotalNetworkNodes(): Promise<number> {
    const { count, error } = await supabase
      .schema('mlm')
      .from('rede_linear_nos')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }

  private async getActiveNetworkNodes(): Promise<number> {
    const { count, error } = await supabase
      .schema('mlm')
      .from('distribuidores')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true);

    if (error) throw error;
    return count || 0;
  }

  private async getNetworkDepth(): Promise<number> {
    const { data, error } = await supabase
      .schema('mlm')
      .from('rede_linear_nos')
      .select('linha')
      .order('linha', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0]?.linha || 0;
  }

  private async getNetworkWidth(): Promise<number> {
    const { data, error } = await supabase
      .schema('mlm')
      .from('rede_linear_nos')
      .select('linha')
      .order('linha', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0]?.linha || 0;
  }

  private async getNetworkGrowthRate(): Promise<number> {
    // Calculate growth rate based on new distributors in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newCount, totalCount] = await Promise.all([
      this.getNewDistributorsCount(thirtyDaysAgo, new Date()),
      this.getDistributorCount(),
    ]);

    if (totalCount === 0) return 0;
    return (newCount / totalCount) * 100;
  }
}
