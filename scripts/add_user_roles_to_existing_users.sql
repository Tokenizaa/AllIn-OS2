-- Criar user_roles para usuários existentes baseados nos emails
INSERT INTO identity.user_roles (user_id, role_id, assigned_at, assigned_by, status)
SELECT 
  u.id as user_id,
  r.id as role_id,
  u.created_at as assigned_at,
  u.id as assigned_by,
  'active' as status
FROM auth.users u
CROSS JOIN identity.roles r
WHERE 
  (u.email = 'admin@allin.io' AND r.name = 'admin_master')
  OR (u.email = 'customer@allin.io' AND r.name = 'cliente_final')
  OR (u.email = 'afiliado@allin.io' AND r.name = 'afiliado')
  OR (u.email = 'distributor@allin.io' AND r.name = 'distribuidor')
  OR (u.email = 'operador@allin.io' AND r.name = 'operador')
  OR (u.email = 'auditor@allin.io' AND r.name = 'auditor')
ON CONFLICT (user_id, role_id) DO NOTHING;
