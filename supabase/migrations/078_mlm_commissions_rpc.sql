-- Commissions RPC: retorna ViewModel de comissões para dashboard admin
-- Substitui PaymentService + PlanService + CustomerService + OrderService

CREATE OR REPLACE FUNCTION mlm.rpc_commissions_dashboard(p_limit INT DEFAULT 100)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = mlm, finance, commerce, crm, public
AS $$
DECLARE
    v_rows JSONB;
    v_plans JSONB;
    v_customers JSONB;
BEGIN
    -- 1. Comissões recentes (transformadas para formato de rows)
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', c.id,
        'ciclo', 'Ciclo ' || to_char(c.data_calculo, 'MM/YYYY'),
        'qualificados', COALESCE(c.geracao, 1),
        'pago', COALESCE(c.valor_comissao, 0),
        'status', c.status,
        'planKey', c.tipo,
        'distribuidor_id', c.distribuidor_id,
        'data_calculo', c.data_calculo
    ) ORDER BY c.data_calculo DESC), '[]'::jsonb)
    INTO v_rows
    FROM mlm.comissoes c
    WHERE c.deleted_at IS NULL
    LIMIT p_limit;

    -- 2. Planos ativos
    SELECT COALESCE(jsonb_agg(to_jsonb(p)), '[]'::jsonb)
    INTO v_plans
    FROM (
        SELECT id, nome, preco, ativo, max_geracoes, metadata, created_at
        FROM mlm.planos
        WHERE ativo = true
        ORDER BY preco ASC
    ) p;

    -- 3. Customers (distribuidores)
    SELECT COALESCE(jsonb_agg(to_jsonb(c)), '[]'::jsonb)
    INTO v_customers
    FROM (
        SELECT c.id, c.auth_user_id, c.usuario, c.id_comprador, c.patrocinador_comprador, 
               c.plan_id, c.metadata, c.qualification, c.status
        FROM crm.customers c
        WHERE c.status = 'active'
        ORDER BY c.created_at DESC
        LIMIT 200
    ) c;

    RETURN jsonb_build_object(
        'rows', COALESCE(v_rows, '[]'::jsonb),
        'plans', COALESCE(v_plans, '[]'::jsonb),
        'customers', COALESCE(v_customers, '[]'::jsonb)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION mlm.rpc_commissions_dashboard(INT) TO authenticated;

COMMENT ON FUNCTION mlm.rpc_commissions_dashboard(INT) IS 'Retorna ViewModel de comissões para dashboard admin: rows (comissões transformadas), plans, customers.';