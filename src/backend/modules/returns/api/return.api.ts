import { ReturnService } from "../services/return.service";
import { CreateReturnDto, UpdateReturnDto } from "../dto/return.dto";

export class ReturnAPI {
  private service: ReturnService;

  constructor() {
    this.service = new ReturnService();
  }

  /**
   * POST /api/returns
   * Criar nova solicitação de devolução
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateReturnDto;
      const returnRequest = await this.service.create(dto);
      return { data: returnRequest, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error creating return:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/returns/:id
   * Buscar solicitação de devolução por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const returnRequest = await this.service.findById(id);
      if (!returnRequest) {
        return { data: null, error: 'Return not found' };
      }
      return { data: returnRequest, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error finding return:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/returns/order/:orderId
   * Buscar devoluções por pedido
   */
  async findByOrderId(orderId: string): Promise<{ data: any; error: string | null }> {
    try {
      const returns = await this.service.findByOrderId(orderId);
      return { data: returns, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error finding returns by order:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/returns/customer/:customerId
   * Buscar devoluções por cliente
   */
  async findByCustomerId(customerId: string): Promise<{ data: any; error: string | null }> {
    try {
      const returns = await this.service.findByCustomerId(customerId);
      return { data: returns, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error finding returns by customer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/returns/status/:status
   * Buscar devoluções por status
   */
  async findByStatus(status: string): Promise<{ data: any; error: string | null }> {
    try {
      const returns = await this.service.findByStatus(status);
      return { data: returns, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error finding returns by status:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/returns/range
   * Buscar devoluções por período
   */
  async findByDateRange(startDate: string, endDate: string): Promise<{ data: any; error: string | null }> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const returns = await this.service.findByDateRange(start, end);
      return { data: returns, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error finding returns by date range:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/returns/:id
   * Atualizar solicitação de devolução
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateReturnDto;
      const returnRequest = await this.service.update(id, dto);
      return { data: returnRequest, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error updating return:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/returns/:id
   * Deletar solicitação de devolução
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error deleting return:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/returns/:id/approve
   * Aprovar solicitação de devolução
   */
  async approveReturn(id: string, approvedBy: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.approveReturn(id, approvedBy);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error approving return:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/returns/:id/reject
   * Rejeitar solicitação de devolução
   */
  async rejectReturn(id: string, rejectedBy: string, rejectionReason: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.rejectReturn(id, rejectedBy, rejectionReason);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error rejecting return:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/returns/:id/complete
   * Completar devolução
   */
  async completeReturn(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.completeReturn(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error completing return:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/returns/:id/tracking
   * Atualizar número de rastreamento
   */
  async updateTrackingNumber(id: string, trackingNumber: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.updateTrackingNumber(id, trackingNumber);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error updating tracking number:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/returns/stats
   * Buscar estatísticas de devoluções
   */
  async getStats(): Promise<{ data: any; error: string | null }> {
    try {
      const stats = await this.service.getStats();
      return { data: stats, error: null };
    } catch (error) {
      console.error('[ReturnAPI] Error getting stats:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
