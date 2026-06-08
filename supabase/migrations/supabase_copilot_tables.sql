-- Copilot Tables Migration
-- FASE 12 - Ollama Copilot Implementation

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: copilot_conversations
CREATE TABLE IF NOT EXISTS copilot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  title TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_copilot_conversations_user_id ON copilot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_copilot_conversations_status ON copilot_conversations(status);
CREATE INDEX IF NOT EXISTS idx_copilot_conversations_updated_at ON copilot_conversations(updated_at DESC);

-- Table: copilot_messages
CREATE TABLE IF NOT EXISTS copilot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES copilot_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on conversation_id for faster queries
CREATE INDEX IF NOT EXISTS idx_copilot_messages_conversation_id ON copilot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_copilot_messages_created_at ON copilot_messages(created_at);

-- Table: copilot_context_snapshots
CREATE TABLE IF NOT EXISTS copilot_context_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES copilot_conversations(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  route TEXT,
  context_data JSONB NOT NULL,
  sources_used TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on conversation_id for faster queries
CREATE INDEX IF NOT EXISTS idx_copilot_context_snapshots_conversation_id ON copilot_context_snapshots(conversation_id);
CREATE INDEX IF NOT EXISTS idx_copilot_context_snapshots_user_id ON copilot_context_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_copilot_context_snapshots_created_at ON copilot_context_snapshots(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE copilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_context_snapshots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own conversations" ON copilot_conversations;
DROP POLICY IF EXISTS "Users can create own conversations" ON copilot_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON copilot_conversations;
DROP POLICY IF EXISTS "Admins can view all conversations" ON copilot_conversations;
DROP POLICY IF EXISTS "Users can view own conversation messages" ON copilot_messages;
DROP POLICY IF EXISTS "Users can create messages in own conversations" ON copilot_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON copilot_messages;
DROP POLICY IF EXISTS "Users can view own context snapshots" ON copilot_context_snapshots;
DROP POLICY IF EXISTS "Users can create own context snapshots" ON copilot_context_snapshots;
DROP POLICY IF EXISTS "Admins can view all context snapshots" ON copilot_context_snapshots;

-- RLS Policies for copilot_conversations
-- Users can read their own conversations
CREATE POLICY "Users can view own conversations"
  ON copilot_conversations FOR SELECT
  USING (user_id::text = auth.uid()::text);

-- Users can insert their own conversations
CREATE POLICY "Users can create own conversations"
  ON copilot_conversations FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON copilot_conversations FOR UPDATE
  USING (user_id::text = auth.uid()::text);

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations"
  ON copilot_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for copilot_messages
-- Users can read messages from their own conversations
CREATE POLICY "Users can view own conversation messages"
  ON copilot_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM copilot_conversations
      WHERE copilot_conversations.id = copilot_messages.conversation_id
      AND copilot_conversations.user_id::text = auth.uid()::text
    )
  );

-- Users can insert messages to their own conversations
CREATE POLICY "Users can create messages in own conversations"
  ON copilot_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM copilot_conversations
      WHERE copilot_conversations.id = copilot_messages.conversation_id
      AND copilot_conversations.user_id::text = auth.uid()::text
    )
  );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON copilot_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for copilot_context_snapshots
-- Users can read their own context snapshots
CREATE POLICY "Users can view own context snapshots"
  ON copilot_context_snapshots FOR SELECT
  USING (user_id::text = auth.uid()::text);

-- Users can insert their own context snapshots
CREATE POLICY "Users can create own context snapshots"
  ON copilot_context_snapshots FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

-- Admins can view all context snapshots
CREATE POLICY "Admins can view all context snapshots"
  ON copilot_context_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_copilot_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_copilot_conversations_updated_at
  BEFORE UPDATE ON copilot_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_copilot_conversations_updated_at();

-- Grant necessary permissions
GRANT ALL ON copilot_conversations TO authenticated;
GRANT ALL ON copilot_messages TO authenticated;
GRANT ALL ON copilot_context_snapshots TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
