import os
from supabase import create_client, Client

# Configurações do Supabase (novo projeto)
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://kynbbidsjzfccelqpohu.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bmJiaWRzanpmY2NlbHFwb2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTM5OTUsImV4cCI6MjA5NjYyOTk5NX0.M5hew-WBZVBoikt-hKBdlJZpWy4M8hnBekFOaNrbueg")

# Criar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Contas de teste para migrar
TEST_ACCOUNTS = [
    {"email": "gestao@allin.io", "role": "admin", "label": "Gestao Admin"},
    {"email": "financeiro@allin.io", "role": "admin", "label": "Financeiro"},
    {"email": "suporte@allin.io", "role": "admin", "label": "Suporte"},
    {"email": "logistica@allin.io", "role": "admin", "label": "Logistica"},
    {"email": "marketing@allin.io", "role": "admin", "label": "Marketing"},
    {"email": "analytics@allin.io", "role": "admin", "label": "Analytics"},
    {"email": "auditor@allin.io", "role": "admin", "label": "Auditor"},
    {"email": "operador@allin.io", "role": "admin", "label": "Operador"},
    {"email": "distributor@allin.io", "role": "distribuidor", "label": "Distribuidor"},
    {"email": "afiliado@allin.io", "role": "cliente_direto", "label": "Afiliado"},
    {"email": "customer@allin.io", "role": "customer_final", "label": "Cliente"},
]

print("Migrando usuários de teste para o novo banco de dados...")

for account in TEST_ACCOUNTS:
    try:
        # Verificar se o usuário já existe
        result = supabase.table('profiles').select('*').eq('email', account['email']).execute()
        
        if result.data:
            print(f"⚠️  Usuário {account['email']} já existe, pulando...")
            continue
        
        # Inserir o usuário
        insert_result = supabase.table('profiles').insert({
            'role': account['role'],
            'nome_completo': account['label'],
            'email': account['email'],
            'status': 'active',
            'created_at': 'now()',
            'updated_at': 'now()'
        }).execute()
        
        print(f"✅ Usuário {account['email']} migrado com sucesso")
        
    except Exception as e:
        print(f"❌ Erro ao migrar usuário {account['email']}: {e}")

print("\nMigração concluída!")
