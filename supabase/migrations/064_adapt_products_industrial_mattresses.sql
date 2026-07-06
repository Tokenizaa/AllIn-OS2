-- ============================================================================
-- ADAPT PRODUCTS INDUSTRIAL FOR MATTRESSES - ALLIN OS 2.0
-- Adapta tabela products_industrial para suportar produtos de colchão
-- Adiciona campos para categoria, dimensões, densidade, composição, linha, coleção
-- Migration: 064_adapt_products_industrial_mattresses.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA PRODUCTS_INDUSTRIAL
-- ============================================================================

ALTER TABLE industrial.products_industrial
ADD COLUMN IF NOT EXISTS categoria VARCHAR(50), -- colchao, travesseiro, base, etc.
ADD COLUMN IF NOT EXISTS subcategoria VARCHAR(50),
ADD COLUMN IF NOT EXISTS linha VARCHAR(50), -- premium, standard, economico
ADD COLUMN IF NOT EXISTS colecao VARCHAR(100),
ADD COLUMN IF NOT EXISTS comprimento_cm NUMERIC(6,2),
ADD COLUMN IF NOT EXISTS largura_cm NUMERIC(6,2),
ADD COLUMN IF NOT EXISTS altura_cm NUMERIC(6,2),
ADD COLUMN IF NOT EXISTS densidade_kg_m3 NUMERIC(6,2),
ADD COLUMN IF NOT EXISTS composicao TEXT, -- JSON string ou texto descritivo
ADD COLUMN IF NOT EXISTS tipo_espuma VARCHAR(50), -- HR, LATEX, VISCO, etc.
ADD COLUMN IF NOT EXISTS numero_camadas INTEGER,
ADD COLUMN IF NOT EXISTS firmeza VARCHAR(50), -- macio, medio, firme
ADD COLUMN IF NOT EXISTS garantia_meses INTEGER,
ADD COLUMN IF NOT EXISTS peso_kg NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS observacoes_tecnicas TEXT,
ADD COLUMN IF NOT EXISTS normas_tecnicas TEXT, -- ABNT, ISO, etc.
ADD COLUMN IF NOT EXISTS certificacoes TEXT, -- INMETRO, etc.

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================

-- Verificar novos campos em products_industrial
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'industrial'
  AND table_name = 'products_industrial'
  AND column_name IN (
    'categoria',
    'subcategoria',
    'linha',
    'colecao',
    'comprimento_cm',
    'largura_cm',
    'altura_cm',
    'densidade_kg_m3',
    'composicao',
    'tipo_espuma',
    'numero_camadas',
    'firmeza',
    'garantia_meses',
    'peso_kg',
    'observacoes_tecnicas',
    'normas_tecnicas',
    'certificacoes'
  )
ORDER BY column_name;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Campos adicionados à tabela products_industrial para produtos de colchão
-- - Suporte para dimensões físicas (comprimento, largura, altura)
-- - Suporte para especificações técnicas (densidade, composição, tipo de espuma)
-- - Suporte para classificação comercial (linha, coleção, categoria)
-- - Suporte para informações de garantia e certificações
-- ============================================================================
