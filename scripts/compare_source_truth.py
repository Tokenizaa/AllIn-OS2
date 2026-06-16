#!/usr/bin/env python3
"""
Script para comparar dados da fonte de verdade (loja virtual) com banco DECREPTED
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrape'))

from auth import LojaVirtualAuth
from extractors.orders import OrdersExtractor
import json

def main():
    print("=== Comparando Fonte de Verdade vs Banco DECREPTED ===\n")
    
    # Autenticar na loja virtual
    print("1. Autenticando na loja virtual...")
    auth = LojaVirtualAuth()
    auth.login()
    session = auth.get_session()
    token = auth.token
    loja_base_url = auth.loja_base_url
    print(f"✅ Login bem-sucedido! Token: {token[:20]}...")
    
    # Extrair pedidos da fonte de verdade
    print("\n2. Extraindo pedidos da fonte de verdade...")
    extractor = OrdersExtractor(session, loja_base_url, token)
    orders = extractor.extract_orders_list(limit=10)
    print(f"✅ {len(orders)} pedidos extraídos da fonte de verdade")
    
    # Mostrar dados da fonte de verdade
    print("\n3. Dados da Fonte de Verdade:")
    for i, order in enumerate(orders[:5], 1):
        print(f"\n   Pedido {i}:")
        print(f"   - ID: {order.get('id')}")
        print(f"   - Cliente: {order.get('cliente')}")
        print(f"   - Total: {order.get('total')}")
        print(f"   - Status: {order.get('status')}")
        print(f"   - Data: {order.get('data')}")
    
    # Extrair detalhes de um pedido específico
    if orders:
        print(f"\n4. Extraindo detalhes do pedido {orders[0].get('id')}...")
        detail = extractor.extract_order_details(orders[0].get('id'))
        print(f"✅ Detalhes extraídos")
        print(f"\n   Itens do pedido {orders[0].get('id')}:")
        for item in detail.produtos.itens[:3]:
            print(f"   - {item.nome} (Qtd: {item.quantidade}, Preço: {item.valor})")
    
    auth.close()
    print("\n=== Comparação Concluída ===")

if __name__ == "__main__":
    main()
