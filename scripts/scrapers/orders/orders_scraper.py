"""
Scraper for AllIn orders.
"""

from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from playwright.async_api import Page

from ..base.session_manager import SessionManager
from .orders_models import OrderModel, OrderDetailModel, OrderListModel
from .orders_parser import OrderParser

import structlog

logger = structlog.get_logger()


class OrderScraper(SessionManager):
    """
    Scraper for AllIn orders from Loja Virtual.
    
    Features:
    - Order list scraping with pagination
    - Order detail scraping
    - Incremental sync support
    - Checkpoint support
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.parser = OrderParser("")
        self.base_url = f"{self.loja_url}/sale/order"

    def _build_order_list_url(self, token: str, page: int = 1) -> str:
        """
        Build the legacy order list URL.
        """
        if page <= 1:
            return f"{self.base_url}?token={token}"

        # In the legacy Loja Virtual, per_page is used as an offset.
        return f"{self.base_url}?token={token}&per_page={(page - 1) * 15}"
    
    async def scrape_order_list(self, page: int = 1) -> OrderListModel:
        """
        Scrape order list page.
        
        Args:
            page: Page number to scrape
            
        Returns:
            OrderListModel: Parsed order list
        """
        try:
            logger.info("scraping_order_list", page=page)
            
            page_instance = await self.get_page()
            
            # Navigate to order list page
            token = None
            if page_instance.url and "token=" in page_instance.url:
                token = page_instance.url.split("token=")[1].split("&")[0]

            url = self._build_order_list_url(token, page) if token else f"{self.base_url}?page={page}"
            await page_instance.goto(url, timeout=30000)
            await page_instance.wait_for_load_state('networkidle', timeout=30000)
            
            # Get HTML content
            html = await page_instance.content()
            
            # Parse HTML
            order_list = self.parser.parse_order_list(html)
            
            logger.info(
                "order_list_scraped",
                page=page,
                count=len(order_list.orders),
                total=order_list.total
            )
            
            return order_list
            
        except Exception as e:
            logger.error("order_list_scrape_error", page=page, error=str(e))
            return OrderListModel()
    
    async def scrape_order_details(self, order_id: str) -> Optional[OrderDetailModel]:
        """
        Scrape order detail page.
        
        Args:
            order_id: Order ID to scrape
            
        Returns:
            OrderDetailModel: Parsed order detail or None
        """
        try:
            logger.info("scraping_order_detail", order_id=order_id)
            
            page_instance = await self.get_page()
            
            # Navigate to order detail page
            url = f"{self.base_url}/info?order_id={order_id}"
            await page_instance.goto(url, timeout=30000)
            await page_instance.wait_for_load_state('networkidle', timeout=30000)
            
            # Get HTML content
            html = await page_instance.content()
            
            # Parse HTML
            order_detail = self.parser.parse_order_detail(html, order_id)
            
            if order_detail:
                logger.info("order_detail_scraped", order_id=order_id)
            else:
                logger.warning("order_detail_not_found", order_id=order_id)
            
            return order_detail
            
        except Exception as e:
            logger.error("order_detail_scrape_error", order_id=order_id, error=str(e))
            return None
    
    async def scrape_all_orders(
        self,
        max_pages: Optional[int] = None,
        include_details: bool = False
    ) -> List[OrderModel]:
        """
        Scrape all orders across all pages.
        
        Args:
            max_pages: Maximum number of pages to scrape (None for all)
            include_details: Whether to scrape order details
            
        Returns:
            List[OrderModel]: All scraped orders
        """
        try:
            logger.info("scraping_all_orders", max_pages=max_pages, include_details=include_details)
            
            all_orders = []
            current_page = 1
            has_more = True
            
            while has_more:
                # Check max pages limit
                if max_pages and current_page > max_pages:
                    logger.info("max_pages_reached", max_pages=max_pages)
                    break
                
                # Scrape current page
                order_list = await self.scrape_order_list(current_page)
                
                if not order_list.orders:
                    logger.info("no_more_orders", page=current_page)
                    break
                
                # Add orders to list
                all_orders.extend(order_list.orders)
                
                # Check if there are more pages
                has_more = order_list.has_next
                
                # Move to next page
                current_page += 1
                
                # Small delay to avoid rate limiting
                import asyncio
                await asyncio.sleep(1)
                
                # Progress logging
                if current_page % 10 == 0:
                    logger.info("scraping_progress", page=current_page, orders=len(all_orders))
            
            logger.info("all_orders_scraped", total=len(all_orders))
            
            # Scrape details if requested
            if include_details:
                logger.info("scraping_order_details", count=len(all_orders))
                for i, order in enumerate(all_orders):
                    detail = await self.scrape_order_details(order.order_id)
                    if detail:
                        # Could merge detail into order model here
                        pass
                    
                    # Progress logging
                    if (i + 1) % 10 == 0:
                        logger.info("details_progress", current=i+1, total=len(all_orders))
                    
                    # Small delay
                    await asyncio.sleep(0.5)
            
            return all_orders
            
        except Exception as e:
            logger.error("all_orders_scrape_error", error=str(e))
            return all_orders
    
    async def scrape_incremental(
        self,
        since: datetime,
        max_pages: int = 10
    ) -> List[OrderModel]:
        """
        Scrape orders incrementally since a given date.
        
        Args:
            since: Date to scrape from
            max_pages: Maximum number of pages to check
            
        Returns:
            List[OrderModel]: Incrementally scraped orders
        """
        try:
            logger.info("scraping_incremental", since=since.isoformat(), max_pages=max_pages)
            
            # For now, just scrape recent pages
            # In a real implementation, you would filter by date
            orders = await self.scrape_all_orders(max_pages=max_pages)
            
            # Filter by sync date (if available in the data)
            filtered_orders = [
                o for o in orders
                if o.data >= since
            ]
            
            logger.info(
                "incremental_scrape_completed",
                total=len(orders),
                filtered=len(filtered_orders)
            )
            
            return filtered_orders
            
        except Exception as e:
            logger.error("incremental_scrape_error", error=str(e))
            return []
