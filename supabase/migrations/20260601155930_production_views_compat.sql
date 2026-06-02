-- =====================================================================
-- ALLIN Production Compatibility Views
-- Purpose: Provide stable views used by frontend/backend against the
-- current schema without depending on legacy columns.
-- =====================================================================

create schema if not exists analytics;

drop view if exists public.customer_360_view cascade;
create or replace view public.customer_360_view
with (security_invoker = true) as
with order_stats as (
  select
    o.customer_id,
    count(*)::bigint as total_orders,
    coalesce(sum(coalesce(o.valor_total_pedido, o.valor_total, 0)), 0)::numeric(14,2) as total_revenue,
    coalesce(avg(coalesce(o.valor_total_pedido, o.valor_total, 0)), 0)::numeric(14,2) as average_order_value,
    max(o.created_at) as last_order_date,
    min(o.created_at) as first_order_date
  from public.orders o
  group by o.customer_id
),
wallet_stats as (
  select
    w.customer_id,
    coalesce(w.balance_available, 0)::numeric(14,2) as balance_available,
    coalesce(w.balance_blocked, 0)::numeric(14,2) as balance_blocked,
    coalesce(w.balance_pending, 0)::numeric(14,2) as balance_pending
  from public.wallets w
)
select
  c.id,
  c.id_comprador,
  c.user_id,
  c.usuario,
  c.qualification,
  c.status,
  c.telefone,
  c.cidade,
  c.estado,
  c.cep,
  c.bairro,
  c.complemento,
  c.endereco,
  c.numero,
  c.metadata,
  c.created_at,
  c.updated_at,
  c.data_criacao,
  c.patrocinador_comprador,
  cp.plan_id,
  p.name as plan_name,
  p.slug as plan_slug,
  p.price as plan_price,
  coalesce(os.total_orders, 0) as total_orders,
  coalesce(os.total_revenue, 0) as total_revenue,
  coalesce(os.average_order_value, 0) as average_order_value,
  os.last_order_date,
  os.first_order_date,
  coalesce(ws.balance_available, 0) as saldo_sacavel,
  coalesce(ws.balance_blocked, 0) as saldo_bloqueado,
  coalesce(ws.balance_pending, 0) as saldo_pendente
from public.customers c
left join public.customer_plans cp
  on cp.customer_id = c.id
 and (cp.status = 'active' or cp.deactivated_at is null)
left join public.plans p on p.id = cp.plan_id
left join order_stats os on os.customer_id = c.id
left join wallet_stats ws on ws.customer_id = c.id;

grant select on public.customer_360_view to authenticated;

drop view if exists public.network_tree_view cascade;
create or replace view public.network_tree_view
with (security_invoker = true) as
with recursive tree as (
  select
    c.id,
    c.id_comprador as node_id,
    c.user_id,
    c.usuario as name,
    c.qualification,
    c.status,
    c.patrocinador_comprador as sponsor_id,
    null::text as sponsor_name,
    0 as level,
    array[c.id::text] as path
  from public.customers c
  where c.patrocinador_comprador is null
     or c.patrocinador_comprador = ''

  union all

  select
    child.id,
    child.id_comprador as node_id,
    child.user_id,
    child.usuario as name,
    child.qualification,
    child.status,
    child.patrocinador_comprador as sponsor_id,
    parent.name as sponsor_name,
    tree.level + 1,
    tree.path || child.id::text
  from public.customers child
  join tree on tree.node_id = child.patrocinador_comprador
  left join public.customers parent on parent.id_comprador = child.patrocinador_comprador
  where not child.id::text = any(tree.path)
    and tree.level < 20
)
select
  t.id,
  t.node_id,
  t.user_id,
  t.name,
  t.qualification,
  t.status,
  t.sponsor_id,
  t.sponsor_name,
  t.level,
  t.path,
  coalesce(nm.total_downline, 0) as total_downlines,
  coalesce(nm.active_downline, 0) as active_downlines,
  coalesce(nm.personal_volume, 0) as total_revenue,
  coalesce(nm.total_volume, 0) as total_volume,
  cp.plan_id,
  p.name as plan_name,
  p.slug as plan_slug,
  c.created_at
from tree t
left join public.customers c on c.id = t.id
left join public.customer_network_metrics nm on nm.customer_id = t.id
left join public.customer_plans cp on cp.customer_id = t.id and (cp.status = 'active' or cp.deactivated_at is null)
left join public.plans p on p.id = cp.plan_id;

grant select on public.network_tree_view to authenticated;

drop materialized view if exists analytics.plan_performance cascade;
create materialized view analytics.plan_performance as
select
  p.id as plan_id,
  p.slug,
  p.name as plan_name,
  p.price,
  count(distinct cp.customer_id) as total_customers,
  count(distinct cp.customer_id) filter (where cp.status = 'active') as active_customers,
  coalesce(sum(coalesce(os.total_revenue, 0)), 0)::numeric(14,2) as total_revenue,
  coalesce(avg(coalesce(os.total_revenue, 0)), 0)::numeric(14,2) as avg_revenue_per_customer,
  p.is_active
from public.plans p
left join public.customer_plans cp on cp.plan_id = p.id
left join (
  select customer_id, coalesce(sum(coalesce(valor_total_pedido, valor_total, 0)), 0)::numeric(14,2) as total_revenue
  from public.orders
  group by customer_id
) os on os.customer_id = cp.customer_id
group by p.id, p.slug, p.name, p.price, p.is_active;

create unique index if not exists plan_performance_plan_id_idx on analytics.plan_performance(plan_id);
create index if not exists plan_performance_slug_idx on analytics.plan_performance(slug);
create index if not exists plan_performance_is_active_idx on analytics.plan_performance(is_active);

grant select on analytics.plan_performance to authenticated;

drop materialized view if exists analytics.payment_analytics cascade;
create materialized view analytics.payment_analytics as
select
  date_trunc('day', p.created_at)::date as dia,
  p.payment_method,
  p.status,
  count(*) as total_payments,
  coalesce(sum(p.amount), 0)::numeric(14,2) as total_amount,
  coalesce(avg(p.amount), 0)::numeric(14,2) as avg_amount,
  count(distinct p.customer_id) as unique_customers
from public.payments p
where p.created_at is not null
group by 1, 2, 3;

create index if not exists payment_analytics_dia_idx on analytics.payment_analytics(dia desc);
create index if not exists payment_analytics_method_idx on analytics.payment_analytics(payment_method);
create index if not exists payment_analytics_status_idx on analytics.payment_analytics(status);

grant select on analytics.payment_analytics to authenticated;

drop materialized view if exists analytics.bonus_distribution cascade;
create materialized view analytics.bonus_distribution as
select
  b.distributor_id,
  b.type as bonus_type,
  b.amount,
  b.status,
  b.period,
  b.created_at,
  b.paid_at
from public.bonuses b;

create index if not exists bonus_distribution_distributor_id_idx on analytics.bonus_distribution(distributor_id);
create index if not exists bonus_distribution_type_idx on analytics.bonus_distribution(bonus_type);
create index if not exists bonus_distribution_status_idx on analytics.bonus_distribution(status);
create index if not exists bonus_distribution_period_idx on analytics.bonus_distribution(period desc);

grant select on analytics.bonus_distribution to authenticated;

drop materialized view if exists analytics.sales_summary cascade;
create materialized view analytics.sales_summary as
select
  date_trunc('day', o.created_at)::date as dia,
  count(*) as total_pedidos,
  count(*) filter (where coalesce(o.status, o.status_pedido, '') in ('paid', 'pago', 'approved')) as pedidos_pagos,
  count(*) filter (where coalesce(o.status, o.status_pedido, '') in ('cancelled', 'cancelado')) as pedidos_cancelados,
  coalesce(sum(coalesce(o.valor_total_pedido, o.valor_total, 0)) filter (where coalesce(o.status, o.status_pedido, '') in ('paid', 'pago', 'approved')), 0)::numeric(14,2) as faturamento,
  coalesce(avg(coalesce(o.valor_total_pedido, o.valor_total, 0)) filter (where coalesce(o.status, o.status_pedido, '') in ('paid', 'pago', 'approved')), 0)::numeric(14,2) as ticket_medio,
  count(distinct o.customer_id) as clientes_unicos
from public.orders o
where o.created_at is not null
group by 1;

create index if not exists sales_summary_dia_idx on analytics.sales_summary(dia desc);

grant select on analytics.sales_summary to authenticated;

create or replace function analytics.refresh_all_materialized_views()
returns void
language plpgsql
security definer
set search_path = analytics, public
as $$
begin
  refresh materialized view analytics.sales_summary;
  refresh materialized view analytics.plan_performance;
  refresh materialized view analytics.payment_analytics;
  refresh materialized view analytics.bonus_distribution;
end;
$$;

grant execute on function analytics.refresh_all_materialized_views() to service_role;
