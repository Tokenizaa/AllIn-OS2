import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().uuid(),
  entity_type: z.string(),
  entity_id: z.string().uuid(),
  author_id: z.string().uuid(),
  author_name: z.string(),
  author_email: z.string().email(),
  content: z.string(),
  rating: z.number().min(1).max(5).nullable(),
  parent_id: z.string().uuid().nullable(),
  is_approved: z.boolean().default(false),
  is_verified_purchase: z.boolean().default(false),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Comment = z.infer<typeof commentSchema>;

export const createCommentSchema = z.object({
  entity_type: z.string(),
  entity_id: z.string().uuid(),
  author_id: z.string().uuid(),
  author_name: z.string(),
  author_email: z.string().email(),
  content: z.string(),
  rating: z.number().min(1).max(5).optional(),
  parent_id: z.string().uuid().optional(),
  is_verified_purchase: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  content: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  is_approved: z.boolean().optional(),
  is_verified_purchase: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

export const commentStatsSchema = z.object({
  total_comments: z.number(),
  approved_comments: z.number(),
  pending_comments: z.number(),
  average_rating: z.number(),
  rating_distribution: z.object({
    1: z.number(),
    2: z.number(),
    3: z.number(),
    4: z.number(),
    5: z.number(),
  }),
});

export type CommentStats = z.infer<typeof commentStatsSchema>;
