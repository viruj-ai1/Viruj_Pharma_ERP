"""Schemas for production service."""

from typing import Optional
from pydantic import BaseModel, Field


class BatchCreate(BaseModel):
    """Schema for creating a batch."""
    batch_number: str
    product_name: str
    plant_id: str
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., pattern="^(kg|L|units)$")


class BatchUpdate(BaseModel):
    """Schema for updating a batch."""
    status: Optional[str] = None
    quantity: Optional[float] = Field(None, gt=0)
    final_yield: Optional[float] = None


class BatchResponse(BaseModel):
    """Schema for batch response."""
    id: str
    batch_number: str
    product_name: str
    status: str
    plant_id: str
    created_at: Optional[str] = None

