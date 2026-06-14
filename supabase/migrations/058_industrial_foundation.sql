-- ============================================================================
-- INDUSTRIAL FOUNDATION - ALLIN OS 2.0
-- Módulo para gestão industrial: máquinas, materiais, processos, capacidade
-- Migration: 058_industrial_foundation.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- CRIAR SCHEMA INDUSTRIAL
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS industrial;

-- ============================================================================
-- TABELA: LOCATIONS (Estrutura física hierárquica)
-- ============================================================================
CREATE TABLE industrial.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50), -- galpao, setor, linha, deposito, almoxarifado, expedicao
    
    -- Hierarquia
    parent_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    
    -- Metadados
    descricao TEXT,
    area_m2 NUMERIC(10,2),
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: MACHINES (Máquinas industriais)
-- ============================================================================
CREATE TABLE industrial.machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    fabricante VARCHAR(200),
    modelo VARCHAR(200),
    numero_serie VARCHAR(100),
    
    -- Aquisição
    data_aquisicao DATE,
    valor_aquisicao NUMERIC(12,2),
    
    -- Localização
    localizacao_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    localizacao_detalhe TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, maintenance, inactive, retired
    capacidade_horaria NUMERIC(10,2),
    
    -- Metadados
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    anexos JSONB DEFAULT '[]',
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: MATERIALS (Matérias-primas)
-- ============================================================================
CREATE TABLE industrial.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    
    -- Estoque
    unidade_medida VARCHAR(20) NOT NULL, -- kg, m, un, m2, m3
    estoque_atual NUMERIC(12,3) DEFAULT 0,
    estoque_minimo NUMERIC(12,3) DEFAULT 0,
    estoque_maximo NUMERIC(12,3),
    
    -- Custo
    custo_unitario NUMERIC(12,2),
    custo_medio NUMERIC(12,2),
    
    -- Fornecedor
    fornecedor_padrao_id UUID REFERENCES industrial.suppliers(id) ON DELETE SET NULL,
    
    -- Localização
    localizacao_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    
    -- Metadados
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: SUPPLIERS (Fornecedores)
-- ============================================================================
CREATE TABLE industrial.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(200),
    cnpj VARCHAR(20),
    
    -- Contato
    contato_nome VARCHAR(100),
    contato_email VARCHAR(200),
    contato_telefone VARCHAR(20),
    
    -- Endereço
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Metadados
    condicoes_pagamento TEXT,
    prazo_entrega_padrao INTEGER, -- dias
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: PROCESSES (Processos produtivos)
-- ============================================================================
CREATE TABLE industrial.processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    -- Sequência
    sequencia INTEGER,
    
    -- Entradas/Saídas
    entradas JSONB DEFAULT '[]', -- IDs de materiais
    saidas JSONB DEFAULT '[]', -- IDs de produtos/componentes
    
    -- Máquinas utilizadas
    maquinas JSONB DEFAULT '[]', -- IDs de máquinas
    
    -- Responsáveis
    responsaveis JSONB DEFAULT '[]', -- IDs de usuários/roles
    
    -- Tempos padrão
    tempo_padrao_minutos INTEGER,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: TIMING_RECORDS (Registros de cronometragem)
-- ============================================================================
CREATE TABLE industrial.timing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Processo
    processo_id UUID REFERENCES industrial.processes(id) ON DELETE SET NULL,
    
    -- Operador
    operador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Tempo
    inicio TIMESTAMPTZ NOT NULL,
    fim TIMESTAMPTZ,
    duracao_segundos INTEGER,
    
    -- Contexto
    produto_id UUID REFERENCES industrial.products_industrial(id) ON DELETE SET NULL,
    quantidade_produzida INTEGER,
    
    -- Observações
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: CAPACITY (Capacidade produtiva)
-- ============================================================================
CREATE TABLE industrial.capacity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Máquina
    maquina_id UUID REFERENCES industrial.machines(id) ON DELETE CASCADE,
    
    -- Capacidade
    capacidade_teorica NUMERIC(12,2), -- unidades/hora
    capacidade_observada NUMERIC(12,2), -- unidades/hora (real)
    
    -- Unidade de medida
    unidade_medida VARCHAR(20), -- unidades/hora, unidades/dia, metros/hora
    
    -- Período
    data_inicio DATE,
    data_fim DATE,
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: TOOLS (Ferramentas)
-- ============================================================================
CREATE TABLE industrial.tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    descricao VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    
    -- Localização
    localizacao_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    
    -- Responsável
    responsavel_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'available',
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: PRODUCTS_INDUSTRIAL (Produtos industriais - Colchões)
-- ============================================================================
CREATE TABLE industrial.products_industrial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    modelo VARCHAR(200) NOT NULL,
    categoria VARCHAR(100), -- colchao, tenis (futuro)
    
    -- Dimensões
    largura_cm NUMERIC(6,2),
    comprimento_cm NUMERIC(6,2),
    altura_cm NUMERIC(6,2),
    
    -- Metadados
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: COMPONENTS (Componentes para BOM)
-- ============================================================================
CREATE TABLE industrial.components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100), -- espuma, tecido, acessorio, embalagem
    
    -- Especificações
    especificacoes JSONB DEFAULT '{}',
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABELA: BOM (Bill of Materials)
-- ============================================================================
CREATE TABLE industrial.bom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Produto
    produto_id UUID REFERENCES industrial.products_industrial(id) ON DELETE CASCADE,
    
    -- Componente
    componente_id UUID REFERENCES industrial.components(id) ON DELETE CASCADE,
    
    -- Quantidade
    quantidade NUMERIC(12,3) NOT NULL,
    unidade_medida VARCHAR(20),
    
    -- Sequência
    sequencia INTEGER,
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

-- Locations
CREATE INDEX idx_locations_parent ON industrial.locations(parent_id);
CREATE INDEX idx_locations_tipo ON industrial.locations(tipo);

-- Machines
CREATE INDEX idx_machines_codigo ON industrial.machines(codigo);
CREATE INDEX idx_machines_status ON industrial.machines(status);
CREATE INDEX idx_machines_localizacao ON industrial.machines(localizacao_id);

-- Materials
CREATE INDEX idx_materials_codigo ON industrial.materials(codigo);
CREATE INDEX idx_materials_categoria ON industrial.materials(categoria);
CREATE INDEX idx_materials_fornecedor ON industrial.materials(fornecedor_padrao_id);

-- Suppliers
CREATE INDEX idx_suppliers_cnpj ON industrial.suppliers(cnpj);
CREATE INDEX idx_suppliers_status ON industrial.suppliers(status);

-- Processes
CREATE INDEX idx_processes_sequencia ON industrial.processes(sequencia);
CREATE INDEX idx_processes_status ON industrial.processes(status);

-- Timing Records
CREATE INDEX idx_timing_processo ON industrial.timing_records(processo_id);
CREATE INDEX idx_timing_operador ON industrial.timing_records(operador_id);
CREATE INDEX idx_timing_inicio ON industrial.timing_records(inicio);

-- Capacity
CREATE INDEX idx_capacity_maquina ON industrial.capacity(maquina_id);
CREATE INDEX idx_capacity_periodo ON industrial.capacity(data_inicio, data_fim);

-- Tools
CREATE INDEX idx_tools_localizacao ON industrial.tools(localizacao_id);
CREATE INDEX idx_tools_responsavel ON industrial.tools(responsavel_id);
CREATE INDEX idx_tools_status ON industrial.tools(status);

-- Products Industrial
CREATE INDEX idx_products_categoria ON industrial.products_industrial(categoria);

-- Components
CREATE INDEX idx_components_categoria ON industrial.components(categoria);

-- BOM
CREATE INDEX idx_bom_produto ON industrial.bom(produto_id);
CREATE INDEX idx_bom_componente ON industrial.bom(componente_id);

-- ============================================================================
-- TRIGGERS DE UPDATED_AT
-- ============================================================================

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION industrial.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers em todas as tabelas
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON industrial.locations
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
    BEFORE UPDATE ON industrial.machines
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON industrial.materials
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON industrial.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_processes_updated_at
    BEFORE UPDATE ON industrial.processes
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_timing_records_updated_at
    BEFORE UPDATE ON industrial.timing_records
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_capacity_updated_at
    BEFORE UPDATE ON industrial.capacity
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON industrial.tools
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_products_industrial_updated_at
    BEFORE UPDATE ON industrial.products_industrial
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_components_updated_at
    BEFORE UPDATE ON industrial.components
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

CREATE TRIGGER update_bom_updated_at
    BEFORE UPDATE ON industrial.bom
    FOR EACH ROW
    EXECUTE FUNCTION industrial.update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS em todas as tabelas
ALTER TABLE industrial.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.timing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.products_industrial ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.bom ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES PARA LOCATIONS
-- ============================================================================
CREATE POLICY "Service role full access to locations"
  ON industrial.locations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to locations"
  ON industrial.locations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to locations"
  ON industrial.locations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to locations"
  ON industrial.locations FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to locations"
  ON industrial.locations FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA MACHINES
-- ============================================================================
CREATE POLICY "Service role full access to machines"
  ON industrial.machines FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to machines"
  ON industrial.machines FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to machines"
  ON industrial.machines FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to machines"
  ON industrial.machines FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to machines"
  ON industrial.machines FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA MATERIALS
-- ============================================================================
CREATE POLICY "Service role full access to materials"
  ON industrial.materials FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to materials"
  ON industrial.materials FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to materials"
  ON industrial.materials FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to materials"
  ON industrial.materials FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to materials"
  ON industrial.materials FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA SUPPLIERS
-- ============================================================================
CREATE POLICY "Service role full access to suppliers"
  ON industrial.suppliers FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to suppliers"
  ON industrial.suppliers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to suppliers"
  ON industrial.suppliers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to suppliers"
  ON industrial.suppliers FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to suppliers"
  ON industrial.suppliers FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA PROCESSES
-- ============================================================================
CREATE POLICY "Service role full access to processes"
  ON industrial.processes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to processes"
  ON industrial.processes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to processes"
  ON industrial.processes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to processes"
  ON industrial.processes FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to processes"
  ON industrial.processes FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA TIMING_RECORDS
-- ============================================================================
CREATE POLICY "Service role full access to timing_records"
  ON industrial.timing_records FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to timing_records"
  ON industrial.timing_records FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to timing_records"
  ON industrial.timing_records FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to timing_records"
  ON industrial.timing_records FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to timing_records"
  ON industrial.timing_records FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA CAPACITY
-- ============================================================================
CREATE POLICY "Service role full access to capacity"
  ON industrial.capacity FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to capacity"
  ON industrial.capacity FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to capacity"
  ON industrial.capacity FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to capacity"
  ON industrial.capacity FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to capacity"
  ON industrial.capacity FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA TOOLS
-- ============================================================================
CREATE POLICY "Service role full access to tools"
  ON industrial.tools FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to tools"
  ON industrial.tools FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to tools"
  ON industrial.tools FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to tools"
  ON industrial.tools FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to tools"
  ON industrial.tools FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA PRODUCTS_INDUSTRIAL
-- ============================================================================
CREATE POLICY "Service role full access to products_industrial"
  ON industrial.products_industrial FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to products_industrial"
  ON industrial.products_industrial FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to products_industrial"
  ON industrial.products_industrial FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to products_industrial"
  ON industrial.products_industrial FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to products_industrial"
  ON industrial.products_industrial FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA COMPONENTS
-- ============================================================================
CREATE POLICY "Service role full access to components"
  ON industrial.components FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to components"
  ON industrial.components FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to components"
  ON industrial.components FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to components"
  ON industrial.components FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to components"
  ON industrial.components FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- POLICIES PARA BOM
-- ============================================================================
CREATE POLICY "Service role full access to bom"
  ON industrial.bom FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated read access to bom"
  ON industrial.bom FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated write access to bom"
  ON industrial.bom FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to bom"
  ON industrial.bom FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete access to bom"
  ON industrial.bom FOR DELETE
  USING (auth.role() = 'authenticated');

COMMIT;
