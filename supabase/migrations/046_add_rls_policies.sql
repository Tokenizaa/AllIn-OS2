-- ============================================================================
-- ADD RLS POLICIES - ALLIN OS 2.0
-- Adiciona RLS policies nas tabelas que ainda não têm proteção
-- ============================================================================

BEGIN;

-- ============================================================================
-- MLM TABLES RLS
-- ============================================================================

-- PLANOS
ALTER TABLE mlm.planos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to planos"
  ON mlm.planos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public read active planos"
  ON mlm.planos FOR SELECT
  USING (is_active = true);

-- PLANOS DISTRIBUIDORES
ALTER TABLE mlm.planos_distribuidores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to planos_distribuidores"
  ON mlm.planos_distribuidores FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- BONUS REGRAS
ALTER TABLE mlm.bonus_regras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to bonus_regras"
  ON mlm.bonus_regras FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public read active bonus_regras"
  ON mlm.bonus_regras FOR SELECT
  USING (is_active = true);

-- BONUS HISTÓRICO
ALTER TABLE mlm.bonus_historico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to bonus_historico"
  ON mlm.bonus_historico FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PONTOS SALDO
ALTER TABLE mlm.pontos_saldo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to pontos_saldo"
  ON mlm.pontos_saldo FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PONTOS TRANSAÇÕES
ALTER TABLE mlm.pontos_transacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to pontos_transacoes"
  ON mlm.pontos_transacoes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- QUALIFICAÇÕES
ALTER TABLE mlm.qualificacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to qualificacoes"
  ON mlm.qualificacoes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public read active qualificacoes"
  ON mlm.qualificacoes FOR SELECT
  USING (is_active = true);

-- QUALIFICAÇÕES HISTÓRICO
ALTER TABLE mlm.qualificacoes_historico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to qualificacoes_historico"
  ON mlm.qualificacoes_historico FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- COMISSÕES
ALTER TABLE mlm.comissoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to comissoes"
  ON mlm.comissoes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- DISTRIBUIDOR CONTA BANCÁRIA
ALTER TABLE mlm.distribuidor_conta_bancaria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to distribuidor_conta_bancaria"
  ON mlm.distribuidor_conta_bancaria FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- COMMERCE TABLES RLS
-- ============================================================================

-- PEDIDOS SALDOS
ALTER TABLE commerce.pedidos_saldos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to pedidos_saldos"
  ON commerce.pedidos_saldos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PEDIDOS STATUS
ALTER TABLE commerce.pedidos_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to pedidos_status"
  ON commerce.pedidos_status FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PRODUTOS OPÇÕES
ALTER TABLE commerce.produtos_opcoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to produtos_opcoes"
  ON commerce.produtos_opcoes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PRODUTOS CAMPOS OPÇÕES
ALTER TABLE commerce.produtos_campos_opcoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to produtos_campos_opcoes"
  ON commerce.produtos_campos_opcoes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public read active produtos_campos_opcoes"
  ON commerce.produtos_campos_opcoes FOR SELECT
  USING (ativo = true);

-- TIPOS CAMPO PEDIDO
ALTER TABLE commerce.tipos_campo_pedido ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to tipos_campo_pedido"
  ON commerce.tipos_campo_pedido FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public read active tipos_campo_pedido"
  ON commerce.tipos_campo_pedido FOR SELECT
  USING (ativo = true);

-- ============================================================================
-- FINANCE TABLES RLS
-- ============================================================================

-- SOLICITAÇÕES SAQUE CD
ALTER TABLE finance.solicitacoes_saque_cd ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to solicitacoes_saque_cd"
  ON finance.solicitacoes_saque_cd FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- SYSTEM TABLES RLS
-- ============================================================================

-- ESTADOS CIVIL
ALTER TABLE location.estados_civil ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read estados_civil"
  ON location.estados_civil FOR SELECT
  USING (true);

CREATE POLICY "Service role full access to estados_civil"
  ON location.estados_civil FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- FABRICANTES
ALTER TABLE system.fabricantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active fabricantes"
  ON system.fabricantes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to fabricantes"
  ON system.fabricantes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- LINGUAGENS
ALTER TABLE system.linguagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active linguagens"
  ON system.linguagens FOR SELECT
  USING (status = 1);

CREATE POLICY "Service role full access to linguagens"
  ON system.linguagens FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- LOJAS
ALTER TABLE system.lojas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active lojas"
  ON system.lojas FOR SELECT
  USING (status = 1);

CREATE POLICY "Service role full access to lojas"
  ON system.lojas FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- TIPOS PESSOA
ALTER TABLE system.tipos_pessoa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active tipos_pessoa"
  ON system.tipos_pessoa FOR SELECT
  USING (ativo = true);

CREATE POLICY "Service role full access to tipos_pessoa"
  ON system.tipos_pessoa FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE schemaname IN ('mlm', 'commerce', 'finance', 'system', 'location')
ORDER BY schemaname, tablename, policyname;

COMMIT;
