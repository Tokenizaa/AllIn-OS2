"""
Parser for AllIn products.
"""

from typing import Optional, List, Dict
from decimal import Decimal
import re

from ..base.parser_base import ParserBase
from .products_models import ProductModel, ProductDetailModel, ProductListModel

import structlog

logger = structlog.get_logger()


class ProductParser(ParserBase):
    """
    Parser for AllIn product pages.
    
    Parses product list and detail pages from Loja Virtual.
    """
    
    def parse_product_list(self, html: str) -> ProductListModel:
        """
        Parse product list page.
        
        Args:
            html: HTML content of product list page
            
        Returns:
            ProductListModel: Parsed product list
        """
        self.soup = self.__class__(html).soup
        
        try:
            # Extract pagination info
            pagination = self._extract_pagination()
            
            # Extract product rows
            products = []
            product_rows = self.soup.select('table tbody tr')
            
            for row in product_rows:
                product = self._parse_product_row(row)
                if product:
                    products.append(product)
            
            self.logger.info("product_list_parsed", count=len(products))
            
            return ProductListModel(
                products=products,
                total=pagination.get('total', len(products)),
                page=pagination.get('page', 1),
                pages=pagination.get('pages', 1),
                has_next=pagination.get('has_next', False),
                has_previous=pagination.get('has_previous', False),
            )
            
        except Exception as e:
            self.logger.error("product_list_parse_error", error=str(e))
            return ProductListModel()
    
    def parse_product_detail(self, html: str, product_id: str) -> Optional[ProductDetailModel]:
        """
        Parse product detail page.
        
        Args:
            html: HTML content of product detail page
            product_id: Product ID
            
        Returns:
            ProductDetailModel: Parsed product detail or None
        """
        self.soup = self.__class__(html).soup
        
        try:
            # Extract description
            description = self.extract_text('#tab-description, .description, .product-description')
            
            # Extract images
            images = self._extract_product_images()
            
            # Extract weight
            weight = self._extract_weight()
            
            # Extract dimensions
            dimensions = self._extract_dimensions()
            
            # Extract SEO metadata
            seo = self._extract_seo()
            
            # Extract attributes
            attributes = self._extract_attributes()
            
            # Extract categories
            categories = self._extract_categories()
            
            self.logger.info("product_detail_parsed", product_id=product_id)
            
            return ProductDetailModel(
                product_id=product_id,
                descricao=description,
                imagens=images,
                peso=weight,
                dimensoes=dimensions,
                seo=seo,
                atributos=attributes,
                categorias=categories,
            )
            
        except Exception as e:
            self.logger.error("product_detail_parse_error", product_id=product_id, error=str(e))
            return None
    
    def _parse_product_row(self, row) -> Optional[ProductModel]:
        """
        Parse a single product row from table.
        
        Args:
            row: BeautifulSoup table row element
            
        Returns:
            ProductModel: Parsed product or None
        """
        try:
            cells = row.select('td')
            if len(cells) < 10:
                return None
            
            # Extract product ID (second column after checkbox)
            product_id = cells[1].get_text(strip=True)
            
            # Extract SKU (third column - usually empty)
            sku = cells[2].get_text(strip=True) if len(cells) > 2 else ""
            
            # Extract name (fifth column - after image)
            nome = cells[4].get_text(strip=True) if len(cells) > 4 else ""
            
            # Extract model (sixth column)
            modelo = cells[5].get_text(strip=True) if len(cells) > 5 else ""
            
            # Extract category (seventh column)
            categoria = cells[6].get_text(strip=True) if len(cells) > 6 else "Geral"
            
            # Extract points (eighth column - usually empty)
            pontos = self._extract_points(cells[7]) if len(cells) > 7 else None
            
            # Extract price (ninth column)
            preco = self._extract_price(cells[8]) if len(cells) > 8 else Decimal('0.00')
            
            # Extract stock (tenth column - format "Estoque: X")
            estoque = self._extract_stock_from_link(cells[9]) if len(cells) > 9 else 0
            
            # Extract featured (eleventh column - Sim/Não)
            featured = self._extract_featured(cells[10]) if len(cells) > 10 else False
            
            # Extract status (twelfth column - Habilitado/Desabilitado)
            status = self._extract_status_from_text(cells[11]) if len(cells) > 11 else "active"
            
            # Extract store/CD (thirteenth column)
            store = cells[12].get_text(strip=True) if len(cells) > 12 else ""
            
            # Extract moderation (fourteenth column)
            moderacao = cells[13].get_text(strip=True) if len(cells) > 13 else ""
            
            return ProductModel(
                product_id=product_id,
                sku=sku,
                nome=nome,
                modelo=modelo,
                categoria=categoria,
                preco=preco,
                pontos=pontos,
                estoque=estoque,
                status=status,
                featured=featured,
                moderacao=moderacao,
            )
            
        except Exception as e:
            self.logger.error("product_row_parse_error", error=str(e))
            return None
    
    def _extract_product_id(self, cell) -> str:
        """Extract product ID from cell."""
        link = cell.select_one('a')
        if link:
            href = link.get('href', '')
            # Extract ID from URL (e.g., product_id=123)
            match = re.search(r'product_id=(\d+)', href)
            if match:
                return match.group(1)
        return cell.get_text(strip=True)
    
    def _extract_sku(self, cell) -> str:
        """Extract SKU from cell."""
        return cell.get_text(strip=True)
    
    def _extract_price(self, cell) -> Decimal:
        """Extract price from cell."""
        text = cell.get_text(strip=True)
        # Remove currency symbols and format
        price_text = re.sub(r'[R$\s]', '', text)
        price_text = price_text.replace(',', '.')
        try:
            return Decimal(price_text)
        except:
            return Decimal('0.00')
    
    def _extract_points(self, cell) -> Optional[int]:
        """Extract points from cell."""
        text = cell.get_text(strip=True)
        try:
            return int(text)
        except:
            return None
    
    def _extract_stock(self, cell) -> int:
        """Extract stock quantity from cell."""
        text = cell.get_text(strip=True)
        try:
            return int(text)
        except:
            return 0
    
    def _extract_stock_from_link(self, cell) -> int:
        """Extract stock quantity from link with format 'Estoque: X'."""
        link = cell.select_one('a')
        if link:
            text = link.get_text(strip=True)
            # Extract number from "Estoque: X" format
            match = re.search(r'(\d+)', text)
            if match:
                return int(match.group(1))
        return 0
    
    def _extract_status(self, cell) -> str:
        """Extract status from cell."""
        text = cell.get_text(strip=True).lower()
        if 'ativo' in text or 'enabled' in text:
            return 'active'
        elif 'inativo' in text or 'disabled' in text:
            return 'inactive'
        return text
    
    def _extract_status_from_text(self, cell) -> str:
        """Extract status from text (Habilitado/Desabilitado)."""
        text = cell.get_text(strip=True).lower()
        if 'habilitado' in text or 'enabled' in text or 'ativo' in text:
            return 'active'
        elif 'desabilitado' in text or 'disabled' in text or 'inativo' in text:
            return 'inactive'
        return text
    
    def _extract_featured(self, cell) -> bool:
        """Extract featured status from cell."""
        text = cell.get_text(strip=True).lower()
        return 'sim' in text or 'yes' in text or 'true' in text
    
    def _extract_pagination(self) -> Dict[str, any]:
        """Extract pagination information."""
        pagination = {
            'page': 1,
            'pages': 1,
            'total': 0,
            'has_next': False,
            'has_previous': False,
        }
        
        try:
            # Look for pagination elements
            pagination_div = self.soup.select_one('.pagination, .pagination-wrapper')
            if pagination_div:
                # Extract current page
                current_page = pagination_div.select_one('.active, .current')
                if current_page:
                    pagination['page'] = int(current_page.get_text(strip=True))
                
                # Extract total pages
                pages = pagination_div.select('a, span')
                if pages:
                    page_numbers = []
                    for page in pages:
                        text = page.get_text(strip=True)
                        if text.isdigit():
                            page_numbers.append(int(text))
                    if page_numbers:
                        pagination['pages'] = max(page_numbers)
                
                # Check for next/previous
                pagination['has_next'] = pagination_div.select_one('.next, .fa-chevron-right') is not None
                pagination['has_previous'] = pagination_div.select_one('.previous, .fa-chevron-left') is not None
            
            # Extract total from text
            total_text = self.extract_text('.pagination-info, .showing-text')
            if total_text:
                match = re.search(r'(\d+)', total_text.replace(',', ''))
                if match:
                    pagination['total'] = int(match.group(1))
            
        except Exception as e:
            self.logger.warning("pagination_extract_error", error=str(e))
        
        return pagination
    
    def _extract_product_images(self) -> List[str]:
        """Extract product images."""
        images = []
        
        # Look for main image
        main_image = self.soup.select_one('.main-image img, .product-image img, #main-image img')
        if main_image:
            src = main_image.get('src') or main_image.get('data-src')
            if src:
                images.append(src)
        
        # Look for thumbnail gallery
        thumbnails = self.soup.select('.thumbnail img, .gallery img, .product-thumbnails img')
        for thumb in thumbnails:
            src = thumb.get('src') or thumb.get('data-src')
            if src and src not in images:
                images.append(src)
        
        return images
    
    def _extract_weight(self) -> Optional[Decimal]:
        """Extract product weight."""
        weight_text = self.extract_text('.weight, .product-weight, [data-weight]')
        if weight_text:
            match = re.search(r'([\d.]+)\s*(kg|g)', weight_text.lower())
            if match:
                value = Decimal(match.group(1))
                unit = match.group(2)
                if unit == 'g':
                    value = value / Decimal('1000')
                return value
        return None
    
    def _extract_dimensions(self) -> Optional[Dict[str, Decimal]]:
        """Extract product dimensions."""
        dimensions_text = self.extract_text('.dimensions, .product-dimensions, [data-dimensions]')
        if dimensions_text:
            # Try to parse dimensions like "10x20x30 cm"
            match = re.search(r'(\d+)\s*[xX]\s*(\d+)\s*[xX]\s*(\d+)', dimensions_text)
            if match:
                return {
                    'length': Decimal(match.group(1)),
                    'width': Decimal(match.group(2)),
                    'height': Decimal(match.group(3)),
                }
        return None
    
    def _extract_seo(self) -> Dict[str, str]:
        """Extract SEO metadata."""
        seo = {}
        
        # Meta description
        meta_desc = self.soup.select_one('meta[name="description"]')
        if meta_desc:
            seo['description'] = meta_desc.get('content', '')
        
        # Meta keywords
        meta_keywords = self.soup.select_one('meta[name="keywords"]')
        if meta_keywords:
            seo['keywords'] = meta_keywords.get('content', '')
        
        # Canonical URL
        canonical = self.soup.select_one('link[rel="canonical"]')
        if canonical:
            seo['canonical'] = canonical.get('href', '')
        
        return seo
    
    def _extract_attributes(self) -> List[Dict[str, str]]:
        """Extract product attributes."""
        attributes = []
        
        # Look for attribute table
        attr_table = self.soup.select_one('.attributes table, .product-attributes table')
        if attr_table:
            rows = attr_table.select('tr')
            for row in rows:
                cells = row.select('td, th')
                if len(cells) >= 2:
                    attributes.append({
                        'name': cells[0].get_text(strip=True),
                        'value': cells[1].get_text(strip=True),
                    })
        
        return attributes
    
    def _extract_categories(self) -> List[str]:
        """Extract product categories."""
        categories = []
        
        # Look for breadcrumb
        breadcrumb = self.soup.select_one('.breadcrumb, .breadcrumbs')
        if breadcrumb:
            links = breadcrumb.select('a')
            for link in links:
                text = link.get_text(strip=True)
                if text and text.lower() not in ['home', 'início']:
                    categories.append(text)
        
        # Look for category tags
        category_tags = self.soup.select('.category, .product-category')
        for tag in category_tags:
            text = tag.get_text(strip=True)
            if text and text not in categories:
                categories.append(text)
        
        return categories
