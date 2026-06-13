-- ============================================================================
-- RLS POLICIES - ALLIN OS 2.0
-- Políticas de segurança Row Level Security
-- ============================================================================

BEGIN;

-- ============================================================================
-- CUSTOMERS RLS
-- ============================================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "Service role full access to customers"
  ON customers FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- DISTRIBUIDORES RLS
-- ============================================================================
ALTER TABLE distribuidores ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "Service role full access to distribuidores"
  ON distribuidores FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PRODUTOS RLS
-- ============================================================================
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Leitura pública para produtos visíveis
CREATE POLICY "Public read visible products"
  ON produtos FOR SELECT
  USING (e_visivel = true);

-- Service role tem acesso total
CREATE POLICY "Service role full access to produtos"
  ON produtos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PEDIDOS RLS
-- ============================================================================
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "Service role full access to pedidos"
  ON pedidos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PEDIDOS ITENS RLS
-- ============================================================================
ALTER TABLE pedidos_itens ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "Service role full access to pedidos_itens"
  ON pedidos_itens FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PEDIDOS PAGAMENTOS RLS
-- ============================================================================
ALTER TABLE pedidos_pagamentos ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "Service role full access to pedidos_pagamentos"
  ON pedidos_pagamentos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- SOLICITAÇÕES SAQUE RLS
-- ============================================================================
ALTER TABLE solicitacoes_saque ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "Service role full access to solicitacoes_saque"
  ON solicitacoes_saque FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- REDE LINEAR NÓS RLS
-- ============================================================================
ALTER TABLE rede_linear_nos ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total
CREATE POLICY "Service role full access to rede_linear_nos"
  ON rede_linear_nos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- FORMAS PAGAMENTO RLS
-- ============================================================================
ALTER TABLE formas_pagamento ENABLE ROW LEVEL SECURITY;

-- Leitura pública para formas de pagamento ativas
CREATE POLICY "Public read active payment methods"
  ON formas_pagamento FOR SELECT
  USING (is_active = true);

-- Service role tem acesso total
CREATE POLICY "Service role full access to formas_pagamento"
  ON formas_pagamento FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PRODUTOS CATEGORIAS RLS
-- ============================================================================
ALTER TABLE produtos_categorias ENABLE ROW LEVEL SECURITY;

-- Leitura pública para categorias ativas
CREATE POLICY "Public read active product categories"
  ON produtos_categorias FOR SELECT
  USING (status = 'active');

-- Service role tem acesso total
CREATE POLICY "Service role full access to produtos_categorias"
  ON produtos_categorias FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- LOCALIZAÇÃO RLS (Leitura pública)
-- ============================================================================
ALTER TABLE paises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read paises"
  ON paises FOR SELECT
  USING (true);

ALTER TABLE estados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read estados"
  ON estados FOR SELECT
  USING (true);

ALTER TABLE cidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cidades"
  ON cidades FOR SELECT
  USING (true);

ALTER TABLE cep ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cep"
  ON cep FOR SELECT
  USING (true);

COMMIT;

-- Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
