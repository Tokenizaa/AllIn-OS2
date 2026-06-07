"""
Extractor para extração de customers da loja virtual
"""

from bs4 import BeautifulSoup
from typing import List, Dict
import time


class CustomersExtractor:
    """Classe para extração de customers da loja virtual"""
    
    def __init__(self, session, loja_base_url, token):
        self.session = session
        self.loja_base_url = loja_base_url
        self.token = token
    
    def extract_customers_list(self, limit=None):
        """Extrair lista de customers"""
        customers = []
        per_page = 15  # Começa com 15 itens por página (padrão)
        
        while True:
            print(f"📄 Extraindo customers (offset: {per_page})...")
            
            # URL da lista de customers (baseado no Playwright)
            # A paginação usa per_page como offset: 15, 30, 45, 60, ...
            url = f"{self.loja_base_url}/sale/customer?token={self.token}&per_page={per_page}"
            
            try:
                response = self.session.get(url)
                
                if response.status_code != 200:
                    print(f"❌ Erro ao acessar página (offset: {per_page}): {response.status_code}")
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extrair IDs dos customers da página (baseado no Playwright)
                # Tabela: table tbody tr, ID na primeira coluna
                customer_rows = soup.select('table tbody tr')
                
                if not customer_rows or len(customer_rows) == 0:
                    print(f"✅ Fim da paginação (offset: {per_page})")
                    break  # Fim da paginação
                
                # Extrair IDs desta página
                page_customers = []
                for row in customer_rows:
                    cells = row.select('td')
                    if cells:
                        customer_id = cells[0].text.strip()
                        if customer_id and customer_id != 'Id':  # Ignorar cabeçalho
                            page_customers.append(customer_id)
                
                # Se não encontrou novos customers, fim da paginação
                if not page_customers:
                    print(f"✅ Fim da paginação (offset: {per_page})")
                    break
                
                # Se encontrou os mesmos customers da página anterior, fim da paginação
                if page_customers == customers[-len(page_customers):]:
                    print(f"✅ Fim da paginação (offset: {per_page})")
                    break
                
                # Adicionar novos customers
                for customer_id in page_customers:
                    if customer_id not in customers:  # Evitar duplicatas
                        customers.append(customer_id)
                        # Parar se atingir o limite
                        if limit and len(customers) >= limit:
                            print(f"✅ Limite de {limit} customers atingido")
                            return customers
                
                print(f"✅ {len(customers)} customers encontrados até agora (offset: {per_page})")
                per_page += 15  # Incrementa offset para próxima página
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"❌ Erro ao extrair página (offset: {per_page}): {e}")
                break
        
        print(f"📊 Total de customers extraídos: {len(customers)}")
        return customers
    
    def extract_customer_details(self, customer_id):
        """Extrair detalhes completos do customer"""
        print(f"🔍 Extraindo detalhes do customer {customer_id}...")
        
        # URL baseado no Playwright
        # https://allinbrasil.com.br/loja/admin/sale/customer/info?token=...&customer_id=...
        url = f"{self.loja_base_url}/sale/customer/info?token={self.token}&customer_id={customer_id}"
        
        try:
            response = self.session.get(url)
            
            if response.status_code != 200:
                print(f"❌ Erro ao acessar customer {customer_id}: {response.status_code}")
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            customer_data = {
                'id_comprador': customer_id,
                'usuario': self._extract_text(soup, '.usuario, #usuario'),
                'email': self._extract_text(soup, '.email, #email'),
                'telefone': self._extract_text(soup, '.telefone, #telefone'),
                'cpf': self._extract_text(soup, '.cpf, #cpf, .cnpj, #cnpj'),  # Tenta ambos CPF e CNPJ
                'patrocinador_comprador': self._extract_text(soup, '.patrocinador-comprador, #patrocinador_comprador'),
                'nome_completo': self._extract_text(soup, '.nome-completo, #nome_completo'),
                'endereco': self._extract_text(soup, '.endereco, #endereco'),
                'cidade': self._extract_text(soup, '.cidade, #cidade'),
                'estado': self._extract_text(soup, '.estado, #estado'),
                'bairro': self._extract_text(soup, '.bairro, #bairro'),
                'numero': self._extract_text(soup, '.numero, #numero'),
                'complemento': self._extract_text(soup, '.complemento, #complemento'),
                'cep': self._extract_text(soup, '.cep, #cep'),
                'plano_comprador': self._extract_text(soup, '.plano-comprador, #plano_comprador'),
                'data_criacao': self._extract_datetime(soup, '.data-criacao, #data_criacao')
            }
            
            return customer_data
            
        except Exception as e:
            print(f"❌ Erro ao extrair detalhes do customer {customer_id}: {e}")
            return None
    
    def _extract_text(self, soup, selector):
        """Extrair texto de um elemento usando seletor CSS"""
        try:
            elements = selector.split(', ')
            for elem in elements:
                element = soup.select_one(elem.strip())
                if element:
                    return element.text.strip()
        except:
            pass
        return None
    
    def _extract_datetime(self, soup, selector):
        """Extrair datetime de um elemento"""
        text = self._extract_text(soup, selector)
        if text:
            try:
                from datetime import datetime
                # Tentar diferentes formatos de data brasileira
                for fmt in ['%d/%m/%Y %H:%M:%S', '%d/%m/%Y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d']:
                    try:
                        return datetime.strptime(text, fmt)
                    except:
                        continue
            except:
                pass
        return None
