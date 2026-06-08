import { Router, Request, Response } from 'express';
import { copilotService } from '../services/copilot.service';
import { ChatRequest } from '../dto/copilot.dto';

const router = Router();

/**
 * POST /api/copilot/chat
 * Send a message to the copilot
 */
export async function chat(req: Request, res: Response): Promise<void> {
  try {
    const { message, conversation_id, scope, route, context } = req.body as ChatRequest;
    
    // Get user info from session (in production, this would come from auth middleware)
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    const userRole = req.headers['x-user-role'] as string || 'distributor';

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const response = await copilotService.chat(
      { message, conversation_id, scope, route, context },
      userId,
      userRole
    );

    res.json(response);
  } catch (error) {
    console.error('[CopilotAPI] Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

router.post('/chat', chat);

/**
 * GET /api/copilot/conversations
 * List user's conversations
 */
export async function getConversations(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    
    const conversations = await copilotService.listConversations(userId);
    res.json(conversations);
  } catch (error) {
    console.error('[CopilotAPI] List conversations error:', error);
    res.status(500).json({ 
      error: 'Failed to list conversations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

router.get('/conversations', getConversations);

/**
 * GET /api/copilot/conversations/:id/messages
 * Get conversation history
 */
export async function getConversationMessages(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    
    const messages = await copilotService.getConversationHistory(userId, id);
    res.json(messages);
  } catch (error) {
    console.error('[CopilotAPI] Get messages error:', error);
    res.status(500).json({ 
      error: 'Failed to get messages',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

router.get('/conversations/:id/messages', getConversationMessages);

/**
 * POST /api/copilot/conversations/:id/archive
 * Archive a conversation
 */
export async function archiveConversation(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    
    await copilotService.archiveConversation(id, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('[CopilotAPI] Archive conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to archive conversation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

router.post('/conversations/:id/archive', archiveConversation);

/**
 * GET /api/copilot/health
 * Health check endpoint
 */
export async function healthCheck(req: Request, res: Response): Promise<void> {
  try {
    const health = await copilotService.healthCheck();
    res.json(health);
  } catch (error) {
    console.error('[CopilotAPI] Health check error:', error);
    res.status(500).json({ 
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

router.get('/health', healthCheck);

export default router;
