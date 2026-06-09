-- FASE 16 - VALIDAÇÃO DE CHAVES DE NEGÓCIO
-- Data: 8 de Junho de 2026
-- Objetivo: Validar relacionamentos reais através de chaves de negócio legadas

-- ============================================
-- TESTE 1: customers.id_comprador ↔ orders.id_comprador
-- ============================================
SELECT 
    'Teste 1: customers.id_comprador ↔ orders.id_comprador' as teste,
    COUNT(DISTINCT c.id_comprador) as customers_com_id_comprador,
    COUNT(DISTINCT o.id_comprador) as orders_com_id_comprador,
    COUNT(DISTINCT CASE WHEN c.id_comprador IS NOT NULL THEN c.id_comprador END) as customers_com_id_comprador_preenchido,
    COUNT(DISTINCT CASE WHEN o.id_comprador IS NOT NULL THEN o.id_comprador END) as orders_com_id_comprador_preenchido,
    COUNT(DISTINCT CASE WHEN c.id_comprador = o.id_comprador THEN c.id_comprador END) as matches
FROM customers c
FULL OUTER JOIN orders o ON c.id_comprador = o.id_comprador;

-- ============================================
-- TESTE 2: customers.email ↔ distribuidores.email
-- ============================================
SELECT 
    'Teste 2: customers.email ↔ distribuidores.email' as teste,
    COUNT(DISTINCT c.email) as customers_com_email,
    COUNT(DISTINCT d.email) as distribuidores_com_email,
    COUNT(DISTINCT CASE WHEN c.email = d.email THEN c.email END) as matches
FROM customers c
FULL OUTER JOIN distribuidores d ON c.email = d.email
WHERE c.email IS NOT NULL AND d.email IS NOT NULL;

-- ============================================
-- TESTE 3: orders.numero_pedido ↔ payments (qual campo conecta?)
-- ============================================
-- Testar se payments tem numero_pedido
SELECT 
    'Teste 3a: payments tem numero_pedido?' as teste,
    COUNT(*) as total_payments,
    COUNT(numero_pedido) as payments_com_numero_pedido,
    COUNT(DISTINCT numero_pedido) as distinct_numero_pedido
FROM payments;

-- Testar se payments tem order_id
SELECT 
    'Teste 3b: payments tem order_id?' as teste,
    COUNT(*) as total_payments,
    COUNT(order_id) as payments_com_order_id,
    COUNT(DISTINCT order_id) as distinct_order_id
FROM payments;

-- Testar match entre orders.numero_pedido e payments.numero_pedido
SELECT 
    'Teste 3c: orders.numero_pedido ↔ payments.numero_pedido' as teste,
    COUNT(DISTINCT o.numero_pedido) as orders_com_numero_pedido,
    COUNT(DISTINCT p.numero_pedido) as payments_com_numero_pedido,
    COUNT(DISTINCT CASE WHEN o.numero_pedido = p.numero_pedido THEN o.numero_pedido END) as matches
FROM orders o
FULL OUTER JOIN payments p ON o.numero_pedido = p.numero_pedido
WHERE o.numero_pedido IS NOT NULL AND p.numero_pedido IS NOT NULL;

-- ============================================
-- TESTE 4: customers.id ↔ wallets.customer_id
-- ============================================
SELECT 
    'Teste 4: customers.id ↔ wallets.customer_id' as teste,
    COUNT(DISTINCT c.id) as customers_com_id,
    COUNT(DISTINCT w.customer_id) as wallets_com_customer_id,
    COUNT(DISTINCT CASE WHEN c.id = w.customer_id THEN c.id END) as matches
FROM customers c
FULL OUTER JOIN wallets w ON c.id = w.customer_id;

-- ============================================
-- TESTE 5: customers.id ↔ bonus_wallets.customer_id
-- ============================================
SELECT 
    'Teste 5: customers.id ↔ bonus_wallets.customer_id' as teste,
    COUNT(DISTINCT c.id) as customers_com_id,
    COUNT(DISTINCT bw.customer_id) as bonus_wallets_com_customer_id,
    COUNT(DISTINCT CASE WHEN c.id = bw.customer_id THEN c.id END) as matches
FROM customers c
FULL OUTER JOIN bonus_wallets bw ON c.id = bw.customer_id;

-- ============================================
-- TESTE 6: customers.id ↔ points_wallets.customer_id
-- ============================================
SELECT 
    'Teste 6: customers.id ↔ points_wallets.customer_id' as teste,
    COUNT(DISTINCT c.id) as customers_com_id,
    COUNT(DISTINCT pw.customer_id) as points_wallets_com_customer_id,
    COUNT(DISTINCT CASE WHEN c.id = pw.customer_id THEN c.id END) as matches
FROM customers c
FULL OUTER JOIN points_wallets pw ON c.id = pw.customer_id;

-- ============================================
-- TESTE 7: customers.id ↔ network_relationships.customer_id
-- ============================================
SELECT 
    'Teste 7: customers.id ↔ network_relationships.customer_id' as teste,
    COUNT(DISTINCT c.id) as customers_com_id,
    COUNT(DISTINCT nr.customer_id) as network_relationships_com_customer_id,
    COUNT(DISTINCT CASE WHEN c.id = nr.customer_id THEN c.id END) as matches
FROM customers c
FULL OUTER JOIN network_relationships nr ON c.id = nr.customer_id;

-- ============================================
-- TESTE 8: customers.email ↔ orders.customer_email
-- ============================================
SELECT 
    'Teste 8: customers.email ↔ orders.customer_email' as teste,
    COUNT(DISTINCT c.email) as customers_com_email,
    COUNT(DISTINCT o.customer_email) as orders_com_customer_email,
    COUNT(DISTINCT CASE WHEN c.email = o.customer_email THEN c.email END) as matches
FROM customers c
FULL OUTER JOIN orders o ON c.email = o.customer_email
WHERE c.email IS NOT NULL AND o.customer_email IS NOT NULL;

-- ============================================
-- TESTE 9: Análise de tipos de compra (purchase_type)
-- ============================================
SELECT 
    purchase_type,
    COUNT(*) as quantidade,
    SUM(valor_total_pedido) as valor_total,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentual
FROM orders
WHERE purchase_type IS NOT NULL
GROUP BY purchase_type
ORDER BY quantidade DESC;

-- ============================================
-- TESTE 10: Análise de order_type
-- ============================================
SELECT 
    order_type,
    COUNT(*) as quantidade,
    SUM(valor_total_pedido) as valor_total,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentual
FROM orders
WHERE order_type IS NOT NULL
GROUP BY order_type
ORDER BY quantidade DESC;

-- ============================================
-- TESTE 11: Análise de customer_type
-- ============================================
SELECT 
    customer_type,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentual
FROM customers
WHERE customer_type IS NOT NULL
GROUP BY customer_type
ORDER BY quantidade DESC;

-- ============================================
-- TESTE 12: Análise de qualification
-- ============================================
SELECT 
    qualification,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentual
FROM customers
WHERE qualification IS NOT NULL
GROUP BY qualification
ORDER BY quantidade DESC;

-- ============================================
-- TESTE 13: Verificar duplicação de colunas em orders
-- ============================================
SELECT 
    'order_number vs numero_pedido' as colunas,
    COUNT(order_number) as order_number_preenchido,
    COUNT(numero_pedido) as numero_pedido_preenchido,
    COUNT(DISTINCT order_number) as order_number_distinct,
    COUNT(DISTINCT numero_pedido) as numero_pedido_distinct
FROM orders;

SELECT 
    'total_amount vs valor_total_pedido vs valor_total' as colunas,
    COUNT(total_amount) as total_amount_preenchido,
    COUNT(valor_total_pedido) as valor_total_pedido_preenchido,
    COUNT(valor_total) as valor_total_preenchido
FROM orders;

SELECT 
    'payment_method vs forma_pagamento' as colunas,
    COUNT(payment_method) as payment_method_preenchido,
    COUNT(forma_pagamento) as forma_pagamento_preenchido
FROM orders;

SELECT 
    'status vs status_pedido' as colunas,
    COUNT(status) as status_preenchido,
    COUNT(status_pedido) as status_pedido_preenchido
FROM orders;
