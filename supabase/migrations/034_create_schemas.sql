-- ============================================================================
-- CREATE SCHEMAS - ALLIN OS 2.0
-- Criação de schemas por bounded context (DDD)
-- ============================================================================

BEGIN;

-- ============================================================================
-- CRIAR SCHEMAS POR BOUNDED CONTEXT
-- ============================================================================

-- Identity Context (Autenticação e Autorização)
CREATE SCHEMA IF NOT EXISTS identity;

-- Location Context (Localizações e Endereços)
CREATE SCHEMA IF NOT EXISTS location;

-- CRM Context (Gestão de Clientes)
CREATE SCHEMA IF NOT EXISTS crm;

-- MLM Context (Marketing Multinível)
CREATE SCHEMA IF NOT EXISTS mlm;

-- Commerce Context (E-commerce)
CREATE SCHEMA IF NOT EXISTS commerce;

-- Logistics Context (Logística)
CREATE SCHEMA IF NOT EXISTS logistics;

-- Finance Context (Financeiro)
CREATE SCHEMA IF NOT EXISTS finance;

-- System Context (Sistema)
CREATE SCHEMA IF NOT EXISTS system;

-- ============================================================================
-- VERIFICAR SCHEMAS CRIADOS
-- ============================================================================
SELECT 
    schema_name,
    schema_owner
FROM information_schema.schemata
WHERE schema_name IN ('identity', 'location', 'crm', 'mlm', 'commerce', 'logistics', 'finance', 'system')
ORDER BY schema_name;

COMMIT;

-- ============================================================================
-- NOTA: Esta migration apenas cria os schemas.
-- As tabelas serão movidas para os schemas apropriados nas migrations subsequentes.
-- ============================================================================
