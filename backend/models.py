"""
Database models for Viruj Pharma ERP using SQLAlchemy ORM.

This module defines all database tables and their relationships.
"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    JSON,
    create_engine,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func

Base = declarative_base()


class DepartmentEnum(PyEnum):
    """Department enumeration matching frontend types."""
    QA = "Quality Assurance"
    QC = "Quality Control"
    SCM = "Supply Chain Management"
    Production = "Production"
    Admin = "Administration"
    Sales = "Sales"
    Corporate = "Corporate"
    Finance = "Finance"
    Security = "Security"


class RoleEnum(PyEnum):
    """Role enumeration matching frontend types."""
    # Production
    Production_Head = "Production Head"
    Production_Manager = "Production Manager"
    Production_Operator = "Production Operator"
    
    # QA
    QA_Head = "QA Head"
    QA_Manager = "QA Manager"
    QA_Operator = "QA Operator"
    
    # QC
    QC_Head = "QC Head"
    QC_Manager = "QC Manager"
    QC_Operator = "QC Operator"
    
    # SCM
    Procurement_Officer = "Procurement Officer"
    Warehouse_Manager = "Warehouse Manager"
    
    # Finance
    Finance_Officer = "Finance Officer"
    
    # Admin & Leadership
    System_Admin = "System Admin"
    Plant_Head = "Plant Head"
    Management = "Management"
    
    # Sales
    Sales_Person = "Sales Person"


class User(Base):
    """User model for authentication and authorization."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    department = Column(Enum(DepartmentEnum), nullable=False)
    plant_id = Column(String, ForeignKey("plants.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    plant = relationship("Plant", back_populates="users")


class Plant(Base):
    """Plant/Location model."""
    __tablename__ = "plants"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)
    running_lines = Column(Integer, default=0)
    oee = Column(Numeric(5, 2), default=0)  # Overall Equipment Effectiveness
    yield_value = Column(Numeric(5, 2), default=0)
    open_qa_holds = Column(Integer, default=0)
    inventory_value = Column(Numeric(15, 2), default=0)
    manager_id = Column(String, ForeignKey("users.id"), nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="plant")
    batches = relationship("ProductionBatch", back_populates="plant")


class ProductionBatch(Base):
    """Production batch model."""
    __tablename__ = "production_batches"

    id = Column(String, primary_key=True, index=True)
    product_name = Column(String, nullable=False)
    batch_number = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, nullable=False)  # Planned, In Progress, etc.
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    quantity = Column(Numeric(10, 2), nullable=False)
    unit = Column(String, nullable=False)  # kg, L
    assigned_to = Column(String, ForeignKey("users.id"), nullable=True)
    officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    plant_id = Column(String, ForeignKey("plants.id"), nullable=False)
    qa_release_status = Column(String, default="Pending")
    bmr_status = Column(String, default="Incomplete")
    final_yield = Column(Numeric(5, 2), nullable=True)
    qa_officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    hold_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    plant = relationship("Plant", back_populates="batches")


class Material(Base):
    """Material/Master data model."""
    __tablename__ = "materials"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Raw Material, Finished Good, Packaging
    default_unit = Column(String, nullable=False)  # kg, L, units
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    """Notification model for user alerts."""
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info")  # info, warning, error, success
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User")


# Database connection setup
def get_database_url() -> str:
    """Get database URL from environment."""
    import os
    return os.getenv(
        "DATABASE_URL",
        "postgresql://viruj_app:password@localhost:5432/viruj_erp",
    )


def create_engine_instance():
    """Create SQLAlchemy engine."""
    return create_engine(get_database_url(), echo=False)


def get_session_local():
    """Create database session factory."""
    engine = create_engine_instance()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency for FastAPI
def get_db():
    """Database dependency for FastAPI routes."""
    db = get_session_local()()
    try:
        yield db
    finally:
        db.close()

