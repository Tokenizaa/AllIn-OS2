import { c as createServerRpc } from "./createServerRpc-_p3nJ_R1.js";
import { a as createServerFn } from "./server-zSNg87Zb.js";
import { z } from "zod";
import { B as BaseRepository } from "./base.repository-C1yp6j9c.js";
import { p as paginationSchema, f as filterSchema } from "./pagination.dto-D6rx1FA4.js";
import { c as createPlanSchema, u as updatePlanSchema, a as createPlanBonusSchema, b as activateCustomerPlanSchema } from "./plan.dto-CxZ8ZLMS.js";
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
class PlanRepository extends BaseRepository {
  constructor() {
    super("plans");
  }
  async findBySlug(slug) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("slug", slug).single();
    if (error) throw error;
    return data;
  }
  async findActive() {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("is_active", true).order("price", { ascending: true });
    if (error) throw error;
    return data || [];
  }
  async findAffiliatePlans() {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("is_affiliate", true).eq("is_active", true).order("price", { ascending: true });
    if (error) throw error;
    return data || [];
  }
}
class PlanBonusRepository extends BaseRepository {
  constructor() {
    super("plan_bonuses");
  }
  async findByPlanId(planId) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("plan_id", planId).order("generation", { ascending: true });
    if (error) throw error;
    return data || [];
  }
  async findByPlanIdAndType(planId, bonusType) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("plan_id", planId).eq("bonus_type", bonusType).order("generation", { ascending: true });
    if (error) throw error;
    return data || [];
  }
  async deleteByPlanId(planId) {
    const { error } = await this.getClient().from(this.tableName).delete().eq("plan_id", planId);
    if (error) throw error;
  }
}
class CustomerPlanRepository extends BaseRepository {
  constructor() {
    super("customer_plans");
  }
  async findByCustomerId(customerId) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("customer_id", customerId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  async findActiveByCustomerId(customerId) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("customer_id", customerId).eq("status", "active").single();
    if (error) throw error;
    return data;
  }
  async findByPlanId(planId, options) {
    let query = this.getClient().from(this.tableName).select("*").eq("plan_id", planId);
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
  async activatePlan(dto) {
    const { data, error } = await this.getClient().from(this.tableName).insert({
      customer_id: dto.customer_id,
      plan_id: dto.plan_id,
      status: "active",
      activated_at: (/* @__PURE__ */ new Date()).toISOString(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) throw error;
    return data;
  }
  async deactivatePlan(customerId) {
    const { error } = await this.getClient().from(this.tableName).update({ status: "inactive" }).eq("customer_id", customerId).eq("status", "active");
    if (error) throw error;
  }
  async countByPlanId(planId) {
    const { count, error } = await this.getClient().from(this.tableName).select("*", { count: "exact", head: true }).eq("plan_id", planId).eq("status", "active");
    if (error) throw error;
    return count || 0;
  }
}
class PlanService {
  constructor() {
    this.planRepository = new PlanRepository();
    this.planBonusRepository = new PlanBonusRepository();
    this.customerPlanRepository = new CustomerPlanRepository();
  }
  async findAll(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    let plans;
    let total;
    if (params.is_active !== void 0 || params.is_affiliate !== void 0) {
      if (params.is_affiliate) {
        plans = await this.planRepository.findAffiliatePlans();
        total = plans.length;
        plans = plans.slice(offset, offset + limit);
      } else if (params.is_active !== void 0) {
        plans = await this.planRepository.findActive();
        total = plans.length;
        plans = plans.slice(offset, offset + limit);
      } else {
        const result = await this.planRepository.findAll({ limit, offset });
        plans = result;
        total = await this.planRepository.count();
      }
    } else {
      plans = await this.planRepository.findAll({ limit, offset });
      total = await this.planRepository.count();
    }
    return {
      data: plans,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async findById(id) {
    return this.planRepository.findById(id);
  }
  async findBySlug(slug) {
    return this.planRepository.findBySlug(slug);
  }
  async create(dto) {
    return this.planRepository.create({
      ...dto,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async update(id, dto) {
    const existing = await this.planRepository.findById(id);
    if (!existing) {
      throw new Error("Plan not found");
    }
    return this.planRepository.update(id, {
      ...dto,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async delete(id) {
    const existing = await this.planRepository.findById(id);
    if (!existing) {
      throw new Error("Plan not found");
    }
    await this.planBonusRepository.deleteByPlanId(id);
    await this.planRepository.delete(id);
  }
  async getPlanBonuses(planId) {
    return this.planBonusRepository.findByPlanId(planId);
  }
  async createPlanBonus(dto) {
    return this.planBonusRepository.create({
      ...dto,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async deletePlanBonus(id) {
    await this.planBonusRepository.delete(id);
  }
  async activateCustomerPlan(dto) {
    const existingActive = await this.customerPlanRepository.findActiveByCustomerId(dto.customer_id);
    if (existingActive) {
      throw new Error("Customer already has an active plan");
    }
    const plan = await this.planRepository.findById(dto.plan_id);
    if (!plan) {
      throw new Error("Plan not found");
    }
    if (!plan.is_active) {
      throw new Error("Plan is not active");
    }
    return this.customerPlanRepository.activatePlan(dto);
  }
  async deactivateCustomerPlan(customerId) {
    await this.customerPlanRepository.deactivatePlan(customerId);
  }
  async getCustomerPlans(customerId) {
    return this.customerPlanRepository.findByCustomerId(customerId);
  }
  async getActiveCustomerPlan(customerId) {
    return this.customerPlanRepository.findActiveByCustomerId(customerId);
  }
  async getPlanStats(planId) {
    const totalCustomers = await this.customerPlanRepository.countByPlanId(planId);
    return {
      totalCustomers,
      activeCustomers: totalCustomers
      // Only count active plans
    };
  }
  async getAllPlanStats() {
    const plans = await this.planRepository.findActive();
    const stats = await Promise.all(
      plans.map(async (plan) => {
        const totalCustomers = await this.customerPlanRepository.countByPlanId(plan.id);
        return {
          planId: plan.id,
          planName: plan.name,
          totalCustomers
        };
      })
    );
    return stats;
  }
}
const planService = new PlanService();
const getPlans_createServerFn_handler = createServerRpc({
  id: "53d4862efd81578aebf22c5b2c92e8824a369a374f6d4117bcdc8336a14988d0",
  name: "getPlans",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getPlans.__executeServer(opts));
const getPlans = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).merge(z.object({
    is_active: z.coerce.boolean().optional(),
    is_affiliate: z.coerce.boolean().optional()
  })).parse(data);
}).handler(getPlans_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await planService.findAll(data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plans"
    };
  }
});
const getPlanById_createServerFn_handler = createServerRpc({
  id: "846ee4e3894d176a77f402a547bc74a46f6ae29396900bab35a0489e44d7cce5",
  name: "getPlanById",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getPlanById.__executeServer(opts));
const getPlanById = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(getPlanById_createServerFn_handler, async ({
  data
}) => {
  try {
    const plan = await planService.findById(data.id);
    if (!plan) {
      return {
        success: false,
        error: "Plan not found"
      };
    }
    return {
      success: true,
      data: plan
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan"
    };
  }
});
const getPlanBySlug_createServerFn_handler = createServerRpc({
  id: "412ffccfc4718f68950faffd0adc502da1e6c60b093cfcaabba100517b3ff253",
  name: "getPlanBySlug",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getPlanBySlug.__executeServer(opts));
const getPlanBySlug = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    slug: z.string()
  }).parse(data);
}).handler(getPlanBySlug_createServerFn_handler, async ({
  data
}) => {
  try {
    const plan = await planService.findBySlug(data.slug);
    if (!plan) {
      return {
        success: false,
        error: "Plan not found"
      };
    }
    return {
      success: true,
      data: plan
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan"
    };
  }
});
const createPlan_createServerFn_handler = createServerRpc({
  id: "8681bd9a1cb1ed592cccca030f92a0ebe8c78241ff00c61ba8ebf82f86056c1a",
  name: "createPlan",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => createPlan.__executeServer(opts));
const createPlan = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createPlanSchema.parse(data);
}).handler(createPlan_createServerFn_handler, async ({
  data
}) => {
  try {
    const plan = await planService.create(data);
    return {
      success: true,
      data: plan,
      message: "Plan created successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create plan"
    };
  }
});
const updatePlan_createServerFn_handler = createServerRpc({
  id: "4c77ce5ae5818244183ed9051a953f5c4c62487ae465f72c7d1c2e827a6c2d98",
  name: "updatePlan",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => updatePlan.__executeServer(opts));
const updatePlan = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid(),
    data: updatePlanSchema
  }).parse(data);
}).handler(updatePlan_createServerFn_handler, async ({
  data
}) => {
  try {
    const plan = await planService.update(data.id, data.data);
    return {
      success: true,
      data: plan,
      message: "Plan updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update plan"
    };
  }
});
const deletePlan_createServerFn_handler = createServerRpc({
  id: "6dc16cdfcd49bbf57c3bd9d43b04237ee1f43b3d7e3cd1906988fbbc81198d16",
  name: "deletePlan",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => deletePlan.__executeServer(opts));
const deletePlan = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(deletePlan_createServerFn_handler, async ({
  data
}) => {
  try {
    await planService.delete(data.id);
    return {
      success: true,
      message: "Plan deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete plan"
    };
  }
});
const getPlanBonuses_createServerFn_handler = createServerRpc({
  id: "f0e57081dcfa46a51e95829c690d43be61bcf09a8605d2a6bdd3b5218d58f14d",
  name: "getPlanBonuses",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getPlanBonuses.__executeServer(opts));
const getPlanBonuses = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    planId: z.string().uuid()
  }).parse(data);
}).handler(getPlanBonuses_createServerFn_handler, async ({
  data
}) => {
  try {
    const bonuses = await planService.getPlanBonuses(data.planId);
    return {
      success: true,
      data: bonuses
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan bonuses"
    };
  }
});
const createPlanBonus_createServerFn_handler = createServerRpc({
  id: "58a1e2283567b72a901e79967bf925390f932c07ed2a816f93cdba16fd4fc36c",
  name: "createPlanBonus",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => createPlanBonus.__executeServer(opts));
const createPlanBonus = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createPlanBonusSchema.parse(data);
}).handler(createPlanBonus_createServerFn_handler, async ({
  data
}) => {
  try {
    const bonus = await planService.createPlanBonus(data);
    return {
      success: true,
      data: bonus,
      message: "Plan bonus created successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create plan bonus"
    };
  }
});
const deletePlanBonus_createServerFn_handler = createServerRpc({
  id: "924d254b19907e94ec0d5eeee2d8151e549fcba5373a8993b0e0d4b2f26d7b80",
  name: "deletePlanBonus",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => deletePlanBonus.__executeServer(opts));
const deletePlanBonus = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(deletePlanBonus_createServerFn_handler, async ({
  data
}) => {
  try {
    await planService.deletePlanBonus(data.id);
    return {
      success: true,
      message: "Plan bonus deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete plan bonus"
    };
  }
});
const activateCustomerPlan_createServerFn_handler = createServerRpc({
  id: "c145a78d533019189a1b1341071d9a7a945cc7a22b2beb1ad1d9fb92f2083cf7",
  name: "activateCustomerPlan",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => activateCustomerPlan.__executeServer(opts));
const activateCustomerPlan = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return activateCustomerPlanSchema.parse(data);
}).handler(activateCustomerPlan_createServerFn_handler, async ({
  data
}) => {
  try {
    const customerPlan = await planService.activateCustomerPlan(data);
    return {
      success: true,
      data: customerPlan,
      message: "Customer plan activated successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to activate customer plan"
    };
  }
});
const deactivateCustomerPlan_createServerFn_handler = createServerRpc({
  id: "42e60cbb39e7b215e6f5261677cb820dc95e52d3585eb88258eb464b26cd4d6f",
  name: "deactivateCustomerPlan",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => deactivateCustomerPlan.__executeServer(opts));
const deactivateCustomerPlan = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    customerId: z.string().uuid()
  }).parse(data);
}).handler(deactivateCustomerPlan_createServerFn_handler, async ({
  data
}) => {
  try {
    await planService.deactivateCustomerPlan(data.customerId);
    return {
      success: true,
      message: "Customer plan deactivated successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to deactivate customer plan"
    };
  }
});
const getCustomerPlans_createServerFn_handler = createServerRpc({
  id: "cbb3892846a7f1ee5eae7e702c2c9d4c7cc267d80db57e94619a71411c7f645d",
  name: "getCustomerPlans",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getCustomerPlans.__executeServer(opts));
const getCustomerPlans = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    customerId: z.string().uuid()
  }).parse(data);
}).handler(getCustomerPlans_createServerFn_handler, async ({
  data
}) => {
  try {
    const plans = await planService.getCustomerPlans(data.customerId);
    return {
      success: true,
      data: plans
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer plans"
    };
  }
});
const getActiveCustomerPlan_createServerFn_handler = createServerRpc({
  id: "c81b20389bfc0e3774d401a0c9d493cf00ce54005407daddb9a25ce5d666263b",
  name: "getActiveCustomerPlan",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getActiveCustomerPlan.__executeServer(opts));
const getActiveCustomerPlan = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    customerId: z.string().uuid()
  }).parse(data);
}).handler(getActiveCustomerPlan_createServerFn_handler, async ({
  data
}) => {
  try {
    const plan = await planService.getActiveCustomerPlan(data.customerId);
    return {
      success: true,
      data: plan
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch active customer plan"
    };
  }
});
const getPlanStats_createServerFn_handler = createServerRpc({
  id: "99fd443517274485bc7516b535db08936cd0de7b0f49f378b1e08d9f721a272f",
  name: "getPlanStats",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getPlanStats.__executeServer(opts));
const getPlanStats = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    planId: z.string().uuid()
  }).parse(data);
}).handler(getPlanStats_createServerFn_handler, async ({
  data
}) => {
  try {
    const stats = await planService.getPlanStats(data.planId);
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan stats"
    };
  }
});
const getAllPlanStats_createServerFn_handler = createServerRpc({
  id: "61e81d1a4bd95af9917111d18665547222f01dfbb8e71a836082cf44a53de5c4",
  name: "getAllPlanStats",
  filename: "src/backend/modules/plans/api/plans.api.ts"
}, (opts) => getAllPlanStats.__executeServer(opts));
const getAllPlanStats = createServerFn({
  method: "GET"
}).handler(getAllPlanStats_createServerFn_handler, async () => {
  try {
    const stats = await planService.getAllPlanStats();
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plan stats"
    };
  }
});
export {
  activateCustomerPlan_createServerFn_handler,
  createPlanBonus_createServerFn_handler,
  createPlan_createServerFn_handler,
  deactivateCustomerPlan_createServerFn_handler,
  deletePlanBonus_createServerFn_handler,
  deletePlan_createServerFn_handler,
  getActiveCustomerPlan_createServerFn_handler,
  getAllPlanStats_createServerFn_handler,
  getCustomerPlans_createServerFn_handler,
  getPlanBonuses_createServerFn_handler,
  getPlanById_createServerFn_handler,
  getPlanBySlug_createServerFn_handler,
  getPlanStats_createServerFn_handler,
  getPlans_createServerFn_handler,
  updatePlan_createServerFn_handler
};
