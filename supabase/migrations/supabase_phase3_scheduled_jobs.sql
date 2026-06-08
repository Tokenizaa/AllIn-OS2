-- FASE 13 Phase 3: Scheduled Jobs (pg_cron)
-- This file contains the SQL migrations for Phase 3 of FASE 13

-- Migration 1: Install pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Migration 2: Create bonus expiration job and function
CREATE OR REPLACE FUNCTION expire_old_bonuses()
RETURNS void AS $$
BEGIN
    -- Update bonus_wallets to expire bonuses that have passed their expiration date
    UPDATE bonus_wallets bw
    SET 
        available_balance = available_balance - 
            COALESCE(
                (SELECT COALESCE(SUM(amount), 0) 
                 FROM bonus_transactions bt 
                 WHERE bt.bonus_wallet_id = bw.id 
                 AND bt.transaction_type = 'earned'
                 AND bt.expires_at <= NOW()
                 AND bt.expires_at IS NOT NULL),
                0
            ),
        updated_at = NOW()
    WHERE EXISTS (
        SELECT 1 FROM bonus_transactions bt
        WHERE bt.bonus_wallet_id = bw.id
        AND bt.transaction_type = 'earned'
        AND bt.expires_at <= NOW()
        AND bt.expires_at IS NOT NULL
    );

    -- Create expiration transactions for expired bonuses
    INSERT INTO bonus_transactions (bonus_wallet_id, transaction_type, amount, balance_before, balance_after, description, expires_at, created_at, updated_at)
    SELECT 
        bt.bonus_wallet_id,
        'expired' as transaction_type,
        bt.amount,
        (SELECT available_balance FROM bonus_wallets WHERE id = bt.bonus_wallet_id) + bt.amount as balance_before,
        (SELECT available_balance FROM bonus_wallets WHERE id = bt.bonus_wallet_id) as balance_after,
        'Bonus expired' as description,
        bt.expires_at,
        NOW() as created_at,
        NOW() as updated_at
    FROM bonus_transactions bt
    WHERE bt.transaction_type = 'earned'
    AND bt.expires_at <= NOW()
    AND bt.expires_at IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM bonus_transactions bt2
        WHERE bt2.bonus_wallet_id = bt.bonus_wallet_id
        AND bt2.transaction_type = 'expired'
        AND bt2.reference_id = bt.id::text
    );
END;
$$ LANGUAGE plpgsql;

-- Schedule bonus expiration job (daily at 2 AM)
SELECT cron.schedule(
    'expire-old-bonuses',
    '0 2 * * *',
    'SELECT expire_old_bonuses();'
);

-- Migration 3: Create analytics update jobs and functions
CREATE OR REPLACE FUNCTION update_customer_metrics_sql(customer_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO customer_metrics (customer_id, total_gasto, ticket_medio, ltv, numero_pedidos, ultimo_pedido, updated_at)
    SELECT 
        o.customer_id,
        COALESCE(SUM(COALESCE(o.valor_total::numeric, 0)), 0) as total_gasto,
        COALESCE(AVG(COALESCE(o.valor_total::numeric, 0)), 0) as ticket_medio,
        COALESCE(SUM(COALESCE(o.valor_total::numeric, 0)), 0) as ltv,
        COUNT(o.id) as numero_pedidos,
        MAX(o.created_at) as ultimo_pedido,
        NOW() as updated_at
    FROM orders o
    WHERE o.customer_id = customer_id
    AND o.status_pedido = 'Concluído'
    GROUP BY o.customer_id
    ON CONFLICT (customer_id) DO UPDATE SET
        total_gasto = EXCLUDED.total_gasto,
        ticket_medio = EXCLUDED.ticket_medio,
        ltv = EXCLUDED.ltv,
        numero_pedidos = EXCLUDED.numero_pedidos,
        ultimo_pedido = EXCLUDED.ultimo_pedido,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_customer_scores_sql(customer_id UUID)
RETURNS void AS $$
DECLARE
    metrics RECORD;
    days_since_last_order INTEGER;
    churn_score INTEGER;
    engagement_score INTEGER;
    loyalty_score INTEGER;
BEGIN
    SELECT * INTO metrics FROM customer_metrics WHERE customer_id = customer_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    IF metrics.ultimo_pedido IS NOT NULL THEN
        days_since_last_order := EXTRACT(DAY FROM (NOW() - metrics.ultimo_pedido));
    ELSE
        days_since_last_order := 999;
    END IF;
    
    IF days_since_last_order > 90 THEN
        churn_score := 80;
    ELSIF days_since_last_order > 60 THEN
        churn_score := 60;
    ELSIF days_since_last_order > 30 THEN
        churn_score := 40;
    ELSIF days_since_last_order > 14 THEN
        churn_score := 20;
    ELSE
        churn_score := 10;
    END IF;
    
    IF metrics.numero_pedidos > 20 THEN
        engagement_score := 90;
    ELSIF metrics.numero_pedidos > 10 THEN
        engagement_score := 70;
    ELSIF metrics.numero_pedidos > 5 THEN
        engagement_score := 50;
    ELSIF metrics.numero_pedidos > 1 THEN
        engagement_score := 30;
    ELSE
        engagement_score := 10;
    END IF;
    
    IF metrics.ltv > 10000 THEN
        loyalty_score := 90;
    ELSIF metrics.ltv > 5000 THEN
        loyalty_score := 70;
    ELSIF metrics.ltv > 2000 THEN
        loyalty_score := 50;
    ELSIF metrics.ltv > 500 THEN
        loyalty_score := 30;
    ELSE
        loyalty_score := 10;
    END IF;
    
    INSERT INTO customer_scores (customer_id, churn_score, engagement_score, loyalty_score, updated_at)
    VALUES (customer_id, churn_score, engagement_score, loyalty_score, NOW())
    ON CONFLICT (customer_id) DO UPDATE SET
        churn_score = EXCLUDED.churn_score,
        engagement_score = EXCLUDED.engagement_score,
        loyalty_score = EXCLUDED.loyalty_score,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_all_metrics_sql()
RETURNS void AS $$
DECLARE
    customer_record RECORD;
BEGIN
    FOR customer_record IN SELECT id FROM customers LOOP
        PERFORM update_customer_metrics_sql(customer_record.id);
        PERFORM update_customer_scores_sql(customer_record.id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule analytics update job (daily at 3 AM)
SELECT cron.schedule(
    'update-all-metrics',
    '0 3 * * *',
    'SELECT update_all_metrics_sql();'
);

-- Migration 4: Create qualification update jobs and functions
CREATE OR REPLACE FUNCTION check_qualification_upgrade_sql(customer_id UUID)
RETURNS void AS $$
DECLARE
    current_level TEXT;
    metrics RECORD;
    team_volume NUMERIC;
    active_downlines INTEGER;
    new_qualification TEXT;
BEGIN
    SELECT qualification_id INTO current_level
    FROM customer_qualifications
    WHERE customer_id = customer_id AND status = 'active';
    
    IF current_level IS NULL THEN
        current_level := 'none';
    END IF;
    
    SELECT * INTO metrics FROM customer_metrics WHERE customer_id = customer_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    SELECT COALESCE(SUM(COALESCE(cm.total_gasto::numeric, 0)), 0) INTO team_volume
    FROM customers c
    LEFT JOIN customer_metrics cm ON cm.customer_id = c.id
    WHERE c.sponsor_id = customer_id;
    
    SELECT COUNT(*) INTO active_downlines
    FROM customers
    WHERE sponsor_id = customer_id AND status = 'active';
    
    new_qualification := current_level;
    
    IF metrics.total_gasto >= 10000 AND team_volume >= 100000 AND active_downlines >= 30 THEN
        new_qualification := 'diamond';
    ELSIF metrics.total_gasto >= 5000 AND team_volume >= 50000 AND active_downlines >= 20 THEN
        new_qualification := 'platinum';
    ELSIF metrics.total_gasto >= 2000 AND team_volume >= 15000 AND active_downlines >= 10 THEN
        new_qualification := 'gold';
    ELSIF metrics.total_gasto >= 1000 AND team_volume >= 5000 AND active_downlines >= 5 THEN
        new_qualification := 'silver';
    ELSIF metrics.total_gasto >= 500 AND team_volume >= 1000 AND active_downlines >= 2 THEN
        new_qualification := 'bronze';
    END IF;
    
    IF new_qualification != current_level THEN
        UPDATE customer_qualifications
        SET status = 'inactive', updated_at = NOW()
        WHERE customer_id = customer_id AND status = 'active';
        
        INSERT INTO customer_qualifications (customer_id, qualification_id, qualification_name, status, achieved_at, updated_at)
        VALUES (
            customer_id,
            new_qualification,
            CASE new_qualification
                WHEN 'bronze' THEN 'Bronze'
                WHEN 'silver' THEN 'Prata'
                WHEN 'gold' THEN 'Ouro'
                WHEN 'platinum' THEN 'Platina'
                WHEN 'diamond' THEN 'Diamante'
                ELSE 'Sem Qualificação'
            END,
            'active',
            NOW(),
            NOW()
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_qualifications_sql()
RETURNS void AS $$
DECLARE
    customer_record RECORD;
BEGIN
    FOR customer_record IN SELECT id FROM customers LOOP
        PERFORM check_qualification_upgrade_sql(customer_record.id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule qualification update job (daily at 4 AM)
SELECT cron.schedule(
    'process-qualifications',
    '0 4 * * *',
    'SELECT process_qualifications_sql();'
);
