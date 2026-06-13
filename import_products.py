import os
import csv
from supabase import create_client, Client

# Configurações do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://kynbbidsjzfccelqpohu.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bmJiaWRzanpmY2NlbHFwb2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTM5OTUsImV4cCI6MjA5NjYyOTk5NX0.M5hew-WBZVBoikt-hKBdlJZpWy4M8hnBekFOaNrbueg")

# Criar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Caminho do arquivo CSV
CSV_PATH = "docs/imports/produtos-all-in - 2026_01_06_16_04_12.csv"

def parse_price(price_str):
    """Converte string de preço para decimal"""
    if not price_str:
        return 0.0
    # Remove R$, espaços e converte para decimal
    price_str = price_str.replace("R$", "").replace(".", "").replace(",", ".").strip()
    try:
        return float(price_str)
    except:
        return 0.0

def import_products():
    print("Importando produtos do CSV...")
    
    products_to_insert = []
    
    with open(CSV_PATH, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            # Mapear status do CSV para o enum do banco
            status = 'active' if row['Situação'] == 'Habilitado' else 'inactive'
            
            product = {
                'code': row['SKU'],
                'name': row['Produto'],
                'description': row['Modelo'] if row['Modelo'] else None,
                'category': row['Categorias'] if row['Categorias'] else None,
                'price': parse_price(row['Preço']),
                'currency': 'BRL',
                'status': status,
                'metadata': {
                    'legacy_id': row['ID'],
                    'image': row['Imagem'],
                    'model': row['Modelo'],
                    'points': int(row['Pontos']) if row['Pontos'] else 0,
                    'stock': int(row['Quantidade']) if row['Quantidade'] else 0,
                    'is_featured': row['Produto Destacado'] == 'Sim',
                    'tags': row['Etiquetas']
                }
            }
            products_to_insert.append(product)
    
    print(f"Total de produtos a importar: {len(products_to_insert)}")
    
    # Limpar tabela products antes de importar
    print("Limpando tabela products...")
    supabase.table('products').delete().neq('code', '00000000-0000-0000-0000-000000000000').execute()
    
    # Importar em batches de 50
    batch_size = 50
    for i in range(0, len(products_to_insert), batch_size):
        batch = products_to_insert[i:i + batch_size]
        try:
            result = supabase.table('products').insert(batch).execute()
            print(f"✅ Importados {len(batch)} produtos (batch {i//batch_size + 1})")
        except Exception as e:
            print(f"❌ Erro ao importar batch {i//batch_size + 1}: {e}")
    
    print("\nImportação concluída!")

if __name__ == "__main__":
    import_products()
