-- ============================================================================
-- ETAPA 2 - EXPANDIR MÁQUINAS PARA CAPACIDADE
-- Migration: 059_expand_machines_capacity.sql
-- Adiciona campos críticos para gestão de capacidade produtiva
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA MACHINES
-- ============================================================================

ALTER TABLE industrial.machines
ADD COLUMN IF NOT EXISTS capacidade_operacional NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS disponibilidade NUMERIC(5,2) DEFAULT 100.00, -- percentual
ADD COLUMN IF NOT EXISTS vida_util_anos INTEGER,
ADD COLUMN IF NOT EXISTS data_ultima_manutencao_preventiva DATE,
ADD COLUMN IF NOT EXISTS data_proxima_manutencao_preventiva DATE,
ADD COLUMN IF NOT EXISTS data_ultima_manutencao_corretiva DATE,
ADD COLUMN IF NOT EXISTS manutencao_observacoes TEXT;

-- ============================================================================
-- ADICIONAR ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_machines_disponibilidade ON industrial.machines(disponibilidade);
CREATE INDEX IF NOT EXISTS idx_machines_manutencao_preventiva ON industrial.machines(data_proxima_manutencao_preventiva);

-- ============================================================================
-- ADICIONAR COMENTÁRIOS
-- ============================================================================

COMMENT ON COLUMN industrial.machines.capacidade_operacional IS 'Capacidade operacional real da máquina (unidades/hora), considerando disponibilidade e eficiência';
COMMENT ON COLUMN industrial.machines.disponibilidade IS 'Percentual de disponibilidade da máquina (0-100)';
COMMENT ON COLUMN industrial.machines.vida_util_anos IS 'Vida útil esperada da máquina em anos';
COMMENT ON COLUMN industrial.machines.data_ultima_manutencao_preventiva IS 'Data da última manutenção preventiva realizada';
COMMENT ON COLUMN industrial.machines.data_proxima_manutencao_preventiva IS 'Data programada para próxima manutenção preventiva';
COMMENT ON COLUMN industrial.machines.data_ultima_manutencao_corretiva IS 'Data da última manutenção corretiva realizada';
COMMENT ON COLUMN industrial.machines.manutencao_observacoes IS 'Observações sobre manutenções e histórico de problemas';

COMMIT;
