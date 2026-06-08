-- Seed completo para perfis de teste com todas as colunas necessárias
-- Schema atualizado para incluir: phone, cpf, referral_code, sponsor_id, avatar

insert into public.profiles (id, user_id, name, email, role, status, phone, cpf, referral_code, sponsor_id, avatar, created_at, updated_at)
values
  ('cb086cc0-8935-401b-952b-705f9b86d29c', '00000000-0000-0000-0000-000000000001', 'Admin Master', 'admin@allin.io', 'admin_master', 'active', '+5511999999999', '123.456.789-00', 'ADMIN001', null, null, now(), now()),
  ('55d0ae91-322d-4b51-a35c-de599052aedf', '00000000-0000-0000-0000-000000000002', 'Financeiro Admin', 'financeiro@allin.io', 'financeiro', 'active', '+5511999999998', '234.567.890-00', 'FINANCEIRO001', null, null, now(), now()),
  ('699a44f6-e4a7-4a49-be7e-66c483173642', '00000000-0000-0000-0000-000000000003', 'Suporte Admin', 'suporte@allin.io', 'suporte', 'active', '+5511999999997', '345.678.901-00', 'SUPORTE001', null, null, now(), now()),
  ('635b2f42-b7d7-4d73-93f8-4b041f6c5ccc', '00000000-0000-0000-0000-000000000004', 'Distributor Test', 'distributor@allin.io', 'distribuidor', 'active', '+5511999999996', '456.789.012-00', 'DISTRIBUIDOR001', null, null, now(), now()),
  ('2d190807-d0ac-4ada-835d-dd0496691f1e', '00000000-0000-0000-0000-000000000005', 'Cliente Test', 'customer@allin.io', 'cliente_final', 'active', '+5511999999995', '567.890.123-00', 'CLIENTE001', null, null, now(), now())
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  role = excluded.role,
  status = excluded.status,
  phone = excluded.phone,
  cpf = excluded.cpf,
  referral_code = excluded.referral_code,
  sponsor_id = excluded.sponsor_id,
  avatar = excluded.avatar,
  updated_at = now();
