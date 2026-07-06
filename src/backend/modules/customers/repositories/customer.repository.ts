import { BaseRepository } from "../../../infra/database/base.repository";

export interface Customer {
  id: string;
  auth_user_id?: string;
  nome: string;
  email: string;
  tipo_cliente?: string;
  status?: string;
  telefone?: string;
  cpf?: string;
  patrocinador_id?: string;
  cidade?: string;
  created_at?: string;
  updated_at?: string;
}

export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super("crm.customers");
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByCpf(cpf: string): Promise<Customer | null> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("cpf", cpf)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<Customer | null> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByAuthUserId(authUserId: string): Promise<Customer | null> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findAll(options?: {
    filters?: Record<string, any>;
    orderBy?: string;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<Customer[]> {
    let query = this.getClient()
      .schema("crm")
      .from("customers")
      .select("*");

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

  async create(data: Partial<Customer>): Promise<Customer> {
    const { data: result, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .insert(data as any)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const { data: result, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  /**
   * Calculate order statistics for a customer
   * Returns order count and total value (LTV) from commerce.pedidos
   */
  async getOrderStats(customerId: string): Promise<{ count: number; ltv: number }> {
    const { data, error } = await this.getClient()
      .schema("commerce")
      .from("pedidos")
      .select("valor_total")
      .eq("cliente_id", customerId);

    if (error) throw error;

    const orders = data || [];
    const count = orders.length;
    const ltv = orders.reduce((sum, order) => sum + (order.valor_total || 0), 0);

    return { count, ltv };
  }

  /**
   * Calculate order statistics for multiple customers
   * Returns a map of customer_id -> { count, ltv }
   */
  async getOrderStatsForCustomers(customerIds: string[]): Promise<Record<string, { count: number; ltv: number }>> {
    if (customerIds.length === 0) return {};

    const { data, error } = await this.getClient()
      .schema("commerce")
      .from("pedidos")
      .select("cliente_id, valor_total")
      .in("cliente_id", customerIds);

    if (error) throw error;

    const stats: Record<string, { count: number; ltv: number }> = {};
    
    // Initialize all customers with zero stats
    customerIds.forEach(id => {
      stats[id] = { count: 0, ltv: 0 };
    });

    // Aggregate stats from orders
    (data || []).forEach(order => {
      const customerId = order.cliente_id;
      if (stats[customerId]) {
        stats[customerId].count += 1;
        stats[customerId].ltv += order.valor_total || 0;
      }
    });

    return stats;
  }

  async countByStatus(status: string): Promise<number> {
    const { count, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("status", status);

    if (error) throw error;
    return count || 0;
  }

  async findBySponsorId(sponsorId: string, options?: { limit?: number; offset?: number }): Promise<Customer[]> {
    let query = this.getClient()
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("patrocinador_id", sponsorId);

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

  async getCustomer360(customerId: string): Promise<any> {
    // This would typically join data from multiple schemas
    // For now, return basic customer data
    return this.findById(customerId);
  }
}
