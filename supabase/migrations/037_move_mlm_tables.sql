-- ============================================================================
-- MOVE MLM TABLES - ALLIN OS 2.0
-- Move tabelas MLM para schema mlm
-- ============================================================================

BEGIN;

-- ============================================================================
-- MOVER TABELAS MLM PARA SCHEMA MLM
-- ============================================================================

-- Mover distribuidores
ALTER TABLE distribuidores SET SCHEMA mlm;

-- Mover planos
ALTER TABLE planos SET SCHEMA mlm;

-- Mover planos_distribuidores
ALTER TABLE planos_distribuidores SET SCHEMA mlm;

-- Mover bonus_regras
ALTER TABLE bonus_regras SET SCHEMA mlm;

-- Mover bonus_historico
ALTER TABLE bonus_historico SET SCHEMA mlm;

-- Mover pontos_saldo
ALTER TABLE pontos_saldo SET SCHEMA mlm;

-- Mover pontos_transacoes
ALTER TABLE pontos_transacoes SET SCHEMA mlm;

-- Mover qualificacoes
ALTER TABLE qualificacoes SET SCHEMA mlm;

-- Mover qualificacoes_historico
ALTER TABLE qualificacoes_historico SET SCHEMA mlm;

-- Mover comissoes
ALTER TABLE comissoes SET SCHEMA mlm;

-- Mover rede_linear_nos
ALTER TABLE rede_linear_nos SET SCHEMA mlm;

-- Mover distribuidor_conta_bancaria
ALTER TABLE distribuidor_conta_bancaria SET SCHEMA mlm;

-- ============================================================================
-- ATUALIZAR TRIGGERS PARA NOVO SCHEMA
-- ============================================================================

-- Drop triggers antigos
DROP TRIGGER IF EXISTS update_distribuidores_updated_at ON mlm.distribuidores;
DROP TRIGGER IF EXISTS update_planos_updated_at ON mlm.planos;
DROP TRIGGER IF EXISTS update_planos_distribuidores_updated_at ON mlm.planos_distribuidores;
DROP TRIGGER IF EXISTS update_bonus_regras_updated_at ON mlm.bonus_regras;
DROP TRIGGER IF EXISTS update_bonus_historico_updated_at ON mlm.bonus_historico;
DROP TRIGGER IF EXISTS update_pontos_saldo_updated_at ON mlm.pontos_saldo;
DROP TRIGGER IF EXISTS update_qualificacoes_updated_at ON mlm.qualificacoes;
DROP TRIGGER IF EXISTS update_comissoes_updated_at ON mlm.comissoes;
DROP TRIGGER IF EXISTS update_rede_linear_nos_updated_at ON mlm.rede_linear_nos;
DROP TRIGGER IF EXISTS update_distribuidor_conta_bancaria_updated_at ON mlm.distribuidor_conta_bancaria;

-- Recriar triggers no novo schema
CREATE TRIGGER update_distribuidores_updated_at BEFORE UPDATE ON mlm.distribuidores
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planos_updated_at BEFORE UPDATE ON mlm.planos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planos_distribuidores_updated_at BEFORE UPDATE ON mlm.planos_distribuidores
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bonus_regras_updated_at BEFORE UPDATE ON mlm.bonus_regras
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bonus_historico_updated_at BEFORE UPDATE ON mlm.bonus_historico
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pontos_saldo_updated_at BEFORE UPDATE ON mlm.pontos_saldo
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qualificacoes_updated_at BEFORE UPDATE ON mlm.qualificacoes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comissoes_updated_at BEFORE UPDATE ON mlm.comissoes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rede_linear_nos_updated_at BEFORE UPDATE ON mlm.rede_linear_nos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_distribuidor_conta_bancaria_updated_at BEFORE UPDATE ON mlm.distribuidor_conta_bancaria
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICAR TABELAS MOVIDAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'mlm'
ORDER BY tablename;

COMMIT;
