-- ============================================================================
-- MOVE COMMERCE TABLES - ALLIN OS 2.0
-- Move tabelas Commerce para schema commerce
-- ============================================================================

BEGIN;

-- ============================================================================
-- MOVER TABELAS COMMERCE PARA SCHEMA COMMERCE
-- ============================================================================

-- Mover produtos_categorias
ALTER TABLE produtos_categorias SET SCHEMA commerce;

-- Mover formas_pagamento
ALTER TABLE formas_pagamento SET SCHEMA commerce;

-- Mover produtos
ALTER TABLE produtos SET SCHEMA commerce;

-- Mover pedidos
ALTER TABLE pedidos SET SCHEMA commerce;

-- Mover pedidos_itens
ALTER TABLE pedidos_itens SET SCHEMA commerce;

-- Mover pedidos_pagamentos
ALTER TABLE pedidos_pagamentos SET SCHEMA commerce;

-- Mover pedidos_saldos
ALTER TABLE pedidos_saldos SET SCHEMA commerce;

-- Mover pedidos_status
ALTER TABLE pedidos_status SET SCHEMA commerce;

-- Mover produtos_opcoes
ALTER TABLE produtos_opcoes SET SCHEMA commerce;

-- Mover produtos_campos_opcoes
ALTER TABLE produtos_campos_opcoes SET SCHEMA commerce;

-- Mover tipos_campo_pedido
ALTER TABLE tipos_campo_pedido SET SCHEMA commerce;

-- ============================================================================
-- ATUALIZAR TRIGGERS PARA NOVO SCHEMA
-- ============================================================================

-- Drop triggers antigos
DROP TRIGGER IF EXISTS update_produtos_categorias_updated_at ON commerce.produtos_categorias;
DROP TRIGGER IF EXISTS update_formas_pagamento_updated_at ON commerce.formas_pagamento;
DROP TRIGGER IF EXISTS update_produtos_updated_at ON commerce.produtos;
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON commerce.pedidos;
DROP TRIGGER IF EXISTS update_pedidos_itens_updated_at ON commerce.pedidos_itens;
DROP TRIGGER IF EXISTS update_pedidos_pagamentos_updated_at ON commerce.pedidos_pagamentos;
DROP TRIGGER IF EXISTS update_pedidos_status_updated_at ON commerce.pedidos_status;
DROP TRIGGER IF EXISTS update_produtos_opcoes_updated_at ON commerce.produtos_opcoes;
DROP TRIGGER IF EXISTS update_produtos_campos_opcoes_updated_at ON commerce.produtos_campos_opcoes;
DROP TRIGGER IF EXISTS update_tipos_campo_pedido_updated_at ON commerce.tipos_campo_pedido;

-- Recriar triggers no novo schema
CREATE TRIGGER update_produtos_categorias_updated_at BEFORE UPDATE ON commerce.produtos_categorias
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_formas_pagamento_updated_at BEFORE UPDATE ON commerce.formas_pagamento
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON commerce.produtos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON commerce.pedidos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_itens_updated_at BEFORE UPDATE ON commerce.pedidos_itens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_pagamentos_updated_at BEFORE UPDATE ON commerce.pedidos_pagamentos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_status_updated_at BEFORE UPDATE ON commerce.pedidos_status
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produtos_opcoes_updated_at BEFORE UPDATE ON commerce.produtos_opcoes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produtos_campos_opcoes_updated_at BEFORE UPDATE ON commerce.produtos_campos_opcoes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tipos_campo_pedido_updated_at BEFORE UPDATE ON commerce.tipos_campo_pedido
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS MOVIDAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'commerce'
ORDER BY tablename;

COMMIT;
