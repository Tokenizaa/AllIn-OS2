#!/usr/bin/env python3
"""
Script principal para execução do scrape de distribuidores do painel administrativo AllInBrasil
Baseado no padrão do script run_scrape.py
"""

import os
import sys
import time
import json
import re
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from supabase import create_client, Client

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Adicionar diretório scripts ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from scrape.auth import LojaVirtualAuth

# Configurações
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://kynbbidsjzfccelqpohu.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bmJiaWRzanpmY2NlbHFwb2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTM5OTUsImV4cCI6MjA5NjYyOTk5NX0.M5hew-WBZVBoikt-hKBdlJZpWy4M8hnBekFOaNrbueg')
ADMIN_BASE_URL = "https://allinbrasil.com.br/administracao"
DISTRIBUIDORES_INFO_URL = f"{ADMIN_BASE_URL}/Distribuidor/DistribuidoresInformacoes/principal"
BATCH_SIZE = 100  # Salvar no banco a cada 100 distribuidores
CHECKPOINT_FILE = "data/distribuidores_checkpoint.json"
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


def parse_currency(value):
    """Converter valor monetário brasileiro para float"""
    if not value or value.strip() == "":
        return 0.0
    # Remover R$, espaços e converter formato brasileiro
    cleaned = value.replace('R$', '').replace('.', '').replace(',', '.').strip()
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def parse_date(date_str):
    """Converter data brasileira para formato ISO"""
    if not date_str or date_str.strip() == "":
        return None
    try:
        # Formato brasileiro: DD/MM/YYYY
        parts = date_str.strip().split('/')
        if len(parts) == 3:
            return f"{parts[2]}-{parts[1]}-{parts[0]}"
        return date_str
    except:
        return None


def parse_datetime(datetime_str):
    """Converter data/hora brasileira para formato ISO"""
    if not datetime_str or datetime_str.strip() == "":
        return None
    try:
        # Formato brasileiro: DD/MM/YYYY HH:MM:SS
        parts = datetime_str.strip().split(' ')
        if len(parts) == 2:
            date_parts = parts[0].split('/')
            if len(date_parts) == 3:
                return f"{date_parts[2]}-{date_parts[1]}-{date_parts[0]} {parts[1]}"
        return datetime_str
    except:
        return None


def transform_distribuidor(row_data):
    """Transformar dados do distribuidor para formato do Supabase (estrutura exata da tabela real)"""
    return {
        "numero": row_data.get('distribuidor_id'),
        "usuario": row_data.get('usuario'),
        "nome": row_data.get('nome'),
        "motivo_exclusao": row_data.get('motivo_exclusao'),
        "indicador": row_data.get('patrocinador'),
        "qualificacoes_atuais": row_data.get('qualificacoes_atuais'),
        "tipo_pessoa": row_data.get('tipo_pessoa'),
        "cpf_cnpj": row_data.get('cpf_cnpj'),
        "rg_ie": row_data.get('rg'),
        "data_nascimento": parse_date(row_data.get('data_nascimento')),
        "sexo": row_data.get('sexo'),
        "pis": row_data.get('pis'),
        "email": row_data.get('email'),
        "resumo": row_data.get('resumo'),
        "endereco": row_data.get('endereco'),
        "numero_endereco": row_data.get('numero'),
        "complemento": row_data.get('complemento'),
        "cidade": row_data.get('cidade'),
        "uf": row_data.get('estado'),
        "cep": row_data.get('cep'),
        "fones": row_data.get('telefone'),
        "data_cadastro": parse_datetime(row_data.get('data_cadastro')),
        "tipo_cadastro": row_data.get('tipo_cadastro'),
        "pedido_plano_ini": row_data.get('pedido_plano_ini'),
        "plano_ini": row_data.get('plano_ini'),
        "data_plano_ini": parse_date(row_data.get('data_plano_ini')),
        "val_plano_ini": parse_currency(row_data.get('val_plano_ini')),
        "pedido_plano_atual": row_data.get('pedido_plano_atual'),
        "plano_atual": row_data.get('plano_atual'),
        "data_plano_atual": parse_date(row_data.get('data_plano_atual')),
        "val_plano_atual": parse_currency(row_data.get('val_plano_atual')),
        "ativo": row_data.get('status')
    }


def scrape_distribuidores(session, base_url, token, supabase_url, supabase_key, limit_distribuidores=None):
    """Scrape de distribuidores com batch processing"""
    print("\n🎯 Iniciando scrape de distribuidores...")
    
    # Configurar Supabase
    supabase: Client = create_client(supabase_url, supabase_key)
    
    # Carregar checkpoint
    checkpoint = load_checkpoint()
    start_page = checkpoint.get('last_page', 0) if checkpoint else 0
    processed_count = checkpoint.get('processed_count', 0) if checkpoint else 0
    
    print(f"📍 Retomando da página {start_page}")
    print(f"📊 {processed_count} distribuidores já processados")
    
    # Configurar paginação
    per_page = 20
    page = start_page
    batch_distribuidores = []
    
    while True:
        print(f"📄 Processando página {page + 1}...")
        
        # Construir URL com paginação
        if page == 0:
            url = DISTRIBUIDORES_INFO_URL
        else:
            # A paginação usa per_page como offset (página 1 = 0, página 2 = 20, página 3 = 40, etc.)
            url = f"{DISTRIBUIDORES_INFO_URL}?per_page={page * per_page}"
        
        # Fazer requisição com retry
        max_retries = 3
        retry_delay = 2
        
        for attempt in range(max_retries):
            try:
                response = session.get(url, headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                })
                
                if response.status_code != 200:
                    print(f"❌ Erro ao acessar página {page + 1}: {response.status_code}")
                    if attempt < max_retries - 1:
                        print(f"🔄 Tentando novamente em {retry_delay}s...")
                        time.sleep(retry_delay)
                        retry_delay *= 2
                        continue
                    else:
                        break
                
                # Se sucesso, sair do loop de retry
                break
                
            except Exception as e:
                print(f"❌ Erro de conexão na página {page + 1}: {e}")
                if attempt < max_retries - 1:
                    print(f"🔄 Tentando novamente em {retry_delay}s...")
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                else:
                    print("❌ Máximo de tentativas atingido. Abortando scrape.")
                    return
        
        # Parsear HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Encontrar tabela
        table = soup.find('table')
        if not table:
            print("⚠️ Tabela não encontrada")
            break
        
        # Extrair linhas da tabela
        tbody = table.find('tbody')
        if not tbody:
            print("⚠️ Tbody não encontrado")
            break
        
        rows = tbody.find_all('tr')
        
        if not rows:
            print("⚠️ Nenhuma linha encontrada, fim da paginação")
            break
        
        # Extrair dados de cada linha
        for row in rows:
            try:
                cells = row.find_all('td')
                if len(cells) >= 32:
                    distribuidor_data = {
                        'distribuidor_id': int(cells[0].text.strip()),
                        'usuario': cells[1].text.strip(),
                        'nome': cells[2].text.strip(),
                        'motivo_exclusao': cells[3].text.strip(),
                        'patrocinador': cells[4].text.strip(),
                        'qualificacoes_atuais': cells[5].text.strip(),
                        'tipo_pessoa': cells[6].text.strip(),
                        'cpf_cnpj': cells[7].text.strip(),
                        'rg': cells[8].text.strip(),
                        'data_nascimento': cells[9].text.strip(),
                        'sexo': cells[10].text.strip(),
                        'pis': cells[11].text.strip(),
                        'email': cells[12].text.strip(),
                        'resumo': cells[13].text.strip(),
                        'endereco': cells[14].text.strip(),
                        'numero': cells[15].text.strip(),
                        'complemento': cells[16].text.strip(),
                        'cidade': cells[17].text.strip(),
                        'estado': cells[18].text.strip(),
                        'cep': cells[19].text.strip(),
                        'telefone': cells[20].text.strip(),
                        'data_cadastro': cells[21].text.strip(),
                        'tipo_cadastro': cells[22].text.strip(),
                        'pedido_plano_ini': cells[23].text.strip(),
                        'plano_ini': cells[24].text.strip(),
                        'data_plano_ini': cells[25].text.strip(),
                        'val_plano_ini': cells[26].text.strip(),
                        'pedido_plano_atual': cells[27].text.strip(),
                        'plano_atual': cells[28].text.strip(),
                        'data_plano_atual': cells[29].text.strip(),
                        'val_plano_atual': cells[30].text.strip(),
                        'status': cells[31].text.strip()
                    }
                    
                    # Transformar dados
                    transformed_data = transform_distribuidor(distribuidor_data)
                    batch_distribuidores.append(transformed_data)
                    processed_count += 1
                    
                    # Aplicar limite se especificado
                    if limit_distribuidores and processed_count >= limit_distribuidores:
                        print(f"✅ Limite de {limit_distribuidores} distribuidores atingido")
                        break
                    
                    # Salvar batch quando atingir o tamanho limite
                    if len(batch_distribuidores) >= BATCH_SIZE:
                        print(f"💾 Salvando batch de {len(batch_distribuidores)} distribuidores no banco...")
                        
                        # Salvar no Supabase (estrutura exata da tabela real)
                        for dist_data in batch_distribuidores:
                            try:
                                # Verificar se distribuidor já existe por numero
                                existing = supabase.table('distribuidores').select('id').eq('numero', dist_data['numero']).execute()
                                
                                if existing and existing.data:
                                    # Atualizar distribuidor existente
                                    dist_id = existing.data[0]['id']
                                    supabase.table('distribuidores').update(dist_data).eq('id', dist_id).execute()
                                else:
                                    # Criar novo distribuidor
                                    supabase.table('distribuidores').insert(dist_data).execute()
                            except Exception as e:
                                print(f"❌ Erro ao salvar distribuidor {dist_data['numero']}: {e}")
                        
                        # Salvar backup JSON
                        save_to_json(batch_distribuidores, "distribuidores.json")
                        
                        # Salvar checkpoint
                        save_checkpoint({
                            'last_page': page,
                            'processed_count': processed_count
                        })
                        
                        # Limpar batch
                        batch_distribuidores = []
                        
                        # Pausa para não sobrecarregar
                        time.sleep(2)
            
            except Exception as e:
                print(f"❌ Erro ao processar linha: {e}")
                continue
        
        # Sair do loop se atingir o limite
        if limit_distribuidores and processed_count >= limit_distribuidores:
            break
        
        # Verificar se há mais páginas
        navigation = soup.find('nav')
        if not navigation:
            break
        
        # Verificar se há botão "próxima"
        next_button = navigation.find('a', string='>')
        if not next_button:
            break
        
        page += 1
        time.sleep(1)  # Rate limiting
    
    # Salvar dados restantes
    if batch_distribuidores:
        print(f"💾 Salvando {len(batch_distribuidores)} distribuidores restantes no banco...")
        
        for dist_data in batch_distribuidores:
            try:
                # Verificar se distribuidor já existe por numero
                existing = supabase.table('distribuidores').select('id').eq('numero', dist_data['numero']).execute()
                
                if existing and existing.data:
                    # Atualizar distribuidor existente
                    dist_id = existing.data[0]['id']
                    supabase.table('distribuidores').update(dist_data).eq('id', dist_id).execute()
                else:
                    # Criar novo distribuidor
                    supabase.table('distribuidores').insert(dist_data).execute()
            except Exception as e:
                print(f"❌ Erro ao salvar distribuidor {dist_data['numero']}: {e}")
        
        save_to_json(batch_distribuidores, "distribuidores.json")
    
    # Deletar checkpoint ao finalizar
    delete_checkpoint()
    
    print(f"✅ Scrape finalizado!")
    print(f"📊 {processed_count} distribuidores processados")


def main():
    print("🚀 Iniciando scrape de distribuidores do painel administrativo AllInBrasil")
    print(f"📅 Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 URL Supabase: {SUPABASE_URL}")
    print(f"🌐 URL Admin: {ADMIN_BASE_URL}")
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
    
    # 2. Executar scrape de distribuidores
    print("\n🎯 Iniciando scrape de distribuidores...")
    # Scrape completo
    scrape_distribuidores(session, ADMIN_BASE_URL, token, SUPABASE_URL, SUPABASE_KEY, limit_distribuidores=None)
    
    print("\n🎉 Scrape finalizado!")


if __name__ == '__main__':
    main()
