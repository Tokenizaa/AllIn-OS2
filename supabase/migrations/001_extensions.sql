-- ============================================================================
-- EXTENSIONS - ALLIN OS 2.0
-- Baseado em documentação da API AllInBrasil
-- ============================================================================

-- Habilitar extensões necessárias para o sistema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Verificar extensões instaladas
SELECT 
    extname as extension_name,
    extversion as version
FROM pg_extension
ORDER BY extname;
