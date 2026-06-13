-- ============================================================================
-- TRANSPORTADORAS - ALLIN OS 2.0
-- Baseado em: 66-transportadoras.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- TRANSPORTADORAS
-- Tabela de transportadoras cadastradas
-- ============================================================================
CREATE TABLE transportadoras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    titulo VARCHAR(200) NOT NULL,
    codigo VARCHAR(50),
    telefone VARCHAR(20),
    email VARCHAR(200),
    
    -- Configurações
    localidades_nao_cadastrada BOOLEAN DEFAULT false,
    preco NUMERIC(10,2),
    situacao INTEGER DEFAULT 1,
    
    -- Limites
    total_minimo NUMERIC(10,2),
    total_maximo NUMERIC(10,2),
    
    -- Relacionamento
    loja_id INTEGER REFERENCES lojas(id) ON DELETE SET NULL,
    
    -- Unidades
    unidade_peso VARCHAR(20),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_transportadoras_titulo ON transportadoras(titulo);
CREATE INDEX idx_transportadoras_codigo ON transportadoras(codigo);
CREATE INDEX idx_transportadoras_situacao ON transportadoras(situacao);
CREATE INDEX idx_transportadoras_loja_id ON transportadoras(loja_id);
CREATE INDEX idx_transportadoras_preco ON transportadoras(preco);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_transportadoras_updated_at BEFORE UPDATE ON transportadoras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'transportadoras';
