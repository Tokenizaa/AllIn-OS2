-- ============================================================================
-- FASE 1 (MVP) — DUAL-KEY DOMAIN REFACTOR - ALLIN OS 2.0
-- Estratégia: customer_id (uuid) = chave canônica INTERNA;
--             id_comprador (text) / allin_id (integer) = ponte LEGADA (não removidas).
-- Ref: docs/IDENTITY_MIGRATION_MASTER_PLAN.md
-- Tudo aditivo: nenhuma coluna legada é dropada. Rollback = DROP das novas estruturas.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Garantir índices de resolução para as chaves legadas (sem quebra)
-- ============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_id_comprador
  ON crm.customers (id_comprador) WHERE id_comprador IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_customers_allin_id
  ON crm.customers (allin_id);

-- ============================================================================
-- 2. crm.customer_profiles — contexto de CLIENTE FINAL (apenas esse BC)
-- ============================================================================
CREATE TABLE IF NOT EXISTS crm.customer_profiles (
  customer_id       uuid PRIMARY KEY REFERENCES crm.customers (id) ON DELETE CASCADE,
  aceita_marketing  boolean DEFAULT false,
  origem            text,
  segmento          text,
  ultima_compra     timestamptz,
  ticket_medio      numeric(12,2),
  nivel             text,
  score             numeric(8,2),
  lifetime_value    numeric(12,2),
  observacoes       text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- RLS espelhando o padrão de crm.customers (dono por auth_user_id + service_role full)
ALTER TABLE crm.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all customer_profiles"
  ON crm.customer_profiles FOR SELECT
  USING (is_admin() OR auth.uid() = (SELECT c.auth_user_id FROM crm.customers c WHERE c.id = customer_profiles.customer_id));

CREATE POLICY "Users can update own customer_profiles"
  ON crm.customer_profiles FOR UPDATE
  USING ((auth.uid() = (SELECT c.auth_user_id FROM crm.customers c WHERE c.id = customer_profiles.customer_id)) OR (auth.role() = 'service_role'::text))
  WITH CHECK ((auth.uid() = (SELECT c.auth_user_id FROM crm.customers c WHERE c.id = customer_profiles.customer_id)) OR (auth.role() = 'service_role'::text));

CREATE POLICY "Service role full access to customer_profiles"
  ON crm.customer_profiles FOR ALL
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- ============================================================================
-- 3. mlm.distribuidores — adicionar customer_id (uuid) como FK canônica interna
--    (patrocinador_id/perna_* text e allin_id permanecem como ponte legada)
-- ============================================================================
ALTER TABLE mlm.distribuidores
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES crm.customers (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_distribuidores_customer_id
  ON mlm.distribuidores (customer_id);

-- ============================================================================
-- 4. Backfill de customer_id a partir da ponte allin_id (apenas matches únicos)
-- ============================================================================
UPDATE mlm.distribuidores d
SET customer_id = c.id
FROM (
  SELECT allin_id, MIN(id::text)::uuid AS id
  FROM crm.customers
  WHERE allin_id IS NOT NULL
  GROUP BY allin_id
  HAVING COUNT(*) = 1
) c
WHERE d.customer_id IS NULL
  AND d.allin_id IS NOT NULL
  AND d.allin_id = c.allin_id;

COMMIT;
