-- Migration: Trigger de processamento automático de pedidos MLM
-- Cria o trigger que dispara o processamento MLM quando o pagamento é confirmado

-- Drop trigger se já existir
DROP TRIGGER IF EXISTS trigger_processar_pedido_pagamento ON pedidos;

-- Criar trigger que dispara quando pagamento_confirmado muda para true
CREATE TRIGGER trigger_processar_pedido_pagamento
AFTER UPDATE ON pedidos
FOR EACH ROW
WHEN (NEW.pagamento_confirmado = true AND OLD.pagamento_confirmado = false)
EXECUTE FUNCTION processar_pedido_mlm(NEW.id);

-- Comentário sobre o trigger
COMMENT ON TRIGGER trigger_processar_pedido_pagamento ON pedidos IS 'Trigger que dispara o processamento MLM quando o pagamento do pedido é confirmado';
