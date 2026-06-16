"""
Retry Handler for AllIn scrapers.
Handles retry logic with exponential backoff.
"""

import asyncio
from typing import Callable, Any, Optional
from functools import wraps
import structlog

logger = structlog.get_logger()


class RetryHandler:
    """
    Handler for retry logic with exponential backoff.
    
    Features:
    - Configurable max retries
    - Exponential backoff with jitter
    - Retry on specific exceptions
    - Callback for retry attempts
    """
    
    def __init__(
        self,
        max_retries: int = 3,
        base_delay: float = 1.0,
        max_delay: float = 30.0,
        exponential_base: float = 2.0,
        jitter: bool = True
    ):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.exponential_base = exponential_base
        self.jitter = jitter
    
    async def execute(
        self,
        func: Callable,
        *args,
        context: str = "",
        **kwargs
    ) -> Any:
        """
        Execute function with retry logic.
        
        Args:
            func: Function to execute
            *args: Function arguments
            context: Context string for logging
            **kwargs: Function keyword arguments
            
        Returns:
            Any: Function result
            
        Raises:
            Exception: Last exception if all retries failed
        """
        last_exception = None
        
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.info(
                    "retry_attempt",
                    context=context,
                    attempt=attempt,
                    max_retries=self.max_retries
                )
                
                result = await func(*args, **kwargs)
                
                logger.info(
                    "retry_success",
                    context=context,
                    attempt=attempt
                )
                
                return result
                
            except Exception as e:
                last_exception = e
                
                logger.error(
                    "retry_failed",
                    context=context,
                    attempt=attempt,
                    error=str(e)
                )
                
                if attempt < self.max_retries:
                    delay = self.calculate_delay(attempt)
                    logger.info(
                        "retry_delay",
                        context=context,
                        attempt=attempt,
                        delay_seconds=delay
                    )
                    await asyncio.sleep(delay)
        
        logger.error(
            "retry_exhausted",
            context=context,
            max_retries=self.max_retries,
            final_error=str(last_exception)
        )
        
        raise last_exception
    
    def calculate_delay(self, attempt: int) -> float:
        """
        Calculate delay for retry with exponential backoff.
        
        Args:
            attempt: Current attempt number
            
        Returns:
            float: Delay in seconds
        """
        # Exponential backoff
        delay = self.base_delay * (self.exponential_base ** (attempt - 1))
        
        # Add jitter if enabled
        if self.jitter:
            import random
            delay = delay * (0.5 + random.random())
        
        # Cap at max delay
        return min(delay, self.max_delay)
    
    def retry(
        self,
        context: str = "",
        max_retries: Optional[int] = None,
        base_delay: Optional[float] = None
    ):
        """
        Decorator for retry logic.
        
        Args:
            context: Context string for logging
            max_retries: Override max retries
            base_delay: Override base delay
            
        Returns:
            Decorator function
        """
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                handler = RetryHandler(
                    max_retries=max_retries or self.max_retries,
                    base_delay=base_delay or self.base_delay,
                    max_delay=self.max_delay,
                    exponential_base=self.exponential_base,
                    jitter=self.jitter
                )
                return await handler.execute(func, *args, context=context or func.__name__, **kwargs)
            return wrapper
        return decorator


# Singleton instance for convenience
default_retry_handler = RetryHandler()


async def retry_with_backoff(
    func: Callable,
    *args,
    max_retries: int = 3,
    base_delay: float = 1.0,
    context: str = "",
    **kwargs
) -> Any:
    """
    Convenience function for retry with backoff.
    
    Args:
        func: Function to execute
        *args: Function arguments
        max_retries: Maximum number of retries
        base_delay: Base delay in seconds
        context: Context string for logging
        **kwargs: Function keyword arguments
        
    Returns:
        Any: Function result
    """
    handler = RetryHandler(max_retries=max_retries, base_delay=base_delay)
    return await handler.execute(func, *args, context=context, **kwargs)
