import { z } from "zod";
import { OrderService } from "../services/order.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createOrderSchema, updateOrderSchema } from "../dto/order.dto";

const orderService = new OrderService();

export const getOrders = async (data: unknown) => {
  const parsed = paginationSchema.merge(filterSchema).merge(
    z.object({
      id_comprador: z.string().optional(),
      status: z.string().optional(),
    })
  ).parse(data);
  try {
    const result = await orderService.findAll(parsed);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
};

export const getOrderById = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    const order = await orderService.findById(parsed.id);
    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }
    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
};

export const getOrderSummary = async (data: unknown) => {
  const parsed = z.object({ idComprador: z.string().optional() }).parse(data);
  try {
    const summary = await orderService.getOrderSummary(parsed.idComprador);
    return {
      success: true,
      data: summary,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order summary",
    };
  }
};

export const createOrder = async (data: unknown) => {
  const parsed = createOrderSchema.parse(data);
  try {
    const order = await orderService.create(parsed);
    return {
      success: true,
      data: order,
      message: "Order created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
};

export const updateOrder = async (data: unknown) => {
  const parsed = z.object({
    id: z.string().uuid(),
    data: updateOrderSchema,
  }).parse(data);
  try {
    const order = await orderService.update(parsed.id, parsed.data);
    return {
      success: true,
      data: order,
      message: "Order updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order",
    };
  }
};

export const deleteOrder = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    await orderService.delete(parsed.id);
    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
};

export const getOrderItems = async (data: unknown) => {
  const parsed = z.object({ orderId: z.string().uuid() }).parse(data);
  try {
    const items = await orderService.getOrderItems(parsed.orderId);
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order items",
    };
  }
};

export const getOrderStats = async () => {
  try {
    const stats = await orderService.getStats();
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order stats",
    };
  }
};
