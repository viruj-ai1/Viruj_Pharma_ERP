"""Schemas for user service."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    """Schema for user response."""
    id: str
    name: str
    email: EmailStr
    role: str
    department: str
    plant_id: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    """Schema for creating a user."""
    name: str
    email: EmailStr
    role: str
    department: str
    plant_id: Optional[str] = None
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    department: Optional[str] = None
    plant_id: Optional[str] = None
    is_active: Optional[bool] = None

