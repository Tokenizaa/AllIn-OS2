"""
Sync script for AllIn orders using the legacy, stable flow.
"""

import os
import sys
from datetime import datetime, timedelta
from typing import Optional
from pathlib import Path

from dotenv import load_dotenv

from .sync_manager import SyncManager

import structlog

logger = structlog.get_logger()

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass
try:
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass


async def sync_orders(
    incremental: bool = False,
    days: int = 7,
    max_pages: Optional[int] = None,
    limit_orders: Optional[int] = None,
) -> bool:
    """
    Sync orders from AllIn to Supabase using the legacy requests-based flow.
    """
    project_root = Path(__file__).resolve().parents[3]
    success = False

    load_dotenv(project_root / ".env")
    load_dotenv(project_root / ".env.local")

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("SUPABASE_ANON_KEY"))

    if not supabase_url or not supabase_key:
        logger.error("missing_supabase_config")
        return False

    logger.info("sync_orders_started", incremental=incremental, days=days)

    try:
        from scrape.auth import LojaVirtualAuth
        from scrape.extractors.orders import OrdersExtractor
        from scrape.transformers.to_supabase import SupabaseTransformer
    except Exception as e:
        logger.error("legacy_import_failed", error=str(e))
        return

    auth = LojaVirtualAuth()
    if not auth.login():
        logger.error("legacy_login_failed")
        return False

    session = auth.get_session()
    token = auth.token
    loja_base_url = auth.loja_base_url

    if not token or not loja_base_url:
        logger.error("missing_legacy_token_or_url")
        auth.close()
        return False

    sync_manager = SyncManager(supabase_url, supabase_key)
    transformer = SupabaseTransformer(supabase_url, supabase_key)
    extractor = OrdersExtractor(session, loja_base_url, token)
    
    logger.info("components_initialized", sync_manager_client=sync_manager.client is not None)

    try:
        since = datetime.now() - timedelta(days=days) if incremental else None

        if since:
            logger.info("incremental_mode_requested_but_legacy_uses_full_scan", since=since.isoformat())

        legacy_limit = limit_orders
        if legacy_limit is None and max_pages:
            legacy_limit = max_pages * 15

        legacy_orders = extractor.extract_orders_list(limit=legacy_limit)
        logger.info("legacy_orders_listed", count=len(legacy_orders))

        transformed_orders = []
        for order_id in legacy_orders:
            detail = extractor.extract_order_details(order_id)
            if not detail:
                continue

            transformed_orders.append(transformer.transform_order(detail))

        logger.info(
            "legacy_orders_transformed",
            orders=len(transformed_orders),
        )

        result = await sync_manager.sync_orders(transformed_orders)
        logger.info("sync_orders_completed", result=result.to_dict())

        sync_manager.save_checkpoint("orders", {
            "last_sync": datetime.now().isoformat(),
            "records_processed": len(transformed_orders),
            "records_failed": 0,
            "legacy_flow": True,
        })
        success = result.success

    except Exception as e:
        logger.error("sync_orders_error", error=str(e))
        success = False

    finally:
        auth.close()

    return success


if __name__ == "__main__":
    import asyncio
    # TESTE: Limitar a 3 pedidos
    asyncio.run(sync_orders(limit_orders=3))
