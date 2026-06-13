-- ============================================================================
-- PEDIDOS - ALLIN OS 2.0
-- Baseado em: 50-pedidos.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PEDIDOS
-- Baseado em: 50-pedidos.md
-- Campos principais da API AllInBrasil
-- ============================================================================
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    numero_pedido VARCHAR(100),
    
    -- Relacionamentos
    distribuidor_indicador_id TEXT,
    distribuidor_comprador_id TEXT,
    cliente_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    loja_id INTEGER,
    loja_nome VARCHAR(200),
    loja_documento TEXT,
    
    -- Tipo de compra
    tipo_id INTEGER,
    tipo_chave VARCHAR(100),
    tipo_nome VARCHAR(200),
    tipo_descricao TEXT,
    
    -- Cliente
    cliente_nome VARCHAR(200),
    cliente_sobrenome VARCHAR(200),
    cliente_email VARCHAR(200),
    cliente_telefone VARCHAR(20),
    cliente_rg VARCHAR(20),
    cliente_cpf VARCHAR(20),
    cliente_cnpj VARCHAR(20),
    cliente_ie VARCHAR(20),
    
    -- Endereço do cliente
    cliente_logradouro TEXT,
    cliente_bairro VARCHAR(100),
    cliente_cep VARCHAR(10),
    cliente_cidade VARCHAR(100),
    cliente_uf VARCHAR(2),
    
    -- Endereço de entrega
    entrega_nome VARCHAR(200),
    entrega_sobrenome VARCHAR(200),
    entrega_logradouro TEXT,
    entrega_bairro VARCHAR(100),
    entrega_cep VARCHAR(10),
    entrega_cidade VARCHAR(100),
    entrega_uf VARCHAR(2),
    
    -- Valores
    valor_total NUMERIC(15,2),
    
    -- Status e flags
    status_pedido VARCHAR(50),
    status_id INTEGER,
    status_descricao VARCHAR(200),
    forma_pagamento VARCHAR(100),
    pagamento_confirmado BOOLEAN DEFAULT false,
    comanda_impressao BOOLEAN DEFAULT false,
    fatura_impressao BOOLEAN DEFAULT false,
    necessita_frete BOOLEAN DEFAULT false,
    cancelado BOOLEAN DEFAULT false,
    market_place BOOLEAN DEFAULT false,
    
    -- Datas
    data_criacao TIMESTAMPTZ DEFAULT NOW(),
    data_pagamento TIMESTAMPTZ,
    data_cancelamento TIMESTAMPTZ,
    data_modificado TIMESTAMPTZ DEFAULT NOW(),
    
    -- Moeda
    moeda_codigo VARCHAR(3) DEFAULT 'BRL',
    
    -- Comentários
    comentario TEXT,
    
    -- Campos personalizados
    campos_personalizados JSONB DEFAULT '{}',
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices baseados em filtros da API
CREATE INDEX idx_pedidos_id ON pedidos(id);
CREATE INDEX idx_pedidos_numero_pedido ON pedidos(numero_pedido);
CREATE INDEX idx_pedidos_distribuidor_indicador_id ON pedidos(distribuidor_indicador_id);
CREATE INDEX idx_pedidos_distribuidor_comprador_id ON pedidos(distribuidor_comprador_id);
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_loja_id ON pedidos(loja_id);
CREATE INDEX idx_pedidos_tipo_id ON pedidos(tipo_id);
CREATE INDEX idx_pedidos_status_pedido ON pedidos(status_pedido);
CREATE INDEX idx_pedidos_status_id ON pedidos(status_id);
CREATE INDEX idx_pedidos_pagamento_confirmado ON pedidos(pagamento_confirmado);
CREATE INDEX idx_pedidos_cancelado ON pedidos(cancelado);
CREATE INDEX idx_pedidos_market_place ON pedidos(market_place);
CREATE INDEX idx_pedidos_data_criacao ON pedidos(data_criacao);
CREATE INDEX idx_pedidos_data_pagamento ON pedidos(data_pagamento);
CREATE INDEX idx_pedidos_data_cancelamento ON pedidos(data_cancelamento);

-- ============================================================================
-- PEDIDOS ITENS
-- Itens do pedido (baseado em endpoints de itens da API)
-- ============================================================================
CREATE TABLE pedidos_itens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
    quantidade INTEGER DEFAULT 1,
    preco_unitario NUMERIC(10,2),
    preco_total NUMERIC(10,2),
    nome_produto VARCHAR(200),
    categoria VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pedidos_itens_pedido_id ON pedidos_itens(pedido_id);
CREATE INDEX idx_pedidos_itens_produto_id ON pedidos_itens(produto_id);

-- ============================================================================
-- PEDIDOS PAGAMENTOS
-- Pagamentos do pedido (baseado em endpoints de pagamentos da API)
-- ============================================================================
CREATE TABLE pedidos_pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    forma_pagamento_id UUID REFERENCES formas_pagamento(id) ON DELETE SET NULL,
    valor NUMERIC(15,2),
    status VARCHAR(50),
    data_pagamento TIMESTAMPTZ,
    codigo_transacao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pedidos_pagamentos_pedido_id ON pedidos_pagamentos(pedido_id);
CREATE INDEX idx_pedidos_pagamentos_status ON pedidos_pagamentos(status);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_itens_updated_at BEFORE UPDATE ON pedidos_itens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_pagamentos_updated_at BEFORE UPDATE ON pedidos_pagamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabelas criadas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('pedidos', 'pedidos_itens', 'pedidos_pagamentos')
ORDER BY tablename;
