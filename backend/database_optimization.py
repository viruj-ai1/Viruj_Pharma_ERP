"""
Database optimization utilities.

This module provides database connection pooling, query optimization,
and index management.
"""

import os
from contextlib import contextmanager
from typing import Generator, Optional
import psycopg
from psycopg.pq import TransactionStatus
from psycopg_pool import ConnectionPool
import time

try:
    from monitoring import db_connections_active, db_query_duration_seconds
except ImportError:
    # Fallback if monitoring not available
    db_connections_active = None
    db_query_duration_seconds = None

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://viruj_app:password@localhost:5432/viruj_erp",
)

# Connection pool
_connection_pool: Optional[ConnectionPool] = None


def get_connection_pool() -> ConnectionPool:
    """Get or create database connection pool."""
    global _connection_pool
    if _connection_pool is None:
        _connection_pool = ConnectionPool(
            DATABASE_URL,
            min_size=5,  # Minimum connections
            max_size=20,  # Maximum connections
            max_idle=300,  # Max idle time in seconds
            max_lifetime=3600,  # Max connection lifetime in seconds
        )
    return _connection_pool


@contextmanager
def get_db_connection() -> Generator[psycopg.Connection, None, None]:
    """Get database connection from pool with automatic cleanup."""
    pool_instance = get_connection_pool()
    conn = None
    if db_connections_active:
        db_connections_active.inc()
    try:
        conn = pool_instance.getconn()
        # Ensure connection is clean before use
        if conn.info.transaction_status == TransactionStatus.INTRANS:
            conn.rollback()
        yield conn
    finally:
        if conn:
            # Rollback any pending transaction before returning to pool
            try:
                if conn.info.transaction_status == TransactionStatus.INTRANS:
                    conn.rollback()
            except Exception:
                pass  # Ignore errors during cleanup
            pool_instance.putconn(conn)
        if db_connections_active:
            db_connections_active.dec()


def execute_query(query: str, params: tuple = None, fetch: bool = True):
    """
    Execute database query with metrics.
    
    Args:
        query: SQL query string
        params: Query parameters
        fetch: Whether to fetch results
        
    Returns:
        Query results if fetch=True, None otherwise
    """
    query_type = query.strip().split()[0].upper()  # GET, SELECT, INSERT, etc.
    
    start_time = time.time()
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, params)
                if fetch:
                    if query_type == "SELECT":
                        return cur.fetchall()
                    return cur.fetchone()
                conn.commit()
    finally:
        duration = time.time() - start_time
        if db_query_duration_seconds:
            db_query_duration_seconds.labels(query_type=query_type).observe(duration)


def create_indexes():
    """Create database indexes for performance optimization."""
    indexes = [
        # Users table indexes
        "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);",
        "CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);",
        "CREATE INDEX IF NOT EXISTS idx_users_plant_id ON users(plant_id);",
        "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);",
        "CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;",
        
        # Production batches indexes
        "CREATE INDEX IF NOT EXISTS idx_batches_batch_number ON production_batches(batch_number);",
        "CREATE INDEX IF NOT EXISTS idx_batches_plant_id ON production_batches(plant_id);",
        "CREATE INDEX IF NOT EXISTS idx_batches_status ON production_batches(status);",
        "CREATE INDEX IF NOT EXISTS idx_batches_created_at ON production_batches(created_at DESC);",
        "CREATE INDEX IF NOT EXISTS idx_batches_assigned_to ON production_batches(assigned_to);",
        "CREATE INDEX IF NOT EXISTS idx_batches_plant_status ON production_batches(plant_id, status);",
        "CREATE INDEX IF NOT EXISTS idx_batches_plant_date ON production_batches(plant_id, created_at DESC);",
        
        # Notifications indexes
        "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);",
        "CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;",
        
        # Materials indexes
        "CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);",
        "CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name);",
    ]
    
    for index_sql in indexes:
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(index_sql)
                    conn.commit()
        except Exception as e:
            # Check if it's a "relation does not exist" error - that's expected if tables aren't created yet
            if "does not exist" in str(e):
                # Silently skip - tables will be created by init script
                pass
            else:
                print(f"Error creating index: {e}")


def analyze_tables():
    """Run ANALYZE on tables to update statistics."""
    tables = ["users", "production_batches", "plants", "materials", "notifications"]
    
    for table in tables:
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(f"ANALYZE {table};")
                    conn.commit()
        except Exception as e:
            # Check if it's a "relation does not exist" error - that's expected if tables aren't created yet
            if "does not exist" in str(e):
                # Silently skip - tables will be created by init script
                pass
            else:
                print(f"Error analyzing table {table}: {e}")

