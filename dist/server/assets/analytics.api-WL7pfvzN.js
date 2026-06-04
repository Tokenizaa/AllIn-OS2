import { c as createServerRpc } from "./createServerRpc-AqSTwo0z.js";
import { a as createServerFn } from "./server-8ECQmlZz.js";
import { z } from "zod";
import { B as BaseRepository } from "./base.repository-Cy7RPfvO.js";
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
class AnalyticsRepository extends BaseRepository {
  constructor() {
    super("analytics_plan_performance");
  }
  async getExecutiveAnalytics() {
    const { data: orders, error: ordersError } = await this.getClient().from("orders").select("valor_total_pedido, valor_total, created_at");
    if (ordersError) throw ordersError;
    const revenueRows = orders || [];
    const totalRevenue = revenueRows.reduce((sum, row) => sum + Number(row.valor_total_pedido || row.valor_total || 0), 0);
    const totalOrders = revenueRows.length;
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const { count: totalCustomers } = await this.getClient().from("customers").select("*", { count: "exact", head: true }).eq("status", "active");
    return {
      totalRevenue,
      totalOrders,
      totalCustomers: totalCustomers || 0,
      activeCustomers: totalCustomers || 0,
      averageOrderValue,
      revenueGrowth: 0,
      orderGrowth: 0,
      customerGrowth: 0
    };
  }
  async getSalesAnalytics(period = "30d") {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - days);
    const { data, error } = await this.getClient().from("orders").select("valor_total_pedido, valor_total, created_at").gte("created_at", startDate.toISOString());
    if (error) throw error;
    const rows = data || [];
    const totalRevenue = rows.reduce((sum, row) => sum + Number(row.valor_total_pedido || row.valor_total || 0), 0);
    const totalOrders = rows.length;
    return {
      period,
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      topProducts: [],
      dailySales: []
    };
  }
  async getNetworkAnalytics() {
    const { count: totalNetworkSize } = await this.getClient().from("customers").select("*", { count: "exact", head: true });
    const { count: activeDistributors } = await this.getClient().from("customers").select("*", { count: "exact", head: true }).eq("status", "active");
    return {
      totalNetworkSize: totalNetworkSize || 0,
      activeDistributors: activeDistributors || 0,
      averageDownlines: 0,
      topPerformers: [],
      depthDistribution: []
    };
  }
  async getPlanAnalytics() {
    const { data, error } = await this.getClient().from("analytics_plan_performance").select("*").order("total_customers", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  async getBonusDistribution() {
    const { data, error } = await this.getClient().from("analytics_bonus_distribution").select("*").order("total_bonus_pool", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  async getPlanAnalyticsById(planId) {
    const { data, error } = await this.getClient().from("analytics_plan_performance").select("*").eq("plan_id", planId).single();
    if (error) throw error;
    return data;
  }
}
class AnalyticsService {
  constructor() {
    this.repository = new AnalyticsRepository();
  }
  async getExecutiveAnalytics() {
    return this.repository.getExecutiveAnalytics();
  }
  async getSalesAnalytics(period = "30d") {
    return this.repository.getSalesAnalytics(period);
  }
  async getNetworkAnalytics() {
    return this.repository.getNetworkAnalytics();
  }
  async getPlanAnalytics() {
    const data = await this.repository.getPlanAnalytics();
    return data.map((item) => ({
      planId: item.plan_id,
      planName: item.plan_name,
      totalCustomers: item.total_customers,
      activeCustomers: item.active_customers,
      totalRevenue: item.total_revenue,
      averageRevenuePerCustomer: item.avg_revenue_per_customer,
      activeSubscriptions: item.active_subscriptions,
      newActivations30d: item.new_activations_30d
    }));
  }
  async getBonusDistribution() {
    const data = await this.repository.getBonusDistribution();
    return data.map((item) => ({
      planId: item.plan_id,
      planName: item.plan_name,
      totalBonusPool: item.total_bonus_pool,
      generationBonuses: item.generation_bonuses || [],
      directBonuses: item.direct_bonuses || []
    }));
  }
  async getPlanAnalyticsById(planId) {
    const data = await this.repository.getPlanAnalyticsById(planId);
    if (!data) return null;
    return {
      planId: data.plan_id,
      planName: data.plan_name,
      totalCustomers: data.total_customers,
      activeCustomers: data.active_customers,
      totalRevenue: data.total_revenue,
      averageRevenuePerCustomer: data.avg_revenue_per_customer,
      activeSubscriptions: data.active_subscriptions,
      newActivations30d: data.new_activations_30d
    };
  }
}
const analyticsService = new AnalyticsService();
const getExecutiveAnalytics_createServerFn_handler = createServerRpc({
  id: "81a73b8ea59ff8c4201be3a94a854eafc107fae4f202aaf84d5e7ca12bef2b24",
  name: "getExecutiveAnalytics",
  filename: "src/backend/modules/analytics/api/analytics.api.ts"
}, (opts) => getExecutiveAnalytics.__executeServer(opts));
const getExecutiveAnalytics = createServerFn({
  method: "GET"
}).handler(getExecutiveAnalytics_createServerFn_handler, async () => {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch executive analytics"
    };
  }
});
const getSalesAnalytics_createServerFn_handler = createServerRpc({
  id: "c3b424399ad40bb07153e8262281e95638880fba889fe7f407d257bc8ccc4cb0",
  name: "getSalesAnalytics",
  filename: "src/backend/modules/analytics/api/analytics.api.ts"
}, (opts) => getSalesAnalytics.__executeServer(opts));
const getSalesAnalytics = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    period: z.enum(["7d", "30d", "90d"]).default("30d")
  }).parse(data);
}).handler(getSalesAnalytics_createServerFn_handler, async ({
  data
}) => {
  try {
    const analytics = await analyticsService.getSalesAnalytics(data.period);
    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch sales analytics"
    };
  }
});
const getNetworkAnalytics_createServerFn_handler = createServerRpc({
  id: "fb0682465b166ed92f93a2b1ff34607c2397f36ecf4aeb3990ede6124281c5eb",
  name: "getNetworkAnalytics",
  filename: "src/backend/modules/analytics/api/analytics.api.ts"
}, (opts) => getNetworkAnalytics.__executeServer(opts));
const getNetworkAnalytics = createServerFn({
  method: "GET"
}).handler(getNetworkAnalytics_createServerFn_handler, async () => {
  try {
    const analytics = await analyticsService.getNetworkAnalytics();
    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch network analytics"
    };
  }
});
const getPlanAnalytics_createServerFn_handler = createServerRpc({
  id: "f0c29a1af2f7b8eab5409e48266d2f36269964776d9e47253124bedc9ca5dd9c",
  name: "getPlanAnalytics",
  filename: "src/backend/modules/analytics/api/analytics.api.ts"
}, (opts) => getPlanAnalytics.__executeServer(opts));
const getPlanAnalytics = createServerFn({
  method: "GET"
}).handler(getPlanAnalytics_createServerFn_handler, async () => {
  try {
    const analytics = await analyticsService.getPlanAnalytics();
    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan analytics"
    };
  }
});
const getPlanAnalyticsById_createServerFn_handler = createServerRpc({
  id: "32c52d638d81801ae60ffdcc10f6a0a222cf8c44a63254fb25b47b7d64799f17",
  name: "getPlanAnalyticsById",
  filename: "src/backend/modules/analytics/api/analytics.api.ts"
}, (opts) => getPlanAnalyticsById.__executeServer(opts));
const getPlanAnalyticsById = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    planId: z.string().uuid()
  }).parse(data);
}).handler(getPlanAnalyticsById_createServerFn_handler, async ({
  data
}) => {
  try {
    const analytics = await analyticsService.getPlanAnalyticsById(data.planId);
    if (!analytics) {
      return {
        success: false,
        error: "Plan analytics not found"
      };
    }
    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan analytics"
    };
  }
});
const getBonusDistribution_createServerFn_handler = createServerRpc({
  id: "f9207b79f05ed595f4c4694b78552f2f600307a0389a40a7844104b4f4d07533",
  name: "getBonusDistribution",
  filename: "src/backend/modules/analytics/api/analytics.api.ts"
}, (opts) => getBonusDistribution.__executeServer(opts));
const getBonusDistribution = createServerFn({
  method: "GET"
}).handler(getBonusDistribution_createServerFn_handler, async () => {
  try {
    const analytics = await analyticsService.getBonusDistribution();
    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bonus distribution"
    };
  }
});
export {
  getBonusDistribution_createServerFn_handler,
  getExecutiveAnalytics_createServerFn_handler,
  getNetworkAnalytics_createServerFn_handler,
  getPlanAnalyticsById_createServerFn_handler,
  getPlanAnalytics_createServerFn_handler,
  getSalesAnalytics_createServerFn_handler
};
