import { BaseRepository } from "../../../infra/database/base.repository";
export class OrderRepository extends BaseRepository {
    constructor() {
        super("orders");
    }
    async findByidComprador(idComprador, options) {
        let query = this.getClient()
            .from(this.tableName)
            .select("*")
            .or(`user_id.eq.${idComprador},comprador.eq.${idComprador}`);
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
        if (error)
            throw error;
        return data || [];
    }
    async findByStatus(status, options) {
        let query = this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("status_pedido", status);
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        if (options?.offset) {
            query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error)
            throw error;
        return data || [];
    }
    async getOrderSummary(idComprador) {
        let query = this.getClient()
            .from(this.tableName)
            .select("id, comprador, usuario, status_pedido, valor_total_pedido, pedido_pago, forma_pagamento, created_at, order_items(*)");
        if (idComprador) {
            query = query.or(`user_id.eq.${idComprador},comprador.eq.${idComprador}`);
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error)
            throw error;
        return (data || []).map((order) => ({
            id: order.id,
            id_comprador: order.comprador || order.user_id || null,
            customer_name: order.usuario || order.comprador || "Cliente",
            status: order.status_pedido || "pending",
            total_amount: Number(order.valor_total_pedido || 0),
            payment_status: order.pedido_pago || "pending",
            item_count: Array.isArray(order.order_items) ? order.order_items.length : 0,
            created_at: order.created_at,
        }));
    }
    async countByStatus(status) {
        const { count, error } = await this.getClient()
            .from(this.tableName)
            .select("*", { count: "exact", head: true })
            .eq("status_pedido", status);
        if (error)
            throw error;
        return count || 0;
    }
    async countByidComprador(idComprador) {
        const { count, error } = await this.getClient()
            .from(this.tableName)
            .select("*", { count: "exact", head: true })
            .or(`user_id.eq.${idComprador},comprador.eq.${idComprador}`);
        if (error)
            throw error;
        return count || 0;
    }
    async getTotalRevenue() {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("valor_total_pedido");
        if (error)
            throw error;
        return data?.reduce((sum, order) => sum + Number(order.valor_total_pedido || 0), 0) || 0;
    }
    async getRevenueByPeriod(startDate, endDate) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("valor_total_pedido")
            .gte("created_at", startDate.toISOString())
            .lte("created_at", endDate.toISOString())
            .or("pedido_pago.eq.pago,pedido_pago.eq.paid,estado.eq.aprovado");
        if (error)
            throw error;
        return data?.reduce((sum, order) => sum + Number(order.valor_total_pedido || 0), 0) || 0;
    }
    async getItemsByOrderId(orderId) {
        const { data, error } = await this.getClient()
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);
        if (error)
            throw error;
        return data || [];
    }
}
export class OrderItemRepository extends BaseRepository {
    constructor() {
        super("order_items");
    }
    async findByOrderId(orderId) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("order_id", orderId);
        if (error)
            throw error;
        return data || [];
    }
    async deleteByOrderId(orderId) {
        const { error } = await this.getClient()
            .from(this.tableName)
            .delete()
            .eq("order_id", orderId);
        if (error)
            throw error;
    }
}
