import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import psycopg
import time

# Import monitoring and caching
from monitoring import (
    log_request,
    log_error,
    log_info,
    http_requests_total,
    http_request_duration_seconds,
    get_metrics_response,
)
from cache import cached, invalidate_cache
from database_optimization import get_db_connection, create_indexes, analyze_tables

# Import models and schemas
from schemas import (
    LoginRequest,
    LoginResponse,
    UserResponse,
    MessageResponse,
    HealthResponse,
)
from models import get_db, User, DepartmentEnum, RoleEnum

# Load .env if one is present at repo root or backend dir
ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env", override=False)
load_dotenv(ROOT_DIR / "backend" / ".env", override=False)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://viruj_app:password@localhost:5432/viruj_erp",
)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

app = FastAPI(
    title="Viruj Chematrix API",
    version="0.1.0",
    description="Pharmaceutical Manufacturing ERP System API",
)

# Rate limiting setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
# Allow common development origins including localhost and local network IPs
allowed_origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    # Allow local network IPs on common ports (for development)
    "http://192.168.1.5:3000",
    "http://192.168.1.5:5173",
    # Add more common local network patterns if needed
    # Note: In production, replace with specific allowed origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response middleware for monitoring
@app.middleware("http")
async def monitoring_middleware(request: Request, call_next):
    """Middleware for request/response monitoring and metrics."""
    start_time = time.time()
    
    try:
        response = await call_next(request)
        duration = time.time() - start_time
        
        # Record metrics
        http_requests_total.labels(
            method=request.method,
            endpoint=request.url.path,
            status_code=response.status_code
        ).inc()
        
        http_request_duration_seconds.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(duration)
        
        # Log request
        log_request(request, response, duration)
        
        return response
    except Exception as e:
        duration = time.time() - start_time
        log_error(e, {
            "method": request.method,
            "path": request.url.path,
            "duration_ms": duration * 1000,
        })
        raise


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses."""
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "font-src 'self' data:; "
        "connect-src 'self'"
    )
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "geolocation=(), microphone=(), camera=()"
    )
    
    # Remove server header (optional, but good for security)
    if "server" in response.headers:
        del response.headers["server"]
    
    return response

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


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
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Get current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Get user from database
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, email, role, department, plant_id, is_active FROM users WHERE id = %s",
                (user_id,),
            )
            row = cur.fetchone()
            if row is None:
                raise credentials_exception

            # Create User object (simplified for now)
            user_dict = {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "role": row[3],
                "department": row[4],
                "plant_id": row[5],
                "is_active": row[6],
            }
            return user_dict


@app.on_event("startup")
def startup_event() -> None:
    """Initialize application on startup."""
    log_info("Application starting up")
    
    # Verify database connection
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                cur.fetchone()
        log_info("Database connection verified")
    except Exception as e:
        log_error(e, {"context": "startup", "component": "database"})
        raise
    
    # Create indexes if they don't exist
    try:
        create_indexes()
        log_info("Database indexes created/verified")
    except Exception as e:
        log_error(e, {"context": "startup", "component": "indexes"})
    
    # Analyze tables for query optimization
    try:
        analyze_tables()
        log_info("Database tables analyzed")
    except Exception as e:
        log_error(e, {"context": "startup", "component": "analyze"})


@app.on_event("shutdown")
def shutdown_event() -> None:
    """Cleanup on application shutdown."""
    log_info("Application shutting down")


# Meta endpoints
@app.get("/", tags=["meta"])
def root() -> dict[str, str]:
    return {
        "message": "Viruj Chematrix FastAPI backend is running.",
        "frontend": FRONTEND_URL,
        "docs": "/docs",
    }


@app.get("/health", tags=["meta"], response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Simple health endpoint to confirm API + DB connectivity."""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT current_user;")
                (current_user,) = cur.fetchone()
        return HealthResponse(status="ok", db_user=current_user)
    except Exception as e:
        log_error(e, {"context": "health_check"})
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )


@app.get("/metrics", tags=["meta"])
def metrics():
    """Prometheus metrics endpoint."""
    return get_metrics_response()


# Authentication endpoints
@app.post("/api/auth/login", response_model=LoginResponse, tags=["authentication"])
@limiter.limit("5/minute")  # Rate limit: 5 requests per minute
def login(request: Request, login_data: LoginRequest) -> LoginResponse:
    """Authenticate user and return JWT token."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # For demo: check if password is 'demo123' (in production, use hashed passwords)
            cur.execute(
                """
                SELECT id, name, email, role, department, plant_id, is_active 
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

            # Get hashed password from database
            cur.execute(
                "SELECT hashed_password FROM users WHERE email = %s",
                (login_data.email.lower(),),
            )
            password_row = cur.fetchone()
            
            # Demo mode: accept 'demo123' as password (for backward compatibility)
            # In production, always verify against hashed_password
            if password_row and password_row[0]:
                # Verify against hashed password
                if not verify_password(login_data.password, password_row[0]):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid email or password",
                    )
            elif login_data.password != "demo123":
                # Fallback for demo mode
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password",
                )

            user_id, name, email, role, department, plant_id, is_active = row

            # Create access token
            access_token = create_access_token(data={"sub": user_id})

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

            return LoginResponse(
                access_token=access_token,
                token_type="bearer",
                user=user_response,
            )


@app.get("/api/auth/me", response_model=UserResponse, tags=["authentication"])
def get_current_user_info(current_user: dict = Depends(get_current_user)) -> UserResponse:
    """Get current authenticated user information."""
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        department=current_user["department"],
        plant_id=current_user.get("plant_id"),
        is_active=current_user["is_active"],
        created_at=datetime.utcnow(),
    )


@app.post("/api/auth/logout", response_model=MessageResponse, tags=["authentication"])
def logout() -> MessageResponse:
    """Logout endpoint (client should remove token)."""
    return MessageResponse(message="Logged out successfully")


# Users endpoints
@app.get("/api/users", tags=["users"])
@limiter.limit("100/minute")  # Rate limit: 100 requests per minute
@cached(ttl=300, key_prefix="users")  # Cache for 5 minutes
def get_users(request: Request) -> list[dict]:
    """Get all active users."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, email, role, department, plant_id, is_active 
                FROM users 
                WHERE is_active = true
                ORDER BY role, name
                """
            )
            rows = cur.fetchall()
            return [
                {
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "role": row[3],
                    "department": row[4],
                    "plant_id": row[5],
                    "is_active": row[6],
                }
                for row in rows
            ]


@app.get("/api/users/{user_id}", tags=["users"])
@limiter.limit("100/minute")  # Rate limit: 100 requests per minute
@cached(ttl=600, key_prefix="user")  # Cache for 10 minutes
def get_user(request: Request, user_id: str) -> dict:
    """Get user by ID."""
    # Input validation: sanitize user_id
    from security_middleware import sanitize_string
    user_id = sanitize_string(user_id, max_length=50)
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, email, role, department, plant_id, is_active 
                FROM users 
                WHERE id = %s
                """,
                (user_id,),
            )
            row = cur.fetchone()
            if row is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )
            return {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "role": row[3],
                "department": row[4],
                "plant_id": row[5],
                "is_active": row[6],
            }

