"""
Parser for AllIn plans.
"""

from typing import Optional, List, Dict
from decimal import Decimal
import re

from ..base.parser_base import ParserBase
from .plans_models import PlanModel, PlanDetailModel, PlanListModel

import structlog

logger = structlog.get_logger()


class PlanParser(ParserBase):
    """
    Parser for AllIn plan pages.
    
    Parses plan list and detail pages from Admin Panel.
    """
    
    def parse_plan_list(self, html: str) -> PlanListModel:
        """
        Parse plan list page.
        
        Args:
            html: HTML content of plan list page
            
        Returns:
            PlanListModel: Parsed plan list
        """
        self.soup = self.__class__(html).soup
        
        try:
            # Extract plan rows
            plans = []
            plan_rows = self.soup.select('table tbody tr, .plan-item, .plan-row')
            
            for row in plan_rows:
                plan = self._parse_plan_row(row)
                if plan:
                    plans.append(plan)
            
            self.logger.info("plan_list_parsed", count=len(plans))
            
            return PlanListModel(
                plans=plans,
                total=len(plans),
            )
            
        except Exception as e:
            self.logger.error("plan_list_parse_error", error=str(e))
            return PlanListModel()
    
    def parse_plan_detail(self, html: str, plan_id: str) -> Optional[PlanDetailModel]:
        """
        Parse plan detail page.
        
        Args:
            html: HTML content of plan detail page
            plan_id: Plan ID
            
        Returns:
            PlanDetailModel: Parsed plan detail or None
        """
        self.soup = self.__class__(html).soup
        
        try:
            # Extract description
            description = self.extract_text('.plan-description, .description, .plan-details')
            
            # Extract benefits
            benefits = self._extract_benefits()
            
            # Extract restrictions
            restrictions = self._extract_restrictions()
            
            # Extract commissions
            commissions = self._extract_commissions()
            
            # Extract qualifications
            qualifications = self._extract_qualifications()
            
            self.logger.info("plan_detail_parsed", plan_id=plan_id)
            
            return PlanDetailModel(
                plan_id=plan_id,
                descricao=description,
                beneficios=benefits,
                restricoes=restrictions,
                comissoes=commissions,
                qualificacoes=qualificacoes,
            )
            
        except Exception as e:
            self.logger.error("plan_detail_parse_error", plan_id=plan_id, error=str(e))
            return None
    
    def _parse_plan_row(self, row) -> Optional[PlanModel]:
        """
        Parse a single plan row from table.
        
        Args:
            row: BeautifulSoup table row element
            
        Returns:
            PlanModel: Parsed plan or None
        """
        try:
            cells = row.select('td')
            if len(cells) < 5:
                # Try to parse from div-based layout
                return self._parse_plan_div(row)
            
            # Extract plan ID (usually first column or from link)
            plan_id = self._extract_plan_id(cells[0])
            
            # Extract name
            nome = cells[1].get_text(strip=True) if len(cells) > 1 else ""
            
            # Extract type
            tipo = cells[2].get_text(strip=True) if len(cells) > 2 else "standard"
            
            # Extract activation fee
            adesao = self._extract_price(cells[3]) if len(cells) > 3 else Decimal('0.00')
            
            # Extract upgrade fee
            upgrade = self._extract_price(cells[4]) if len(cells) > 4 else None
            
            # Extract renewal fee
            renovacao = self._extract_price(cells[5]) if len(cells) > 5 else None
            
            # Extract value
            valor = self._extract_price(cells[6]) if len(cells) > 6 else Decimal('0.00')
            
            # Extract stock
            estoque = self._extract_stock(cells[7]) if len(cells) > 7 else 0
            
            # Extract status
            status = self._extract_status(cells[8]) if len(cells) > 8 else "active"
            
            return PlanModel(
                plan_id=plan_id,
                nome=nome,
                tipo=tipo,
                adesao=adesao,
                upgrade=upgrade,
                renovacao=renovacao,
                valor=valor,
                estoque=estoque,
                status=status,
            )
            
        except Exception as e:
            self.logger.error("plan_row_parse_error", error=str(e))
            return None
    
    def _parse_plan_div(self, div) -> Optional[PlanModel]:
        """
        Parse plan from div-based layout.
        
        Args:
            div: BeautifulSoup div element
            
        Returns:
            PlanModel: Parsed plan or None
        """
        try:
            # Extract plan ID
            plan_id = self.extract_attribute('[data-plan-id]', 'data-plan-id') or \
                     self.extract_attribute('a[href*="plan_id"]', 'href')
            
            if plan_id and 'plan_id=' in plan_id:
                plan_id = plan_id.split('plan_id=')[1].split('&')[0]
            
            # Extract name
            nome = self.extract_text('.plan-name, .name, h3, h4')
            
            # Extract type
            tipo = self.extract_text('.plan-type, .type') or "standard"
            
            # Extract prices
            adesao = self._extract_price_from_text(self.extract_text('.activation-fee, .adesao'))
            upgrade = self._extract_price_from_text(self.extract_text('.upgrade-fee, .upgrade'))
            renovacao = self._extract_price_from_text(self.extract_text('.renewal-fee, .renovacao'))
            valor = self._extract_price_from_text(self.extract_text('.plan-value, .valor, .price'))
            
            # Extract stock
            estoque_text = self.extract_text('.stock, .estoque')
            estoque = int(estoque_text) if estoque_text.isdigit() else 0
            
            # Extract status
            status = self.extract_text('.status, .plan-status').lower()
            if not status or status == "":
                status = "active"
            
            return PlanModel(
                plan_id=plan_id or "unknown",
                nome=nome or "Plano Sem Nome",
                tipo=tipo,
                adesao=adesao,
                upgrade=upgrade,
                renovacao=renovacao,
                valor=valor,
                estoque=estoque,
                status=status,
            )
            
        except Exception as e:
            self.logger.error("plan_div_parse_error", error=str(e))
            return None
    
    def _extract_plan_id(self, cell) -> str:
        """Extract plan ID from cell."""
        link = cell.select_one('a')
        if link:
            href = link.get('href', '')
            # Extract ID from URL (e.g., plan_id=123)
            match = re.search(r'plan_id=(\d+)', href)
            if match:
                return match.group(1)
        return cell.get_text(strip=True)
    
    def _extract_price(self, cell) -> Decimal:
        """Extract price from cell."""
        text = cell.get_text(strip=True)
        return self._extract_price_from_text(text)
    
    def _extract_price_from_text(self, text: str) -> Decimal:
        """Extract price from text."""
        if not text:
            return Decimal('0.00')
        
        # Remove currency symbols and format
        price_text = re.sub(r'[R$\s]', '', text)
        price_text = price_text.replace(',', '.')
        try:
            return Decimal(price_text)
        except:
            return Decimal('0.00')
    
    def _extract_stock(self, cell) -> int:
        """Extract stock quantity from cell."""
        text = cell.get_text(strip=True)
        try:
            return int(text)
        except:
            return 0
    
    def _extract_status(self, cell) -> str:
        """Extract status from cell."""
        text = cell.get_text(strip=True).lower()
        if 'ativo' in text or 'enabled' in text or 'disponível' in text:
            return 'active'
        elif 'inativo' in text or 'disabled' in text or 'indisponível' in text:
            return 'inactive'
        return text
    
    def _extract_benefits(self) -> List[str]:
        """Extract plan benefits."""
        benefits = []
        
        # Look for benefits list
        benefits_list = self.soup.select('.benefits li, .plan-benefits li, .benefit-item')
        for item in benefits_list:
            text = item.get_text(strip=True)
            if text:
                benefits.append(text)
        
        return benefits
    
    def _extract_restrictions(self) -> List[str]:
        """Extract plan restrictions."""
        restrictions = []
        
        # Look for restrictions list
        restrictions_list = self.soup.select('.restrictions li, .plan-restrictions li, .restriction-item')
        for item in restrictions_list:
            text = item.get_text(strip=True)
            if text:
                restrictions.append(text)
        
        return restrictions
    
    def _extract_commissions(self) -> Dict[str, Decimal]:
        """Extract commission structure."""
        commissions = {}
        
        # Look for commission table or list
        commission_items = self.soup.select('.commission-item, .commission-row, .commissions li')
        for item in commission_items:
            # Try to extract level and percentage
            text = item.get_text(strip=True)
            match = re.search(r'(\d+)%?\s*(?:nível|level|geração|generation)?', text, re.IGNORECASE)
            if match:
                level = match.group(1)
                percentage = self._extract_price_from_text(text)
                commissions[f"level_{level}"] = percentage
        
        return commissions
    
    def _extract_qualifications(self) -> List[str]:
        """Extract required qualifications."""
        qualifications = []
        
        # Look for qualifications list
        qual_list = self.soup.select('.qualifications li, .plan-qualifications li, .qualification-item')
        for item in qual_list:
            text = item.get_text(strip=True)
            if text:
                qualifications.append(text)
        
        return qualifications
