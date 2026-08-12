-- Withdrawals RPC: retorna saques + summary em uma única chamada
-- Substitui WithdrawalService.fetchWithdrawals + transformação no hook

CREATE OR REPLACE FUNCTION finance.rpc_withdrawals_dashboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = finance, crm, mlm, public
AS $$
DECLARE
    v_saques JSONB;
    v_summary JSONB;
BEGIN
    -- Buscar saques (últimos 100)
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id,
        'user', distribuidor_nome,
        'valor', valor_solicitado,
        'metodo', tipo_conta,
        'status', status_descricao,
        'risco', FALSE,
        'data_pedido', data_pedido
    ) ORDER BY data_pedido DESC), '[]'::jsonb)
    INTO v_saques
    FROM finance.solicitacoes_saque
    WHERE deleted_at IS NULL
    LIMIT 100;

    -- Summary
    SELECT jsonb_build_object(
        'total', COALESCE(SUM(valor_solicitado), 0),
        'pending', COUNT(*) FILTER (WHERE status_descricao = 'pendente'),
        'approved', COUNT(*) FILTER (WHERE status_descricao = 'aprovado'),
        'anomalies', 0
    ) INTO v_summary
    FROM finance.solicitacoes_saque
    WHERE deleted_at IS NULL;

    RETURN jsonb_build_object(
        'saques', COALESCE(v_saques, '[]'::jsonb),
        'summary', v_summary
    );
END;
$$;

GRANT EXECUTE ON FUNCTION finance.rpc_withdrawals_dashboard() TO authenticated;

COMMENT ON FUNCTION finance.rpc_withdrawals_dashboard() IS 'Retorna saques + summary para dashboard admin em uma única chamada.';