"""
Parser for AllIn orders.
"""

from typing import Optional, List, Dict
from decimal import Decimal
from datetime import datetime
import re

from ..base.parser_base import ParserBase
from .orders_models import OrderModel, OrderDetailModel, OrderItem, AddressModel, OrderListModel

import structlog

logger = structlog.get_logger()


class OrderParser(ParserBase):
    """
    Parser for AllIn order pages.
    
    Parses order list and detail pages from Loja Virtual.
    """
    
    def parse_order_list(self, html: str) -> OrderListModel:
        """
        Parse order list page.
        
        Args:
            html: HTML content of order list page
            
        Returns:
            OrderListModel: Parsed order list
        """
        self.soup = self.__class__(html).soup
        
        try:
            # Extract pagination info
            pagination = self._extract_pagination()
            
            # Extract order rows
            orders = []
            order_rows = self.soup.select('table tbody tr')
            
            for row in order_rows:
                order = self._parse_order_row(row)
                if order:
                    orders.append(order)
            
            self.logger.info("order_list_parsed", count=len(orders))
            
            return OrderListModel(
                orders=orders,
                total=pagination.get('total', len(orders)),
                page=pagination.get('page', 1),
                pages=pagination.get('pages', 1),
                has_next=pagination.get('has_next', False),
                has_previous=pagination.get('has_previous', False),
            )
            
        except Exception as e:
            self.logger.error("order_list_parse_error", error=str(e))
            return OrderListModel()
    
    def parse_order_detail(self, html: str, order_id: str) -> Optional[OrderDetailModel]:
        """
        Parse order detail page.
        
        Args:
            html: HTML content of order detail page
            order_id: Order ID
            
        Returns:
            OrderDetailModel: Parsed order detail or None
        """
        self.soup = self.__class__(html).soup
        
        try:
            # Extract order items
            items = self._extract_order_items()
            
            # Extract customer info
            customer_info = self._extract_customer_info()
            
            # Extract delivery info
            delivery_info = self._extract_delivery_info()
            
            # Extract payment info
            payment_info = self._extract_payment_info()
            
            # Extract order history
            history = self._extract_order_history()
            
            # Extract comments
            comments = self._extract_comments()
            
            # Extract IP
            ip = self._extract_ip()
            
            # Extract total value
            total = self._extract_total_value()
            
            # Build quantities, SKUs, and product names dictionaries
            quantidades = {item.product_id: item.quantidade for item in items}
            sku_dict = {item.product_id: item.sku for item in items if item.sku}
            produto_dict = {item.product_id: item.nome for item in items}
            
            self.logger.info("order_detail_parsed", order_id=order_id)
            
            return OrderDetailModel(
                order_id=order_id,
                itens=items,
                quantidades=quantidades,
                sku=sku_dict,
                produto=produto_dict,
                valor=total,
                forma_pagamento=payment_info.get('method', ''),
                historico=history,
                comentarios=comments,
                ip=ip,
                endereco=AddressModel(
                    logradouro=delivery_info.get('logradouro'),
                    bairro=delivery_info.get('bairro'),
                    cidade=delivery_info.get('cidade'),
                    uf=delivery_info.get('uf'),
                    cep=delivery_info.get('cep'),
                ),
                cliente_nome=customer_info.get('name', ''),
                cliente_email=customer_info.get('email'),
                cliente_telefone=customer_info.get('phone'),
                entrega_nome=delivery_info.get('name'),
                entrega_logradouro=delivery_info.get('logradouro'),
                entrega_bairro=delivery_info.get('bairro'),
                entrega_cep=delivery_info.get('cep'),
                entrega_cidade=delivery_info.get('cidade'),
                entrega_uf=delivery_info.get('uf'),
                data_pagamento=payment_info.get('date'),
                pagamento_confirmado=payment_info.get('confirmed', False),
            )
            
        except Exception as e:
            self.logger.error("order_detail_parse_error", order_id=order_id, error=str(e))
            return None
    
    def _parse_order_row(self, row) -> Optional[OrderModel]:
        """
        Parse a single order row from table.
        
        Args:
            row: BeautifulSoup table row element
            
        Returns:
            OrderModel: Parsed order or None
        """
        try:
            cells = row.select('td')
            if len(cells) < 5:
                return None
            
            # Extract order ID (usually first column or from link)
            order_id = self._extract_order_id(cells[0])
            
            # Extract customer/distributor text from the verbose second cell.
            customer_block = self._normalize_cell_text(cells[1]) if len(cells) > 1 else ""
            cliente = self._extract_labeled_segment(customer_block, "Distribuidor:") or customer_block
            distribuidor = self._extract_labeled_segment(customer_block, "Distribuidor:")
            if distribuidor:
                distribuidor = self._extract_labeled_segment(distribuidor, "Tipo de Cliente:") or distribuidor
            
            # Extract date
            data = self._extract_date(cells[3]) if len(cells) > 3 else datetime.now()
            
            # Extract status
            status = self._extract_status_from_cell(cells[4]) if len(cells) > 4 else "pending"
            
            # Extract total
            total = self._extract_price(cells[5]) if len(cells) > 5 else Decimal('0.00')
            
            return OrderModel(
                order_id=order_id,
                cliente=cliente,
                distribuidor=distribuidor,
                data=data,
                status=status,
                total=total,
            )
            
        except Exception as e:
            self.logger.error("order_row_parse_error", error=str(e))
            return None

    def _normalize_cell_text(self, cell) -> str:
        """Return compact text from a table cell."""
        return " ".join(cell.get_text(" ", strip=True).split())

    def _extract_labeled_segment(self, text: str, label: str) -> Optional[str]:
        """Extract a text segment after a label until the next known label."""
        if not text or label not in text:
            return None
        segment = text.split(label, 1)[1]
        for marker in ["Tipo de Cliente:", "Patrocinador:", "Data Criação:", "Status:", "Total:"]:
            if marker in segment:
                segment = segment.split(marker, 1)[0]
        return segment.strip() or None

    def _extract_status_from_cell(self, cell) -> str:
        """Extract the selected status text from a status cell."""
        selected = cell.select_one('option[selected]')
        if selected:
            return selected.get_text(strip=True).lower()

        value = cell.get_text(" ", strip=True).lower()
        for label in [
            "pedido realizado",
            "aguardando pagamento",
            "pedido pago",
            "pedido enviado para cliente",
            "pedido concluido",
            "cancelado",
            "negado",
            "processando pedido",
            "entregue",
            "despachado",
            "em analise financeira",
            "estornado",
        ]:
            if label in value:
                return label

        return value
    
    def _extract_order_id(self, cell) -> str:
        """Extract order ID from cell."""
        link = cell.select_one('a')
        if link:
            href = link.get('href', '')
            # Extract ID from URL (e.g., order_id=123)
            match = re.search(r'order_id=(\d+)', href)
            if match:
                return match.group(1)
        return cell.get_text(strip=True)
    
    def _extract_date(self, cell) -> datetime:
        """Extract date from cell."""
        text = cell.get_text(strip=True)
        # Try to parse date (format may vary)
        date_formats = [
            '%d/%m/%Y',
            '%Y-%m-%d',
            '%d-%m-%Y',
        ]
        
        for fmt in date_formats:
            try:
                return datetime.strptime(text, fmt)
            except ValueError:
                continue
        
        return datetime.now()
    
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
    
    def _extract_order_items(self) -> List[OrderItem]:
        """Extract order items."""
        items = []
        
        # Look for order items table
        tab_product = self.soup.select_one('#tab-product')
        if tab_product:
            table = tab_product.select_one('table')
            if table:
                rows = table.select('tr')
                for row in rows[1:]:
                    cells = row.select('td')
                    if len(cells) >= 4:
                        product_id = self._normalize_cell_text(cells[0])
                        nome = self._normalize_cell_text(cells[1])
                        quantidade_text = self._normalize_cell_text(cells[2])
                        quantidade = int(quantidade_text) if quantidade_text.isdigit() else 1
                        preco_unitario = self._extract_price(cells[3])
                        total = self._extract_price(cells[4]) if len(cells) > 4 else preco_unitario * quantidade

                        sku = None
                        if len(cells) > 1:
                            sku_link = cells[1].select_one('a')
                            if sku_link and sku_link.get('href'):
                                match = re.search(r'product_id=(\d+)', sku_link.get('href', ''))
                                if match:
                                    sku = match.group(1)

                        items.append(OrderItem(
                            product_id=product_id,
                            nome=nome,
                            quantidade=quantidade,
                            preco_unitario=preco_unitario,
                            total=total,
                            sku=sku,
                        ))
        
        return items
    
    def _extract_customer_info(self) -> Dict[str, str]:
        """Extract customer information."""
        info = {}
        tab_order = self.soup.select_one('#tab-order')
        if not tab_order:
            return info

        table = tab_order.select_one('table')
        if not table:
            return info

        for row in table.select('tr'):
            cells = row.select('td')
            if len(cells) >= 2:
                label = self._normalize_cell_text(cells[0]).rstrip(':').lower()
                value = self._normalize_cell_text(cells[1])
                if label == 'cliente':
                    info['name'] = value
                elif label == 'e-mail':
                    info['email'] = value
                elif label == 'telefone':
                    info['phone'] = value
        return info
    
    def _extract_delivery_info(self) -> Dict[str, str]:
        """Extract delivery information."""
        info = {}
        tab_shipping = self.soup.select_one('#tab-shipping')
        if not tab_shipping:
            return info

        table = tab_shipping.select_one('table')
        if not table:
            return info

        for row in table.select('tr'):
            cells = row.select('td')
            if len(cells) >= 2:
                label = self._normalize_cell_text(cells[0]).rstrip(':').lower()
                value = self._normalize_cell_text(cells[1])
                if label in ('nome', 'entregue para', 'destinatário'):
                    info['name'] = value
                elif label == 'endereço':
                    info['logradouro'] = value
                elif label == 'bairro':
                    info['bairro'] = value
                elif label == 'cidade':
                    info['cidade'] = value
                elif label == 'estado':
                    info['uf'] = value
                elif label == 'cep':
                    info['cep'] = value
        return info
    
    def _extract_payment_info(self) -> Dict[str, any]:
        """Extract payment information."""
        info = {}
        tab_payment = self.soup.select_one('#tab-payment')
        if not tab_payment:
            return info

        table = tab_payment.select_one('table')
        if not table:
            return info

        for row in table.select('tr'):
            cells = row.select('td')
            if len(cells) >= 2:
                label = self._normalize_cell_text(cells[0]).rstrip(':').lower()
                value = self._normalize_cell_text(cells[1])
                if label in ('forma de pagamento', 'forma pagamento', 'método'):
                    info['method'] = value
                elif label in ('data', 'data pagamento'):
                    try:
                        info['date'] = self._extract_date_from_text(value)
                    except Exception:
                        pass
                elif label in ('confirmado', 'cliente notificado'):
                    info['confirmed'] = value.lower() in ('sim', 'yes', 'true', '1')
        return info
    
    def _extract_order_history(self) -> List[Dict[str, str]]:
        """Extract order history."""
        history = []
        
        # Look for history table
        tab_history = self.soup.select_one('#tab-history')
        if tab_history:
            history_table = tab_history.select_one('table')
            if history_table:
                rows = history_table.select('tr')
                for row in rows[1:]:
                    cells = row.select('td')
                    if len(cells) >= 2:
                        history.append({
                            'date': self._normalize_cell_text(cells[0]),
                            'status': self._normalize_cell_text(cells[2]) if len(cells) > 2 else self._normalize_cell_text(cells[1]),
                            'comment': self._normalize_cell_text(cells[1]),
                        })
        
        return history
    
    def _extract_comments(self) -> Optional[str]:
        """Extract order comments."""
        return self.extract_text('#tab-order .comentario, .order-comments, .comments, .customer-comments')
    
    def _extract_ip(self) -> Optional[str]:
        """Extract customer IP."""
        return self.extract_text('#tab-order .ip, .customer-ip, .ip-address')
    
    def _extract_total_value(self) -> Decimal:
        """Extract order total value."""
        total_text = self.extract_text('#tab-order .total, .order-total, .grand-total')
        if total_text:
            return self._extract_price_from_text(total_text)
        return Decimal('0.00')
    
    def _extract_date_from_text(self, text: str) -> datetime:
        """Extract date from text."""
        date_formats = [
            '%d/%m/%Y',
            '%Y-%m-%d',
            '%d-%m-%Y',
        ]
        
        for fmt in date_formats:
            try:
                return datetime.strptime(text, fmt)
            except ValueError:
                continue
        
        return datetime.now()
    
    def _extract_price_from_text(self, text: str) -> Decimal:
        """Extract price from text."""
        price_text = re.sub(r'[R$\s]', '', text)
        price_text = price_text.replace(',', '.')
        try:
            return Decimal(price_text)
        except:
            return Decimal('0.00')
