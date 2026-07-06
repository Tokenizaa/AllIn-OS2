"""
Sync Manager for AllIn scrapers.
Handles synchronization with Supabase.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from dataclasses import dataclass, field
import json
import os
from pathlib import Path

from supabase import Client, create_client

import structlog

logger = structlog.get_logger()


@dataclass
class SyncResult:
    """Result of a sync operation."""
    success: bool = False
    entity: str = ""
    total_records: int = 0
    processed_records: int = 0
    failed_records: int = 0
    skipped_records: int = 0
    errors: List[Dict[str, Any]] = field(default_factory=list)
    warnings: List[Dict[str, Any]] = field(default_factory=list)
    start_time: datetime = field(default_factory=datetime.now)
    end_time: Optional[datetime] = None
    duration_ms: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "success": self.success,
            "entity": self.entity,
            "total_records": self.total_records,
            "processed_records": self.processed_records,
            "failed_records": self.failed_records,
            "skipped_records": self.skipped_records,
            "errors": self.errors,
            "warnings": self.warnings,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration_ms": self.duration_ms,
        }


class SyncManager:
    """
    Manager for synchronizing scraped data with Supabase.
    
    Features:
    - Batch processing
    - Error handling
    - Progress tracking
    - Checkpoint support
    """
    
    def __init__(
        self,
        supabase_url: str,
        supabase_key: str,
        batch_size: int = 100
    ):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.batch_size = batch_size
        self.client: Optional[Client] = None
        
        # Initialize Supabase client
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize Supabase client."""
        try:
            for key in ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"):
                os.environ.pop(key, None)
            logger.info("creating_supabase_client", url=self.supabase_url)
            self.client = create_client(self.supabase_url, self.supabase_key)
            logger.info("supabase_client_initialized", client_created=self.client is not None)
        except Exception as e:
            logger.error("supabase_client_error", error=str(e), error_type=type(e).__name__)
            raise
    
    async def sync_products(
        self,
        products: List[Dict[str, Any]],
        table_name: str = "produtos"
    ) -> SyncResult:
        """
        Synchronize products with Supabase.
        
        Args:
            products: List of product dictionaries
            table_name: Supabase table name
            
        Returns:
            SyncResult: Sync operation result
        """
        result = SyncResult(entity="products", total_records=len(products))
        
        try:
            logger.info("sync_products_started", count=len(products))
            
            # Process in batches
            for i in range(0, len(products), self.batch_size):
                batch = products[i:i + self.batch_size]
                
                for product in batch:
                    try:
                        # Convert to Supabase format
                        supabase_data = self._convert_product_to_supabase(product)
                        
                        # Check if product exists by SKU
                        existing = self.client.table(table_name).select("*").eq("sku", supabase_data["sku"]).execute()
                        
                        if existing.data:
                            # Update existing product
                            self.client.table(table_name).update(supabase_data).eq("id", existing.data[0]["id"]).execute()
                        else:
                            # Insert new product
                            self.client.table(table_name).insert(supabase_data).execute()
                        
                        result.processed_records += 1
                        
                    except Exception as e:
                        result.failed_records += 1
                        result.errors.append({
                            "record_id": product.get("product_id"),
                            "message": str(e),
                            "timestamp": datetime.now().isoformat(),
                        })
                        logger.error("product_sync_error", product_id=product.get("product_id"), error=str(e))
                
                # Progress logging
                if (i + self.batch_size) % (self.batch_size * 5) == 0:
                    logger.info("sync_progress", processed=result.processed_records, total=result.total_records)
            
            result.success = result.failed_records == 0
            result.end_time = datetime.now()
            result.duration_ms = int((result.end_time - result.start_time).total_seconds() * 1000)
            
            logger.info(
                "sync_products_completed",
                success=result.success,
                processed=result.processed_records,
                failed=result.failed_records
            )
            
            return result
            
        except Exception as e:
            logger.error("sync_products_error", error=str(e))
            result.errors.append({
                "message": str(e),
                "timestamp": datetime.now().isoformat(),
            })
            result.end_time = datetime.now()
            result.duration_ms = int((result.end_time - result.start_time).total_seconds() * 1000)
            return result
    
    async def sync_orders(
        self,
        orders: List[Dict[str, Any]],
        table_name: str = "pedidos"
    ) -> SyncResult:
        """
        Synchronize orders with Supabase.
        
        Args:
            orders: List of order dictionaries
            table_name: Supabase table name
            
        Returns:
            SyncResult: Sync operation result
        """
        result = SyncResult(entity="orders", total_records=len(orders))
        
        try:
            logger.info("sync_orders_started", count=len(orders))
            
            # Process in batches
            for i in range(0, len(orders), self.batch_size):
                batch = orders[i:i + self.batch_size]
                
                for order in batch:
                    try:
                        # Convert to Supabase format
                        supabase_data = self._convert_order_to_supabase(order)
                        
                        # Check if order exists by numero_pedido
                        existing = self.client.table(table_name).select("*").eq("numero_pedido", supabase_data["numero_pedido"]).execute()
                        
                        pedido_id = None
                        if existing.data:
                            # Update existing order
                            self.client.table(table_name).update(supabase_data).eq("id", existing.data[0]["id"]).execute()
                            pedido_id = existing.data[0]["id"]
                        else:
                            # Insert new order
                            response = self.client.table(table_name).insert(supabase_data).execute()
                            if response.data:
                                pedido_id = response.data[0]["id"]
                        
                        # Sync order items if available
                        if pedido_id and order.get("items"):
                            await self.sync_order_items(pedido_id, order.get("items"))
                        
                        result.processed_records += 1
                        
                    except Exception as e:
                        result.failed_records += 1
                        result.errors.append({
                            "record_id": order.get("order_id"),
                            "message": str(e),
                            "timestamp": datetime.now().isoformat(),
                        })
                        logger.error("order_sync_error", order_id=order.get("order_id"), error=str(e))
                
                # Progress logging
                if (i + self.batch_size) % (self.batch_size * 5) == 0:
                    logger.info("sync_progress", processed=result.processed_records, total=result.total_records)
            
            result.success = result.failed_records == 0
            result.end_time = datetime.now()
            result.duration_ms = int((result.end_time - result.start_time).total_seconds() * 1000)
            
            logger.info(
                "sync_orders_completed",
                success=result.success,
                processed=result.processed_records,
                failed=result.failed_records
            )
            
            return result
            
        except Exception as e:
            logger.error("sync_orders_error", error=str(e))
            result.errors.append({
                "message": str(e),
                "timestamp": datetime.now().isoformat(),
            })
            result.end_time = datetime.now()
            result.duration_ms = int((result.end_time - result.start_time).total_seconds() * 1000)
            return result
    
    async def sync_order_items(
        self,
        pedido_id: str,
        items: List[Dict[str, Any]],
        table_name: str = "order_items"
    ) -> None:
        """
        Synchronize order items with Supabase.
        
        Args:
            pedido_id: UUID of the parent order
            items: List of item dictionaries
            table_name: Supabase table name
        """
        try:
            logger.info("sync_order_items_started", pedido_id=pedido_id, count=len(items))
            
            # Delete existing items for this order
            self.client.table(table_name).delete().eq("pedido_id", pedido_id).execute()
            
            # Insert new items
            for item in items:
                item_data = self._convert_order_item_to_supabase(pedido_id, item)
                self.client.table(table_name).insert(item_data).execute()
            
            logger.info("sync_order_items_completed", pedido_id=pedido_id, count=len(items))
            
        except Exception as e:
            logger.error("sync_order_items_error", pedido_id=pedido_id, error=str(e))
    
    async def sync_plans(
        self,
        plans: List[Dict[str, Any]],
        table_name: str = "planos"
    ) -> SyncResult:
        """
        Synchronize plans with Supabase.
        
        Args:
            plans: List of plan dictionaries
            table_name: Supabase table name
            
        Returns:
            SyncResult: Sync operation result
        """
        result = SyncResult(entity="plans", total_records=len(plans))
        
        try:
            logger.info("sync_plans_started", count=len(plans))
            
            # Process in batches
            for i in range(0, len(plans), self.batch_size):
                batch = plans[i:i + self.batch_size]
                
                for plan in batch:
                    try:
                        # Convert to Supabase format
                        supabase_data = self._convert_plan_to_supabase(plan)
                        
                        # Check if plan exists by slug
                        slug = supabase_data["slug"]
                        existing = self.client.table(table_name).select("*").eq("slug", slug).execute()
                        
                        if existing.data:
                            # Update existing plan
                            self.client.table(table_name).update(supabase_data).eq("id", existing.data[0]["id"]).execute()
                        else:
                            # Insert new plan
                            self.client.table(table_name).insert(supabase_data).execute()
                        
                        result.processed_records += 1
                        
                    except Exception as e:
                        result.failed_records += 1
                        result.errors.append({
                            "record_id": plan.get("plan_id"),
                            "message": str(e),
                            "timestamp": datetime.now().isoformat(),
                        })
                        logger.error("plan_sync_error", plan_id=plan.get("plan_id"), error=str(e))
                
                # Progress logging
                if (i + self.batch_size) % (self.batch_size * 5) == 0:
                    logger.info("sync_progress", processed=result.processed_records, total=result.total_records)
            
            result.success = result.failed_records == 0
            result.end_time = datetime.now()
            result.duration_ms = int((result.end_time - result.start_time).total_seconds() * 1000)
            
            logger.info(
                "sync_plans_completed",
                success=result.success,
                processed=result.processed_records,
                failed=result.failed_records
            )
            
            return result
            
        except Exception as e:
            logger.error("sync_plans_error", error=str(e))
            result.errors.append({
                "message": str(e),
                "timestamp": datetime.now().isoformat(),
            })
            result.end_time = datetime.now()
            result.duration_ms = int((result.end_time - result.start_time).total_seconds() * 1000)
            return result
    
    def _convert_product_to_supabase(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Convert product model to Supabase format."""
        return {
            "nome": product.get("nome"),
            "sku": product.get("sku"),
            "modelo": product.get("modelo", ""),
            "descricao": product.get("modelo", ""),
            "preco": float(product.get("preco", 0)),
            "quantidade": product.get("estoque", 0),
            "quantidade_minima": 10,
            "status": product.get("status", "active"),
            "destacado": product.get("featured", False),
            "e_visivel": product.get("status") == "active",
            "metadata": {
                "allin_id": product.get("product_id"),
                "allin_synced_at": product.get("allin_synced_at", datetime.now()).isoformat(),
                "moderacao": product.get("moderacao"),
            },
        }
    
    def _convert_order_to_supabase(self, order: Dict[str, Any]) -> Dict[str, Any]:
        """Convert order model to Supabase format."""
        # Map fields from SupabaseTransformer.transform_order() to pedidos table
        return {
            "numero_pedido": order.get("numero_pedido"),
            "cliente_nome": order.get("comprador"),
            "cliente_email": order.get("usuario", ""),
            "valor_total": float(order.get("valor_total_pedido", 0)),
            "status_pedido": order.get("status_pedido", "pending"),
            "loja_nome": order.get("loja", "AllIn Loja Virtual"),
            "forma_pagamento": order.get("forma_pagamento"),
            "pagamento_confirmado": order.get("pago", False),
            "cancelado": order.get("cancelado", False),
            "metadata": {
                "allin_id": order.get("numero_pedido"),
                "allin_synced_at": datetime.now().isoformat(),
                "patrocinador_comprador": order.get("patrocinador_comprador"),
                "plano_comprador": order.get("plano_comprador"),
                "data_pagamento": order.get("data_pagamento"),
                "hora_pagamento": order.get("hora_pagamento"),
                "gateway_transaction_id": order.get("gateway_transaction_id"),
                "pagamentos": order.get("pagamentos"),
            },
            "data_criacao": order.get("data_pagamento"),  # Usar data_pagamento como fallback
            "data_pagamento": order.get("data_pagamento"),
        }
    
    def _convert_order_item_to_supabase(self, pedido_id: str, item: Dict[str, Any]) -> Dict[str, Any]:
        """Convert order item model to Supabase format."""
        return {
            "pedido_id": pedido_id,
            "product_code": item.get("product_code"),
            "product_name": item.get("product_name"),
            "quantity": int(item.get("quantity", 1)),
            "unit_price": float(item.get("unit_price", 0)),
            "total_price": float(item.get("total_price", 0)),
            "size": item.get("size"),
            "variant": item.get("variant"),
            "metadata": {
                "allin_synced_at": datetime.now().isoformat(),
            },
        }
    
    def _convert_plan_to_supabase(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Convert plan model to Supabase format."""
        slug = plan.get("nome", "").lower().replace(" ", "-")
        return {
            "nome": plan.get("nome"),
            "tipo": plan.get("tipo", "standard"),
            "slug": slug,
            "descricao": f"Plano {plan.get('nome')}",
            "preco": float(plan.get("valor", 0)),
            "taxa_ativacao": float(plan.get("adesao", 0)),
            "taxa_mensal": float(plan.get("renovacao", 0)) if plan.get("renovacao") else 0,
            "max_geracoes": 10,
            "bonus_direto_porcentagem": 10.0,
            "bonus_indireto_porcentagem": 5.0,
            "is_active": plan.get("status") == "active",
            "is_upgrade": False,
            "metadata": {
                "allin_id": plan.get("plan_id"),
                "allin_synced_at": plan.get("allin_synced_at", datetime.now()).isoformat(),
                "upgrade": float(plan.get("upgrade", 0)) if plan.get("upgrade") else None,
                "estoque": plan.get("estoque", 0),
            },
        }
    
    def save_checkpoint(self, entity: str, data: Dict[str, Any]) -> None:
        """Save checkpoint data."""
        checkpoint_path = Path("storage/checkpoints") / f"{entity}_checkpoint.json"
        checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(checkpoint_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        
        logger.info("checkpoint_saved", entity=entity, path=str(checkpoint_path))
    
    def load_checkpoint(self, entity: str) -> Optional[Dict[str, Any]]:
        """Load checkpoint data."""
        checkpoint_path = Path("storage/checkpoints") / f"{entity}_checkpoint.json"
        
        if checkpoint_path.exists():
            with open(checkpoint_path, 'r') as f:
                data = json.load(f)
            logger.info("checkpoint_loaded", entity=entity, path=str(checkpoint_path))
            return data
        
        return None
