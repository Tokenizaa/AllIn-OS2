-- ============================================================================
-- CUSTOMER360 RECOVERY
-- ============================================================================
-- This migration creates missing tables for customer_360_view and fixes issues
-- ============================================================================

BEGIN;

-- ============================================================================
-- CREATE CUSTOMER NETWORK METRICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_network_metrics (
    customer_id uuid PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    total_network_size integer DEFAULT 0,
    active_network_size integer DEFAULT 0,
    network_revenue numeric(12,2) DEFAULT 0,
    binary_left_count integer DEFAULT 0,
    binary_right_count integer DEFAULT 0,
    binary_balance numeric(12,2) DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_network_metrics_customer_id ON customer_network_metrics(customer_id);

-- ============================================================================
-- CREATE CUSTOMER METRICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_metrics (
    customer_id uuid PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    ltv numeric(12,2) DEFAULT 0,
    frequencia_compra numeric(10,2) DEFAULT 0,
    dias_desde_ultima_compra integer DEFAULT 0,
    total_pedidos integer DEFAULT 0,
    ticket_medio numeric(10,2) DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_metrics_customer_id ON customer_metrics(customer_id);

-- ============================================================================
-- CREATE CUSTOMER SCORES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_scores (
    customer_id uuid PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    engagement_score numeric(5,2) DEFAULT 0,
    churn_score numeric(5,2) DEFAULT 0,
    loyalty_score numeric(5,2) DEFAULT 0,
    activity_score numeric(5,2) DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_scores_customer_id ON customer_scores(customer_id);

-- ============================================================================
-- FIX CUSTOMER_360_VIEW DUPLICATE ALIAS
-- ============================================================================
DROP VIEW IF EXISTS customer_360_view CASCADE;

CREATE VIEW customer_360_view AS
SELECT
    c.id,
    c.nome_completo,
    c.email,
    c.cpf,
    c.telefone,
    c.endereco,
    c.cidade,
    c.estado,
    c.cep,
    c.qualification,
    c.status,
    c.created_at AS data_cadastro,
    c.activation_date AS data_ativacao,
    
    -- Plan information
    c.plan_id,
    pl.name AS plan_name,
    pl.slug AS plan_slug,
    pl.price AS plan_price,
    pl.is_affiliate AS plan_is_affiliate,
    pl.max_generations AS plan_max_generations,
    pl.direct_bonus_percentage AS plan_direct_bonus,
    cp.status AS plan_status,
    cp.activated_at AS plan_activated_at,
    cp.expires_at AS plan_expires_at,
    
    -- Order metrics
    COALESCE(o.order_count, 0) AS total_pedidos,
    COALESCE(o.total_spent, 0) AS total_gasto,
    COALESCE(o.last_order_date, NULL) AS ultimo_pedido,
    
    -- Payment metrics
    COALESCE(p.total_paid, 0) AS total_pago,
    COALESCE(p.payment_count, 0) AS total_pagamentos,
    
    -- Shipment metrics
    COALESCE(s.shipment_count, 0) AS total_envios,
    COALESCE(s.last_shipment_date, NULL) AS ultimo_envio,
    
    -- Network metrics
    cnm.total_network_size AS total_downlines,
    cnm.active_network_size AS active_downlines,
    cnm.network_revenue,
    
    -- AI metrics
    cm.ltv,
    cm.frequencia_compra AS frequency,
    cm.dias_desde_ultima_compra AS recency,
    cs.engagement_score AS ai_score,
    cs.churn_score AS risk_level,
    
    -- Product affinities (from customer_plans, not metrics)
    cp.categoria_favorita AS top_category,
    cp.produto_favorito AS top_product_id
    
FROM customers c
LEFT JOIN plans pl ON c.plan_id = pl.id
LEFT JOIN (
    SELECT DISTINCT ON (customer_id) 
        customer_id,
        plan_id,
        status,
        activated_at,
        expires_at,
        categoria_favorita,
        produto_favorito
    FROM customer_plans
    ORDER BY customer_id, activated_at DESC
) cp ON c.id = cp.customer_id
LEFT JOIN (
    SELECT 
        orders.customer_id,
        COUNT(*) AS order_count,
        SUM(orders.valor_total_pedido) AS total_spent,
        MAX(orders.data_criacao) AS last_order_date
    FROM orders
    GROUP BY orders.customer_id
) o ON c.id = o.customer_id
LEFT JOIN (
    SELECT 
        payments.customer_id,
        COUNT(*) AS payment_count,
        SUM(payments.amount) AS total_paid
    FROM payments
    WHERE payments.status = 'succeeded'
    GROUP BY payments.customer_id
) p ON c.id = p.customer_id
LEFT JOIN (
    SELECT 
        orders.customer_id,
        COUNT(*) AS shipment_count,
        MAX(shipments.shipped_at) AS last_shipment_date
    FROM shipments
    JOIN orders ON shipments.order_id = orders.id
    GROUP BY orders.customer_id
) s ON c.id = s.customer_id
LEFT JOIN customer_network_metrics cnm ON c.id = cnm.customer_id
LEFT JOIN customer_metrics cm ON c.id = cm.customer_id
LEFT JOIN customer_scores cs ON c.id = cs.customer_id;

-- ============================================================================
-- CREATE FUNCTION TO UPDATE CUSTOMER METRICS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_customer_metrics(customer_id uuid)
RETURNS void AS $$
BEGIN
    -- Update customer_metrics from orders
    INSERT INTO customer_metrics (customer_id, ltv, total_pedidos, ticket_medio, dias_desde_ultima_compra)
    SELECT 
        o.customer_id,
        COALESCE(SUM(o.valor_total_pedido), 0) AS ltv,
        COUNT(*) AS total_pedidos,
        COALESCE(AVG(o.valor_total_pedido), 0) AS ticket_medio,
        EXTRACT(DAY FROM (NOW() - MAX(o.data_criacao)))::integer AS dias_desde_ultima_compra
    FROM orders o
    WHERE o.customer_id = $1
    GROUP BY o.customer_id
    ON CONFLICT (customer_id) DO UPDATE SET
        ltv = EXCLUDED.ltv,
        total_pedidos = EXCLUDED.total_pedidos,
        ticket_medio = EXCLUDED.ticket_medio,
        dias_desde_ultima_compra = EXCLUDED.dias_desde_ultima_compra,
        updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CREATE TRIGGER TO AUTO-UPDATE METRICS ON ORDER CHANGE
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_update_customer_metrics()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM update_customer_metrics(NEW.customer_id);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM update_customer_metrics(NEW.customer_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_customer_metrics(OLD.customer_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_customer_metrics_trigger ON orders;
CREATE TRIGGER orders_customer_metrics_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION trigger_update_customer_metrics();

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('public.' || tablename)) as size
FROM pg_tables 
WHERE tablename IN ('customer_network_metrics', 'customer_metrics', 'customer_scores')
ORDER BY tablename;

SELECT 
    viewname,
    definition
FROM pg_views 
WHERE viewname = 'customer_360_view';
