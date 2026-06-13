-- ============================================================================
-- TIPOS CAMPO PEDIDO - ALLIN OS 2.0
-- Baseado em: 64-tipos-campo-pedido.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- TIPOS CAMPO PEDIDO
-- Tabela de tipos de campo disponíveis para os pedidos
-- ============================================================================
CREATE TABLE tipos_campo_pedido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    chave VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(50),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tipos_campo_pedido_nome ON tipos_campo_pedido(nome);
CREATE INDEX idx_tipos_campo_pedido_chave ON tipos_campo_pedido(chave);
CREATE INDEX idx_tipos_campo_pedido_tipo ON tipos_campo_pedido(tipo);
CREATE INDEX idx_tipos_campo_pedido_ativo ON tipos_campo_pedido(ativo);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_tipos_campo_pedido_updated_at BEFORE UPDATE ON tipos_campo_pedido
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'tipos_campo_pedido';
