-- ============================================================================
-- FIX DISTRIBUIDORES IDS - ALLIN OS 2.0
-- Corrige tipos de IDs de TEXT para UUID e adiciona foreign keys
-- ============================================================================

BEGIN;

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM DISTRIBUIDORES
-- ============================================================================

-- Adicionar colunas temporárias UUID
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS patrocinador_id_uuid UUID;
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS perna_esquerda_id_uuid UUID;
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS perna_direita_id_uuid UUID;

-- Migrar dados de TEXT para UUID (quando possível)
UPDATE mlm.distribuidores 
SET patrocinador_id_uuid = patrocinador_id::UUID 
WHERE patrocinador_id IS NOT NULL 
AND patrocinador_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

UPDATE mlm.distribuidores 
SET perna_esquerda_id_uuid = perna_esquerda_id::UUID 
WHERE perna_esquerda_id IS NOT NULL 
AND perna_esquerda_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

UPDATE mlm.distribuidores 
SET perna_direita_id_uuid = perna_direita_id::UUID 
WHERE perna_direita_id IS NOT NULL 
AND perna_direita_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Drop colunas antigas
ALTER TABLE mlm.distribuidores DROP COLUMN IF EXISTS patrocinador_id;
ALTER TABLE mlm.distribuidores DROP COLUMN IF EXISTS perna_esquerda_id;
ALTER TABLE mlm.distribuidores DROP COLUMN IF EXISTS perna_direita_id;

-- Renomear colunas novas
ALTER TABLE mlm.distribuidores RENAME COLUMN patrocinador_id_uuid TO patrocinador_id;
ALTER TABLE mlm.distribuidores RENAME COLUMN perna_esquerda_id_uuid TO perna_esquerda_id;
ALTER TABLE mlm.distribuidores RENAME COLUMN perna_direita_id_uuid TO perna_direita_id;

-- Adicionar foreign keys
ALTER TABLE mlm.distribuidores 
ADD CONSTRAINT fk_distribuidores_patrocinador 
FOREIGN KEY (patrocinador_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

ALTER TABLE mlm.distribuidores 
ADD CONSTRAINT fk_distribuidores_perna_esquerda 
FOREIGN KEY (perna_esquerda_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

ALTER TABLE mlm.distribuidores 
ADD CONSTRAINT fk_distribuidores_perna_direita 
FOREIGN KEY (perna_direita_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

-- ============================================================================
-- ATUALIZAR ÍNDICES
-- ============================================================================

-- Drop índices antigos
DROP INDEX IF EXISTS idx_distribuidores_patrocinador_id;
DROP INDEX IF EXISTS idx_distribuidores_perna_esquerda_id;
DROP INDEX IF EXISTS idx_distribuidores_perna_direita_id;

-- Criar índices novos
CREATE INDEX idx_distribuidores_patrocinador_id ON mlm.distribuidores(patrocinador_id);
CREATE INDEX idx_distribuidores_perna_esquerda_id ON mlm.distribuidores(perna_esquerda_id);
CREATE INDEX idx_distribuidores_perna_direita_id ON mlm.distribuidores(perna_direita_id);

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'mlm'
AND table_name = 'distribuidores'
AND column_name IN ('patrocinador_id', 'perna_esquerda_id', 'perna_direita_id')
ORDER BY column_name;

COMMIT;
