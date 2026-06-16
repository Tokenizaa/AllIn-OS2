#!/usr/bin/env python3
"""
Script principal para execução do scrape do Painel Administrativo AllInBrasil
Baseado em docs/AUDITORIA_LEGADA_ALLIN.md
v2.0 - Focado apenas nos endpoints do painel administrativo
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

from scrape.admin_auth import AdminAuth
from scrape.extractors.admin_extractors import AdminPlansExtractor, AdminDistribuidoresExtractor, AdminPedidosExtractor
from scrape.transformers.admin_transformers import AdminSupabaseTransformer
from scrape.loaders import SupabaseLoader

# Configurações
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://kynbbidsjzfccelqpohu.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bmJiaWRzanpmY2NlbHFwb2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTM5OTUsImV4cCI6MjA5NjYyOTk5NX0.M5hew-WBZVBoikt-hKBdlJZpWy4M8hnBekFOaNrbueg')
BATCH_SIZE = 100
CHECKPOINT_FILE = "data/admin_checkpoint.json"
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
        print(f"💾 Salvando backup JSON: {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Backup JSON salvo: {filepath}")
    except Exception as e:
        print(f"❌ Erro ao salvar backup JSON {filename}: {e}")


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
    data['timestamp'] = datetime.now().isoformat()
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(data, f, indent=2)


def delete_checkpoint():
    """Deletar checkpoint"""
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)


def scrape_planos(session, admin_base_url, supabase_url, supabase_key):
    """Scrape de Planos (Adesões) do painel administrativo"""
    print("\n📋 FASE: Scraping de Planos (Adesões)")
    
    extractor = AdminPlansExtractor(session, admin_base_url)
    transformer = AdminSupabaseTransformer(supabase_url, supabase_key)
    loader = SupabaseLoader(supabase_url, supabase_key)
    
    # Extrair planos ativos
    planos = extractor.extract_planos_ativos()
    
    if not planos:
        print("⚠️ Nenhum plano encontrado.")
        return
    
    print(f"\n📊 {len(planos)} planos encontrados")
    
    # Transformar
    planos_transformados = [transformer.transform_plano(p) for p in planos]
    
    # Carregar no Supabase
    print(f"\n📥 Carregando {len(planos_transformados)} planos no Supabase...")
    try:
        loader.supabase.table('plans').upsert(planos_transformados).execute()
        print(f"✅ {len(planos_transformados)} planos carregados no Supabase")
    except Exception as e:
        print(f"❌ Erro ao carregar planos: {e}")
        print(f"💾 Salvando backup JSON...")
        save_to_json(planos_transformados, 'admin_planos.json')


def scrape_planos_vendidos(session, admin_base_url, supabase_url, supabase_key, limit=None):
    """Scrape de Planos Vendidos com paginação e batch processing"""
    print("\n📊 FASE: Scraping de Planos Vendidos")
    
    ensure_json_backup_dir()
    checkpoint = load_checkpoint()
    
    extractor = AdminPlansExtractor(session, admin_base_url)
    transformer = AdminSupabaseTransformer(supabase_url, supabase_key)
    loader = SupabaseLoader(supabase_url, supabase_key)
    
    # Consultar estado atual do banco
    try:
        from supabase import create_client
        supabase_client = create_client(supabase_url, supabase_key)
        customer_plans_result = supabase_client.table('customer_plans').select('id').execute()
        current_customer_plans = len(customer_plans_result.data) if customer_plans_result.data else 0
        print(f"\n📊 customer_plans no banco: {current_customer_plans}")
    except Exception as e:
        print(f"⚠️ Erro ao consultar estado do banco: {e}")
        current_customer_plans = 0
    
    planos_vendidos = []
    per_page = 20
    total_processed = 0
    
    if checkpoint:
        print(f"\n🔄 Retomando do checkpoint: {checkpoint.get('processed', 0)} planos processados")
        per_page = checkpoint.get('per_page', 20)
        total_processed = checkpoint.get('processed', 0)
    
    batch_planos = []
    
    while True:
        print(f"\n📄 Extraindo página {per_page // 20 + 1} (offset: {per_page})...")
        
        url = f"{extractor.planos_vendidos_url}?per_page={per_page}"
        response = session.get(url)
        
        if response.status_code != 200:
            print(f"❌ Erro ao acessar página: {response.status_code}")
            break
        
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table')
        
        if not table:
            print(f"✅ Fim da paginação")
            break
        
        rows = table.select('tbody tr')
        
        if not rows or len(rows) == 0:
            print(f"✅ Fim da paginação")
            break
        
        page_planos = []
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 6:
                plano_vendido = {
                    'numero_compra': cells[0].text.strip(),
                    'distribuidor': cells[1].text.strip(),
                    'plano': cells[2].text.strip(),
                    'data_pagamento': cells[3].text.strip(),
                    'data_ultima_modificacao': cells[4].text.strip(),
                    'valor': cells[5].text.strip()
                }
                page_planos.append(plano_vendido)
                total_processed += 1
        
        if not page_planos:
            print(f"✅ Fim da paginação")
            break
        
        # Transformar e adicionar ao batch
        for pv in page_planos:
            plano_transformado = transformer.transform_plano_vendido(pv)
            batch_planos.append(plano_transformado)
        
        print(f"   📊 {len(page_planos)} planos nesta página | Batch: {len(batch_planos)}/{BATCH_SIZE}")
        
        # Verificar limite
        if limit and total_processed >= limit:
            print(f"✅ Limite de {limit} planos atingido")
            break
        
        # Salvar batch
        if len(batch_planos) >= BATCH_SIZE:
            print(f"\n💾 Salvando batch de {len(batch_planos)} planos...")
            try:
                loader.supabase.table('customer_plans').upsert(batch_planos).execute()
                print(f"✅ {len(batch_planos)} planos carregados no Supabase")
                save_to_json(batch_planos, f'admin_customer_plans_batch_{total_processed}.json')
            except Exception as e:
                print(f"❌ Erro ao carregar batch: {e}")
                save_to_json(batch_planos, f'admin_customer_plans_batch_{total_processed}_error.json')
            
            # Salvar checkpoint
            save_checkpoint({
                'processed': total_processed,
                'per_page': per_page + 20
            })
            
            batch_planos = []
        
        per_page += 20
        time.sleep(0.5)
    
    # Salvar dados restantes
    if batch_planos:
        print(f"\n💾 Salvando {len(batch_planos)} planos restantes...")
        try:
            loader.supabase.table('customer_plans').upsert(batch_planos).execute()
            print(f"✅ {len(batch_planos)} planos carregados no Supabase")
        except Exception as e:
            print(f"❌ Erro ao carregar planos restantes: {e}")
        save_to_json(batch_planos, 'admin_customer_plans_final.json')
    
    print(f"\n✅ {total_processed} planos vendidos processados no total")
    delete_checkpoint()


def scrape_distribuidores(session, admin_base_url, supabase_url, supabase_key, limit=None):
    """Scrape de Distribuidores com paginação e batch processing"""
    print("\n👥 FASE: Scraping de Distribuidores")
    
    ensure_json_backup_dir()
    checkpoint = load_checkpoint()
    
    extractor = AdminDistribuidoresExtractor(session, admin_base_url)
    transformer = AdminSupabaseTransformer(supabase_url, supabase_key)
    loader = SupabaseLoader(supabase_url, supabase_key)
    
    # Consultar estado atual do banco
    try:
        from supabase import create_client
        supabase_client = create_client(supabase_url, supabase_key)
        distribuidores_result = supabase_client.table('distributors').select('id').execute()
        current_distribuidores = len(distribuidores_result.data) if distribuidores_result.data else 0
        print(f"\n📊 distributors no banco: {current_distribuidores}")
    except Exception as e:
        print(f"⚠️ Erro ao consultar estado do banco: {e}")
        current_distribuidores = 0
    
    distribuidores = []
    per_page = 20
    total_processed = 0
    
    if checkpoint:
        print(f"\n🔄 Retomando do checkpoint: {checkpoint.get('processed', 0)} distribuidores processados")
        per_page = checkpoint.get('per_page', 20)
        total_processed = checkpoint.get('processed', 0)
    
    batch_distribuidores = []
    
    while True:
        print(f"\n📄 Extraindo página {per_page // 20 + 1} (offset: {per_page})...")
        
        url = f"{extractor.distribuidores_url}?per_page={per_page}"
        response = session.get(url)
        
        if response.status_code != 200:
            print(f"❌ Erro ao acessar página: {response.status_code}")
            break
        
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table')
        
        if not table:
            print(f"✅ Fim da paginação")
            break
        
        rows = table.select('tbody tr')
        
        if not rows or len(rows) == 0:
            print(f"✅ Fim da paginação")
            break
        
        page_distribuidores = []
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 8:
                distribuidor = {
                    'numero': cells[0].text.strip(),
                    'usuario': cells[2].text.strip(),
                    'nome_completo': cells[3].text.strip(),
                    'email': cells[4].text.strip(),
                    'patrocinador': cells[5].text.strip(),
                    'cidade': cells[6].text.strip(),
                    'estado': cells[7].text.strip(),
                    'ativo': cells[8].text.strip() if len(cells) > 8 else '',
                    'data_cadastro': cells[9].text.strip() if len(cells) > 9 else ''
                }
                page_distribuidores.append(distribuidor)
                total_processed += 1
        
        if not page_distribuidores:
            print(f"✅ Fim da paginação")
            break
        
        # Transformar e adicionar ao batch
        for dist in page_distribuidores:
            dist_transformado = transformer.transform_distribuidor(dist)
            batch_distribuidores.append(dist_transformado)
        
        print(f"   📊 {len(page_distribuidores)} distribuidores nesta página | Batch: {len(batch_distribuidores)}/{BATCH_SIZE}")
        
        # Verificar limite
        if limit and total_processed >= limit:
            print(f"✅ Limite de {limit} distribuidores atingido")
            break
        
        # Salvar batch
        if len(batch_distribuidores) >= BATCH_SIZE:
            print(f"\n💾 Salvando batch de {len(batch_distribuidores)} distribuidores...")
            try:
                loader.supabase.table('distributors').upsert(batch_distribuidores).execute()
                print(f"✅ {len(batch_distribuidores)} distribuidores carregados no Supabase")
                save_to_json(batch_distribuidores, f'admin_distributors_batch_{total_processed}.json')
            except Exception as e:
                print(f"❌ Erro ao carregar batch: {e}")
                save_to_json(batch_distribuidores, f'admin_distributors_batch_{total_processed}_error.json')
            
            # Salvar checkpoint
            save_checkpoint({
                'processed': total_processed,
                'per_page': per_page + 20
            })
            
            batch_distribuidores = []
        
        per_page += 20
        time.sleep(0.5)
    
    # Salvar dados restantes
    if batch_distribuidores:
        print(f"\n💾 Salvando {len(batch_distribuidores)} distribuidores restantes...")
        try:
            loader.supabase.table('distributors').upsert(batch_distribuidores).execute()
            print(f"✅ {len(batch_distribuidores)} distribuidores carregados no Supabase")
        except Exception as e:
            print(f"❌ Erro ao carregar distribuidores restantes: {e}")
        save_to_json(batch_distribuidores, 'admin_distributors_final.json')
    
    print(f"\n✅ {total_processed} distribuidores processados no total")
    delete_checkpoint()


def main():
    print("🚀 Iniciando scrape do Painel Administrativo AllInBrasil")
    print(f"📅 Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 URL Supabase: {SUPABASE_URL}")
    print("-" * 60)
    
    # 1. Autenticar no painel administrativo
    print("\n🔐 FASE 1: Autenticação")
    admin_auth = AdminAuth()
    if not admin_auth.login():
        print("❌ Falha na autenticação. Abortando.")
        return
    
    session = admin_auth.get_session()
    admin_base_url = admin_auth.admin_base_url
    
    try:
        # 2. Scrape de Planos (Adesões)
        scrape_planos(session, admin_base_url, SUPABASE_URL, SUPABASE_KEY)
        
        # 3. Scrape de Planos Vendidos
        scrape_planos_vendidos(session, admin_base_url, SUPABASE_URL, SUPABASE_KEY, limit=None)
        
        # 4. Scrape de Distribuidores
        scrape_distribuidores(session, admin_base_url, SUPABASE_URL, SUPABASE_KEY, limit=None)
        
        print("\n🎉 Scrape do Painel Administrativo finalizado!")
    finally:
        admin_auth.close()


if __name__ == "__main__":
    main()
