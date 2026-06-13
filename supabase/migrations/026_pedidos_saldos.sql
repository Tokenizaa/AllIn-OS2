-- ============================================================================
-- PEDIDOS SALDOS - ALLIN OS 2.0
-- Baseado em: 51-pedidos-saldos.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PEDIDOS SALDOS
-- Tabela de saldos gerados na compra de pacotes
-- ============================================================================
CREATE TABLE pedidos_saldos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    cliente_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    pacote_id UUID,
    
    -- Valores
    valor NUMERIC(15,2) NOT NULL,
    
    -- Período
    data DATE NOT NULL,
    
    -- Tipo
    tipo_saldo_id INTEGER,
    descricao TEXT,
    tipo_componente VARCHAR(50),
    
    -- Configurações
    mostrar_cliente BOOLEAN DEFAULT false,
    pacote_comprado_chave TEXT,
    pacote_descricao TEXT,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pedidos_saldos_cliente_id ON pedidos_saldos(cliente_id);
CREATE INDEX idx_pedidos_saldos_pedido_id ON pedidos_saldos(pedido_id);
CREATE INDEX idx_pedidos_saldos_pacote_id ON pedidos_saldos(pacote_id);
CREATE INDEX idx_pedidos_saldos_valor ON pedidos_saldos(valor);
CREATE INDEX idx_pedidos_saldos_data ON pedidos_saldos(data);
CREATE INDEX idx_pedidos_saldos_tipo_saldo_id ON pedidos_saldos(tipo_saldo_id);

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'pedidos_saldos';
