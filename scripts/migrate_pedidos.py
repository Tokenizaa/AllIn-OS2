#!/usr/bin/env python3
"""
Script para migrar pedidos do banco DECREPTED para o banco ATUAL
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

print("=== Migração de Pedidos DECREPTED -> ATUAL ===")
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
            is_connection_error = any(term in error_str for term in [
                'connection', 'timeout', 'terminated', 'network', 'stream'
            ])
            
            if is_connection_error and attempt < max_retries - 1:
                wait_time = (2 ** attempt) * 0.5
                print(f"   [RETRY] Erro de conexão: {e}. Tentando novamente em {wait_time}s... (tentativa {attempt + 1}/{max_retries})")
                time.sleep(wait_time)
            else:
                raise e

def get_last_migrated_order():
    """Verifica o último pedido migrado no banco ATUAL"""
    current_client = create_client(CURRENT_URL, CURRENT_KEY)
    
    response = current_client.table('pedidos').select('numero_pedido').eq('metadata->>migration_source', 'decrepted').order('numero_pedido', desc=True).limit(1).execute()
    
    if response.data:
        return response.data[0]['numero_pedido']
    return None

def migrate_orders():
    """Migra orders do DECREPTED para pedidos no ATUAL"""
    print("Iniciando migração de orders -> pedidos")
    
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
    
    # Buscar pedidos já migrados para atualizar tipo_compra com paginação
    existing_orders = []
    page = 0
    page_size = 1000
    
    while True:
        response = current_client.table('pedidos').select('id, metadata, tipo_nome').eq('metadata->>migration_source', 'decrepted').range(page * page_size, (page + 1) * page_size - 1).execute()
        if not response.data:
            break
        existing_orders.extend(response.data)
        print(f"   - Página {page + 1}: {len(response.data)} pedidos existentes")
        page += 1
        if len(response.data) < page_size:
            break
    
    existing_orders_map = {o['metadata']['original_order_id']: o for o in existing_orders if o.get('metadata', {}).get('original_order_id')}
    
    print(f"   - {len(existing_orders_map)} pedidos já migrados encontrados")
    
    # Atualizar orders no ATUAL com tipo_compra em batches
    updated_count = 0
    batch_to_update = []
    total_to_update = len(orders)
    
    print(f"   - Iniciando atualização de {total_to_update} orders...")
    
    for idx, order in enumerate(orders):
        if idx % 1000 == 0:
            print(f"   - Progresso: {idx}/{total_to_update} orders processados ({(idx/total_to_update)*100:.1f}%)")
        
        original_order_id = order.get('id')
        tipo_compra = order.get('tipo_compra')
        
        # Atualizar se já foi migrado e faltam campos críticos
        if original_order_id in existing_orders_map:
            existing_pedido = existing_orders_map[original_order_id]
            update_data = {}
            
            # Atualizar campos faltantes críticos para MLM
            if not existing_pedido.get('tipo_nome') and tipo_compra:
                update_data['tipo_nome'] = tipo_compra
            
            if not existing_pedido.get('loja_nome') and order.get('loja'):
                update_data['loja_nome'] = order.get('loja')
            
            if not existing_pedido.get('data_criacao') and order.get('data_criacao_pedido'):
                update_data['data_criacao'] = order.get('data_criacao_pedido')
            
            # Atualizar metadata com campos adicionais (incluindo IDs não-UUID)
            if update_data or not existing_pedido.get('metadata', {}).get('id_comprador'):
                update_data['id'] = existing_pedido['id']
                # Atualizar metadata se necessário
                current_metadata = existing_pedido.get('metadata', {})
                new_metadata = {
                    'plano_comprador': order.get('plano_comprador'),
                    'distributor_id': str(order.get('distributor_id', '')),
                    'id_comprador': order.get('id_comprador'),
                    'patrocinador_comprador': order.get('patrocinador_comprador'),
                    'forma_entrega': order.get('forma_entrega'),
                    'custo_frete': str(order.get('custo_frete', '')),
                    'hora_pagamento': order.get('hora_pagamento'),
                    'gateway_transaction_id': order.get('gateway_transaction_id'),
                }
                # Merge com metadata existente
                update_data['metadata'] = {**current_metadata, **new_metadata}
                batch_to_update.append(update_data)
        else:
            # Inserir novo pedido
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
                'tipo_nome': tipo_compra,
                'pagamento_confirmado': order.get('pago', False),
                'cancelado': order.get('cancelado', False),
                'data_pagamento': order.get('data_pagamento'),
                'data_criacao': order.get('data_criacao_pedido'),
                'loja_nome': order.get('loja'),
                'metadata': {
                    'migration_source': 'decrepted',
                    'original_order_id': original_order_id,
                    'allin_synced_at': order.get('created_at'),
                    'plano_comprador': order.get('plano_comprador'),
                    'distributor_id': str(order.get('distributor_id', '')),
                    'id_comprador': order.get('id_comprador'),
                    'patrocinador_comprador': order.get('patrocinador_comprador'),
                    'forma_entrega': order.get('forma_entrega'),
                    'custo_frete': str(order.get('custo_frete', '')),
                    'hora_pagamento': order.get('hora_pagamento'),
                    'gateway_transaction_id': order.get('gateway_transaction_id'),
                }
            }
            batch_to_update.append(pedido_data)
        
        # Atualizar/Inserir em batch quando atingir o tamanho do batch
        if len(batch_to_update) >= BATCH_SIZE:
            try:
                for item in batch_to_update:
                    if 'numero_pedido' in item:
                        # Inserir novo
                        response = retry_with_backoff(
                            current_client.table('pedidos').insert(item).execute
                        )
                        if response.data:
                            updated_count += 1
                            print(f"   - Pedido {item['numero_pedido']} inserido (ID: {response.data[0]['id']})")
                    else:
                        # Atualizar existente - remover ID do payload de update
                        item_id = item.pop('id')
                        metadata = item.pop('metadata', {})
                        response = retry_with_backoff(
                            current_client.table('pedidos').update(item).eq('id', item_id).execute
                        )
                        if response.data:
                            updated_count += 1
                            print(f"   - Pedido {item_id} atualizado com campos MLM")
                            # Atualizar metadata separadamente se necessário
                            if metadata:
                                current_client.table('pedidos').update({'metadata': metadata}).eq('id', item_id).execute()
                
                batch_to_update = []
                time.sleep(DELAY_BETWEEN_REQUESTS)
            except Exception as e:
                print(f"   [ERROR] Erro ao processar batch: {e}")
                batch_to_update = []
    
    # Processar o restante do batch
    if batch_to_update:
        try:
            for item in batch_to_update:
                if 'numero_pedido' in item:
                    # Inserir novo
                    response = retry_with_backoff(
                        current_client.table('pedidos').insert(item).execute
                    )
                    if response.data:
                        updated_count += 1
                        print(f"   - Pedido {item['numero_pedido']} inserido (ID: {response.data[0]['id']})")
                else:
                    # Atualizar existente - remover ID do payload de update
                    item_id = item.pop('id')
                    metadata = item.pop('metadata', {})
                    response = retry_with_backoff(
                        current_client.table('pedidos').update(item).eq('id', item_id).execute
                    )
                    if response.data:
                        updated_count += 1
                        print(f"   - Pedido {item_id} atualizado com campos MLM")
                        # Atualizar metadata separadamente se necessário
                        if metadata:
                            current_client.table('pedidos').update({'metadata': metadata}).eq('id', item_id).execute()
        except Exception as e:
            print(f"   [ERROR] Erro ao processar batch final: {e}")
    
    print(f"   - {updated_count} pedidos atualizados/inseridos")

if __name__ == "__main__":
    import traceback
    
    try:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Iniciando migração de pedidos...")
        migrate_orders()
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Migração de Pedidos Concluída ===")
        print("Pedidos migrados com sucesso!")
        
    except Exception as e:
        print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Erro na Migração ===")
        print(f"Erro: {str(e)}")
        print(f"\nStack trace completo:")
        traceback.print_exc()
        sys.exit(1)
