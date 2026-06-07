"""
Logging estruturado para scraping
"""

import logging
import os
from datetime import datetime
from pathlib import Path


class ScrapeLogger:
    """Logger estruturado para scraping"""
    
    def __init__(self, log_dir='logs'):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        # Configurar logger principal
        self.logger = logging.getLogger('scrape')
        self.logger.setLevel(logging.DEBUG)
        
        # Remover handlers existentes
        self.logger.handlers.clear()
        
        # Formatter estruturado
        formatter = logging.Formatter(
            '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # Handler para scrape.log (INFO e acima)
        scrape_handler = logging.FileHandler(self.log_dir / 'scrape.log')
        scrape_handler.setLevel(logging.INFO)
        scrape_handler.setFormatter(formatter)
        self.logger.addHandler(scrape_handler)
        
        # Handler para errors.log (ERROR e acima)
        error_handler = logging.FileHandler(self.log_dir / 'errors.log')
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        self.logger.addHandler(error_handler)
        
        # Handler para supabase.log (operações de Supabase)
        supabase_handler = logging.FileHandler(self.log_dir / 'supabase.log')
        supabase_handler.setLevel(logging.DEBUG)
        supabase_handler.setFormatter(formatter)
        self.supabase_logger = logging.getLogger('scrape.supabase')
        self.supabase_logger.setLevel(logging.DEBUG)
        self.supabase_logger.addHandler(supabase_handler)
        
        # Handler para checkpoint.log (checkpoints)
        checkpoint_handler = logging.FileHandler(self.log_dir / 'checkpoint.log')
        checkpoint_handler.setLevel(logging.INFO)
        checkpoint_handler.setFormatter(formatter)
        self.checkpoint_logger = logging.getLogger('scrape.checkpoint')
        self.checkpoint_logger.setLevel(logging.INFO)
        self.checkpoint_logger.addHandler(checkpoint_handler)
        
        # Console handler (INFO e acima)
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)
    
    def info(self, message, module='general', order_id=None):
        """Log INFO"""
        extra_info = f"[{module}]"
        if order_id:
            extra_info += f" [Order: {order_id}]"
        self.logger.info(f"{extra_info} {message}")
    
    def warning(self, message, module='general', order_id=None):
        """Log WARNING"""
        extra_info = f"[{module}]"
        if order_id:
            extra_info += f" [Order: {order_id}]"
        self.logger.warning(f"{extra_info} {message}")
    
    def error(self, message, module='general', order_id=None, exc_info=False):
        """Log ERROR"""
        extra_info = f"[{module}]"
        if order_id:
            extra_info += f" [Order: {order_id}]"
        self.logger.error(f"{extra_info} {message}", exc_info=exc_info)
    
    def debug(self, message, module='general', order_id=None):
        """Log DEBUG"""
        extra_info = f"[{module}]"
        if order_id:
            extra_info += f" [Order: {order_id}]"
        self.logger.debug(f"{extra_info} {message}")
    
    def supabase(self, message, operation=None):
        """Log operação de Supabase"""
        extra_info = f"[{operation}]" if operation else ""
        self.supabase_logger.info(f"{extra_info} {message}")
    
    def checkpoint(self, message, checkpoint_data=None):
        """Log checkpoint"""
        extra_info = f" | {checkpoint_data}" if checkpoint_data else ""
        self.checkpoint_logger.info(f"{message}{extra_info}")


# Instância global
_logger_instance = None


def get_logger(log_dir='logs'):
    """Obter instância global do logger"""
    global _logger_instance
    if _logger_instance is None:
        _logger_instance = ScrapeLogger(log_dir)
    return _logger_instance
