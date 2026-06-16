-- ============================================================================
-- ETAPA 4 - EXPANDIR TIMING_RECORDS PARA CRONOMETRAGEM REAL
-- Migration: 061_expand_timing_records.sql
-- Adiciona campos para estudo de tempos e relacionamento com máquinas
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA TIMING_RECORDS
-- ============================================================================

ALTER TABLE industrial.timing_records
ADD COLUMN IF NOT EXISTS maquina_id UUID REFERENCES industrial.machines(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS estudo_tempos_id UUID,
ADD COLUMN IF NOT EXISTS medicao_numero INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS tipo_medicao VARCHAR(50) DEFAULT 'normal', -- normal, estudo, validacao
ADD COLUMN IF NOT EXISTS condicoes_observadas TEXT;

-- ============================================================================
-- ADICIONAR ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_timing_maquina ON industrial.timing_records(maquina_id);
CREATE INDEX IF NOT EXISTS idx_timing_estudo_tempos ON industrial.timing_records(estudo_tempos_id);
CREATE INDEX IF NOT EXISTS idx_timing_tipo_medicao ON industrial.timing_records(tipo_medicao);

-- ============================================================================
-- ADICIONAR COMENTÁRIOS
-- ============================================================================

COMMENT ON COLUMN industrial.timing_records.maquina_id IS 'Máquina utilizada na medição de tempo';
COMMENT ON COLUMN industrial.timing_records.estudo_tempos_id IS 'Identificador do estudo de tempos (agrupa múltiplas medições)';
COMMENT ON COLUMN industrial.timing_records.medicao_numero IS 'Número da medição dentro do estudo de tempos';
COMMENT ON COLUMN industrial.timing_records.tipo_medicao IS 'Tipo de medição: normal (produção), estudo (cronometragem), validacao';
COMMENT ON COLUMN industrial.timing_records.condicoes_observadas IS 'Condições observadas durante a medição (temperatura, umidade, etc)';

COMMIT;
