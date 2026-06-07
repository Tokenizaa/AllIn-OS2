-- Migration para criar tabela de checkpoints do scraping
-- Esta tabela permite recuperação após falhas

CREATE TABLE IF NOT EXISTS scrape_checkpoints (
    id SERIAL PRIMARY KEY,
    ultimo_pedido_processado VARCHAR(50),
    pedidos_processados INTEGER DEFAULT 0,
    customers_processados INTEGER DEFAULT 0,
    orders_processados INTEGER DEFAULT 0,
    order_items_processados INTEGER DEFAULT 0,
    erros INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'not_started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para consulta rápida do último checkpoint
CREATE INDEX IF NOT EXISTS idx_scrape_checkpoints_status ON scrape_checkpoints(status);
CREATE INDEX IF NOT EXISTS idx_scrape_checkpoints_timestamp ON scrape_checkpoints(timestamp DESC);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scrape_checkpoints_updated_at BEFORE UPDATE ON scrape_checkpoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE scrape_checkpoints IS 'Tabela de checkpoints para recuperação do scraping após falhas';
COMMENT ON COLUMN scrape_checkpoints.ultimo_pedido_processado IS 'ID do último pedido processado com sucesso';
COMMENT ON COLUMN scrape_checkpoints.pedidos_processados IS 'Total de pedidos processados';
COMMENT ON COLUMN scrape_checkpoints.customers_processados IS 'Total de customers persistidos';
COMMENT ON COLUMN scrape_checkpoints.orders_processados IS 'Total de orders persistidas';
COMMENT ON COLUMN scrape_checkpoints.order_items_processados IS 'Total de order items persistidos';
COMMENT ON COLUMN scrape_checkpoints.erros IS 'Total de erros ocorridos';
COMMENT ON COLUMN scrape_checkpoints.status IS 'Status do scraping: not_started, in_progress, completed, failed';
