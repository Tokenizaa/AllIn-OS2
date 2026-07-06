"""
Pydantic models for AllIn orders.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class AddressModel(BaseModel):
    """
    Model for address data.
    """
    logradouro: Optional[str] = Field(None, description="Street address")
    numero: Optional[str] = Field(None, description="House number")
    bairro: Optional[str] = Field(None, description="Neighborhood")
    cidade: Optional[str] = Field(None, description="City")
    uf: Optional[str] = Field(None, description="State")
    cep: Optional[str] = Field(None, description="ZIP code")
    complemento: Optional[str] = Field(None, description="Address complement")


class OrderItem(BaseModel):
    """
    Model for order item.
    """
    product_id: str = Field(..., description="Product ID")
    nome: str = Field(..., description="Product name")
    quantidade: int = Field(..., description="Quantity")
    preco_unitario: Decimal = Field(..., description="Unit price")
    total: Decimal = Field(..., description="Total price")
    sku: Optional[str] = Field(None, description="Product SKU")


class OrderModel(BaseModel):
    """
    Model for order list data.
    """
    order_id: str = Field(..., description="Order ID from AllIn")
    cliente: str = Field(..., description="Customer name")
    distribuidor: Optional[str] = Field(None, description="Distributor name")
    data: datetime = Field(..., description="Order date")
    status: str = Field(..., description="Order status")
    total: Decimal = Field(..., description="Order total")
    
    # Metadata
    allin_synced_at: datetime = Field(default_factory=datetime.now, description="Sync timestamp")
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat(),
        }


class OrderDetailModel(BaseModel):
    """
    Model for order detail data.
    """
    order_id: str = Field(..., description="Order ID from AllIn")
    itens: List[OrderItem] = Field(default_factory=list, description="Order items")
    quantidades: Dict[str, int] = Field(default_factory=dict, description="Product quantities")
    sku: Dict[str, str] = Field(default_factory=dict, description="Product SKUs")
    produto: Dict[str, str] = Field(default_factory=dict, description="Product names")
    valor: Decimal = Field(..., description="Order total value")
    forma_pagamento: str = Field(..., description="Payment method")
    historico: List[Dict[str, Any]] = Field(default_factory=list, description="Order history")
    comentarios: Optional[str] = Field(None, description="Order comments")
    ip: Optional[str] = Field(None, description="Customer IP")
    endereco: Optional[AddressModel] = Field(None, description="Delivery address")
    
    # Customer info
    cliente_nome: str = Field(..., description="Customer name")
    cliente_email: Optional[str] = Field(None, description="Customer email")
    cliente_telefone: Optional[str] = Field(None, description="Customer phone")
    
    # Delivery info
    entrega_nome: Optional[str] = Field(None, description="Delivery recipient name")
    entrega_logradouro: Optional[str] = Field(None, description="Delivery street")
    entrega_bairro: Optional[str] = Field(None, description="Delivery neighborhood")
    entrega_cep: Optional[str] = Field(None, description="Delivery ZIP")
    entrega_cidade: Optional[str] = Field(None, description="Delivery city")
    entrega_uf: Optional[str] = Field(None, description="Delivery state")
    
    # Payment info
    data_pagamento: Optional[datetime] = Field(None, description="Payment date")
    pagamento_confirmado: bool = Field(default=False, description="Payment confirmed")
    
    # Metadata
    allin_synced_at: datetime = Field(default_factory=datetime.now, description="Sync timestamp")
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat(),
        }


class OrderListModel(BaseModel):
    """
    Model for paginated order list response.
    """
    orders: List[OrderModel] = Field(default_factory=list, description="List of orders")
    total: int = Field(default=0, description="Total number of orders")
    page: int = Field(default=1, description="Current page number")
    pages: int = Field(default=1, description="Total number of pages")
    has_next: bool = Field(default=False, description="Has next page")
    has_previous: bool = Field(default=False, description="Has previous page")
