"""Database utilities for auth service."""

import os
from contextlib import contextmanager
from typing import Generator
import psycopg
from psycopg import pool

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://viruj_app:password@localhost:5432/viruj_erp",
)

_connection_pool: pool.ConnectionPool = None


def get_connection_pool() -> pool.ConnectionPool:
    """Get or create database connection pool."""
    global _connection_pool
    if _connection_pool is None:
        _connection_pool = pool.ConnectionPool(
            DATABASE_URL,
            min_size=2,
            max_size=10,
            max_idle=300,
            max_lifetime=3600,
        )
    return _connection_pool


@contextmanager
def get_db_connection() -> Generator[psycopg.Connection, None, None]:
    """Get database connection from pool."""
    pool_instance = get_connection_pool()
    conn = pool_instance.getconn()
    try:
        yield conn
    finally:
        pool_instance.putconn(conn)

