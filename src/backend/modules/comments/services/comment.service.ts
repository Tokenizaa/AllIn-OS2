import { CommentRepository } from "../repositories/comment.repository";
import { Comment, CreateCommentDto, UpdateCommentDto, CommentStats } from "../dto/comment.dto";

export class CommentService {
  private repository: CommentRepository;

  constructor() {
    this.repository = new CommentRepository();
  }

  async create(dto: CreateCommentDto): Promise<Comment> {
    const comment = await this.repository.create({
      ...dto,
      is_approved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return comment;
  }

  async findById(id: string): Promise<Comment | null> {
    return await this.repository.findById(id);
  }

  async findByEntity(entityType: string, entityId: string): Promise<Comment[]> {
    return await this.repository.findByEntity(entityType, entityId);
  }

  async findByAuthor(authorId: string): Promise<Comment[]> {
    return await this.repository.findByAuthor(authorId);
  }

  async findApproved(): Promise<Comment[]> {
    return await this.repository.findApproved();
  }

  async findPending(): Promise<Comment[]> {
    return await this.repository.findPending();
  }

  async findByParent(parentId: string): Promise<Comment[]> {
    return await this.repository.findByParent(parentId);
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    return await this.repository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async approve(id: string): Promise<void> {
    await this.repository.approve(id);
  }

  async reject(id: string): Promise<void> {
    await this.repository.reject(id);
  }

  async getStats(entityType?: string, entityId?: string): Promise<CommentStats> {
    return await this.repository.getStats(entityType, entityId);
  }
}
