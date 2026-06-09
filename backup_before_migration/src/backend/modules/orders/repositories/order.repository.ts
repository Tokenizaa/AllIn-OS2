import { BaseRepository } from "../../../infra/database/base.repository";
import { Order, OrderItem, OrderSummary } from "../dto/order.dto";

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super("orders");
  }

  async findByCustomerId(customerId: string, options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<Order[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .or(`user_id.eq.${customerId},comprador.eq.${customerId}`);

    if (options?.status) {
      query = query.eq("status", options.status);
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
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("status", status);

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

  async getOrderSummary(customerId?: string): Promise<OrderSummary[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("id, comprador, usuario, status, valor_total, pedido_pago, forma_pagamento, created_at, order_items(*)");

    if (customerId) {
      query = query.or(`user_id.eq.${customerId},comprador.eq.${customerId}`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((order: any) => ({
      id: order.id,
      customer_id: order.comprador || order.user_id || null,
      customer_name: order.usuario || order.comprador || "Cliente",
      status: order.status || "pending",
      total_amount: Number(order.valor_total || 0),
      payment_status: order.pedido_pago || "pending",
      item_count: Array.isArray(order.order_items) ? order.order_items.length : 0,
      created_at: order.created_at,
    }));
  }

  async countByStatus(status: string): Promise<number> {
    const { count, error } = await this.getClient()
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("status", status);

    if (error) throw error;
    return count || 0;
  }

  async countByCustomerId(customerId: string): Promise<number> {
    const { count, error } = await this.getClient()
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .or(`user_id.eq.${customerId},comprador.eq.${customerId}`);

    if (error) throw error;
    return count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("valor_total");

    if (error) throw error;

    return data?.reduce((sum, order: any) => sum + Number(order.valor_total || 0), 0) || 0;
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("valor_total")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .or("pedido_pago.eq.pago,pedido_pago.eq.paid,estado.eq.aprovado");

    if (error) throw error;

    return data?.reduce((sum, order: any) => sum + Number(order.valor_total || 0), 0) || 0;
  }

  async getItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.getClient()
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;
    return data || [];
  }
}

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor() {
    super("order_items");
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;
    return data || [];
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq("order_id", orderId);

    if (error) throw error;
  }
}
