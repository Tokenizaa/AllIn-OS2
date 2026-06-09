import { useState, useCallback } from 'react';
import { copilotService, ChatRequest, ChatResponse, CopilotConversation, CopilotMessage } from '@/services/copilot.service';

export function useCopilot() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [conversations, setConversations] = useState<CopilotConversation[]>([]);

  const sendMessage = useCallback(async (request: ChatRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await copilotService.chat({
        ...request,
        conversation_id: request.conversation_id || currentConversationId,
      });

      // Update conversation ID if it's a new conversation
      if (response.conversation_id && response.conversation_id !== currentConversationId) {
        setCurrentConversationId(response.conversation_id);
      }

      // Add messages to the list
      setMessages(prev => [
        ...prev,
        {
          id: response.message_id,
          conversation_id: response.conversation_id,
          role: 'user',
          content: request.message,
          created_at: new Date().toISOString(),
        },
        {
          id: response.message_id + '_assistant',
          conversation_id: response.conversation_id,
          role: 'assistant',
          content: response.answer,
          metadata: {
            confidence: response.confidence,
            sources: response.sources,
            actions: response.actions,
            warnings: response.warnings,
          },
          created_at: new Date().toISOString(),
        },
      ]);

      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const convs = await copilotService.getConversations();
      setConversations(convs);
      return convs;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load conversations');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const msgs = await copilotService.getConversationMessages(conversationId);
      setMessages(msgs);
      setCurrentConversationId(conversationId);
      return msgs;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load messages');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const archiveConversation = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await copilotService.archiveConversation(conversationId);
      
      // Remove from local state
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(undefined);
        setMessages([]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to archive conversation');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const startNewConversation = useCallback(() => {
    setCurrentConversationId(undefined);
    setMessages([]);
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      return await copilotService.healthCheck();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Health check failed');
      setError(error);
      return { ollama: false, database: false };
    }
  }, []);

  return {
    isLoading,
    error,
    currentConversationId,
    messages,
    conversations,
    sendMessage,
    loadConversations,
    loadMessages,
    archiveConversation,
    startNewConversation,
    checkHealth,
  };
}
