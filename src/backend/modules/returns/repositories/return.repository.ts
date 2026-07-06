import { BaseRepository } from "../../../infra/database/base.repository";
import { Return, CreateReturnDto, UpdateReturnDto } from "../dto/return.dto";

export class ReturnRepository extends BaseRepository<Return> {
  constructor() {
    super("returns");
  }

  async findByOrderId(orderId: string): Promise<Return[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByCustomerId(customerId: string): Promise<Return[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByStatus(status: string): Promise<Return[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Return[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async approveReturn(returnId: string, approvedBy: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: approvedBy,
        updated_at: new Date().toISOString(),
      })
      .eq("id", returnId);

    if (error) throw error;
  }

  async rejectReturn(returnId: string, rejectedBy: string, rejectionReason: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejected_by: rejectedBy,
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", returnId);

    if (error) throw error;
  }

  async completeReturn(returnId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", returnId);

    if (error) throw error;
  }

  async updateTrackingNumber(returnId: string, trackingNumber: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        tracking_number: trackingNumber,
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", returnId);

    if (error) throw error;
  }

  async getStats(): Promise<{
    total_returns: number;
    pending_returns: number;
    approved_returns: number;
    rejected_returns: number;
    completed_returns: number;
    total_refund_amount: number;
    average_processing_time_hours: number;
  }> {
    const { data: allReturns, error } = await this.getClient()
      .from(this.tableName)
      .select("*");

    if (error) throw error;

    const returns = allReturns || [];
    const totalReturns = returns.length;
    const pendingReturns = returns.filter(r => r.status === "pending").length;
    const approvedReturns = returns.filter(r => r.status === "approved").length;
    const rejectedReturns = returns.filter(r => r.status === "rejected").length;
    const completedReturns = returns.filter(r => r.status === "completed").length;
    const totalRefundAmount = returns.filter(r => r.status === "completed").reduce((sum, r) => sum + (r.total_refund_amount || 0), 0);

    // Calculate average processing time (in hours)
    const completedReturnsList = returns.filter(r => r.status === "completed" && r.created_at && r.completed_at);
    const processingTimes = completedReturnsList.map(r => {
      const createdAt = new Date(r.created_at).getTime();
      const completedAt = new Date(r.completed_at!).getTime();
      return (completedAt - createdAt) / (1000 * 60 * 60); // Convert to hours
    });
    const averageProcessingTimeHours = processingTimes.length > 0
      ? processingTimes.reduce((sum, t) => sum + t, 0) / processingTimes.length
      : 0;

    return {
      total_returns: totalReturns,
      pending_returns: pendingReturns,
      approved_returns: approvedReturns,
      rejected_returns: rejectedReturns,
      completed_returns: completedReturns,
      total_refund_amount: totalRefundAmount,
      average_processing_time_hours: averageProcessingTimeHours,
    };
  }
}
