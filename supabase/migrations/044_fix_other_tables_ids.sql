-- ============================================================================
-- FIX OTHER TABLES IDS - ALLIN OS 2.0
-- Corrige tipos de IDs de TEXT para UUID nas tabelas restantes
-- ============================================================================

BEGIN;

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM REDE_LINEAR_NOS
-- ============================================================================
ALTER TABLE mlm.rede_linear_nos ADD COLUMN IF NOT EXISTS id_distribuidor_uuid UUID;
ALTER TABLE mlm.rede_linear_nos ADD COLUMN IF NOT EXISTS id_patrocinador_uuid UUID;

UPDATE mlm.rede_linear_nos 
SET id_distribuidor_uuid = id_distribuidor::UUID 
WHERE id_distribuidor IS NOT NULL 
AND id_distribuidor ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

UPDATE mlm.rede_linear_nos 
SET id_patrocinador_uuid = id_patrocinador::UUID 
WHERE id_patrocinador IS NOT NULL 
AND id_patrocinador ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.rede_linear_nos DROP COLUMN IF EXISTS id_distribuidor;
ALTER TABLE mlm.rede_linear_nos DROP COLUMN IF EXISTS id_patrocinador;
ALTER TABLE mlm.rede_linear_nos RENAME COLUMN id_distribuidor_uuid TO id_distribuidor;
ALTER TABLE mlm.rede_linear_nos RENAME COLUMN id_patrocinador_uuid TO id_patrocinador;

ALTER TABLE mlm.rede_linear_nos 
ADD CONSTRAINT fk_rede_linear_nos_distribuidor 
FOREIGN KEY (id_distribuidor) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

ALTER TABLE mlm.rede_linear_nos 
ADD CONSTRAINT fk_rede_linear_nos_patrocinador 
FOREIGN KEY (id_patrocinador) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

DROP INDEX IF EXISTS idx_rede_linear_nos_id_distribuidor;
DROP INDEX IF EXISTS idx_rede_linear_nos_id_patrocinador;
CREATE INDEX idx_rede_linear_nos_id_distribuidor ON mlm.rede_linear_nos(id_distribuidor);
CREATE INDEX idx_rede_linear_nos_id_patrocinador ON mlm.rede_linear_nos(id_patrocinador);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM SOLICITACOES_SAUQUE
-- ============================================================================
ALTER TABLE finance.solicitacoes_saque ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE finance.solicitacoes_saque 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE finance.solicitacoes_saque DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE finance.solicitacoes_saque RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE finance.solicitacoes_saque 
ADD CONSTRAINT fk_solicitacoes_saque_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

DROP INDEX IF EXISTS idx_solicitacoes_saque_distribuidor_id;
CREATE INDEX idx_solicitacoes_saque_distribuidor_id ON finance.solicitacoes_saque(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM PLANOS_DISTRIBUIDORES
-- ============================================================================
ALTER TABLE mlm.planos_distribuidores ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE mlm.planos_distribuidores 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.planos_distribuidores DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE mlm.planos_distribuidores RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE mlm.planos_distribuidores 
ADD CONSTRAINT fk_planos_distribuidores_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_planos_distribuidores_distribuidor_id;
CREATE INDEX idx_planos_distribuidores_distribuidor_id ON mlm.planos_distribuidores(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM BONUS_HISTORICO
-- ============================================================================
ALTER TABLE mlm.bonus_historico ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE mlm.bonus_historico 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.bonus_historico DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE mlm.bonus_historico RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE mlm.bonus_historico 
ADD CONSTRAINT fk_bonus_historico_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_bonus_historico_distribuidor_id;
CREATE INDEX idx_bonus_historico_distribuidor_id ON mlm.bonus_historico(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM PONTOS_SALDO
-- ============================================================================
ALTER TABLE mlm.pontos_saldo ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE mlm.pontos_saldo 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.pontos_saldo DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE mlm.pontos_saldo RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE mlm.pontos_saldo 
ADD CONSTRAINT fk_pontos_saldo_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_pontos_saldo_distribuidor_id;
CREATE INDEX idx_pontos_saldo_distribuidor_id ON mlm.pontos_saldo(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM PONTOS_TRANSACOES
-- ============================================================================
ALTER TABLE mlm.pontos_transacoes ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE mlm.pontos_transacoes 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.pontos_transacoes DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE mlm.pontos_transacoes RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE mlm.pontos_transacoes 
ADD CONSTRAINT fk_pontos_transacoes_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_pontos_transacoes_distribuidor_id;
CREATE INDEX idx_pontos_transacoes_distribuidor_id ON mlm.pontos_transacoes(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM QUALIFICACOES_HISTORICO
-- ============================================================================
ALTER TABLE mlm.qualificacoes_historico ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE mlm.qualificacoes_historico 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.qualificacoes_historico DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE mlm.qualificacoes_historico RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE mlm.qualificacoes_historico 
ADD CONSTRAINT fk_qualificacoes_historico_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_qualificacoes_historico_distribuidor_id;
CREATE INDEX idx_qualificacoes_historico_distribuidor_id ON mlm.qualificacoes_historico(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM COMISSOES
-- ============================================================================
ALTER TABLE mlm.comissoes ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE mlm.comissoes 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.comissoes DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE mlm.comissoes RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE mlm.comissoes 
ADD CONSTRAINT fk_comissoes_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_comissoes_distribuidor_id;
CREATE INDEX idx_comissoes_distribuidor_id ON mlm.comissoes(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM DISTRIBUIDOR_CONTA_BANCARIA
-- ============================================================================
ALTER TABLE mlm.distribuidor_conta_bancaria ADD COLUMN IF NOT EXISTS distribuidor_id_uuid UUID;

UPDATE mlm.distribuidor_conta_bancaria 
SET distribuidor_id_uuid = distribuidor_id::UUID 
WHERE distribuidor_id IS NOT NULL 
AND distribuidor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE mlm.distribuidor_conta_bancaria DROP COLUMN IF EXISTS distribuidor_id;
ALTER TABLE mlm.distribuidor_conta_bancaria RENAME COLUMN distribuidor_id_uuid TO distribuidor_id;

ALTER TABLE mlm.distribuidor_conta_bancaria 
ADD CONSTRAINT fk_distribuidor_conta_bancaria_distribuidor 
FOREIGN KEY (distribuidor_id) REFERENCES mlm.distribuidores(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_distribuidor_conta_bancaria_distribuidor_id;
CREATE INDEX idx_distribuidor_conta_bancaria_distribuidor_id ON mlm.distribuidor_conta_bancaria(distribuidor_id);

-- ============================================================================
-- CORRIGIR TIPOS DE IDS EM SOLICITACOES_SAUQUE_CD
-- ============================================================================
ALTER TABLE finance.solicitacoes_saque_cd ADD COLUMN IF NOT EXISTS cd_id_uuid UUID;

UPDATE finance.solicitacoes_saque_cd 
SET cd_id_uuid = cd_id::UUID 
WHERE cd_id IS NOT NULL 
AND cd_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

ALTER TABLE finance.solicitacoes_saque_cd DROP COLUMN IF EXISTS cd_id;
ALTER TABLE finance.solicitacoes_saque_cd RENAME COLUMN cd_id_uuid TO cd_id;

ALTER TABLE finance.solicitacoes_saque_cd 
ADD CONSTRAINT fk_solicitacoes_saque_cd_distribuidor 
FOREIGN KEY (cd_id) REFERENCES mlm.distribuidores(id) ON DELETE SET NULL;

DROP INDEX IF EXISTS idx_solicitacoes_saque_cd_cd_id;
CREATE INDEX idx_solicitacoes_saque_cd_cd_id ON finance.solicitacoes_saque_cd(cd_id);

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================
SELECT 'Tabelas atualizadas com sucesso' as status;

COMMIT;
