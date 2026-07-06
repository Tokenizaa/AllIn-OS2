"""
Pydantic models for AllIn products.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class ProductModel(BaseModel):
    """
    Model for product list data.
    """
    product_id: str = Field(..., description="Product ID from AllIn")
    sku: str = Field(..., description="Product SKU/code")
    nome: str = Field(..., description="Product name")
    modelo: Optional[str] = Field(None, description="Product model")
    categoria: str = Field(..., description="Product category")
    preco: Decimal = Field(..., description="Product price")
    pontos: Optional[int] = Field(None, description="Product points")
    estoque: int = Field(default=0, description="Product stock quantity")
    status: str = Field(default="active", description="Product status")
    featured: bool = Field(default=False, description="Is featured product")
    moderacao: Optional[str] = Field(None, description="Moderation status")
    
    # Metadata
    allin_synced_at: datetime = Field(default_factory=datetime.now, description="Sync timestamp")
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat(),
        }


class ProductDetailModel(BaseModel):
    """
    Model for product detail data.
    """
    product_id: str = Field(..., description="Product ID from AllIn")
    descricao: str = Field(..., description="Product description")
    imagens: List[str] = Field(default_factory=list, description="Product image URLs")
    peso: Optional[Decimal] = Field(None, description="Product weight")
    dimensoes: Optional[Dict[str, Decimal]] = Field(None, description="Product dimensions")
    seo: Optional[Dict[str, str]] = Field(None, description="SEO metadata")
    atributos: List[Dict[str, str]] = Field(default_factory=list, description="Product attributes")
    categorias: List[str] = Field(default_factory=list, description="Product categories")
    
    # Metadata
    allin_synced_at: datetime = Field(default_factory=datetime.now, description="Sync timestamp")
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat(),
        }


class ProductListModel(BaseModel):
    """
    Model for paginated product list response.
    """
    products: List[ProductModel] = Field(default_factory=list, description="List of products")
    total: int = Field(default=0, description="Total number of products")
    page: int = Field(default=1, description="Current page number")
    pages: int = Field(default=1, description="Total number of pages")
    has_next: bool = Field(default=False, description="Has next page")
    has_previous: bool = Field(default=False, description="Has previous page")
