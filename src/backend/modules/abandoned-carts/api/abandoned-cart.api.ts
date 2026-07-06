import { AbandonedCartService } from "../services/abandoned-cart.service";
import { CreateAbandonedCartDto, UpdateAbandonedCartDto } from "../dto/abandoned-cart.dto";

export class AbandonedCartAPI {
  private service: AbandonedCartService;

  constructor() {
    this.service = new AbandonedCartService();
  }

  /**
   * POST /api/abandoned-carts
   * Criar novo carrinho abandonado
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateAbandonedCartDto;
      const cart = await this.service.create(dto);
      return { data: cart, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error creating cart:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/abandoned-carts/:id
   * Buscar carrinho abandonado por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const cart = await this.service.findById(id);
      if (!cart) {
        return { data: null, error: 'Cart not found' };
      }
      return { data: cart, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error finding cart:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/abandoned-carts/customer/:customerId
   * Buscar carrinhos abandonados por cliente
   */
  async findByCustomerId(customerId: string): Promise<{ data: any; error: string | null }> {
    try {
      const carts = await this.service.findByCustomerId(customerId);
      return { data: carts, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error finding carts by customer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/abandoned-carts/email/:email
   * Buscar carrinhos abandonados por email
   */
  async findByCustomerEmail(email: string): Promise<{ data: any; error: string | null }> {
    try {
      const carts = await this.service.findByCustomerEmail(email);
      return { data: carts, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error finding carts by email:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/abandoned-carts/not-recovered
   * Buscar carrinhos não recuperados
   */
  async findNotRecovered(): Promise<{ data: any; error: string | null }> {
    try {
      const carts = await this.service.findNotRecovered();
      return { data: carts, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error finding not recovered carts:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/abandoned-carts/recovery-email-not-sent
   * Buscar carrinhos com email de recuperação não enviado
   */
  async findRecoveryEmailNotSent(): Promise<{ data: any; error: string | null }> {
    try {
      const carts = await this.service.findRecoveryEmailNotSent();
      return { data: carts, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error finding carts with recovery email not sent:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/abandoned-carts/range
   * Buscar carrinhos por período
   */
  async findByDateRange(startDate: string, endDate: string): Promise<{ data: any; error: string | null }> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const carts = await this.service.findByDateRange(start, end);
      return { data: carts, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error finding carts by date range:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/abandoned-carts/:id
   * Atualizar carrinho abandonado
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateAbandonedCartDto;
      const cart = await this.service.update(id, dto);
      return { data: cart, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error updating cart:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/abandoned-carts/:id
   * Deletar carrinho abandonado
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error deleting cart:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/abandoned-carts/:id/recover
   * Marcar carrinho como recuperado
   */
  async markAsRecovered(id: string, orderId: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.markAsRecovered(id, orderId);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error marking cart as recovered:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/abandoned-carts/:id/send-recovery-email
   * Enviar email de recuperação
   */
  async sendRecoveryEmail(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.sendRecoveryEmail(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error sending recovery email:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/abandoned-carts/send-bulk-recovery-emails
   * Enviar emails de recuperação em massa
   */
  async sendBulkRecoveryEmails(limit?: number): Promise<{ data: any; error: string | null }> {
    try {
      const sent = await this.service.sendBulkRecoveryEmails(limit);
      return { data: { sent }, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error sending bulk recovery emails:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/abandoned-carts/stats
   * Buscar estatísticas de carrinhos abandonados
   */
  async getStats(): Promise<{ data: any; error: string | null }> {
    try {
      const stats = await this.service.getStats();
      return { data: stats, error: null };
    } catch (error) {
      console.error('[AbandonedCartAPI] Error getting stats:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
