-- ============================================================================
-- MOVE CRM TABLES - ALLIN OS 2.0
-- Move tabelas CRM para schema crm
-- ============================================================================

BEGIN;

-- ============================================================================
-- MOVER TABELAS CRM PARA SCHEMA CRM
-- ============================================================================

-- Mover customers
ALTER TABLE customers SET SCHEMA crm;

-- ============================================================================
-- ATUALIZAR TRIGGERS PARA NOVO SCHEMA
-- ============================================================================

-- Drop trigger antigo
DROP TRIGGER IF EXISTS update_customers_updated_at ON crm.customers;

-- Recriar trigger no novo schema
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON crm.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS MOVIDAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'crm'
ORDER BY tablename;

COMMIT;
