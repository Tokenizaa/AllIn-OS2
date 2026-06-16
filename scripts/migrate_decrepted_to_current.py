#!/usr/bin/env python3
"""
Script para migrar dados do banco DECREPTED para o banco ATUAL com correções pontuais
"""
import os
import sys
import time
from pathlib import Path
from supabase import create_client, Client

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

# Chaves dos projetos (usando service role key para migração)
# Nota: Cada projeto Supabase tem sua própria chave
DECREPTED_KEY = os.getenv("DECREPTED_ANON_KEY")
CURRENT_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Configurações de rate limiting
BATCH_SIZE = 50  # Tamanho do batch para inserts
DELAY_BETWEEN_REQUESTS = 0.1  # Segundos de delay entre requests
MAX_RETRIES = 3  # Máximo de tentativas para erros de conexão
TEST_MODE = False  # Modo teste - limita a 10 orders
TEST_LIMIT = 10  # Limite de orders para teste

print("=== Migração DECREPTED -> ATUAL ===")
print(f"Origem: {DECREPTED_PROJECT_ID}")
print(f"Destino: {CURRENT_PROJECT_ID}")
print(f"Batch Size: {BATCH_SIZE}")
print(f"Delay entre requests: {DELAY_BETWEEN_REQUESTS}s")
print(f"Máximo de retries: {MAX_RETRIES}")
if TEST_MODE:
    print(f"[TEST MODE] Limitando a {TEST_LIMIT} orders")
print()

def retry_with_backoff(func, *args, max_retries=MAX_RETRIES, **kwargs):
    """Executa função com retry e exponential backoff para erros de conexão"""
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_str = str(e).lower()
            # Verificar se é erro de conexão
            is_connection_error = any(term in error_str for term in [
                'connection', 'timeout', 'terminated', 'network', 'stream'
            ])
            
            if is_connection_error and attempt < max_retries - 1:
                wait_time = (2 ** attempt) * 0.5  # Exponential backoff: 0.5s, 1s, 2s
                print(f"   [RETRY] Erro de conexão: {e}. Tentando novamente em {wait_time}s... (tentativa {attempt + 1}/{max_retries})")
                time.sleep(wait_time)
            else:
                raise e

def get_last_migrated_order():
    """Verifica o último pedido migrado no banco ATUAL"""
    current_client = create_client(CURRENT_URL, CURRENT_KEY)
    
    # Buscar o último pedido migrado
    response = current_client.table('pedidos').select('numero_pedido').eq('metadata->>migration_source', 'decrepted').order('numero_pedido', desc=True).limit(1).execute()
    
    if response.data:
        return response.data[0]['numero_pedido']
    return None

def migrate_orders():
    """Migra orders do DECREPTED para pedidos no ATUAL"""
    print("1. Migração de orders -> pedidos")
    
    # Conectar aos bancos
    decrepted_client = create_client(DECREPTED_URL, DECREPTED_KEY)
    current_client = create_client(CURRENT_URL, CURRENT_KEY)
    
    # Verificar onde parou
    last_migrated = get_last_migrated_order()
    if last_migrated:
        print(f"   - Retomando do pedido {last_migrated}")
    
    # Buscar todos os orders do DECREPTED com paginação
    orders = []
    page = 0
    page_size = 1000
    
    while True:
        response = decrepted_client.table('orders').select('*').range(page * page_size, (page + 1) * page_size - 1).execute()
        if not response.data:
            break
        orders.extend(response.data)
        print(f"   - Página {page + 1}: {len(response.data)} orders")
        page += 1
        if len(response.data) < page_size:
            break
    
    print(f"   - {len(orders)} orders encontrados no DECREPTED")
    
    # Limitar a TEST_LIMIT orders se estiver em modo teste
    if TEST_MODE:
        orders = orders[:TEST_LIMIT]
        print(f"   - [TEST MODE] Limitando a {len(orders)} orders")
    
    # Criar mapeamento de original_order_id -> novo UUID
    order_id_mapping = {}
    
    # Buscar pedidos já migrados para evitar duplicação usando original_order_id
    existing_orders = current_client.table('pedidos').select('id, metadata').eq('metadata->>migration_source', 'decrepted').execute()
    existing_original_ids = {o['metadata']['original_order_id']: o['id'] for o in existing_orders.data if o.get('metadata', {}).get('original_order_id')}
    
    print(f"   - {len(existing_original_ids)} pedidos já migrados encontrados")
    
    # Inserir orders no ATUAL (apenas os não migrados) em batches
    migrated_count = 0
    skipped_count = 0
    batch_to_insert = []
    total_to_migrate = len(orders)
    
    print(f"   - Iniciando migração de {total_to_migrate} orders...")
    
    for idx, order in enumerate(orders):
        # Progress log a cada 1000 orders
        if idx % 1000 == 0:
            print(f"   - Progresso: {idx}/{total_to_migrate} orders processados ({(idx/total_to_migrate)*100:.1f}%)")
        
        original_order_id = order.get('id')
        
        # Pular se já foi migrado
        if original_order_id in existing_original_ids:
            order_id_mapping[original_order_id] = existing_original_ids[original_order_id]
            skipped_count += 1
            continue
        
        # Mapear campos
        pedido_data = {
            'numero_pedido': order.get('numero_pedido'),
            'cliente_nome': order.get('comprador'),
            'cliente_email': order.get('usuario', ''),
            'cliente_telefone': '',
            'cliente_cpf': '',
            'cliente_cnpj': '',
            'valor_total': float(order.get('valor_total_pedido', 0)),
            'status_pedido': order.get('status_pedido', 'pending'),
            'forma_pagamento': order.get('forma_pagamento'),
            'pagamento_confirmado': order.get('pago', False),
            'cancelado': order.get('cancelado', False),
            'data_pagamento': order.get('data_pagamento'),
            'metadata': {
                'migration_source': 'decrepted',
                'original_order_id': original_order_id,
                'allin_synced_at': order.get('created_at'),
            }
        }
        
        batch_to_insert.append(pedido_data)
        
        # Inserir em batch quando atingir o tamanho do batch
        if len(batch_to_insert) >= BATCH_SIZE:
            try:
                response = retry_with_backoff(
                    current_client.table('pedidos').insert(batch_to_insert).execute
                )
                
                if response.data:
                    for i, new_pedido in enumerate(response.data):
                        old_order_id = batch_to_insert[i]['metadata']['original_order_id']
                        order_id_mapping[old_order_id] = new_pedido['id']
                        migrated_count += 1
                        print(f"   - Pedido {batch_to_insert[i]['numero_pedido']} migrado (ID: {new_pedido['id']})")
                
                batch_to_insert = []
                time.sleep(DELAY_BETWEEN_REQUESTS)
            except Exception as e:
                print(f"   [ERROR] Erro ao inserir batch: {e}")
                # Continuar com o próximo batch
                batch_to_insert = []
    
    # Inserir o restante do batch
    if batch_to_insert:
        try:
            response = retry_with_backoff(
                current_client.table('pedidos').insert(batch_to_insert).execute
            )
            
            if response.data:
                for i, new_pedido in enumerate(response.data):
                    old_order_id = batch_to_insert[i]['metadata']['original_order_id']
                    order_id_mapping[old_order_id] = new_pedido['id']
                    migrated_count += 1
                    print(f"   - Pedido {batch_to_insert[i]['numero_pedido']} migrado (ID: {new_pedido['id']})")
        except Exception as e:
            print(f"   [ERROR] Erro ao inserir batch final: {e}")
    
    print(f"   - {migrated_count} novos pedidos migrados")
    print(f"   - {skipped_count} pedidos pulgados (já migrados)")
    
    # decrepted_client.close()  # Cliente Supabase não tem método close()
    return order_id_mapping

def migrate_order_items():
    """Migra order_items do DECREPTED para order_items no ATUAL"""
    print("\n2. Migração de order_items -> order_items")
    
    # Conectar aos bancos
    decrepted_client = create_client(DECREPTED_URL, DECREPTED_KEY)
    current_client = create_client(CURRENT_URL, CURRENT_KEY)
    
    # Criar mapeamento de original_order_id -> pedido_id para busca rápida
    print("   - Criando mapeamento de original_order_id -> pedido_id")
    pedidos_response = current_client.table('pedidos').select('id, metadata').eq('metadata->>migration_source', 'decrepted').execute()
    original_order_id_to_id = {}
    for p in pedidos_response.data:
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
    
    # Buscar itens já migrados para evitar duplicação
    existing_items = current_client.table('order_items').select('metadata->>original_item_id as original_item_id').eq('metadata->>migration_source', 'decrepted').execute()
    existing_original_ids = {i['original_item_id'] for i in existing_items.data if i.get('original_item_id')}
    
    print(f"   - {len(existing_original_ids)} order_items já migrados encontrados")
    
    # Inserir order_items no ATUAL (apenas os não migrados) em batches
    migrated_count = 0
    skipped_count = 0
    order_not_found_count = 0
    batch_to_insert = []
    total_to_migrate = len(items)
    
    print(f"   - Iniciando migração de {total_to_migrate} order_items...")
    
    for idx, item in enumerate(items):
        # Progress log a cada 10000 items
        if idx % 10000 == 0:
            print(f"   - Progresso: {idx}/{total_to_migrate} items processados ({(idx/total_to_migrate)*100:.1f}%)")
        
        original_item_id = str(item.get('id'))
        old_order_id = item.get('order_id')
        
        # Pular se já foi migrado
        if original_item_id in existing_original_ids:
            skipped_count += 1
            continue
        
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
                    # Continuar com o próximo batch
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
    print(f"   - {skipped_count} order_items pulgados (já migrados)")
    print(f"   - {order_not_found_count} order_items pulgados (pedido não encontrado)")
    
    # decrepted_client.close()  # Cliente Supabase não tem método close()

def apply_corrections():
    """Aplica correções pontuais nos dados migrados"""
    print("\n3. Aplicando correções pontuais")
    
    current_client = create_client(CURRENT_URL, CURRENT_KEY)
    
    # Corrigir orders com valor_total = 0
    print("   - Corrigindo orders com valor_total = 0")
    zero_orders = current_client.table('pedidos').select('*').eq('valor_total', 0).execute()
    print(f"     {len(zero_orders.data)} orders com valor 0 encontrados")
    
    if zero_orders.data:
        # Calcular valor_total baseado nos order_items
        for order in zero_orders.data:
            pedido_id = order['id']
            # Buscar order_items deste pedido
            items = current_client.table('order_items').select('*').eq('pedido_id', pedido_id).execute()
            
            if items.data:
                # Somar total_price dos itens
                total_from_items = sum(float(item.get('total_price', 0)) for item in items.data)
                
                if total_from_items > 0:
                    # Atualizar valor_total do pedido
                    current_client.table('pedidos').update({'valor_total': total_from_items}).eq('id', pedido_id).execute()
                    print(f"     - Pedido {order.get('numero_pedido')} atualizado: valor_total = {total_from_items}")
    
    # Corrigir order_items com unit_price = 0
    print("   - Corrigindo order_items com unit_price = 0")
    zero_items = current_client.table('order_items').select('*').eq('unit_price', 0).execute()
    print(f"     {len(zero_items.data)} order_items com preço 0 encontrados")
    
    if zero_items.data:
        for item in zero_items.data:
            # Se quantity > 0 e total_price > 0, calcular unit_price
            quantity = int(item.get('quantity', 1))
            total_price = float(item.get('total_price', 0))
            
            if quantity > 0 and total_price > 0:
                unit_price = total_price / quantity
                # Atualizar unit_price
                current_client.table('order_items').update({'unit_price': unit_price}).eq('id', item['id']).execute()
                print(f"     - Item {item.get('product_name')} atualizado: unit_price = {unit_price}")
    
    # current_client.close()  # Cliente Supabase não tem método close()

if __name__ == "__main__":
    import traceback
    
    try:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Iniciando migração...")
        
        # Executar migração
        migrate_orders()
        migrate_order_items()
        apply_corrections()
        
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Migração Concluída ===")
        print("Dados migrados com sucesso!")
        
    except Exception as e:
        print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Erro na Migração ===")
        print(f"Erro: {str(e)}")
        print(f"\nStack trace completo:")
        traceback.print_exc()
        sys.exit(1)
