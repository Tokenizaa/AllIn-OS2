"""
Parser Base for AllIn scrapers.
Handles HTML parsing with BeautifulSoup.
"""

from typing import List, Dict, Optional, Any
from bs4 import BeautifulSoup, Tag
import structlog

logger = structlog.get_logger()


class ParserBase:
    """
    Base parser for HTML content using BeautifulSoup.
    
    Features:
    - Text extraction
    - Table extraction
    - Link extraction
    - Attribute extraction
    - Safe navigation
    """
    
    def __init__(self, html: str, parser: str = 'lxml'):
        """
        Initialize parser with HTML content.
        
        Args:
            html: HTML content to parse
            parser: Parser to use (default: lxml)
        """
        self.soup = BeautifulSoup(html, parser)
        self.logger = logger.bind(parser=self.__class__.__name__)
    
    def extract_text(self, selector: str, default: str = "") -> str:
        """
        Extract text from element using CSS selector.
        
        Args:
            selector: CSS selector
            default: Default value if element not found
            
        Returns:
            str: Extracted text or default value
        """
        try:
            element = self.soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                return text
            return default
        except Exception as e:
            self.logger.error("extract_text_error", selector=selector, error=str(e))
            return default
    
    def extract_attribute(self, selector: str, attribute: str, default: Any = None) -> Any:
        """
        Extract attribute from element using CSS selector.
        
        Args:
            selector: CSS selector
            attribute: Attribute name
            default: Default value if element not found
            
        Returns:
            Any: Extracted attribute or default value
        """
        try:
            element = self.soup.select_one(selector)
            if element:
                return element.get(attribute, default)
            return default
        except Exception as e:
            self.logger.error("extract_attribute_error", selector=selector, attribute=attribute, error=str(e))
            return default
    
    def extract_table(self, selector: str, headers: bool = True) -> List[Dict[str, str]]:
        """
        Extract table as list of dictionaries.
        
        Args:
            selector: CSS selector for table
            headers: Whether to use first row as headers
            
        Returns:
            List[Dict]: Table data as list of dictionaries
        """
        try:
            table = self.soup.select_one(selector)
            if not table:
                self.logger.warning("table_not_found", selector=selector)
                return []
            
            rows = table.select('tr')
            if not rows:
                return []
            
            # Extract headers if requested
            if headers:
                header_row = rows[0]
                headers_list = [th.get_text(strip=True) for th in header_row.select('th, td')]
                data_rows = rows[1:]
            else:
                headers_list = None
                data_rows = rows
            
            # Extract data
            result = []
            for row in data_rows:
                cells = row.select('td')
                if not cells:
                    continue
                
                if headers_list:
                    row_dict = {}
                    for i, cell in enumerate(cells):
                        if i < len(headers_list):
                            row_dict[headers_list[i]] = cell.get_text(strip=True)
                    result.append(row_dict)
                else:
                    row_dict = {
                        f"col_{i}": cell.get_text(strip=True)
                        for i, cell in enumerate(cells)
                    }
                    result.append(row_dict)
            
            self.logger.info("table_extracted", rows=len(result))
            return result
            
        except Exception as e:
            self.logger.error("extract_table_error", selector=selector, error=str(e))
            return []
    
    def extract_links(self, selector: str = "a") -> List[str]:
        """
        Extract links from elements.
        
        Args:
            selector: CSS selector for links (default: all anchors)
            
        Returns:
            List[str]: List of href values
        """
        try:
            links = []
            for element in self.soup.select(selector):
                href = element.get('href')
                if href:
                    links.append(href)
            
            self.logger.info("links_extracted", count=len(links))
            return links
            
        except Exception as e:
            self.logger.error("extract_links_error", selector=selector, error=str(e))
            return []
    
    def extract_images(self, selector: str = "img") -> List[str]:
        """
        Extract image sources.
        
        Args:
            selector: CSS selector for images (default: all images)
            
        Returns:
            List[str]: List of src values
        """
        try:
            images = []
            for element in self.soup.select(selector):
                src = element.get('src')
                if src:
                    images.append(src)
            
            self.logger.info("images_extracted", count=len(images))
            return images
            
        except Exception as e:
            self.logger.error("extract_images_error", selector=selector, error=str(e))
            return []
    
    def extract_multiple(self, selector: str) -> List[str]:
        """
        Extract text from multiple elements.
        
        Args:
            selector: CSS selector
            
        Returns:
            List[str]: List of text values
        """
        try:
            elements = self.soup.select(selector)
            texts = [element.get_text(strip=True) for element in elements]
            
            self.logger.info("multiple_extracted", count=len(texts))
            return texts
            
        except Exception as e:
            self.logger.error("extract_multiple_error", selector=selector, error=str(e))
            return []
    
    def extract_json_ld(self) -> List[Dict]:
        """
        Extract JSON-LD structured data.
        
        Returns:
            List[Dict]: List of JSON-LD objects
        """
        try:
            json_ld_scripts = self.soup.find_all('script', type='application/ld+json')
            result = []
            
            for script in json_ld_scripts:
                try:
                    import json
                    data = json.loads(script.string)
                    if isinstance(data, list):
                        result.extend(data)
                    else:
                        result.append(data)
                except Exception as e:
                    self.logger.warning("json_ld_parse_error", error=str(e))
            
            self.logger.info("json_ld_extracted", count=len(result))
            return result
            
        except Exception as e:
            self.logger.error("extract_json_ld_error", error=str(e))
            return []
    
    def find_element(self, selector: str) -> Optional[Tag]:
        """
        Find single element by selector.
        
        Args:
            selector: CSS selector
            
        Returns:
            Tag: Element or None if not found
        """
        try:
            return self.soup.select_one(selector)
        except Exception as e:
            self.logger.error("find_element_error", selector=selector, error=str(e))
            return None
    
    def find_elements(self, selector: str) -> List[Tag]:
        """
        Find multiple elements by selector.
        
        Args:
            selector: CSS selector
            
        Returns:
            List[Tag]: List of elements
        """
        try:
            return self.soup.select(selector)
        except Exception as e:
            self.logger.error("find_elements_error", selector=selector, error=str(e))
            return []
    
    def get_html(self) -> str:
        """
        Get HTML content.
        
        Returns:
            str: HTML content
        """
        return str(self.soup)
    
    def get_text(self) -> str:
        """
        Get all text content.
        
        Returns:
            str: Text content
        """
        return self.soup.get_text(strip=True)
