import { c as createServerRpc } from "./createServerRpc-DVlpEVy8.js";
import { a as createServerFn } from "./server-DdVc0fX6.js";
import { z } from "zod";
import { B as BaseRepository } from "./base.repository-C1yp6j9c.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { p as paginationSchema, f as filterSchema } from "./pagination.dto-D6rx1FA4.js";
import { c as createPaymentSchema, u as updatePaymentSchema, w as webhookPayloadSchema } from "./payment.dto-BSYPhuVH.js";
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
class PaymentRepository extends BaseRepository {
  constructor() {
    super("payments");
  }
  async findByOrderId(orderId) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("order_id", orderId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  async findByCustomerId(customerId, options) {
    let query = this.getClient().from(this.tableName).select("*").eq("customer_id", customerId);
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
  async findByGatewayTransactionId(transactionId) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("gateway_transaction_id", transactionId).single();
    if (error) throw error;
    return data;
  }
  async countByStatus(status) {
    const { count, error } = await this.getClient().from(this.tableName).select("*", { count: "exact", head: true }).eq("status", status);
    if (error) throw error;
    return count || 0;
  }
  async getTotalRevenue() {
    const { data, error } = await this.getClient().from(this.tableName).select("amount").eq("status", "approved");
    if (error) throw error;
    return data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  }
  async getRevenueByPeriod(startDate, endDate) {
    const { data, error } = await this.getClient().from(this.tableName).select("amount").gte("paid_at", startDate.toISOString()).lte("paid_at", endDate.toISOString()).eq("status", "approved");
    if (error) throw error;
    return data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  }
}
class LoggerService {
  constructor() {
    this.logs = [];
    this.maxLogs = 1e3;
  }
  static getInstance() {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }
  log(level, message, context, metadata) {
    const entry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level,
      message,
      context,
      metadata
    };
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
  debug(message, context, metadata) {
    this.log("debug", message, context, metadata);
  }
  info(message, context, metadata) {
    this.log("info", message, context, metadata);
  }
  warn(message, context, metadata) {
    this.log("warn", message, context, metadata);
  }
  error(message, context, metadata) {
    this.log("error", message, context, metadata);
  }
  getLogs(level, context) {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }
    if (context) {
      filtered = filtered.filter((log) => log.context === context);
    }
    return filtered;
  }
  clearLogs() {
    this.logs = [];
  }
}
const logger = LoggerService.getInstance();
const _GatewayAdapterFactory = class _GatewayAdapterFactory {
  static registerAdapter(type, adapter) {
    this.adapters.set(type, adapter);
    logger.info(`Registered gateway adapter: ${type}`, "gateway-factory");
  }
  static getAdapter(type) {
    const adapter = this.adapters.get(type);
    if (!adapter) {
      logger.error(`Gateway adapter not found: ${type}`, "gateway-factory");
      return null;
    }
    return adapter;
  }
  static hasAdapter(type) {
    return this.adapters.has(type);
  }
  static getRegisteredAdapters() {
    return Array.from(this.adapters.keys());
  }
};
_GatewayAdapterFactory.adapters = /* @__PURE__ */ new Map();
let GatewayAdapterFactory = _GatewayAdapterFactory;
class RetryQueueService {
  constructor() {
    this.isProcessing = false;
    this.intervalId = null;
    this.startProcessing();
  }
  static getInstance() {
    if (!RetryQueueService.instance) {
      RetryQueueService.instance = new RetryQueueService();
    }
    return RetryQueueService.instance;
  }
  async scheduleRetry(paymentId, payload, delaySeconds = 60) {
    logger.info("Scheduling payment retry", "retry-queue", { paymentId, delaySeconds });
    try {
      const { error } = await supabase.from("payment_attempts").insert({
        payment_id: paymentId,
        attempt_number: 1,
        status: "pending",
        retry_at: new Date(Date.now() + delaySeconds * 1e3).toISOString()
      });
      if (error) {
        logger.error("Failed to schedule retry", "retry-queue", { error, paymentId });
      }
    } catch (error) {
      logger.error("Error scheduling retry", "retry-queue", { error });
    }
  }
  async incrementRetryAttempt(paymentId, delaySeconds = 120) {
    logger.info("Incrementing retry attempt", "retry-queue", { paymentId });
    try {
      const { data: currentAttempt } = await supabase.from("payment_attempts").select("attempt_number").eq("payment_id", paymentId).order("attempt_number", { ascending: false }).limit(1).single();
      const nextAttempt = (currentAttempt?.attempt_number || 0) + 1;
      const { error } = await supabase.from("payment_attempts").insert({
        payment_id: paymentId,
        attempt_number: nextAttempt,
        status: "pending",
        retry_at: new Date(Date.now() + delaySeconds * 1e3).toISOString()
      });
      if (error) {
        logger.error("Failed to increment retry attempt", "retry-queue", { error, paymentId });
      }
    } catch (error) {
      logger.error("Error incrementing retry attempt", "retry-queue", { error });
    }
  }
  startProcessing() {
    this.intervalId = setInterval(() => {
      this.processPendingRetries();
    }, 3e4);
    logger.info("Retry queue processing started", "retry-queue");
  }
  async processPendingRetries() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    try {
      const { data: pendingRetries, error } = await supabase.from("payment_attempts").select("*").eq("status", "pending").lte("retry_at", (/* @__PURE__ */ new Date()).toISOString()).order("retry_at", { ascending: true }).limit(20);
      if (error) {
        logger.error("Failed to fetch pending retries", "retry-queue", { error });
        return;
      }
      if (!pendingRetries || pendingRetries.length === 0) {
        return;
      }
      logger.info(`Processing ${pendingRetries.length} pending retries`, "retry-queue");
      for (const retry of pendingRetries) {
        await this.processRetry(retry);
      }
    } catch (error) {
      logger.error("Error processing pending retries", "retry-queue", { error });
    } finally {
      this.isProcessing = false;
    }
  }
  async processRetry(retry) {
    logger.info("Processing retry", "retry-queue", { paymentId: retry.payment_id, attemptNumber: retry.attempt_number });
    try {
      await supabase.from("payment_attempts").update({ status: "processing" }).eq("id", retry.id);
      const { paymentService: paymentService2 } = await Promise.resolve().then(() => payment_service);
      const result = await paymentService2.retryPayment(retry.payment_id);
      if (result.success) {
        await supabase.from("payment_attempts").update({ status: "success" }).eq("id", retry.id);
        logger.info("Retry successful", "retry-queue", { paymentId: retry.payment_id });
      } else {
        await supabase.from("payment_attempts").update({
          status: "failed",
          error_message: result.error || "Retry failed"
        }).eq("id", retry.id);
        if (retry.attempt_number < 3) {
          const delaySeconds = Math.pow(2, retry.attempt_number) * 60;
          await this.incrementRetryAttempt(retry.payment_id, delaySeconds);
        } else {
          logger.error("Max retry attempts reached", "retry-queue", { paymentId: retry.payment_id });
        }
      }
    } catch (error) {
      logger.error("Error processing retry", "retry-queue", { error, paymentId: retry.payment_id });
      await supabase.from("payment_attempts").update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error"
      }).eq("id", retry.id);
    }
  }
  stopProcessing() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info("Retry queue processing stopped", "retry-queue");
    }
  }
  async getRetryStatus(paymentId) {
    try {
      const { data, error } = await supabase.from("payment_attempts").select("*").eq("payment_id", paymentId).order("attempt_number", { ascending: false }).limit(10);
      if (error) {
        logger.error("Failed to get retry status", "retry-queue", { error });
        return null;
      }
      return data;
    } catch (error) {
      logger.error("Error getting retry status", "retry-queue", { error });
      return null;
    }
  }
}
const retryQueueService = RetryQueueService.getInstance();
class EventEmitter {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
    this.subscriptions = [];
  }
  subscribe(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, /* @__PURE__ */ new Set());
    }
    this.handlers.get(eventType).add(handler);
    const subscription = { eventType, handler };
    this.subscriptions.push(subscription);
    return () => {
      this.unsubscribe(eventType, handler);
    };
  }
  unsubscribe(eventType, handler) {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
    this.subscriptions = this.subscriptions.filter(
      (sub) => !(sub.eventType === eventType && sub.handler === handler)
    );
  }
  async emit(event) {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      const promises = Array.from(handlers).map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });
      await Promise.all(promises);
    }
  }
  async emitAsync(event) {
    setImmediate(async () => {
      await this.emit(event);
    });
  }
  getSubscriptions() {
    return [...this.subscriptions];
  }
  clear() {
    this.handlers.clear();
    this.subscriptions = [];
  }
}
const eventEmitter = new EventEmitter();
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2["CUSTOMER_CREATED"] = "customer.created";
  EventType2["CUSTOMER_UPDATED"] = "customer.updated";
  EventType2["CUSTOMER_DELETED"] = "customer.deleted";
  EventType2["CUSTOMER_ACTIVATED"] = "customer.activated";
  EventType2["CUSTOMER_DEACTIVATED"] = "customer.deactivated";
  EventType2["ORDER_CREATED"] = "order.created";
  EventType2["ORDER_UPDATED"] = "order.updated";
  EventType2["ORDER_CANCELLED"] = "order.cancelled";
  EventType2["ORDER_SHIPPED"] = "order.shipped";
  EventType2["ORDER_DELIVERED"] = "order.delivered";
  EventType2["PAYMENT_CREATED"] = "payment.created";
  EventType2["PAYMENT_APPROVED"] = "payment.approved";
  EventType2["PAYMENT_REJECTED"] = "payment.rejected";
  EventType2["PAYMENT_REFUNDED"] = "payment.refunded";
  EventType2["PAYMENT_CANCELLED"] = "payment.cancelled";
  EventType2["PAYMENT_PENDING"] = "payment.pending";
  EventType2["WALLET_CREDITED"] = "wallet.credited";
  EventType2["WALLET_DEBITED"] = "wallet.debited";
  EventType2["BONUS_EARNED"] = "bonus.earned";
  EventType2["BONUS_USED"] = "bonus.used";
  EventType2["POINTS_EARNED"] = "points.earned";
  EventType2["POINTS_REDEEMED"] = "points.redeemed";
  EventType2["PLAN_ACTIVATED"] = "plan.activated";
  EventType2["PLAN_DEACTIVATED"] = "plan.deactivated";
  EventType2["PLAN_UPGRADED"] = "plan.upgraded";
  EventType2["PLAN_DOWNGRADED"] = "plan.downgraded";
  EventType2["BONUS_GENERATED"] = "bonus.generated";
  EventType2["BONUS_DISTRIBUTED"] = "bonus.distributed";
  EventType2["NETWORK_JOINED"] = "network.joined";
  EventType2["NETWORK_LEFT"] = "network.left";
  return EventType2;
})(EventType || {});
class PaymentService {
  constructor() {
    this.repository = new PaymentRepository();
  }
  async findAll(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    let payments;
    let total;
    if (params.customer_id) {
      payments = await this.repository.findByCustomerId(params.customer_id, { limit, offset });
      total = await this.repository.count();
    } else if (params.status) {
      payments = await this.repository.findByStatus(params.status, { limit, offset });
      total = await this.repository.countByStatus(params.status);
    } else {
      payments = await this.repository.findAll({ limit, offset });
      total = await this.repository.count();
    }
    return {
      data: payments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async findById(id) {
    return this.repository.findById(id);
  }
  async create(dto) {
    return this.repository.create({
      ...dto,
      status: "pending",
      gateway_transaction_id: null,
      gateway_response: null,
      paid_at: null,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async createPayment(request, gatewayType) {
    logger.info("Creating payment", "payment-service", { amount: request.amount, method: request.paymentMethod, gateway: gatewayType });
    try {
      const adapter = GatewayAdapterFactory.getAdapter(gatewayType);
      if (!adapter) {
        throw new Error(`Gateway adapter not found: ${gatewayType}`);
      }
      const payment = await this.repository.create({
        customer_id: request.customerId,
        order_id: request.orderId,
        amount: request.amount,
        amount_paid: 0,
        currency: request.currency,
        status: "pending",
        payment_method_type: request.paymentMethod,
        gateway_transaction_id: null,
        gateway_response: null,
        metadata: request.metadata,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      const gatewayResponse = await adapter.createPayment(request);
      if (gatewayResponse.success) {
        await this.repository.update(payment.id, {
          gateway_transaction_id: gatewayResponse.gatewayTransactionId,
          gateway_response: gatewayResponse.metadata,
          status: gatewayResponse.status,
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          ...gatewayResponse.status === "approved" && { approved_at: (/* @__PURE__ */ new Date()).toISOString() }
        });
        eventEmitter.emit({
          type: EventType.PAYMENT_CREATED,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          data: {
            paymentId: payment.id,
            customerId: request.customerId,
            orderId: request.orderId,
            amount: request.amount,
            status: gatewayResponse.status
          }
        });
        logger.info("Payment created successfully", "payment-service", { paymentId: payment.id, status: gatewayResponse.status });
        return {
          ...gatewayResponse,
          paymentId: payment.id
        };
      } else {
        await retryQueueService.scheduleRetry(payment.id, request);
        await this.repository.update(payment.id, {
          status: "failed",
          gateway_response: gatewayResponse.metadata,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        logger.error("Payment creation failed", "payment-service", { paymentId: payment.id, error: gatewayResponse.message });
        return gatewayResponse;
      }
    } catch (error) {
      logger.error("Payment creation error", "payment-service", { error });
      throw error;
    }
  }
  async retryPayment(paymentId) {
    logger.info("Retrying payment", "payment-service", { paymentId });
    try {
      const payment = await this.repository.findById(paymentId);
      if (!payment) {
        return { success: false, error: "Payment not found" };
      }
      const gatewayType = payment.metadata?.gatewayType || "belluno";
      const adapter = GatewayAdapterFactory.getAdapter(gatewayType);
      if (!adapter) {
        return { success: false, error: "Gateway adapter not found" };
      }
      const request = {
        amount: payment.amount,
        currency: payment.currency || "BRL",
        customerId: payment.customer_id,
        orderId: payment.order_id,
        paymentMethod: payment.payment_method_type || payment.payment_method,
        metadata: payment.metadata || void 0
      };
      const gatewayResponse = await adapter.createPayment(request);
      if (gatewayResponse.success) {
        await this.repository.update(paymentId, {
          gateway_transaction_id: gatewayResponse.gatewayTransactionId,
          gateway_response: gatewayResponse.metadata,
          status: gatewayResponse.status,
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          ...gatewayResponse.status === "approved" && { approved_at: (/* @__PURE__ */ new Date()).toISOString() }
        });
        logger.info("Payment retry successful", "payment-service", { paymentId });
        return { success: true };
      } else {
        await this.repository.update(paymentId, {
          status: "failed",
          gateway_response: gatewayResponse.metadata,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        return { success: false, error: gatewayResponse.message };
      }
    } catch (error) {
      logger.error("Payment retry error", "payment-service", { error, paymentId });
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
  async update(id, dto) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Payment not found");
    }
    return this.repository.update(id, {
      ...dto,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async delete(id) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Payment not found");
    }
    await this.repository.delete(id);
  }
  async processWebhook(payload) {
    logger.info("Processing webhook", "payment-service", { event: payload.event });
    const { event, data } = payload;
    try {
      if (event === "payment.approved") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          const updated = await this.repository.update(payment.id, {
            status: "approved",
            amount_paid: payment.amount,
            paid_at: (/* @__PURE__ */ new Date()).toISOString(),
            gateway_response: data,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          });
          eventEmitter.emit({
            type: EventType.PAYMENT_APPROVED,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            data: {
              paymentId: payment.id,
              customerId: payment.customer_id,
              orderId: payment.order_id,
              amount: payment.amount
            }
          });
          return updated;
        }
      } else if (event === "payment.rejected" || event === "payment.failed") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          const updated = await this.repository.update(payment.id, {
            status: "failed",
            gateway_response: data,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          });
          eventEmitter.emit({
            type: EventType.PAYMENT_REJECTED,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            data: {
              paymentId: payment.id,
              customerId: payment.customer_id,
              orderId: payment.order_id,
              amount: payment.amount
            }
          });
          return updated;
        }
      } else if (event === "payment.refunded") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          const updated = await this.repository.update(payment.id, {
            status: "refunded",
            gateway_response: data,
            refunded_at: (/* @__PURE__ */ new Date()).toISOString(),
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          });
          eventEmitter.emit({
            type: EventType.PAYMENT_REFUNDED,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            data: {
              paymentId: payment.id,
              customerId: payment.customer_id,
              orderId: payment.order_id,
              amount: payment.amount
            }
          });
          return updated;
        }
      } else if (event === "payment.cancelled") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          return this.repository.update(payment.id, {
            status: "cancelled",
            gateway_response: data,
            cancelled_at: (/* @__PURE__ */ new Date()).toISOString(),
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      return null;
    } catch (error) {
      logger.error("Webhook processing error", "payment-service", { error });
      return null;
    }
  }
  async getStats() {
    const [totalPayments, pendingPayments, approvedPayments, rejectedPayments, refundedPayments, totalRevenue] = await Promise.all([
      this.repository.count(),
      this.repository.countByStatus("pending"),
      this.repository.countByStatus("approved"),
      this.repository.countByStatus("rejected"),
      this.repository.countByStatus("refunded"),
      this.repository.getTotalRevenue()
    ]);
    return {
      totalPayments,
      pendingPayments,
      approvedPayments,
      rejectedPayments,
      refundedPayments,
      totalRevenue
    };
  }
  async getRevenueByPeriod(startDate, endDate) {
    return this.repository.getRevenueByPeriod(startDate, endDate);
  }
}
const paymentService$1 = new PaymentService();
const payment_service = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PaymentService,
  paymentService: paymentService$1
}, Symbol.toStringTag, { value: "Module" }));
const paymentService = new PaymentService();
const getPayments_createServerFn_handler = createServerRpc({
  id: "76ad2c9281fd9f60011c8d30032b92d44b9c64b096a8659a7873e12ddec1ee24",
  name: "getPayments",
  filename: "src/backend/modules/payments/api/payments.api.ts"
}, (opts) => getPayments.__executeServer(opts));
const getPayments = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).merge(z.object({
    customer_id: z.string().uuid().optional(),
    status: z.string().optional()
  })).parse(data);
}).handler(getPayments_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await paymentService.findAll(data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payments"
    };
  }
});
const getPaymentById_createServerFn_handler = createServerRpc({
  id: "dd248f39a83469c7d361e3680b1a32a1d309044a0499d5dfcfb6b525705d504a",
  name: "getPaymentById",
  filename: "src/backend/modules/payments/api/payments.api.ts"
}, (opts) => getPaymentById.__executeServer(opts));
const getPaymentById = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(getPaymentById_createServerFn_handler, async ({
  data
}) => {
  try {
    const payment = await paymentService.findById(data.id);
    if (!payment) {
      return {
        success: false,
        error: "Payment not found"
      };
    }
    return {
      success: true,
      data: payment
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payment"
    };
  }
});
const createPayment_createServerFn_handler = createServerRpc({
  id: "583003cff818fc47b6b5ada90eaace02aa854f2f8729d444ddb1549e1831a2af",
  name: "createPayment",
  filename: "src/backend/modules/payments/api/payments.api.ts"
}, (opts) => createPayment.__executeServer(opts));
const createPayment = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createPaymentSchema.parse(data);
}).handler(createPayment_createServerFn_handler, async ({
  data
}) => {
  try {
    const payment = await paymentService.create(data);
    return {
      success: true,
      data: payment,
      message: "Payment created successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment"
    };
  }
});
const updatePayment_createServerFn_handler = createServerRpc({
  id: "f60025c745c86a893362d8b3ed78d1b9ec647cb68811a250081744f38661de3b",
  name: "updatePayment",
  filename: "src/backend/modules/payments/api/payments.api.ts"
}, (opts) => updatePayment.__executeServer(opts));
const updatePayment = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid(),
    data: updatePaymentSchema
  }).parse(data);
}).handler(updatePayment_createServerFn_handler, async ({
  data
}) => {
  try {
    const payment = await paymentService.update(data.id, data.data);
    return {
      success: true,
      data: payment,
      message: "Payment updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update payment"
    };
  }
});
const deletePayment_createServerFn_handler = createServerRpc({
  id: "5d640bfa64aa445b91cf37ec73d4977011228a8e66662f6665cb9158763d0c8a",
  name: "deletePayment",
  filename: "src/backend/modules/payments/api/payments.api.ts"
}, (opts) => deletePayment.__executeServer(opts));
const deletePayment = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(deletePayment_createServerFn_handler, async ({
  data
}) => {
  try {
    await paymentService.delete(data.id);
    return {
      success: true,
      message: "Payment deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete payment"
    };
  }
});
const processPaymentWebhook_createServerFn_handler = createServerRpc({
  id: "58effe2d275d301a43852edbe632f55514e21de45d0d8218a6d549501485e0ea",
  name: "processPaymentWebhook",
  filename: "src/backend/modules/payments/api/payments.api.ts"
}, (opts) => processPaymentWebhook.__executeServer(opts));
const processPaymentWebhook = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return webhookPayloadSchema.parse(data);
}).handler(processPaymentWebhook_createServerFn_handler, async ({
  data
}) => {
  try {
    const payment = await paymentService.processWebhook(data);
    return {
      success: true,
      data: payment,
      message: "Webhook processed successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process webhook"
    };
  }
});
const getPaymentStats_createServerFn_handler = createServerRpc({
  id: "2ea986054725e9711cffaad782f4011a61391904fdc64d1ca0867e396eecdb65",
  name: "getPaymentStats",
  filename: "src/backend/modules/payments/api/payments.api.ts"
}, (opts) => getPaymentStats.__executeServer(opts));
const getPaymentStats = createServerFn({
  method: "GET"
}).handler(getPaymentStats_createServerFn_handler, async () => {
  try {
    const stats = await paymentService.getStats();
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payment stats"
    };
  }
});
export {
  createPayment_createServerFn_handler,
  deletePayment_createServerFn_handler,
  getPaymentById_createServerFn_handler,
  getPaymentStats_createServerFn_handler,
  getPayments_createServerFn_handler,
  processPaymentWebhook_createServerFn_handler,
  updatePayment_createServerFn_handler
};
