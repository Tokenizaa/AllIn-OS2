/**
 * Comments Module Index
 * 
 * Exporta todos os componentes do módulo de comentários.
 */

export { CommentRepository } from './repositories/comment.repository';

export { CommentService } from './services/comment.service';

export { CommentAPI } from './api/comment.api';

export type {
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
  CommentStats,
} from './dto/comment.dto';
