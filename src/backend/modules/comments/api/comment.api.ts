import { CommentService } from "../services/comment.service";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";

export class CommentAPI {
  private service: CommentService;

  constructor() {
    this.service = new CommentService();
  }

  /**
   * POST /api/comments
   * Criar novo comentário
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateCommentDto;
      const comment = await this.service.create(dto);
      return { data: comment, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error creating comment:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/comments/:id
   * Buscar comentário por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const comment = await this.service.findById(id);
      if (!comment) {
        return { data: null, error: 'Comment not found' };
      }
      return { data: comment, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error finding comment:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/comments/entity/:entityType/:entityId
   * Buscar comentários por entidade
   */
  async findByEntity(entityType: string, entityId: string): Promise<{ data: any; error: string | null }> {
    try {
      const comments = await this.service.findByEntity(entityType, entityId);
      return { data: comments, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error finding comments by entity:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/comments/author/:authorId
   * Buscar comentários por autor
   */
  async findByAuthor(authorId: string): Promise<{ data: any; error: string | null }> {
    try {
      const comments = await this.service.findByAuthor(authorId);
      return { data: comments, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error finding comments by author:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/comments/approved
   * Buscar comentários aprovados
   */
  async findApproved(): Promise<{ data: any; error: string | null }> {
    try {
      const comments = await this.service.findApproved();
      return { data: comments, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error finding approved comments:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/comments/pending
   * Buscar comentários pendentes
   */
  async findPending(): Promise<{ data: any; error: string | null }> {
    try {
      const comments = await this.service.findPending();
      return { data: comments, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error finding pending comments:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/comments/parent/:parentId
   * Buscar comentários por parent
   */
  async findByParent(parentId: string): Promise<{ data: any; error: string | null }> {
    try {
      const comments = await this.service.findByParent(parentId);
      return { data: comments, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error finding comments by parent:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/comments/:id
   * Atualizar comentário
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateCommentDto;
      const comment = await this.service.update(id, dto);
      return { data: comment, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error updating comment:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/comments/:id
   * Deletar comentário
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error deleting comment:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/comments/:id/approve
   * Aprovar comentário
   */
  async approve(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.approve(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error approving comment:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/comments/:id/reject
   * Rejeitar comentário
   */
  async reject(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.reject(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error rejecting comment:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/comments/stats
   * Buscar estatísticas de comentários
   */
  async getStats(entityType?: string, entityId?: string): Promise<{ data: any; error: string | null }> {
    try {
      const stats = await this.service.getStats(entityType, entityId);
      return { data: stats, error: null };
    } catch (error) {
      console.error('[CommentAPI] Error getting stats:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
