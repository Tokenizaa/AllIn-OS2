import { BaseRepository } from "../../../infra/database/base.repository";
import { AbandonedCart, CreateAbandonedCartDto, UpdateAbandonedCartDto } from "../dto/abandoned-cart.dto";

export class AbandonedCartRepository extends BaseRepository<AbandonedCart> {
  constructor() {
    super("abandoned_carts");
  }

  async findByCustomerId(customerId: string): Promise<AbandonedCart[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("customer_id", customerId)
      .order("abandoned_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByCustomerEmail(email: string): Promise<AbandonedCart[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("customer_email", email)
      .order("abandoned_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findNotRecovered(): Promise<AbandonedCart[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("recovered", false)
      .order("abandoned_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findRecoveryEmailNotSent(): Promise<AbandonedCart[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("recovery_email_sent", false)
      .eq("recovered", false)
      .order("abandoned_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AbandonedCart[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .gte("abandoned_at", startDate.toISOString())
      .lte("abandoned_at", endDate.toISOString())
      .order("abandoned_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async markAsRecovered(cartId: string, orderId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        recovered: true,
        recovered_at: new Date().toISOString(),
        recovered_order_id: orderId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartId);

    if (error) throw error;
  }

  async markRecoveryEmailSent(cartId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        recovery_email_sent: true,
        recovery_email_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartId);

    if (error) throw error;
  }

  async getStats(): Promise<{
    total_abandoned: number;
    total_recovered: number;
    recovery_rate: number;
    total_revenue_recovered: number;
    total_revenue_lost: number;
    average_abandonment_time_hours: number;
  }> {
    const { data: allCarts, error } = await this.getClient()
      .from(this.tableName)
      .select("*");

    if (error) throw error;

    const carts = allCarts || [];
    const totalAbandoned = carts.length;
    const recoveredCarts = carts.filter(c => c.recovered);
    const totalRecovered = recoveredCarts.length;
    const recoveryRate = totalAbandoned > 0 ? (totalRecovered / totalAbandoned) * 100 : 0;
    const totalRevenueRecovered = recoveredCarts.reduce((sum, c) => sum + (c.total_amount || 0), 0);
    const totalRevenueLost = carts.filter(c => !c.recovered).reduce((sum, c) => sum + (c.total_amount || 0), 0);

    // Calculate average abandonment time (in hours)
    const abandonmentTimes = carts.map(c => {
      const abandonedAt = new Date(c.abandoned_at).getTime();
      const recoveredAt = c.recovered_at ? new Date(c.recovered_at).getTime() : Date.now();
      return (recoveredAt - abandonedAt) / (1000 * 60 * 60); // Convert to hours
    });
    const averageAbandonmentTimeHours = abandonmentTimes.length > 0
      ? abandonmentTimes.reduce((sum, t) => sum + t, 0) / abandonmentTimes.length
      : 0;

    return {
      total_abandoned: totalAbandoned,
      total_recovered: totalRecovered,
      recovery_rate: recoveryRate,
      total_revenue_recovered: totalRevenueRecovered,
      total_revenue_lost: totalRevenueLost,
      average_abandonment_time_hours: averageAbandonmentTimeHours,
    };
  }
}
