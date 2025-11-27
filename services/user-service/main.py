"""
User Management Service

Handles user CRUD operations and user-related queries.
"""

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import psycopg

from schemas import UserResponse, UserCreate, UserUpdate, MessageResponse
from monitoring import log_info, log_error, setup_monitoring
from database import get_db_connection
from service_client import verify_token

# Load environment
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env", override=False)

DATABASE_URL = os.getenv("DATABASE_URL")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")
SERVICE_NAME = "user-service"
SERVICE_PORT = int(os.getenv("USER_SERVICE_PORT", "8002"))

app = FastAPI(
    title="User Service",
    version="1.0.0",
    description="User Management Service",
)

# Setup monitoring
setup_monitoring(app, SERVICE_NAME)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_current_user_id(authorization: Optional[str] = None) -> str:
    """Get current user ID from token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    user_info = verify_token(token, AUTH_SERVICE_URL)
    return user_info.get("user_id")


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": SERVICE_NAME}


@app.get("/api/users", response_model=list[UserResponse])
@limiter.limit("100/minute")
def get_users(request, authorization: Optional[str] = None):
    """Get all users."""
    # Verify authentication
    get_current_user_id(authorization)
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, name, email, role, department, plant_id, is_active, created_at
                    FROM users 
                    WHERE is_active = true
                    ORDER BY name
                    """
                )
                rows = cur.fetchall()
                return [
                    UserResponse(
                        id=row[0],
                        name=row[1],
                        email=row[2],
                        role=row[3],
                        department=row[4],
                        plant_id=row[5],
                        is_active=row[6],
                        created_at=row[7],
                    )
                    for row in rows
                ]
    except Exception as e:
        log_error(e, {"context": "get_users"})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@app.get("/api/users/{user_id}", response_model=UserResponse)
@limiter.limit("100/minute")
def get_user(request, user_id: str, authorization: Optional[str] = None):
    """Get user by ID."""
    get_current_user_id(authorization)
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, name, email, role, department, plant_id, is_active, created_at
                    FROM users 
                    WHERE id = %s
                    """,
                    (user_id,),
                )
                row = cur.fetchone()
                if row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="User not found"
                    )
                return UserResponse(
                    id=row[0],
                    name=row[1],
                    email=row[2],
                    role=row[3],
                    department=row[4],
                    plant_id=row[5],
                    is_active=row[6],
                    created_at=row[7],
                )
    except HTTPException:
        raise
    except Exception as e:
        log_error(e, {"context": "get_user", "user_id": user_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=SERVICE_PORT)

