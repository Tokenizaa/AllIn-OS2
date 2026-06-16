"""
Main script to run all AllIn scrapers and syncs.
Orchestrates products, orders, and plans synchronization.
"""

import asyncio
import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

from scrapers.sync.sync_products import sync_products
from scrapers.sync.sync_orders import sync_orders
from scrapers.sync.sync_plans import sync_plans
from scrapers.exports.json_exporter import JSONExporter
from scrapers.exports.csv_exporter import CSVExporter

import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ]
)
logger = structlog.get_logger()


def _print(message: str) -> None:
    try:
        print(message)
    except UnicodeEncodeError:
        encoding = sys.stdout.encoding or "utf-8"
        print(message.encode(encoding, errors="replace").decode(encoding, errors="replace"))


async def main():
    """Main entry point for running all syncs."""
    parser = argparse.ArgumentParser(description="Sync AllIn data to Supabase")
    parser.add_argument(
        "--incremental",
        action="store_true",
        help="Run incremental sync (last 7 days for orders)"
    )
    parser.add_argument(
        "--days",
        type=int,
        default=7,
        help="Number of days for incremental sync (default: 7)"
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        help="Maximum number of pages to scrape"
    )
    parser.add_argument(
        "--limit-orders",
        type=int,
        help="Maximum number of orders to process"
    )
    parser.add_argument(
        "--entity",
        choices=["products", "orders", "plans", "all"],
        default="all",
        help="Entity to sync (default: all). Orders use the legacy stable flow."
    )
    parser.add_argument(
        "--export-json",
        action="store_true",
        help="Export data to JSON files"
    )
    parser.add_argument(
        "--export-csv",
        action="store_true",
        help="Export data to CSV files"
    )
    parser.add_argument(
        "--include-details",
        action="store_true",
        help="Include detailed data (for products and plans)"
    )
    
    args = parser.parse_args()
    
    # Load environment variables from the project root
    project_root = Path(__file__).parent.parent.parent
    load_dotenv(project_root / ".env")
    load_dotenv(project_root / ".env.local")
    
    logger.info(
        "sync_started",
        incremental=args.incremental,
        days=args.days,
        entity=args.entity,
        max_pages=args.max_pages,
    )
    
    start_time = datetime.now()
    results = {}
    
    try:
        # Sync products
        if args.entity in ["products", "all"]:
            logger.info("syncing_products")
            await sync_products(
                incremental=args.incremental,
                since=datetime.now() - timedelta(days=args.days) if args.incremental else None,
                max_pages=args.max_pages
            )
            results["products"] = "completed"
        
        # Sync orders
        if args.entity in ["orders", "all"]:
            logger.info("syncing_orders_legacy_flow")
            orders_ok = await sync_orders(
                incremental=args.incremental,
                days=args.days,
                max_pages=args.max_pages,
                limit_orders=args.limit_orders
            )
            results["orders"] = "completed" if orders_ok else "failed"
        
        # Sync plans
        if args.entity in ["plans", "all"]:
            logger.info("syncing_plans")
            await sync_plans(include_details=args.include_details)
            results["plans"] = "completed"
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        logger.info(
            "sync_completed",
            results=results,
            duration_seconds=duration,
        )
        
        _print(f"\nSync completed in {duration:.2f} seconds")
        _print(f"Results: {results}")
        if results.get("orders") == "completed":
            _print("Orders were synced using the legacy requests-based flow.")
        
    except Exception as e:
        logger.error("sync_failed", error=str(e))
        _print(f"\nSync failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Import timedelta for the main function
    from datetime import timedelta
    asyncio.run(main())
