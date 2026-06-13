-- ============================================================================
-- SEPARATE CUSTOMER FROM DISTRIBUTOR - ALLIN OS 2.0
-- Remove campos MLM da tabela CRM.customers para seguir bounded contexts corretamente
-- Sprint 2 - Task 2.4
-- ============================================================================

BEGIN;

-- ============================================================================
-- CRIAR TABELA DE RELACIONAMENTO CUSTOMER-DISTRIBUTOR
-- ============================================================================
CREATE TABLE IF NOT EXISTS crm.customer_distributor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES crm.customers(id) ON DELETE CASCADE,
    distributor_id TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tabela de relacionamento
CREATE INDEX IF NOT EXISTS idx_customer_distributor_customer_id ON crm.customer_distributor(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_distributor_distributor_id ON crm.customer_distributor(distributor_id);

-- ============================================================================
-- MIGRAR DADOS EXISTENTES DE CUSTOMERS PARA TABELA DE RELACIONAMENTO
-- ============================================================================
INSERT INTO crm.customer_distributor (customer_id, distributor_id, is_primary, created_at, updated_at)
SELECT 
    id as customer_id,
    distribuidor_id,
    true as is_primary,
    created_at,
    updated_at
FROM crm.customers
WHERE distribuidor_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================================================
-- REMOVER CAMPOS MLM DA TABELA CUSTOMERS
-- ============================================================================
ALTER TABLE crm.customers DROP COLUMN IF EXISTS patrocinador_id;
ALTER TABLE crm.customers DROP COLUMN IF EXISTS distribuidor_id;

-- ============================================================================
-- REMOVER ÍNDICES RELACIONADOS AOS CAMPOS REMOVIDOS
-- ============================================================================
DROP INDEX IF EXISTS idx_customers_patrocinador_id;
DROP INDEX IF EXISTS idx_customers_distribuidor_id;

-- ============================================================================
-- VERIFICAR TABELA DE RELACIONAMENTO
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'crm'
  AND tablename = 'customer_distributor';

-- ============================================================================
-- VERIFICAR DADOS MIGRADOS
-- ============================================================================
SELECT COUNT(*) as total_relationships
FROM crm.customer_distributor;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Campos MLM (patrocinador_id, distribuidor_id) removidos de crm.customers
-- - Tabela de relacionamento crm.customer_distributor criada
-- - Dados existentes migrados para nova tabela
-- - Customer agora pertence apenas ao bounded context CRM
-- - Distributor pertence ao bounded context MLM
-- - Relacionamento entre Customer e Distributor é feito via tabela de relacionamento
-- ============================================================================
