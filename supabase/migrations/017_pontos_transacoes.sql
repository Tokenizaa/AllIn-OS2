-- ============================================================================
-- PONTOS TRANSAÇÕES - ALLIN OS 2.0
-- Transações de pontos
-- ============================================================================

BEGIN;

-- ============================================================================
-- PONTOS TRANSAÇÕES
-- Tabela de transações de pontos
-- ============================================================================
CREATE TABLE pontos_transacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    distribuidor_id TEXT NOT NULL,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    
    -- Tipo de transação
    tipo VARCHAR(50) NOT NULL, -- credito, debito, expiracao, ajuste
    origem VARCHAR(50), -- compra, bonus, ajuste_manual, etc
    
    -- Valores
    quantidade INTEGER NOT NULL,
    saldo_antes INTEGER NOT NULL,
    saldo_depois INTEGER NOT NULL,
    
    -- Período de validade
    data_validade_inicio DATE,
    data_validade_fim DATE,
    
    -- Referência
    referencia_id UUID,
    referencia_tipo VARCHAR(50),
    descricao TEXT,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pontos_transacoes_distribuidor_id ON pontos_transacoes(distribuidor_id);
CREATE INDEX idx_pontos_transacoes_pedido_id ON pontos_transacoes(pedido_id);
CREATE INDEX idx_pontos_transacoes_tipo ON pontos_transacoes(tipo);
CREATE INDEX idx_pontos_transacoes_origem ON pontos_transacoes(origem);
CREATE INDEX idx_pontos_transacoes_data_validade_fim ON pontos_transacoes(data_validade_fim);
CREATE INDEX idx_pontos_transacoes_created_at ON pontos_transacoes(created_at);

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'pontos_transacoes';
