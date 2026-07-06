"""
Pydantic models for AllIn plans.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class PlanModel(BaseModel):
    """
    Model for plan list data.
    """
    plan_id: str = Field(..., description="Plan ID from AllIn")
    nome: str = Field(..., description="Plan name")
    tipo: str = Field(..., description="Plan type")
    adesao: Decimal = Field(..., description="Activation fee")
    upgrade: Optional[Decimal] = Field(None, description="Upgrade fee")
    renovacao: Optional[Decimal] = Field(None, description="Renewal fee")
    valor: Decimal = Field(..., description="Plan value")
    estoque: int = Field(default=0, description="Plan stock quantity")
    status: str = Field(default="active", description="Plan status")
    
    # Metadata
    allin_synced_at: datetime = Field(default_factory=datetime.now, description="Sync timestamp")
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat(),
        }


class PlanDetailModel(BaseModel):
    """
    Model for plan detail data.
    """
    plan_id: str = Field(..., description="Plan ID from AllIn")
    descricao: Optional[str] = Field(None, description="Plan description")
    beneficios: List[str] = Field(default_factory=list, description="Plan benefits")
    restricoes: List[str] = Field(default_factory=list, description="Plan restrictions")
    comissoes: Dict[str, Decimal] = Field(default_factory=dict, description="Commission structure")
    qualificacoes: List[str] = Field(default_factory=list, description="Required qualifications")
    
    # Metadata
    allin_synced_at: datetime = Field(default_factory=datetime.now, description="Sync timestamp")
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat(),
        }


class PlanListModel(BaseModel):
    """
    Model for plan list response.
    """
    plans: List[PlanModel] = Field(default_factory=list, description="List of plans")
    total: int = Field(default=0, description="Total number of plans")
