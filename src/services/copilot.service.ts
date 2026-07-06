import { supabase } from '@/lib/supabase/client';

export interface CopilotMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CopilotConversation {
  id: string;
  user_id: string;
  title?: string;
  status: 'active' | 'archived';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CopilotAction {
  id: string;
  label: string;
  type: 'navigate' | 'execute' | 'query' | 'alert';
  target?: string;
  params?: Record<string, any>;
  requires_confirmation?: boolean;
}

export interface CopilotSource {
  id: string;
  label: string;
  type: 'supabase' | 'service' | 'cache';
  table?: string;
  summary: string;
  record_count?: number;
}

export interface ChatResponse {
  conversation_id: string;
  message_id: string;
  answer: string;
  actions?: CopilotAction[];
  sources?: CopilotSource[];
  confidence: number;
  warnings?: string[];
  metadata?: {
    response_time_ms: number;
    model: string;
  };
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  scope?: 'admin' | 'office' | 'public';
  route?: string;
  context?: Record<string, any>;
}

export class CopilotService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/copilot') {
    this.baseUrl = baseUrl;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Get current user info from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      
      // Get user role from crm.user_roles_view (view over identity.user_roles)
      // tipo_cliente in crm.customers is for commercial classification only
      let userRole = 'distributor'; // default
      if (userId !== 'anonymous') {
        const { data: userRoleData } = await supabase
          .schema('crm')
          .from('user_roles_view')
          .select('role_name')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (userRoleData) {
          userRole = userRoleData.role_name;
        }
      }

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
          'x-user-role': userRole,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('[CopilotService] Chat error:', error);
      throw error;
    }
  }

  async getConversations(): Promise<CopilotConversation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';

      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'GET',
        headers: {
          'x-user-id': userId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      return await response.json();
    } catch (error) {
      console.error('[CopilotService] Get conversations error:', error);
      return [];
    }
  }

  async getConversationMessages(conversationId: string): Promise<CopilotMessage[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';

      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'x-user-id': userId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      return await response.json();
    } catch (error) {
      console.error('[CopilotService] Get messages error:', error);
      return [];
    }
  }

  async archiveConversation(conversationId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';

      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/archive`, {
        method: 'POST',
        headers: {
          'x-user-id': userId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to archive conversation');
      }
    } catch (error) {
      console.error('[CopilotService] Archive conversation error:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ ollama: boolean; database: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      return await response.json();
    } catch (error) {
      console.error('[CopilotService] Health check error:', error);
      return { ollama: false, database: false };
    }
  }

  async streamChat(
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: (response: ChatResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // Get current user info from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      
      // Get user role from crm.user_roles_view (view over identity.user_roles)
      // tipo_cliente in crm.customers is for commercial classification only
      let userRole = 'distributor'; // default
      if (userId !== 'anonymous') {
        const { data: userRoleData } = await supabase
          .schema('crm')
          .from('user_roles_view')
          .select('role_name')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (userRoleData) {
          userRole = userRoleData.role_name;
        }
      }

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
          'x-user-role': userRole,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      // For now, we don't have streaming implemented in the backend
      // So we'll just return the full response
      const data = await response.json();
      onComplete(data);
    } catch (error) {
      console.error('[CopilotService] Stream chat error:', error);
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}

export const copilotService = new CopilotService();
