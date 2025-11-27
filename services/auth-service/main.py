"""
Authentication & Authorization Service

Handles user authentication, JWT token management, and authorization.
"""

import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import psycopg

from schemas import LoginRequest, LoginResponse, UserResponse, MessageResponse
from monitoring import log_info, log_error, setup_monitoring
from database import get_db_connection

# Load environment
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env", override=False)

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
SERVICE_NAME = "auth-service"
SERVICE_PORT = int(os.getenv("AUTH_SERVICE_PORT", "8001"))

app = FastAPI(
    title="Auth Service",
    version="1.0.0",
    description="Authentication and Authorization Service",
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
    allow_origins=["*"],  # Configure appropriately
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "service": SERVICE_NAME})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": SERVICE_NAME}


@app.post("/api/auth/login", response_model=LoginResponse)
@limiter.limit("5/minute")
def login(request, login_data: LoginRequest) -> LoginResponse:
    """Authenticate user and return JWT token."""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, name, email, role, department, plant_id, is_active, hashed_password
                    FROM users 
                    WHERE email = %s AND is_active = true
                    """,
                    (login_data.email.lower(),),
                )
                row = cur.fetchone()

                if row is None:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid email or password",
                    )

                user_id, name, email, role, department, plant_id, is_active, hashed_password = row

                # Verify password
                if hashed_password:
                    if not verify_password(login_data.password, hashed_password):
                        raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid email or password",
                        )
                elif login_data.password != "demo123":  # Demo mode fallback
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid email or password",
                    )

                # Create access token
                access_token = create_access_token(data={"sub": user_id, "email": email})

                user_response = UserResponse(
                    id=user_id,
                    name=name,
                    email=email,
                    role=role,
                    department=department,
                    plant_id=plant_id,
                    is_active=is_active,
                    created_at=datetime.utcnow(),
                )

                log_info("User logged in", {"user_id": user_id, "email": email})

                return LoginResponse(
                    access_token=access_token,
                    token_type="bearer",
                    user=user_response,
                )
    except HTTPException:
        raise
    except Exception as e:
        log_error(e, {"context": "login"})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@app.post("/api/auth/verify", response_model=dict)
def verify(request, credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token and return user info."""
    token = credentials.credentials
    payload = verify_token(token)
    return {"valid": True, "user_id": payload.get("sub")}


@app.post("/api/auth/logout", response_model=MessageResponse)
def logout() -> MessageResponse:
    """Logout endpoint (client should remove token)."""
    return MessageResponse(message="Logged out successfully")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=SERVICE_PORT)

