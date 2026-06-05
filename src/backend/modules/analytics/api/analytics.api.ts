import { z } from "zod";
import { AnalyticsService } from "../services/analytics.service";

const analyticsService = new AnalyticsService();

export const getExecutiveAnalytics = async () => {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch executive analytics",
    };
  }
};

export const getSalesAnalytics = async (data: unknown) => {
  const parsed = z.object({
    period: z.enum(["7d", "30d", "90d"]).default("30d"),
  }).parse(data);
  try {
    const analytics = await analyticsService.getSalesAnalytics(parsed.period);
    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch sales analytics",
    };
  }
};

export const getNetworkAnalytics = async () => {
  try {
    const analytics = await analyticsService.getNetworkAnalytics();
    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch network analytics",
    };
  }
};

export const getPlanAnalytics = async () => {
  try {
    const analytics = await analyticsService.getPlanAnalytics();
    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan analytics",
    };
  }
};

export const getPlanAnalyticsById = async (data: unknown) => {
  const parsed = z.object({ planId: z.string().uuid() }).parse(data);
  try {
    const analytics = await analyticsService.getPlanAnalyticsById(parsed.planId);
    if (!analytics) {
      return {
        success: false,
        error: "Plan analytics not found",
      };
    }
    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan analytics",
    };
  }
};

export const getBonusDistribution = async () => {
  try {
    const analytics = await analyticsService.getBonusDistribution();
    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bonus distribution",
    };
  }
};
