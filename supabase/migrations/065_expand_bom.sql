-- ============================================================================
-- EXPAND BOM - ALLIN OS 2.0
-- Expande tabela BOM para suportar gestão completa de lista de materiais
-- Adiciona campos para consumo por unidade, perdas previstas, revisão, versão, vigência
-- Migration: 065_expand_bom.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- ADICIONAR CAMPOS À TABELA BOM
-- ============================================================================

ALTER TABLE industrial.bom
ADD COLUMN IF NOT EXISTS consumo_por_unidade NUMERIC(12,4),
ADD COLUMN IF NOT EXISTS perdas_previstas_percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS revisao VARCHAR(50),
ADD COLUMN IF NOT EXISTS versao VARCHAR(50),
ADD COLUMN IF NOT EXISTS vigencia_inicio DATE,
ADD COLUMN IF NOT EXISTS vigencia_fim DATE,
ADD COLUMN IF NOT EXISTS status_vigencia VARCHAR(50), -- ativa, expirada, futura
ADD COLUMN IF NOT EXISTS custo_unitario NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS custo_total NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS aprovado_por UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS data_aprovacao DATE;

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================

-- Verificar novos campos em bom
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'industrial'
  AND table_name = 'bom'
  AND column_name IN (
    'consumo_por_unidade',
    'perdas_previstas_percentual',
    'revisao',
    'versao',
    'vigencia_inicio',
    'vigencia_fim',
    'status_vigencia',
    'custo_unitario',
    'custo_total',
    'observacoes',
    'aprovado_por',
    'data_aprovacao'
  )
ORDER BY column_name;

COMMIT;

-- ============================================================================
-- NOTAS:
-- - Campos adicionados à tabela BOM para gestão completa de lista de materiais
-- - Suporte para consumo por unidade e perdas previstas
-- - Suporte para controle de revisão e versão
-- - Suporte para vigência (data início/fim, status)
-- - Suporte para custos unitários e totais
-- - Suporte para aprovação (aprovado por, data aprovação)
-- ============================================================================
