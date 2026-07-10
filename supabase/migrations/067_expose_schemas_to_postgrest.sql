-- ============================================================================
-- EXPOSE SCHEMAS TO POSTGREST API
-- This migration exposes all custom schemas to the PostgREST API
-- ============================================================================

BEGIN;

-- Grant usage on all schemas to the postgres role (used by PostgREST)
GRANT USAGE ON SCHEMA identity TO postgres;
GRANT USAGE ON SCHEMA location TO postgres;
GRANT USAGE ON SCHEMA crm TO postgres;
GRANT USAGE ON SCHEMA mlm TO postgres;
GRANT USAGE ON SCHEMA commerce TO postgres;
GRANT USAGE ON SCHEMA logistics TO postgres;
GRANT USAGE ON SCHEMA finance TO postgres;
GRANT USAGE ON SCHEMA system TO postgres;

-- Grant usage on all schemas to the anon role (public API access)
GRANT USAGE ON SCHEMA identity TO anon;
GRANT USAGE ON SCHEMA location TO anon;
GRANT USAGE ON SCHEMA crm TO anon;
GRANT USAGE ON SCHEMA mlm TO anon;
GRANT USAGE ON SCHEMA commerce TO anon;
GRANT USAGE ON SCHEMA logistics TO anon;
GRANT USAGE ON SCHEMA finance TO anon;
GRANT USAGE ON SCHEMA system TO anon;

-- Grant usage on all schemas to the authenticated role (authenticated API access)
GRANT USAGE ON SCHEMA identity TO authenticated;
GRANT USAGE ON SCHEMA location TO authenticated;
GRANT USAGE ON SCHEMA crm TO authenticated;
GRANT USAGE ON SCHEMA mlm TO authenticated;
GRANT USAGE ON SCHEMA commerce TO authenticated;
GRANT USAGE ON SCHEMA logistics TO authenticated;
GRANT USAGE ON SCHEMA finance TO authenticated;
GRANT USAGE ON SCHEMA system TO authenticated;

-- Grant usage on all schemas to the service_role (admin API access)
GRANT USAGE ON SCHEMA identity TO service_role;
GRANT USAGE ON SCHEMA location TO service_role;
GRANT USAGE ON SCHEMA crm TO service_role;
GRANT USAGE ON SCHEMA mlm TO service_role;
GRANT USAGE ON SCHEMA commerce TO service_role;
GRANT USAGE ON SCHEMA logistics TO service_role;
GRANT USAGE ON SCHEMA finance TO service_role;
GRANT USAGE ON SCHEMA system TO service_role;
GRANT USAGE ON SCHEMA industrial TO postgres;
GRANT USAGE ON SCHEMA industrial TO anon;
GRANT USAGE ON SCHEMA industrial TO authenticated;
GRANT USAGE ON SCHEMA industrial TO service_role;

COMMIT;

-- ============================================================================
-- IMPORTANT: After running this migration, you must also update the
-- PostgREST schema configuration in the Supabase Dashboard:
-- 
-- 1. Go to https://app.supabase.com/project/imeadfnlgzphumuawdyt/settings/api
-- 2. Under "API Settings", find "Exposed schemas"
-- 3. Add the following schemas to the exposed schemas list:
--    - identity
--    - location
--    - crm
--    - mlm
--    - commerce
--    - logistics
--    - finance
--    - system
--    - industrial (DB-04)
-- 4. Save the configuration
-- 5. Restart the PostgREST service (this happens automatically)
-- ============================================================================
