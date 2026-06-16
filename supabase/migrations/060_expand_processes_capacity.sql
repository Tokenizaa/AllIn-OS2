-- ============================================================================
-- ETAPA 3 - EXPANDIR PROCESSOS PARA CAPACIDADE E PERDAS
-- Migration: 060_expand_processes_capacity.sql
-- Adiciona campos para modelagem completa de processos produtivos
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA PROCESSES
-- ============================================================================

ALTER TABLE industrial.processes
ADD COLUMN IF NOT EXISTS capacidade NUMERIC(12,2), -- unidades/hora
ADD COLUMN IF NOT EXISTS perdas_previstas NUMERIC(5,2) DEFAULT 0.00, -- percentual
ADD COLUMN IF NOT EXISTS perdas_reais NUMERIC(5,2) DEFAULT 0.00, -- percentual
ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL;

-- ============================================================================
-- ADICIONAR ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_processes_setor ON industrial.processes(setor_id);
CREATE INDEX IF NOT EXISTS idx_processes_capacidade ON industrial.processes(capacidade);

-- ============================================================================
-- ADICIONAR COMENTÁRIOS
-- ============================================================================

COMMENT ON COLUMN industrial.processes.capacidade IS 'Capacidade produtiva do processo (unidades/hora)';
COMMENT ON COLUMN industrial.processes.perdas_previstas IS 'Percentual de perdas previsto para o processo (0-100)';
COMMENT ON COLUMN industrial.processes.perdas_reais IS 'Percentual de perdas real observado (0-100)';
COMMENT ON COLUMN industrial.processes.setor_id IS 'Setor/local onde o processo é executado';

COMMIT;
