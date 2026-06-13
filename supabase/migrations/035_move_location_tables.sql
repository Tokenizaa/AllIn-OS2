-- ============================================================================
-- MOVE LOCATION TABLES - ALLIN OS 2.0
-- Move tabelas de localização para schema location
-- ============================================================================

BEGIN;

-- ============================================================================
-- MOVER TABELAS DE LOCALIZAÇÃO PARA SCHEMA LOCATION
-- ============================================================================

-- Mover paises
ALTER TABLE paises SET SCHEMA location;

-- Mover estados
ALTER TABLE estados SET SCHEMA location;

-- Mover cidades
ALTER TABLE cidades SET SCHEMA location;

-- Mover cep
ALTER TABLE cep SET SCHEMA location;

-- Mover estados_civil
ALTER TABLE estados_civil SET SCHEMA location;

-- ============================================================================
-- ATUALIZAR TRIGGERS PARA NOVO SCHEMA
-- ============================================================================

-- Drop triggers antigos
DROP TRIGGER IF EXISTS update_paises_updated_at ON location.paises;
DROP TRIGGER IF EXISTS update_estados_updated_at ON location.estados;
DROP TRIGGER IF EXISTS update_cidades_updated_at ON location.cidades;
DROP TRIGGER IF EXISTS update_cep_updated_at ON location.cep;
DROP TRIGGER IF EXISTS update_estados_civil_updated_at ON location.estados_civil;

-- Recriar triggers no novo schema
CREATE TRIGGER update_paises_updated_at BEFORE UPDATE ON location.paises
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estados_updated_at BEFORE UPDATE ON location.estados
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cidades_updated_at BEFORE UPDATE ON location.cidades
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cep_updated_at BEFORE UPDATE ON location.cep
    FOR EACH ROW EXECUTE FUNCTION.update_updated_at_column();

CREATE TRIGGER update_estados_civil_updated_at BEFORE UPDATE ON location.estados_civil
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS MOVIDAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'location'
ORDER BY tablename;

COMMIT;
