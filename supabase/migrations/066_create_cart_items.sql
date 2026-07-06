-- ============================================================================
-- CREATE CART_ITEMS TABLE - ALLIN OS 2.0
-- Create cart_items table in commerce schema with RLS policies
-- ============================================================================

BEGIN;

-- ============================================================================
-- CREATE CART_ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS commerce.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES commerce.produtos(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON commerce.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON commerce.cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON commerce.cart_items(user_id, product_id);

-- ============================================================================
-- CREATE TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON commerce.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE commerce.cart_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Service role has full access
CREATE POLICY "Service role full access to cart_items"
  ON commerce.cart_items FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Authenticated users can view their own cart items
CREATE POLICY "Users can view own cart items"
  ON commerce.cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own cart items
CREATE POLICY "Users can insert own cart items"
  ON commerce.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own cart items
CREATE POLICY "Users can update own cart items"
  ON commerce.cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own cart items
CREATE POLICY "Users can delete own cart items"
  ON commerce.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT ON commerce.cart_items TO authenticated;
GRANT INSERT ON commerce.cart_items TO authenticated;
GRANT UPDATE ON commerce.cart_items TO authenticated;
GRANT DELETE ON commerce.cart_items TO authenticated;

GRANT ALL ON commerce.cart_items TO service_role;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'commerce' AND tablename = 'cart_items';

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE schemaname = 'commerce' AND tablename = 'cart_items'
ORDER BY policyname;

COMMIT;
