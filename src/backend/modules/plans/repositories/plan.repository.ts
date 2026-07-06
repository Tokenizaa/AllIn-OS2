import { BaseRepository } from "../../../infra/database/base.repository";
import { Plan, PlanBonus, CustomerPlan } from "../dto/plan.dto";

export class PlanRepository extends BaseRepository<Plan> {
  constructor() {
    super("mlm.planos");
  }

  async findBySlug(slug: string): Promise<Plan | null> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("planos")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findActive(): Promise<Plan[]> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("planos")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  }

  async findAffiliatePlans(): Promise<Plan[]> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("planos")
      .select("*")
      .eq("is_affiliate", true)
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  }
}

export class PlanBonusRepository extends BaseRepository<PlanBonus> {
  constructor() {
    super("mlm.bonus_regras");
  }

  async findByPlanId(planId: string): Promise<PlanBonus[]> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("bonus_regras")
      .select("*")
      .eq("plan_id", planId);

    if (error) throw error;
    return data || [];
  }

  async deleteByPlanId(planId: string): Promise<void> {
    const { error } = await this.getClient()
      .schema("mlm")
      .from("bonus_regras")
      .delete()
      .eq("plan_id", planId);

    if (error) throw error;
  }
}

export class CustomerPlanRepository extends BaseRepository<CustomerPlan> {
  constructor() {
    super("mlm.planos_distribuidores");
  }

  async findByidComprador(idComprador: string): Promise<CustomerPlan[]> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("planos_distribuidores")
      .select("*")
      .eq("id_comprador", idComprador);

    if (error) throw error;
    return data || [];
  }

  async findActiveByidComprador(idComprador: string): Promise<CustomerPlan | null> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("planos_distribuidores")
      .select("*")
      .eq("id_comprador", idComprador)
      .eq("status", "active")
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async activatePlan(dto: { id_comprador: string; plan_id: string }): Promise<CustomerPlan> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("planos_distribuidores")
      .insert({
        id_comprador: dto.id_comprador,
        plan_id: dto.plan_id,
        status: "active",
        activated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deactivatePlan(idComprador: string): Promise<void> {
    const { error } = await this.getClient()
      .schema("mlm")
      .from("planos_distribuidores")
      .update({ status: "inactive" } as any)
      .eq("id_comprador", idComprador);

    if (error) throw error;
  }

  async countByPlanId(planId: string): Promise<number> {
    const { count, error } = await this.getClient()
      .schema("mlm")
      .from("planos_distribuidores")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId)
      .eq("status", "active");

    if (error) throw error;
    return count || 0;
  }
}
