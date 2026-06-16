-- ============================================================================
-- EXPAND PROCESSES - ALLIN OS 2.0
-- Expande tabela processes para suportar processos de fábrica de colchões
-- Adiciona campos para tipo, capacidade, perdas, setup, lotes, eficiência
-- Cria tabelas auxiliares para sub-processos e documentos
-- Migration: 061_expand_processes.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA PROCESSES
-- ============================================================================

ALTER TABLE industrial.processes
ADD COLUMN IF NOT EXISTS tipo_processo VARCHAR(50), -- recebimento, corte, montagem, costura, fechamento, embalagem, expedicao
ADD COLUMN IF NOT EXISTS capacidade_unidades_hora NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS perda_prevista_percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS setup_time_minutos INTEGER,
ADD COLUMN IF NOT EXISTS lote_minimo INTEGER,
ADD COLUMN IF NOT EXISTS lote_maximo INTEGER,
ADD COLUMN IF NOT EXISTS tempo_padrao_unidade_segundos NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS eficiencia_padrao NUMERIC(5,2);

-- ============================================================================
-- CRIAR TABELA PROCESS_STEPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS industrial.process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Processo principal
    processo_id UUID NOT NULL REFERENCES industrial.processes(id) ON DELETE CASCADE,
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    -- Sequência
    sequencia INTEGER NOT NULL,
    
    -- Entradas/Saídas
    entradas JSONB DEFAULT '[]',
    saidas JSONB DEFAULT '[]',
    
    -- Máquinas utilizadas
    maquinas JSONB DEFAULT '[]',
    
    -- Responsáveis
    responsaveis JSONB DEFAULT '[]',
    
    -- Tempos
    tempo_padrao_minutos INTEGER,
    tempo_padrao_unidade_segundos NUMERIC(10,2),
    
    -- Capacidade
    capacidade_unidades_hora NUMERIC(10,2),
    
    -- Perdas
    perda_prevista_percentual NUMERIC(5,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Índices para process_steps
CREATE INDEX idx_process_steps_processo ON industrial.process_steps(processo_id);
CREATE INDEX idx_process_steps_sequencia ON industrial.process_steps(sequencia);
CREATE INDEX idx_process_steps_status ON industrial.process_steps(status);

-- ============================================================================
-- CRIAR TABELA PROCESS_DOCUMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS industrial.process_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Processo
    processo_id UUID NOT NULL REFERENCES industrial.processes(id) ON DELETE CASCADE,
    
    -- Documento
    tipo VARCHAR(50) NOT NULL, -- sop, instrucao, procedimento, desenho, video
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    -- Arquivo
    nome_arquivo VARCHAR(255),
    url_arquivo TEXT,
    tamanho_bytes BIGINT,
    tipo_mime VARCHAR(100),
    
    -- Versão
    versao VARCHAR(20),
    data_documento DATE,
    
    -- Classificação
    categoria VARCHAR(50), -- operacional, seguranca, qualidade, treinamento
    confidencialidade VARCHAR(50) DEFAULT 'interno', -- publico, interno, confidencial
    
    -- Metadados
    idioma VARCHAR(10) DEFAULT 'pt-BR',
    tags JSONB DEFAULT '[]',
    
    -- Auditoria
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Índices para process_documents
CREATE INDEX idx_process_documents_processo ON industrial.process_documents(processo_id);
CREATE INDEX idx_process_documents_tipo ON industrial.process_documents(tipo);
CREATE INDEX idx_process_documents_categoria ON industrial.process_documents(categoria);
CREATE INDEX idx_process_documents_uploaded_by ON industrial.process_documents(uploaded_by);

-- ============================================================================
-- TRIGGER UPDATED_AT PARA NOVAS TABELAS
-- ============================================================================

CREATE TRIGGER update_process_steps_updated_at
    BEFORE UPDATE ON industrial.process_steps
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_process_documents_updated_at
    BEFORE UPDATE ON industrial.process_documents
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

-- ============================================================================
-- RLS PARA NOVAS TABELAS
-- ============================================================================

ALTER TABLE industrial.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.process_documents ENABLE ROW LEVEL SECURITY;

-- Policies para process_steps
CREATE POLICY "Service role full access to process_steps"
  ON industrial.process_steps FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to process_steps"
  ON industrial.process_steps FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to process_steps"
  ON industrial.process_steps FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to process_steps"
  ON industrial.process_steps FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to process_steps"
  ON industrial.process_steps FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policies para process_documents
CREATE POLICY "Service role full access to process_documents"
  ON industrial.process_documents FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to process_documents"
  ON industrial.process_documents FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to process_documents"
  ON industrial.process_documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to process_documents"
  ON industrial.process_documents FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to process_documents"
  ON industrial.process_documents FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================

-- Verificar novos campos em processes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'industrial'
  AND table_name = 'processes'
  AND column_name IN (
    'tipo_processo',
    'capacidade_unidades_hora',
    'perda_prevista_percentual',
    'setup_time_minutos',
    'lote_minimo',
    'lote_maximo',
    'tempo_padrao_unidade_segundos',
    'eficiencia_padrao'
  )
ORDER BY column_name;

-- Verificar novas tabelas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'industrial'
  AND tablename IN ('process_steps', 'process_documents')
ORDER BY tablename;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Campos adicionados à tabela processes para gestão completa de processos
-- - Tabela process_steps para sub-processos e etapas detalhadas
-- - Tabela process_documents para SOPs, instruções e documentação
-- - Todas as novas tabelas têm RLS habilitado
-- - Índices criados para performance
-- ============================================================================
