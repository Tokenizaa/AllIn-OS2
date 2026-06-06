import { z } from "zod";
import { PaymentService } from "../services/payment.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createPaymentSchema, updatePaymentSchema, webhookPayloadSchema } from "../dto/payment.dto";

const paymentService = new PaymentService();

export const getPayments = async (data: unknown) => {
  const parsed = paginationSchema.merge(filterSchema).merge(
    z.object({
      customer_id: z.string().uuid().optional(),
      status: z.string().optional(),
    })
  ).parse(data);
  try {
    const result = await paymentService.findAll(parsed);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payments",
    };
  }
};

export const getPaymentById = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    const payment = await paymentService.findById(parsed.id);
    if (!payment) {
      return {
        success: false,
        error: "Payment not found",
      };
    }
    return {
      success: true,
      data: payment,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payment",
    };
  }
};

export const createPayment = async (data: unknown) => {
  const parsed = createPaymentSchema.parse(data);
  try {
    const payment = await paymentService.create(parsed);
    return {
      success: true,
      data: payment,
      message: "Payment created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment",
    };
  }
};

export const updatePayment = async (data: unknown) => {
  const parsed = z.object({
    id: z.string().uuid(),
    data: updatePaymentSchema,
  }).parse(data);
  try {
    const payment = await paymentService.update(parsed.id, parsed.data);
    return {
      success: true,
      data: payment,
      message: "Payment updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update payment",
    };
  }
};

export const deletePayment = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    await paymentService.delete(parsed.id);
    return {
      success: true,
      message: "Payment deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete payment",
    };
  }
};

export const processPaymentWebhook = async (data: unknown) => {
  const parsed = webhookPayloadSchema.parse(data);
  try {
    const payment = await paymentService.processWebhook(parsed);
    return {
      success: true,
      data: payment,
      message: "Webhook processed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process webhook",
    };
  }
};

export const getPaymentStats = async () => {
  try {
    const stats = await paymentService.getStats();
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payment stats",
    };
  }
};
