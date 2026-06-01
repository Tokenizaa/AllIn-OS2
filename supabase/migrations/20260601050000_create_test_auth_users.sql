-- Criar usuários de teste no auth.users com senhas
-- Nota: Isso requer acesso ao schema auth, que pode não ser permitido via migrações normais
-- Se isso falhar, os usuários precisam ser criados via Supabase Dashboard ou CLI

-- Inserir usuários no auth.users (se tiver permissão)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@allin.io', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"role": "admin_master"}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'financeiro@allin.io', crypt('finance123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"role": "financeiro"}'::jsonb),
  ('00000000-0000-0000-0000-000000000003', 'suporte@allin.io', crypt('support123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"role": "suporte"}'::jsonb),
  ('00000000-0000-0000-0000-000000000004', 'distributor@allin.io', crypt('distributor123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"role": "distribuidor"}'::jsonb),
  ('00000000-0000-0000-0000-000000000005', 'customer@allin.io', crypt('client123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"role": "cliente_final"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
