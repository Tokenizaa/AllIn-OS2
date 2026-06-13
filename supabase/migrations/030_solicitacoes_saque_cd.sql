-- ============================================================================
-- SOLICITAÇÕES SAQUE CD - ALLIN OS 2.0
-- Baseado em: 63-solicitacoes-saque-cd.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- SOLICITAÇÕES SAQUE CD
-- Tabela de solicitações de saque de CD's
-- ============================================================================
CREATE TABLE solicitacoes_saque_cd (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    cd_id TEXT NOT NULL,
    cd_nome VARCHAR(200),
    cd_usuario VARCHAR(100),
    conta_cd_id INTEGER,
    conta_descricao TEXT,
    
    -- Status
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

-- Índices
CREATE INDEX idx_solicitacoes_saque_cd_cd_id ON solicitacoes_saque_cd(cd_id);
CREATE INDEX idx_solicitacoes_saque_cd_cd_nome ON solicitacoes_saque_cd(cd_nome);
CREATE INDEX idx_solicitacoes_saque_cd_cd_usuario ON solicitacoes_saque_cd(cd_usuario);
CREATE INDEX idx_solicitacoes_saque_cd_conta_cd_id ON solicitacoes_saque_cd(conta_cd_id);
CREATE INDEX idx_solicitacoes_saque_cd_status_id ON solicitacoes_saque_cd(status_id);
CREATE INDEX idx_solicitacoes_saque_cd_valor_solicitado ON solicitacoes_saque_cd(valor_solicitado);
CREATE INDEX idx_solicitacoes_saque_cd_data_pedido ON solicitacoes_saque_cd(data_pedido);
CREATE INDEX idx_solicitacoes_saque_cd_data_apuracao ON solicitacoes_saque_cd(data_apuracao);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_solicitacoes_saque_cd_updated_at BEFORE UPDATE ON solicitacoes_saque_cd
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'solicitacoes_saque_cd';
