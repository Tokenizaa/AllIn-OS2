-- ============================================================================
-- EXPAND MACHINES - ALLIN OS 2.0
-- Expande tabela machines para suportar gestão completa de máquinas industriais
-- Adiciona campos para capacidade, disponibilidade, manutenção, vida útil
-- Cria tabelas auxiliares para manutenção, documentos e fotos
-- Migration: 060_expand_machines.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA MACHINES
-- ============================================================================

ALTER TABLE industrial.machines
ADD COLUMN IF NOT EXISTS capacidade_teorica NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS capacidade_operacional NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS disponibilidade_percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS data_fim_vida_util DATE,
ADD COLUMN IF NOT EXISTS deprecacao_anual_percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS horas_operacao_total NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS horas_manutencao_total NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ultima_manutencao_preventiva DATE,
ADD COLUMN IF NOT EXISTS proxima_manutencao_preventiva DATE,
ADD COLUMN IF NOT EXISTS tipo_manutencao VARCHAR(50), -- preventiva, preditiva, corretiva
ADD COLUMN IF NOT EXISTS frequencia_manutencao_horas INTEGER,
ADD COLUMN IF NOT EXISTS criticalidade VARCHAR(50) DEFAULT 'media'; -- alta, media, baixa

-- ============================================================================
-- CRIAR TABELA MACHINE_MAINTENANCE
-- ============================================================================

CREATE TABLE IF NOT EXISTS industrial.machine_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Máquina
    maquina_id UUID NOT NULL REFERENCES industrial.machines(id) ON DELETE CASCADE,
    
    -- Tipo de manutenção
    tipo VARCHAR(50) NOT NULL, -- preventiva, preditiva, corretiva
    subtipo VARCHAR(100),      -- revisao, troca_peca, calibracao, limpeza, etc
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    
    -- Agendamento
    data_agendada DATE NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    
    -- Duração
    duracao_horas_prevista NUMERIC(8,2),
    duracao_horas_real NUMERIC(8,2),
    
    -- Responsável
    responsavel_id UUID REFERENCES auth.users(id),
    equipe VARCHAR(200),
    
    -- Custo
    custo_previsto NUMERIC(12,2),
    custo_real NUMERIC(12,2),
    
    -- Descrição
    descricao TEXT,
    observacoes TEXT,
    
    -- Peças trocadas
    pecas_trocadas JSONB DEFAULT '[]',
    
    -- Metadados
    prioridade VARCHAR(50) DEFAULT 'normal', -- baixa, normal, alta, urgente
    causa_raiz TEXT,
    acoes_corretivas TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Índices para machine_maintenance
CREATE INDEX idx_machine_maintenance_maquina ON industrial.machine_maintenance(maquina_id);
CREATE INDEX idx_machine_maintenance_tipo ON industrial.machine_maintenance(tipo);
CREATE INDEX idx_machine_maintenance_status ON industrial.machine_maintenance(status);
CREATE INDEX idx_machine_maintenance_data_agendada ON industrial.machine_maintenance(data_agendada);
CREATE INDEX idx_machine_maintenance_responsavel ON industrial.machine_maintenance(responsavel_id);

-- ============================================================================
-- CRIAR TABELA MACHINE_DOCUMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS industrial.machine_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Máquina
    maquina_id UUID NOT NULL REFERENCES industrial.machines(id) ON DELETE CASCADE,
    
    -- Documento
    tipo VARCHAR(50) NOT NULL, -- manual, certificado, esquema, desenho, procedimento
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
    categoria VARCHAR(50), -- tecnico, seguranca, operacional, qualidade
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

-- Índices para machine_documents
CREATE INDEX idx_machine_documents_maquina ON industrial.machine_documents(maquina_id);
CREATE INDEX idx_machine_documents_tipo ON industrial.machine_documents(tipo);
CREATE INDEX idx_machine_documents_categoria ON industrial.machine_documents(categoria);
CREATE INDEX idx_machine_documents_uploaded_by ON industrial.machine_documents(uploaded_by);

-- ============================================================================
-- CRIAR TABELA MACHINE_PHOTOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS industrial.machine_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Máquina
    maquina_id UUID NOT NULL REFERENCES industrial.machines(id) ON DELETE CASCADE,
    
    -- Foto
    titulo VARCHAR(200),
    descricao TEXT,
    
    -- Arquivo
    url_foto TEXT NOT NULL,
    url_thumbnail TEXT,
    largura INTEGER,
    altura INTEGER,
    tamanho_bytes BIGINT,
    tipo_mime VARCHAR(100),
    
    -- Classificação
    categoria VARCHAR(50), -- geral, detalhe, manutencao, instalacao, problema
    ordem INTEGER DEFAULT 0,
    
    -- Metadados
    data_foto DATE,
    local_foto VARCHAR(200),
    tags JSONB DEFAULT '[]',
    
    -- Auditoria
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Índices para machine_photos
CREATE INDEX idx_machine_photos_maquina ON industrial.machine_photos(maquina_id);
CREATE INDEX idx_machine_photos_categoria ON industrial.machine_photos(categoria);
CREATE INDEX idx_machine_photos_ordem ON industrial.machine_photos(ordem);
CREATE INDEX idx_machine_photos_uploaded_by ON industrial.machine_photos(uploaded_by);

-- ============================================================================
-- TRIGGER UPDATED_AT PARA NOVAS TABELAS
-- ============================================================================

CREATE TRIGGER update_machine_maintenance_updated_at
    BEFORE UPDATE ON industrial.machine_maintenance
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_machine_documents_updated_at
    BEFORE UPDATE ON industrial.machine_documents
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_machine_photos_updated_at
    BEFORE UPDATE ON industrial.machine_photos
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

-- ============================================================================
-- RLS PARA NOVAS TABELAS
-- ============================================================================

ALTER TABLE industrial.machine_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.machine_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.machine_photos ENABLE ROW LEVEL SECURITY;

-- Policies para machine_maintenance
CREATE POLICY "Service role full access to machine_maintenance"
  ON industrial.machine_maintenance FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to machine_maintenance"
  ON industrial.machine_maintenance FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to machine_maintenance"
  ON industrial.machine_maintenance FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to machine_maintenance"
  ON industrial.machine_maintenance FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to machine_maintenance"
  ON industrial.machine_maintenance FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policies para machine_documents
CREATE POLICY "Service role full access to machine_documents"
  ON industrial.machine_documents FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to machine_documents"
  ON industrial.machine_documents FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to machine_documents"
  ON industrial.machine_documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to machine_documents"
  ON industrial.machine_documents FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to machine_documents"
  ON industrial.machine_documents FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policies para machine_photos
CREATE POLICY "Service role full access to machine_photos"
  ON industrial.machine_photos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to machine_photos"
  ON industrial.machine_photos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to machine_photos"
  ON industrial.machine_photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to machine_photos"
  ON industrial.machine_photos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to machine_photos"
  ON industrial.machine_photos FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================

-- Verificar novos campos em machines
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'industrial'
  AND table_name = 'machines'
  AND column_name IN (
    'capacidade_teorica',
    'capacidade_operacional',
    'disponibilidade_percentual',
    'data_fim_vida_util',
    'deprecacao_anual_percentual',
    'horas_operacao_total',
    'horas_manutencao_total',
    'ultima_manutencao_preventiva',
    'proxima_manutencao_preventiva',
    'tipo_manutencao',
    'frequencia_manutencao_horas',
    'criticalidade'
  )
ORDER BY column_name;

-- Verificar novas tabelas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'industrial'
  AND tablename IN ('machine_maintenance', 'machine_documents', 'machine_photos')
ORDER BY tablename;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Campos adicionados à tabela machines para gestão completa de capacidade
-- - Tabela machine_maintenance para histórico de manutenções
-- - Tabela machine_documents para documentos técnicos (manuais, certificados)
-- - Tabela machine_photos para fotos das máquinas
-- - Todas as novas tabelas têm RLS habilitado
-- - Índices criados para performance
-- ============================================================================
