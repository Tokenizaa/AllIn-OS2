-- Network RPC: retorna árvore de rede pronta para UI (ViewModel)
-- Substitui NetworkService + CustomerService + OrderService no useNetwork

CREATE OR REPLACE FUNCTION mlm.rpc_network_tree(p_distribuidor_id TEXT, p_max_levels INT DEFAULT 3)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = mlm, crm
AS $$
DECLARE
    v_distribuidor RECORD;
    v_nodes JSONB;
BEGIN
    -- Buscar distribuidor
    SELECT d.* INTO v_distribuidor
    FROM mlm.distribuidores d
    JOIN crm.customers c ON c.auth_user_id = d.auth_user_id
    WHERE d.id = p_distribuidor_id OR c.id_comprador = p_distribuidor_id
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN '[]'::jsonb;
    END IF;

    -- Recursive CTE para buscar downline até p_max_levels
    WITH RECURSIVE network_tree AS (
        -- Anchor: o próprio distribuidor (level 0)
        SELECT 
            rn.id_distribuidor,
            rn.id_patrocinador,
            0 AS level,
            rn.posicao_relativa,
            d.nome,
            c.id_comprador,
            c.qualification,
            c.cidade,
            c.estado,
            CASE WHEN d.ativo THEN 'active' ELSE 'inactive' END AS status
        FROM mlm.rede_linear_nos rn
        JOIN mlm.distribuidores d ON d.id = rn.id_distribuidor
        JOIN crm.customers c ON c.auth_user_id = d.auth_user_id
        WHERE rn.id_distribuidor = v_distribuidor.id

        UNION ALL

        -- Recursive: filhos diretos
        SELECT 
            rn.id_distribuidor,
            rn.id_patrocinador,
            nt.level + 1,
            rn.posicao_relativa,
            d.nome,
            c.id_comprador,
            c.qualification,
            c.cidade,
            c.estado,
            CASE WHEN d.ativo THEN 'active' ELSE 'inactive' END AS status
        FROM mlm.rede_linear_nos rn
        JOIN mlm.distribuidores d ON d.id = rn.id_distribuidor
        JOIN crm.customers c ON c.auth_user_id = d.auth_user_id
        JOIN network_tree nt ON nt.id_distribuidor = rn.id_patrocinador
        WHERE nt.level < p_max_levels
    )
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id_distribuidor,
        'usuario', id_comprador,
        'id_comprador', id_comprador,
        'name', nome,
        'qualification', qualification,
        'cidade', cidade,
        'estado', estado,
        'status', status,
        'level', level,
        'patrocinador_id', id_patrocinador
    ) ORDER BY level, posicao_relativa), '[]'::jsonb)
    INTO v_nodes
    FROM network_tree;

    RETURN COALESCE(v_nodes, '[]'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION mlm.rpc_network_tree(TEXT, INT) TO authenticated;

COMMENT ON FUNCTION mlm.rpc_network_tree(TEXT, INT) IS 'Retorna ViewModel da rede linear (downline) até N níveis. Substitui NetworkService + CustomerService.';