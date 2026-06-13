-- ============================================================================
-- LOCALIZAÇÃO - ALLIN OS 2.0
-- Baseado em documentação da API AllInBrasil:
-- - 49-paises.md
-- - 40-estados.md
-- - 05-cidades.md
-- - 04-cep.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PAÍSES
-- Baseado em: 49-paises.md
-- ============================================================================
CREATE TABLE paises (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nome_nativo VARCHAR(255),
    sigla VARCHAR(3),
    iso3 VARCHAR(3),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_paises_nome ON paises(nome);
CREATE INDEX idx_paises_sigla ON paises(sigla);
CREATE INDEX idx_paises_iso3 ON paises(iso3);

-- ============================================================================
-- ESTADOS
-- Baseado em: 40-estados.md
-- ============================================================================
CREATE TABLE estados (
    id INTEGER PRIMARY KEY,
    uf VARCHAR(2) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    pais_id INTEGER REFERENCES paises(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_estados_uf ON estados(uf);
CREATE INDEX idx_estados_nome ON estados(nome);
CREATE INDEX idx_estados_pais_id ON estados(pais_id);

-- ============================================================================
-- CIDADES
-- Baseado em: 05-cidades.md
-- ============================================================================
CREATE TABLE cidades (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    uf_id INTEGER REFERENCES estados(id),
    uf_codigo VARCHAR(2),
    pais_id INTEGER REFERENCES paises(id),
    pais_codigo VARCHAR(3),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cidades_nome ON cidades(nome);
CREATE INDEX idx_cidades_uf_id ON cidades(uf_id);
CREATE INDEX idx_cidades_pais_id ON cidades(pais_id);
CREATE INDEX idx_cidades_uf_codigo ON cidades(uf_codigo);

-- ============================================================================
-- CEP
-- Baseado em: 04-cep.md
-- ============================================================================
CREATE TABLE cep (
    cep VARCHAR(8) PRIMARY KEY,
    cidade_id INTEGER REFERENCES cidades(id),
    cidade VARCHAR(200),
    uf_id INTEGER REFERENCES estados(id),
    uf_codigo VARCHAR(2),
    uf VARCHAR(20),
    pais_id INTEGER REFERENCES paises(id),
    pais_codigo VARCHAR(3),
    pais VARCHAR(255),
    bairro VARCHAR(100),
    logradouro VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cep_cidade_id ON cep(cidade_id);
CREATE INDEX idx_cep_uf_id ON cep(uf_id);
CREATE INDEX idx_cep_pais_id ON cep(pais_id);
CREATE INDEX idx_cep_bairro ON cep(bairro);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_paises_updated_at BEFORE UPDATE ON paises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estados_updated_at BEFORE UPDATE ON estados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cidades_updated_at BEFORE UPDATE ON cidades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cep_updated_at BEFORE UPDATE ON cep
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabelas criadas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('paises', 'estados', 'cidades', 'cep')
ORDER BY tablename;
