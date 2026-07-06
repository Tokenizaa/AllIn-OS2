import { supabase } from "../../../shared/infrastructure/supabase/client";

export class CommissionService {
  private static instance: CommissionService;

  private constructor() {}

  static getInstance(): CommissionService {
    if (!CommissionService.instance) {
      CommissionService.instance = new CommissionService();
    }
    return CommissionService.instance;
  }

  /**
   * Calcula comissão direta para o patrocinador
   * Comissão direta: % sobre o valor do pedido do patrocinado
   */
  async calculateDirectCommission(orderId: string): Promise<void> {
    try {
      // Buscar informações do pedido
      const { data: order, error: orderError } = await supabase
        .schema('commerce')
        .from('orders')
        .select('id_comprador, valor_total_pedido, numero_pedido')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      if (!order) {
        console.log(`Order ${orderId} not found`);
        return;
      }

      // Buscar o patrocinador do customer
      const { data: customer, error: customerError } = await supabase
        .schema('crm')
        .from('customers')
        .select('patrocinador_id')
        .eq('id', order.id_comprador)
        .single();

      if (customerError) throw customerError;
      if (!customer || !customer.patrocinador_id) {
        console.log(`No sponsor found for customer ${order.id_comprador}`);
        return;
      }

      // Definir porcentagem de comissão direta (pode ser configurável por plano)
      const commissionPercentage = 10; // 10% padrão
      const commissionAmount = (parseFloat(order.valor_total_pedido) || 0) * (commissionPercentage / 100);

      // Criar registro de comissão
      const { error: insertError } = await supabase
        .schema('finance')
        .from('commissions')
        .insert({
          id_comprador: customer.patrocinador_id,
          pedido_id: orderId,
          tipo_comissao: 'direct',
          valor: commissionAmount,
          porcentagem: commissionPercentage,
          status: 'pending',
          calculado_em: new Date().toISOString(),
          metadata: {
            order_number: order.numero_pedido,
            order_value: order.valor_total_pedido,
          },
        });

      if (insertError) throw insertError;

      console.log(`Direct commission calculated for order ${orderId}: ${commissionAmount} for sponsor ${customer.patrocinador_id}`);
    } catch (error) {
      console.error('Error calculating direct commission:', error);
      throw error;
    }
  }

  /**
   * Calcula comissões indiretas para uplines
   * Comissões indiretas: % sobre o valor do pedido para níveis superiores da rede
   */
  async calculateIndirectCommission(orderId: string): Promise<void> {
    try {
      // Buscar informações do pedido
      const { data: order, error: orderError } = await supabase
        .schema('commerce')
        .from('orders')
        .select('id_comprador, valor_total_pedido, numero_pedido')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      if (!order) {
        console.log(`Order ${orderId} not found`);
        return;
      }

      // Buscar a cadeia de patrocinadores (uplines)
      const { data: customer, error: customerError } = await supabase
        .schema('crm')
        .from('customers')
        .select('patrocinador_id')
        .eq('id', order.id_comprador)
        .single();

      if (customerError) throw customerError;
      if (!customer || !customer.patrocinador_id) {
        console.log(`No sponsor found for customer ${order.id_comprador}`);
        return;
      }

      // Buscar uplines recursivamente (até 5 níveis)
      const uplines = await this.getUplines(customer.patrocinador_id, 5);
      const orderValue = parseFloat(order.valor_total_pedido) || 0;

      // Definir porcentagens por nível (pode ser configurável)
      const levelPercentages = [5, 3, 2, 1, 0.5]; // 5%, 3%, 2%, 1%, 0.5%

      // Criar comissões para cada nível
      for (let i = 0; i < uplines.length; i++) {
        const upline = uplines[i];
        const percentage = levelPercentages[i] || 0;

        if (percentage === 0) continue;

        const commissionAmount = orderValue * (percentage / 100);

        const { error: insertError } = await supabase
          .schema('finance')
          .from('commissions')
          .insert({
            id_comprador: upline.id,
            pedido_id: orderId,
            tipo_comissao: 'indirect',
            valor: commissionAmount,
            porcentagem: percentage,
            status: 'pending',
            calculado_em: new Date().toISOString(),
            metadata: {
              order_number: order.numero_pedido,
              order_value: order.valor_total_pedido,
              level: i + 1,
            },
          });

        if (insertError) throw insertError;

        console.log(`Indirect commission (level ${i + 1}) calculated for order ${orderId}: ${commissionAmount} for upline ${upline.id}`);
      }
    } catch (error) {
      console.error('Error calculating indirect commission:', error);
      throw error;
    }
  }

  /**
   * Busca uplines recursivamente até um determinado nível
   */
  private async getUplines(idComprador: string, maxLevel: number): Promise<Array<{ id: string }>> {
    const uplines: Array<{ id: string }> = [];
    let currentidComprador = idComprador;

    for (let level = 0; level < maxLevel; level++) {
      const { data: customer, error: customerError } = await supabase
        .schema('crm')
        .from('customers')
        .select('patrocinador_id')
        .eq('id', currentidComprador)
        .single();

      if (customerError || !customer || !customer.patrocinador_id) {
        break;
      }

      uplines.push({ id: customer.patrocinador_id });
      currentidComprador = customer.patrocinador_id;
    }

    return uplines;
  }

  /**
   * Processa todas as comissões de um pedido
   * Calcula comissões diretas e indiretas
   */
  async processOrderCommissions(orderId: string): Promise<void> {
    try {
      console.log(`Processing commissions for order ${orderId}...`);

      // Calcular comissão direta
      await this.calculateDirectCommission(orderId);

      // Calcular comissões indiretas
      await this.calculateIndirectCommission(orderId);

      console.log(`Commissions processed successfully for order ${orderId}`);
    } catch (error) {
      console.error('Error processing order commissions:', error);
      throw error;
    }
  }

  /**
   * Aprova comissões pendentes
   */
  async approvePendingCommissions(idComprador?: string): Promise<void> {
    try {
      let query = supabase
        .schema('finance')
        .from('commissions')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('status', 'pending');

      if (idComprador) {
        query = query.eq('id_comprador', idComprador);
      }

      const { error } = await query;

      if (error) throw error;

      console.log(`Pending commissions approved${idComprador ? ` for customer ${idComprador}` : ''}`);
    } catch (error) {
      console.error('Error approving pending commissions:', error);
      throw error;
    }
  }

  /**
   * Marca comissões como pagas
   */
  async markCommissionsAsPaid(commissionIds: string[], paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .schema('finance')
        .from('commissions')
        .update({ 
          status: 'paid',
          pagamento_id: paymentId,
          pago_em: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .in('id', commissionIds);

      if (error) throw error;

      console.log(`${commissionIds.length} commissions marked as paid`);
    } catch (error) {
      console.error('Error marking commissions as paid:', error);
      throw error;
    }
  }

  /**
   * Busca comissões de um customer
   */
  async getCustomerCommissions(idComprador: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .schema('finance')
        .from('commissions')
        .select('*')
        .eq('id_comprador', idComprador)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting customer commissions:', error);
      throw error;
    }
  }

  /**
   * Calcula total de comissões pendentes para um customer
   */
  async getPendingCommissionTotal(idComprador: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .schema('finance')
        .from('commissions')
        .select('amount')
        .eq('id_comprador', idComprador)
        .eq('status', 'pending');

      if (error) throw error;

      const total = data?.reduce((sum, commission) => sum + (parseFloat(commission.valor) || 0), 0) || 0;
      return total;
    } catch (error) {
      console.error('Error getting pending commission total:', error);
      throw error;
    }
  }
}
