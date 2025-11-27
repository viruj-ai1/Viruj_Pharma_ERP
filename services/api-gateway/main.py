"""
API Gateway

Routes requests to appropriate microservices and handles
authentication, rate limiting, and request/response transformation.
"""

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import httpx

from monitoring import log_info, log_error, setup_monitoring

# Load environment
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env", override=False)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
GATEWAY_PORT = int(os.getenv("GATEWAY_PORT", "8000"))

# Service URLs
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

# Route mapping: path prefix -> service name
ROUTE_MAP = {
    "/api/auth": "auth",
    "/api/users": "user",
    "/api/batches": "production",
    "/api/production": "production",
    "/api/qa": "qa",
    "/api/quality": "qa",
    "/api/scm": "scm",
    "/api/inventory": "inventory",
    "/api/documents": "document",
    "/api/notifications": "notification",
    "/api/analytics": "analytics",
    "/api/reports": "analytics",
}

app = FastAPI(
    title="Viruj Pharma ERP API Gateway",
    version="1.0.0",
    description="API Gateway for microservices architecture",
)

# Setup monitoring
setup_monitoring(app, "api-gateway")

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def find_service(path: str) -> Optional[tuple[str, str]]:
    """
    Find which service should handle the request.
    
    Returns:
        Tuple of (service_name, service_url) or None
    """
    for prefix, service_name in ROUTE_MAP.items():
        if path.startswith(prefix):
            return service_name, SERVICE_URLS[service_name]
    return None


@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(request: Request, path: str = ""):
    """Route requests to appropriate microservice."""
    # Health check
    if path == "health":
        return {"status": "ok", "service": "api-gateway"}
    
    # Find target service
    service_info = find_service(f"/{path}")
    if not service_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found"
        )
    
    service_name, service_url = service_info
    target_url = f"{service_url}/{path}"
    
    # Forward request
    try:
        # Get request body if present
        body = None
        if request.method in ["POST", "PUT", "PATCH"]:
            body = await request.body()
        
        # Forward headers (preserve authorization)
        headers = dict(request.headers)
        headers.pop("host", None)
        headers.pop("content-length", None)
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=dict(request.query_params)
            )
            
            # Return response
            return JSONResponse(
                content=response.json() if response.headers.get("content-type", "").startswith("application/json") else {"data": response.text},
                status_code=response.status_code,
                headers=dict(response.headers)
            )
    except httpx.HTTPStatusError as e:
        log_error(e, {"service": service_name, "path": path})
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Service error: {e.response.text}"
        )
    except httpx.RequestError as e:
        log_error(e, {"service": service_name, "path": path})
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service {service_name} unavailable"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=GATEWAY_PORT)

