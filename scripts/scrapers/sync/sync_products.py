"""
Sync script for AllIn products.
"""

import asyncio
import os
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv

from ..base.browser_manager import BrowserManager
from ..products.products_scraper import ProductScraper
from .sync_manager import SyncManager

import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ]
)
logger = structlog.get_logger()


async def sync_products(
    incremental: bool = False,
    since: Optional[datetime] = None,
    max_pages: Optional[int] = None
) -> None:
    """
    Sync products from AllIn to Supabase.
    
    Args:
        incremental: Whether to perform incremental sync
        since: Date to sync from (for incremental sync)
        max_pages: Maximum number of pages to scrape
    """
    # Load environment variables
    load_dotenv()
    
    # Get configuration
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        logger.error("missing_supabase_config")
        return
    
    logger.info("sync_products_started", incremental=incremental, since=since)
    
    # Initialize browser manager
    browser_manager = BrowserManager(headless=True)
    
    try:
        # Start browser
        await browser_manager.start()
        browser = browser_manager.browser
        
        # Initialize product scraper
        product_scraper = ProductScraper()
        
        # Login to AllIn
        login_success = await product_scraper.login(browser, target="loja")
        
        if not login_success:
            logger.error("login_failed")
            return
        
        # Scrape products
        if incremental and since:
            products = await product_scraper.scrape_incremental(since, max_pages=max_pages or 10)
        else:
            products = await product_scraper.scrape_all_products(max_pages=max_pages)
        
        # Convert to dictionaries
        products_data = [p.model_dump() for p in products]
        
        logger.info("products_scraped", count=len(products_data))
        
        # Initialize sync manager
        sync_manager = SyncManager(supabase_url, supabase_key)
        
        # Sync to Supabase
        result = await sync_manager.sync_products(products_data)
        
        logger.info("sync_products_completed", result=result.to_dict())
        
        # Save checkpoint
        sync_manager.save_checkpoint("products", {
            "last_sync": datetime.now().isoformat(),
            "records_processed": result.processed_records,
            "records_failed": result.failed_records,
        })
        
    except Exception as e:
        logger.error("sync_products_error", error=str(e))
    
    finally:
        # Cleanup
        await browser_manager.stop()
        if product_scraper:
            await product_scraper.close()


if __name__ == "__main__":
    asyncio.run(sync_products())
