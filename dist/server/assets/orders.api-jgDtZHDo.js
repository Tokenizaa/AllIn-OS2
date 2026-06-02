import { c as createServerRpc } from "./createServerRpc-_p3nJ_R1.js";
import { a as createServerFn } from "./server-zSNg87Zb.js";
import { z } from "zod";
import { B as BaseRepository } from "./base.repository-C1yp6j9c.js";
import { p as paginationSchema, f as filterSchema } from "./pagination.dto-D6rx1FA4.js";
import { c as createOrderSchema, u as updateOrderSchema } from "./order.dto-LsqToPpL.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@supabase/supabase-js";
import "node:process";
class OrderRepository extends BaseRepository {
  constructor() {
    super("orders");
  }
  async findByCustomerId(customerId, options) {
    let query = this.getClient().from(this.tableName).select("*").or(`user_id.eq.${customerId},comprador.eq.${customerId}`);
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
  async findByStatus(status, options) {
    let query = this.getClient().from(this.tableName).select("*").eq("status", status);
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
  async getOrderSummary(customerId) {
    let query = this.getClient().from(this.tableName).select("id, comprador, usuario, status, valor_total, pedido_pago, forma_pagamento, created_at, order_items(*)");
    if (customerId) {
      query = query.or(`user_id.eq.${customerId},comprador.eq.${customerId}`);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((order) => ({
      id: order.id,
      customer_id: order.comprador || order.user_id || null,
      customer_name: order.usuario || order.comprador || "Cliente",
      status: order.status || "pending",
      total_amount: Number(order.valor_total || 0),
      payment_status: order.pedido_pago || "pending",
      item_count: Array.isArray(order.order_items) ? order.order_items.length : 0,
      created_at: order.created_at
    }));
  }
  async countByStatus(status) {
    const { count, error } = await this.getClient().from(this.tableName).select("*", { count: "exact", head: true }).eq("status", status);
    if (error) throw error;
    return count || 0;
  }
  async countByCustomerId(customerId) {
    const { count, error } = await this.getClient().from(this.tableName).select("*", { count: "exact", head: true }).or(`user_id.eq.${customerId},comprador.eq.${customerId}`);
    if (error) throw error;
    return count || 0;
  }
  async getTotalRevenue() {
    const { data, error } = await this.getClient().from(this.tableName).select("valor_total");
    if (error) throw error;
    return data?.reduce((sum, order) => sum + Number(order.valor_total || 0), 0) || 0;
  }
  async getRevenueByPeriod(startDate, endDate) {
    const { data, error } = await this.getClient().from(this.tableName).select("valor_total").gte("created_at", startDate.toISOString()).lte("created_at", endDate.toISOString()).or("pedido_pago.eq.pago,pedido_pago.eq.paid,estado.eq.aprovado");
    if (error) throw error;
    return data?.reduce((sum, order) => sum + Number(order.valor_total || 0), 0) || 0;
  }
  async getItemsByOrderId(orderId) {
    const { data, error } = await this.getClient().from("order_items").select("*").eq("order_id", orderId);
    if (error) throw error;
    return data || [];
  }
}
class OrderItemRepository extends BaseRepository {
  constructor() {
    super("order_items");
  }
  async findByOrderId(orderId) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("order_id", orderId);
    if (error) throw error;
    return data || [];
  }
  async deleteByOrderId(orderId) {
    const { error } = await this.getClient().from(this.tableName).delete().eq("order_id", orderId);
    if (error) throw error;
  }
}
class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderItemRepository = new OrderItemRepository();
  }
  async findAll(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    let orders;
    let total;
    if (params.customer_id) {
      orders = await this.orderRepository.findByCustomerId(params.customer_id, { limit, offset, status: params.status });
      total = await this.orderRepository.countByCustomerId(params.customer_id);
    } else if (params.status) {
      orders = await this.orderRepository.findByStatus(params.status, { limit, offset });
      total = await this.orderRepository.countByStatus(params.status);
    } else {
      orders = await this.orderRepository.findAll({ limit, offset });
      total = await this.orderRepository.count();
    }
    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async findById(id) {
    return this.orderRepository.findById(id);
  }
  async getOrderSummary(customerId) {
    return this.orderRepository.getOrderSummary(customerId);
  }
  async create(dto) {
    const order = await this.orderRepository.create({
      comprador: dto.comprador || null,
      usuario: dto.usuario || null,
      valor_total: dto.valor_total ? Number(dto.valor_total) : 0,
      forma_pagamento: dto.forma_pagamento || null,
      pedido_pago: dto.pedido_pago || "pendente",
      status: dto.status || "pending",
      data_criacao_pedido: dto.data_criacao_pedido || (/* @__PURE__ */ new Date()).toISOString(),
      data_pagamento_pedido: dto.data_pagamento_pedido || null,
      informacoes_produtos: dto.informacoes_produtos || null,
      pagamentos: dto.pagamentos || null,
      loja: dto.loja || null,
      user_id: dto.user_id || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    return order;
  }
  async update(id, dto) {
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }
    return this.orderRepository.update(id, {
      ...dto,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async delete(id) {
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }
    await this.orderItemRepository.deleteByOrderId(id);
    await this.orderRepository.delete(id);
  }
  async getOrderItems(orderId) {
    return this.orderItemRepository.findByOrderId(orderId);
  }
  async getStats() {
    const [totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders, totalRevenue] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.countByStatus("pending"),
      this.orderRepository.countByStatus("processing"),
      this.orderRepository.countByStatus("shipped"),
      this.orderRepository.countByStatus("delivered"),
      this.orderRepository.countByStatus("cancelled"),
      this.orderRepository.getTotalRevenue()
    ]);
    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    };
  }
  async getRevenueByPeriod(startDate, endDate) {
    return this.orderRepository.getRevenueByPeriod(startDate, endDate);
  }
}
const orderService = new OrderService();
const getOrders_createServerFn_handler = createServerRpc({
  id: "4d8939df80641fadb00757f28458dcac34bedd72761f705eb3d61287ea2f8969",
  name: "getOrders",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => getOrders.__executeServer(opts));
const getOrders = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).merge(z.object({
    customer_id: z.string().uuid().optional(),
    status: z.string().optional()
  })).parse(data);
}).handler(getOrders_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await orderService.findAll(data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders"
    };
  }
});
const getOrderById_createServerFn_handler = createServerRpc({
  id: "158a1d80449ff8100ba8e4346b6b428d4f7715934ceab2d27a32c2a9987e9840",
  name: "getOrderById",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => getOrderById.__executeServer(opts));
const getOrderById = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(getOrderById_createServerFn_handler, async ({
  data
}) => {
  try {
    const order = await orderService.findById(data.id);
    if (!order) {
      return {
        success: false,
        error: "Order not found"
      };
    }
    return {
      success: true,
      data: order
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order"
    };
  }
});
const getOrderSummary_createServerFn_handler = createServerRpc({
  id: "8d3fd6ca84e41d087bcbb79c42e28566487462b6a72d1df7c982e3689569b625",
  name: "getOrderSummary",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => getOrderSummary.__executeServer(opts));
const getOrderSummary = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    customerId: z.string().uuid().optional()
  }).parse(data);
}).handler(getOrderSummary_createServerFn_handler, async ({
  data
}) => {
  try {
    const summary = await orderService.getOrderSummary(data.customerId);
    return {
      success: true,
      data: summary
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order summary"
    };
  }
});
const createOrder_createServerFn_handler = createServerRpc({
  id: "d8221f0ed70dc359b7707e2332653ae6969a19d94cbb0d455740f773d7aa5d2f",
  name: "createOrder",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => createOrder.__executeServer(opts));
const createOrder = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createOrderSchema.parse(data);
}).handler(createOrder_createServerFn_handler, async ({
  data
}) => {
  try {
    const order = await orderService.create(data);
    return {
      success: true,
      data: order,
      message: "Order created successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order"
    };
  }
});
const updateOrder_createServerFn_handler = createServerRpc({
  id: "b5614854134378038e95d253f9ee05fcfb161d32b5e5811b2fde2a7f53bae731",
  name: "updateOrder",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => updateOrder.__executeServer(opts));
const updateOrder = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid(),
    data: updateOrderSchema
  }).parse(data);
}).handler(updateOrder_createServerFn_handler, async ({
  data
}) => {
  try {
    const order = await orderService.update(data.id, data.data);
    return {
      success: true,
      data: order,
      message: "Order updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order"
    };
  }
});
const deleteOrder_createServerFn_handler = createServerRpc({
  id: "6ae9c9b1ece66c07e9c6825e7adc3ab368e07fdd4ae47078a43543eca36aa174",
  name: "deleteOrder",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => deleteOrder.__executeServer(opts));
const deleteOrder = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(deleteOrder_createServerFn_handler, async ({
  data
}) => {
  try {
    await orderService.delete(data.id);
    return {
      success: true,
      message: "Order deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order"
    };
  }
});
const getOrderItems_createServerFn_handler = createServerRpc({
  id: "89a297859205f32f761acf4733fc183e98bfee7776a50f8c0c157f5b38f3fe95",
  name: "getOrderItems",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => getOrderItems.__executeServer(opts));
const getOrderItems = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    orderId: z.string().uuid()
  }).parse(data);
}).handler(getOrderItems_createServerFn_handler, async ({
  data
}) => {
  try {
    const items = await orderService.getOrderItems(data.orderId);
    return {
      success: true,
      data: items
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order items"
    };
  }
});
const getOrderStats_createServerFn_handler = createServerRpc({
  id: "f014e964483ccaa09dec68e8a835bf2f4348373c757d80fefc750e085cb1e89a",
  name: "getOrderStats",
  filename: "src/backend/modules/orders/api/orders.api.ts"
}, (opts) => getOrderStats.__executeServer(opts));
const getOrderStats = createServerFn({
  method: "GET"
}).handler(getOrderStats_createServerFn_handler, async () => {
  try {
    const stats = await orderService.getStats();
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order stats"
    };
  }
});
export {
  createOrder_createServerFn_handler,
  deleteOrder_createServerFn_handler,
  getOrderById_createServerFn_handler,
  getOrderItems_createServerFn_handler,
  getOrderStats_createServerFn_handler,
  getOrderSummary_createServerFn_handler,
  getOrders_createServerFn_handler,
  updateOrder_createServerFn_handler
};
