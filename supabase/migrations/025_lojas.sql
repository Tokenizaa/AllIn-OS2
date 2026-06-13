-- ============================================================================
-- LOJAS - ALLIN OS 2.0
-- Baseado em: 48-lojas.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- LOJAS
-- Tabela de lojas
-- ============================================================================
CREATE TABLE lojas (
    id INTEGER PRIMARY KEY,
    
    -- Identificação
    documento VARCHAR(50),
    nome VARCHAR(200),
    
    -- Status
    status INTEGER DEFAULT 1, -- 1 - Habilitado, 0 - Desabilitado
    
    -- Localização de atendimento
    endereco_id INTEGER,
    cidade_id INTEGER REFERENCES cidades(id),
    bairro VARCHAR(100),
    cep VARCHAR(10),
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    uf_id INTEGER REFERENCES estados(id),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_lojas_documento ON lojas(documento);
CREATE INDEX idx_lojas_nome ON lojas(nome);
CREATE INDEX idx_lojas_status ON lojas(status);
CREATE INDEX idx_lojas_cidade_id ON lojas(cidade_id);
CREATE INDEX idx_lojas_uf_id ON lojas(uf_id);
CREATE INDEX idx_lojas_cep ON lojas(cep);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_lojas_updated_at BEFORE UPDATE ON lojas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'lojas';
