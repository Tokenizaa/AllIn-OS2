-- ============================================================================
-- REVERT DISTRIBUIDORES IDS TO TEXT - ALLIN OS 2.0
-- Reverte tipos de IDs de UUID para TEXT para compatibilidade com API AllIn
-- ============================================================================

BEGIN;

-- ============================================================================
-- REVERTER TIPOS DE IDS EM DISTRIBUIDORES
-- ============================================================================

-- Remover foreign keys
ALTER TABLE mlm.distribuidores DROP CONSTRAINT IF EXISTS fk_distribuidores_patrocinador;
ALTER TABLE mlm.distribuidores DROP CONSTRAINT IF EXISTS fk_distribuidores_perna_esquerda;
ALTER TABLE mlm.distribuidores DROP CONSTRAINT IF EXISTS fk_distribuidores_perna_direita;

-- Adicionar colunas temporárias TEXT
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS patrocinador_id_text TEXT;
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS perna_esquerda_id_text TEXT;
ALTER TABLE mlm.distribuidores ADD COLUMN IF NOT EXISTS perna_direita_id_text TEXT;

-- Migrar dados de UUID para TEXT
UPDATE mlm.distribuidores 
SET patrocinador_id_text = patrocinador_id::TEXT 
WHERE patrocinador_id IS NOT NULL;

UPDATE mlm.distribuidores 
SET perna_esquerda_id_text = perna_esquerda_id::TEXT 
WHERE perna_esquerda_id IS NOT NULL;

UPDATE mlm.distribuidores 
SET perna_direita_id_text = perna_direita_id::TEXT 
WHERE perna_direita_id IS NOT NULL;

-- Drop colunas antigas
ALTER TABLE mlm.distribuidores DROP COLUMN IF EXISTS patrocinador_id;
ALTER TABLE mlm.distribuidores DROP COLUMN IF EXISTS perna_esquerda_id;
ALTER TABLE mlm.distribuidores DROP COLUMN IF EXISTS perna_direita_id;

-- Renomear colunas novas
ALTER TABLE mlm.distribuidores RENAME COLUMN patrocinador_id_text TO patrocinador_id;
ALTER TABLE mlm.distribuidores RENAME COLUMN perna_esquerda_id_text TO perna_esquerda_id;
ALTER TABLE mlm.distribuidores RENAME COLUMN perna_direita_id_text TO perna_direita_id;

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
