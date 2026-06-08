-- ============================================================================
-- DATABASE RECOVERY FIXES
-- ============================================================================
-- This migration applies fixes identified in FASE 14 Full Stack Recovery Audit
-- ============================================================================

BEGIN;

-- ============================================================================
-- FIX 1: Add CHECK constraint to wallets to prevent negative balance
-- ============================================================================
ALTER TABLE wallets 
ADD CONSTRAINT chk_wallets_available_balance_non_negative 
CHECK (available_balance >= 0);

-- ============================================================================
-- FIX 2: Add indexes to commissions table for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_commissions_customer_id ON commissions(customer_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);

-- ============================================================================
-- FIX 3: Add foreign key for customers.sponsor_id
-- ============================================================================
-- First, check if the column exists and add it if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'sponsor_id'
    ) THEN
        ALTER TABLE customers ADD COLUMN sponsor_id uuid;
    END IF;
END $$;

-- Add foreign key constraint
ALTER TABLE customers 
ADD CONSTRAINT fk_customers_sponsor_id 
FOREIGN KEY (sponsor_id) REFERENCES customers(id) 
ON DELETE SET NULL;

-- ============================================================================
-- FIX 4: Create standardized orders view with normalized field names
-- ============================================================================
DROP VIEW IF EXISTS orders_normalized_view CASCADE;

CREATE VIEW orders_normalized_view AS
SELECT
    o.id,
    o.numero_pedido,
    o.customer_id,
    o.comprador,
    o.usuario,
    o.user_id,
    
    -- Normalized status field
    COALESCE(o.status_pedido, o.status) AS status,
    
    -- Normalized total field
    COALESCE(o.valor_total_pedido, o.valor_total) AS valor_total,
    
    -- Payment information
    o.forma_pagamento,
    o.pedido_pago,
    o.data_criacao_pedido AS data_criacao,
    o.data_pagamento_pedido AS data_pagamento,
    
    -- Additional fields
    o.informacoes_produtos,
    o.pagamentos,
    o.loja,
    o.purchase_type AS tipo_compra,
    
    -- Timestamps
    o.created_at,
    o.updated_at
FROM orders o;

-- ============================================================================
-- FIX 5: Add missing tables for marketing and upgrade suggestions
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaigns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'draft',
    links_count integer DEFAULT 0,
    communications_sent integer DEFAULT 0,
    banners_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS upgrade_suggestions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    title text NOT NULL,
    description text,
    action text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'active',
    config jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- FIX 6: Add missing columns to customers for commission calculation
-- ============================================================================
-- The plan_id column is already added in 08-create-plans-tables.sql
-- This migration ensures it exists for backward compatibility
ALTER TABLE customers ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES plans(id) ON DELETE SET NULL;

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check constraints
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name
FROM pg_constraint 
WHERE conrelid::regclass IN ('wallets', 'customers')
ORDER BY table_name, constraint_name;

-- Check indexes
SELECT 
    indexname,
    tablename
FROM pg_indexes 
WHERE tablename IN ('commissions', 'customers', 'wallets')
ORDER BY tablename, indexname;

-- Check views
SELECT 
    viewname,
    definition
FROM pg_views 
WHERE viewname IN ('orders_normalized_view', 'customer_360_view')
ORDER BY viewname;
