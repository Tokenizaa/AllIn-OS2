-- ============================================================================
-- REDE LINEAR NÓS - ALLIN OS 2.0
-- Baseado em: 58-rede-linear-nos.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- REDE LINEAR NÓS
-- Baseado em: 58-rede-linear-nos.md
-- Campos: linha, posicao_relativa, id_distribuidor, id_patrocinador, usuario_distribuidor, usuario_patrocinador
-- ============================================================================
CREATE TABLE rede_linear_nos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Posição na rede linear
    linha INTEGER NOT NULL,
    posicao_relativa INTEGER NOT NULL,
    
    -- Relacionamentos
    id_distribuidor TEXT,
    id_patrocinador TEXT,
    usuario_distribuidor VARCHAR(100),
    usuario_patrocinador VARCHAR(100),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices baseados em filtros da API
CREATE INDEX idx_rede_linear_nos_linha ON rede_linear_nos(linha);
CREATE INDEX idx_rede_linear_nos_posicao_relativa ON rede_linear_nos(posicao_relativa);
CREATE INDEX idx_rede_linear_nos_id_distribuidor ON rede_linear_nos(id_distribuidor);
CREATE INDEX idx_rede_linear_nos_id_patrocinador ON rede_linear_nos(id_patrocinador);
CREATE INDEX idx_rede_linear_nos_usuario_distribuidor ON rede_linear_nos(usuario_distribuidor);
CREATE INDEX idx_rede_linear_nos_usuario_patrocinador ON rede_linear_nos(usuario_patrocinador);

-- Índice composto para busca eficiente
CREATE INDEX idx_rede_linear_nos_linha_posicao ON rede_linear_nos(linha, posicao_relativa);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_rede_linear_nos_updated_at BEFORE UPDATE ON rede_linear_nos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'rede_linear_nos';
