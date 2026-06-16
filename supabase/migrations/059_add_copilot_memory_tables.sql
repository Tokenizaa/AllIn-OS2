-- ============================================================================
-- ADD COPILOT MEMORY TABLES - ALLIN OS 2.0
-- Tabelas de memória e snapshot de contexto para o Copilot IA
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- COPILOT CONVERSATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.copilot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_copilot_conversations_user_id
    ON public.copilot_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_copilot_conversations_status
    ON public.copilot_conversations(status);

CREATE INDEX IF NOT EXISTS idx_copilot_conversations_updated_at
    ON public.copilot_conversations(updated_at DESC);

-- ============================================================================
-- COPILOT MESSAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.copilot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.copilot_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_copilot_messages_conversation_id
    ON public.copilot_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_copilot_messages_created_at
    ON public.copilot_messages(created_at);

-- ============================================================================
-- COPILOT CONTEXT SNAPSHOTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.copilot_context_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.copilot_conversations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    route TEXT,
    context_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    sources_used TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_copilot_context_snapshots_conversation_id
    ON public.copilot_context_snapshots(conversation_id);

CREATE INDEX IF NOT EXISTS idx_copilot_context_snapshots_user_id
    ON public.copilot_context_snapshots(user_id);

CREATE INDEX IF NOT EXISTS idx_copilot_context_snapshots_created_at
    ON public.copilot_context_snapshots(created_at DESC);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_copilot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_copilot_conversations_updated_at ON public.copilot_conversations;
CREATE TRIGGER trigger_copilot_conversations_updated_at
    BEFORE UPDATE ON public.copilot_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_copilot_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE public.copilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_context_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage copilot conversations" ON public.copilot_conversations;
CREATE POLICY "Service role can manage copilot conversations"
ON public.copilot_conversations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read own conversations" ON public.copilot_conversations;
CREATE POLICY "Authenticated users can read own conversations"
ON public.copilot_conversations
FOR SELECT
TO authenticated
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated users can insert own conversations" ON public.copilot_conversations;
CREATE POLICY "Authenticated users can insert own conversations"
ON public.copilot_conversations
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Service role can manage copilot messages" ON public.copilot_messages;
CREATE POLICY "Service role can manage copilot messages"
ON public.copilot_messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read own messages" ON public.copilot_messages;
CREATE POLICY "Authenticated users can read own messages"
ON public.copilot_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.copilot_conversations c
        WHERE c.id = conversation_id
          AND c.user_id = auth.uid()::text
    )
);

DROP POLICY IF EXISTS "Service role can manage copilot context snapshots" ON public.copilot_context_snapshots;
CREATE POLICY "Service role can manage copilot context snapshots"
ON public.copilot_context_snapshots
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read own context snapshots" ON public.copilot_context_snapshots;
CREATE POLICY "Authenticated users can read own context snapshots"
ON public.copilot_context_snapshots
FOR SELECT
TO authenticated
USING (user_id = auth.uid()::text);

COMMIT;

