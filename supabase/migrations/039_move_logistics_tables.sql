-- ============================================================================
-- MOVE LOGISTICS TABLES - ALLIN OS 2.0
-- Move tabelas Logistics para schema logistics
-- ============================================================================

BEGIN;

-- ============================================================================
-- MOVER TABELAS LOGISTICS PARA SCHEMA LOGISTICS
-- ============================================================================

-- Mover transportadoras
ALTER TABLE transportadoras SET SCHEMA logistics;

-- ============================================================================
-- ATUALIZAR TRIGGERS PARA NOVO SCHEMA
-- ============================================================================

-- Drop trigger antigo
DROP TRIGGER IF EXISTS update_transportadoras_updated_at ON logistics.transportadoras;

-- Recriar trigger no novo schema
CREATE TRIGGER update_transportadoras_updated_at BEFORE UPDATE ON logistics.transportadoras
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS MOVIDAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'logistics'
ORDER BY tablename;

COMMIT;
