-- ============================================================================
-- ENABLE RLS FOR NEW TABLES - ALLIN OS 2.0
-- Adiciona RLS policies para tabelas criadas recentemente e habilita RLS
-- Sprint 4 - Production Readiness
-- ============================================================================

BEGIN;

-- ============================================================================
-- IDENTITY.ROLES
-- ============================================================================

-- Habilitar RLS
ALTER TABLE identity.roles ENABLE ROW LEVEL SECURITY;

-- Policy: Service role pode fazer tudo
CREATE POLICY "Service role can do anything on roles"
ON identity.roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Authenticated pode ler roles
CREATE POLICY "Authenticated can read roles"
ON identity.roles
FOR SELECT
TO authenticated
USING (true);

-- Policy: Anon pode ler roles do sistema
CREATE POLICY "Anon can read system roles"
ON identity.roles
FOR SELECT
TO anon
USING (is_system = true);

-- ============================================================================
-- IDENTITY.USER_ROLES
-- ============================================================================

-- Habilitar RLS
ALTER TABLE identity.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Service role pode fazer tudo
CREATE POLICY "Service role can do anything on user_roles"
ON identity.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Usuário pode ler suas próprias roles
CREATE POLICY "Users can read own user_roles"
ON identity.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- CRM.CUSTOMER_DISTRIBUTOR
-- ============================================================================

-- Habilitar RLS
ALTER TABLE crm.customer_distributor ENABLE ROW LEVEL SECURITY;

-- Policy: Service role pode fazer tudo
CREATE POLICY "Service role can do anything on customer_distributor"
ON crm.customer_distributor
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Usuários podem ler se tiverem permissão
CREATE POLICY "Users can read customer_distributor"
ON crm.customer_distributor
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- SYSTEM.EMBEDDINGS
-- ============================================================================

-- Habilitar RLS
ALTER TABLE system.embeddings ENABLE ROW LEVEL SECURITY;

-- Policy: Service role pode fazer tudo
CREATE POLICY "Service role can do anything on embeddings"
ON system.embeddings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Authenticated pode ler embeddings
CREATE POLICY "Authenticated can read embeddings"
ON system.embeddings
FOR SELECT
TO authenticated
USING (true);

-- Policy: Anon não pode acessar embeddings
CREATE POLICY "Anon cannot access embeddings"
ON system.embeddings
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

COMMIT;

-- ============================================================================
-- NOTAS:
-- - RLS habilitado para identity.roles, identity.user_roles, crm.customer_distributor, system.embeddings
-- - Service role tem acesso total para operações administrativas
-- - Authenticated users têm acesso de leitura conforme necessário
-- - Anon tem acesso limitado apenas a roles do sistema
-- - Embeddings protegidos contra acesso anônimo
-- ============================================================================
