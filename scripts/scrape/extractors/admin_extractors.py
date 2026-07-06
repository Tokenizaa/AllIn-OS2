"""
Extractors para dados do painel administrativo AllInBrasil
Baseado na investigação via Playwright
"""

from bs4 import BeautifulSoup
import time


class AdminPlansExtractor:
    """Extractor para Planos do painel administrativo"""
    
    def __init__(self, session, admin_base_url):
        self.session = session
        self.admin_base_url = admin_base_url
        self.planos_url = f"{admin_base_url}/Planos/Planos/principal"
        self.planos_vendidos_url = f"{admin_base_url}/Planos/LojaOrderRelatorioAdesoes/listar"
    
    def extract_planos_ativos(self):
        """Extrair planos ativos da tela Planos (Adesões)"""
        try:
            print(f"📋 Acessando tela de Planos: {self.planos_url}")
            response = self.session.get(self.planos_url)
            
            if response.status_code != 200:
                print(f"❌ Erro ao acessar Planos: {response.status_code}")
                return []
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Baseado no Playwright: Tabela com colunas ID, Imagem Principal, Nome, Preço, Estoque, Status, Ações
            table = soup.find('table')
            if not table:
                print("❌ Tabela de planos não encontrada")
                return []
            
            planos = []
            rows = table.select('tbody tr')
            
            for row in rows:
                cells = row.select('td')
                if len(cells) >= 6:
                    plano = {
                        'id': cells[0].text.strip(),
                        'nome': cells[2].text.strip(),
                        'preco': cells[3].text.strip(),
                        'estoque': cells[4].text.strip(),
                        'status': cells[5].text.strip()
                    }
                    planos.append(plano)
            
            print(f"✅ {len(planos)} planos ativos extraídos")
            return planos
            
        except Exception as e:
            print(f"❌ Erro ao extrair planos ativos: {e}")
            return []
    
    def extract_planos_vendidos(self, limit=None):
        """Extrair relatório de planos vendidos com paginação"""
        try:
            print(f"📋 Acessando relatório de Planos Vendidos: {self.planos_vendidos_url}")
            
            planos_vendidos = []
            per_page = 20
            total_processed = 0
            
            while True:
                url = f"{self.planos_vendidos_url}?per_page={per_page}"
                print(f"   📄 Extraindo página {per_page // 20 + 1}...")
                
                response = self.session.get(url)
                
                if response.status_code != 200:
                    print(f"❌ Erro ao acessar página: {response.status_code}")
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Baseado no Playwright: Tabela com colunas # Compra, Distribuidor, Plano, Data do Pagamento, Data Últ. Modificação, Valor
                table = soup.find('table')
                if not table:
                    print("❌ Tabela de planos vendidos não encontrada")
                    break
                
                rows = table.select('tbody tr')
                
                if not rows or len(rows) == 0:
                    print(f"✅ Fim da paginação")
                    break
                
                page_planos = []
                for row in rows:
                    cells = row.select('td')
                    if len(cells) >= 6:
                        plano_vendido = {
                            'numero_compra': cells[0].text.strip(),
                            'distribuidor': cells[1].text.strip(),
                            'plano': cells[2].text.strip(),
                            'data_pagamento': cells[3].text.strip(),
                            'data_ultima_modificacao': cells[4].text.strip(),
                            'valor': cells[5].text.strip()
                        }
                        page_planos.append(plano_vendido)
                        total_processed += 1
                
                if not page_planos:
                    print(f"✅ Fim da paginação - nenhum plano encontrado")
                    break
                
                planos_vendidos.extend(page_planos)
                print(f"   📊 {len(page_planos)} planos nesta página | Total: {len(planos_vendidos)}")
                
                # Verificar limite
                if limit and total_processed >= limit:
                    print(f"✅ Limite de {limit} planos atingido")
                    break
                
                per_page += 20
                time.sleep(0.5)  # Rate limiting
            
            print(f"✅ {len(planos_vendidos)} planos vendidos extraídos")
            return planos_vendidos
            
        except Exception as e:
            print(f"❌ Erro ao extrair planos vendidos: {e}")
            return []


class AdminPedidosExtractor:
    """Extractor para Pedidos do painel administrativo"""
    
    def __init__(self, session, admin_base_url):
        self.session = session
        self.admin_base_url = admin_base_url
        self.pedidos_campos_url = f"{admin_base_url}/Pedidos/TiposCampo"
    
    def extract_pedidos_campos(self):
        """Extrair campos configurados para pedidos"""
        try:
            print(f"📋 Acessando Campos para Pedidos: {self.pedidos_campos_url}")
            response = self.session.get(self.pedidos_campos_url)
            
            if response.status_code != 200:
                print(f"❌ Erro ao acessar Campos para Pedidos: {response.status_code}")
                return []
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Baseado no Playwright: Tabela com colunas ID, Nome, Chave, Tipo, Ativo, Ações
            table = soup.find('table')
            if not table:
                print("❌ Tabela de campos não encontrada")
                return []
            
            campos = []
            rows = table.select('tbody tr')
            
            for row in rows:
                cells = row.select('td')
                if len(cells) >= 5:
                    campo = {
                        'id': cells[0].text.strip(),
                        'nome': cells[1].text.strip(),
                        'chave': cells[2].text.strip(),
                        'tipo': cells[3].text.strip(),
                        'ativo': cells[4].text.strip()
                    }
                    campos.append(campo)
            
            print(f"✅ {len(campos)} campos de pedidos extraídos")
            return campos
            
        except Exception as e:
            print(f"❌ Erro ao extrair campos de pedidos: {e}")
            return []


class AdminDistribuidoresExtractor:
    """Extractor para Distribuidores do painel administrativo"""
    
    def __init__(self, session, admin_base_url):
        self.session = session
        self.admin_base_url = admin_base_url
        self.distribuidores_url = f"{admin_base_url}/Distribuidor/DistribuidoresARede/listar"
    
    def extract_distribuidores(self, limit=None):
        """Extrair lista de distribuidores com paginação"""
        try:
            print(f"📋 Acessando tela de Distribuidores: {self.distribuidores_url}")
            
            distribuidores = []
            per_page = 20
            total_processed = 0
            
            while True:
                url = f"{self.distribuidores_url}?per_page={per_page}"
                print(f"   📄 Extraindo página {per_page // 20 + 1}...")
                
                response = self.session.get(url)
                
                if response.status_code != 200:
                    print(f"❌ Erro ao acessar página: {response.status_code}")
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Baseado no Playwright: Tabela com colunas Nº, Imagem, Usuário, Nome completo, E-mail, Patrocinador, Cidade, Estado, Doc. Aprovado?, Data de Nascimento, Ativo?, Data Cad., Ações
                table = soup.find('table')
                if not table:
                    print("❌ Tabela de distribuidores não encontrada")
                    break
                
                rows = table.select('tbody tr')
                
                if not rows or len(rows) == 0:
                    print(f"✅ Fim da paginação")
                    break
                
                page_distribuidores = []
                for row in rows:
                    cells = row.select('td')
                    if len(cells) >= 8:
                        distribuidor = {
                            'numero': cells[0].text.strip(),
                            'usuario': cells[2].text.strip(),
                            'nome_completo': cells[3].text.strip(),
                            'email': cells[4].text.strip(),
                            'patrocinador': cells[5].text.strip(),
                            'cidade': cells[6].text.strip(),
                            'estado': cells[7].text.strip(),
                            'ativo': cells[8].text.strip() if len(cells) > 8 else '',
                            'data_cadastro': cells[9].text.strip() if len(cells) > 9 else ''
                        }
                        page_distribuidores.append(distribuidor)
                        total_processed += 1
                
                if not page_distribuidores:
                    print(f"✅ Fim da paginação - nenhum distribuidor encontrado")
                    break
                
                distribuidores.extend(page_distribuidores)
                print(f"   📊 {len(page_distribuidores)} distribuidores nesta página | Total: {len(distribuidores)}")
                
                # Verificar limite
                if limit and total_processed >= limit:
                    print(f"✅ Limite de {limit} distribuidores atingido")
                    break
                
                per_page += 20
                time.sleep(0.5)  # Rate limiting
            
            print(f"✅ {len(distribuidores)} distribuidores extraídos")
            return distribuidores
            
        except Exception as e:
            print(f"❌ Erro ao extrair distribuidores: {e}")
            return []
