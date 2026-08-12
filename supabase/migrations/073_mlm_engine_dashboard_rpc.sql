-- Dashboard RPC: retorna ViewModel completa do dashboard do distribuidor em uma única chamada
-- Elimina 5 queries paralelas + transformação manual no frontend

CREATE OR REPLACE FUNCTION mlm.rpc_dashboard(p_distribuidor_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = mlm, crm, commerce, finance, public
AS $$
DECLARE
    v_distribuidor RECORD;
    v_plano RECORD;
    v_stats JSONB;
    v_sales_series JSONB;
    v_bonus_origin JSONB;
    v_top_products JSONB;
    v_timeline JSONB;
    v_goals JSONB;
    v_ai_insights JSONB;
BEGIN
    -- 1. Buscar distribuidor e plano ativo
    SELECT d.*, pd.plano_id
    INTO v_distribuidor
    FROM mlm.distribuidores d
    LEFT JOIN mlm.planos_distribuidores pd ON pd.distribuidor_id = d.id AND pd.status = 'active'
    WHERE d.id = p_distribuidor_id
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'stats', jsonb_build_object(
                'saldoDisponivel', 0,
                'comissaoAcumulada', 0,
                'totalVendido', 0,
                'pedidosMes', 0,
                'redeTotal', 0,
                'ticketMedio', 0,
                'conversaoLoja', 0,
                'crescimentoRedeMes', 0,
                'nome', 'Usuário',
                'qualificacao', 'Sem plano',
                'plano', 'Nenhum',
                'progresso', 0,
                'proximaQualificacao', 'Ative um plano',
                'linkLoja', ''
            ),
            'salesSeries', '[]'::jsonb,
            'bonusOrigin', '[]'::jsonb,
            'topProducts', '[]'::jsonb,
            'timeline', '[]'::jsonb,
            'goals', '[]'::jsonb,
            'aiInsights', '[]'::jsonb
        );
    END IF;

    -- Buscar detalhes do plano
    SELECT * INTO v_plano FROM mlm.planos WHERE id = v_distribuidor.plano_id LIMIT 1;

    -- 2. Stats agregadas (single query com CTEs)
    WITH 
    orders_cte AS (
        SELECT 
            COUNT(*)::int AS pedidos_mes,
            COALESCE(SUM(COALESCE(o.valor_total_pedido, o.valor_total, 0)), 0) AS total_vendido,
            COALESCE(AVG(COALESCE(o.valor_total_pedido, o.valor_total, 0)), 0) AS ticket_medio,
            MAX(o.created_at) AS last_order_at
        FROM commerce.orders o
        WHERE o.id_comprador = v_distribuidor.id_comprador
          AND o.created_at >= date_trunc('month', CURRENT_DATE)
    ),
    payments_cte AS (
        SELECT 
            COALESCE(SUM(amount), 0) AS total_pago
        FROM finance.pagamentos
        WHERE id_comprador = v_distribuidor.id_comprador
    ),
    withdrawals_cte AS (
        SELECT 
            COALESCE(SUM(amount), 0) AS total_sacado
        FROM finance.solicitacoes_saque
        WHERE user_id = v_distribuidor.auth_user_id
          AND status = 'aprovado'
    ),
    network_cte AS (
        SELECT 
            COUNT(*)::int AS rede_total
        FROM crm.customers
        WHERE patrocinador_comprador = v_distribuidor.id_comprador
    ),
    wallet_cte AS (
        SELECT 
            COALESCE(saldo, 0) AS saldo,
            COALESCE(bloqueado, 0) AS bloqueado
        FROM mlm.carteiras
        WHERE distribuidor_id = v_distribuidor.id
    ),
    commission_cte AS (
        SELECT 
            COALESCE(SUM(valor_comissao), 0) AS comissao_acumulada
        FROM mlm.comissoes
        WHERE distribuidor_id = v_distribuidor.id
          AND status = 'pago'
    ),
    qualification_cte AS (
        SELECT 
            qualification
        FROM crm.customers
        WHERE id_comprador = v_distribuidor.id_comprador
    ),
    sales_daily AS (
        SELECT 
            to_char(o.created_at, 'DD/MM') AS day,
            COALESCE(SUM(COALESCE(o.valor_total_pedido, o.valor_total, 0)), 0) AS vendas
        FROM commerce.orders o
        WHERE o.id_comprador = v_distribuidor.id_comprador
          AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY to_char(o.created_at, 'DD/MM')
        ORDER BY MIN(o.created_at)
        LIMIT 30
    ),
    bonus_daily AS (
        SELECT 
            to_char(c.data_calculo, 'DD/MM') AS day,
            COALESCE(SUM(c.valor_comissao), 0) AS bonus
        FROM mlm.comissoes c
        WHERE c.distribuidor_id = v_distribuidor.id
          AND c.data_calculo >= CURRENT_DATE - INTERVAL '30 days'
          AND c.status = 'pago'
        GROUP BY to_char(c.data_calculo, 'DD/MM')
    ),
    top_products_cte AS (
        SELECT 
            COALESCE(o.nome_produto, o.product_name, 'Produto') AS name,
            COUNT(*)::int AS qtd
        FROM commerce.orders o
        WHERE o.id_comprador = v_distribuidor.id_comprador
        GROUP BY COALESCE(o.nome_produto, o.product_name, 'Produto')
        ORDER BY COUNT(*) DESC
        LIMIT 5
    ),
    timeline_orders AS (
        SELECT 
            'o-' || o.id AS id,
            'Pedido registrado' AS title,
            'Pedido ' || COALESCE(o.numero_pedido, o.id::text) || ' carregado do Supabase.' AS description,
            o.created_at AS at,
            'order' AS type
        FROM commerce.orders o
        WHERE o.id_comprador = v_distribuidor.id_comprador
        ORDER BY o.created_at DESC
        LIMIT 3
    ),
    timeline_payments AS (
        SELECT 
            'p-' || p.id AS id,
            'Pagamento recebido' AS title,
            'Pagamento de R$' || COALESCE(p.amount, 0)::text || ' processado.' AS description,
            p.created_at AS at,
            'payment' AS type
        FROM finance.pagamentos p
        WHERE p.id_comprador = v_distribuidor.id_comprador
        ORDER BY p.created_at DESC
        LIMIT 3
    ),
    plan_progress AS (
        SELECT 
            CASE 
                WHEN v_plano.nome ILIKE '%afiliado%' THEN 33
                WHEN v_plano.nome ILIKE '%avanco%' THEN 66
                WHEN v_plano.nome ILIKE '%excelencia%' THEN 100
                ELSE 0
            END AS progresso,
            CASE 
                WHEN v_plano.nome ILIKE '%afiliado%' THEN 'Avanço'
                WHEN v_plano.nome ILIKE '%avanco%' THEN 'Excelência'
                ELSE 'Máximo atingido'
            END AS proxima_qualificacao
    )
    SELECT 
        jsonb_build_object(
            'saldoDisponivel', GREATEST(0, COALESCE(w.saldo, 0) - COALESCE(wd.total_sacado, 0)),
            'comissaoAcumulada', COALESCE(c.comissao_acumulada, 0),
            'totalVendido', COALESCE(o.total_vendido, 0),
            'pedidosMes', COALESCE(o.pedidos_mes, 0),
            'redeTotal', COALESCE(n.rede_total, 0),
            'ticketMedio', COALESCE(o.ticket_medio, 0),
            'conversaoLoja', 
                CASE WHEN COALESCE(n.rede_total, 0) > 0 
                     THEN ROUND((COALESCE(o.pedidos_mes, 0)::numeric / n.rede_total) * 100) 
                     ELSE 0 END,
            'crescimentoRedeMes', 0,
            'nome', v_distribuidor.nome,
            'qualificacao', COALESCE(q.qualification, 'Ativo'),
            'plano', COALESCE(v_plano.nome, 'Sem plano'),
            'progresso', COALESCE(pp.progresso, 0),
            'proximaQualificacao', COALESCE(pp.proxima_qualificacao, 'Meta seguinte'),
            'linkLoja', window.location.origin
        ),
        COALESCE((
            SELECT jsonb_agg(jsonb_build_object('day', sd.day, 'vendas', sd.vendas, 'bonus', COALESCE(bd.bonus, 0)))
            FROM sales_daily sd
            LEFT JOIN bonus_daily bd ON bd.day = sd.day
        ), '[]'::jsonb),
        jsonb_build_array(
            jsonb_build_object('name', 'Vendas', 'value', 
                CASE WHEN COALESCE(o.total_vendido, 0) + COALESCE((SELECT SUM(bd.bonus) FROM bonus_daily bd), 0) > 0
                     THEN ROUND((COALESCE(o.total_vendido, 0) / (COALESCE(o.total_vendido, 0) + COALESCE((SELECT SUM(bd.bonus) FROM bonus_daily bd), 0))) * 100)
                     ELSE 0 END),
            jsonb_build_object('name', 'Comissões', 'value',
                CASE WHEN COALESCE(o.total_vendido, 0) + COALESCE((SELECT SUM(bd.bonus) FROM bonus_daily bd), 0) > 0
                     THEN ROUND((COALESCE((SELECT SUM(bd.bonus) FROM bonus_daily bd), 0) / (COALESCE(o.total_vendido, 0) + COALESCE((SELECT SUM(bd.bonus) FROM bonus_daily bd), 0))) * 100)
                     ELSE 0 END)
        ),
        COALESCE((
            SELECT jsonb_agg(jsonb_build_object('name', tp.name, 'qtd', tp.qtd, 'receita', tp.qtd * COALESCE(o.ticket_medio, 0)))
            FROM top_products_cte tp
        ), '[]'::jsonb),
        COALESCE((
            SELECT jsonb_agg(t) FROM (
                SELECT * FROM timeline_orders
                UNION ALL
                SELECT * FROM timeline_payments
                ORDER BY at DESC
                LIMIT 6
            ) t
        ), '[]'::jsonb)
    INTO v_stats, v_sales_series, v_bonus_origin, v_top_products, v_timeline
    FROM orders_cte o
    CROSS JOIN payments_cte p
    CROSS JOIN withdrawals_cte wd
    CROSS JOIN network_cte n
    CROSS JOIN wallet_cte w
    CROSS JOIN commission_cte c
    CROSS JOIN qualification_cte q
    CROSS JOIN plan_progress pp;

    -- Goals (mock para agora - pode vir de tabela futuramente)
    v_goals := jsonb_build_array(
        jsonb_build_object('id', 'g1', 'title', 'Vendas do mês', 'current', COALESCE(v_stats->>'pedidosMes', '0')::int, 'target', 20),
        jsonb_build_object('id', 'g2', 'title', 'Rede ativa', 'current', COALESCE(v_stats->>'redeTotal', '0')::int, 'target', 10),
        jsonb_build_object('id', 'g3', 'title', 'Comissão acumulada', 'current', COALESCE(v_stats->>'comissaoAcumulada', '0')::numeric, 'target', 1000)
    );

    -- AI Insights (mock para agora)
    v_ai_insights := jsonb_build_array(
        jsonb_build_object('id', 'i1', 'title', 'Rede crescendo', 'detail', 'Você tem ' || COALESCE(v_stats->>'redeTotal', '0') || ' membros ativos', 'action', 'Ver rede'),
        jsonb_build_object('id', 'i2', 'title', 'Próxima qualificação', 'detail', 'Faltam ' || (COALESCE(v_plano.max_geracoes, 3) - 1)::text || ' gerações para próximo nível', 'action', 'Ver plano')
    );

    RETURN jsonb_build_object(
        'stats', v_stats,
        'salesSeries', v_sales_series,
        'bonusOrigin', v_bonus_origin,
        'topProducts', v_top_products,
        'timeline', v_timeline,
        'goals', v_goals,
        'aiInsights', v_ai_insights
    );
END;
$$;

-- Grant para anon/authenticated (via RLS na tabela distribuidores)
GRANT EXECUTE ON FUNCTION mlm.rpc_dashboard(TEXT) TO authenticated;

COMMENT ON FUNCTION mlm.rpc_dashboard(TEXT) IS 'Retorna ViewModel completa do dashboard do distribuidor (stats, salesSeries, bonusOrigin, topProducts, timeline, goals, aiInsights) em uma única chamada. Substitui 5 queries + transformação frontend.';