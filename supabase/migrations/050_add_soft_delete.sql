-- ============================================================================
-- ADD SOFT DELETE - ALLIN OS 2.0
-- Adiciona coluna deleted_at para implementar soft delete em tabelas principais
-- Sprint 2 - Task 2.2
-- ============================================================================

BEGIN;

-- ============================================================================
-- CRM.CUSTOMERS
-- ============================================================================
ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON crm.customers(deleted_at);

-- ============================================================================
-- MLM.DISTRIBUIDORES
-- ============================================================================
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_distribuidores_deleted_at ON mlm.distribuidores(deleted_at);

-- ============================================================================
-- COMMERCE.PEDIDOS
-- ============================================================================
ALTER TABLE commerce.pedidos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_pedidos_deleted_at ON commerce.pedidos(deleted_at);

-- ============================================================================
-- COMMERCE.PRODUTOS
-- ============================================================================
ALTER TABLE commerce.produtos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_produtos_deleted_at ON commerce.produtos(deleted_at);

-- ============================================================================
-- FINANCE.SOLICITACOES_SAQUE
-- ============================================================================
ALTER TABLE finance.solicitacoes_saque ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_solicitacoes_saque_deleted_at ON finance.solicitacoes_saque(deleted_at);

-- ============================================================================
-- VERIFICAR COLUNAS ADICIONADAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    column_name,
    data_type
FROM information_schema.columns
WHERE schemaname IN ('crm', 'mlm', 'commerce', 'finance')
  AND column_name = 'deleted_at'
  AND tablename IN ('customers', 'distribuidores', 'pedidos', 'produtos', 'solicitacoes_saque')
ORDER BY schemaname, tablename;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Coluna deleted_at adicionada para implementar soft delete
-- - Índices criados para otimizar queries filtrando deleted_at IS NULL
-- - Repositories devem ser atualizados para filtrar deleted_at IS NULL
-- - Services devem usar soft delete em vez de DELETE
-- - RLS policies devem considerar deleted_at
-- ============================================================================
