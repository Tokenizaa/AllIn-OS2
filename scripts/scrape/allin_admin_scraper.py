"""
AllIn Admin Panel Scraper
Scrapes data from the AllIn admin panel when API REST endpoints are not accessible.
Based on the documentation in docs/AUDITORIA_LEGADA_ALLIN.md
"""

import os
import requests
from bs4 import BeautifulSoup
import json
import csv
import time
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from urllib.parse import urljoin
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


@dataclass
class Plano:
    """Data structure for Planos (Adesões)"""
    id: str
    nome: str
    preco: str
    estoque: str
    status: str
    imagem: Optional[str] = None


@dataclass
class PlanoVendido:
    """Data structure for Planos Vendidos"""
    compra_id: str
    distribuidor: str
    plano: str
    data_pagamento: str
    data_ultima_modificacao: str
    valor: str


@dataclass
class PedidoCampo:
    """Data structure for Campos para Pedidos"""
    id: str
    nome: str
    chave: str
    tipo: str
    ativo: str


@dataclass
class DashboardKPI:
    """Data structure for Dashboard KPIs"""
    distribuidores_rede: str
    planos_vendidos: str
    bonus_diretos: str
    saldo_loja_online: str
    saldo_perdido: str
    saldo_receber: str
    saldo_compra: str


class AllInAdminScraper:
    """Scraper for AllIn Admin Panel"""
    
    BASE_URL = "https://allinbrasil.com.br"
    ADMIN_BASE = f"{BASE_URL}/administracao"
    
    # URLs based on documentation
    URLS = {
        'dashboard': f"{ADMIN_BASE}/PaginaInicialAdministrador/Inicio",
        'planos': f"{ADMIN_BASE}/Planos/Planos/principal",
        'planos_vendidos': f"{ADMIN_BASE}/Planos/LojaOrderRelatorioAdesoes/listar",
        'campos_pedidos': f"{ADMIN_BASE}/Pedidos/TiposCampo",
        'criar_pedido': f"{ADMIN_BASE}/Compras/CriarCompra/principal",
        'rede': f"{ADMIN_BASE}/Distribuidor/DistribuidoresARede/listar",
    }
    
    def __init__(self, username: str, password: str):
        """
        Initialize the scraper with admin credentials
        
        Args:
            username: Admin username
            password: Admin password
        """
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def login(self) -> bool:
        """
        Authenticate to the admin panel
        
        Returns:
            bool: True if login successful, False otherwise
        """
        # First, get the login page to obtain any CSRF tokens
        login_url = f"{self.BASE_URL}/login"
        
        try:
            response = self.session.get(login_url)
            response.raise_for_status()
            
            # Parse the login page to find form fields
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Prepare login payload - adjust based on actual form structure
            login_data = {
                'username': self.username,
                'password': self.password,
                # Add any CSRF tokens if present
            }
            
            # Look for CSRF token
            csrf_token = soup.find('input', {'name': '_token'})
            if csrf_token:
                login_data['_token'] = csrf_token.get('value')
            
            # Submit login form
            login_action = soup.find('form').get('action', login_url) if soup.find('form') else login_url
            login_response = self.session.post(
                urljoin(self.BASE_URL, login_action),
                data=login_data,
                allow_redirects=True
            )
            
            # Check if login was successful by checking if we can access admin panel
            if login_response.status_code == 200:
                # Try to access dashboard to verify authentication
                dashboard_response = self.session.get(self.URLS['dashboard'])
                if dashboard_response.status_code == 200 and 'login' not in dashboard_response.url.lower():
                    print("✓ Login successful")
                    return True
            
            print("✗ Login failed")
            return False
            
        except Exception as e:
            print(f"✗ Login error: {str(e)}")
            return False
    
    def scrape_dashboard_kpis(self) -> Optional[DashboardKPI]:
        """
        Scrape Dashboard KPIs
        
        Returns:
            DashboardKPI object with KPI data
        """
        try:
            response = self.session.get(self.URLS['dashboard'])
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Based on documentation, KPIs are displayed on dashboard
            # This will need adjustment based on actual HTML structure
            kpi = DashboardKPI(
                distribuidores_rede=self._extract_kpi(soup, 'Distribuidores Na Rede'),
                planos_vendidos=self._extract_kpi(soup, 'Planos Vendidos'),
                bonus_diretos=self._extract_kpi(soup, 'Bônus total recebidos geral - Diretos'),
                saldo_loja_online=self._extract_kpi(soup, 'Saldo Loja Online'),
                saldo_perdido=self._extract_kpi(soup, 'Saldo Perdido'),
                saldo_receber=self._extract_kpi(soup, 'Saldo a receber'),
                saldo_compra=self._extract_kpi(soup, 'Saldo para Compra')
            )
            
            print(f"✓ Scraped Dashboard KPIs")
            return kpi
            
        except Exception as e:
            print(f"✗ Error scraping dashboard: {str(e)}")
            return None
    
    def _extract_kpi(self, soup: BeautifulSoup, label: str) -> str:
        """Helper to extract KPI value by label"""
        # This will need adjustment based on actual HTML structure
        # Look for elements containing the label and extract the value
        elements = soup.find_all(text=lambda text: label in str(text) if text else False)
        for elem in elements:
            parent = elem.parent
            if parent:
                # Try to find the value in sibling or nearby elements
                value = parent.find_next_sibling() or parent.parent.find_next_sibling()
                if value:
                    return value.get_text(strip=True)
        return "N/A"
    
    def scrape_planos(self) -> List[Plano]:
        """
        Scrape Planos (Adesões) from the admin panel
        
        Returns:
            List of Plano objects
        """
        planos = []
        
        try:
            response = self.session.get(self.URLS['planos'])
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Based on documentation, the table has columns: ID, Imagem Principal, Nome, Preço, Estoque, Status, Ações
            table = soup.find('table')
            if not table:
                print("✗ No table found on Planos page")
                return planos
            
            rows = table.find_all('tr')[1:]  # Skip header row
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 5:
                    plano = Plano(
                        id=cols[0].get_text(strip=True),
                        imagem=cols[1].find('img')['src'] if cols[1].find('img') else None,
                        nome=cols[2].get_text(strip=True),
                        preco=cols[3].get_text(strip=True),
                        estoque=cols[4].get_text(strip=True),
                        status=cols[5].get_text(strip=True) if len(cols) > 5 else "N/A"
                    )
                    planos.append(plano)
            
            print(f"✓ Scraped {len(planos)} planos")
            return planos
            
        except Exception as e:
            print(f"✗ Error scraping planos: {str(e)}")
            return planos
    
    def scrape_planos_vendidos(self) -> List[PlanoVendido]:
        """
        Scrape Relatório de Planos Vendidos
        
        Returns:
            List of PlanoVendido objects
        """
        planos_vendidos = []
        
        try:
            # Handle pagination
            page = 1
            while True:
                params = {'page': page} if page > 1 else {}
                response = self.session.get(self.URLS['planos_vendidos'], params=params)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Based on documentation: # Compra, Distribuidor, Plano, Data do Pagamento, Data Últ. Modificação, Valor
                table = soup.find('table')
                if not table:
                    print(f"✗ No table found on Planos Vendidos page {page}")
                    break
                
                rows = table.find_all('tr')[1:]  # Skip header row
                
                if not rows:
                    break  # No more data
                
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) >= 6:
                        plano_vendido = PlanoVendido(
                            compra_id=cols[0].get_text(strip=True),
                            distribuidor=cols[1].get_text(strip=True),
                            plano=cols[2].get_text(strip=True),
                            data_pagamento=cols[3].get_text(strip=True),
                            data_ultima_modificacao=cols[4].get_text(strip=True),
                            valor=cols[5].get_text(strip=True)
                        )
                        planos_vendidos.append(plano_vendido)
                
                print(f"✓ Scraped page {page} of planos vendidos")
                page += 1
                
                # Check if there's a next page
                pagination = soup.find('div', class_='pagination')
                if not pagination or 'next' not in pagination.get_text().lower():
                    break
                
                # Be respectful with requests
                time.sleep(1)
            
            print(f"✓ Scraped {len(planos_vendidos)} planos vendidos total")
            return planos_vendidos
            
        except Exception as e:
            print(f"✗ Error scraping planos vendidos: {str(e)}")
            return planos_vendidos
    
    def scrape_campos_pedidos(self) -> List[PedidoCampo]:
        """
        Scrape Campos para Pedidos
        
        Returns:
            List of PedidoCampo objects
        """
        campos = []
        
        try:
            response = self.session.get(self.URLS['campos_pedidos'])
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Based on documentation: ID, Nome, Chave, Tipo, Ativo, Ações
            table = soup.find('table')
            if not table:
                print("✗ No table found on Campos para Pedidos page")
                return campos
            
            rows = table.find_all('tr')[1:]  # Skip header row
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 5:
                    campo = PedidoCampo(
                        id=cols[0].get_text(strip=True),
                        nome=cols[1].get_text(strip=True),
                        chave=cols[2].get_text(strip=True),
                        tipo=cols[3].get_text(strip=True),
                        ativo=cols[4].get_text(strip=True)
                    )
                    campos.append(campo)
            
            print(f"✓ Scraped {len(campos)} campos para pedidos")
            return campos
            
        except Exception as e:
            print(f"✗ Error scraping campos para pedidos: {str(e)}")
            return campos
    
    def scrape_all(self) -> Dict:
        """
        Scrape all available data from the admin panel
        
        Returns:
            Dictionary with all scraped data
        """
        print("=" * 60)
        print("Starting AllIn Admin Panel Scraper")
        print("=" * 60)
        
        if not self.login():
            print("✗ Authentication failed. Cannot proceed.")
            return {}
        
        data = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'dashboard_kpis': None,
            'planos': [],
            'planos_vendidos': [],
            'campos_pedidos': []
        }
        
        # Scrape Dashboard KPIs
        print("\n[1/4] Scraping Dashboard KPIs...")
        data['dashboard_kpis'] = asdict(self.scrape_dashboard_kpis()) if self.scrape_dashboard_kpis() else None
        
        # Scrape Planos
        print("\n[2/4] Scraping Planos (Adesões)...")
        data['planos'] = [asdict(plano) for plano in self.scrape_planos()]
        
        # Scrape Planos Vendidos
        print("\n[3/4] Scraping Relatório de Planos Vendidos...")
        data['planos_vendidos'] = [asdict(pv) for pv in self.scrape_planos_vendidos()]
        
        # Scrape Campos para Pedidos
        print("\n[4/4] Scraping Campos para Pedidos...")
        data['campos_pedidos'] = [asdict(campo) for campo in self.scrape_campos_pedidos()]
        
        print("\n" + "=" * 60)
        print("Scraping completed!")
        print("=" * 60)
        
        return data
    
    def export_to_json(self, data: Dict, filename: str = 'allin_admin_data.json'):
        """Export scraped data to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"✓ Data exported to {filename}")
        except Exception as e:
            print(f"✗ Error exporting to JSON: {str(e)}")
    
    def export_to_csv(self, data: Dict, prefix: str = 'allin_admin_data'):
        """Export scraped data to CSV files"""
        try:
            # Export Planos
            if data.get('planos'):
                with open(f'{prefix}_planos.csv', 'w', newline='', encoding='utf-8') as f:
                    writer = csv.DictWriter(f, fieldnames=data['planos'][0].keys())
                    writer.writeheader()
                    writer.writerows(data['planos'])
                print(f"✓ Planos exported to {prefix}_planos.csv")
            
            # Export Planos Vendidos
            if data.get('planos_vendidos'):
                with open(f'{prefix}_planos_vendidos.csv', 'w', newline='', encoding='utf-8') as f:
                    writer = csv.DictWriter(f, fieldnames=data['planos_vendidos'][0].keys())
                    writer.writeheader()
                    writer.writerows(data['planos_vendidos'])
                print(f"✓ Planos Vendidos exported to {prefix}_planos_vendidos.csv")
            
            # Export Campos Pedidos
            if data.get('campos_pedidos'):
                with open(f'{prefix}_campos_pedidos.csv', 'w', newline='', encoding='utf-8') as f:
                    writer = csv.DictWriter(f, fieldnames=data['campos_pedidos'][0].keys())
                    writer.writeheader()
                    writer.writerows(data['campos_pedidos'])
                print(f"✓ Campos Pedidos exported to {prefix}_campos_pedidos.csv")
            
            # Export Dashboard KPIs
            if data.get('dashboard_kpis'):
                with open(f'{prefix}_dashboard_kpis.csv', 'w', newline='', encoding='utf-8') as f:
                    writer = csv.DictWriter(f, fieldnames=data['dashboard_kpis'].keys())
                    writer.writeheader()
                    writer.writerow(data['dashboard_kpis'])
                print(f"✓ Dashboard KPIs exported to {prefix}_dashboard_kpis.csv")
                
        except Exception as e:
            print(f"✗ Error exporting to CSV: {str(e)}")


def main():
    """Main function to run the scraper"""
    
    # Configuration - read from environment variables
    USERNAME = os.getenv('ALLIN_ADMIN_USERNAME')
    PASSWORD = os.getenv('ALLIN_ADMIN_PASSWORD')
    
    if not USERNAME or not PASSWORD:
        print("✗ Error: ALLIN_ADMIN_USERNAME and ALLIN_ADMIN_PASSWORD must be set in .env file")
        print("  Copy .env.example to .env and fill in your credentials")
        return
    
    # Initialize scraper
    scraper = AllInAdminScraper(USERNAME, PASSWORD)
    
    # Scrape all data
    data = scraper.scrape_all()
    
    if data:
        # Export to JSON
        scraper.export_to_json(data, 'allin_admin_data.json')
        
        # Export to CSV
        scraper.export_to_csv(data, 'allin_admin_data')
        
        # Print summary
        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Planos: {len(data.get('planos', []))}")
        print(f"Planos Vendidos: {len(data.get('planos_vendidos', []))}")
        print(f"Campos para Pedidos: {len(data.get('campos_pedidos', []))}")
        if data.get('dashboard_kpis'):
            print(f"Dashboard KPIs: Available")
    else:
        print("✗ No data scraped. Please check authentication and network connection.")


if __name__ == "__main__":
    main()
