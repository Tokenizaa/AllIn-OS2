-- ============================================================================
-- ORDERS RECOVERY
-- ============================================================================
-- This migration adds order validation and automatic total calculation
-- ============================================================================

BEGIN;

-- ============================================================================
-- FIX 1: Add order status check constraint
-- ============================================================================
ALTER TABLE orders 
ADD CONSTRAINT chk_orders_valid_status 
CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- ============================================================================
-- FIX 2: Add order total positive constraint
-- ============================================================================
ALTER TABLE orders 
ADD CONSTRAINT chk_orders_total_positive 
CHECK (valor_total >= 0);

-- ============================================================================
-- FIX 3: Add order item quantity positive constraint
-- ============================================================================
ALTER TABLE order_items 
ADD CONSTRAINT chk_order_items_quantity_positive 
CHECK (quantity > 0);

-- ============================================================================
-- FIX 4: Add order item price positive constraint
-- ============================================================================
ALTER TABLE order_items 
ADD CONSTRAINT chk_order_items_price_positive 
CHECK (price >= 0);

-- ============================================================================
-- FIX 5: Create trigger to auto-calculate order item subtotal
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_order_item_subtotal()
RETURNS trigger AS $$
BEGIN
    NEW.subtotal = NEW.quantity * NEW.price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_items_subtotal_trigger ON order_items;
CREATE TRIGGER order_items_subtotal_trigger
    BEFORE INSERT OR UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION calculate_order_item_subtotal();

-- ============================================================================
-- FIX 6: Create trigger to auto-calculate order total
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS trigger AS $$
DECLARE
    total numeric;
BEGIN
    -- Calculate total from order items
    SELECT COALESCE(SUM(subtotal), 0) INTO total
    FROM order_items
    WHERE order_id = NEW.id;

    -- Update order total
    UPDATE orders
    SET valor_total = total,
        updated_at = now()
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_items_total_trigger ON order_items;
CREATE TRIGGER order_items_total_trigger
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

-- ============================================================================
-- FIX 7: Add order status transition validation
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_order_status_transition()
RETURNS trigger AS $$
BEGIN
    -- Validate status transitions
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
            RAISE EXCEPTION 'Cannot change status from cancelled';
        END IF;
        
        IF OLD.status = 'delivered' AND NEW.status NOT IN ('delivered', 'refunded') THEN
            RAISE EXCEPTION 'Cannot change status from delivered except to refunded';
        END IF;
        
        IF NEW.status = 'cancelled' AND OLD.status IN ('shipped', 'delivered') THEN
            RAISE EXCEPTION 'Cannot cancel shipped or delivered orders';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_status_transition_trigger ON orders;
CREATE TRIGGER orders_status_transition_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION validate_order_status_transition();

-- ============================================================================
-- FIX 8: Add order number uniqueness constraint
-- ============================================================================
ALTER TABLE orders 
ADD CONSTRAINT uniq_orders_numero_pedido 
UNIQUE (numero_pedido);

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check constraints
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name
FROM pg_constraint 
WHERE conrelid::regclass IN ('orders', 'order_items')
ORDER BY table_name, constraint_name;

-- Check triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_name LIKE '%order%'
ORDER BY event_object_table, trigger_name;
