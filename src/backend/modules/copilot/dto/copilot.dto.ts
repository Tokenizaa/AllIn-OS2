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

export interface CopilotContextSnapshot {
  id: string;
  conversation_id: string;
  user_id: string;
  role: string;
  route?: string;
  context_data: Record<string, any>;
  sources_used: string[];
  created_at: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  scope?: 'admin' | 'office' | 'public';
  route?: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  conversation_id: string;
  message_id: string;
  answer: string;
  actions?: CopilotAction[];
  sources?: CopilotSource[];
  confidence: number;
  warnings?: string[];
  metadata?: Record<string, any>;
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

export interface OllamaChatRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_ctx?: number;
    num_predict?: number;
  };
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
  total_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface ContextData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  route?: string;
  kpis: {
    total_customers?: number;
    active_customers?: number;
    total_orders?: number;
    total_revenue?: number;
    network_size?: number;
    wallet_balance?: number;
  };
  recent_activity?: {
    recent_orders?: number;
    recent_payments?: number;
    recent_signups?: number;
  };
  alerts?: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    source: string;
  }>;
}
