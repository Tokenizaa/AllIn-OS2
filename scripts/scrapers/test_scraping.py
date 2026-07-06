"""
Direct scraper test harness for the legacy AllIn Loja Virtual.

Usage:
  python scripts/scrapers/test_scraping.py --entity products
  python scripts/scrapers/test_scraping.py --entity orders
  python scripts/scrapers/test_scraping.py --entity both
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass
try:
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass


project_root = Path(__file__).parent.parent.parent
load_dotenv(project_root / ".env")

sys.path.insert(0, str(Path(__file__).parent.parent))

from scrapers.base.browser_manager import BrowserManager
from scrapers.products.products_scraper import ProductScraper
from scrapers.orders.orders_scraper import OrderScraper

sys.path.insert(0, str(Path(__file__).parent.parent))
from scrape.auth import LojaVirtualAuth
from scrape.extractors.orders import OrdersExtractor


def extract_token(url: str | None) -> str | None:
    if not url or "token=" not in url:
        return None
    return url.split("token=")[1].split("&")[0]


def print_page_diagnostics(page) -> None:
    if not page:
        print("  Diagnostic: no active page")
        return

    current_url = page.url
    token = extract_token(current_url)
    on_login_page = "autenticar" in current_url.lower() or "login" in current_url.lower()

    print("  Diagnostic:")
    print(f"    Current URL: {current_url}")
    print(f"    Token: {token or 'not found'}")
    print(f"    On login page: {'yes' if on_login_page else 'no'}")


async def print_html_excerpt(page, label: str, limit: int = 2500) -> None:
    if not page:
        print(f"  {label}: no active page")
        return

    try:
        html = await page.content()
    except Exception as e:
        print(f"  {label}: failed to read HTML ({e})")
        return

    excerpt = html[:limit]
    print(f"  {label} HTML excerpt (first {min(len(html), limit)} chars):")
    print("  --- HTML START ---")
    for line in excerpt.splitlines()[:80]:
        print(f"  {line}")
    if len(html) > limit:
        print("  ...")
    print("  --- HTML END ---")


async def run_products(product_scraper: ProductScraper) -> None:
    print("x Scraping products (page 1)...")
    product_list = await product_scraper.scrape_product_list(page=1)

    print(f"x Scraped {len(product_list.products)} products")
    print(f"  Total: {product_list.total}")
    print(f"  Page: {product_list.page}")
    print(f"  Pages: {product_list.pages}")
    print()

    if product_list.products:
        print("Sample product:")
        product = product_list.products[0]
        print(f"  ID: {product.product_id}")
        print(f"  SKU: {product.sku}")
        print(f"  Nome: {product.nome}")
        print(f"  Preco: {product.preco}")
        print(f"  Estoque: {product.estoque}")
        print(f"  Status: {product.status}")

        print()
        print("x Scraping product details for first product...")
        detail = await product_scraper.scrape_product_details(product.product_id)
        if detail:
            print("Product detail:")
            print(f"  Product ID: {detail.product_id}")
            print(f"  Descricao length: {len(detail.descricao or '')}")
            print(f"  Imagens: {len(detail.imagens)}")
            print(f"  Atributos: {len(detail.atributos)}")
            print(f"  Categorias: {len(detail.categorias)}")
        else:
            print("  Product detail: not found")
            await print_html_excerpt(product_scraper.page, "Product detail page")


async def run_orders(order_scraper: OrderScraper) -> None:
    print("x Scraping orders (page 1)...")
    order_list = await order_scraper.scrape_order_list(page=1)

    print(f"x Scraped {len(order_list.orders)} orders")
    print(f"  Total: {order_list.total}")
    print(f"  Page: {order_list.page}")
    print(f"  Pages: {order_list.pages}")
    print()

    if order_list.orders:
        print("Sample order:")
        order = order_list.orders[0]
        print(f"  ID: {order.order_id}")
        print(f"  Cliente: {order.cliente}")
        print(f"  Distribuidor: {order.distribuidor}")
        print(f"  Data: {order.data}")
        print(f"  Status: {order.status}")
        print(f"  Total: {order.total}")

        print()
        print("x Scraping order details for first order...")
        detail = await order_scraper.scrape_order_details(order.order_id)
        if detail:
            print("Order detail:")
            print(f"  Order ID: {detail.order_id}")
            print(f"  Itens: {len(detail.itens)}")
            print(f"  Forma pagamento: {detail.forma_pagamento}")
            print(f"  Valor: {detail.valor}")
            print(f"  Cliente: {detail.cliente_nome}")
            print(f"  Historico: {len(detail.historico)}")
            print(f"  Pagamento confirmado: {'yes' if detail.pagamento_confirmado else 'no'}")
        else:
            print("  Order detail: not found")
            await print_html_excerpt(order_scraper.page, "Order detail page")


def run_legacy_orders(limit: int = 1) -> None:
    print("x Using legacy orders flow...")
    auth = LojaVirtualAuth()
    if not auth.login():
        raise RuntimeError("Legacy auth failed")

    extractor = OrdersExtractor(auth.get_session(), auth.loja_base_url, auth.token)
    orders = extractor.extract_orders_list(limit=limit)
    print(f"x Legacy scraped {len(orders)} orders")
    if orders:
        order_id = orders[0]
        print(f"  Sample order ID: {order_id}")
        detail = extractor.extract_order_details(order_id)
        if detail:
            print("Legacy order detail:")
            print(f"  Pedido cliente: {detail.pedido.cliente}")
            print(f"  Pedido patrocinador: {detail.pedido.patrocinador_usuario}")
            print(f"  Produtos: {len(detail.produtos.itens)}")
            print(f"  Pagamentos: {len(detail.pagamento.pagamentos)}")
            print(f"  Historico: {len(detail.historico)}")
        else:
            print("  Legacy order detail: not found")
    auth.close()


async def main():
    parser = argparse.ArgumentParser(description="Direct AllIn Loja Virtual scraper test")
    parser.add_argument(
        "--entity",
        choices=["products", "orders", "both"],
        default="products",
        help="Which scraper to test",
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        help="Run browser in headless mode",
    )
    args = parser.parse_args()

    browser_manager = None
    scraper = None
    browser = None

    print("Testing direct scraping...")
    print("=" * 50)

    username = os.getenv("ALLIN_USERNAME")
    password = os.getenv("ALLIN_PASSWORD")
    loja_url = os.getenv("ALLIN_LOJA_URL")

    print("Configuration:")
    print(f"  Username: {username}")
    print(f"  Loja URL: {loja_url}")
    print(f"  Entity: {args.entity}")
    print(f"  Headless: {args.headless}")
    print()

    if not username or not password:
        print("x Missing ALLIN_USERNAME or ALLIN_PASSWORD in .env")
        sys.exit(1)

    try:
        print("x Initializing browser manager...")
        browser_manager = BrowserManager(headless=args.headless)

        print("x Starting browser...")
        await browser_manager.start()
        browser = browser_manager.browser

        async def login_scraper(scraper_name: str):
            nonlocal scraper
            if scraper:
                try:
                    await scraper.close()
                except Exception:
                    pass

            print(f"x Initializing {scraper_name} scraper...")
            scraper = ProductScraper() if scraper_name == "product" else OrderScraper()

            print("x Attempting login...")
            login_success = await scraper.login(browser, target="loja")

            if not login_success:
                print("x Login failed")
                print_page_diagnostics(scraper.page)
                return False

            print("x Login successful")
            print_page_diagnostics(scraper.page)
            print()
            return True

        if args.entity == "products":
            if not await login_scraper("product"):
                sys.exit(1)
            await run_products(scraper)
        elif args.entity == "orders":
            run_legacy_orders(limit=1)
        else:
            if not await login_scraper("product"):
                sys.exit(1)
            await run_products(scraper)
            run_legacy_orders(limit=1)

        print()
        print("OK Direct scraping test completed successfully!")

    except Exception as e:
        print(f"x Direct scraping test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    finally:
        print()
        print("Cleaning up...")
        if scraper:
            try:
                await scraper.close()
            except Exception as cleanup_error:
                print(f"Cleanup error on scraper close: {cleanup_error}")
        if browser_manager:
            try:
                await browser_manager.stop()
                print("x Browser stopped")
            except Exception as cleanup_error:
                print(f"Cleanup error on browser stop: {cleanup_error}")

    print()
    print("Next steps:")
    print("1. Test the other entity")
    print("2. Run full sync")


if __name__ == "__main__":
    asyncio.run(main())
