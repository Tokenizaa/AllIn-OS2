"""
Monitoramento em tempo real para scraping
"""

import time
from datetime import datetime, timedelta
from typing import Dict, Optional


class ScrapeMonitor:
    """Monitor de progresso de scraping"""
    
    def __init__(self, total_orders: int):
        self.total_orders = total_orders
        self.orders_processed = 0
        self.customers_created = 0
        self.orders_created = 0
        self.order_items_created = 0
        self.errors = 0
        self.start_time = datetime.now()
        self.last_update_time = datetime.now()
        self.orders_per_minute = 0.0
    
    def update_progress(self, orders_processed: int = 1):
        """Atualizar progresso"""
        self.orders_processed += orders_processed
        now = datetime.now()
        time_delta = (now - self.last_update_time).total_seconds()
        
        if time_delta > 0:
            current_rate = orders_processed / time_delta
            # Média móvel simples
            self.orders_per_minute = (self.orders_per_minute * 0.9) + (current_rate * 60 * 0.1)
        
        self.last_update_time = now
    
    def increment_customers(self, count: int = 1):
        """Incrementar contador de customers"""
        self.customers_created += count
    
    def increment_orders(self, count: int = 1):
        """Incrementar contador de orders"""
        self.orders_created += count
    
    def increment_order_items(self, count: int = 1):
        """Incrementar contador de order items"""
        self.order_items_created += count
    
    def increment_errors(self, count: int = 1):
        """Incrementar contador de erros"""
        self.errors += count
    
    def get_progress_percentage(self) -> float:
        """Obter porcentagem de progresso"""
        if self.total_orders == 0:
            return 0.0
        return (self.orders_processed / self.total_orders) * 100
    
    def get_elapsed_time(self) -> timedelta:
        """Obter tempo decorrido"""
        return datetime.now() - self.start_time
    
    def get_eta(self) -> Optional[timedelta]:
        """Estimar tempo restante"""
        if self.orders_processed == 0 or self.orders_per_minute == 0:
            return None
        
        remaining_orders = self.total_orders - self.orders_processed
        remaining_minutes = remaining_orders / self.orders_per_minute
        return timedelta(minutes=remaining_minutes)
    
    def get_status(self) -> Dict:
        """Obter status completo"""
        eta = self.get_eta()
        return {
            'orders_processed': self.orders_processed,
            'total_orders': self.total_orders,
            'progress_percentage': self.get_progress_percentage(),
            'customers_created': self.customers_created,
            'orders_created': self.orders_created,
            'order_items_created': self.order_items_created,
            'errors': self.errors,
            'elapsed_time': str(self.get_elapsed_time()),
            'orders_per_minute': round(self.orders_per_minute, 2),
            'eta': str(eta) if eta else 'Calculando...'
        }
    
    def print_status(self):
        """Imprimir status formatado"""
        status = self.get_status()
        
        print("\n" + "=" * 60)
        print(f"📊 PROGRESSO DO SCRAPE")
        print("=" * 60)
        print(f"Pedidos processados: {status['orders_processed']} / {status['total_orders']}")
        print(f"Progresso: {status['progress_percentage']:.1f}%")
        print(f"")
        print(f"Customers criados: {status['customers_created']}")
        print(f"Orders criadas: {status['orders_created']}")
        print(f"Order items criados: {status['order_items_created']}")
        print(f"Erros: {status['errors']}")
        print(f"")
        print(f"Velocidade: {status['orders_per_minute']} pedidos/minuto")
        print(f"Tempo decorrido: {status['elapsed_time']}")
        print(f"Tempo estimado restante: {status['eta']}")
        print("=" * 60 + "\n")
