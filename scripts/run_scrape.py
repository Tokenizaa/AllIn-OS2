#!/usr/bin/env python3
"""
Script principal para execução do scrape completo da loja virtual AllInBrasil
Baseado em docs/reverse-engineering/loja-virtual-pedidos-mapping.md
v2.0 - Batch processing com salvamento a cada 100 pedidos
"""

import os
import sys
import time
import json
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Adicionar diretório scripts ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from scrape.auth import LojaVirtualAuth
from scrape.extractors import OrdersExtractor, CustomersExtractor
from scrape.transformers import SupabaseTransformer
from scrape.loaders import SupabaseLoader

# Configurações
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://isjsydhuqurneswstlyx.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
LOJA_VIRTUAL_BASE_URL = "https://allinbrasil.com.br/loja/admin"
BATCH_SIZE = 100  # Salvar no banco a cada 100 pedidos
CHECKPOINT_FILE = "data/checkpoint.json"
# Usar caminho absoluto para o diretório de backup JSON
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_BACKUP_DIR = os.path.join(SCRIPT_DIR, "data", "json_backup")


def ensure_json_backup_dir():
    """Criar diretório de backup JSON se não existir"""
    if not os.path.exists(JSON_BACKUP_DIR):
        os.makedirs(JSON_BACKUP_DIR)
        print(f"📁 Diretório de backup JSON criado: {JSON_BACKUP_DIR}")


def save_to_json(data, filename):
    """Salvar dados em arquivo JSON"""
    try:
        filepath = os.path.join(JSON_BACKUP_DIR, filename)
        print(f"💾 Tentando salvar backup JSON: {filepath}")
        print(f"💾 Quantidade de dados: {len(data)}")
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Backup JSON salvo: {filepath}")
    except Exception as e:
        print(f"❌ Erro ao salvar backup JSON {filename}: {e}")
        import traceback
        traceback.print_exc()


def load_from_json(filename):
    """Carregar dados de arquivo JSON"""
    try:
        filepath = os.path.join(JSON_BACKUP_DIR, filename)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"❌ Erro ao carregar backup JSON {filename}: {e}")
    return None


def load_checkpoint():
    """Carregar checkpoint se existir"""
    if os.path.exists(CHECKPOINT_FILE):
        try:
            with open(CHECKPOINT_FILE, 'r') as f:
                return json.load(f)
        except:
            return None
    return None


def save_checkpoint(data):
    """Salvar checkpoint"""
    os.makedirs(os.path.dirname(CHECKPOINT_FILE), exist_ok=True)
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(data, f, indent=2)


def delete_checkpoint():
    """Deletar checkpoint"""
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)


def main():
    print("🚀 Iniciando scrape completo da loja virtual AllInBrasil")
    print(f"📅 Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 URL Supabase: {SUPABASE_URL}")
    print(f"🌐 URL Loja Virtual: {LOJA_VIRTUAL_BASE_URL}")
    print("-" * 60)
    
    # 1. Autenticar na loja virtual
    print("\n🔐 FASE 1: Autenticação")
    auth = LojaVirtualAuth()
    if not auth.login():
        print("❌ Falha na autenticação. Abortando.")
        return
    
    session = auth.get_session()
    token = auth.token
    loja_base_url = auth.loja_base_url
    
    if not token or not loja_base_url:
        print("❌ Token ou URL base da loja não encontrados. Abortando.")
        auth.close()
        return
    
    try:
        # 2. Executar scrape completo automático (alinhamento de dados)
        print("\n🎯 Iniciando scrape completo para alinhamento de dados...")
        # Scrape completo sem limites - usando função corrigida com batch processing
        scrape_orders_with_customers(session, loja_base_url, token, SUPABASE_URL, SUPABASE_KEY, limit_orders=None)
        
        print("\n🎉 Scrape finalizado!")
    finally:
        # Sempre fechar a sessão para liberar recursos
        auth.close()


def scrape_gap(session, loja_base_url, token, supabase_url, supabase_key):
    """Scrape de gap de dados (2026-04-19 a 2026-06-06)"""
    print("\n📅 FASE: Scrape de Gap (2026-04-19 a 2026-06-06)")
    
    extractor = OrdersExtractor(session, loja_base_url, token)
    
    # Extrair pedidos do gap
    orders = extractor.extract_orders_list(
        start_date='2026-04-19',
        end_date='2026-06-06'
    )
    
    if not orders:
        print("⚠️ Nenhum pedido encontrado no gap.")
        return
    
    print(f"\n📊 {len(orders)} pedidos encontrados no gap")
    
    # Extrair detalhes
    transformer = SupabaseTransformer(supabase_url, supabase_key)
    loader = SupabaseLoader(supabase_url, supabase_key)
    
    complete_orders = []
    for i, order_id in enumerate(orders, 1):
        print(f"\n[{i}/{len(orders)}] Extraindo pedido {order_id}...")
        complete_order = extractor.extract_order_details(order_id)
        
        if complete_order:
            complete_orders.append(complete_order)
            time.sleep(1)  # Rate limiting
    
    # Transformar e carregar
    print(f"\n🔄 Transformando {len(complete_orders)} pedidos...")
    
    orders_data = []
    for pedido in complete_orders:
        order = transformer.transform_order(pedido)
        orders_data.append(order)
    
    print(f"\n📥 Carregando {len(orders_data)} orders no Supabase...")
    loader.update_orders(orders_data)


def scrape_customers(session, loja_base_url, token, supabase_url, supabase_key, limit_customers=None):
    """Scrape de customers (email, CPF)"""
    print("\n👥 FASE: Scrape de Customers")
    
    extractor = CustomersExtractor(session, loja_base_url, token)
    
    # Extrair lista de customers (com limite se especificado)
    customers = extractor.extract_customers_list(limit=limit_customers)
    
    if not customers:
        print("⚠️ Nenhum customer encontrado.")
        return
    
    print(f"\n📊 {len(customers)} customers encontrados")
    
    # Extrair detalhes
    transformer = SupabaseTransformer(supabase_url, supabase_key)
    loader = SupabaseLoader(supabase_url, supabase_key)
    
    customers_data = []
    for i, customer_id in enumerate(customers, 1):
        print(f"\n[{i}/{len(customers)}] Extraindo customer {customer_id}...")
        customer = extractor.extract_customer_details(customer_id)
        
        if customer:
            customers_data.append(customer)
            time.sleep(0.5)  # Rate limiting
    
    print(f"\n📥 Carregando {len(customers_data)} customers no Supabase...")
    loader.update_customers(customers_data)


def scrape_orders(session, loja_base_url, token, supabase_url, supabase_key, limit_orders=None):
    """Scrape completo de orders"""
    print("\n📦 FASE: Scrape Completo de Orders")
    
    extractor = OrdersExtractor(session, loja_base_url, token)
    
    # Extrair lista de pedidos (com limite se especificado)
    orders = extractor.extract_orders_list(limit=limit_orders)
    
    if not orders:
        print("⚠️ Nenhum pedido encontrado.")
        return
    
    print(f"\n📊 {len(orders)} pedidos encontrados")
    
    # Extrair detalhes
    transformer = SupabaseTransformer(supabase_url, supabase_key)
    loader = SupabaseLoader(supabase_url, supabase_key)
    
    complete_orders = []
    for i, order_id in enumerate(orders, 1):
        print(f"\n[{i}/{len(orders)}] Extraindo pedido {order_id}...")
        complete_order = extractor.extract_order_details(order_id)
        
        if complete_order:
            complete_orders.append(complete_order)
            time.sleep(1)  # Rate limiting
        
        # Pausa a cada 50 pedidos para evitar sobrecarga
        if i % 50 == 0:
            print(f"\n⏸️ Pausa de 10 segundos após {i} pedidos...")
            time.sleep(10)
    
    # Transformar e carregar
    print(f"\n🔄 Transformando {len(complete_orders)} pedidos...")
    
    orders_data = []
    all_order_items = []
    
    for pedido in complete_orders:
        order = transformer.transform_order(pedido)
        orders_data.append(order)
        
        order_items = transformer.transform_order_items(pedido)
        all_order_items.extend(order_items)
    
    print(f"\n📥 Carregando {len(orders_data)} orders no Supabase...")
    loader.update_orders(orders_data)
    
    print(f"\n📥 Carregando {len(all_order_items)} order_items no Supabase...")
    # Carregar order_items
    # Agrupar itens por order_id para deletar e inserir em lote
    items_by_order = {}
    for item_data in all_order_items:
        order_id = item_data['order_id']
        if order_id not in items_by_order:
            items_by_order[order_id] = []
        items_by_order[order_id].append(item_data)
    
    # Para cada order_id, deletar itens existentes e inserir novos
    for order_id, items in items_by_order.items():
        try:
            # Deletar itens existentes para este order_id
            loader.supabase.table('order_items').delete().eq('order_id', order_id).execute()
            # Inserir novos itens em lote
            loader.supabase.table('order_items').insert(items).execute()
        except Exception as e:
            print(f"❌ Erro ao carregar order_items para order {order_id}: {e}")
    
    print(f"✅ {len(all_order_items)} order_items carregados")


def scrape_orders_with_customers(session, loja_base_url, token, supabase_url, supabase_key, limit_orders=None):
    """Scrape de orders com extração de customers dos dados dos pedidos - v2.0 com batch processing"""
    print("\n📦 FASE: Scrape de Orders com Extração de Customers (v2.0 - Batch Processing)")
    
    # Criar diretório de backup JSON
    ensure_json_backup_dir()
    
    # Verificar checkpoint
    checkpoint = load_checkpoint()
    if checkpoint:
        print(f"🔄 Checkpoint encontrado: {checkpoint['processed_orders']} pedidos processados")
        print(f"🔄 Último pedido processado: {checkpoint['last_order_id']}")
    
    extractor = OrdersExtractor(session, loja_base_url, token)
    transformer = SupabaseTransformer(supabase_url, supabase_key)
    loader = SupabaseLoader(supabase_url, supabase_key)
    
    complete_orders = []
    customers_dict = {}  # Dicionário para evitar duplicatas de customers
    batch_customers_dict = {}  # Customers do batch atual
    batch_orders_data = []
    batch_order_items = []
    
    # Estrutura para backup JSON
    all_customers_json = []
    all_orders_json = []
    all_order_items_json = []
    
    # Extrair lista de pedidos e processar imediatamente
    orders = []
    per_page = 15
    total_processed = 0
    
    # Se retomando de checkpoint, começar do offset correto
    start_offset = 0
    if checkpoint and checkpoint.get('last_order_id'):
        # Tentar encontrar o offset do último pedido
        start_offset = checkpoint.get('processed_orders', 0)
        per_page = start_offset + 15
        print(f"🔄 Retomando do offset: {per_page}")
    
    while True:
        print(f"📄 Extraindo pedidos (offset: {per_page})...")
        
        url = f"{loja_base_url}/sale/order?token={token}&per_page={per_page}"
        
        try:
            response = session.get(url)
            
            if response.status_code != 200:
                print(f"❌ Erro ao acessar página (offset: {per_page}): {response.status_code}")
                break
            
            soup = BeautifulSoup(response.text, 'html.parser')
            order_rows = soup.select('table tbody tr')
            
            if not order_rows or len(order_rows) == 0:
                print(f"✅ Fim da paginação (offset: {per_page})")
                break
            
            # Extrair IDs desta página
            page_orders = []
            for row in order_rows:
                cells = row.select('td')
                if cells:
                    order_id = cells[0].text.strip()
                    if order_id and order_id != 'Nº':
                        page_orders.append(order_id)
            
            # Se não encontrou novos pedidos, fim da paginação
            if not page_orders:
                print(f"✅ Fim da paginação (offset: {per_page})")
                break
            
            # Processar cada pedido imediatamente
            for order_id in page_orders:
                # Pular se já foi processado (checkpoint)
                if checkpoint and checkpoint.get('last_order_id'):
                    if order_id == checkpoint['last_order_id']:
                        checkpoint = None  # Último pedido encontrado, continuar
                        continue
                    if checkpoint:
                        continue  # Ainda não chegou ao último pedido
                
                # Verificar limite
                if limit_orders and total_processed >= limit_orders:
                    print(f"✅ Limite de {limit_orders} pedidos atingido")
                    # Salvar dados restantes antes de sair
                    if batch_customers_dict:
                        customers_data = list(batch_customers_dict.values())
                        print(f"\n📥 Carregando {len(customers_data)} customers restantes no Supabase...")
                        loader.update_customers(customers_data)
                        
                        # Salvar backup JSON dos customers restantes
                        all_customers_json.extend(customers_data)
                        print(f"💾 Chamando save_to_json para customers com {len(all_customers_json)} registros")
                        save_to_json(all_customers_json, 'customers.json')
                    
                    if batch_orders_data:
                        print(f"\n📥 Carregando {len(batch_orders_data)} orders restantes no Supabase...")
                        loader.update_orders(batch_orders_data)
                        
                        # Salvar backup JSON das orders restantes
                        all_orders_json.extend(batch_orders_data)
                        print(f"💾 Chamando save_to_json para orders com {len(all_orders_json)} registros")
                        save_to_json(all_orders_json, 'orders.json')
                        
                        # Obter UUIDs das orders salvas
                        order_uuids = {}
                        for order_data in batch_orders_data:
                            numero_pedido = order_data['numero_pedido']
                            try:
                                result = loader.supabase.table('orders').select('id').eq('numero_pedido', numero_pedido).execute()
                                if result.data:
                                    order_uuids[numero_pedido] = result.data[0]['id']
                            except Exception as e:
                                print(f"⚠️ Erro ao obter UUID para pedido {numero_pedido}: {e}")
                    
                    if batch_order_items:
                        print(f"\n📥 Carregando {len(batch_order_items)} order_items restantes no Supabase...")
                        items_by_order = {}
                        for item_data in batch_order_items:
                            order_numero = item_data['order_id']
                            if order_numero in order_uuids:
                                item_data['order_id'] = order_uuids[order_numero]
                            else:
                                continue
                            
                            order_id_item = item_data['order_id']
                            if order_id_item not in items_by_order:
                                items_by_order[order_id_item] = []
                            items_by_order[order_id_item].append(item_data)
                        
                        for order_id_item, items in items_by_order.items():
                            try:
                                loader.supabase.table('order_items').delete().eq('order_id', order_id_item).execute()
                                loader.supabase.table('order_items').insert(items).execute()
                            except Exception as e:
                                print(f"❌ Erro ao carregar order_items para order {order_id_item}: {e}")
                        
                        # Salvar backup JSON dos order_items restantes
                        all_order_items_json.extend(batch_order_items)
                        print(f"💾 Chamando save_to_json para order_items com {len(all_order_items_json)} registros")
                        save_to_json(all_order_items_json, 'order_items.json')
                    
                    # Manter checkpoint para permitir retomada
                    print(f"✅ {total_processed} pedidos processados")
                    print(f"✅ {len(customers_dict)} customers únicos extraídos")
                    return
                
                total_processed += 1
                print(f"\n[{total_processed}] Extraindo pedido {order_id}...")
                complete_order = extractor.extract_order_details(order_id)
                
                if complete_order:
                    complete_orders.append(complete_order)
                    
                    # Extrair customer dos dados do pedido
                    customer = transformer.transform_customer_from_order(complete_order)
                    if customer and customer['id_comprador']:
                        customers_dict[customer['id_comprador']] = customer
                        batch_customers_dict[customer['id_comprador']] = customer
                    
                    # Transformar order e order_items para o batch
                    order = transformer.transform_order(complete_order)
                    batch_orders_data.append(order)
                    
                    order_items = transformer.transform_order_items(complete_order)
                    batch_order_items.extend(order_items)
                    
                    time.sleep(2)  # Rate limiting aumentado para evitar esgotamento de portas
                else:
                    print(f"⚠️ Falha ao extrair pedido {order_id}")
                
                # Salvar no banco a cada BATCH_SIZE pedidos
                if len(batch_orders_data) >= BATCH_SIZE:
                    print(f"\n💾 Salvando batch de {len(batch_orders_data)} pedidos no banco...")
                    
                    # Salvar customers do batch
                    if batch_customers_dict:
                        customers_data = list(batch_customers_dict.values())
                        print(f"📥 Carregando {len(customers_data)} customers no Supabase...")
                        loader.update_customers(customers_data)
                        
                        # Salvar backup JSON dos customers
                        all_customers_json.extend(customers_data)
                        save_to_json(all_customers_json, 'customers.json')
                        
                        batch_customers_dict = {}
                    
                    # Salvar orders do batch e obter UUIDs
                    order_uuids = {}  # Mapear numero_pedido -> UUID
                    if batch_orders_data:
                        print(f"📥 Carregando {len(batch_orders_data)} orders no Supabase...")
                        loader.update_orders(batch_orders_data)
                        
                        # Salvar backup JSON das orders
                        all_orders_json.extend(batch_orders_data)
                        save_to_json(all_orders_json, 'orders.json')
                        
                        # Obter UUIDs das orders salvas
                        for order_data in batch_orders_data:
                            numero_pedido = order_data['numero_pedido']
                            # Buscar UUID da order pelo numero_pedido
                            try:
                                result = loader.supabase.table('orders').select('id').eq('numero_pedido', numero_pedido).execute()
                                if result.data:
                                    order_uuids[numero_pedido] = result.data[0]['id']
                            except Exception as e:
                                print(f"⚠️ Erro ao obter UUID para pedido {numero_pedido}: {e}")
                    
                    # Salvar order_items do batch usando UUIDs corretos
                    if batch_order_items:
                        print(f"📥 Carregando {len(batch_order_items)} order_items no Supabase...")
                        items_by_order = {}
                        
                        # Remover duplicatas dentro do batch (mesmo order_id, product_code, product_name, quantity, size, variant)
                        seen_items = set()
                        unique_items = []
                        for item_data in batch_order_items:
                            # Usar UUID correto em vez de numero_pedido
                            order_numero = item_data['order_id']
                            if order_numero in order_uuids:
                                item_data['order_id'] = order_uuids[order_numero]
                            else:
                                print(f"⚠️ UUID não encontrado para pedido {order_numero}")
                                continue
                            
                            # Criar chave única para evitar duplicatas (incluindo todos os campos relevantes)
                            item_key = (
                                item_data['order_id'], 
                                item_data.get('product_code', ''), 
                                item_data.get('product_name', ''),
                                item_data.get('quantity', 0),
                                item_data.get('size', ''),
                                item_data.get('variant', '')
                            )
                            if item_key not in seen_items:
                                seen_items.add(item_key)
                                unique_items.append(item_data)
                        
                        print(f"📥 {len(unique_items)} itens únicos após remover duplicatas (de {len(batch_order_items)} originais)")
                        
                        # Agrupar por order_id
                        for item_data in unique_items:
                            order_id_item = item_data['order_id']
                            if order_id_item not in items_by_order:
                                items_by_order[order_id_item] = []
                            items_by_order[order_id_item].append(item_data)
                        
                        for order_id_item, items in items_by_order.items():
                            try:
                                loader.supabase.table('order_items').delete().eq('order_id', order_id_item).execute()
                                loader.supabase.table('order_items').insert(items).execute()
                            except Exception as e:
                                print(f"❌ Erro ao carregar order_items para order {order_id_item}: {e}")
                        
                        # Salvar backup JSON dos order_items
                        all_order_items_json.extend(unique_items)
                        save_to_json(all_order_items_json, 'order_items.json')
                        
                        batch_order_items = []
                    
                    # Salvar checkpoint
                    checkpoint_data = {
                        'processed_orders': total_processed,
                        'last_order_id': order_id,
                        'timestamp': datetime.now().isoformat()
                    }
                    save_checkpoint(checkpoint_data)
                    print(f"✅ Checkpoint salvo: {total_processed} pedidos processados")
                    
                    # Limpar batch
                    batch_orders_data = []
                
                # Pausa a cada 50 pedidos
                if total_processed % 50 == 0:
                    print(f"\n⏸️ Pausa de 10 segundos após {total_processed} pedidos...")
                    time.sleep(10)
            
            per_page += 15
            time.sleep(1)  # Aumentado de 0.5 para 1 para reduzir pressão no servidor
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Erro ao extrair página (offset: {per_page}): {e}")
            
            # Tratamento específico para WinError 10048 (esgotamento de portas)
            if "WinError 10048" in error_msg or "10048" in error_msg:
                print("⚠️ Esgotamento de portas detectado. Aguardando 30 segundos para retomar...")
                time.sleep(30)
                continue  # Tentar novamente com o mesmo offset
            else:
                break  # Outros erros: parar o scrape
    
    # Salvar dados restantes
    print(f"\n📊 Salvando dados restantes...")
    print(f"📊 batch_customers_dict: {len(batch_customers_dict)}")
    print(f"📊 batch_orders_data: {len(batch_orders_data)}")
    print(f"📊 batch_order_items: {len(batch_order_items)}")
    
    if batch_customers_dict:
        customers_data = list(batch_customers_dict.values())
        print(f"\n📥 Carregando {len(customers_data)} customers restantes no Supabase...")
        loader.update_customers(customers_data)
        
        # Salvar backup JSON dos customers restantes
        all_customers_json.extend(customers_data)
        print(f"💾 Chamando save_to_json para customers com {len(all_customers_json)} registros")
        save_to_json(all_customers_json, 'customers.json')
    else:
        print("⚠️ batch_customers_dict está vazio")
    
    if batch_orders_data:
        print(f"\n📥 Carregando {len(batch_orders_data)} orders restantes no Supabase...")
        loader.update_orders(batch_orders_data)
        
        # Salvar backup JSON das orders restantes
        all_orders_json.extend(batch_orders_data)
        print(f"💾 Chamando save_to_json para orders com {len(all_orders_json)} registros")
        save_to_json(all_orders_json, 'orders.json')
        
        # Obter UUIDs das orders salvas
        order_uuids = {}
        for order_data in batch_orders_data:
            numero_pedido = order_data['numero_pedido']
            try:
                result = loader.supabase.table('orders').select('id').eq('numero_pedido', numero_pedido).execute()
                if result.data:
                    order_uuids[numero_pedido] = result.data[0]['id']
            except Exception as e:
                print(f"⚠️ Erro ao obter UUID para pedido {numero_pedido}: {e}")
    else:
        print("⚠️ batch_orders_data está vazio")
    
    if batch_order_items:
        print(f"\n📥 Carregando {len(batch_order_items)} order_items restantes no Supabase...")
        items_by_order = {}
        for item_data in batch_order_items:
            order_numero = item_data['order_id']
            if order_numero in order_uuids:
                item_data['order_id'] = order_uuids[order_numero]
            else:
                continue
            
            order_id_item = item_data['order_id']
            if order_id_item not in items_by_order:
                items_by_order[order_id_item] = []
            items_by_order[order_id_item].append(item_data)
        
        for order_id_item, items in items_by_order.items():
            try:
                loader.supabase.table('order_items').delete().eq('order_id', order_id_item).execute()
                loader.supabase.table('order_items').insert(items).execute()
            except Exception as e:
                print(f"❌ Erro ao carregar order_items para order {order_id_item}: {e}")
        
        # Salvar backup JSON dos order_items restantes
        all_order_items_json.extend(batch_order_items)
        save_to_json(all_order_items_json, 'order_items.json')
    
    # Manter checkpoint para permitir retomada futura
    # Se quiser começar do zero, delete manualmente o arquivo data/checkpoint.json
    print(f"✅ Checkpoint mantido - scrape finalizado (para retomar do último ponto)")
    print(f"✅ {total_processed} pedidos processados")
    print(f"✅ {len(customers_dict)} customers únicos extraídos")
    print(f"💡 Para começar do zero, delete o arquivo: {CHECKPOINT_FILE}")


def scrape_complete(session, loja_base_url, token, supabase_url, supabase_key, limit_orders=None, limit_customers=None):
    """Scrape completo (customers extraídos dos pedidos + orders)"""
    print("\n🎯 FASE: Scrape Completo")
    
    # 1. Scrape de orders (customers serão extraídos dos dados dos pedidos)
    print("\n📦 Etapa 1: Scrape de Orders (com extração de customers)")
    scrape_orders_with_customers(session, loja_base_url, token, supabase_url, supabase_key, limit_orders=limit_orders)


if __name__ == '__main__':
    main()
