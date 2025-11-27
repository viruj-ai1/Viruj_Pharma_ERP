"""
Monitoring and observability utilities.

This module provides structured logging, metrics collection, and error tracking.
"""

import json
import logging
import sys
from datetime import datetime
from typing import Any, Dict, Optional
from pythonjsonlogger import jsonlogger
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import Request, Response
from fastapi.responses import Response as FastAPIResponse
import os

# Sentry for error tracking (optional)
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
    
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,
        environment=os.getenv("ENVIRONMENT", "development"),
    )

# Configure structured JSON logging
logHandler = logging.StreamHandler(sys.stdout)
# JsonFormatter with format string - includes standard fields automatically
formatter = jsonlogger.JsonFormatter(
    "%(asctime)s %(levelname)s %(name)s %(message)s"
)
logHandler.setFormatter(formatter)

# Get logger
logger = logging.getLogger("viruj_erp")
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Set log level from environment
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logger.setLevel(getattr(logging, log_level, logging.INFO))


# Prometheus metrics
# HTTP metrics
http_requests_total = Counter(
    "http_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint", "status_code"]
)

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint"],
    buckets=[0.1, 0.5, 1.0, 2.5, 5.0, 10.0]
)

# Database metrics
db_query_duration_seconds = Histogram(
    "db_query_duration_seconds",
    "Database query duration in seconds",
    ["query_type"]
)

db_connections_active = Gauge(
    "db_connections_active",
    "Number of active database connections"
)

# Business metrics
users_total = Gauge(
    "users_total",
    "Total number of users",
    ["status"]  # active, inactive
)

batches_total = Gauge(
    "batches_total",
    "Total number of batches",
    ["status", "plant_id"]
)

# Cache metrics
cache_hits_total = Counter(
    "cache_hits_total",
    "Total number of cache hits",
    ["cache_key"]
)

cache_misses_total = Counter(
    "cache_misses_total",
    "Total number of cache misses",
    ["cache_key"]
)


def log_request(request: Request, response: Response, duration: float):
    """Log HTTP request with structured data."""
    logger.info(
        "HTTP request",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": duration * 1000,
            "client_ip": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
        }
    )


def log_error(error: Exception, context: Optional[Dict[str, Any]] = None):
    """Log error with context."""
    logger.error(
        "Error occurred",
        extra={
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context or {},
        },
        exc_info=True,
    )


def log_info(message: str, **kwargs):
    """Log info message with additional context."""
    logger.info(message, extra=kwargs)


def log_warning(message: str, **kwargs):
    """Log warning message with additional context."""
    logger.warning(message, extra=kwargs)


# Metrics endpoint for Prometheus
def get_metrics_response() -> FastAPIResponse:
    """Get Prometheus metrics."""
    return FastAPIResponse(
        content=generate_latest(),
        media_type="text/plain"
    )

