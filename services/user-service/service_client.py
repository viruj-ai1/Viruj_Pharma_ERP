"""Service client for inter-service communication."""

import httpx
from fastapi import HTTPException, status
from typing import Dict, Any, Optional


def verify_token(token: str, auth_service_url: str) -> Dict[str, Any]:
    """Verify JWT token with auth service."""
    try:
        with httpx.Client(timeout=5.0) as client:
            response = client.post(
                f"{auth_service_url}/api/auth/verify",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code == 200:
                data = response.json()
                return {"user_id": data.get("user_id"), "valid": True}
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

