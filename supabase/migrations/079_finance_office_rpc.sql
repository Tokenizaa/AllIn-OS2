-- Office Finance RPC: retorna dados financeiros para dashboard do distribuidor (office)
-- Substitui useOfficeFinance que usava PaymentService + WithdrawalService + CustomerService

CREATE OR REPLACE FUNCTION finance.rpc_office_finance(p_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = finance, mlm, crm, commerce, public
AS $$
DECLARE
    v_distribuidor RECORD;
    v_wallet RECORD;
    v_wallet_stats JSONB;
    v_withdrawals JSONB;
BEGIN
    -- Buscar distribuidor pelo auth_user_id
    SELECT d.* INTO v_distribuidor
    FROM mlm.distribuidores d
    WHERE d.auth_user_id = p_user_id
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'wallet', jsonb_build_object(
                'balance_available', 0, 'balance_blocked', 0, 'balance_pending', 0,
                'total_year', 0, 'total_month', 0
            ),
            'withdrawals', '[]'::jsonb
        );
    END IF;

    -- Wallet balance
    SELECT * INTO v_wallet FROM mlm.carteiras WHERE distribuidor_id = v_distribuidor.id LIMIT 1;

    SELECT jsonb_build_object(
        'balance_available', COALESCE(v_wallet.saldo, 0) - COALESCE(v_wallet.bloqueado, 0),
        'balance_blocked', COALESCE(v_wallet.bloqueado, 0),
        'balance_pending', 0,
        'total_year', COALESCE((
            SELECT SUM(valor_solicitado) FROM finance.solicitacoes_saque
            WHERE user_id = p_user_id AND deleted_at IS NULL
              AND data_pedido >= date_trunc('year', CURRENT_DATE)
        ), 0),
        'total_month', COALESCE((
            SELECT SUM(valor_solicitado) FROM finance.solicitacoes_saque
            WHERE user_id = p_user_id AND deleted_at IS NULL
              AND data_pedido >= date_trunc('month', CURRENT_DATE)
        ), 0)
    ) INTO v_wallet_stats;

    -- Recent withdrawals
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id,
        'description', COALESCE(metodo, 'Saque'),
        'type', 'debit',
        'amount', valor_solicitado,
        'created_at', data_pedido
    ) ORDER BY data_pedido DESC), '[]'::jsonb)
    INTO v_withdrawals
    FROM finance.solicitacoes_saque
    WHERE user_id = p_user_id AND deleted_at IS NULL
    ORDER BY data_pedido DESC
    LIMIT 20;

    RETURN jsonb_build_object(
        'wallet', v_wallet_stats,
        'withdrawals', COALESCE(v_withdrawals, '[]'::jsonb)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION finance.rpc_office_finance(TEXT) TO authenticated;

COMMENT ON FUNCTION finance.rpc_office_finance(TEXT) IS 'Retorna ViewModel financeira para dashboard do distribuidor (office): wallet stats + recent withdrawals.';