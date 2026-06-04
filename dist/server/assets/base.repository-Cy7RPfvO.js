import { createClient } from "@supabase/supabase-js";
import process from "node:process";
function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}
function getSupabaseAdminClient() {
  const config = getServerConfig();
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw new Error("Missing Supabase admin configuration");
  }
  return createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }
  getClient() {
    return getSupabaseAdminClient();
  }
  async findById(id) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }
  async findAll(options) {
    let query = this.getClient().from(this.tableName).select("*");
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.order === "asc" });
    }
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
  async create(data) {
    const { data: result, error } = await this.getClient().from(this.tableName).insert(data).select().single();
    if (error) throw error;
    return result;
  }
  async update(id, data) {
    const { data: result, error } = await this.getClient().from(this.tableName).update(data).eq("id", id).select().single();
    if (error) throw error;
    return result;
  }
  async delete(id) {
    const { error } = await this.getClient().from(this.tableName).delete().eq("id", id);
    if (error) throw error;
  }
  async count(filters) {
    let query = this.getClient().from(this.tableName).select("*", { count: "exact", head: true });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
}
export {
  BaseRepository as B
};
