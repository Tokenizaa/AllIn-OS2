"""
Session Manager for AllIn scrapers.
Handles authentication, session persistence, and renewal.
"""

import json
import os
from pathlib import Path
from typing import Optional
from datetime import datetime, timedelta

import requests
from bs4 import BeautifulSoup
from playwright.async_api import Browser, BrowserContext, Page
import structlog

logger = structlog.get_logger()


class SessionManager:
    """
    Manages authentication and session persistence for AllIn scrapers.
    """

    def __init__(
        self,
        storage_path: str = "storage/storage_state.json",
        username: Optional[str] = None,
        password: Optional[str] = None,
        loja_url: str = "https://allinbrasil.com.br/loja/admin",
        admin_url: str = "https://allinbrasil.com.br/administracao",
    ):
        self.storage_path = Path(storage_path)
        self.username = username or os.getenv("ALLIN_USERNAME")
        self.password = password or os.getenv("ALLIN_PASSWORD")
        self.loja_url = loja_url
        self.admin_url = admin_url

        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None

        self.session_expiry: Optional[datetime] = None
        self.session_duration_hours = 24

        self.storage_path.parent.mkdir(parents=True, exist_ok=True)

    async def login(self, browser: Browser, target: str = "loja") -> bool:
        """
        Login to AllIn system and, for Loja Virtual, open the tokenized tab.
        """
        try:
            self.browser = browser

            if await self.load_session(browser, target=target):
                logger.info("session_loaded", target=target)
                if target != "loja" or (self.page and "token=" in self.page.url):
                    return True
                logger.info("session_loaded_without_token", current_url=self.page.url if self.page else None)

            logger.info("login_started", target=target, username=self.username)

            self.context = await browser.new_context()
            self.page = await self.context.new_page()

            login_url = "https://allinbrasil.com.br/publico/Autenticar/Formulario"
            await self.page.goto(login_url, timeout=30000)
            await self.page.wait_for_load_state("domcontentloaded", timeout=30000)

            logger.info("filling_login_form", username=self.username)
            await self.page.fill('input[name="usuario"]', self.username or "")
            await self.page.fill('input[name="senha"]', self.password or "")

            logger.info("submitting_login_form")
            form = self.page.locator("form").first
            button = self.page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Entrar")').first

            try:
                async with self.page.expect_navigation(wait_until="domcontentloaded", timeout=30000):
                    await button.click(timeout=5000)
            except Exception:
                try:
                    async with self.page.expect_navigation(wait_until="domcontentloaded", timeout=30000):
                        await form.evaluate("(form) => form.submit()")
                except Exception:
                    await self.page.press('input[name="senha"]', "Enter")

            try:
                await self.page.wait_for_load_state("networkidle", timeout=30000)
            except Exception:
                await self.page.wait_for_load_state("domcontentloaded", timeout=30000)

            current_url = self.page.url
            logger.info("checking_login_result", url=current_url)
            if "autenticar" in current_url.lower() or "login" in current_url.lower():
                logger.info("playwright_login_inconclusive", current_url=current_url)
                if target == "loja" and await self._auth_via_requests_and_open_loja():
                    await self.save_session()
                    self.session_expiry = datetime.now() + timedelta(hours=self.session_duration_hours)
                    logger.info("login_successful", target=target)
                    return True

                logger.error("admin_login_failed", current_url=current_url)
                return False

            logger.info("admin_login_successful")

            if target == "loja":
                if not await self._open_loja_virtual():
                    return False

            await self.save_session()
            self.session_expiry = datetime.now() + timedelta(hours=self.session_duration_hours)
            logger.info("login_successful", target=target)
            return True

        except Exception as e:
            logger.error("login_error", target=target, error=str(e))
            return False

    async def _auth_via_requests_and_open_loja(self) -> bool:
        """
        Fallback legacy auth using requests, then open the tokenized loja URL in Playwright.
        """
        try:
            base_url = "https://allinbrasil.com.br"
            login_url = f"{base_url}/publico/Autenticar/Formulario"
            session = requests.Session()

            login_page = session.get(login_url, timeout=30)
            if login_page.status_code != 200:
                raise RuntimeError(f"Login page returned {login_page.status_code}")

            soup = BeautifulSoup(login_page.text, "html.parser")
            form = soup.find("form")
            if not form:
                raise RuntimeError("Login form not found")

            login_data = {}
            for hidden_input in form.find_all("input", {"type": "hidden"}):
                name = hidden_input.get("name")
                if name:
                    login_data[name] = hidden_input.get("value", "")

            login_data["usuario"] = self.username
            login_data["senha"] = self.password

            form_action = form.get("action", login_url)
            if not form_action.startswith("http"):
                form_action = f"{base_url}{form_action}"

            response = session.post(form_action, data=login_data, allow_redirects=True, timeout=30)
            if response.status_code != 200:
                raise RuntimeError(f"Login POST returned {response.status_code}")

            if "administracao" not in response.url.lower() and "paginainicialadministrador" not in response.url.lower():
                raise RuntimeError(f"Legacy login inconclusive: {response.url}")

            loja_response = session.get(f"{base_url}/administracao/LinkExterno/LojaVirtual/administrar", allow_redirects=True, timeout=30)
            token_url = loja_response.url
            if "token=" not in token_url:
                raise RuntimeError(f"Token not found after legacy auth: {token_url}")

            if not self.page:
                raise RuntimeError("No Playwright page available after legacy auth")

            await self.page.goto(token_url, timeout=30000)
            try:
                await self.page.wait_for_load_state("networkidle", timeout=30000)
            except Exception:
                await self.page.wait_for_load_state("domcontentloaded", timeout=30000)

            self.context = self.page.context
            logger.info("loja_virtual_opened_via_requests", url=self.page.url)
            return True

        except Exception as e:
            logger.error("legacy_auth_error", error=str(e))
            return False

    async def _open_loja_virtual(self) -> bool:
        """
        Open Loja Virtual via the admin link and wait for the tokenized page/tab.
        """
        try:
            if not self.page:
                raise RuntimeError("No active page to open Loja Virtual.")

            logger.info("opening_loja_virtual_link")
            loja_link_url = "https://allinbrasil.com.br/administracao/LinkExterno/LojaVirtual/administrar"

            try:
                link = self.page.locator('a:has-text("Loja Virtual"), button:has-text("Loja Virtual")').first
                async with self.page.context.expect_page() as page_info:
                    await link.click(timeout=5000)
                self.page = await page_info.value
            except Exception:
                await self.page.goto(loja_link_url, timeout=30000)

            try:
                await self.page.wait_for_load_state("networkidle", timeout=30000)
            except Exception:
                await self.page.wait_for_load_state("domcontentloaded", timeout=30000)

            current_url = self.page.url
            if "token=" not in current_url:
                raise RuntimeError(f"Token not found in loja virtual URL: {current_url}")

            logger.info("loja_virtual_opened", url=current_url)
            return True
        except Exception as e:
            logger.error("loja_virtual_navigation_error", error=str(e))
            return False

    async def load_session(self, browser: Browser, target: str = "loja") -> bool:
        """
        Load existing session from storage.
        """
        try:
            if not self.storage_path.exists():
                logger.info("no_existing_session", path=str(self.storage_path))
                return False

            if self.session_expiry and datetime.now() > self.session_expiry:
                logger.info("session_expired", expiry=self.session_expiry)
                return False

            storage_state = json.loads(self.storage_path.read_text(encoding="utf-8"))
            self.context = await browser.new_context(storage_state=storage_state)
            self.page = await self.context.new_page()

            await self.page.goto(self.loja_url, timeout=30000)
            await self.page.wait_for_load_state("domcontentloaded", timeout=30000)

            current_url = self.page.url
            if "autenticar" in current_url.lower() or "login" in current_url.lower():
                logger.info("session_invalid", current_url=current_url)
                return False

            if target == "loja" and "token=" not in current_url:
                logger.info("session_missing_token", current_url=current_url)
                return False

            logger.info("session_valid", current_url=current_url)
            self.browser = browser
            return True

        except Exception as e:
            logger.error("load_session_error", error=str(e))
            return False

    async def save_session(self) -> None:
        """
        Save current session state to storage.
        """
        try:
            if self.context:
                storage_state = await self.context.storage_state()
                with open(self.storage_path, "w", encoding="utf-8") as f:
                    json.dump(storage_state, f, indent=2, ensure_ascii=False)
                logger.info("session_saved", path=str(self.storage_path))
        except Exception as e:
            logger.error("save_session_error", error=str(e))

    async def refresh_session(self) -> bool:
        try:
            if not self.session_expiry or datetime.now() < self.session_expiry:
                logger.info("session_still_valid", expiry=self.session_expiry)
                return True

            logger.info("refreshing_session")
            if self.browser:
                if self.context:
                    await self.context.close()
                return await self.login(self.browser)
            return False
        except Exception as e:
            logger.error("refresh_session_error", error=str(e))
            return False

    async def get_page(self) -> Page:
        if not self.page and self.context:
            self.page = await self.context.new_page()
        if not self.page:
            raise RuntimeError("No active page or context. Call login() first.")
        return self.page

    async def close(self) -> None:
        try:
            if self.page:
                await self.page.close()
                self.page = None
            if self.context:
                await self.context.close()
                self.context = None
            logger.info("session_closed")
        except Exception as e:
            logger.error("close_session_error", error=str(e))

    def is_session_valid(self) -> bool:
        if not self.session_expiry:
            return False
        return datetime.now() < self.session_expiry

    def get_session_info(self) -> dict:
        return {
            "username": self.username,
            "storage_path": str(self.storage_path),
            "session_expiry": self.session_expiry.isoformat() if self.session_expiry else None,
            "is_valid": self.is_session_valid(),
            "has_storage": self.storage_path.exists(),
        }
