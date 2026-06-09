import { z } from "zod";
import {
  getPlans as getPlansApi,
  getPlanBonuses as getPlanBonusesApi,
  createPlan as createPlanApi,
  updatePlan as updatePlanApi,
  createPlanBonus as createPlanBonusApi,
  deletePlanBonus as deletePlanBonusApi,
  activateCustomerPlan as activateCustomerPlanApi,
  deactivateCustomerPlan as deactivateCustomerPlanApi,
  getCustomerPlans as getCustomerPlansApi,
  getPlanAnalytics as getPlanAnalyticsApi,
  getBonusDistribution as getBonusDistributionApi,
  getPlanStats as getPlanStatsApi,
} from "../../backend/api";

// ============================================================================
// PLAN SERVICE
// ============================================================================

// Get all plans
export const getAllPlans = async () => {
  const result = await (getPlansApi as any)();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plans");
  }
  return (result.data as any)?.data;
};

// Get plan bonuses
export const getPlanBonuses = async (data: { planId: string }) => {
  const parsed = z.object({ planId: z.string() }).parse(data);
  const result = await getPlanBonusesApi({ planId: parsed.planId });
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plan bonuses");
  }
  return result.data;
};

// Create plan
export const createPlan = async (data: {
  name: string;
  slug: string;
  description?: string;
  price: number;
  activation_fee?: number;
  plan_type?: string;
  is_affiliate?: boolean;
  is_active?: boolean;
  max_generations?: number;
  direct_bonus_percentage?: number;
  metadata?: any;
}) => {
  const parsed = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0),
    activation_fee: z.number().min(0).default(0),
    plan_type: z.string().optional(),
    is_affiliate: z.boolean().default(false),
    is_active: z.boolean().default(true),
    max_generations: z.number().min(1).default(1),
    direct_bonus_percentage: z.number().min(0).max(100).default(0),
    metadata: z.record(z.any()).optional(),
  }).parse(data);

  const result = await createPlanApi(parsed);
  if (!result.success) {
    throw new Error(result.error || "Failed to create plan");
  }
  return result.data;
};

// Update plan
export const updatePlan = async (data: {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  activation_fee?: number;
  plan_type?: string;
  is_affiliate?: boolean;
  is_active?: boolean;
  max_generations?: number;
  direct_bonus_percentage?: number;
  metadata?: any;
}) => {
  const parsed = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    activation_fee: z.number().min(0).optional(),
    plan_type: z.string().optional(),
    is_affiliate: z.boolean().optional(),
    is_active: z.boolean().optional(),
    max_generations: z.number().min(1).optional(),
    direct_bonus_percentage: z.number().min(0).max(100).optional(),
    metadata: z.record(z.any()).optional(),
  }).parse(data);

  const { id, ...updateData } = parsed;
  const result = await updatePlanApi({ id, data: updateData });
  if (!result.success) {
    throw new Error(result.error || "Failed to update plan");
  }
  return result.data;
};

// Create plan bonus
export const createPlanBonus = async (data: {
  plan_id: string;
  generation: number;
  bonus_percentage: number;
  required_directs?: number;
  bonus_type?: string;
}) => {
  const parsed = z.object({
    plan_id: z.string().uuid(),
    generation: z.number().min(0),
    bonus_percentage: z.number().min(0).max(100),
    required_directs: z.number().min(0).default(0),
    bonus_type: z.string().default("generation"),
  }).parse(data);

  const result = await createPlanBonusApi(parsed);
  if (!result.success) {
    throw new Error(result.error || "Failed to create plan bonus");
  }
  return result.data;
};

// Delete plan bonus
export const deletePlanBonus = async (data: { id: string }) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  const result = await deletePlanBonusApi({ id: parsed.id });
  if (!result.success) {
    throw new Error(result.error || "Failed to delete plan bonus");
  }
  return result;
};

// Activate customer plan
export const activateCustomerPlan = async (data: {
  id_comprador: string;
  plan_id: string;
  expires_at?: string;
}) => {
  const parsed = z.object({
    id_comprador: z.string(),
    plan_id: z.string().uuid(),
    expires_at: z.string().optional(),
  }).parse(data);

  const result = await activateCustomerPlanApi(parsed);
  if (!result.success) {
    throw new Error(result.error || "Failed to activate customer plan");
  }
  return result.data;
};

// Deactivate customer plan
export const deactivateCustomerPlan = async (data: { id_comprador: string }) => {
  const parsed = z.object({ id_comprador: z.string() }).parse(data);
  const result = await deactivateCustomerPlanApi({ id_comprador: parsed.id_comprador });
  if (!result.success) {
    throw new Error(result.error || "Failed to deactivate customer plan");
  }
  return result;
};

// Get customer plan history
export const getCustomerPlanHistory = async (data: { id_comprador: string }) => {
  const parsed = z.object({ id_comprador: z.string() }).parse(data);
  const result = await getCustomerPlansApi({ id_comprador: parsed.id_comprador });
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch customer plan history");
  }
  return (result.data as any).data;
};

// Get analytics plan performance
export const getPlanAnalytics = async () => {
  const result = await getPlanAnalyticsApi();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plan analytics");
  }
  return result.data;
};

// Get analytics bonus distribution
export const getBonusDistribution = async () => {
  const result = await getBonusDistributionApi();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch bonus distribution");
  }
  return result.data;
};

// Get plan stats
export const getPlanStats = async () => {
  const result = await (getPlanStatsApi as any)();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plan stats");
  }
  return result.data;
};
