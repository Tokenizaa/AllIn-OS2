-- ============================================================================
-- ADD REMAINING FOREIGN KEYS - ALLIN OS 2.0
-- Adiciona foreign keys em relacionamentos que ainda não foram corrigidos
-- ============================================================================

BEGIN;

-- ============================================================================
-- CORRIGIR LOJAS - FOREIGN KEYS PARA LOCATION
-- ============================================================================

-- Corrigir cidade_id (INTEGER para INTEGER, mas com FK correta)
ALTER TABLE system.lojas DROP CONSTRAINT IF EXISTS lojas_cidade_id_fkey;
ALTER TABLE system.lojas 
ADD CONSTRAINT fk_lojas_cidade 
FOREIGN KEY (cidade_id) REFERENCES location.cidades(id) ON DELETE SET NULL;

-- Corrigir uf_id (INTEGER para INTEGER, mas com FK correta)
ALTER TABLE system.lojas DROP CONSTRAINT IF EXISTS lojas_uf_id_fkey;
ALTER TABLE system.lojas 
ADD CONSTRAINT fk_lojas_uf 
FOREIGN KEY (uf_id) REFERENCES location.estados(id) ON DELETE SET NULL;

-- ============================================================================
-- CORRIGIR TRANSPORTADORAS - FOREIGN KEY PARA LOJAS
-- ============================================================================

-- Corrigir loja_id (INTEGER para INTEGER, mas com FK correta)
ALTER TABLE logistics.transportadoras DROP CONSTRAINT IF EXISTS transportadoras_loja_id_fkey;
ALTER TABLE logistics.transportadoras 
ADD CONSTRAINT fk_transportadoras_loja 
FOREIGN KEY (loja_id) REFERENCES system.lojas(id) ON DELETE SET NULL;

-- ============================================================================
-- CORRIGIR PEDIDOS - FOREIGN KEYS PARA COMMERCE E CRM
-- ============================================================================

-- cliente_id já tem FK correta para crm.customers
-- distribuidor_indicador_id e distribuidor_comprador_id precisam ser corrigidos
ALTER TABLE commerce.pedidos ADD COLUMN IF NOT EXISTS distribuidor_indicador_id_uuid UUID;
ALTER TABLE commerce.pedidos ADD COLUMN IF NOT EXISTS distribuidor_comprador_id_uuid UUID;

UPDATE commerce.pedidos 
SET distribuidor_indicador_id_uuid = distribuidor_indicador_id::UUID 
WHERE distribuidor_indicador_id IS NOT NULL 
AND distribuidor_indicador_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

UPDATE commerce.pedidos 
SET distribuidor_comprador_id_uuid = distribuidor_comprador_id::UUID 
WHERE distribuidor_comprador_id IS NOT NULL 
AND distribuidor_comprador_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE commerce.pedidos DROP COLUMN IF EXISTS distribuidor_indicador_id;
ALTER TABLE commerce.pedidos DROP COLUMN IF EXISTS distribuidor_comprador_id;
ALTER TABLE commerce.pedidos RENAME COLUMN distribuidor_indicador_id_uuid TO distribuidor_indicador_id;
ALTER TABLE commerce.pedidos RENAME COLUMN distribuidor_comprador_id_uuid TO distribuidor_comprador_id;

ALTER TABLE commerce.pedidos 
ADD CONSTRAINT fk_pedidos_distribuidor_indicador 
FOREIGN KEY (distribuidor_indicador_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

ALTER TABLE commerce.pedidos 
ADD CONSTRAINT fk_pedidos_distribuidor_comprador 
FOREIGN KEY (distribuidor_comprador_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

DROP INDEX IF EXISTS idx_pedidos_distribuidor_indicador_id;
DROP INDEX IF EXISTS idx_pedidos_distribuidor_comprador_id;
CREATE INDEX idx_pedidos_distribuidor_indicador_id ON commerce.pedidos(distribuidor_indicador_id);
CREATE INDEX idx_pedidos_distribuidor_comprador_id ON commerce.pedidos(distribuidor_comprador_id);

-- ============================================================================
-- CORRIGIR LOJA_ID EM PEDIDOS (INTEGER PARA INTEGER)
-- ============================================================================
ALTER TABLE commerce.pedidos DROP CONSTRAINT IF EXISTS pedidos_loja_id_fkey;
ALTER TABLE commerce.pedidos 
ADD CONSTRAINT fk_pedidos_loja 
FOREIGN KEY (loja_id) REFERENCES system.lojas(id) ON DELETE SET NULL;

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================
SELECT 
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema IN ('system', 'logistics', 'commerce')
ORDER BY tc.table_schema, tc.table_name;

COMMIT;
