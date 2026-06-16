import { BaseRepository } from "../../../infra/database/base.repository";
import { CopilotConversation, CopilotMessage, CopilotContextSnapshot } from "../dto/copilot.dto";

export class CopilotConversationRepository extends BaseRepository<CopilotConversation> {
  constructor() {
    super("copilot_conversations");
  }

  async findByUserId(userId: string, options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<CopilotConversation[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId);

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query.order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findActiveByUserId(userId: string): Promise<CopilotConversation | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  }

  async archiveConversation(conversationId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (error) throw error;
  }
}

export class CopilotMessageRepository extends BaseRepository<CopilotMessage> {
  constructor() {
    super("copilot_messages");
  }

  async findByConversationId(conversationId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<CopilotMessage[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("conversation_id", conversationId);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getConversationHistory(conversationId: string, limit: number = 10): Promise<Array<{ role: string; content: string }>> {
    const messages = await this.findByConversationId(conversationId, { limit });
    
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}

export class CopilotContextSnapshotRepository extends BaseRepository<CopilotContextSnapshot> {
  constructor() {
    super("copilot_context_snapshots");
  }

  async findByConversationId(conversationId: string): Promise<CopilotContextSnapshot[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createSnapshot(snapshot: Omit<CopilotContextSnapshot, 'id' | 'created_at'>): Promise<CopilotContextSnapshot> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .insert({
        ...snapshot,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
