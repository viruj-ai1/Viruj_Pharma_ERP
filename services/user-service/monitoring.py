"""Monitoring setup for user service."""

from fastapi import FastAPI
import logging
import sys
from pythonjsonlogger import jsonlogger

logHandler = logging.StreamHandler(sys.stdout)
formatter = jsonlogger.JsonFormatter(
    "%(timestamp)s %(level)s %(name)s %(message)s"
)
logHandler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)


def setup_monitoring(app: FastAPI, service_name: str):
    """Setup monitoring for the service."""
    logger.info(f"{service_name} starting up")


def log_info(message: str, **kwargs):
    """Log info message."""
    logger.info(message, extra=kwargs)


def log_error(error: Exception, context: dict = None):
    """Log error."""
    logger.error(
        "Error occurred",
        extra={
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context or {},
        },
        exc_info=True,
    )

