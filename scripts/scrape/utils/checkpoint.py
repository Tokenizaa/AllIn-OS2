"""
Sistema de checkpoints para recuperação após falhas
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional


class CheckpointManager:
    """Gerenciador de checkpoints para scraping"""
    
    def __init__(self, checkpoint_file='data/checkpoint.json'):
        self.checkpoint_file = Path(checkpoint_file)
        self.checkpoint_file.parent.mkdir(exist_ok=True, parents=True)
        self.checkpoint_data = self._load_checkpoint()
    
    def _load_checkpoint(self) -> Dict:
        """Carregar checkpoint do arquivo"""
        if self.checkpoint_file.exists():
            try:
                with open(self.checkpoint_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️ Erro ao carregar checkpoint: {e}")
                return self._create_empty_checkpoint()
        return self._create_empty_checkpoint()
    
    def _create_empty_checkpoint(self) -> Dict:
        """Criar checkpoint vazio"""
        return {
            'ultimo_pedido_processado': None,
            'pedidos_processados': 0,
            'customers_processados': 0,
            'orders_processados': 0,
            'order_items_processados': 0,
            'erros': 0,
            'timestamp': None,
            'status': 'not_started'
        }
    
    def save_checkpoint(
        self,
        ultimo_pedido: str,
        pedidos_processados: int,
        customers_processados: int,
        orders_processados: int,
        order_items_processados: int,
        erros: int,
        status: str = 'in_progress'
    ):
        """Salvar checkpoint"""
        self.checkpoint_data = {
            'ultimo_pedido_processado': ultimo_pedido,
            'pedidos_processados': pedidos_processados,
            'customers_processados': customers_processados,
            'orders_processados': orders_processados,
            'order_items_processados': order_items_processados,
            'erros': erros,
            'timestamp': datetime.now().isoformat(),
            'status': status
        }
        
        try:
            with open(self.checkpoint_file, 'w', encoding='utf-8') as f:
                json.dump(self.checkpoint_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"❌ Erro ao salvar checkpoint: {e}")
    
    def get_checkpoint(self) -> Dict:
        """Obter dados do checkpoint"""
        return self.checkpoint_data
    
    def can_resume(self) -> bool:
        """Verificar se é possível retomar de um checkpoint"""
        return (
            self.checkpoint_data['status'] == 'in_progress' and
            self.checkpoint_data['ultimo_pedido_processado'] is not None
        )
    
    def get_resume_from_order(self) -> Optional[str]:
        """Obter order_id para retomar"""
        if self.can_resume():
            return self.checkpoint_data['ultimo_pedido_processado']
        return None
    
    def reset_checkpoint(self):
        """Resetar checkpoint"""
        self.checkpoint_data = self._create_empty_checkpoint()
        if self.checkpoint_file.exists():
            self.checkpoint_file.unlink()
    
    def mark_completed(self):
        """Marcar scraping como concluído"""
        self.save_checkpoint(
            ultimo_pedido=self.checkpoint_data['ultimo_pedido_processado'],
            pedidos_processados=self.checkpoint_data['pedidos_processados'],
            customers_processados=self.checkpoint_data['customers_processados'],
            orders_processados=self.checkpoint_data['orders_processados'],
            order_items_processados=self.checkpoint_data['order_items_processados'],
            erros=self.checkpoint_data['erros'],
            status='completed'
        )
    
    def print_status(self):
        """Imprimir status do checkpoint"""
        print("\n" + "=" * 60)
        print("📍 STATUS DO CHECKPOINT")
        print("=" * 60)
        print(f"Último pedido processado: {self.checkpoint_data['ultimo_pedido_processado']}")
        print(f"Pedidos processados: {self.checkpoint_data['pedidos_processados']}")
        print(f"Customers processados: {self.checkpoint_data['customers_processados']}")
        print(f"Orders processados: {self.checkpoint_data['orders_processados']}")
        print(f"Order items processados: {self.checkpoint_data['order_items_processados']}")
        print(f"Erros: {self.checkpoint_data['erros']}")
        print(f"Timestamp: {self.checkpoint_data['timestamp']}")
        print(f"Status: {self.checkpoint_data['status']}")
        print(f"Pode retomar: {self.can_resume()}")
        print("=" * 60 + "\n")
