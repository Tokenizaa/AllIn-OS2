#!/usr/bin/env python3
"""
Script para processar pedidos migrados que já foram confirmados
Chama a função SQL processar_pedido_mlm() para cada pedido
"""
import os
import sys
import time
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

# Carregar variáveis de ambiente
project_root = Path(__file__).parent.parent
load_dotenv(project_root / ".env")
load_dotenv(project_root / ".env.local")

# Configurações
CURRENT_PROJECT_ID = "imeadfnlgzphumuawdyt"
CURRENT_URL = f"https://{CURRENT_PROJECT_ID}.supabase.co"
CURRENT_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

BATCH_SIZE = 50
DELAY_BETWEEN_REQUESTS = 0.2

print("=== Processamento de Pedidos Migrados ===")
print(f"Projeto: {CURRENT_PROJECT_ID}")
print(f"Batch Size: {BATCH_SIZE}")
print()

def processar_pedidos_migrados():
    """Processa pedidos migrados chamando a função SQL"""
    print("Iniciando processamento de pedidos migrados...")
    
    # Conectar ao banco
    client = create_client(CURRENT_URL, CURRENT_KEY)
    
    # Buscar todos os pedidos que foram confirmados mas não foram processados
    print("   - Buscando pedidos para processar...")
    
    all_pedidos = []
    page = 0
    page_size = 1000
    
    while True:
        response = client.table('pedidos').select('id, valor_total, tipo_nome, pagamento_confirmado, comissoes_geradas').eq('pagamento_confirmado', True).is_('comissoes_geradas', 'null').range(page * page_size, (page + 1) * page_size - 1).execute()
        pedidos = response.data
        
        if len(pedidos) == 0:
            break
            
        all_pedidos.extend(pedidos)
        print(f"   - Página {page}: {len(pedidos)} pedidos encontrados")
        
        if len(pedidos) < page_size:
            break
            
        page += 1
        time.sleep(DELAY_BETWEEN_REQUESTS)
    
    print(f"   - Total de {len(all_pedidos)} pedidos para processar")
    
    if len(all_pedidos) == 0:
        print("   - Nenhum pedido para processar")
        return
    
    processados = 0
    erros = 0
    
    for idx, pedido in enumerate(all_pedidos):
        pedido_id = pedido['id']
        
        if idx % 100 == 0:
            print(f"   - Progresso: {idx}/{len(all_pedidos)} pedidos processados ({(idx/len(all_pedidos))*100:.1f}%)")
        
        try:
            # Chamar função SQL via RPC
            response = client.rpc('processar_pedido_mlm', {'pedido_id': pedido_id})
            
            # Verificar se houve erro na função (a função pode lançar exceção)
            # Se a função retornar sem erro, consideramos sucesso
            processados += 1
            
            if processados % 50 == 0:
                print(f"   - {processados} pedidos processados com sucesso")
            
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
        except Exception as e:
            erros += 1
            print(f"   [ERROR] Erro ao processar pedido {pedido_id}: {e}")
            time.sleep(DELAY_BETWEEN_REQUESTS)
    
    print(f"\n=== Processamento Concluído ===")
    print(f"Total de pedidos: {len(all_pedidos)}")
    print(f"Processados com sucesso: {processados}")
    print(f"Erros: {erros}")
    print(f"Taxa de sucesso: {(processados/len(all_pedidos)*100):.1f}%")

if __name__ == "__main__":
    import traceback
    
    try:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Iniciando processamento de pedidos migrados...")
        processar_pedidos_migrados()
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Processamento Concluído ===")
        
    except Exception as e:
        print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Erro no Processamento ===")
        print(f"Erro: {str(e)}")
        print(f"\nStack trace completo:")
        traceback.print_exc()
        sys.exit(1)
