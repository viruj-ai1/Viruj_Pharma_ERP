"""
Pydantic schemas for request/response validation.

These schemas define the data structures for API requests and responses,
ensuring type safety and validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


# User Schemas
class UserBase(BaseModel):
    """Base user schema."""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    role: str = Field(..., min_length=1, max_length=100)
    department: str = Field(..., min_length=1, max_length=100)
    plant_id: Optional[str] = Field(None, max_length=50)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate name contains only allowed characters."""
        v = v.strip()
        if not re.match(r"^[a-zA-Z\s\.\-']+$", v):
            raise ValueError("Name can only contain letters, spaces, dots, hyphens, and apostrophes")
        return v

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        """Additional email validation."""
        if len(v) > 255:
            raise ValueError("Email address too long")
        return v.lower().strip()


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Password must be at least 8 characters long"
    )

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    role: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    plant_id: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        """Validate name if provided."""
        if v is not None:
            v = v.strip()
            if not re.match(r"^[a-zA-Z\s\.\-']+$", v):
                raise ValueError("Name can only contain letters, spaces, dots, hyphens, and apostrophes")
            return v
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        """Validate and normalize email if provided."""
        if v is not None:
            if len(v) > 255:
                raise ValueError("Email address too long")
            return v.lower().strip()
        return v


class UserResponse(UserBase):
    """Schema for user response."""
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Authentication Schemas
class LoginRequest(BaseModel):
    """Schema for login request."""
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Validate and normalize email."""
        if len(v) > 255:
            raise ValueError("Email address too long")
        return v.lower().strip()

    @field_validator("password")
    @classmethod
    def validate_password_not_empty(cls, v: str) -> str:
        """Ensure password is not empty."""
        if not v or not v.strip():
            raise ValueError("Password cannot be empty")
        return v


class LoginResponse(BaseModel):
    """Schema for login response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Schema for token data."""
    user_id: Optional[str] = None


# Plant Schemas
class PlantBase(BaseModel):
    """Base plant schema."""
    name: str
    region: str
    running_lines: int = 0
    oee: float = 0.0
    yield_value: float = 0.0
    open_qa_holds: int = 0
    inventory_value: float = 0.0
    manager_id: Optional[str] = None


class PlantCreate(PlantBase):
    """Schema for creating a plant."""
    pass


class PlantResponse(PlantBase):
    """Schema for plant response."""
    id: str
    last_updated: datetime

    class Config:
        from_attributes = True


# Notification Schemas
class NotificationBase(BaseModel):
    """Base notification schema."""
    title: str
    message: str
    type: str = "info"


class NotificationCreate(NotificationBase):
    """Schema for creating a notification."""
    user_id: str


class NotificationResponse(NotificationBase):
    """Schema for notification response."""
    id: str
    user_id: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Generic Response Schemas
class MessageResponse(BaseModel):
    """Generic message response."""
    message: str


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    db_user: Optional[str] = None

