"""
Authentication for AllInBrasil loja virtual.
Legacy requests-based flow.
"""

import os
import sys

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def _print(message: str) -> None:
    try:
        print(message)
    except UnicodeEncodeError:
        encoding = sys.stdout.encoding or "utf-8"
        print(message.encode(encoding, errors="replace").decode(encoding, errors="replace"))


class LojaVirtualAuth:
    """Legacy authentication helper for the loja virtual."""

    def __init__(self):
        self.session = requests.Session()
        self.session.trust_env = False
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS"],
        )
        adapter = HTTPAdapter(
            max_retries=retry_strategy,
            pool_connections=10,
            pool_maxsize=10,
            pool_block=False,
        )
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        self.base_url = "https://allinbrasil.com.br"
        self.login_url = f"{self.base_url}/publico/Autenticar/Formulario"
        self.username = os.getenv("LOJA_VIRTUAL_USERNAME", "juniorind")
        self.password = os.getenv("LOJA_VIRTUAL_PASSWORD", "allin2025")
        self.token = None
        self.is_authenticated = False
        self.loja_base_url = None

    def login(self):
        """Authenticate in the legacy flow and extract the loja token."""
        try:
            _print(f"Acessando pagina de login: {self.login_url}")
            login_page = self.session.get(self.login_url, timeout=30)

            if login_page.status_code != 200:
                _print(f"Erro ao acessar pagina de login: {login_page.status_code}")
                return False

            soup = BeautifulSoup(login_page.text, "html.parser")
            form = soup.find("form")
            if not form:
                _print("Formulario nao encontrado na pagina")
                return False

            login_data = {}
            for hidden_input in form.find_all("input", {"type": "hidden"}):
                if hidden_input.get("name"):
                    login_data[hidden_input["name"]] = hidden_input.get("value", "")

            login_data["usuario"] = self.username
            login_data["senha"] = self.password

            form_action = form.get("action", self.login_url)
            if not form_action.startswith("http"):
                form_action = f"{self.base_url}{form_action}"

            _print(f"Enviando credenciais para {self.username}")
            _print(f"URL de acao: {form_action}")
            response = self.session.post(form_action, data=login_data, allow_redirects=True, timeout=30)

            if response.status_code == 200:
                if "administracao" in response.url or "PaginaInicialAdministrador" in response.url:
                    _print("Login bem-sucedido!")
                    self.is_authenticated = True

                    _print("Acessando Loja Virtual...")
                    loja_response = self.session.get(
                        f"{self.base_url}/administracao/LinkExterno/LojaVirtual/administrar",
                        allow_redirects=True,
                        timeout=30,
                    )

                    if loja_response.status_code == 200:
                        if "token=" in loja_response.url:
                            self.token = loja_response.url.split("token=")[1].split("&")[0]
                            self.loja_base_url = "https://allinbrasil.com.br/loja/admin"
                            _print(f"Token extraido: {self.token}")
                            _print(f"URL base da loja: {self.loja_base_url}")
                            return True

                        _print("Token nao encontrado na URL da loja virtual")
                        return False

                    _print(f"Erro ao acessar Loja Virtual: {loja_response.status_code}")
                    return False

                _print(f"Login inconclusivo. URL final: {response.url}")
                return False

            _print(f"Login falhou: status code {response.status_code}")
            return False

        except Exception as e:
            _print(f"Erro durante login: {e}")
            return False

    def get_session(self):
        """Return authenticated session."""
        if not self.is_authenticated:
            if not self.login():
                raise Exception("Falha na autenticacao")
        return self.session

    def logout(self):
        """Logout from the loja virtual."""
        try:
            if self.is_authenticated:
                self.session.get(f"{self.base_url}/logout", timeout=30)
                self.is_authenticated = False
                _print("Logout realizado")
        except Exception as e:
            _print(f"Erro durante logout: {e}")

    def close(self):
        """Close session."""
        try:
            self.session.close()
            _print("Sessao fechada")
        except Exception as e:
            _print(f"Erro ao fechar sessao: {e}")
