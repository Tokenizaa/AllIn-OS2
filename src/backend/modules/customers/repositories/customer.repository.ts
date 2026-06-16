import { BaseRepository } from "../../../infra/database/base.repository";
import { Customer, Customer360 } from "../dto/customer.dto";

export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super("customers", "crm");
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await this.getQuery()
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByCpf(cpf: string): Promise<Customer | null> {
    const { data, error } = await this.getQuery()
      .select("*")
      .eq("metadata->>cpf", cpf)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findBySponsorId(sponsorId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Customer[]> {
    let query = this.getQuery()
      .select("*")
      .eq("patrocinador_comprador", sponsorId);

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

  async getCustomer360(idComprador: string): Promise<Customer360 | null> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customer_360_view")
      .select("*")
      .eq("id", idComprador)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getAllCustomer360(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<Customer360[]> {
    let query = this.getClient()
      .schema("crm")
      .from("customer_360_view")
      .select("*");

    if (options?.status) {
      query = query.eq("status", options.status);
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

  async countByStatus(status: string): Promise<number> {
    const { count, error } = await this.getQuery()
      .select("*", { count: "exact", head: true })
      .eq("status", status);

    if (error) throw error;
    return count || 0;
  }

  async countByPlan(planId: string): Promise<number> {
    const { count, error } = await this.getQuery()
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId);

    if (error) throw error;
    return count || 0;
  }
}
