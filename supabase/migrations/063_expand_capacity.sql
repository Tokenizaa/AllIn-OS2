-- ============================================================================
-- EXPAND CAPACITY - ALLIN OS 2.0
-- Expande tabela capacity para suportar gestão funcional de capacidade
-- Adiciona campos para tipo, período, datas, capacidade utilizada/disponível, eficiência
-- Cria tabela auxiliar para histórico de capacidade
-- Migration: 063_expand_capacity.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA CAPACITY
-- ============================================================================

ALTER TABLE industrial.capacity
ADD COLUMN IF NOT EXISTS tipo_capacidade VARCHAR(50), -- maquina, processo, setor
ADD COLUMN IF NOT EXISTS periodo VARCHAR(50), -- diario, semanal, mensal
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS data_fim DATE,
ADD COLUMN IF NOT EXISTS capacidade_utilizada NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS capacidade_disponivel NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS eficiencia_percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS unidade_medida VARCHAR(50), -- unidades, horas, kg, metros
ADD COLUMN IF NOT EXISTS turno VARCHAR(50), -- manha, tarde, noite, integral
ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES industrial.locations(id);

-- ============================================================================
-- CRIAR TABELA CAPACITY_HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS industrial.capacity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Referência à capacidade principal
    capacity_id UUID NOT NULL REFERENCES industrial.capacity(id) ON DELETE CASCADE,
    
    -- Dados históricos
    data_registro DATE NOT NULL,
    periodo VARCHAR(50) NOT NULL, -- diario, semanal, mensal
    
    -- Capacidades
    capacidade_planejada NUMERIC(12,2),
    capacidade_realizada NUMERIC(12,2),
    capacidade_utilizada NUMERIC(12,2),
    capacidade_disponivel NUMERIC(12,2),
    
    -- Eficiência
    eficiencia_percentual NUMERIC(5,2),
    
    -- Contexto
    maquina_id UUID REFERENCES industrial.machines(id),
    processo_id UUID REFERENCES industrial.processes(id),
    setor_id UUID REFERENCES industrial.locations(id),
    
    -- Metadados
    observacoes TEXT,
    tags JSONB DEFAULT '[]',
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Índices para capacity_history
CREATE INDEX idx_capacity_history_capacity ON industrial.capacity_history(capacity_id);
CREATE INDEX idx_capacity_history_data_registro ON industrial.capacity_history(data_registro);
CREATE INDEX idx_capacity_history_periodo ON industrial.capacity_history(periodo);
CREATE INDEX idx_capacity_history_maquina ON industrial.capacity_history(maquina_id);
CREATE INDEX idx_capacity_history_processo ON industrial.capacity_history(processo_id);
CREATE INDEX idx_capacity_history_setor ON industrial.capacity_history(setor_id);

-- ============================================================================
-- TRIGGER UPDATED_AT PARA NOVA TABELA
-- ============================================================================

CREATE TRIGGER update_capacity_history_updated_at
    BEFORE UPDATE ON industrial.capacity_history
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

-- ============================================================================
-- RLS PARA NOVA TABELA
-- ============================================================================

ALTER TABLE industrial.capacity_history ENABLE ROW LEVEL SECURITY;

-- Policies para capacity_history
CREATE POLICY "Service role full access to capacity_history"
  ON industrial.capacity_history FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to capacity_history"
  ON industrial.capacity_history FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to capacity_history"
  ON industrial.capacity_history FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to capacity_history"
  ON industrial.capacity_history FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to capacity_history"
  ON industrial.capacity_history FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================

-- Verificar novos campos em capacity
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'industrial'
  AND table_name = 'capacities'
  AND column_name IN (
    'tipo_capacidade',
    'periodo',
    'data_inicio',
    'data_fim',
    'capacidade_utilizada',
    'capacidade_disponivel',
    'eficiencia_percentual',
    'unidade_medida',
    'turno',
    'setor_id'
  )
ORDER BY column_name;

-- Verificar nova tabela
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'industrial'
  AND tablename = 'capacity_history'
ORDER BY tablename;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Campos adicionados à tabela capacity para gestão funcional completa
-- - Tabela capacity_history para histórico de capacidade ao longo do tempo
-- - Suporte para diferentes tipos de capacidade (máquina, processo, setor)
-- - Suporte para diferentes períodos (diário, semanal, mensal)
-- - Todas as novas tabelas têm RLS habilitado
-- - Índices criados para performance
-- ============================================================================
