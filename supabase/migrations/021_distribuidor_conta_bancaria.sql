-- ============================================================================
-- DISTRIBUIDOR CONTA BANCÁRIA - ALLIN OS 2.0
-- Baseado em: 38-distribuidor-conta-bancaria.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- DISTRIBUIDOR CONTA BANCÁRIA
-- Tabela de contas bancárias dos distribuidores
-- ============================================================================
CREATE TABLE distribuidor_conta_bancaria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamento
    distribuidor_id TEXT NOT NULL,
    banco INTEGER NOT NULL,
    
    -- Dados do titular
    tipo_titular INTEGER NOT NULL, -- 1 - física, 2 - jurídica
    nome VARCHAR(200),
    telefone VARCHAR(20),
    cpf VARCHAR(20),
    cnpj VARCHAR(20),
    chave_pix TEXT,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_distribuidor_conta_bancaria_distribuidor_id ON distribuidor_conta_bancaria(distribuidor_id);
CREATE INDEX idx_distribuidor_conta_bancaria_banco ON distribuidor_conta_bancaria(banco);
CREATE INDEX idx_distribuidor_conta_bancaria_tipo_titular ON distribuidor_conta_bancaria(tipo_titular);
CREATE INDEX idx_distribuidor_conta_bancaria_cpf ON distribuidor_conta_bancaria(cpf);
CREATE INDEX idx_distribuidor_conta_bancaria_cnpj ON distribuidor_conta_bancaria(cnpj);
CREATE INDEX idx_distribuidor_conta_bancaria_chave_pix ON distribuidor_conta_bancaria(chave_pix);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_distribuidor_conta_bancaria_updated_at BEFORE UPDATE ON distribuidor_conta_bancaria
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'distribuidor_conta_bancaria';
