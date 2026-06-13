-- ============================================================================
-- MOVE FINANCE TABLES - ALLIN OS 2.0
-- Move tabelas Finance para schema finance
-- ============================================================================

BEGIN;

-- ============================================================================
-- MOVER TABELAS FINANCE PARA SCHEMA FINANCE
-- ============================================================================

-- Mover solicitacoes_saque
ALTER TABLE solicitacoes_saque SET SCHEMA finance;

-- Mover solicitacoes_saque_cd
ALTER TABLE solicitacoes_saque_cd SET SCHEMA finance;

-- ============================================================================
-- ATUALIZAR TRIGGERS PARA NOVO SCHEMA
-- ============================================================================

-- Drop triggers antigos
DROP TRIGGER IF EXISTS update_solicitacoes_saque_updated_at ON finance.solicitacoes_saque;
DROP TRIGGER IF EXISTS update_solicitacoes_saque_cd_updated_at ON finance.solicitacoes_saque_cd;

-- Recriar triggers no novo schema
CREATE TRIGGER update_solicitacoes_saque_updated_at BEFORE UPDATE ON finance.solicitacoes_saque
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solicitacoes_saque_cd_updated_at BEFORE UPDATE ON finance.solicitacoes_saque_cd
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS MOVIDAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'finance'
ORDER BY tablename;

COMMIT;
