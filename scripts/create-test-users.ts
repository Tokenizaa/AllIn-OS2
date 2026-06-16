import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://imeadfnlgzphumuawdyt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('Please set it in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'crm',
  },
});

const testUsers = [
  { email: 'admin@allin.io', password: 'admin123', name: 'Admin Master', role: 'ADMIN_MASTER' },
  { email: 'gestao@allin.io', password: 'gestao123', name: 'Gestao Admin', role: 'GESTAO_ADMIN' },
  { email: 'financeiro@allin.io', password: 'finance123', name: 'Financeiro', role: 'FINANCEIRO' },
  { email: 'suporte@allin.io', password: 'support123', name: 'Suporte', role: 'SUPORTE' },
  { email: 'logistica@allin.io', password: 'logistica123', name: 'Logistica', role: 'LOGISTICA' },
  { email: 'marketing@allin.io', password: 'marketing123', name: 'Marketing', role: 'MARKETING' },
  { email: 'analytics@allin.io', password: 'analytics123', name: 'Analytics', role: 'ANALYTICS' },
  { email: 'auditor@allin.io', password: 'auditor123', name: 'Auditor', role: 'AUDITOR' },
  { email: 'operador@allin.io', password: 'operador123', name: 'Operador', role: 'OPERADOR' },
  { email: 'distributor@allin.io', password: 'distributor123', name: 'Distribuidor', role: 'DISTRIBUIDOR' },
  { email: 'afiliado@allin.io', password: 'affiliate123', name: 'Afiliado', role: 'AFILIADO' },
  { email: 'customer@allin.io', password: 'client123', name: 'Cliente', role: 'CLIENTE_FINAL' },
];

async function createTestUsers() {
  console.log('Creating test users...');
  
  for (const user of testUsers) {
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        emailConfirm: true,
        userMetadata: {
          name: user.name,
          role: user.role,
        },
      });

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError.message);
        continue;
      }

      console.log(`✓ Created user: ${user.email} (${user.name})`);

      // Create customer profile
      const tipoCliente = user.role === 'DISTRIBUIDOR' ? 'distribuidor' :
                         user.role === 'AFILIADO' ? 'afiliado' :
                         user.role === 'CLIENTE_FINAL' ? 'cliente' : 'admin';

      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          nome: user.name,
          email: user.email,
          tipo_cliente: tipoCliente,
          ativo: true,
          status: 'active',
          login: true,
          email_verificado: true,
          data_cadastro: new Date().toISOString(),
          auth_user_id: authData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (customerError) {
        console.error(`Error creating customer profile for ${user.email}:`, customerError.message);
      } else {
        console.log(`✓ Created customer profile for: ${user.email}`);
      }

    } catch (error) {
      console.error(`Error processing ${user.email}:`, error);
    }
  }

  console.log('\nTest users creation completed!');
}

createTestUsers().catch(console.error);
