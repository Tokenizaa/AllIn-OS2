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
        """Atualizar tabela customers"""
        updated_count = 0
        created_count = 0
        
        for customer_data in customers:
            try:
                # Buscar customer por id_comprador
                existing = self.supabase.table('customers').select('id').eq('id_comprador', customer_data['id_comprador']).execute()
                
                if existing.data:
                    # Atualizar customer existente
                    customer_id = existing.data[0]['id']
                    self.supabase.table('customers').update(customer_data).eq('id', customer_id).execute()
                    updated_count += 1
                else:
                    # Criar novo customer
                    self.supabase.table('customers').insert(customer_data).execute()
                    created_count += 1
            except Exception as e:
                print(f"❌ Erro ao atualizar customer {customer_data.get('id_comprador')}: {e}")
        
        print(f"✅ {updated_count} customers atualizados, {created_count} criados")
        return updated_count, created_count
    
    def update_orders(self, orders: List[dict]):
        """Atualizar tabela orders"""
        updated_count = 0
        created_count = 0
        
        for order_data in orders:
            try:
                # Buscar order por numero_pedido
                existing = self.supabase.table('orders').select('id').eq('numero_pedido', order_data['numero_pedido']).execute()
                
                if existing.data:
                    # Atualizar order existente
                    order_id = existing.data[0]['id']
                    self.supabase.table('orders').update(order_data).eq('id', order_id).execute()
                    updated_count += 1
                else:
                    # Criar nova order
                    self.supabase.table('orders').insert(order_data).execute()
                    created_count += 1
            except Exception as e:
                print(f"❌ Erro ao atualizar order {order_data.get('numero_pedido')}: {e}")
        
        print(f"✅ {updated_count} orders atualizados, {created_count} criados")
        return updated_count, created_count
    
    def update_order_items(self, order_items: List[dict], order_id: str):
        """Atualizar tabela order_items"""
        try:
            # Deletar itens existentes
            self.supabase.table('order_items').delete().eq('order_id', order_id).execute()
            
            # Inserir novos itens
            for item_data in order_items:
                item_data['order_id'] = order_id
                self.supabase.table('order_items').insert(item_data).execute()
            
            print(f"✅ {len(order_items)} order_items atualizados para order {order_id}")
            return len(order_items)
        except Exception as e:
            print(f"❌ Erro ao atualizar order_items para order {order_id}: {e}")
            return 0
