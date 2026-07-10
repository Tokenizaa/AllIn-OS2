-- ============================================================
-- SPRINT DB-02: Limpeza de Legacy - Migração e Remoção
-- Data: 2026-07-07
-- Objetivo: Migrar dados das tabelas legacy e remover duplicatas
-- ============================================================

-- ============================================================
-- PASSO 1: Desabilitar RLS para migração
-- ============================================================
ALTER TABLE commerce.pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE mlm.planos DISABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.empresa DISABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.materiais DISABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.pedidos_itens DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- PASSO 2: Migrar public.planos → mlm.planos (3 registros)
-- ============================================================
INSERT INTO mlm.planos (
    id,
    nome,
    tipo,
    slug,
    descricao,
    preco,
    taxa_ativacao,
    taxa_mensal,
    max_geracoes,
    bonus_direto_porcentagem,
    bonus_indireto_porcentagem,
    pontos_ativacao,
    pontos_renovacao,
    is_active,
    is_upgrade,
    upgrade_de_id,
    configuracoes,
    metadata,
    created_at,
    updated_at
)
SELECT 
    id,
    nome,
    tipo,
    slug,
    descricao,
    preco::numeric,
    taxa_ativacao::numeric,
    taxa_mensal::numeric,
    max_geracoes,
    bonus_direto_porcentagem::numeric,
    bonus_indireto_porcentagem::numeric,
    pontos_ativacao,
    pontos_renovacao,
    is_active,
    is_upgrade,
    upgrade_de_id,
    configuracoes,
    metadata,
    created_at,
    updated_at
FROM public.planos
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASSO 3: Migrar public.empresas → industrial.empresa (15 registros)
-- ============================================================
INSERT INTO industrial.empresa (
    id,
    razao_social,
    cnpj,
    regime_fiscal,
    metadata,
    created_at,
    updated_at,
    deleted_at,
    tipo
)
SELECT 
    id,
    COALESCE(razao_social, 'N/A')::character varying,
    COALESCE(cnpj, '00.000.000/0000-00')::character varying,
    COALESCE(regime_fiscal, 'Simples Nacional')::character varying,
    metadata,
    created_at,
    updated_at,
    deleted_at,
    'mattress_manufacturer'::character varying as tipo
FROM public.empresas
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASSO 4: Migrar public.materias_primas → industrial.materiais (3 registros)
-- ============================================================
INSERT INTO industrial.materiais (
    id,
    codigo,
    descricao,
    categoria,
    unidade_medida,
    estoque_atual,
    estoque_minimo,
    estoque_maximo,
    custo_unitario,
    custo_medio,
    fornecedor_padrao_id,
    localizacao_id,
    especificacoes,
    observacoes,
    created_at,
    updated_at,
    deleted_at
)
SELECT 
    id,
    COALESCE(codigo, 'MP-' || substring(id::text, 1, 8))::character varying,
    nome::character varying,
    COALESCE(familia, 'Geral')::character varying,
    COALESCE(unidade_medida, 'UN')::character varying,
    0::numeric as estoque_atual,
    0::numeric as estoque_minimo,
    0::numeric as estoque_maximo,
    COALESCE(custo_unitario::numeric, 0) as custo_unitario,
    COALESCE(custo_unitario::numeric, 0) as custo_medio,
    NULL::uuid as fornecedor_padrao_id,
    NULL::uuid as localizacao_id,
    metadata as especificacoes,
    NULL::text as observacoes,
    created_at,
    updated_at,
    deleted_at
FROM public.materias_primas
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASSO 5: Migrar public.pedidos → commerce.pedidos (1 registro)
-- ============================================================
-- Primeiro, converter TEXT distributor_ids para UUID (se existirem)
WITH pedido_convertido AS (
    SELECT 
        id,
        numero_pedido,
        NULL::uuid as cliente_id,
        NULL::uuid as auth_user_id,
        loja_id,
        loja_nome,
        loja_documento,
        tipo_id,
        tipo_chave,
        tipo_nome,
        tipo_descricao,
        cliente_nome,
        cliente_sobrenome,
        cliente_email,
        cliente_telefone,
        cliente_rg,
        cliente_cpf,
        cliente_cnpj,
        cliente_ie,
        cliente_logradouro,
        cliente_bairro,
        cliente_cep,
        cliente_cidade,
        cliente_uf,
        entrega_nome,
        entrega_sobrenome,
        entrega_logradouro,
        entrega_bairro,
        entrega_cep,
        entrega_cidade,
        entrega_uf,
        valor_total,
        status_pedido,
        status_id,
        status_descricao,
        forma_pagamento,
        pagamento_confirmado,
        comanda_impressao,
        fatura_impressao,
        necessita_frete,
        cancelado,
        market_place,
        data_criacao,
        data_pagamento,
        data_cancelamento,
        data_modificado,
        moeda_codigo,
        comentario,
        campos_personalizados,
        metadata,
        created_at,
        updated_at,
        NULL::uuid as distribuidor_indicador_id,
        NULL::uuid as distribuidor_comprador_id,
        NULL::uuid as allin_id,
        NULL::timestamp with time zone as allin_synced_at
    FROM public.pedidos
)
INSERT INTO commerce.pedidos (
    id, numero_pedido, cliente_id, auth_user_id, loja_id, loja_nome, loja_documento,
    tipo_id, tipo_chave, tipo_nome, tipo_descricao,
    cliente_nome, cliente_sobrenome, cliente_email, cliente_telefone,
    cliente_rg, cliente_cpf, cliente_cnpj, cliente_ie,
    cliente_logradouro, cliente_bairro, cliente_cep, cliente_cidade, cliente_uf,
    entrega_nome, entrega_sobrenome, entrega_logradouro, entrega_bairro,
    entrega_cep, entrega_cidade, entrega_uf,
    valor_total, status_pedido, status_id, status_descricao,
    forma_pagamento, pagamento_confirmado, comanda_impressao, fatura_impressao,
    necessita_frete, cancelado, market_place,
    data_criacao, data_pagamento, data_cancelamento, data_modificado,
    moeda_codigo, comentario, campos_personalizados, metadata,
    created_at, updated_at, distribuidor_indicador_id, distribuidor_comprador_id,
    allin_id, allin_synced_at
)
SELECT 
    id, numero_pedido, cliente_id, auth_user_id, loja_id, loja_nome, loja_documento,
    tipo_id, tipo_chave, tipo_nome, tipo_descricao,
    cliente_nome, cliente_sobrenome, cliente_email, cliente_telefone,
    cliente_rg, cliente_cpf, cliente_cnpj, cliente_ie,
    cliente_logradouro, cliente_bairro, cliente_cep, cliente_cidade, cliente_uf,
    entrega_nome, entrega_sobrenome, entrega_logradouro, entrega_bairro,
    entrega_cep, entrega_cidade, entrega_uf,
    valor_total, status_pedido, status_id, status_descricao,
    forma_pagamento, pagamento_confirmado, comanda_impressao, fatura_impressao,
    necessita_frete, cancelado, market_place,
    data_criacao, data_pagamento, data_cancelamento, data_modificado,
    moeda_codigo, comentario, campos_personalizados, metadata,
    created_at, updated_at, distribuidor_indicador_id, distribuidor_comprador_id,
    allin_id, allin_synced_at
FROM pedido_convertido
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASSO 6: Migrar public.order_items → commerce.pedidos_itens (1 registro)
-- ============================================================
INSERT INTO commerce.pedidos_itens (
    id,
    pedido_id,
    produto_id,
    quantidade,
    preco_unitario,
    preco_total,
    nome_produto,
    categoria,
    created_at,
    updated_at
)
SELECT 
    id,
    pedido_id,
    NULL::uuid as produto_id,
    quantity,
    unit_price::numeric,
    total_price::numeric,
    product_name,
    NULL::character varying as categoria,
    created_at,
    updated_at
FROM public.order_items
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASSO 7: Remover tabelas copilot duplicadas (vazias)
-- ============================================================
DROP TABLE IF EXISTS public.copilot_conversations;
DROP TABLE IF EXISTS public.copilot_messages;
DROP TABLE IF EXISTS public.copilot_context_snapshots;
DROP TABLE IF EXISTS public.copilot_events;
DROP TABLE IF EXISTS public.copilot_insights;
DROP TABLE IF EXISTS public.copilot_kpis;
DROP TABLE IF EXISTS public.copilot_memory;

-- ============================================================
-- PASSO 8: Remover outras tabelas legacy (sem dados ou duplicadas)
-- ============================================================
DROP TABLE IF EXISTS public.payment_attempts;
DROP TABLE IF EXISTS public.capacidades;
DROP TABLE IF EXISTS public.custos_producao_real;
DROP TABLE IF EXISTS public.rastreabilidade_lotes;
DROP TABLE IF EXISTS public.fornecedor_materias_primas;
DROP TABLE IF EXISTS public.pedidos_compra;
DROP TABLE IF EXISTS public.itens_pedido_compra;
DROP TABLE IF EXISTS public.contas_pagar;
DROP TABLE IF EXISTS public.contas_receber;

-- ============================================================
-- PASSO 9: Reabilitar RLS
-- ============================================================
ALTER TABLE commerce.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mlm.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.pedidos_itens ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PASSO 10: Recriar políticas RLS para tabelas migradas
-- ============================================================

-- commerce.pedidos: permitir acesso a todos para leitura (anon)
CREATE POLICY "Allow anon read on commerce.pedidos" ON commerce.pedidos
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read on commerce.pedidos" ON commerce.pedidos
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service_role all on commerce.pedidos" ON commerce.pedidos
    FOR ALL TO service_role USING (true);

-- mlm.planos
CREATE POLICY "Allow anon read on mlm.planos" ON mlm.planos
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read on mlm.planos" ON mlm.planos
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service_role all on mlm.planos" ON mlm.planos
    FOR ALL TO service_role USING (true);

-- industrial.empresa
CREATE POLICY "Allow anon read on industrial.empresa" ON industrial.empresa
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read on industrial.empresa" ON industrial.empresa
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service_role all on industrial.empresa" ON industrial.empresa
    FOR ALL TO service_role USING (true);

-- industrial.materiais
CREATE POLICY "Allow anon read on industrial.materiais" ON industrial.materiais
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read on industrial.materiais" ON industrial.materiais
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service_role all on industrial.materiais" ON industrial.materiais
    FOR ALL TO service_role USING (true);

-- commerce.pedidos_itens
CREATE POLICY "Allow anon read on commerce.pedidos_itens" ON commerce.pedidos_itens
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read on commerce.pedidos_itens" ON commerce.pedidos_itens
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service_role all on commerce.pedidos_itens" ON commerce.pedidos_itens
    FOR ALL TO service_role USING (true);

-- ============================================================
-- PASSO 11: Remover tabelas principais legacy (APÓS migração)
-- ============================================================
DROP TABLE IF EXISTS public.pedidos;
DROP TABLE IF EXISTS public.planos;
DROP TABLE IF EXISTS public.empresas;
DROP TABLE IF EXISTS public.materias_primas;
DROP TABLE IF EXISTS public.order_items;

-- ============================================================
-- FIM DA MIGRATION DB-02
-- ============================================================
-- Registros migrados:
-- - public.planos → mlm.planos: 3 registros
-- - public.empresas → industrial.empresa: 15 registros
-- - public.materias_primas → industrial.materiais: 3 registros
-- - public.pedidos → commerce.pedidos: 1 registro
-- - public.order_items → commerce.pedidos_itens: 1 registro
--
-- Tabelas removidas:
-- - public.copilot_conversations (duplicado)
-- - public.copilot_messages (duplicado)
-- - public.copilot_context_snapshots (duplicado)
-- - public.copilot_events (duplicado)
-- - public.copilot_insights (duplicado)
-- - public.copilot_kpis (duplicado)
-- - public.copilot_memory (duplicado)
-- - public.payment_attempts
-- - public.capacidades
-- - public.custos_producao_real
-- - public.rastreabilidade_lotes
-- - public.fornecedor_materias_primas
-- - public.pedidos_compra
-- - public.itens_pedido_compra
-- - public.contas_pagar
-- - public.contas_receber
-- - public.pedidos (após migração)
-- - public.planos (após migração)
-- - public.empresas (após migração)
-- - public.materias_primas (após migração)
-- - public.order_items (após migração)
--
-- Tabelas mantidas:
-- - public.module_configurations (23 registros ativos)
-- ============================================================