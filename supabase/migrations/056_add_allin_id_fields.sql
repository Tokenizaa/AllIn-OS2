-- Migration: Adicionar campos allin_id para integração com API AllIn
-- Data: 2026-06-12
-- Descrição: Adiciona campos allin_id nas tabelas principais para rastrear a origem dos dados da API AllIn

-- Adicionar allin_id na tabela crm.customers
ALTER TABLE crm.customers 
ADD COLUMN IF NOT EXISTS allin_id INTEGER UNIQUE;

-- Criar índice para allin_id em crm.customers
CREATE INDEX IF NOT EXISTS idx_customers_allin_id ON crm.customers(allin_id);

-- Adicionar comentário
COMMENT ON COLUMN crm.customers.allin_id IS 'ID do cliente na API AllIn Brasil';

-- Adicionar allin_id na tabela mlm.distribuidores
ALTER TABLE mlm.distribuidores 
ADD COLUMN IF NOT EXISTS allin_id INTEGER UNIQUE;

-- Criar índice para allin_id em mlm.distribuidores
CREATE INDEX IF NOT EXISTS idx_distribuidores_allin_id ON mlm.distribuidores(allin_id);

-- Adicionar comentário
COMMENT ON COLUMN mlm.distribuidores.allin_id IS 'ID do distribuidor na API AllIn Brasil';

-- Adicionar allin_id na tabela commerce.produtos
ALTER TABLE commerce.produtos 
ADD COLUMN IF NOT EXISTS allin_id INTEGER UNIQUE;

-- Criar índice para allin_id em commerce.produtos
CREATE INDEX IF NOT EXISTS idx_produtos_allin_id ON commerce.produtos(allin_id);

-- Adicionar comentário
COMMENT ON COLUMN commerce.produtos.allin_id IS 'ID do produto na API AllIn Brasil';

-- Adicionar allin_id na tabela commerce.pedidos
ALTER TABLE commerce.pedidos 
ADD COLUMN IF NOT EXISTS allin_id INTEGER UNIQUE;

-- Criar índice para allin_id em commerce.pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_allin_id ON commerce.pedidos(allin_id);

-- Adicionar comentário
COMMENT ON COLUMN commerce.pedidos.allin_id IS 'ID do pedido na API AllIn Brasil';

-- Adicionar campo para rastrear última sincronização
ALTER TABLE crm.customers 
ADD COLUMN IF NOT EXISTS allin_synced_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE mlm.distribuidores 
ADD COLUMN IF NOT EXISTS allin_synced_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE commerce.produtos 
ADD COLUMN IF NOT EXISTS allin_synced_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE commerce.pedidos 
ADD COLUMN IF NOT EXISTS allin_synced_at TIMESTAMP WITH TIME ZONE;

-- Adicionar comentários
COMMENT ON COLUMN crm.customers.allin_synced_at IS 'Timestamp da última sincronização com API AllIn';
COMMENT ON COLUMN mlm.distribuidores.allin_synced_at IS 'Timestamp da última sincronização com API AllIn';
COMMENT ON COLUMN commerce.produtos.allin_synced_at IS 'Timestamp da última sincronização com API AllIn';
COMMENT ON COLUMN commerce.pedidos.allin_synced_at IS 'Timestamp da última sincronização com API AllIn';
