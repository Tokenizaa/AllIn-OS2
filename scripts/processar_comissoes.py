#!/usr/bin/env python3
"""
Script para processar pedidos e gerar comissões baseadas nas regras de bônus configuradas
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

BATCH_SIZE = 100
DELAY_BETWEEN_REQUESTS = 0.1

print("=== Processamento de Comissões MLM ===")
print(f"Projeto: {CURRENT_PROJECT_ID}")
print(f"Batch Size: {BATCH_SIZE}")
print()

def processar_comissoes():
    """Processa pedidos e gera comissões baseadas nas regras configuradas"""
    print("Iniciando processamento de comissões...")
    
    # Conectar ao banco
    client = create_client(CURRENT_URL, CURRENT_KEY)
    
    # Buscar regras de bônus ativas
    print("   - Buscando regras de bônus...")
    response = client.table('bonus_regras').select('*').eq('is_active', True).execute()
    regras = response.data
    print(f"   - {len(regras)} regras de bônus encontradas")
    
    # Criar mapa de regras por tipo e plano
    regras_map = {}
    for regra in regras:
        tipo = regra['tipo']
        configuracoes = regra.get('configuracoes', {})
        plano = configuracoes.get('plano')
        
        if tipo not in regras_map:
            regras_map[tipo] = {}
        if plano not in regras_map[tipo]:
            regras_map[tipo][plano] = []
        regras_map[tipo][plano].append(regra)
    
    # Buscar distribuidores
    print("   - Buscando distribuidores...")
    response = client.table('distribuidores').select('id, usuario, nome, email, patrocinador_id').execute()
    distribuidores = response.data
    print(f"   - {len(distribuidores)} distribuidores encontrados")
    
    # Criar mapa de distribuidores por ID (texto)
    distribuidores_map = {}
    for dist in distribuidores:
        # Usar tanto o UUID quanto o allin_id se disponível
        distribuidores_map[str(dist['id'])] = dist
        if dist.get('allin_id'):
            distribuidores_map[str(dist['allin_id'])] = dist
    
    # Buscar planos
    print("   - Buscando planos...")
    response = client.table('planos').select('*').execute()
    planos = response.data
    planos_map = {p['tipo']: p for p in planos}
    print(f"   - {len(planos)} planos encontrados")
    
    # Buscar pedidos que ainda não foram processados para comissão
    print("   - Buscando pedidos para processar...")
    response = client.table('pedidos').select('id, valor_total, tipo_nome, metadata').is_('comissoes_geradas', 'null').execute()
    pedidos = response.data
    print(f"   - {len(pedidos)} pedidos para processar")
    
    comissoes_geradas = 0
    batch_comissoes = []
    
    for idx, pedido in enumerate(pedidos):
        if idx % 1000 == 0:
            print(f"   - Progresso: {idx}/{len(pedidos)} pedidos processados ({(idx/len(pedidos))*100:.1f}%)")
        
        pedido_id = pedido['id']
        valor_total = float(pedido.get('valor_total', 0))
        tipo_nome = pedido.get('tipo_nome')
        metadata = pedido.get('metadata', {})
        
        # Identificar o comprador
        id_comprador = metadata.get('id_comprador')
        patrocinador_comprador = metadata.get('patrocinador_comprador')
        plano_comprador = metadata.get('plano_comprador')
        
        if not id_comprador or not valor_total:
            continue
        
        # Mapear tipo_nome para plano
        if tipo_nome:
            tipo_nome_lower = tipo_nome.lower()
            if 'afiliado' in tipo_nome_lower:
                plano_key = 'afiliado'
            elif 'avanço' in tipo_nome_lower or 'avanco' in tipo_nome_lower:
                plano_key = 'avanco'
            elif 'excelência' in tipo_nome_lower or 'excelencia' in tipo_nome_lower:
                plano_key = 'excelencia'
            else:
                plano_key = 'avanco'  # Default
        else:
            plano_key = 'avanco'  # Default
        
        # Buscar distribuidor comprador
        comprador = distribuidores_map.get(str(id_comprador))
        if not comprador:
            continue
        
        # Gerar comissão direta
        if 'direto' in regras_map and plano_key in regras_map['direto']:
            for regra in regras_map['direto'][plano_key]:
                porcentagem = float(regra['porcentagem'])
                valor_comissao = valor_total * (porcentagem / 100)
                
                comissao = {
                    'pedido_id': pedido_id,
                    'tipo': regra['tipo'],
                    'geracao': regra['geracao'],
                    'valor_base': valor_total,
                    'porcentagem': porcentagem,
                    'valor_comissao': valor_comissao,
                    'status': 'pendente',
                    'data_calculo': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'distribuidor_id': comprador['id'],
                    'descricao': f"{regra['nome']} - Pedido {pedido_id}",
                    'metadata': {
                        'regra_id': str(regra['id']),
                        'plano': plano_key,
                        'tipo_pedido': tipo_nome
                    }
                }
                batch_comissoes.append(comissao)
        
        # Gerar bônus para patrocinador (se houver)
        if patrocinador_comprador and 'patrocinador' in regras_map and plano_key in regras_map['patrocinador']:
            patrocinador = distribuidores_map.get(str(patrocinador_comprador))
            if patrocinador:
                for regra in regras_map['patrocinador'][plano_key]:
                    porcentagem = float(regra['porcentagem'])
                    valor_comissao = valor_total * (porcentagem / 100)
                    
                    comissao = {
                        'pedido_id': pedido_id,
                        'tipo': regra['tipo'],
                        'geracao': regra['geracao'],
                        'valor_base': valor_total,
                        'porcentagem': porcentagem,
                        'valor_comissao': valor_comissao,
                        'status': 'pendente',
                        'data_calculo': time.strftime('%Y-%m-%d %H:%M:%S'),
                        'distribuidor_id': patrocinador['id'],
                        'descricao': f"{regra['nome']} - Pedido {pedido_id}",
                        'metadata': {
                            'regra_id': str(regra['id']),
                            'plano': plano_key,
                            'tipo_pedido': tipo_nome,
                            'comprador_id': str(comprador['id'])
                        }
                    }
                    batch_comissoes.append(comissao)
        
        # Inserir em batch
        if len(batch_comissoes) >= BATCH_SIZE:
            try:
                response = client.table('comissoes').insert(batch_comissoes).execute()
                if response.data:
                    comissoes_geradas += len(response.data)
                    print(f"   - Batch de {len(response.data)} comissões geradas")
                batch_comissoes = []
                time.sleep(DELAY_BETWEEN_REQUESTS)
            except Exception as e:
                print(f"   [ERROR] Erro ao inserir batch: {e}")
                batch_comissoes = []
    
    # Inserir o restante
    if batch_comissoes:
        try:
            response = client.table('comissoes').insert(batch_comissoes).execute()
            if response.data:
                comissoes_geradas += len(response.data)
                print(f"   - Batch final de {len(response.data)} comissões geradas")
        except Exception as e:
            print(f"   [ERROR] Erro ao inserir batch final: {e}")
    
    # Marcar pedidos como processados
    print("   - Marcando pedidos como processados...")
    for pedido in pedidos:
        try:
            client.table('pedidos').update({'comissoes_geradas': True, 'comissoes_geradas_at': time.strftime('%Y-%m-%d %H:%M:%S')}).eq('id', pedido['id']).execute()
        except Exception as e:
            print(f"   [ERROR] Erro ao marcar pedido {pedido['id']}: {e}")
    
    print(f"   - {comissoes_geradas} comissões geradas no total")

if __name__ == "__main__":
    import traceback
    
    try:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Iniciando processamento de comissões...")
        processar_comissoes()
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Processamento Concluído ===")
        print("Comissões geradas com sucesso!")
        
    except Exception as e:
        print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] === Erro no Processamento ===")
        print(f"Erro: {str(e)}")
        print(f"\nStack trace completo:")
        traceback.print_exc()
        sys.exit(1)
