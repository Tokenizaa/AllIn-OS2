#!/usr/bin/env python3
"""
Extractor para dados de distribuidores do painel administrativo AllInBrasil
"""

import time
from bs4 import BeautifulSoup


class DistribuidoresExtractor:
    """Extractor para dados de distribuidores"""
    
    def __init__(self, session, base_url, token):
        self.session = session
        self.base_url = base_url
        self.token = token
        self.distribuidores_info_url = f"{base_url}/administracao/Distribuidor/DistribuidoresInformacoes/principal"
    
    def extract_distribuidores_list(self, limit=None):
        """Extrair lista de distribuidores"""
        distribuidores = []
        page = 0
        per_page = 20
        
        while True:
            print(f"📄 Extraindo página {page + 1}...")
            
            # Construir URL com paginação
            if page == 0:
                url = self.distribuidores_info_url
            else:
                url = f"{self.distribuidores_info_url}?per_page={page * per_page}"
            
            # Fazer requisição
            response = self.session.get(url, headers=self._get_headers())
            
            if response.status_code != 200:
                print(f"❌ Erro ao acessar página {page + 1}: {response.status_code}")
                break
            
            # Parsear HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Encontrar tabela
            table = soup.find('table')
            if not table:
                print("⚠️ Tabela não encontrada")
                break
            
            # Extrair linhas da tabela
            tbody = table.find('tbody')
            if not tbody:
                print("⚠️ Tbody não encontrado")
                break
            
            rows = tbody.find_all('tr')
            
            if not rows:
                print("⚠️ Nenhuma linha encontrada, fim da paginação")
                break
            
            # Extrair dados de cada linha
            for row in rows:
                cells = row.find_all('td')
                if len(cells) >= 32:
                    distribuidor_id = int(cells[0].text.strip())
                    distribuidores.append(distribuidor_id)
                    
                    # Aplicar limite se especificado
                    if limit and len(distribuidores) >= limit:
                        print(f"✅ Limite de {limit} distribuidores atingido")
                        return distribuidores
            
            print(f"📊 {len(rows)} distribuidores encontrados nesta página")
            
            # Verificar se há mais páginas
            pagination = soup.find('div', class_='pagination')
            if not pagination:
                break
            
            # Verificar se há botão "próxima"
            next_button = pagination.find('a', text='>')
            if not next_button:
                break
            
            page += 1
            time.sleep(1)  # Rate limiting
        
        return distribuidores
    
    def extract_distribuidor_details(self, distribuidor_id):
        """Extrair detalhes de um distribuidor específico"""
        # Neste caso, os detalhes já estão na lista principal
        # Vamos extrair os dados da tabela de informações
        pass
    
    def _get_headers(self):
        """Retornar headers para requisições"""
        return {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
