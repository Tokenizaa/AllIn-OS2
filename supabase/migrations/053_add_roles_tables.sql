-- ============================================================================
-- ADD ROLES TABLES - ALLIN OS 2.0
-- Cria tabelas para gerenciar roles e permissões de usuários
-- Sprint 3 - Task 3.1
-- ============================================================================

BEGIN;

-- ============================================================================
-- IDENTITY.ROLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS identity.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_roles_name ON identity.roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_is_system ON identity.roles(is_system);

-- ============================================================================
-- IDENTITY.USER_ROLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS identity.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES identity.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON identity.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON identity.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_is_active ON identity.user_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_expires_at ON identity.user_roles(expires_at);

-- ============================================================================
-- INSERIR ROLES PADRÃO DO SISTEMA
-- ============================================================================
INSERT INTO identity.roles (name, description, permissions, is_system) VALUES
    ('admin', 'Administrador do sistema com acesso completo', '{"all": true}', true),
    ('manager', 'Gerente com acesso a funcionalidades de gestão', '{"customers": ["read", "write"], "orders": ["read", "write"], "reports": ["read"]}', true),
    ('distributor', 'Distribuidor MLM com acesso limitado', '{"profile": ["read", "write"], "commissions": ["read"], "network": ["read"]}', true),
    ('customer', 'Cliente com acesso básico', '{"profile": ["read", "write"], "orders": ["read", "write"]}', true),
    ('support', 'Suporte com acesso a dados de clientes', '{"customers": ["read"], "orders": ["read", "write"]}', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON identity.roles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON identity.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS CRIADAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'identity'
  AND tablename IN ('roles', 'user_roles')
ORDER BY tablename;

-- ============================================================================
-- VERIFICAR ROLES INSERIDAS
-- ============================================================================
SELECT 
    name,
    description,
    is_system
FROM identity.roles
ORDER BY name;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Tabela identity.roles define as roles do sistema
-- - Tabela identity.user_roles associa usuários a roles
-- - Roles podem ter permissões definidas em JSONB
-- - Roles podem expirar (expires_at)
-- - Roles do sistema (is_system) não podem ser excluídas
-- ============================================================================
