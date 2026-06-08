import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatResponse, ContextData, OllamaChatRequest } from '../dto/copilot.dto';
import { CopilotConversationRepository } from '../repositories/copilot.repository';
import { CopilotMessageRepository } from '../repositories/copilot.repository';
import { CopilotContextSnapshotRepository } from '../repositories/copilot.repository';
import { ollamaProvider } from '../providers/ollama.provider';
import { contextBuilder } from '../context/context-builder';
import { getSystemPrompt, RESPONSE_STRUCTURE_PROMPT } from '../prompts/system-prompts';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { getPermissionsForRole } from '../../auth/guards/permission.guard';

export class CopilotService {
  private conversationRepository: CopilotConversationRepository;
  private messageRepository: CopilotMessageRepository;
  private contextSnapshotRepository: CopilotContextSnapshotRepository;

  constructor() {
    this.conversationRepository = new CopilotConversationRepository();
    this.messageRepository = new CopilotMessageRepository();
    this.contextSnapshotRepository = new CopilotContextSnapshotRepository();
  }

  async chat(request: ChatRequest, userId: string, userRole: string): Promise<ChatResponse> {
    // Validate RBAC before proceeding
    await this.validateAccess(userId, userRole);

    // Get or create conversation
    let conversationId = request.conversation_id;
    if (!conversationId) {
      conversationId = await this.createConversation(userId);
    }

    // Build context
    const context = await contextBuilder.buildContext(userId, userRole, request.route);

    // Save context snapshot
    await this.contextSnapshotRepository.createSnapshot({
      conversation_id: conversationId,
      user_id: userId,
      role: userRole,
      route: request.route,
      context_data: context,
      sources_used: this.extractSources(context),
    });

    // Get conversation history
    const history = await this.messageRepository.getConversationHistory(conversationId, 10);

    // Build prompt
    const systemPrompt = getSystemPrompt(userRole);
    const contextPrompt = this.buildContextPrompt(context);
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt + contextPrompt + RESPONSE_STRUCTURE_PROMPT },
      ...history,
      { role: 'user', content: request.message },
    ];

    // Call Ollama
    const ollamaRequest: OllamaChatRequest = {
      model: 'tinyllama',
      messages,
      stream: false,
      options: {
        temperature: 0.3,
        num_ctx: 2048,
        num_predict: 512,
      },
    };

    const startTime = Date.now();
    const ollamaResponse = await ollamaProvider.chat(ollamaRequest);
    const responseTime = Date.now() - startTime;

    // Parse response
    let answer = ollamaResponse.message.content;
    let actions: any[] = [];
    let sources: any[] = [];
    let confidence = 0.7;
    let warnings: string[] = [];

    // Try to parse structured response
    try {
      const jsonMatch = answer.match(/```json\n([\s\S]*?)\n```/) || answer.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const structured = JSON.parse(jsonStr);
        
        if (structured.answer) {
          answer = structured.answer;
        }
        if (structured.actions) {
          actions = structured.actions;
        }
        if (structured.sources) {
          sources = structured.sources;
        }
        if (structured.confidence !== undefined) {
          confidence = structured.confidence;
        }
        if (structured.warnings) {
          warnings = structured.warnings;
        }
      }
    } catch (e) {
      // If parsing fails, use raw response
      console.warn('[CopilotService] Failed to parse structured response:', e);
    }

    // Add data quality warnings from context
    if (context.alerts && context.alerts.length > 0) {
      warnings.push(...context.alerts.map(a => a.message));
    }

    // Save user message
    await this.messageRepository.create({
      id: uuidv4(),
      conversation_id: conversationId,
      role: 'user',
      content: request.message,
      metadata: {
        route: request.route,
        context_summary: this.summarizeContext(context),
      },
      created_at: new Date().toISOString(),
    });

    // Save assistant message
    const messageId = uuidv4();
    await this.messageRepository.create({
      id: messageId,
      conversation_id: conversationId,
      role: 'assistant',
      content: answer,
      metadata: {
        model: 'tinyllama',
        response_time_ms: responseTime,
        confidence,
        sources: sources.length,
        actions: actions.length,
      },
      created_at: new Date().toISOString(),
    });

    // Update conversation timestamp
    await this.conversationRepository.update(conversationId, {
      updated_at: new Date().toISOString(),
    });

    return {
      conversation_id: conversationId,
      message_id: messageId,
      answer,
      actions,
      sources,
      confidence,
      warnings,
      metadata: {
        response_time_ms: responseTime,
        model: 'tinyllama',
      },
    };
  }

  async getConversationHistory(userId: string, conversationId?: string): Promise<any[]> {
    let targetConversationId = conversationId;

    if (!targetConversationId) {
      const activeConversation = await this.conversationRepository.findActiveByUserId(userId);
      targetConversationId = activeConversation?.id;
    }

    if (!targetConversationId) {
      return [];
    }

    const messages = await this.messageRepository.findByConversationId(targetConversationId);
    return messages;
  }

  async listConversations(userId: string): Promise<any[]> {
    return this.conversationRepository.findByUserId(userId, { status: 'active' });
  }

  async archiveConversation(conversationId: string, userId: string): Promise<void> {
    // Validate ownership
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation || conversation.user_id !== userId) {
      throw new Error('Conversation not found or access denied');
    }

    await this.conversationRepository.archiveConversation(conversationId);
  }

  private async createConversation(userId: string): Promise<string> {
    const conversation = await this.conversationRepository.create({
      id: uuidv4(),
      user_id: userId,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return conversation.id;
  }

  private buildContextPrompt(context: ContextData): string {
    let prompt = '\n\nCONTEXTO DO SISTEMA:\n';
    prompt += `- Usuário: ${context.user.name} (${context.user.role})\n`;
    
    if (context.route) {
      prompt += `- Rota atual: ${context.route}\n`;
    }

    if (context.kpis) {
      prompt += '\nMÉTRICAS:\n';
      if (context.kpis.total_customers !== undefined) {
        prompt += `- Total de clientes: ${context.kpis.total_customers}\n`;
      }
      if (context.kpis.active_customers !== undefined) {
        prompt += `- Clientes ativos: ${context.kpis.active_customers}\n`;
      }
      if (context.kpis.total_orders !== undefined) {
        prompt += `- Total de pedidos: ${context.kpis.total_orders}\n`;
      }
      if (context.kpis.total_revenue !== undefined) {
        prompt += `- Receita total: R$ ${context.kpis.total_revenue.toFixed(2)}\n`;
      }
      if (context.kpis.network_size !== undefined) {
        prompt += `- Tamanho da rede: ${context.kpis.network_size}\n`;
      }
      if (context.kpis.wallet_balance !== undefined) {
        prompt += `- Saldo da carteira: R$ ${context.kpis.wallet_balance.toFixed(2)}\n`;
      }
    }

    if (context.recent_activity) {
      prompt += '\nATIVIDADE RECENTE:\n';
      if (context.recent_activity.recent_orders !== undefined) {
        prompt += `- Pedidos recentes: ${context.recent_activity.recent_orders}\n`;
      }
      if (context.recent_activity.recent_payments !== undefined) {
        prompt += `- Pagamentos recentes: ${context.recent_activity.recent_payments}\n`;
      }
      if (context.recent_activity.recent_signups !== undefined) {
        prompt += `- Novos cadastros: ${context.recent_activity.recent_signups}\n`;
      }
    }

    if (context.alerts && context.alerts.length > 0) {
      prompt += '\nALERTAS:\n';
      context.alerts.forEach(alert => {
        prompt += `- [${alert.type.toUpperCase()}] ${alert.message} (${alert.source})\n`;
      });
    }

    return prompt;
  }

  private extractSources(context: ContextData): string[] {
    const sources: string[] = [];

    if (context.kpis.total_customers !== undefined) {
      sources.push('customers');
    }
    if (context.kpis.total_orders !== undefined) {
      sources.push('orders');
    }
    if (context.kpis.total_revenue !== undefined) {
      sources.push('analytics');
    }
    if (context.kpis.network_size !== undefined) {
      sources.push('network');
    }
    if (context.kpis.wallet_balance !== undefined) {
      sources.push('wallets');
    }

    return sources;
  }

  private summarizeContext(context: ContextData): Record<string, any> {
    return {
      user_id: context.user.id,
      role: context.user.role,
      route: context.route,
      kpis_count: Object.keys(context.kpis).length,
      alerts_count: context.alerts?.length || 0,
    };
  }

  private async validateAccess(userId: string, role: string): Promise<void> {
    // Basic validation - in production, this would be more comprehensive
    const permissions = getPermissionsForRole(role);
    
    if (!permissions || permissions.length === 0) {
      throw new Error(`Invalid role: ${role}`);
    }

    // Additional validation can be added here
    // For example, checking if user has active profile, etc.
  }

  async healthCheck(): Promise<{ ollama: boolean; database: boolean }> {
    const ollamaHealthy = await ollamaProvider.healthCheck();
    
    // Simple database health check
    let databaseHealthy = false;
    try {
      await this.conversationRepository.findAll({ limit: 1 });
      databaseHealthy = true;
    } catch (error) {
      console.error('[CopilotService] Database health check failed:', error);
    }

    return {
      ollama: ollamaHealthy,
      database: databaseHealthy,
    };
  }
}

export const copilotService = new CopilotService();
