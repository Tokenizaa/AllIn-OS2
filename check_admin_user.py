import os
from supabase import create_client, Client

# Configurações do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://kynbbidsjzfccelqpohu.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bmJiaWRzanpmY2NlbHFwb2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTM5OTUsImV4cCI6MjA5NjYyOTk5NX0.M5hew-WBZVBoikt-hKBdlJZpWy4M8hnBekFOaNrbueg")

# Criar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Verificar se o usuário admin@allin.io existe
try:
    result = supabase.table('profiles').select('*').eq('email', 'admin@allin.io').execute()
    
    if result.data:
        print(f"✅ Usuário encontrado: {result.data[0]['email']}")
        print(f"   ID: {result.data[0]['id']}")
        print(f"   Role: {result.data[0]['role']}")
        print(f"   Nome: {result.data[0]['nome_completo']}")
    else:
        print("❌ Usuário admin@allin.io NÃO encontrado no banco de dados")
        
except Exception as e:
    print(f"❌ Erro ao verificar usuário: {e}")
