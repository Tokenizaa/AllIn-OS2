import { c as createServerRpc } from "./createServerRpc-CISKjDF_.mjs";
import { a as createServerFn } from "./server-BaJh_Ojk.mjs";
import { B as BaseRepository } from "./base.repository-C1yp6j9c.mjs";
import { g as getPlanRule } from "./mlm-rules-RFBC3uMT.mjs";
import { p as paginationSchema } from "./pagination.dto-D6rx1FA4.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";

import { o as objectType, c as coerce, s as stringType } from "../_libs/zod.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
class NetworkRepository extends BaseRepository {
  constructor() {
    super("network_tree_view");
  }
  normalizePlanName(planIdOrName, fallback) {
    const rule = getPlanRule(planIdOrName || fallback || "");
    return rule?.label || fallback || planIdOrName || null;
  }
  async getNetworkTree(customerId, maxDepth = 5) {
    const { data, error } = await this.getClient().from("network_tree_view").select("*").eq("id", customerId).single();
    if (error) throw error;
    if (!data) return null;
    const root = {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status,
      level: data.level || 0,
      sponsor_id: data.sponsor_id,
      sponsor_name: data.sponsor_name,
      total_downlines: data.total_downlines || 0,
      active_downlines: data.active_downlines || 0,
      total_revenue: data.total_revenue || 0,
      plan_name: this.normalizePlanName(data.plan_id, data.plan_name)
    };
    const children = await this.getDownlinesRecursive(customerId, 1, maxDepth);
    return {
      root,
      children
    };
  }
  async getDownlinesRecursive(sponsorId, currentDepth, maxDepth) {
    if (currentDepth > maxDepth) return [];
    const { data, error } = await this.getClient().from("network_tree_view").select("*").eq("sponsor_id", sponsorId);
    if (error) throw error;
    if (!data || data.length === 0) return [];
    const trees = [];
    for (const node of data) {
      const treeNode = {
        id: node.id,
        name: node.name,
        email: node.email,
        status: node.status,
        level: node.level || currentDepth,
        sponsor_id: node.sponsor_id,
        sponsor_name: node.sponsor_name,
        total_downlines: node.total_downlines || 0,
        active_downlines: node.active_downlines || 0,
        total_revenue: node.total_revenue || 0,
        plan_name: this.normalizePlanName(node.plan_id, node.plan_name)
      };
      const children = await this.getDownlinesRecursive(node.id, currentDepth + 1, maxDepth);
      trees.push({
        root: treeNode,
        children
      });
    }
    return trees;
  }
  async getDownlines(customerId, options) {
    let query = this.getClient().from("network_tree_view").select("*").eq("sponsor_id", customerId);
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((node) => ({
      id: node.id,
      name: node.name,
      email: node.email,
      status: node.status,
      level: node.level || 0,
      sponsor_id: node.sponsor_id,
      total_downlines: node.total_downlines || 0,
      active_downlines: node.active_downlines || 0,
      total_revenue: node.total_revenue || 0,
      plan_name: this.normalizePlanName(node.plan_id, node.plan_name),
      created_at: node.created_at
    }));
  }
  async getUpline(customerId, maxLevels = 10) {
    const upline = [];
    let currentId = customerId;
    let level = 0;
    while (currentId && level < maxLevels) {
      const { data, error } = await this.getClient().from("network_tree_view").select("*").eq("id", currentId).single();
      if (error || !data) break;
      if (data.sponsor_id) {
        const { data: sponsorData, error: sponsorError } = await this.getClient().from("network_tree_view").select("*").eq("id", data.sponsor_id).single();
        if (sponsorError || !sponsorData) break;
        upline.push({
          id: sponsorData.id,
          name: sponsorData.name,
          email: sponsorData.email,
          status: sponsorData.status,
          level: level + 1,
          sponsor_id: sponsorData.sponsor_id,
          total_downlines: sponsorData.total_downlines || 0,
          total_revenue: sponsorData.total_revenue || 0,
          plan_name: this.normalizePlanName(sponsorData.plan_id, sponsorData.plan_name)
        });
        currentId = sponsorData.id;
        level++;
      } else {
        break;
      }
    }
    return upline;
  }
  async getNetworkStats(customerId) {
    let totalNetworkSize = 0;
    let activeDistributors = 0;
    let totalRevenue = 0;
    if (customerId) {
      const { data, error } = await this.getClient().from("network_tree_view").select("*").eq("id", customerId).single();
      if (error) throw error;
      totalNetworkSize = data?.total_downlines || 0;
      activeDistributors = data?.active_downlines || 0;
      totalRevenue = data?.total_revenue || 0;
    } else {
      const { count: total } = await this.getClient().from("customers").select("*", { count: "exact", head: true });
      const { count: active } = await this.getClient().from("customers").select("*", { count: "exact", head: true }).eq("status", "active");
      totalNetworkSize = total || 0;
      activeDistributors = active || 0;
    }
    return {
      totalNetworkSize,
      activeDistributors,
      totalLevels: 0,
      // Would need recursive calculation
      averageDownlines: totalNetworkSize > 0 ? totalNetworkSize / (activeDistributors || 1) : 0,
      totalRevenue
    };
  }
  async countDownlines(customerId) {
    const { count, error } = await this.getClient().from("customers").select("*", { count: "exact", head: true }).eq("patrocinador_comprador", customerId);
    if (error) throw error;
    return count || 0;
  }
}
class NetworkService {
  constructor() {
    this.repository = new NetworkRepository();
  }
  async getNetworkTree(customerId, maxDepth = 5) {
    return this.repository.getNetworkTree(customerId, maxDepth);
  }
  async getDownlines(customerId, params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.repository.getDownlines(customerId, { limit, offset, maxDepth: params.maxDepth }),
      this.repository.countDownlines(customerId)
    ]);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async getUpline(customerId, maxLevels = 10) {
    return this.repository.getUpline(customerId, maxLevels);
  }
  async getNetworkStats(customerId) {
    return this.repository.getNetworkStats(customerId);
  }
  async countDownlines(customerId) {
    return this.repository.countDownlines(customerId);
  }
}
const networkService = new NetworkService();
const getNetworkTree_createServerFn_handler = createServerRpc({
  id: "4dbb2deb90271a2bb55fedce8b6563fc2965bc13c8010c24ad9a1cd68a5f24cc",
  name: "getNetworkTree",
  filename: "src/backend/modules/network/api/network.api.ts"
}, (opts) => getNetworkTree.__executeServer(opts));
const getNetworkTree = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    customerId: stringType().uuid(),
    maxDepth: coerce.number().min(1).max(10).default(5)
  }).parse(data);
}).handler(getNetworkTree_createServerFn_handler, async ({
  data
}) => {
  try {
    const tree = await networkService.getNetworkTree(data.customerId, data.maxDepth);
    if (!tree) {
      return {
        success: false,
        error: "Network tree not found"
      };
    }
    return {
      success: true,
      data: tree
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch network tree"
    };
  }
});
const getDownlines_createServerFn_handler = createServerRpc({
  id: "0365ce3a58dbd31289a128933bd75e9ea318250b6b7bafe2613a2506f829ce10",
  name: "getDownlines",
  filename: "src/backend/modules/network/api/network.api.ts"
}, (opts) => getDownlines.__executeServer(opts));
const getDownlines = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(objectType({
    customerId: stringType().uuid(),
    maxDepth: coerce.number().min(1).max(10).optional()
  })).parse(data);
}).handler(getDownlines_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await networkService.getDownlines(data.customerId, data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch downlines"
    };
  }
});
const getUpline_createServerFn_handler = createServerRpc({
  id: "9975f0e6c687eff2c1252c0d29dfad064ec663fda791efa1a20d5f6e0217415d",
  name: "getUpline",
  filename: "src/backend/modules/network/api/network.api.ts"
}, (opts) => getUpline.__executeServer(opts));
const getUpline = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    customerId: stringType().uuid(),
    maxLevels: coerce.number().min(1).max(20).default(10)
  }).parse(data);
}).handler(getUpline_createServerFn_handler, async ({
  data
}) => {
  try {
    const upline = await networkService.getUpline(data.customerId, data.maxLevels);
    return {
      success: true,
      data: upline
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch upline"
    };
  }
});
const getNetworkStats_createServerFn_handler = createServerRpc({
  id: "a660e0aa8c1f7a4683e37537d548d44d5b0a575e7829ddc3c1938f255670f0da",
  name: "getNetworkStats",
  filename: "src/backend/modules/network/api/network.api.ts"
}, (opts) => getNetworkStats.__executeServer(opts));
const getNetworkStats = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    customerId: stringType().uuid().optional()
  }).parse(data);
}).handler(getNetworkStats_createServerFn_handler, async ({
  data
}) => {
  try {
    const stats = await networkService.getNetworkStats(data.customerId);
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch network stats"
    };
  }
});
export {
  getDownlines_createServerFn_handler,
  getNetworkStats_createServerFn_handler,
  getNetworkTree_createServerFn_handler,
  getUpline_createServerFn_handler
};
