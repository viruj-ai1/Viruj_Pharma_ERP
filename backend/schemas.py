"""
Pydantic schemas for request/response validation.

These schemas define the data structures for API requests and responses,
ensuring type safety and validation.
"""

from datetime import datetime, date
from typing import List, Optional, Literal
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



# Security Gate Log Schemas
class SecurityLogBase(BaseModel):
    material_name: str = Field(..., min_length=2, max_length=150)
    material_category: Optional[str] = Field(None, max_length=100)
    po_number: Optional[str] = Field(None, max_length=60)
    vehicle_name: Optional[str] = Field(None, max_length=80)
    vehicle_number: str = Field(..., min_length=4, max_length=40)
    driver_name: Optional[str] = Field(None, max_length=100)
    driver_contact: Optional[str] = Field(None, max_length=30)
    supplier_name: Optional[str] = Field(None, max_length=150)
    document_number: Optional[str] = Field(None, max_length=80)
    quantity: Optional[float] = Field(None, gt=0)
    uom: Optional[str] = Field(None, max_length=20)
    remarks: Optional[str] = Field(None, max_length=500)
    seal_intact: Optional[bool] = Field(True)
    plant_id: Optional[str] = Field(None, max_length=50)

    @field_validator("vehicle_number")
    @classmethod
    def normalize_vehicle_number(cls, value: str) -> str:
        cleaned = value.strip().upper()
        if not re.match(r"^[A-Z0-9\- ]{4,40}$", cleaned):
            raise ValueError("Vehicle number may only contain letters, numbers, spaces, and dashes")
        return cleaned

    @field_validator("driver_contact")
    @classmethod
    def validate_driver_contact(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        cleaned = value.strip()
        if not re.match(r"^[0-9+\-\s]{6,30}$", cleaned):
            raise ValueError("Driver contact should contain only digits, spaces, + or -")
        return cleaned


class SecurityLogCreate(SecurityLogBase):
    pass


class SecurityLogResponse(SecurityLogBase):
    id: str
    entry_code: str
    status: str
    created_by: Optional[str]
    created_by_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class GRNItem(BaseModel):
    description: str = Field(..., min_length=2, max_length=200)
    stock_code: Optional[str] = Field(None, max_length=50)
    status: str = Field("GRN", max_length=30)
    quantity: float = Field(..., gt=0)
    price: float = Field(..., ge=0)
    vat_rate: float = Field(0, ge=0, le=100)
    nominal: Optional[str] = Field(None, max_length=50)
    account: Optional[str] = Field(None, max_length=50)


class GRNBase(BaseModel):
    po_number: str = Field(..., min_length=1, max_length=60)
    delivery_challan: Optional[str] = Field(None, max_length=80)
    quantity_received: Optional[float] = Field(None, gt=0)
    remarks: Optional[str] = Field(None, max_length=500)

    supplier_name: Optional[str] = Field(None, max_length=150)
    supplier_address: Optional[str] = Field(None, max_length=300)
    supplier_location: Optional[str] = Field(None, max_length=150)
    supplier_contact: Optional[str] = Field(None, max_length=100)

    document_status: Optional[str] = Field("Goods Received", max_length=60)
    document_date: Optional[date] = None
    delivery_date: Optional[date] = None
    period: Optional[str] = Field(None, max_length=40)
    reference: Optional[str] = Field(None, max_length=80)
    comment: Optional[str] = Field(None, max_length=500)

    items: List[GRNItem] = Field(default_factory=list)


class GRNCreate(GRNBase):
    gate_entry_id: str = Field(..., max_length=50)
    quantity_received: float = Field(..., gt=0)

    @field_validator("items")
    @classmethod
    def ensure_items_present(cls, value: List[GRNItem]) -> List[GRNItem]:
        if not value:
            raise ValueError("At least one GRN line item is required")
        return value


class GRNResponse(GRNBase):
    id: str
    gate_entry_id: str
    entry_code: str
    grn_code: str
    status: str
    created_by: Optional[str]
    created_by_name: Optional[str]
    created_at: datetime
    updated_at: datetime
    net_total: Optional[float]
    vat_total: Optional[float]
    gross_total: Optional[float]

    class Config:
        from_attributes = True


class GRNPendingQAResponse(BaseModel):
    grn_id: str
    entry_code: str
    po_number: str
    delivery_challan: Optional[str]
    quantity_received: Optional[float]
    remarks: Optional[str]
    status: str
    material_name: str
    vehicle_number: str
    driver_name: Optional[str]
    driver_contact: Optional[str]
    gate_quantity: Optional[float]
    uom: Optional[str]
    gate_created_at: datetime


class SamplingRequest(BaseModel):
    qa_notes: Optional[str] = Field(None, max_length=500)


class SampleAssignmentRequest(BaseModel):
    analyst_id: str = Field(..., min_length=1, max_length=100)


class TestCreateRequest(BaseModel):
    test_name: str = Field(..., min_length=1, max_length=200)
    method: Optional[str] = Field(None, max_length=200)


class TestAssignmentRequest(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=100)


class QaAssignRequest(BaseModel):
    qa_officer_id: str = Field(..., min_length=1, max_length=100)


class QaOpinionRequest(BaseModel):
    opinion: Literal["Approve", "Reject"]
    notes: Optional[str] = Field(None, max_length=1000)


class TestResultSubmitRequest(BaseModel):
    result_data: dict
    analyst_notes: Optional[str] = Field(None, max_length=1000)


class TestReviewRequest(BaseModel):
    action: Literal["Approve", "Reject", "Return", "SendToQA"]
    manager_notes: Optional[str] = Field(None, max_length=1000)


class QaOfficerAssignRequest(BaseModel):
    officer_id: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = Field(None, max_length=1000)


class QaOfficerReviewRequest(BaseModel):
    recommendation: Literal["Approve", "Reject"]
    notes: Optional[str] = Field(None, max_length=1000)


class QaManagerDecisionRequest(BaseModel):
    decision: Literal["Approve", "Reject"]
    notes: Optional[str] = Field(None, max_length=1000)


class WarehouseActionRequest(BaseModel):
    action: Literal["Accepted", "Rejected"]
    notes: Optional[str] = Field(None, max_length=1000)
