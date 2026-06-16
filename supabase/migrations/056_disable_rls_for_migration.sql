-- ============================================================================
-- DISABLE RLS FOR MIGRATION (TEMPORARY)
-- This migration disables RLS temporarily to allow data migration
-- Re-enable RLS after migration is complete
-- ============================================================================

BEGIN;

-- Disable RLS on tables that need migration access
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE distribuidores DISABLE ROW LEVEL SECURITY;
ALTER TABLE produtos DISABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE planos DISABLE ROW LEVEL SECURITY;

COMMIT;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname IN ('public', 'crm', 'mlm', 'commerce', 'finance')
AND tablename IN ('customers', 'distribuidores', 'produtos', 'pedidos', 'planos')
ORDER BY tablename;
