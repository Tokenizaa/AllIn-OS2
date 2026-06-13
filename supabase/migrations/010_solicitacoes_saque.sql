-- ============================================================================
-- SOLICITAÇÕES SAQUE - ALLIN OS 2.0
-- Baseado em: 62-solicitacoes-saque.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- SOLICITAÇÕES SAQUE
-- Baseado em: 62-solicitacoes-saque.md
-- Campos principais da API AllInBrasil
-- ============================================================================
CREATE TABLE solicitacoes_saque (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    distribuidor_id TEXT,
    distribuidor_nome VARCHAR(200),
    distribuidor_usuario VARCHAR(100),
    distribuidor_data_nascimento DATE,
    conta_id INTEGER,
    conta_descricao TEXT,
    
    -- Status (1-Solicitado, 3-Depositado, 4-Estornado)
    status_id INTEGER NOT NULL DEFAULT 1,
    status_descricao VARCHAR(200),
    
    -- Valores
    valor_solicitado NUMERIC(15,2) NOT NULL,
    total_taxas NUMERIC(15,2) DEFAULT 0,
    valor_a_depositar NUMERIC(15,2) NOT NULL,
    
    -- Datas
    data_pedido TIMESTAMPTZ DEFAULT NOW(),
    data_apuracao TIMESTAMPTZ,
    
    -- Dados bancários
    banco VARCHAR(100),
    tipo_conta VARCHAR(50),
    variacao VARCHAR(20),
    agencia VARCHAR(20),
    numero VARCHAR(50),
    operacao VARCHAR(20),
    nome_titular VARCHAR(200),
    tipo_titular VARCHAR(50),
    documento_titular VARCHAR(50),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices baseados em filtros da API
CREATE INDEX idx_solicitacoes_saque_id ON solicitacoes_saque(id);
CREATE INDEX idx_solicitacoes_saque_distribuidor_id ON solicitacoes_saque(distribuidor_id);
CREATE INDEX idx_solicitacoes_saque_distribuidor_nome ON solicitacoes_saque(distribuidor_nome);
CREATE INDEX idx_solicitacoes_saque_distribuidor_usuario ON solicitacoes_saque(distribuidor_usuario);
CREATE INDEX idx_solicitacoes_saque_conta_id ON solicitacoes_saque(conta_id);
CREATE INDEX idx_solicitacoes_saque_status_id ON solicitacoes_saque(status_id);
CREATE INDEX idx_solicitacoes_saque_status_descricao ON solicitacoes_saque(status_descricao);
CREATE INDEX idx_solicitacoes_saque_valor_solicitado ON solicitacoes_saque(valor_solicitado);
CREATE INDEX idx_solicitacoes_saque_data_pedido ON solicitacoes_saque(data_pedido);
CREATE INDEX idx_solicitacoes_saque_data_apuracao ON solicitacoes_saque(data_apuracao);
CREATE INDEX idx_solicitacoes_saque_banco ON solicitacoes_saque(banco);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_solicitacoes_saque_updated_at BEFORE UPDATE ON solicitacoes_saque
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'solicitacoes_saque';
