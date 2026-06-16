-- ============================================================================
-- EXPAND TIMING RECORDS - ALLIN OS 2.0
-- Expande tabela timing_records para suportar estudo de tempos completo
-- Adiciona campos para operador, múltiplas medições, condições, observações
-- Cria tabela auxiliar para medições individuais
-- Migration: 062_expand_timing_records.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA TIMING_RECORDS
-- ============================================================================

ALTER TABLE industrial.timing_records
ADD COLUMN IF NOT EXISTS operador_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS data_hora_inicio TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_hora_fim TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duracao_segundos NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS numero_medicao INTEGER,
ADD COLUMN IF NOT EXISTS condicoes_ambiente TEXT,
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- ============================================================================
-- CRIAR TABELA TIMING_MEASUREMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS industrial.timing_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Registro de tempo principal
    timing_record_id UUID NOT NULL REFERENCES industrial.timing_records(id) ON DELETE CASCADE,
    
    -- Identificação da medição
    numero_medicao INTEGER NOT NULL,
    
    -- Dados da medição
    duracao_segundos NUMERIC(12,2) NOT NULL,
    
    -- Contexto
    maquina_id UUID REFERENCES industrial.machines(id),
    processo_id UUID REFERENCES industrial.processes(id),
    operador_id UUID REFERENCES auth.users(id),
    
    -- Condições
    condicoes_ambiente TEXT,
    temperatura_ambiente NUMERIC(5,2),
    umidade_percentual NUMERIC(5,2),
    
    -- Observações
    observacoes TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'valid', -- valid, invalid, outlier
    
    -- Metadados
    tags JSONB DEFAULT '[]',
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Índices para timing_measurements
CREATE INDEX idx_timing_measurements_timing_record ON industrial.timing_measurements(timing_record_id);
CREATE INDEX idx_timing_measurements_maquina ON industrial.timing_measurements(maquina_id);
CREATE INDEX idx_timing_measurements_processo ON industrial.timing_measurements(processo_id);
CREATE INDEX idx_timing_measurements_operador ON industrial.timing_measurements(operador_id);
CREATE INDEX idx_timing_measurements_status ON industrial.timing_measurements(status);

-- ============================================================================
-- TRIGGER UPDATED_AT PARA NOVA TABELA
-- ============================================================================

CREATE TRIGGER update_timing_measurements_updated_at
    BEFORE UPDATE ON industrial.timing_measurements
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

-- ============================================================================
-- RLS PARA NOVA TABELA
-- ============================================================================

ALTER TABLE industrial.timing_measurements ENABLE ROW LEVEL SECURITY;

-- Policies para timing_measurements
CREATE POLICY "Service role full access to timing_measurements"
  ON industrial.timing_measurements FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to timing_measurements"
  ON industrial.timing_measurements FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to timing_measurements"
  ON industrial.timing_measurements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to timing_measurements"
  ON industrial.timing_measurements FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to timing_measurements"
  ON industrial.timing_measurements FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================

-- Verificar novos campos em timing_records
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'industrial'
  AND table_name = 'timing_records'
  AND column_name IN (
    'operador_id',
    'data_hora_inicio',
    'data_hora_fim',
    'duracao_segundos',
    'numero_medicao',
    'condicoes_ambiente',
    'observacoes'
  )
ORDER BY column_name;

-- Verificar nova tabela
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'industrial'
  AND tablename = 'timing_measurements'
ORDER BY tablename;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Campos adicionados à tabela timing_records para estudo de tempos completo
-- - Tabela timing_measurements para múltiplas medições individuais
-- - Suporte para condições ambientais (temperatura, umidade)
-- - Todas as novas tabelas têm RLS habilitado
-- - Índices criados para performance
-- ============================================================================
