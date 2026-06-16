import { BaseRepository } from "../../../infra/database/base.repository";
import { Order, OrderItem, OrderSummary } from "../dto/order.dto";

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super("pedidos", "commerce");
  }

  async findByidComprador(idComprador: string, options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<Order[]> {
    let query = this.getQuery()
      .select("*")
      .or(`distribuidor_comprador_id.eq.${idComprador},cliente_id.eq.${idComprador},auth_user_id.eq.${idComprador}`);

    if (options?.status) {
      query = query.eq("status_pedido", options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByStatus(status: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    let query = this.getQuery()
      .select("*")
      .eq("status_pedido", status);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getOrderSummary(idComprador?: string): Promise<OrderSummary[]> {
    let query = this.getQuery()
      .select("id, numero_pedido, distribuidor_comprador_id, cliente_nome, status_pedido, valor_total, pagamento_confirmado, forma_pagamento, created_at, pedidos_itens(*)");

    if (idComprador) {
      query = query.or(`distribuidor_comprador_id.eq.${idComprador},cliente_id.eq.${idComprador},auth_user_id.eq.${idComprador}`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((order: any) => ({
      id: order.id,
      id_comprador: order.distribuidor_comprador_id || order.cliente_id || order.auth_user_id || null,
      customer_name: order.cliente_nome || order.distribuidor_comprador_id || "Cliente",
      status: order.status_pedido || "pending",
      total_amount: Number(order.valor_total || 0),
      payment_status: order.pagamento_confirmado ? "paid" : "pending",
      item_count: Array.isArray(order.pedidos_itens) ? order.pedidos_itens.length : 0,
      created_at: order.created_at,
    }));
  }

  async countByStatus(status: string): Promise<number> {
    const { count, error } = await this.getQuery()
      .select("*", { count: "exact", head: true })
      .eq("status_pedido", status);

    if (error) throw error;
    return count || 0;
  }

  async countByidComprador(idComprador: string): Promise<number> {
    const { count, error } = await this.getQuery()
      .select("*", { count: "exact", head: true })
      .or(`distribuidor_comprador_id.eq.${idComprador},cliente_id.eq.${idComprador},auth_user_id.eq.${idComprador}`);

    if (error) throw error;
    return count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const { data, error } = await this.getQuery()
      .select("valor_total_pedido");

    if (error) throw error;

    return data?.reduce((sum, order: any) => sum + Number(order.valor_total_pedido || 0), 0) || 0;
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const { data, error } = await this.getQuery()
      .select("valor_total")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .or("pagamento_confirmado.eq.true,status_pedido.eq.pago,status_pedido.eq.aprovado");

    if (error) throw error;

    return data?.reduce((sum, order: any) => sum + Number(order.valor_total || 0), 0) || 0;
  }

  async getItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.getClient()
      .schema("commerce")
      .from("pedidos_itens")
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;
    return data || [];
  }
}

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor() {
    super("pedidos_itens", "commerce");
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.getQuery()
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;
    return data || [];
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    const { error } = await this.getQuery()
      .delete()
      .eq("order_id", orderId);

    if (error) throw error;
  }
}
