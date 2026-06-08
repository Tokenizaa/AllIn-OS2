-- Enable RLS and add minimal policies for withdrawals and distributor_themes.
-- These tables are exposed in the app through Supabase client queries and need explicit policies.

alter table public.withdrawals enable row level security;
alter table public.distributor_themes enable row level security;

-- Withdrawals: owners can read their own records, admins can read all records.
create policy "Users can view own withdrawals"
on public.withdrawals
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can view all withdrawals"
on public.withdrawals
for select
to authenticated
using (
  exists (
    select 1
    from public.customers
    where customers.id = auth.uid()
      and customers.role = 'admin'
  )
);

create policy "Service role full access to withdrawals"
on public.withdrawals
for all
to service_role
using (true)
with check (true);

-- Distributor themes: public can read the default theme, authenticated distributors can read their own theme,
-- and service role handles all writes.
create policy "Public can read default distributor theme"
on public.distributor_themes
for select
to anon, authenticated
using (is_default = true);

create policy "Distributors can read own theme"
on public.distributor_themes
for select
to authenticated
using (distributor_id = auth.uid());

create policy "Service role full access to distributor themes"
on public.distributor_themes
for all
to service_role
using (true)
with check (true);
