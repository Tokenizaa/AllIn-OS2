import { BaseRepository } from "../../../infra/database/base.repository";
export class PlanRepository extends BaseRepository {
    constructor() {
        super("plans");
    }
    async findBySlug(slug) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("slug", slug)
            .single();
        if (error)
            throw error;
        return data;
    }
    async findActive() {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("is_active", true)
            .order("price", { ascending: true });
        if (error)
            throw error;
        return data || [];
    }
    async findAffiliatePlans() {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("is_affiliate", true)
            .eq("is_active", true)
            .order("price", { ascending: true });
        if (error)
            throw error;
        return data || [];
    }
}
export class PlanBonusRepository extends BaseRepository {
    constructor() {
        super("plan_bonuses");
    }
    async findByPlanId(planId) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("plan_id", planId)
            .order("generation", { ascending: true });
        if (error)
            throw error;
        return data || [];
    }
    async findByPlanIdAndType(planId, bonusType) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("plan_id", planId)
            .eq("bonus_type", bonusType)
            .order("generation", { ascending: true });
        if (error)
            throw error;
        return data || [];
    }
    async deleteByPlanId(planId) {
        const { error } = await this.getClient()
            .from(this.tableName)
            .delete()
            .eq("plan_id", planId);
        if (error)
            throw error;
    }
}
export class CustomerPlanRepository extends BaseRepository {
    constructor() {
        super("customer_plans");
    }
    async findByidComprador(idComprador) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("id_comprador", idComprador)
            .order("created_at", { ascending: false });
        if (error)
            throw error;
        return data || [];
    }
    async findActiveByidComprador(idComprador) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("id_comprador", idComprador)
            .eq("status", "active")
            .single();
        if (error)
            throw error;
        return data;
    }
    async findByPlanId(planId, options) {
        let query = this.getClient()
            .from(this.tableName)
            .select("*")
            .eq("plan_id", planId);
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
    async activatePlan(dto) {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .insert({
            id_comprador: dto.id_comprador,
            plan_id: dto.plan_id,
            status: "active",
            activated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async deactivatePlan(idComprador) {
        const { error } = await this.getClient()
            .from(this.tableName)
            .update({ status: "inactive" })
            .eq("id_comprador", idComprador)
            .eq("status", "active");
        if (error)
            throw error;
    }
    async countByPlanId(planId) {
        const { count, error } = await this.getClient()
            .from(this.tableName)
            .select("*", { count: "exact", head: true })
            .eq("plan_id", planId)
            .eq("status", "active");
        if (error)
            throw error;
        return count || 0;
    }
}
