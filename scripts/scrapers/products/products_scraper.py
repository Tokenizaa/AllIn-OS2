"""
Scraper for AllIn products.
"""

from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from playwright.async_api import Page

from ..base.session_manager import SessionManager
from .products_models import ProductModel, ProductDetailModel, ProductListModel
from .products_parser import ProductParser

import structlog

logger = structlog.get_logger()


class ProductScraper(SessionManager):
    """
    Scraper for AllIn products from Loja Virtual.
    
    Features:
    - Product list scraping with pagination
    - Product detail scraping
    - Incremental sync support
    - Checkpoint support
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.parser = ProductParser("")
        self.base_url = f"{self.loja_url}/catalog/product"

    def _build_product_list_url(self, token: str, page: int = 1) -> str:
        """
        Build the legacy OpenCart-style product list URL used by the real Loja Virtual.
        """
        if page <= 1:
            return f"{self.base_url}?token={token}"

        # The legacy audit shows `per_page` behaves like an offset, not a size.
        return f"{self.base_url}?token={token}&per_page={(page - 1) * 20}"
    
    async def scrape_product_list(self, page: int = 1) -> ProductListModel:
        """
        Scrape product list page.
        
        Args:
            page: Page number to scrape
            
        Returns:
            ProductListModel: Parsed product list
        """
        try:
            logger.info("scraping_product_list", page=page)
            
            # Use existing page if already logged in
            if not self.page:
                page_instance = await self.get_page()
            else:
                page_instance = self.page
            
            # Extract token from current URL if available
            token = None
            if page_instance.url and 'token=' in page_instance.url:
                token = page_instance.url.split('token=')[1].split('&')[0]

            # Navigate to product list page with token
            if token:
                url = self._build_product_list_url(token, page)
            else:
                url = self.base_url
            
            await page_instance.goto(url, timeout=30000)
            await page_instance.wait_for_load_state('networkidle', timeout=30000)
            
            # Get HTML content
            html = await page_instance.content()
            
            # Parse HTML
            product_list = self.parser.parse_product_list(html)
            
            logger.info(
                "product_list_scraped",
                page=page,
                count=len(product_list.products),
                total=product_list.total
            )
            
            return product_list
            
        except Exception as e:
            logger.error("product_list_scrape_error", page=page, error=str(e))
            return ProductListModel()
    
    async def scrape_product_details(self, product_id: str) -> Optional[ProductDetailModel]:
        """
        Scrape product detail page.
        
        Args:
            product_id: Product ID to scrape
            
        Returns:
            ProductDetailModel: Parsed product detail or None
        """
        try:
            logger.info("scraping_product_detail", product_id=product_id)
            
            page_instance = await self.get_page()
            
            # Navigate to product detail page
            url = f"{self.base_url}/info?product_id={product_id}"
            await page_instance.goto(url, timeout=30000)
            await page_instance.wait_for_load_state('networkidle', timeout=30000)
            
            # Get HTML content
            html = await page_instance.content()
            
            # Parse HTML
            product_detail = self.parser.parse_product_detail(html, product_id)
            
            if product_detail:
                logger.info("product_detail_scraped", product_id=product_id)
            else:
                logger.warning("product_detail_not_found", product_id=product_id)
            
            return product_detail
            
        except Exception as e:
            logger.error("product_detail_scrape_error", product_id=product_id, error=str(e))
            return None
    
    async def scrape_all_products(
        self,
        max_pages: Optional[int] = None,
        include_details: bool = False
    ) -> List[ProductModel]:
        """
        Scrape all products across all pages.
        
        Args:
            max_pages: Maximum number of pages to scrape (None for all)
            include_details: Whether to scrape product details
            
        Returns:
            List[ProductModel]: All scraped products
        """
        try:
            logger.info("scraping_all_products", max_pages=max_pages, include_details=include_details)
            
            all_products = []
            current_page = 1
            has_more = True
            
            while has_more:
                # Check max pages limit
                if max_pages and current_page > max_pages:
                    logger.info("max_pages_reached", max_pages=max_pages)
                    break
                
                # Scrape current page
                product_list = await self.scrape_product_list(current_page)
                
                if not product_list.products:
                    logger.info("no_more_products", page=current_page)
                    break
                
                # Add products to list
                all_products.extend(product_list.products)
                
                # Check if there are more pages
                has_more = product_list.has_next
                
                # Move to next page
                current_page += 1
                
                # Small delay to avoid rate limiting
                import asyncio
                await asyncio.sleep(1)
            
            logger.info("all_products_scraped", total=len(all_products))
            
            # Scrape details if requested
            if include_details:
                logger.info("scraping_product_details", count=len(all_products))
                for i, product in enumerate(all_products):
                    detail = await self.scrape_product_details(product.product_id)
                    if detail:
                        # Could merge detail into product model here
                        pass
                    
                    # Progress logging
                    if (i + 1) % 10 == 0:
                        logger.info("details_progress", current=i+1, total=len(all_products))
                    
                    # Small delay
                    await asyncio.sleep(0.5)
            
            return all_products
            
        except Exception as e:
            logger.error("all_products_scrape_error", error=str(e))
            return all_products
    
    async def scrape_incremental(
        self,
        since: datetime,
        max_pages: int = 10
    ) -> List[ProductModel]:
        """
        Scrape products incrementally since a given date.
        
        Args:
            since: Date to scrape from
            max_pages: Maximum number of pages to check
            
        Returns:
            List[ProductModel]: Incrementally scraped products
        """
        try:
            logger.info("scraping_incremental", since=since.isoformat(), max_pages=max_pages)
            
            # For now, just scrape recent pages
            # In a real implementation, you would filter by date
            products = await self.scrape_all_products(max_pages=max_pages)
            
            # Filter by sync date (if available in the data)
            filtered_products = [
                p for p in products
                if p.allin_synced_at >= since
            ]
            
            logger.info(
                "incremental_scrape_completed",
                total=len(products),
                filtered=len(filtered_products)
            )
            
            return filtered_products
            
        except Exception as e:
            logger.error("incremental_scrape_error", error=str(e))
            return []
