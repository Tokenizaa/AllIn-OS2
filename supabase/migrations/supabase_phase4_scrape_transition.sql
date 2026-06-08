-- FASE 13 Phase 4: Scrape Transition
-- This file contains the SQL migrations for Phase 4 of FASE 13

-- Migration 1: Create customer_360_view referencing customers (scraped data)
DROP VIEW IF EXISTS customer_360_view;

CREATE VIEW customer_360_view AS
SELECT 
    c.id,
    c.nome_completo as nome,
    c.email,
    c.cpf,
    c.telefone,
    c.status,
    c.customer_type,
    c.sponsor_id,
    c.created_at,
    c.updated_at,
    w.balance as wallet_balance,
    w.available_balance as wallet_available_balance,
    w.frozen_balance as wallet_frozen_balance,
    bw.balance as bonus_wallet_balance,
    bw.available_balance as bonus_wallet_available_balance,
    cm.total_gasto,
    cm.ticket_medio,
    cm.ltv,
    cm.total_pedidos as numero_pedidos,
    cm.ultima_compra as ultimo_pedido,
    cs.churn_score,
    cs.engagement_score,
    cs.recompra_score,
    cs.ativacao_score,
    cs.upgrade_score,
    cs.influencia_score,
    cs.rede_score,
    cq.qualification_id,
    cq.qualification_name,
    cq.status as qualification_status,
    cq.achieved_at as qualification_achieved_at
FROM customers c
LEFT JOIN wallets w ON w.customer_id = c.id
LEFT JOIN bonus_wallets bw ON bw.customer_id = c.id
LEFT JOIN customer_metrics cm ON cm.customer_id = c.id
LEFT JOIN customer_scores cs ON cs.customer_id = c.id
LEFT JOIN customer_qualifications cq ON cq.customer_id = c.id AND cq.status = 'active';

-- Migration 2: Create network_tree_view referencing customers (scraped data)
DROP VIEW IF EXISTS network_tree_view;

CREATE VIEW network_tree_view AS
WITH RECURSIVE network_tree AS (
    -- Base case: root customers (no sponsor)
    SELECT 
        c.id,
        c.nome_completo as nome,
        c.sponsor_id,
        0 as level,
        ARRAY[c.id] as path
    FROM customers c
    WHERE c.sponsor_id IS NULL
    
    UNION ALL
    
    -- Recursive case: children
    SELECT 
        c.id,
        c.nome_completo as nome,
        c.sponsor_id,
        nt.level + 1,
        nt.path || c.id
    FROM customers c
    INNER JOIN network_tree nt ON nt.id = c.sponsor_id
)
SELECT 
    nt.id,
    nt.nome,
    nt.sponsor_id,
    nt.level,
    nt.path,
    c.customer_type,
    c.status,
    c.qualification,
    c.total_compras,
    c.numero_pedidos,
    cm.volume_rede,
    cm.receita_rede,
    cm.total_indicados,
    cm.indicados_ativos
FROM network_tree nt
LEFT JOIN customers c ON c.id = nt.id
LEFT JOIN customer_metrics cm ON cm.customer_id = c.id
ORDER BY nt.path;

-- Note: Analytics recalculation skipped due to insufficient scraped data
-- Scrape is still in progress (28 customers vs 1,631 in customers_backup)
-- Analytics should be recalculated after scrape is complete using the scheduled job
