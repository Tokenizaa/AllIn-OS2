-- ============================================================================
-- BONUS HISTÓRICO - ALLIN OS 2.0
-- Histórico de bônus pagos
-- ============================================================================

BEGIN;

-- ============================================================================
-- BONUS HISTÓRICO
-- Tabela de histórico de bônus pagos aos distribuidores
-- ============================================================================
CREATE TABLE bonus_historico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    distribuidor_id TEXT NOT NULL,
    bonus_regra_id UUID REFERENCES bonus_regras(id) ON DELETE SET NULL,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    
    -- Tipo de bônus
    tipo VARCHAR(50) NOT NULL, -- direto, indireto, geracao, binario, start_bonus
    geracao INTEGER DEFAULT 1,
    
    -- Valores
    valor_base NUMERIC(15,2) NOT NULL,
    porcentagem_aplicada NUMERIC(5,2) DEFAULT 0,
    valor_calculado NUMERIC(15,2) NOT NULL,
    
    -- Período de referência
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid, cancelled
    data_calculo TIMESTAMPTZ DEFAULT NOW(),
    data_aprovacao TIMESTAMPTZ,
    data_pagamento TIMESTAMPTZ,
    
    -- Referência
    referencia_id UUID, -- ID da transação ou pedido que gerou o bônus
    referencia_tipo VARCHAR(50),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_bonus_historico_distribuidor_id ON bonus_historico(distribuidor_id);
CREATE INDEX idx_bonus_historico_bonus_regra_id ON bonus_historico(bonus_regra_id);
CREATE INDEX idx_bonus_historico_pedido_id ON bonus_historico(pedido_id);
CREATE INDEX idx_bonus_historico_tipo ON bonus_historico(tipo);
CREATE INDEX idx_bonus_historico_geracao ON bonus_historico(geracao);
CREATE INDEX idx_bonus_historico_status ON bonus_historico(status);
CREATE INDEX idx_bonus_historico_periodo_inicio ON bonus_historico(periodo_inicio);
CREATE INDEX idx_bonus_historico_periodo_fim ON bonus_historico(periodo_fim);
CREATE INDEX idx_bonus_historico_data_calculo ON bonus_historico(data_calculo);
CREATE INDEX idx_bonus_historico_data_pagamento ON bonus_historico(data_pagamento);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_bonus_historico_updated_at BEFORE UPDATE ON bonus_historico
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'bonus_historico';
