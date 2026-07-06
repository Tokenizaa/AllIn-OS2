import { BaseRepository } from "../../../infra/database/base.repository";
export class CustomerRepository extends BaseRepository {
    constructor() {
        super("customers");
    }
    async findByEmail(email) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("email", email)
            .single();
        if (error)
            throw error;
        return data;
    }
    async findByCpf(cpf) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("metadata->>cpf", cpf)
            .single();
        if (error)
            throw error;
        return data;
    }
    async findBySponsorId(sponsorId, options) {
        let query = this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("patrocinador_comprador", sponsorId);
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        if (options?.offset) {
            query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data || [];
    }
    async getCustomer360(idComprador) {
        const { data, error } = await this.getClient()
            .from("customer_360_view")
            .select("*")
            .eq("id", idComprador)
            .single();
        if (error)
            throw error;
        return data;
    }
    async getAllCustomer360(options) {
        let query = this.getClient()
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
        if (error)
            throw error;
        return data || [];
    }
    async countByStatus(status) {
        const { count, error } = await this.getClient()
            .from(this.tableName)
            .select("*", { count: "exact", head: true })
            .eq("status", status);
        if (error)
            throw error;
        return count || 0;
    }
    async countByPlan(planId) {
        const { count, error } = await this.getClient()
            .from(this.tableName)
            .select("*", { count: "exact", head: true })
            .eq("plan_id", planId);
        if (error)
            throw error;
        return count || 0;
    }
}
