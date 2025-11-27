"""
Shared service client for inter-service communication.

This module provides utilities for services to communicate with each other.
"""

import os
from typing import Optional, Dict, Any
import httpx
from fastapi import HTTPException, status

# Service URLs (can be overridden by environment variables)
SERVICE_URLS = {
    "auth": os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001"),
    "user": os.getenv("USER_SERVICE_URL", "http://user-service:8002"),
    "production": os.getenv("PRODUCTION_SERVICE_URL", "http://production-service:8003"),
    "qa": os.getenv("QA_SERVICE_URL", "http://qa-service:8004"),
    "scm": os.getenv("SCM_SERVICE_URL", "http://scm-service:8005"),
    "inventory": os.getenv("INVENTORY_SERVICE_URL", "http://inventory-service:8006"),
    "document": os.getenv("DOCUMENT_SERVICE_URL", "http://document-service:8007"),
    "notification": os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8008"),
    "analytics": os.getenv("ANALYTICS_SERVICE_URL", "http://analytics-service:8009"),
}


def verify_token(token: str, auth_service_url: Optional[str] = None) -> Dict[str, Any]:
    """
    Verify JWT token with auth service.
    
    Args:
        token: JWT token to verify
        auth_service_url: Optional auth service URL override
        
    Returns:
        Token payload with user information
    """
    url = auth_service_url or SERVICE_URLS["auth"]
    
    try:
        with httpx.Client(timeout=5.0) as client:
            response = client.post(
                f"{url}/api/auth/verify",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Auth service unavailable: {str(e)}"
        )


def call_service(
    service_name: str,
    method: str,
    endpoint: str,
    token: Optional[str] = None,
    data: Optional[Dict] = None,
    timeout: float = 10.0
) -> Dict[str, Any]:
    """
    Call another microservice.
    
    Args:
        service_name: Name of the service to call
        method: HTTP method (GET, POST, PUT, DELETE)
        endpoint: API endpoint path
        token: Optional JWT token for authentication
        data: Optional request body
        timeout: Request timeout in seconds
        
    Returns:
        Response data as dictionary
    """
    if service_name not in SERVICE_URLS:
        raise ValueError(f"Unknown service: {service_name}")
    
    url = f"{SERVICE_URLS[service_name]}{endpoint}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    try:
        with httpx.Client(timeout=timeout) as client:
            if method.upper() == "GET":
                response = client.get(url, headers=headers)
            elif method.upper() == "POST":
                response = client.post(url, headers=headers, json=data)
            elif method.upper() == "PUT":
                response = client.put(url, headers=headers, json=data)
            elif method.upper() == "DELETE":
                response = client.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Service error: {e.response.text}"
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unavailable: {str(e)}"
        )

