import { BaseRepository } from "../../../infra/database/base.repository";
import { Comment, CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";

export class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super("comments");
  }

  async findByEntity(entityType: string, entityId: string): Promise<Comment[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByAuthor(authorId: string): Promise<Comment[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("author_id", authorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findApproved(): Promise<Comment[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findPending(): Promise<Comment[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_approved", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByParent(parentId: string): Promise<Comment[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("parent_id", parentId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async approve(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }

  async reject(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ is_approved: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }

  async getStats(entityType?: string, entityId?: string): Promise<{
    total_comments: number;
    approved_comments: number;
    pending_comments: number;
    average_rating: number;
    rating_distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  }> {
    let query = this.getClient().from(this.tableName).select("*");

    if (entityType) {
      query = query.eq("entity_type", entityType);
    }

    if (entityId) {
      query = query.eq("entity_id", entityId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const comments = data || [];
    const totalComments = comments.length;
    const approvedComments = comments.filter(c => c.is_approved).length;
    const pendingComments = comments.filter(c => !c.is_approved).length;

    const ratedComments = comments.filter(c => c.rating !== null);
    const averageRating = ratedComments.length > 0
      ? ratedComments.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedComments.length
      : 0;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratedComments.forEach(c => {
      const rating = c.rating || 0;
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating as keyof typeof ratingDistribution]++;
      }
    });

    return {
      total_comments: totalComments,
      approved_comments: approvedComments,
      pending_comments: pendingComments,
      average_rating: averageRating,
      rating_distribution: ratingDistribution,
    };
  }
}
