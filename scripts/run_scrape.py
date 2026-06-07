#!/usr/bin/env python3
"""
Script principal para execução do scrape completo da loja virtual AllInBrasil
Baseado em docs/reverse-engineering/loja-virtual-pedidos-mapping.md
"""

import os
import sys
import time
from datetime import datetime
from dotenv import load_dotenv

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
        return
    
    # 2. Executar scrape completo automático (alinhamento de dados)
    print("\n🎯 Iniciando scrape completo para alinhamento de dados...")
    # Scrape completo sem limites
    scrape_complete(session, loja_base_url, token, SUPABASE_URL, SUPABASE_KEY)
    
    print("\n🎉 Scrape finalizado!")


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
    """Scrape de orders com extração de customers dos dados dos pedidos"""
    print("\n📦 FASE: Scrape de Orders com Extração de Customers")
    
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
    customers_dict = {}  # Dicionário para evitar duplicatas de customers
    
    for i, order_id in enumerate(orders, 1):
        print(f"\n[{i}/{len(orders)}] Extraindo pedido {order_id}...")
        complete_order = extractor.extract_order_details(order_id)
        
        if complete_order:
            complete_orders.append(complete_order)
            
            # Extrair customer dos dados do pedido (aba #tab-order e #tab-distribuidor)
            customer = transformer.transform_customer_from_order(complete_order)
            if customer and customer['id_comprador']:
                customers_dict[customer['id_comprador']] = customer
            
            time.sleep(1)  # Rate limiting
        
        # Pausa a cada 50 pedidos para evitar sobrecarga
        if i % 50 == 0:
            print(f"\n⏸️ Pausa de 10 segundos após {i} pedidos...")
            time.sleep(10)
    
    # Transformar e carregar customers
    print(f"\n🔄 Transformando {len(customers_dict)} customers únicos...")
    customers_data = list(customers_dict.values())
    
    print(f"\n📥 Carregando {len(customers_data)} customers no Supabase...")
    loader.update_customers(customers_data)
    
    # Transformar e carregar orders
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
    print(f"✅ {len(customers_data)} customers carregados")


def scrape_complete(session, loja_base_url, token, supabase_url, supabase_key, limit_orders=None, limit_customers=None):
    """Scrape completo (customers extraídos dos pedidos + orders)"""
    print("\n🎯 FASE: Scrape Completo")
    
    # 1. Scrape de orders (customers serão extraídos dos dados dos pedidos)
    print("\n📦 Etapa 1: Scrape de Orders (com extração de customers)")
    scrape_orders_with_customers(session, loja_base_url, token, supabase_url, supabase_key, limit_orders=limit_orders)


if __name__ == '__main__':
    main()
