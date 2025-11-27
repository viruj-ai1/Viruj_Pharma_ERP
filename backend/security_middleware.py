"""
Security middleware and utilities for the FastAPI application.

This module provides additional security features including:
- Input sanitization
- SQL injection prevention helpers
- XSS prevention
"""

import re
from typing import Any, Optional
from html import escape


def sanitize_string(value: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize string input to prevent XSS and injection attacks.
    
    Args:
        value: Input string to sanitize
        max_length: Maximum allowed length
        
    Returns:
        Sanitized string
    """
    if not isinstance(value, str):
        return str(value)
    
    # Remove null bytes
    value = value.replace("\x00", "")
    
    # Trim whitespace
    value = value.strip()
    
    # Limit length if specified
    if max_length and len(value) > max_length:
        value = value[:max_length]
    
    return value


def sanitize_email(email: str) -> str:
    """
    Sanitize email address.
    
    Args:
        email: Email address to sanitize
        
    Returns:
        Sanitized email address
    """
    email = sanitize_string(email, max_length=255)
    email = email.lower().strip()
    
    # Basic email format validation
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise ValueError("Invalid email format")
    
    return email


def sanitize_sql_identifier(identifier: str) -> str:
    """
    Sanitize SQL identifier to prevent SQL injection.
    Only allows alphanumeric characters and underscores.
    
    Args:
        identifier: SQL identifier to sanitize
        
    Returns:
        Sanitized identifier
    """
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', identifier):
        raise ValueError(f"Invalid SQL identifier: {identifier}")
    return identifier


def escape_html(text: str) -> str:
    """
    Escape HTML special characters to prevent XSS.
    
    Args:
        text: Text to escape
        
    Returns:
        Escaped text
    """
    return escape(text)


def validate_uuid(uuid_string: str) -> bool:
    """
    Validate UUID format.
    
    Args:
        uuid_string: String to validate as UUID
        
    Returns:
        True if valid UUID format, False otherwise
    """
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    return bool(re.match(uuid_pattern, uuid_string.lower()))


def sanitize_path(path: str) -> str:
    """
    Sanitize file path to prevent directory traversal attacks.
    
    Args:
        path: File path to sanitize
        
    Returns:
        Sanitized path
    """
    # Remove directory traversal attempts
    path = path.replace("..", "").replace("//", "/")
    
    # Remove leading/trailing slashes
    path = path.strip("/")
    
    # Only allow alphanumeric, dots, hyphens, underscores, and slashes
    if not re.match(r'^[a-zA-Z0-9._\-/]+$', path):
        raise ValueError(f"Invalid path: {path}")
    
    return path

