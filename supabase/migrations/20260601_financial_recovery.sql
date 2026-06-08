-- ============================================================================
-- FINANCIAL RECOVERY
-- ============================================================================
-- This migration adds financial safeguards and audit trails
-- ============================================================================

BEGIN;

-- ============================================================================
-- FIX 1: Add minimum withdrawal amount constraint
-- ============================================================================
ALTER TABLE withdrawals 
ADD CONSTRAINT chk_withdrawals_minimum_amount 
CHECK (valor >= 10.00);

-- ============================================================================
-- FIX 2: Add daily withdrawal limit check function
-- ============================================================================
CREATE OR REPLACE FUNCTION check_daily_withdrawal_limit(user_id uuid, withdrawal_amount numeric)
RETURNS boolean AS $$
DECLARE
    daily_total numeric;
    daily_limit numeric := 5000.00; -- R$ 5.000 daily limit
BEGIN
    -- Calculate total withdrawals today
    SELECT COALESCE(SUM(valor), 0) INTO daily_total
    FROM withdrawals
    WHERE user_id = $1
    AND DATE(created_at) = CURRENT_DATE
    AND status IN ('pending', 'approved');
    
    -- Check if adding this withdrawal would exceed limit
    RETURN (daily_total + withdrawal_amount) <= daily_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FIX 3: Add wallet transaction audit trigger
-- ============================================================================
CREATE TABLE IF NOT EXISTS wallet_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    balance_before numeric(12,2) NOT NULL,
    balance_after numeric(12,2) NOT NULL,
    change_amount numeric(12,2) NOT NULL,
    change_type text NOT NULL,
    reference_type text,
    reference_id text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallet_audit_log_wallet_id ON wallet_audit_log(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_audit_log_created_at ON wallet_audit_log(created_at);

-- ============================================================================
-- FIX 4: Create trigger to log wallet balance changes
-- ============================================================================
CREATE OR REPLACE FUNCTION log_wallet_balance_change()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF OLD.balance IS DISTINCT FROM NEW.balance OR 
           OLD.available_balance IS DISTINCT FROM NEW.available_balance THEN
            INSERT INTO wallet_audit_log (
                wallet_id,
                balance_before,
                balance_after,
                change_amount,
                change_type,
                reference_type,
                reference_id
            ) VALUES (
                NEW.id,
                COALESCE(OLD.balance, 0),
                COALESCE(NEW.balance, 0),
                COALESCE(NEW.balance, 0) - COALESCE(OLD.balance, 0),
                CASE 
                    WHEN NEW.balance > OLD.balance THEN 'credit'
                    WHEN NEW.balance < OLD.balance THEN 'debit'
                    ELSE 'adjustment'
                END,
                'balance_update',
                NEW.id::text
            );
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wallets_audit_trigger ON wallets;
CREATE TRIGGER wallets_audit_trigger
    AFTER UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION log_wallet_balance_change();

-- ============================================================================
-- FIX 5: Add commission uniqueness constraint
-- ============================================================================
ALTER TABLE commissions 
ADD CONSTRAINT uniq_commission_order_customer 
UNIQUE (order_id, customer_id, commission_type);

-- ============================================================================
-- FIX 6: Add commission status check constraint
-- ============================================================================
ALTER TABLE commissions 
ADD CONSTRAINT chk_commissions_valid_status 
CHECK (status IN ('pending', 'approved', 'paid', 'rejected', 'cancelled'));

-- ============================================================================
-- FIX 7: Add wallet transaction audit for withdrawals
-- ============================================================================
CREATE OR REPLACE FUNCTION log_withdrawal_transaction()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Log the withdrawal as a wallet transaction
        INSERT INTO wallet_transactions (
            wallet_id,
            transaction_type,
            amount,
            balance_before,
            balance_after,
            description,
            reference_type,
            reference_id
        ) VALUES (
            NEW.wallet_id,
            'withdrawal',
            -NEW.valor,
            (SELECT balance FROM wallets WHERE id = NEW.wallet_id),
            (SELECT balance - NEW.valor FROM wallets WHERE id = NEW.wallet_id),
            'Saque solicitado: ' || NEW.id::text,
            'withdrawal',
            NEW.id::text
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status AND NEW.status = 'approved' THEN
            -- Log approved withdrawal
            INSERT INTO wallet_transactions (
                wallet_id,
                transaction_type,
                amount,
                balance_before,
                balance_after,
                description,
                reference_type,
                reference_id
            ) VALUES (
                NEW.wallet_id,
                'withdrawal_approved',
                -NEW.valor,
                (SELECT available_balance FROM wallets WHERE id = NEW.wallet_id),
                (SELECT available_balance - NEW.valor FROM wallets WHERE id = NEW.wallet_id),
                'Saque aprovado: ' || NEW.id::text,
                'withdrawal',
                NEW.id::text
            );
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS withdrawals_audit_trigger ON withdrawals;
CREATE TRIGGER withdrawals_audit_trigger
    AFTER INSERT OR UPDATE ON withdrawals
    FOR EACH ROW EXECUTE FUNCTION log_withdrawal_transaction();

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check constraints
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name
FROM pg_constraint 
WHERE conrelid::regclass IN ('wallets', 'withdrawals', 'commissions')
ORDER BY table_name, constraint_name;

-- Check functions
SELECT 
    proname AS function_name,
    pg_get_functiondef(oid) AS definition
FROM pg_proc 
WHERE proname IN ('check_daily_withdrawal_limit', 'log_wallet_balance_change', 'log_withdrawal_transaction');
