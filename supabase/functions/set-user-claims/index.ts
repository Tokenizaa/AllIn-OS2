import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  try {
    const { method } = req;

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    if (method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { userId, roleName } = await req.json();

    if (!userId || !roleName) {
      return new Response(JSON.stringify({ error: 'Missing userId or roleName' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Buscar role
    const { data: role, error: roleError } = await supabase
      .from('identity.roles')
      .select('*')
      .eq('name', roleName)
      .single();

    if (roleError || !role) {
      return new Response(JSON.stringify({ error: 'Role not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar se usuário já tem essa role
    const { data: existingUserRole } = await supabase
      .from('identity.user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', role.id)
      .single();

    if (existingUserRole) {
      // Atualizar se necessário
      if (!existingUserRole.is_active) {
        await supabase
          .from('identity.user_roles')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('id', existingUserRole.id);
      }
    } else {
      // Criar nova associação
      await supabase
        .from('identity.user_roles')
        .insert({
          user_id: userId,
          role_id: role.id,
          assigned_at: new Date().toISOString(),
          is_active: true,
        });
    }

    // Buscar todas as roles do usuário
    const { data: userRoles } = await supabase
      .from('identity.user_roles')
      .select('roles(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString() ?? true);

    // Extrair nomes das roles
    const roleNames = userRoles?.map((ur: any) => ur.roles.name) || [];
    const permissions = userRoles?.map((ur: any) => ur.roles.permissions) || [];

    // Atualizar custom claims do usuário
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        roles: roleNames,
        permissions: permissions,
      },
    });

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update user claims' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      roles: roleNames,
      permissions: permissions,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
