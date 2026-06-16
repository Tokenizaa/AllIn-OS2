import { AbandonedCartRepository } from "../repositories/abandoned-cart.repository";
import { AbandonedCart, CreateAbandonedCartDto, UpdateAbandonedCartDto, AbandonedCartStats } from "../dto/abandoned-cart.dto";

export class AbandonedCartService {
  private repository: AbandonedCartRepository;

  constructor() {
    this.repository = new AbandonedCartRepository();
  }

  async create(dto: CreateAbandonedCartDto): Promise<AbandonedCart> {
    const abandonedCart = await this.repository.create({
      ...dto,
      abandoned_at: new Date().toISOString(),
      recovery_email_sent: false,
      recovered: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return abandonedCart;
  }

  async findById(id: string): Promise<AbandonedCart | null> {
    return await this.repository.findById(id);
  }

  async findByCustomerId(customerId: string): Promise<AbandonedCart[]> {
    return await this.repository.findByCustomerId(customerId);
  }

  async findByCustomerEmail(email: string): Promise<AbandonedCart[]> {
    return await this.repository.findByCustomerEmail(email);
  }

  async findNotRecovered(): Promise<AbandonedCart[]> {
    return await this.repository.findNotRecovered();
  }

  async findRecoveryEmailNotSent(): Promise<AbandonedCart[]> {
    return await this.repository.findRecoveryEmailNotSent();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AbandonedCart[]> {
    return await this.repository.findByDateRange(startDate, endDate);
  }

  async update(id: string, dto: UpdateAbandonedCartDto): Promise<AbandonedCart> {
    return await this.repository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async markAsRecovered(cartId: string, orderId: string): Promise<void> {
    await this.repository.markAsRecovered(cartId, orderId);
  }

  async markRecoveryEmailSent(cartId: string): Promise<void> {
    await this.repository.markRecoveryEmailSent(cartId);
  }

  async getStats(): Promise<AbandonedCartStats> {
    return await this.repository.getStats();
  }

  async sendRecoveryEmail(cartId: string): Promise<void> {
    const cart = await this.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    if (cart.recovery_email_sent) {
      throw new Error('Recovery email already sent');
    }

    // TODO: Implement email sending logic
    // This would integrate with an email service
    console.log(`[AbandonedCartService] Sending recovery email to ${cart.customer_email} for cart ${cartId}`);

    await this.markRecoveryEmailSent(cartId);
  }

  async sendBulkRecoveryEmails(limit: number = 100): Promise<number> {
    const carts = await this.findRecoveryEmailNotSent();
    const cartsToSend = carts.slice(0, limit);

    let sent = 0;
    for (const cart of cartsToSend) {
      try {
        await this.sendRecoveryEmail(cart.id);
        sent++;
      } catch (error) {
        console.error(`[AbandonedCartService] Failed to send recovery email for cart ${cart.id}:`, error);
      }
    }

    return sent;
  }
}
