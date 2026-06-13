-- ============================================================================
-- FIX CUSTOMERS IDS - ALLIN OS 2.0
-- Corrige tipos de IDs de TEXT para UUID e adiciona foreign keys
-- ============================================================================

BEGIN;

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM CUSTOMERS
-- ============================================================================

-- Adicionar colunas temporárias UUID
ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS patrocinador_id_uuid UUID;
ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

-- Migrar dados de TEXT para UUID (quando possível)
-- Nota: Isso requer que os dados TEXT sejam UUIDs válidos
UPDATE crm.customers 
SET patrocinador_id_uuid = patrocinador_id::UUID 
WHERE patrocinador_id IS NOT NULL 
AND patrocinador_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

UPDATE crm.customers 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Drop colunas antigas
ALTER TABLE crm.customers DROP COLUMN IF EXISTS patrocinador_id;
ALTER TABLE crm.customers DROP COLUMN IF EXISTS distribuidor_id;

-- Renomear colunas novas
ALTER TABLE crm.customers RENAME COLUMN patrocinador_id_uuid TO patrocinador_id;
ALTER TABLE crm.customers RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

-- Adicionar foreign keys
ALTER TABLE crm.customers 
ADD CONSTRAINT fk_customers_patrocinador 
FOREIGN KEY (patrocinador_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

ALTER TABLE crm.customers 
ADD CONSTRAINT fk_customers_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

-- ============================================================================
-- ATUALIZAR ÍNDICES
-- ============================================================================

-- Drop índices antigos
DROP INDEX IF EXISTS idx_customers_patrocinador_id;
DROP INDEX IF EXISTS idx_customers_distribuidor_id;

-- Criar índices novos
CREATE INDEX idx_customers_patrocinador_id ON crm.customers(patrocinador_id);
CREATE INDEX idx_customers_distribuidor_id ON crm.customers(distribuidor_id);

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'crm'
AND table_name = 'customers'
AND column_name IN ('patrocinador_id', 'distribuidor_id')
ORDER BY column_name;

COMMIT;
