-- ============================================================================
-- ETAPA 6 - EXPANDIR PRODUCTS_INDUSTRIAL PARA COLCHÕES
-- Migration: 062_expand_products_industrial_mattress.sql
-- Adiciona campos específicos para produtos de colchão
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA PRODUCTS_INDUSTRIAL
-- ============================================================================

ALTER TABLE industrial.products_industrial
ADD COLUMN IF NOT EXISTS densidade NUMERIC(6,2), -- densidade em kg/m3
ADD COLUMN IF NOT EXISTS composicao TEXT,
ADD COLUMN IF NOT EXISTS linha VARCHAR(100),
ADD COLUMN IF NOT EXISTS colecao VARCHAR(100),
ADD COLUMN IF NOT EXISTS observacoes_tecnicas TEXT,
ADD COLUMN IF NOT EXISTS tipo_espuma VARCHAR(50), -- convencional, viscoelastic, latex, etc
ADD COLUMN IF NOT exists altura_espuma_cm NUMERIC(6,2),
ADD COLUMN IF NOT EXISTS qtd_camadas INTEGER DEFAULT 1;

-- ============================================================================
-- ADICIONAR ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_linha ON industrial.products_industrial(linha);
CREATE INDEX IF NOT EXISTS idx_products_colecao ON industrial.products_industrial(colecao);
CREATE INDEX IF NOT EXISTS idx_products_densidade ON industrial.products_industrial(densidade);
CREATE INDEX IF NOT EXISTS idx_products_tipo_espuma ON industrial.products_industrial(tipo_espuma);

-- ============================================================================
-- ADICIONAR COMENTÁRIOS
-- ============================================================================

COMMENT ON COLUMN industrial.products_industrial.densidade IS 'Densidade do material em kg/m³';
COMMENT ON COLUMN industrial.products_industrial.composicao IS 'Composição detalhada do produto (materiais, camadas, etc)';
COMMENT ON COLUMN industrial.products_industrial.linha IS 'Linha do produto (ex: Standard, Premium, Luxury)';
COMMENT ON COLUMN industrial.products_industrial.colecao IS 'Coleção do produto (ex: Classic, Modern, Eco)';
COMMENT ON COLUMN industrial.products_industrial.observacoes_tecnicas IS 'Observações técnicas específicas do produto';
COMMENT ON COLUMN industrial.products_industrial.tipo_espuma IS 'Tipo de espuma utilizada (convencional, viscoelástica, látex, etc)';
COMMENT ON COLUMN industrial.products_industrial.altura_espuma_cm IS 'Altura da espuma em centímetros';
COMMENT ON COLUMN industrial.products_industrial.qtd_camadas IS 'Quantidade de camadas do produto';

COMMIT;
