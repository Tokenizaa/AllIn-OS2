-- ============================================================================
-- COMISSÕES - ALLIN OS 2.0
-- Comissões calculadas
-- ============================================================================

BEGIN;

-- ============================================================================
-- COMISSÕES
-- Tabela de comissões calculadas
-- ============================================================================
CREATE TABLE comissoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    distribuidor_id TEXT NOT NULL,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    
    -- Tipo de comissão
    tipo VARCHAR(50) NOT NULL, -- direta, indireta, geracao, binaria
    geracao INTEGER DEFAULT 1,
    
    -- Valores
    valor_base NUMERIC(15,2) NOT NULL,
    porcentagem NUMERIC(5,2) DEFAULT 0,
    valor_comissao NUMERIC(15,2) NOT NULL,
    
    -- Período de referência
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid, cancelled
    data_calculo TIMESTAMPTZ DEFAULT NOW(),
    data_aprovacao TIMESTAMPTZ,
    data_pagamento TIMESTAMPTZ,
    
    -- Referência
    referencia_id UUID,
    referencia_tipo VARCHAR(50),
    descricao TEXT,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_comissoes_distribuidor_id ON comissoes(distribuidor_id);
CREATE INDEX idx_comissoes_pedido_id ON comissoes(pedido_id);
CREATE INDEX idx_comissoes_tipo ON comissoes(tipo);
CREATE INDEX idx_comissoes_geracao ON comissoes(geracao);
CREATE INDEX idx_comissoes_status ON comissoes(status);
CREATE INDEX idx_comissoes_periodo_inicio ON comissoes(periodo_inicio);
CREATE INDEX idx_comissoes_periodo_fim ON comissoes(periodo_fim);
CREATE INDEX idx_comissoes_data_calculo ON comissoes(data_calculo);
CREATE INDEX idx_comissoes_data_pagamento ON comissoes(data_pagamento);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_comissoes_updated_at BEFORE UPDATE ON comissoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'comissoes';
