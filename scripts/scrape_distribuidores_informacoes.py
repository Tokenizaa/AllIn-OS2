#!/usr/bin/env python3
"""
Script para extrair dados de informações de distribuidores do painel AllInBrasil
e salvar na tabela profiles do Supabase.
"""

import os
import sys
import json
import time
import re
from datetime import datetime
from typing import List, Dict, Any
from playwright.sync_api import sync_playwright
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Configurações
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
BASE_URL = "https://allinbrasil.com.br"
LOGIN_URL = f"{BASE_URL}/publico/Autenticar/Formulario"
DISTRIBUIDORES_INFO_URL = f"{BASE_URL}/administracao/Distribuidor/DistribuidoresInformacoes/principal"

# Credenciais
USERNAME = "juniorind"
PASSWORD = "allin2025"

# Diretório de backup
BACKUP_DIR = "scripts/data/json_backup"
CHECKPOINT_FILE = "data/distribuidores_informacoes_checkpoint.json"


def load_checkpoint() -> Dict[str, Any]:
    """Carregar checkpoint do arquivo"""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"last_page": 0, "processed_count": 0}


def save_checkpoint(last_page: int, processed_count: int):
    """Salvar checkpoint no arquivo"""
    os.makedirs(os.path.dirname(CHECKPOINT_FILE), exist_ok=True)
    with open(CHECKPOINT_FILE, 'w', encoding='utf-8') as f:
        json.dump({
            "last_page": last_page,
            "processed_count": processed_count,
            "timestamp": datetime.now().isoformat()
        }, f, indent=2)
    print(f"✅ Checkpoint salvo: página {last_page}, {processed_count} distribuidores processados")


def delete_checkpoint():
    """Deletar checkpoint"""
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)
        print("✅ Checkpoint deletado")


def save_to_json(data: List[Dict[str, Any]], filename: str):
    """Salvar dados em arquivo JSON"""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    filepath = os.path.join(BACKUP_DIR, filename)
    
    # Carregar dados existentes
    existing_data = []
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    
    # Mesclar dados novos com existentes
    existing_ids = {item.get('allin_distribuidor_id') for item in existing_data}
    for item in data:
        if item.get('allin_distribuidor_id') not in existing_ids:
            existing_data.append(item)
    
    # Salvar dados mesclados
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Backup JSON salvo: {filepath}")
    print(f"💾 Quantidade de dados: {len(existing_data)}")


def parse_currency(value: str) -> float:
    """Converter valor monetário brasileiro para float"""
    if not value or value.strip() == "":
        return 0.0
    # Remover R$, espaços e converter formato brasileiro
    cleaned = value.replace('R$', '').replace('.', '').replace(',', '.').strip()
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def parse_date(date_str: str) -> str:
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


def parse_datetime(datetime_str: str) -> str:
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


def transform_distribuidor(row_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transformar dados do distribuidor para formato do Supabase"""
    return {
        "distribuidor_id": row_data.get('distribuidor_id'),
        "usuario": row_data.get('usuario'),
        "nome": row_data.get('nome'),
        "email": row_data.get('email'),
        "patrocinador": row_data.get('patrocinador'),
        "tipo": row_data.get('tipo'),
        "tipo_pessoa": row_data.get('tipo_pessoa'),
        "cpf_cnpj": row_data.get('cpf_cnpj'),
        "rg": row_data.get('rg'),
        "data_nascimento": parse_date(row_data.get('data_nascimento')),
        "sexo": row_data.get('sexo'),
        "endereco": row_data.get('endereco'),
        "numero": row_data.get('numero'),
        "complemento": row_data.get('complemento'),
        "cidade": row_data.get('cidade'),
        "estado": row_data.get('estado'),
        "cep": row_data.get('cep'),
        "telefone": row_data.get('telefone'),
        "data_cadastro": parse_datetime(row_data.get('data_cadastro')),
        "link_indicacao": row_data.get('link_indicacao'),
        "plano_codigo": row_data.get('plano_codigo'),
        "plano_nome": row_data.get('plano_nome'),
        "plano_data": parse_date(row_data.get('plano_data')),
        "plano_valor": parse_currency(row_data.get('plano_valor')),
        "plano_atual_codigo": row_data.get('plano_atual_codigo'),
        "plano_atual_nome": row_data.get('plano_atual_nome'),
        "plano_atual_data": parse_date(row_data.get('plano_atual_data')),
        "plano_atual_valor": parse_currency(row_data.get('plano_atual_valor')),
        "status": row_data.get('status'),
        "metadata": {
            "imagem": row_data.get('imagem'),
            "doc_aprovado_status": row_data.get('doc_aprovado')
        }
    }


def scrape_distribuidores_informacoes():
    """Extrair dados de informações de distribuidores"""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Carregar checkpoint
    checkpoint = load_checkpoint()
    start_page = checkpoint["last_page"]
    processed_count = checkpoint["processed_count"]
    
    print(f"🚀 Iniciando scrape de informações de distribuidores...")
    print(f"📍 Retomando da página {start_page}")
    print(f"📊 {processed_count} distribuidores já processados")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # Fazer login
        print("🔐 Fazendo login...")
        page.goto(LOGIN_URL)
        page.fill('input[name="usuario"]', USERNAME)
        page.fill('input[name="senha"]', PASSWORD)
        page.click('button[type="submit"]')
        page.wait_for_url("**/administracao/**")
        print("✅ Login realizado com sucesso")
        
        # Navegar para página de informações de distribuidores
        print("📄 Navegando para página de informações de distribuidores...")
        page.goto(DISTRIBUIDORES_INFO_URL)
        
        # Extrair total de registros
        total_registros_text = page.locator('text=Registros:').first.text_content()
        total_registros = int(total_registros_text.split(':')[1].strip())
        print(f"📊 Total de distribuidores: {total_registros}")
        
        # Configurar paginação
        per_page = 20
        total_pages = (total_registros + per_page - 1) // per_page
        
        batch_distribuidores = []
        batch_size = 100
        
        # Iterar pelas páginas
        for page_num in range(start_page, total_pages):
            print(f"📄 Processando página {page_num + 1}/{total_pages}...")
            
            # Navegar para a página específica
            if page_num > 0:
                offset = page_num * per_page
                page.goto(f"{DISTRIBUIDORES_INFO_URL}?per_page={offset}")
            
            # Esperar a tabela carregar
            page.wait_for_selector('table')
            
            # Extrair dados da tabela
            rows = page.locator('table tbody tr').all()
            
            for row in rows:
                try:
                    cells = row.locator('td').all()
                    if len(cells) >= 32:
                        distribuidor_data = {
                            'distribuidor_id': int(cells[0].text_content()),
                            'usuario': cells[1].text_content(),
                            'nome': cells[2].text_content(),
                            'imagem': cells[3].locator('img').count() > 0,
                            'patrocinador': cells[4].text_content(),
                            'tipo': cells[5].text_content(),
                            'tipo_pessoa': cells[6].text_content(),
                            'cpf_cnpj': cells[7].text_content(),
                            'rg': cells[8].text_content(),
                            'data_nascimento': cells[9].text_content(),
                            'sexo': cells[10].text_content(),
                            'imagem2': cells[11].locator('img').count() > 0,
                            'email': cells[12].text_content(),
                            'imagem3': cells[13].locator('img').count() > 0,
                            'endereco': cells[14].text_content(),
                            'numero': cells[15].text_content(),
                            'complemento': cells[16].text_content(),
                            'cidade': cells[17].text_content(),
                            'estado': cells[18].text_content(),
                            'cep': cells[19].text_content(),
                            'telefone': cells[20].text_content(),
                            'data_cadastro': cells[21].text_content(),
                            'link_indicacao': cells[22].text_content(),
                            'plano_codigo': cells[23].text_content(),
                            'plano_nome': cells[24].text_content(),
                            'plano_data': cells[25].text_content(),
                            'plano_valor': cells[26].text_content(),
                            'plano_atual_codigo': cells[27].text_content(),
                            'plano_atual_nome': cells[28].text_content(),
                            'plano_atual_data': cells[29].text_content(),
                            'plano_atual_valor': cells[30].text_content(),
                            'status': cells[31].text_content()
                        }
                        
                        # Transformar dados
                        transformed_data = transform_distribuidor(distribuidor_data)
                        batch_distribuidores.append(transformed_data)
                        processed_count += 1
                        
                        # Salvar batch quando atingir o tamanho limite
                        if len(batch_distribuidores) >= batch_size:
                            print(f"💾 Salvando batch de {len(batch_distribuidores)} distribuidores no banco...")
                            
                            # Salvar no Supabase
                            for dist in batch_distribuidores:
                                try:
                                    # Verificar se já existe
                                    existing = supabase.table('distribuidores').select('id').eq('distribuidor_id', dist['distribuidor_id']).execute()
                                    
                                    if existing.data:
                                        # Atualizar
                                        supabase.table('distribuidores').update(dist).eq('distribuidor_id', dist['distribuidor_id']).execute()
                                    else:
                                        # Criar
                                        supabase.table('distribuidores').insert(dist).execute()
                                except Exception as e:
                                    print(f"❌ Erro ao salvar distribuidor {dist['distribuidor_id']}: {e}")
                            
                            # Salvar backup JSON
                            save_to_json(batch_distribuidores, "distribuidores_informacoes.json")
                            
                            # Salvar checkpoint
                            save_checkpoint(page_num, processed_count)
                            
                            # Limpar batch
                            batch_distribuidores = []
                            
                            # Pausa para não sobrecarregar
                            time.sleep(2)
                
                except Exception as e:
                    print(f"❌ Erro ao processar linha: {e}")
                    continue
            
            # Pausa entre páginas
            time.sleep(1)
        
        # Salvar dados restantes
        if batch_distribuidores:
            print(f"💾 Salvando {len(batch_distribuidores)} distribuidores restantes no banco...")
            
            for dist in batch_distribuidores:
                try:
                    existing = supabase.table('distribuidores').select('id').eq('distribuidor_id', dist['distribuidor_id']).execute()
                    
                    if existing.data:
                        supabase.table('distribuidores').update(dist).eq('distribuidor_id', dist['distribuidor_id']).execute()
                    else:
                        supabase.table('distribuidores').insert(dist).execute()
                except Exception as e:
                    print(f"❌ Erro ao salvar distribuidor {dist['distribuidor_id']}: {e}")
            
            save_to_json(batch_distribuidores, "distribuidores_informacoes.json")
        
        browser.close()
    
    # Deletar checkpoint ao finalizar
    delete_checkpoint()
    
    print(f"✅ Scrape finalizado!")
    print(f"📊 {processed_count} distribuidores processados")


if __name__ == '__main__':
    scrape_distribuidores_informacoes()
