import { z } from "zod";
import { PlanService } from "../services/plan.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createPlanSchema, updatePlanSchema, createPlanBonusSchema, activateCustomerPlanSchema } from "../dto/plan.dto";

const planService = new PlanService();

export const getPlans = async (data: unknown) => {
  const parsed = paginationSchema.merge(filterSchema).parse(data);
  try {
    const result = await planService.findAll(parsed);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plans",
    };
  }
};

export const getPlanById = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    const plan = await planService.findById(parsed.id);
    if (!plan) {
      return {
        success: false,
        error: "Plan not found",
      };
    }
    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan",
    };
  }
};

export const createPlan = async (data: unknown) => {
  const parsed = createPlanSchema.parse(data);
  try {
    const plan = await planService.create(parsed);
    return {
      success: true,
      data: plan,
      message: "Plan created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create plan",
    };
  }
};

export const updatePlan = async (data: unknown) => {
  const parsed = z.object({
    id: z.string().uuid(),
    data: updatePlanSchema,
  }).parse(data);
  try {
    const plan = await planService.update(parsed.id, parsed.data);
    return {
      success: true,
      data: plan,
      message: "Plan updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update plan",
    };
  }
};

export const deletePlan = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    await planService.delete(parsed.id);
    return {
      success: true,
      message: "Plan deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete plan",
    };
  }
};

export const getPlanBonuses = async (data: unknown) => {
  const parsed = z.object({ planId: z.string().uuid() }).parse(data);
  try {
    const bonuses = await planService.getPlanBonuses(parsed.planId);
    return {
      success: true,
      data: bonuses,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan bonuses",
    };
  }
};

export const createPlanBonus = async (data: unknown) => {
  const parsed = createPlanBonusSchema.parse(data);
  try {
    const bonus = await planService.createPlanBonus(parsed);
    return {
      success: true,
      data: bonus,
      message: "Plan bonus created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create plan bonus",
    };
  }
};

export const deletePlanBonus = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    await planService.deletePlanBonus(parsed.id);
    return {
      success: true,
      message: "Plan bonus deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete plan bonus",
    };
  }
};

export const activateCustomerPlan = async (data: unknown) => {
  const parsed = activateCustomerPlanSchema.parse(data);
  try {
    const customerPlan = await planService.activateCustomerPlan(parsed);
    return {
      success: true,
      data: customerPlan,
      message: "Customer plan activated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to activate customer plan",
    };
  }
};

export const deactivateCustomerPlan = async (data: unknown) => {
  const parsed = z.object({ customerId: z.string().uuid() }).parse(data);
  try {
    await planService.deactivateCustomerPlan(parsed.customerId);
    return {
      success: true,
      message: "Customer plan deactivated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to deactivate customer plan",
    };
  }
};

export const getCustomerPlans = async (data: unknown) => {
  const parsed = z.object({ customerId: z.string().uuid() }).parse(data);
  try {
    const plans = await planService.getCustomerPlans(parsed.customerId);
    return {
      success: true,
      data: plans,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer plans",
    };
  }
};

export const getActiveCustomerPlan = async (data: unknown) => {
  const parsed = z.object({ customerId: z.string().uuid() }).parse(data);
  try {
    const plan = await planService.getActiveCustomerPlan(parsed.customerId);
    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch active customer plan",
    };
  }
};

export const getPlanStats = async (data: unknown) => {
  const parsed = z.object({ planId: z.string().uuid() }).parse(data);
  try {
    const stats = await planService.getPlanStats(parsed.planId);
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan stats",
    };
  }
};

export const getAllPlanStats = async () => {
  try {
    const stats = await planService.getAllPlanStats();
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan stats",
    };
  }
};
