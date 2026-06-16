"""
Browser Manager for AllIn scrapers.
Handles browser lifecycle and context management.
"""

from typing import Optional
from playwright.async_api import Browser, BrowserContext, Playwright, async_playwright

import structlog

logger = structlog.get_logger()


class BrowserManager:
    """
    Manages browser lifecycle for Playwright.
    
    Features:
    - Browser startup and shutdown
    - Context creation with storage state
    - Resource cleanup
    - Headless mode support
    """
    
    def __init__(
        self,
        headless: bool = True,
        timeout: int = 30000,
        user_agent: Optional[str] = None
    ):
        self.headless = headless
        self.timeout = timeout
        self.user_agent = user_agent
        
        self.playwright: Optional[Playwright] = None
        self.browser: Optional[Browser] = None
    
    async def start(self) -> Browser:
        """
        Start Playwright browser.
        
        Returns:
            Browser: Playwright browser instance
        """
        try:
            logger.info("browser_starting", headless=self.headless)
            
            self.playwright = await async_playwright().start()
            
            # Launch browser with options
            launch_options = {
                "headless": self.headless,
                "timeout": self.timeout,
            }
            
            self.browser = await self.playwright.chromium.launch(**launch_options)
            
            logger.info("browser_started")
            
            return self.browser
            
        except Exception as e:
            logger.error("browser_start_error", error=str(e))
            raise
    
    async def stop(self) -> None:
        """
        Stop browser and cleanup resources.
        """
        try:
            if self.browser:
                try:
                    await self.browser.close()
                except Exception as close_error:
                    logger.warning("browser_close_error", error=str(close_error))
                self.browser = None
            
            if self.playwright:
                try:
                    await self.playwright.stop()
                except Exception as stop_error:
                    logger.warning("playwright_stop_error", error=str(stop_error))
                self.playwright = None
            
            logger.info("browser_stopped")
            
        except Exception as e:
            logger.error("browser_stop_error", error=str(e))
    
    async def new_context(
        self,
        storage_state: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> BrowserContext:
        """
        Create new browser context.
        
        Args:
            storage_state: Path to storage state file
            user_agent: Custom user agent string
            
        Returns:
            BrowserContext: New browser context
        """
        try:
            if not self.browser:
                raise RuntimeError("Browser not started. Call start() first.")
            
            context_options = {
                "viewport": {"width": 1920, "height": 1080},
                "user_agent": user_agent or self.user_agent,
            }
            
            # Add storage state if provided
            if storage_state:
                context_options["storage_state"] = storage_state
            
            context = await self.browser.new_context(**context_options)
            
            logger.info("context_created", has_storage=storage_state is not None)
            
            return context
            
        except Exception as e:
            logger.error("context_creation_error", error=str(e))
            raise
    
    async def new_page(self, context: BrowserContext):
        """
        Create new page in context.
        
        Args:
            context: Browser context
            
        Returns:
            Page: New page instance
        """
        try:
            page = await context.new_page()
            
            # Set default timeout
            page.set_default_timeout(self.timeout)
            
            logger.info("page_created")
            
            return page
            
        except Exception as e:
            logger.error("page_creation_error", error=str(e))
            raise
    
    def is_running(self) -> bool:
        """
        Check if browser is running.
        
        Returns:
            bool: True if browser is running
        """
        return self.browser is not None and self.browser.is_connected()
    
    async def __aenter__(self):
        """Async context manager entry."""
        await self.start()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.stop()
