-- ============================================================================
-- UPDATE RLS POLICIES FOR SOFT DELETE - ALLIN OS 2.0
-- Atualiza RLS policies para considerar coluna deleted_at
-- Sprint 2 - Task 2.2
-- ============================================================================

BEGIN;

-- ============================================================================
-- CRM.CUSTOMERS
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS customers_select_own ON crm.customers;
DROP POLICY IF EXISTS customers_update_own ON crm.customers;
DROP POLICY IF EXISTS customers_service_role_all ON crm.customers;

-- Create new policies considering soft delete
CREATE POLICY customers_select_own ON crm.customers
  FOR SELECT
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY customers_update_own ON crm.customers
  FOR UPDATE
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY customers_service_role_all ON crm.customers
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- MLM.DISTRIBUIDORES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS distribuidores_select_own ON mlm.distribuidores;
DROP POLICY IF EXISTS distribuidores_update_own ON mlm.distribuidores;
DROP POLICY IF EXISTS distribuidores_service_role_all ON mlm.distribuidores;

-- Create new policies considering soft delete
CREATE POLICY distribuidores_select_own ON mlm.distribuidores
  FOR SELECT
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY distribuidores_update_own ON mlm.distribuidores
  FOR UPDATE
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY distribuidores_service_role_all ON mlm.distribuidores
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- COMMERCE.PEDIDOS
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS pedidos_select_own ON commerce.pedidos;
DROP POLICY IF EXISTS pedidos_service_role_all ON commerce.pedidos;

-- Create new policies considering soft delete
CREATE POLICY pedidos_select_own ON commerce.pedidos
  FOR SELECT
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY pedidos_service_role_all ON commerce.pedidos
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- FINANCE.SOLICITACOES_SAQUE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS solicitacoes_saque_select_own ON finance.solicitacoes_saque;
DROP POLICY IF EXISTS solicitacoes_saque_service_role_all ON finance.solicitacoes_saque;

-- Create new policies considering soft delete
CREATE POLICY solicitacoes_saque_select_own ON finance.solicitacoes_saque
  FOR SELECT
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY solicitacoes_saque_service_role_all ON finance.solicitacoes_saque
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- VERIFICAR POLICIES ATUALIZADAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname IN ('crm', 'mlm', 'commerce', 'finance')
  AND tablename IN ('customers', 'distribuidores', 'pedidos', 'solicitacoes_saque')
ORDER BY schemaname, tablename, policyname;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - RLS policies atualizadas para considerar deleted_at IS NULL
-- - Usuários só podem ver/atualizar registros não deletados
-- - service_role tem acesso completo (incluindo registros deletados)
-- ============================================================================
