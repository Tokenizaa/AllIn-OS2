-- ============================================================================
-- PLANOS - ALLIN OS 2.0
-- Sistema de Planos MLM
-- Baseado em: 61-simulacao-planos.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PLANOS
-- Tabela de planos disponíveis no sistema MLM
-- ============================================================================
CREATE TABLE planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    
    -- Valores
    preco NUMERIC(10,2) NOT NULL DEFAULT 0,
    taxa_ativacao NUMERIC(10,2) DEFAULT 0,
    taxa_mensal NUMERIC(10,2) DEFAULT 0,
    
    -- Configurações MLM
    max_geracoes INTEGER DEFAULT 1,
    bonus_direto_porcentagem NUMERIC(5,2) DEFAULT 0,
    bonus_indireto_porcentagem NUMERIC(5,2) DEFAULT 0,
    
    -- Pontuação
    pontos_ativacao INTEGER DEFAULT 0,
    pontos_renovacao INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_upgrade BOOLEAN DEFAULT false,
    upgrade_de_id UUID REFERENCES planos(id) ON DELETE SET NULL,
    
    -- Metadados
    configuracoes JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_planos_nome ON planos(nome);
CREATE INDEX idx_planos_tipo ON planos(tipo);
CREATE INDEX idx_planos_slug ON planos(slug);
CREATE INDEX idx_planos_is_active ON planos(is_active);
CREATE INDEX idx_planos_is_upgrade ON planos(is_upgrade);
CREATE INDEX idx_planos_upgrade_de_id ON planos(upgrade_de_id);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_planos_updated_at BEFORE UPDATE ON planos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'planos';
