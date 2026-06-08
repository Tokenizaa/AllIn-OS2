#!/usr/bin/env python3
"""
Script para extrair dados de distribuidores em rede do painel AllInBrasil
e salvar na tabela profiles do Supabase.
"""

import os
import sys
import json
import time
from datetime import datetime
from typing import List, Dict, Any
from playwright.sync_api import sync_playwright
from supabase import create_client, Client

# Configurações
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
BASE_URL = "https://allinbrasil.com.br"
LOGIN_URL = f"{BASE_URL}/publico/Autenticar/Formulario"
DISTRIBUIDORES_URL = f"{BASE_URL}/administracao/Distribuidor/DistribuidoresARede/listar"

# Credenciais
USERNAME = "juniorind"
PASSWORD = "allin2025"

# Diretório de backup
BACKUP_DIR = "scripts/data/json_backup"
CHECKPOINT_FILE = "data/distribuidores_checkpoint.json"


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


def transform_distribuidor(row_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transformar dados do distribuidor para formato do Supabase"""
    return {
        "allin_distribuidor_id": row_data.get('distribuidor_id'),
        "display_name": row_data.get('usuario'),
        "name": row_data.get('nome'),
        "email": row_data.get('email'),
        "role": "distribuidor",
        "status": "active" if row_data.get('ativo') == "Ativo" else "inactive",
        "cidade": row_data.get('cidade'),
        "estado": row_data.get('estado'),
        "doc_aprovado": row_data.get('doc_aprovado'),
        "data_nascimento": row_data.get('data_nascimento'),
        "data_cadastro": row_data.get('data_cadastro'),
        "imagem_url": row_data.get('imagem_url'),
        "allin_metadata": {
            "patrocinador": row_data.get('patrocinador'),
            "imagem": row_data.get('imagem'),
            "doc_aprovado_status": row_data.get('doc_aprovado')
        }
    }


def scrape_distribuidores_rede():
    """Extrair dados de distribuidores em rede"""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Carregar checkpoint
    checkpoint = load_checkpoint()
    start_page = checkpoint["last_page"]
    processed_count = checkpoint["processed_count"]
    
    print(f"🚀 Iniciando scrape de distribuidores em rede...")
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
        
        # Navegar para página de distribuidores
        print("📄 Navegando para página de distribuidores em rede...")
        page.goto(DISTRIBUIDORES_URL)
        
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
                page.goto(f"{DISTRIBUIDORES_URL}?per_page={offset}")
            
            # Esperar a tabela carregar
            page.wait_for_selector('table')
            
            # Extrair dados da tabela
            rows = page.locator('table tbody tr').all()
            
            for row in rows:
                try:
                    cells = row.locator('td').all()
                    if len(cells) >= 10:
                        distribuidor_data = {
                            'distribuidor_id': int(cells[0].text_content()),
                            'imagem': cells[1].locator('img').count() > 0,
                            'usuario': cells[2].text_content(),
                            'nome': cells[3].text_content(),
                            'email': cells[4].text_content(),
                            'patrocinador': cells[5].text_content(),
                            'cidade': cells[6].text_content(),
                            'estado': cells[7].text_content(),
                            'doc_aprovado': cells[8].text_content(),
                            'data_nascimento': cells[9].text_content(),
                            'ativo': cells[10].text_content(),
                            'data_cadastro': cells[11].text_content(),
                            'imagem_url': None
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
                                    existing = supabase.table('profiles').select('id').eq('allin_distribuidor_id', dist['allin_distribuidor_id']).execute()
                                    
                                    if existing.data:
                                        # Atualizar
                                        supabase.table('profiles').update(dist).eq('allin_distribuidor_id', dist['allin_distribuidor_id']).execute()
                                    else:
                                        # Criar
                                        supabase.table('profiles').insert(dist).execute()
                                except Exception as e:
                                    print(f"❌ Erro ao salvar distribuidor {dist['allin_distribuidor_id']}: {e}")
                            
                            # Salvar backup JSON
                            save_to_json(batch_distribuidores, "distribuidores_rede.json")
                            
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
                    existing = supabase.table('profiles').select('id').eq('allin_distribuidor_id', dist['allin_distribuidor_id']).execute()
                    
                    if existing.data:
                        supabase.table('profiles').update(dist).eq('allin_distribuidor_id', dist['allin_distribuidor_id']).execute()
                    else:
                        supabase.table('profiles').insert(dist).execute()
                except Exception as e:
                    print(f"❌ Erro ao salvar distribuidor {dist['allin_distribuidor_id']}: {e}")
            
            save_to_json(batch_distribuidores, "distribuidores_rede.json")
        
        browser.close()
    
    # Deletar checkpoint ao finalizar
    delete_checkpoint()
    
    print(f"✅ Scrape finalizado!")
    print(f"📊 {processed_count} distribuidores processados")


if __name__ == '__main__':
    scrape_distribuidores_rede()
