import { ReturnRepository } from "../repositories/return.repository";
import { Return, CreateReturnDto, UpdateReturnDto, ReturnStats } from "../dto/return.dto";

export class ReturnService {
  private repository: ReturnRepository;

  constructor() {
    this.repository = new ReturnRepository();
  }

  async create(dto: CreateReturnDto): Promise<Return> {
    // Calculate total refund amount
    const totalRefundAmount = dto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const returnRequest = await this.repository.create({
      ...dto,
      total_refund_amount: totalRefundAmount,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return returnRequest;
  }

  async findById(id: string): Promise<Return | null> {
    return await this.repository.findById(id);
  }

  async findByOrderId(orderId: string): Promise<Return[]> {
    return await this.repository.findByOrderId(orderId);
  }

  async findByCustomerId(customerId: string): Promise<Return[]> {
    return await this.repository.findByCustomerId(customerId);
  }

  async findByStatus(status: string): Promise<Return[]> {
    return await this.repository.findByStatus(status);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Return[]> {
    return await this.repository.findByDateRange(startDate, endDate);
  }

  async update(id: string, dto: UpdateReturnDto): Promise<Return> {
    return await this.repository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async approveReturn(returnId: string, approvedBy: string): Promise<void> {
    const returnRequest = await this.findById(returnId);
    if (!returnRequest) {
      throw new Error('Return not found');
    }

    if (returnRequest.status !== 'pending') {
      throw new Error('Return can only be approved when in pending status');
    }

    await this.repository.approveReturn(returnId, approvedBy);
  }

  async rejectReturn(returnId: string, rejectedBy: string, rejectionReason: string): Promise<void> {
    const returnRequest = await this.findById(returnId);
    if (!returnRequest) {
      throw new Error('Return not found');
    }

    if (returnRequest.status !== 'pending') {
      throw new Error('Return can only be rejected when in pending status');
    }

    await this.repository.rejectReturn(returnId, rejectedBy, rejectionReason);
  }

  async completeReturn(returnId: string): Promise<void> {
    const returnRequest = await this.findById(returnId);
    if (!returnRequest) {
      throw new Error('Return not found');
    }

    if (returnRequest.status !== 'processing') {
      throw new Error('Return can only be completed when in processing status');
    }

    await this.repository.completeReturn(returnId);
  }

  async updateTrackingNumber(returnId: string, trackingNumber: string): Promise<void> {
    const returnRequest = await this.findById(returnId);
    if (!returnRequest) {
      throw new Error('Return not found');
    }

    if (returnRequest.status !== 'approved') {
      throw new Error('Tracking number can only be added for approved returns');
    }

    await this.repository.updateTrackingNumber(returnId, trackingNumber);
  }

  async getStats(): Promise<ReturnStats> {
    return await this.repository.getStats();
  }
}
