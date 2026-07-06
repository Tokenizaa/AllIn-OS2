"""
Scraper for AllIn plans.
"""

from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from playwright.async_api import Page

from ..base.session_manager import SessionManager
from .plans_models import PlanModel, PlanDetailModel, PlanListModel
from .plans_parser import PlanParser

import structlog

logger = structlog.get_logger()


class PlanScraper(SessionManager):
    """
    Scraper for AllIn plans from Admin Panel.
    
    Features:
    - Plan list scraping
    - Plan detail scraping
    - Checkpoint support
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.parser = PlanParser("")
        self.base_url = f"{self.admin_url}"
    
    async def scrape_plan_list(self) -> PlanListModel:
        """
        Scrape plan list page.
        
        Returns:
            PlanListModel: Parsed plan list
        """
        try:
            logger.info("scraping_plan_list")
            
            page_instance = await self.get_page()
            
            # Navigate to plan list page
            url = f"{self.base_url}/planos"
            await page_instance.goto(url, timeout=30000)
            await page_instance.wait_for_load_state('networkidle', timeout=30000)
            
            # Get HTML content
            html = await page_instance.content()
            
            # Parse HTML
            plan_list = self.parser.parse_plan_list(html)
            
            logger.info(
                "plan_list_scraped",
                count=len(plan_list.plans),
                total=plan_list.total
            )
            
            return plan_list
            
        except Exception as e:
            logger.error("plan_list_scrape_error", error=str(e))
            return PlanListModel()
    
    async def scrape_plan_details(self, plan_id: str) -> Optional[PlanDetailModel]:
        """
        Scrape plan detail page.
        
        Args:
            plan_id: Plan ID to scrape
            
        Returns:
            PlanDetailModel: Parsed plan detail or None
        """
        try:
            logger.info("scraping_plan_detail", plan_id=plan_id)
            
            page_instance = await self.get_page()
            
            # Navigate to plan detail page
            url = f"{self.base_url}/planos/detalhes?plan_id={plan_id}"
            await page_instance.goto(url, timeout=30000)
            await page_instance.wait_for_load_state('networkidle', timeout=30000)
            
            # Get HTML content
            html = await page_instance.content()
            
            # Parse HTML
            plan_detail = self.parser.parse_plan_detail(html, plan_id)
            
            if plan_detail:
                logger.info("plan_detail_scraped", plan_id=plan_id)
            else:
                logger.warning("plan_detail_not_found", plan_id=plan_id)
            
            return plan_detail
            
        except Exception as e:
            logger.error("plan_detail_scrape_error", plan_id=plan_id, error=str(e))
            return None
    
    async def scrape_all_plans(self, include_details: bool = False) -> List[PlanModel]:
        """
        Scrape all plans.
        
        Args:
            include_details: Whether to scrape plan details
            
        Returns:
            List[PlanModel]: All scraped plans
        """
        try:
            logger.info("scraping_all_plans", include_details=include_details)
            
            # Scrape plan list
            plan_list = await self.scrape_plan_list()
            
            if not plan_list.plans:
                logger.info("no_plans_found")
                return []
            
            logger.info("all_plans_scraped", total=len(plan_list.plans))
            
            # Scrape details if requested
            if include_details:
                logger.info("scraping_plan_details", count=len(plan_list.plans))
                for i, plan in enumerate(plan_list.plans):
                    detail = await self.scrape_plan_details(plan.plan_id)
                    if detail:
                        # Could merge detail into plan model here
                        pass
                    
                    # Progress logging
                    if (i + 1) % 5 == 0:
                        logger.info("details_progress", current=i+1, total=len(plan_list.plans))
                    
                    # Small delay
                    import asyncio
                    await asyncio.sleep(0.5)
            
            return plan_list.plans
            
        except Exception as e:
            logger.error("all_plans_scrape_error", error=str(e))
            return []
