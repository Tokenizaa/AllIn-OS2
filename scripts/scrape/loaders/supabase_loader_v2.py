"""
Loader otimizado para carga de dados no Supabase com UPSERT em lote
"""

from supabase import create_client
from typing import List, Dict
from ..utils.retry import retry_with_backoff
from ..utils.logger import get_logger


class SupabaseLoaderV2:
    """Classe para carregar dados no Supabase com UPSERT otimizado"""
    
    def __init__(self, supabase_url, supabase_key):
        self.supabase = create_client(supabase_url, supabase_key)
        self.logger = get_logger()
    
    @retry_with_backoff(max_retries=3, initial_delay=5.0, backoff_factor=2.0)
    def upsert_customers_batch(self, customers: List[dict]) -> tuple[int, int]:
        """
        UPSERT em lote para customers usando on_conflict
        
        Args:
            customers: Lista de dicionários de customers
            
        Returns:
            Tuple (updated_count, created_count)
        """
        if not customers:
            return 0, 0
        
        try:
            # Usar upsert com on_conflict em id_comprador
            result = self.supabase.table('customers').upsert(
                customers,
                on_conflict='id_comprador'
            ).execute()
            
            self.logger.supabase(
                f"UPSERT batch de {len(customers)} customers",
                operation='upsert_customers'
            )
            
            # Supabase upsert não retorna updated vs created separadamente
            # Assumimos todos como upserted
            return len(customers), 0
            
        except Exception as e:
            self.logger.error(
                f"Erro no UPSERT batch de customers: {e}",
                module='supabase_loader',
                exc_info=True
            )
            raise
    
    @retry_with_backoff(max_retries=3, initial_delay=5.0, backoff_factor=2.0)
    def upsert_orders_batch(self, orders: List[dict]) -> tuple[int, int]:
        """
        UPSERT em lote para orders usando on_conflict
        
        Args:
            orders: Lista de dicionários de orders
            
        Returns:
            Tuple (updated_count, created_count)
        """
        if not orders:
            return 0, 0
        
        try:
            # Usar upsert com on_conflict em numero_pedido
            result = self.supabase.table('orders').upsert(
                orders,
                on_conflict='numero_pedido'
            ).execute()
            
            self.logger.supabase(
                f"UPSERT batch de {len(orders)} orders",
                operation='upsert_orders'
            )
            
            return len(orders), 0
            
        except Exception as e:
            self.logger.error(
                f"Erro no UPSERT batch de orders: {e}",
                module='supabase_loader',
                exc_info=True
            )
            raise
    
    @retry_with_backoff(max_retries=3, initial_delay=5.0, backoff_factor=2.0)
    def upsert_order_items_batch(self, order_items: List[dict]) -> int:
        """
        UPSERT em lote para order_items
        
        Args:
            order_items: Lista de dicionários de order_items
            
        Returns:
            Número de itens upserted
        """
        if not order_items:
            return 0
        
        try:
            # Para order_items, precisamos deletar e inserir por order_id
            # Agrupar por order_id
            items_by_order = {}
            for item in order_items:
                order_id = item['order_id']
                if order_id not in items_by_order:
                    items_by_order[order_id] = []
                items_by_order[order_id].append(item)
            
            total_upserted = 0
            
            # Para cada order_id, deletar e inserir em lote
            for order_id, items in items_by_order.items():
                try:
                    # Deletar itens existentes
                    self.supabase.table('order_items').delete().eq('order_id', order_id).execute()
                    
                    # Inserir novos itens em lote
                    if items:
                        self.supabase.table('order_items').insert(items).execute()
                        total_upserted += len(items)
                        
                except Exception as e:
                    self.logger.error(
                        f"Erro ao upsert order_items para order {order_id}: {e}",
                        module='supabase_loader',
                        order_id=order_id,
                        exc_info=True
                    )
                    raise
            
            self.logger.supabase(
                f"UPSERT batch de {total_upserted} order_items",
                operation='upsert_order_items'
            )
            
            return total_upserted
            
        except Exception as e:
            self.logger.error(
                f"Erro no UPSERT batch de order_items: {e}",
                module='supabase_loader',
                exc_info=True
            )
            raise
    
    def validate_integrity(
        self,
        orders_extracted: int,
        customers_extracted: int,
        order_items_extracted: int,
        orders_persisted: int,
        customers_persisted: int,
        order_items_persisted: int
    ) -> bool:
        """
        Validar integridade dos dados
        
        Returns:
            True se integridade OK, False caso contrário
        """
        is_valid = True
        
        if orders_extracted != orders_persisted:
            self.logger.error(
                f"Integridade violada: Orders extraídas ({orders_extracted}) != persistidas ({orders_persisted})",
                module='integrity_validation'
            )
            is_valid = False
        
        if customers_extracted != customers_persisted:
            self.logger.error(
                f"Integridade violada: Customers extraídos ({customers_extracted}) != persistidos ({customers_persisted})",
                module='integrity_validation'
            )
            is_valid = False
        
        if order_items_extracted != order_items_persisted:
            self.logger.error(
                f"Integridade violada: Order items extraídos ({order_items_extracted}) != persistidos ({order_items_persisted})",
                module='integrity_validation'
            )
            is_valid = False
        
        if is_valid:
            self.logger.info(
                f"Integridade validada: {orders_extracted} orders, {customers_extracted} customers, {order_items_extracted} items",
                module='integrity_validation'
            )
        
        return is_valid
