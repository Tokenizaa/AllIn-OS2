"""
Retry com backoff exponencial para operações de scraping
"""

import time
import logging
from functools import wraps
from typing import Callable, Optional


def retry_with_backoff(
    max_retries: int = 3,
    initial_delay: float = 5.0,
    backoff_factor: float = 2.0,
    exceptions: tuple = (Exception,),
    logger: Optional[logging.Logger] = None
):
    """
    Decorator para retry com backoff exponencial
    
    Args:
        max_retries: Número máximo de tentativas
        initial_delay: Delay inicial em segundos
        backoff_factor: Fator de multiplicação do delay
        exceptions: Tupla de exceções para retry
        logger: Logger para logging de erros
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    
                    if attempt == max_retries:
                        if logger:
                            logger.error(
                                f"Falha após {max_retries} tentativas em {func.__name__}: {e}",
                                exc_info=True
                            )
                        raise
                    
                    if logger:
                        logger.warning(
                            f"Tentativa {attempt + 1}/{max_retries + 1} falhou em {func.__name__}: {e}. "
                            f"Retry em {delay}s..."
                        )
                    
                    time.sleep(delay)
                    delay *= backoff_factor
            
            # Nunca deve chegar aqui, mas por segurança
            if last_exception:
                raise last_exception
        
        return wrapper
    return decorator
