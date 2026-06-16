"""
Test script to verify module imports.
"""

import sys
from pathlib import Path

# Add scrapers directory to path as a package
scrapers_dir = Path(__file__).parent
sys.path.insert(0, str(scrapers_dir.parent))

print("Testing module imports...")

try:
    print("✓ Importing base modules...")
    from scrapers.base.session_manager import SessionManager
    from scrapers.base.browser_manager import BrowserManager
    from scrapers.base.parser_base import ParserBase
    from scrapers.base.retry_handler import RetryHandler
    from scrapers.base.rate_limiter import RateLimiter
    print("  ✓ Base modules imported successfully")
except Exception as e:
    print(f"  ✗ Error importing base modules: {e}")
    sys.exit(1)

try:
    print("✓ Importing product modules...")
    from scrapers.products.products_models import ProductModel, ProductDetailModel
    from scrapers.products.products_parser import ProductParser
    from scrapers.products.products_scraper import ProductScraper
    print("  ✓ Product modules imported successfully")
except Exception as e:
    print(f"  ✗ Error importing product modules: {e}")
    sys.exit(1)

try:
    print("✓ Importing order modules...")
    from scrapers.orders.orders_models import OrderModel, OrderDetailModel
    from scrapers.orders.orders_parser import OrderParser
    from scrapers.orders.orders_scraper import OrderScraper
    print("  ✓ Order modules imported successfully")
except Exception as e:
    print(f"  ✗ Error importing order modules: {e}")
    sys.exit(1)

try:
    print("✓ Importing plan modules...")
    from scrapers.plans.plans_models import PlanModel, PlanDetailModel
    from scrapers.plans.plans_parser import PlanParser
    from scrapers.plans.plans_scraper import PlanScraper
    print("  ✓ Plan modules imported successfully")
except Exception as e:
    print(f"  ✗ Error importing plan modules: {e}")
    sys.exit(1)

try:
    print("✓ Importing sync modules...")
    from scrapers.sync.sync_manager import SyncManager, SyncResult
    from scrapers.sync.sync_products import sync_products
    from scrapers.sync.sync_orders import sync_orders
    from scrapers.sync.sync_plans import sync_plans
    print("  ✓ Sync modules imported successfully")
except Exception as e:
    print(f"  ✗ Error importing sync modules: {e}")
    sys.exit(1)

try:
    print("✓ Importing export modules...")
    from scrapers.exports.json_exporter import JSONExporter
    from scrapers.exports.csv_exporter import CSVExporter
    print("  ✓ Export modules imported successfully")
except Exception as e:
    print(f"  ✗ Error importing export modules: {e}")
    sys.exit(1)

print("\n✅ All module imports successful!")
print("\nNext steps:")
print("1. Test Supabase connection")
print("2. Test scraping (1 page)")
