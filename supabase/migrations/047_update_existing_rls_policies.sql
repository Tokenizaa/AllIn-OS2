-- ============================================================================
-- UPDATE EXISTING RLS POLICIES - ALLIN OS 2.0
-- Atualiza RLS policies existentes para os novos schemas
-- ============================================================================

BEGIN;

-- ============================================================================
-- DROP POLICIES ANTIGAS (PUBLIC SCHEMA)
-- ============================================================================

-- CUSTOMERS
DROP POLICY IF EXISTS "Service role full access to customers" ON crm.customers;
DROP POLICY IF EXISTS "Public read customers" ON crm.customers;

-- DISTRIBUIDORES
DROP POLICY IF EXISTS "Service role full access to distribuidores" ON mlm.distribuidores;

-- PRODUTOS
DROP POLICY IF EXISTS "Public read visible products" ON commerce.produtos;
DROP POLICY IF EXISTS "Service role full access to produtos" ON commerce.produtos;

-- PEDIDOS
DROP POLICY IF EXISTS "Service role full access to pedidos" ON commerce.pedidos;

-- PEDIDOS ITENS
DROP POLICY IF EXISTS "Service role full access to pedidos_itens" ON commerce.pedidos_itens;

-- PEDIDOS PAGAMENTOS
DROP POLICY IF EXISTS "Service role full access to pedidos_pagamentos" ON commerce.pedidos_pagamentos;

-- SOLICITAÇÕES SAQUE
DROP POLICY IF EXISTS "Service role full access to solicitacoes_saque" ON finance.solicitacoes_saque;

-- REDE LINEAR NÓS
DROP POLICY IF EXISTS "Service role full access to rede_linear_nos" ON mlm.rede_linear_nos;

-- FORMAS PAGAMENTO
DROP POLICY IF EXISTS "Public read active payment methods" ON commerce.formas_pagamento;
DROP POLICY IF EXISTS "Service role full access to formas_pagamento" ON commerce.formas_pagamento;

-- PRODUTOS CATEGORIAS
DROP POLICY IF EXISTS "Public read active product categories" ON commerce.produtos_categorias;
DROP POLICY IF EXISTS "Service role full access to produtos_categorias" ON commerce.produtos_categorias;

-- LOCALIZAÇÃO
DROP POLICY IF EXISTS "Public read paises" ON location.paises;
DROP POLICY IF EXISTS "Public read estados" ON location.estados;
DROP POLICY IF EXISTS "Public read cidades" ON location.cidades;
DROP POLICY IF EXISTS "Public read cep" ON location.cep;

-- ============================================================================
-- RECREATE POLICIES COM NOVOS SCHEMAS
-- ============================================================================

-- CUSTOMERS RLS
CREATE POLICY "Service role full access to customers"
  ON crm.customers FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- DISTRIBUIDORES RLS
CREATE POLICY "Service role full access to distribuidores"
  ON mlm.distribuidores FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PRODUTOS RLS
CREATE POLICY "Public read visible products"
  ON commerce.produtos FOR SELECT
  USING (e_visivel = true);

CREATE POLICY "Service role full access to produtos"
  ON commerce.produtos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PEDIDOS RLS
CREATE POLICY "Service role full access to pedidos"
  ON commerce.pedidos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PEDIDOS ITENS RLS
CREATE POLICY "Service role full access to pedidos_itens"
  ON commerce.pedidos_itens FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PEDIDOS PAGAMENTOS RLS
CREATE POLICY "Service role full access to pedidos_pagamentos"
  ON commerce.pedidos_pagamentos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- SOLICITAÇÕES SAQUE RLS
CREATE POLICY "Service role full access to solicitacoes_saque"
  ON finance.solicitacoes_saque FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- REDE LINEAR NÓS RLS
CREATE POLICY "Service role full access to rede_linear_nos"
  ON mlm.rede_linear_nos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- FORMAS PAGAMENTO RLS
CREATE POLICY "Public read active payment methods"
  ON commerce.formas_pagamento FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to formas_pagamento"
  ON commerce.formas_pagamento FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- PRODUTOS CATEGORIAS RLS
CREATE POLICY "Public read active product categories"
  ON commerce.produtos_categorias FOR SELECT
  USING (status = 'active');

CREATE POLICY "Service role full access to produtos_categorias"
  ON commerce.produtos_categorias FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- LOCALIZAÇÃO RLS (Leitura pública)
CREATE POLICY "Public read paises"
  ON location.paises FOR SELECT
  USING (true);

CREATE POLICY "Public read estados"
  ON location.estados FOR SELECT
  USING (true);

CREATE POLICY "Public read cidades"
  ON location.cidades FOR SELECT
  USING (true);

CREATE POLICY "Public read cep"
  ON location.cep FOR SELECT
  USING (true);

-- ============================================================================
-- VERIFICAR POLÍTICAS ATUALIZADAS
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE schemaname IN ('crm', 'mlm', 'commerce', 'finance', 'location')
ORDER BY schemaname, tablename, policyname;

COMMIT;
