-- ============================================================================
-- ADD AUTH USER ID AND RLS POLICIES - ALLIN OS 2.0
-- Adiciona coluna auth_user_id para integração com Supabase Auth
-- Adiciona RLS policies para user access em tabelas críticas
-- Sprint 1 - Task 1.1
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR COLUNA AUTH_USER_ID NAS TABELAS CRÍTICAS
-- ============================================================================

-- CRM.CUSTOMERS
ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- COMMERCE.PEDIDOS
ALTER TABLE commerce.pedidos ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- MLM.DISTRIBUIDORES
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- FINANCE.SOLICITACOES_SAQUE
ALTER TABLE finance.solicitacoes_saque ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ============================================================================
-- CRIAR ÍNDICES PARA AUTH_USER_ID
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON crm.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_auth_user_id ON commerce.pedidos(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_distribuidores_auth_user_id ON mlm.distribuidores(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_saque_auth_user_id ON finance.solicitacoes_saque(auth_user_id);

-- ============================================================================
-- CRM.CUSTOMERS RLS POLICIES
-- ============================================================================

-- Habilitar RLS se não estiver habilitado
ALTER TABLE crm.customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users podem ver próprios dados
CREATE POLICY "Users can view own customers"
  ON crm.customers FOR SELECT
  USING (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  );

-- Policy: Users podem atualizar próprios dados
CREATE POLICY "Users can update own customers"
  ON crm.customers FOR UPDATE
  USING (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  );

-- ============================================================================
-- COMMERCE.PEDIDOS RLS POLICIES
-- ============================================================================

-- Habilitar RLS se não estiver habilitado
ALTER TABLE commerce.pedidos ENABLE ROW LEVEL SECURITY;

-- Policy: Users podem ver próprios pedidos
CREATE POLICY "Users can view own orders"
  ON commerce.pedidos FOR SELECT
  USING (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  );

-- ============================================================================
-- MLM.DISTRIBUIDORES RLS POLICIES
-- ============================================================================

-- Habilitar RLS se não estiver habilitado
ALTER TABLE mlm.distribuidores ENABLE ROW LEVEL SECURITY;

-- Policy: Distribuidores podem ver próprios dados
CREATE POLICY "Distributors can view own data"
  ON mlm.distribuidores FOR SELECT
  USING (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  );

-- Policy: Distribuidores podem atualizar próprios dados
CREATE POLICY "Distributors can update own data"
  ON mlm.distribuidores FOR UPDATE
  USING (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  );

-- ============================================================================
-- FINANCE.SOLICITACOES_SAQUE RLS POLICIES
-- ============================================================================

-- Habilitar RLS se não estiver habilitado
ALTER TABLE finance.solicitacoes_saque ENABLE ROW LEVEL SECURITY;

-- Policy: Distribuidores podem ver próprias solicitações de saque
CREATE POLICY "Distributors can view own withdrawals"
  ON finance.solicitacoes_saque FOR SELECT
  USING (
    auth.uid() = auth_user_id OR
    auth.role() = 'service_role'
  );

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Adicionada coluna auth_user_id para integração com Supabase Auth
-- - Service role continua tendo full access (já existente)
-- - Users agora podem ver e atualizar próprios dados via auth_user_id
-- - INSERT e DELETE continuam restritos a service_role
-- - Backend deve preencher auth_user_id quando criar/atualizar registros
-- ============================================================================
