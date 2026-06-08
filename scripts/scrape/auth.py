"""
Autenticação na loja virtual AllInBrasil
Baseado em docs/reverse-engineering/loja-virtual-pedidos-mapping.md
"""

import requests
from bs4 import BeautifulSoup
import os
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class LojaVirtualAuth:
    """Classe para autenticação na loja virtual"""
    
    def __init__(self):
        self.session = requests.Session()
        # Configurar pool de conexões para evitar esgotamento de portas (WinError 10048)
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS"]
        )
        adapter = HTTPAdapter(
            max_retries=retry_strategy,
            pool_connections=10,
            pool_maxsize=10,
            pool_block=False
        )
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
        # Baseado no Playwright: URL de login é https://allinbrasil.com.br/publico/Autenticar/Formulario
        self.base_url = "https://allinbrasil.com.br"
        self.login_url = f"{self.base_url}/publico/Autenticar/Formulario"
        self.username = os.getenv('LOJA_VIRTUAL_USERNAME', 'juniorind')
        self.password = os.getenv('LOJA_VIRTUAL_PASSWORD', 'allin2025')
        self.token = None
        self.is_authenticated = False
        self.loja_base_url = None  # URL base da loja virtual após login
    
    def login(self):
        """Autenticar na loja virtual"""
        try:
            # 1. Acessar página de login (baseado no Playwright)
            print(f"🔐 Acessando página de login: {self.login_url}")
            login_page = self.session.get(self.login_url)
            
            if login_page.status_code != 200:
                print(f"❌ Erro ao acessar página de login: {login_page.status_code}")
                return False
            
            # 2. Extrair dados do formulário de login
            soup = BeautifulSoup(login_page.text, 'html.parser')
            
            # Baseado no Playwright: O formulário tem campos ocultos CSRF
            # Campos: formularioda39a3ee5e6b4b0d3255bfef95601890afd80709, 7a2f0db6843c32f0244e069ce5f43dc7
            # Campos de login: usuario, senha
            form = soup.find('form')
            if not form:
                print("❌ Formulário não encontrado na página")
                return False
            
            # Extrair todos os campos ocultos
            login_data = {}
            for hidden_input in form.find_all('input', {'type': 'hidden'}):
                if hidden_input.get('name'):
                    login_data[hidden_input['name']] = hidden_input.get('value', '')
            
            # Adicionar credenciais (nomes corretos: usuario, senha)
            login_data['usuario'] = self.username
            login_data['senha'] = self.password
            
            # URL de ação do formulário
            form_action = form.get('action', self.login_url)
            if not form_action.startswith('http'):
                form_action = f"{self.base_url}{form_action}"
            
            print(f"📝 Enviando credenciais para {self.username}")
            print(f"🔗 URL de ação: {form_action}")
            response = self.session.post(
                form_action,
                data=login_data,
                allow_redirects=True
            )
            
            # 4. Verificar se login foi bem-sucedido
            # Baseado no Playwright: URL após login é https://allinbrasil.com.br/administracao/PaginaInicialAdministrador/Inicio
            if response.status_code == 200:
                # Verificar se foi redirecionado para dashboard administrativo
                if 'administracao' in response.url or 'PaginaInicialAdministrador' in response.url:
                    print("✅ Login bem-sucedido!")
                    self.is_authenticated = True
                    
                    # 5. Acessar Loja Virtual para obter o token
                    print("🔗 Acessando Loja Virtual...")
                    loja_response = self.session.get(
                        f"{self.base_url}/administracao/LinkExterno/LojaVirtual/administrar",
                        allow_redirects=True
                    )
                    
                    if loja_response.status_code == 200:
                        # Extrair token da URL da loja virtual
                        # Baseado no Playwright: URL é https://allinbrasil.com.br/loja/admin/common/dashboard?token=...
                        if 'token=' in loja_response.url:
                            self.token = loja_response.url.split('token=')[1].split('&')[0]
                            # URL base deve ser https://allinbrasil.com.br/loja/admin (não o dashboard específico)
                            self.loja_base_url = "https://allinbrasil.com.br/loja/admin"
                            print(f"🔑 Token extraído: {self.token}")
                            print(f"🌐 URL base da loja: {self.loja_base_url}")
                            return True
                        else:
                            print("⚠️ Token não encontrado na URL da loja virtual")
                            return False
                    else:
                        print(f"❌ Erro ao acessar Loja Virtual: {loja_response.status_code}")
                        return False
                else:
                    print(f"⚠️ Login inconclusivo. URL final: {response.url}")
                    return False
            else:
                print(f"❌ Login falhou: status code {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Erro durante login: {e}")
            return False
    
    def get_session(self):
        """Retorna a sessão autenticada"""
        if not self.is_authenticated:
            if not self.login():
                raise Exception("Falha na autenticação")
        return self.session
    
    def logout(self):
        """Fazer logout da loja virtual"""
        try:
            if self.is_authenticated:
                self.session.get(f"{self.base_url}/logout")
                self.is_authenticated = False
                print("✅ Logout realizado")
        except Exception as e:
            print(f"⚠️ Erro durante logout: {e}")
    
    def close(self):
        """Fechar a sessão e liberar recursos"""
        try:
            self.session.close()
            print("✅ Sessão fechada")
        except Exception as e:
            print(f"⚠️ Erro ao fechar sessão: {e}")
