import { getSupabaseAdminClient } from "../supabase/client";

export abstract class BaseRepository<T> {
  protected tableName: string;
  protected schema: string;

  constructor(tableName: string, schema: string = 'public') {
    // Extrair schema e nome da tabela se tableName for qualificado
    if (tableName.includes('.')) {
      const parts = tableName.split('.');
      this.schema = parts[0];
      this.tableName = parts[1];
    } else {
      this.schema = schema;
      this.tableName = tableName;
    }
  }

  public getClient() {
    // Use backend client for full access without schema restrictions
    return getSupabaseAdminClient();
  }

  protected getQuery() {
    // Use .schema() method instead of qualified table name
    return this.getClient().schema(this.schema).from(this.tableName);
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.getQuery()
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(options?: {
    filters?: Record<string, any>;
    orderBy?: string;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<T[]> {
    let query = this.getQuery().select("*");

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
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

  async create(data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.getQuery()
      .insert(data as any)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await this.getQuery()
      .update(data as any)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return result;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.getQuery()
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = this.getQuery().select("*", { count: "exact", head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }
}
