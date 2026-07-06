import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://imeadfnlgzphumuawdyt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
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
  { email: 'admin@allin.io', name: 'Admin Master', role: 'ADMIN_MASTER' },
  { email: 'gestao@allin.io', name: 'Gestao Admin', role: 'GESTAO_ADMIN' },
  { email: 'financeiro@allin.io', name: 'Financeiro', role: 'FINANCEIRO' },
  { email: 'suporte@allin.io', name: 'Suporte', role: 'SUPORTE' },
  { email: 'logistica@allin.io', name: 'Logistica', role: 'LOGISTICA' },
  { email: 'marketing@allin.io', name: 'Marketing', role: 'MARKETING' },
  { email: 'analytics@allin.io', name: 'Analytics', role: 'ANALYTICS' },
  { email: 'auditor@allin.io', name: 'Auditor', role: 'AUDITOR' },
  { email: 'operador@allin.io', name: 'Operador', role: 'OPERADOR' },
  { email: 'distributor@allin.io', name: 'Distribuidor', role: 'DISTRIBUIDOR' },
  { email: 'afiliado@allin.io', name: 'Afiliado', role: 'AFILIADO' },
  { email: 'customer@allin.io', name: 'Cliente', role: 'CLIENTE_FINAL' },
];

async function createCustomerProfiles() {
  console.log('Creating customer profiles for existing users...');
  
  for (const user of testUsers) {
    try {
      // Get the user from auth
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error(`Error listing users:`, listError.message);
        continue;
      }

      const authUser = users.find(u => u.email === user.email);
      
      if (!authUser) {
        console.error(`User not found in auth: ${user.email}`);
        continue;
      }

      // Check if customer profile already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('auth_user_id', authUser.id)
        .single();

      if (existingCustomer) {
        console.log(`✓ Customer profile already exists for: ${user.email}`);
        continue;
      }

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
          auth_user_id: authUser.id,
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

  console.log('\nCustomer profiles creation completed!');
}

createCustomerProfiles().catch(console.error);
