-- ============================================================================
-- MOVE SYSTEM TABLES - ALLIN OS 2.0
-- Move tabelas System para schema system
-- ============================================================================

BEGIN;

-- ============================================================================
-- MOVER TABELAS SYSTEM PARA SCHEMA SYSTEM
-- ============================================================================

-- Mover linguagens
ALTER TABLE linguagens SET SCHEMA system;

-- Mover fabricantes
ALTER TABLE fabricantes SET SCHEMA system;

-- Mover lojas
ALTER TABLE lojas SET SCHEMA system;

-- Mover tipos_pessoa
ALTER TABLE tipos_pessoa SET SCHEMA system;

-- ============================================================================
-- ATUALIZAR TRIGGERS PARA NOVO SCHEMA
-- ============================================================================

-- Drop triggers antigos
DROP TRIGGER IF EXISTS update_linguagens_updated_at ON system.linguagens;
DROP TRIGGER IF EXISTS update_fabricantes_updated_at ON system.fabricantes;
DROP TRIGGER IF EXISTS update_lojas_updated_at ON system.lojas;
DROP TRIGGER IF EXISTS update_tipos_pessoa_updated_at ON system.tipos_pessoa;

-- Recriar triggers no novo schema
CREATE TRIGGER update_linguagens_updated_at BEFORE UPDATE ON system.linguagens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fabricantes_updated_at BEFORE UPDATE ON system.fabricantes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lojas_updated_at BEFORE UPDATE ON system.lojas
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tipos_pessoa_updated_at BEFORE UPDATE ON system.tipos_pessoa
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS MOVIDAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'system'
ORDER BY tablename;

COMMIT;
