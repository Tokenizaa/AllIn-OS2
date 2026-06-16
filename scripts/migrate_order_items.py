#!/usr/bin/env python3
"""
Script para migrar order_items do banco DECREPTED para o banco ATUAL
Baseado em migrate_decrepted_to_current.py
"""
import os
import sys
import time
from pathlib import Path
from supabase import create_client

# Adicionar caminho para imports
sys.path.append(str(Path(__file__).parent.parent))

from dotenv import load_dotenv

# Carregar variáveis de ambiente
project_root = Path(__file__).parent.parent
load_dotenv(project_root / ".env")
load_dotenv(project_root / ".env.local")

# IDs dos projetos Supabase
DECREPTED_PROJECT_ID = "kynbbidsjzfccelqpohu"
CURRENT_PROJECT_ID = "imeadfnlgzphumuawdyt"

# URLs dos projetos
DECREPTED_URL = f"https://{DECREPTED_PROJECT_ID}.supabase.co"
CURRENT_URL = f"https://{CURRENT_PROJECT_ID}.supabase.co"

# Chaves dos projetos
DECREPTED_KEY = os.getenv("DECREPTED_ANON_KEY")
CURRENT_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Configurações de rate limiting
BATCH_SIZE = 50
DELAY_BETWEEN_REQUESTS = 0.1
MAX_RETRIES = 3
TEST_MODE = False
TEST_LIMIT = 10

print("=== Migração de Order Items DECREPTED -> ATUAL ===")
print(f"Origem: {DECREPTED_PROJECT_ID}")
print(f"Destino: {CURRENT_PROJECT_ID}")
print(f"Batch Size: {BATCH_SIZE}")
print(f"Delay entre requests: {DELAY_BETWEEN_REQUESTS}s")
print(f"Máximo de retries: {MAX_RETRIES}")
if TEST_MODE:
    print(f"[TEST MODE] Limitando a {TEST_LIMIT} order_items")
print()

def retry_with_backoff(func, *args, max_retries=MAX_RETRIES, **kwargs):
    """Executa função com retry e exponential backoff para erros de conexão"""
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_str = str(e).lower()
            is_connection_error = any(term in error_str for term in [
                'connection', 'timeout', 'terminated', 'network', 'stream'
            ])
            
            if is_connection_error and attempt < max_retries - 1:
                wait_time = (2 ** attempt) * 0.5
                print(f"   [RETRY] Erro de conexão: {e}. Tentando novamente em {wait_time}s... (tentativa {attempt + 1}/{max_retries})")
                time.sleep(wait_time)
            else:
                raise e

def migrate_order_items():
    """Migra order_items do DECREPTED para order_items no ATUAL"""
    print("Iniciando migração de order_items -> order_items")
    
    # Conectar aos bancos
    decrepted_client = create_client(DECREPTED_URL, DECREPTED_KEY)
    current_client = create_client(CURRENT_URL, CURRENT_KEY)
    
    # Criar mapeamento de original_order_id -> pedido_id para busca rápida
    print("   - Criando mapeamento de original_order_id -> pedido_id")
    pedidos = []
    page = 0
    page_size = 1000
    
    while True:
        response = current_client.table('pedidos').select('id, metadata').eq('metadata->>migration_source', 'decrepted').range(page * page_size, (page + 1) * page_size - 1).execute()
        if not response.data:
            break
        pedidos.extend(response.data)
        print(f"   - Página {page + 1}: {len(response.data)} pedidos")
        page += 1
        if len(response.data) < page_size:
            break
    
    original_order_id_to_id = {}
    for p in pedidos:
        original_id = p.get('metadata', {}).get('original_order_id')
        if original_id:
            original_order_id_to_id[original_id] = p['id']
    print(f"   - {len(original_order_id_to_id)} pedidos no mapeamento")
    
    # Buscar todos os order_items do DECREPTED com paginação
    items = []
    page = 0
    page_size = 1000
    
    while True:
        response = decrepted_client.table('order_items').select('*').range(page * page_size, (page + 1) * page_size - 1).execute()
        if not response.data:
            break
        items.extend(response.data)
        print(f"   - Página {page + 1}: {len(response.data)} order_items")
        page += 1
        if len(response.data) < page_size:
            break
    
    print(f"   - {len(items)} order_items encontrados no DECREPTED")
    
    # Inserir order_items no ATUAL em batches
    migrated_count = 0
    order_not_found_count = 0
    batch_to_insert = []
    total_to_migrate = len(items)
    
    print(f"   - Iniciando migração de {total_to_migrate} order_items...")
    
    for idx, item in enumerate(items):
        if idx % 10000 == 0:
            print(f"   - Progresso: {idx}/{total_to_migrate} items processados ({(idx/total_to_migrate)*100:.1f}%)")
        
        original_item_id = str(item.get('id'))
        old_order_id = item.get('order_id')
        
        # Buscar o pedido no banco ATUAL pelo original_order_id usando o mapeamento
        if old_order_id in original_order_id_to_id:
            new_pedido_id = original_order_id_to_id[old_order_id]
            
            # Mapear campos
            item_data = {
                'pedido_id': new_pedido_id,
                'product_code': item.get('product_code'),
                'product_name': item.get('product_name'),
                'quantity': int(item.get('quantity', 1)),
                'unit_price': float(item.get('unit_price', 0)),
                'total_price': float(item.get('total_price', 0)),
                'size': item.get('size'),
                'variant': item.get('variant'),
                'metadata': {
                    'migration_source': 'decrepted',
                    'original_item_id': original_item_id,
                }
            }
            
            batch_to_insert.append(item_data)
            
            # Inserir em batch quando atingir o tamanho do batch
            if len(batch_to_insert) >= BATCH_SIZE:
                try:
                    response = retry_with_backoff(
                        current_client.table('order_items').insert(batch_to_insert).execute
                    )
                    
                    if response.data:
                        migrated_count += len(response.data)
                        print(f"   - Batch de {len(response.data)} order_items migrado")
                    
                    batch_to_insert = []
                    time.sleep(DELAY_BETWEEN_REQUESTS)
                except Exception as e:
                    print(f"   [ERROR] Erro ao inserir batch: {e}")
                    batch_to_insert = []
        else:
            order_not_found_count += 1
    
    # Inserir o restante do batch
    if batch_to_insert:
        try:
            response = retry_with_backoff(
                current_client.table('order_items').insert(batch_to_insert).execute
            )
            
            if response.data:
                migrated_count += len(response.data)
                print(f"   - Batch final de {len(response.data)} order_items migrado")
        except Exception as e:
            print(f"   [ERROR] Erro ao inserir batch final: {e}")
    
    print(f"   - {migrated_count} novos order_items migrados")
    print(f"   - {order_not_found_count} order_items pulgados (pedido não encontrado)")

if __name__ == "__main__":
    import traceback
    
    try:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Iniciando migração de order_items...")
        migrate_order_items()
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Migração de Order Items Concluída ===")
        print("Order items migrados com sucesso!")
        
    except Exception as e:
        print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Erro na Migração ===")
        print(f"Erro: {str(e)}")
        print(f"\nStack trace completo:")
        traceback.print_exc()
        sys.exit(1)
