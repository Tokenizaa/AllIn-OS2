import { supabase } from "../../../shared/infrastructure/supabase/client";

export class AnalyticsUpdateService {
  private static instance: AnalyticsUpdateService;

  private constructor() {}

  static getInstance(): AnalyticsUpdateService {
    if (!AnalyticsUpdateService.instance) {
      AnalyticsUpdateService.instance = new AnalyticsUpdateService();
    }
    return AnalyticsUpdateService.instance;
  }

  /**
   * Atualiza customer_metrics para um customer específico
   * Calcula: total_gasto, ticket_medio, ltv, numero_pedidos, ultimo_pedido
   */
  async updateCustomerMetrics(idComprador: string): Promise<void> {
    try {
      // Calcular métricas baseadas em orders e payments
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, valor_total_pedido, created_at')
        .eq('id_comprador', idComprador)
        .eq('status_pedido', 'Concluído');

      if (ordersError) throw ordersError;

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + (parseFloat(order.valor_total_pedido) || 0), 0) || 0;
      const averageTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const lastOrder = orders?.length > 0 ? orders[orders.length - 1].created_at : null;

      // Calcular LTV (Lifetime Value) - simplificado como total gasto
      const ltv = totalSpent;

      // Atualizar ou criar customer_metrics
      const { error: upsertError } = await supabase
        .from('customer_metrics')
        .upsert({
          id_comprador: idComprador,
          total_gasto: totalSpent,
          ticket_medio: averageTicket,
          ltv: ltv,
          numero_pedidos: totalOrders,
          ultimo_pedido: lastOrder,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id_comprador'
        });

      if (upsertError) throw upsertError;

      console.log(`Customer metrics updated for customer ${idComprador}`);
    } catch (error) {
      console.error('Error updating customer metrics:', error);
      throw error;
    }
  }

  /**
   * Atualiza customer_scores para um customer específico
   * Calcula: churn_score, engagement_score, loyalty_score
   */
  async updateCustomerScores(idComprador: string): Promise<void> {
    try {
      // Buscar métricas do customer
      const { data: metrics, error: metricsError } = await supabase
        .from('customer_metrics')
        .select('*')
        .eq('id_comprador', idComprador)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') throw metricsError;

      if (!metrics) {
        console.log(`No metrics found for customer ${idComprador}, skipping scores update`);
        return;
      }

      // Calcular churn_score baseado em recência de compras
      const daysSinceLastOrder = metrics.ultimo_pedido 
        ? Math.floor((new Date().getTime() - new Date(metrics.ultimo_pedido).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      let churnScore = 0;
      if (daysSinceLastOrder > 90) churnScore = 80;
      else if (daysSinceLastOrder > 60) churnScore = 60;
      else if (daysSinceLastOrder > 30) churnScore = 40;
      else if (daysSinceLastOrder > 14) churnScore = 20;
      else churnScore = 10;

      // Calcular engagement_score baseado em número de pedidos e frequência
      let engagementScore = 0;
      if (metrics.numero_pedidos > 20) engagementScore = 90;
      else if (metrics.numero_pedidos > 10) engagementScore = 70;
      else if (metrics.numero_pedidos > 5) engagementScore = 50;
      else if (metrics.numero_pedidos > 1) engagementScore = 30;
      else engagementScore = 10;

      // Calcular loyalty_score baseado em LTV e ticket médio
      let loyaltyScore = 0;
      if (metrics.ltv > 10000) loyaltyScore = 90;
      else if (metrics.ltv > 5000) loyaltyScore = 70;
      else if (metrics.ltv > 2000) loyaltyScore = 50;
      else if (metrics.ltv > 500) loyaltyScore = 30;
      else loyaltyScore = 10;

      // Atualizar ou criar customer_scores
      const { error: upsertError } = await supabase
        .from('customer_scores')
        .upsert({
          id_comprador: idComprador,
          churn_score: churnScore,
          engagement_score: engagementScore,
          loyalty_score: loyaltyScore,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id_comprador'
        });

      if (upsertError) throw upsertError;

      console.log(`Customer scores updated for customer ${idComprador}`);
    } catch (error) {
      console.error('Error updating customer scores:', error);
      throw error;
    }
  }

  /**
   * Atualiza todos os customers (batch processing)
   */
  async updateAllMetrics(): Promise<void> {
    try {
      console.log('Starting batch update of all customer metrics...');

      // Buscar todos os customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id');

      if (customersError) throw customersError;

      if (!customers || customers.length === 0) {
        console.log('No customers found');
        return;
      }

      // Atualizar cada customer (sequencial para evitar sobrecarga)
      for (const customer of customers) {
        await this.updateCustomerMetrics(customer.id);
        await this.updateCustomerScores(customer.id);
      }

      console.log(`Batch update completed for ${customers.length} customers`);
    } catch (error) {
      console.error('Error in batch update:', error);
      throw error;
    }
  }

  /**
   * Atualiza métricas após um novo pedido
   */
  async updateAfterOrder(idComprador: string): Promise<void> {
    try {
      await this.updateCustomerMetrics(idComprador);
      await this.updateCustomerScores(idComprador);
      console.log(`Metrics updated after order for customer ${idComprador}`);
    } catch (error) {
      console.error('Error updating metrics after order:', error);
      throw error;
    }
  }

  /**
   * Atualiza métricas após um novo pagamento
   */
  async updateAfterPayment(idComprador: string): Promise<void> {
    try {
      await this.updateCustomerMetrics(idComprador);
      await this.updateCustomerScores(idComprador);
      console.log(`Metrics updated after payment for customer ${idComprador}`);
    } catch (error) {
      console.error('Error updating metrics after payment:', error);
      throw error;
    }
  }
}
