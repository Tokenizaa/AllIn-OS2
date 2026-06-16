"""
Loader para carga de dados no Supabase
"""

from supabase import create_client
from typing import List, Dict


class SupabaseLoader:
    """Classe para carregar dados no Supabase"""
    
    def __init__(self, supabase_url, supabase_key):
        self.supabase = create_client(supabase_url, supabase_key)
    
    def update_customers(self, customers: List[dict]):
        """Atualizar tabela customers - NÃO IMPLEMENTADO (tabela não existe no banco correto)"""
        print(f"⚠️ Tabela customers não existe no banco imeadfnlgzphumuawdyt. {len(customers)} customers não salvos.")
        return 0, 0
    
    def update_orders(self, orders: List[dict]):
        """Atualizar tabela pedidos"""
        updated_count = 0
        created_count = 0
        
        for order_data in orders:
            try:
                # Buscar order por numero_pedido
                existing = self.supabase.table('pedidos').select('id').eq('numero_pedido', order_data['numero_pedido']).execute()
                
                if existing.data:
                    # Atualizar order existente
                    order_id = existing.data[0]['id']
                    self.supabase.table('pedidos').update(order_data).eq('id', order_id).execute()
                    updated_count += 1
                else:
                    # Criar nova order
                    self.supabase.table('pedidos').insert(order_data).execute()
                    created_count += 1
            except Exception as e:
                print(f"❌ Erro ao atualizar pedido {order_data.get('numero_pedido')}: {e}")
        
        print(f"✅ {updated_count} pedidos atualizados, {created_count} criados")
        return updated_count, created_count
    
    def update_order_items(self, order_items: List[dict], order_id: str):
        """Atualizar tabela order_items"""
        try:
            # Deletar itens existentes - usar pedido_id em vez de order_id
            self.supabase.table('order_items').delete().eq('pedido_id', order_id).execute()
            
            # Inserir novos itens
            for item_data in order_items:
                item_data['pedido_id'] = order_id  # Campo correto: pedido_id
                self.supabase.table('order_items').insert(item_data).execute()
            
            print(f"✅ {len(order_items)} order_items atualizados para pedido {order_id}")
            return len(order_items)
        except Exception as e:
            print(f"❌ Erro ao atualizar order_items para pedido {order_id}: {e}")
            return 0
