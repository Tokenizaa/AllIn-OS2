-- Plans RPC: retorna planos + regras de bônus ativas em uma única chamada
-- Substitui PlanService.fetchActivePlans + PlanService.getPlanBonuses

CREATE OR REPLACE FUNCTION mlm.rpc_plans_with_rules()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = mlm, public
AS $$
DECLARE
    v_plans JSONB;
    v_rules JSONB;
BEGIN
    -- Planos ativos
    SELECT COALESCE(jsonb_agg(to_jsonb(p)), '[]'::jsonb)
    INTO v_plans
    FROM (
        SELECT id, nome, slug, description, preco, ativo, max_geracoes, metadata, created_at
        FROM mlm.planos
        WHERE ativo = true
        ORDER BY preco ASC
    ) p;

    -- Regras ativas
    SELECT COALESCE(jsonb_agg(to_jsonb(r)), '[]'::jsonb)
    INTO v_rules
    FROM (
        SELECT id, nome, tipo, geracao, porcentagem, valor_fixo, pontos_minimos,
               volume_minimo, diretos_minimos, periodo_tipo, periodo_dias,
               data_inicio, data_fim, configuracoes, descricao, is_active, plan_id,
               metadata, created_at, updated_at
        FROM mlm.bonus_regras
        WHERE is_active = true
        ORDER BY porcentagem DESC
    ) r;

    RETURN jsonb_build_object(
        'plans', COALESCE(v_plans, '[]'::jsonb),
        'activeRules', COALESCE(v_rules, '[]'::jsonb)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION mlm.rpc_plans_with_rules() TO authenticated;

COMMENT ON FUNCTION mlm.rpc_plans_with_rules() IS 'Retorna ViewModel completa: planos ativos + regras de bônus ativas.';