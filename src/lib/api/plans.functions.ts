import { z } from "zod";
import { supabase } from "../supabase/client";

// ============================================================================
// PLAN SERVICE
// ============================================================================

// Get all plans
export const getAllPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message || "Failed to fetch plans");
  }
  return data;
};

// Get plan bonuses
export const getPlanBonuses = async (data: { planId: string }) => {
  const parsed = z.object({ planId: z.string() }).parse(data);
  const { data: bonuses, error } = await supabase
    .from('plan_bonuses')
    .select('*')
    .eq('plan_id', parsed.planId);
  
  if (error) {
    throw new Error(error.message || "Failed to fetch plan bonuses");
  }
  return bonuses;
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

  const { data: plan, error } = await supabase
    .from('plans')
    .insert({
      ...parsed,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message || "Failed to create plan");
  }
  return plan;
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
  const { data: plan, error } = await supabase
    .from('plans')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message || "Failed to update plan");
  }
  return plan;
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

  const { data: bonus, error } = await supabase
    .from('plan_bonuses')
    .insert({
      ...parsed,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message || "Failed to create plan bonus");
  }
  return bonus;
};

// Delete plan bonus
export const deletePlanBonus = async (data: { id: string }) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  const { error } = await supabase
    .from('plan_bonuses')
    .delete()
    .eq('id', parsed.id);
  
  if (error) {
    throw new Error(error.message || "Failed to delete plan bonus");
  }
  return { success: true };
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

  const { data: customerPlan, error } = await supabase
    .from('customer_plans')
    .insert({
      ...parsed,
      is_active: true,
      activated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message || "Failed to activate customer plan");
  }
  return customerPlan;
};

// Deactivate customer plan
export const deactivateCustomerPlan = async (data: { id_comprador: string }) => {
  const parsed = z.object({ id_comprador: z.string() }).parse(data);
  const { error } = await supabase
    .from('customer_plans')
    .update({ is_active: false, deactivated_at: new Date().toISOString() })
    .eq('id_comprador', parsed.id_comprador);
  
  if (error) {
    throw new Error(error.message || "Failed to deactivate customer plan");
  }
  return { success: true };
};

// Get customer plan history
export const getCustomerPlanHistory = async (data: { id_comprador: string }) => {
  const parsed = z.object({ id_comprador: z.string() }).parse(data);
  const { data: plans, error } = await supabase
    .from('customer_plans')
    .select('*')
    .eq('id_comprador', parsed.id_comprador)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message || "Failed to fetch customer plan history");
  }
  return plans;
};

// Get analytics plan performance
export const getPlanAnalytics = async () => {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('*, customer_plans(count)');
  
  if (error) {
    throw new Error(error.message || "Failed to fetch plan analytics");
  }
  return plans;
};

// Get analytics bonus distribution
export const getBonusDistribution = async () => {
  const { data: bonuses, error } = await supabase
    .from('plan_bonuses')
    .select('*, plans(name)');
  
  if (error) {
    throw new Error(error.message || "Failed to fetch bonus distribution");
  }
  return bonuses;
};

// Get plan stats
export const getPlanStats = async () => {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('id, name, customer_plans(count)');
  
  if (error) {
    throw new Error(error.message || "Failed to fetch plan stats");
  }
  return plans;
};
