-- Wallet RPC: retorna ViewModel completa da wallet em uma única chamada
-- Substitui queries a: MlmEngineService.wallet.getBalance, PointsService, BonusService

CREATE OR REPLACE FUNCTION mlm.rpc_wallet_data(p_customer_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = mlm, crm, finance, public
AS $$
DECLARE
    v_distribuidor RECORD;
    v_wallet RECORD;
    v_points RECORD;
    v_stats JSONB;
    v_recent_tx JSONB;
    v_bonus_tx JSONB;
    v_points_tx JSONB;
BEGIN
    -- 1. Buscar distribuidor pelo id_comprador (customer_id)
    SELECT d.* INTO v_distribuidor
    FROM mlm.distribuidores d
    JOIN crm.customers c ON c.auth_user_id = d.auth_user_id
    WHERE c.id_comprador = p_customer_id
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'stats', jsonb_build_object(
                'balance', 0, 'availableBalance', 0, 'frozenBalance', 0,
                'currency', 'BRL', 'bonusBalance', 0, 'points', 0
            ),
            'recentTransactions', '[]'::jsonb,
            'bonusTransactions', '[]'::jsonb,
            'pointsTransactions', '[]'::jsonb
        );
    END IF;

    -- 2. Wallet balance
    SELECT * INTO v_wallet FROM mlm.carteiras WHERE distribuidor_id = v_distribuidor.id LIMIT 1;

    -- 3. Points balance
    SELECT * INTO v_points FROM mlm.pontos_saldo WHERE distribuidor_id = v_distribuidor.id LIMIT 1;

    -- 4. Stats agregadas
    SELECT jsonb_build_object(
        'balance', COALESCE(v_wallet.saldo, 0),
        'availableBalance', COALESCE(v_wallet.saldo, 0) - COALESCE(v_wallet.bloqueado, 0),
        'frozenBalance', COALESCE(v_wallet.bloqueado, 0),
        'currency', 'BRL',
        'bonusBalance', COALESCE((
            SELECT SUM(valor_calculado) FROM mlm.bonus_historico
            WHERE distribuidor_id = v_distribuidor.id
              AND status IN ('aprovado', 'pago')
        ), 0),
        'points', COALESCE(v_points.saldo_atual, 0)
    ) INTO v_stats;

    -- 5. Recent wallet transactions (últimas 10)
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id,
        'type', CASE WHEN valor >= 0 THEN 'credit' ELSE 'debit' END,
        'amount', ABS(valor)::numeric,
        'balance', saldo_depois::numeric,
        'description', descricao,
        'date', created_at,
        'created_at', created_at
    ) ORDER BY created_at DESC), '[]'::jsonb)
    INTO v_recent_tx
    FROM mlm.carteiras_transacoes
    WHERE distribuidor_id = v_distribuidor.id
    ORDER BY created_at DESC
    LIMIT 10;

    -- 6. Bonus transactions
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id,
        'amount', valor_calculado::numeric,
        'description', COALESCE(referencia_tipo, tipo),
        'created_at', data_calculo,
        'status', status
    ) ORDER BY data_calculo DESC), '[]'::jsonb)
    INTO v_bonus_tx
    FROM mlm.bonus_historico
    WHERE distribuidor_id = v_distribuidor.id
    ORDER BY data_calculo DESC
    LIMIT 10;

    -- 7. Points transactions
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id,
        'amount', quantidade::numeric,
        'description', COALESCE(descricao, origem, tipo),
        'created_at', created_at,
        'source_type', tipo
    ) ORDER BY created_at DESC), '[]'::jsonb)
    INTO v_points_tx
    FROM mlm.pontos_transacoes
    WHERE distribuidor_id = v_distribuidor.id
    ORDER BY created_at DESC
    LIMIT 10;

    RETURN jsonb_build_object(
        'stats', v_stats,
        'recentTransactions', COALESCE(v_recent_tx, '[]'::jsonb),
        'bonusTransactions', COALESCE(v_bonus_tx, '[]'::jsonb),
        'pointsTransactions', COALESCE(v_points_tx, '[]'::jsonb)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION mlm.rpc_wallet_data(TEXT) TO authenticated;

COMMENT ON FUNCTION mlm.rpc_wallet_data(TEXT) IS 'Retorna ViewModel completa da wallet (stats, recentTransactions, bonusTransactions, pointsTransactions) em uma única chamada.';