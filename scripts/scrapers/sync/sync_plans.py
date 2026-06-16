"""
Sync script for AllIn plans.
"""

import asyncio
import os
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv

from ..base.browser_manager import BrowserManager
from ..plans.plans_scraper import PlanScraper
from .sync_manager import SyncManager

import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ]
)
logger = structlog.get_logger()


async def sync_plans(
    include_details: bool = False
) -> None:
    """
    Sync plans from AllIn to Supabase.
    
    Args:
        include_details: Whether to scrape plan details
    """
    # Load environment variables
    load_dotenv()
    
    # Get configuration
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        logger.error("missing_supabase_config")
        return
    
    logger.info("sync_plans_started", include_details=include_details)
    
    # Initialize browser manager
    browser_manager = BrowserManager(headless=True)
    
    try:
        # Start browser
        await browser_manager.start()
        browser = browser_manager.browser
        
        # Initialize plan scraper
        plan_scraper = PlanScraper()
        
        # Login to AllIn (admin panel)
        login_success = await plan_scraper.login(browser, target="admin")
        
        if not login_success:
            logger.error("login_failed")
            return
        
        # Scrape plans
        plans = await plan_scraper.scrape_all_plans(include_details=include_details)
        
        # Convert to dictionaries
        plans_data = [p.model_dump() for p in plans]
        
        logger.info("plans_scraped", count=len(plans_data))
        
        # Initialize sync manager
        sync_manager = SyncManager(supabase_url, supabase_key)
        
        # Sync to Supabase
        result = await sync_manager.sync_plans(plans_data)
        
        logger.info("sync_plans_completed", result=result.to_dict())
        
        # Save checkpoint
        sync_manager.save_checkpoint("plans", {
            "last_sync": datetime.now().isoformat(),
            "records_processed": result.processed_records,
            "records_failed": result.failed_records,
        })
        
    except Exception as e:
        logger.error("sync_plans_error", error=str(e))
    
    finally:
        # Cleanup
        await browser_manager.stop()
        if plan_scraper:
            await plan_scraper.close()


if __name__ == "__main__":
    asyncio.run(sync_plans())
