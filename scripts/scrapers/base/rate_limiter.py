"""
Rate Limiter for AllIn scrapers.
Handles rate limiting to prevent server blocking.
"""

import asyncio
from typing import Optional
from datetime import datetime, timedelta
import structlog

logger = structlog.get_logger()


class RateLimiter:
    """
    Rate limiter using token bucket algorithm.
    
    Features:
    - Configurable rate limits
    - Token bucket algorithm
    - Per-endpoint limits
    - Wait time calculation
    """
    
    def __init__(
        self,
        max_requests: int = 10,
        time_window: int = 60,
        burst_size: Optional[int] = None
    ):
        """
        Initialize rate limiter.
        
        Args:
            max_requests: Maximum requests per time window
            time_window: Time window in seconds
            burst_size: Maximum burst size (defaults to max_requests)
        """
        self.max_requests = max_requests
        self.time_window = time_window
        self.burst_size = burst_size or max_requests
        
        self.tokens = self.burst_size
        self.last_refill = datetime.now()
        self.lock = asyncio.Lock()
    
    async def acquire(self, tokens: int = 1) -> None:
        """
        Acquire tokens from the bucket.
        
        Args:
            tokens: Number of tokens to acquire
        """
        async with self.lock:
            # Refill tokens
            self._refill()
            
            # Check if enough tokens available
            if self.tokens >= tokens:
                self.tokens -= tokens
                logger.debug(
                    "tokens_acquired",
                    tokens=tokens,
                    remaining=self.tokens
                )
            else:
                # Calculate wait time
                wait_time = self._calculate_wait_time(tokens)
                logger.info(
                    "rate_limit_wait",
                    wait_seconds=wait_time,
                    tokens_needed=tokens,
                    available=self.tokens
                )
                await asyncio.sleep(wait_time)
                
                # Refill and acquire after wait
                self._refill()
                self.tokens -= tokens
    
    def _refill(self) -> None:
        """Refill tokens based on time elapsed."""
        now = datetime.now()
        elapsed = (now - self.last_refill).total_seconds()
        
        if elapsed > 0:
            # Calculate tokens to add
            tokens_to_add = (elapsed / self.time_window) * self.max_requests
            
            # Cap at burst size
            self.tokens = min(self.burst_size, self.tokens + tokens_to_add)
            self.last_refill = now
    
    def _calculate_wait_time(self, tokens_needed: int) -> float:
        """
        Calculate wait time for tokens.
        
        Args:
            tokens_needed: Number of tokens needed
            
        Returns:
            float: Wait time in seconds
        """
        tokens_deficit = tokens_needed - self.tokens
        wait_time = (tokens_deficit / self.max_requests) * self.time_window
        return max(0, wait_time)
    
    def get_available_tokens(self) -> int:
        """
        Get available tokens.
        
        Returns:
            int: Available tokens
        """
        self._refill()
        return int(self.tokens)
    
    def reset(self) -> None:
        """Reset rate limiter."""
        self.tokens = self.burst_size
        self.last_refill = datetime.now()
        logger.info("rate_limiter_reset")


class SlidingWindowRateLimiter:
    """
    Rate limiter using sliding window algorithm.
    
    Features:
    - Sliding window for precise rate limiting
    - Request timestamp tracking
    - Configurable window size
    """
    
    def __init__(
        self,
        max_requests: int = 10,
        time_window: int = 60
    ):
        """
        Initialize sliding window rate limiter.
        
        Args:
            max_requests: Maximum requests per time window
            time_window: Time window in seconds
        """
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
        self.lock = asyncio.Lock()
    
    async def acquire(self) -> None:
        """Acquire permission to make a request."""
        async with self.lock:
            now = datetime.now()
            
            # Remove old requests outside window
            self._cleanup_old_requests(now)
            
            # Check if under limit
            if len(self.requests) < self.max_requests:
                self.requests.append(now)
                logger.debug(
                    "request_allowed",
                    requests_in_window=len(self.requests),
                    max_requests=self.max_requests
                )
            else:
                # Calculate wait time
                oldest_request = self.requests[0]
                wait_time = self._calculate_wait_time(oldest_request)
                
                logger.info(
                    "rate_limit_wait",
                    wait_seconds=wait_time,
                    requests_in_window=len(self.requests)
                )
                
                await asyncio.sleep(wait_time)
                
                # Cleanup and add request after wait
                self._cleanup_old_requests(datetime.now())
                self.requests.append(datetime.now())
    
    def _cleanup_old_requests(self, now: datetime) -> None:
        """Remove requests outside the time window."""
        cutoff = now - timedelta(seconds=self.time_window)
        self.requests = [r for r in self.requests if r > cutoff]
    
    def _calculate_wait_time(self, oldest_request: datetime) -> float:
        """
        Calculate wait time until oldest request leaves window.
        
        Args:
            oldest_request: Oldest request timestamp
            
        Returns:
            float: Wait time in seconds
        """
        now = datetime.now()
        time_since_oldest = (now - oldest_request).total_seconds()
        wait_time = self.time_window - time_since_oldest
        return max(0, wait_time)
    
    def get_request_count(self) -> int:
        """
        Get current request count in window.
        
        Returns:
            int: Request count
        """
        self._cleanup_old_requests(datetime.now())
        return len(self.requests)
    
    def reset(self) -> None:
        """Reset rate limiter."""
        self.requests = []
        logger.info("sliding_window_rate_limiter_reset")


# Singleton instances for convenience
default_rate_limiter = RateLimiter(max_requests=10, time_window=60)
default_sliding_limiter = SlidingWindowRateLimiter(max_requests=10, time_window=60)
