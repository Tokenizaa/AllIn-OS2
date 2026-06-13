import os
from supabase import create_client, Client

# Configurações do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://kynbbidsjzfccelqpohu.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bmJiaWRzanpmY2NlbHFwb2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTM5OTUsImV4cCI6MjA5NjYyOTk5NX0.M5hew-WBZVBoikt-hKBdlJZpWy4M8hnBekFOaNrbueg")

# Criar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Criando usuário admin@allin.io na tabela auth.users...")

try:
    # Tentar criar o usuário usando signup
    result = supabase.auth.sign_up({
        "email": "admin@allin.io",
        "password": "admin123",
        "options": {
            "data": {
                "name": "Administrador Master",
                "role": "admin_master"
            }
        }
    })
    
    print(f"✅ Usuário criado com sucesso!")
    print(f"   ID: {result.user.id}")
    print(f"   Email: {result.user.email}")
    
except Exception as e:
    print(f"❌ Erro ao criar usuário: {e}")
    print("\nTentando abordagem alternativa...")
    
    # Se signup falhar, tentar criar diretamente usando SQL (requer service role key)
    print("Nota: Para criar usuários em auth.users, é necessário usar a Service Role Key.")
    print("Por favor, obtenha a Service Role Key do painel do Supabase e configure no .env.")
