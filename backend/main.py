import os
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Any
from uuid import uuid4

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
from psycopg.errors import UndefinedTable
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
from security_middleware import sanitize_string

# Import models and schemas
from schemas import (
    LoginRequest,
    LoginResponse,
    UserResponse,
    UserCreate,
    MessageResponse,
    HealthResponse,
    SecurityLogCreate,
    SecurityLogResponse,
    GRNCreate,
    GRNResponse,
    GRNPendingQAResponse,
    SamplingRequest,
    SampleAssignmentRequest,
    TestCreateRequest,
    TestAssignmentRequest,
    TestResultSubmitRequest,
    TestReviewRequest,
    QaOfficerAssignRequest,
    QaOfficerReviewRequest,
    QaManagerDecisionRequest,
    WarehouseActionRequest,
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
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:5173",
    # Allow local network IPs on common ports (for development)
    "http://192.168.1.5:3000",
    "http://192.168.1.5:3002",
    "http://192.168.1.5:5173",
    "http://192.168.1.24:3000",
    "http://192.168.1.24:3002",
    "http://192.168.1.24:5173",
    # Add more common local network patterns if needed
    # Note: In production, replace with specific allowed origins
]

# Remove duplicates and filter out None/empty values
allowed_origins = list(set(filter(None, allowed_origins)))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


# Global exception handler to ensure CORS headers are added to error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler that adds CORS headers to error responses."""
    from fastapi.responses import JSONResponse
    
    # Get origin from request
    origin = request.headers.get("origin")
    if origin and origin in allowed_origins:
        cors_headers = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    else:
        cors_headers = {}
    
    # Log the error
    log_error(exc, {"path": request.url.path, "method": request.method})
    
    # Return error response with CORS headers
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=cors_headers,
        )
    else:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
            headers=cors_headers,
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

    # Ensure operational tables exist
    try:
        ensure_gate_entries_table()
        log_info("Gate entry table verified")
    except Exception as e:
        log_error(e, {"context": "startup", "component": "gate_entries_table"})

    try:
        ensure_grn_table()
        log_info("GRN table verified")
    except Exception as e:
        log_error(e, {"context": "startup", "component": "grn_table"})

    try:
        ensure_quality_samples_table()
        ensure_quality_tests_table()
        log_info("Quality samples tables verified")
    except Exception as e:
        log_error(e, {"context": "startup", "component": "quality_samples_table"})


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



def _serialize_user_with_timestamps(row: tuple) -> dict:
    return {
        'id': row[0],
        'name': row[1],
        'email': row[2],
        'role': row[3],
        'department': row[4],
        'plant_id': row[5],
        'is_active': row[6],
        'created_at': row[7],
        'updated_at': row[8],
    }

def _serialize_security_log(row: tuple) -> dict:
    return {
        "id": str(row[0]),
        "entry_code": row[1],
        "material_name": row[2],
        "material_category": row[3],
        "po_number": row[4],
        "vehicle_name": row[5],
        "vehicle_number": row[6],
        "driver_name": row[7],
        "driver_contact": row[8],
        "supplier_name": row[9],
        "document_number": row[10],
        "quantity": float(row[11]) if row[11] is not None else None,
        "uom": row[12],
        "remarks": row[13],
        "seal_intact": row[14],
        "status": row[15],
        "plant_id": row[16],
        "created_by": row[17],
        "created_by_name": row[18],
        "created_at": row[19],
    }


def _serialize_grn(row: tuple) -> dict:
    # Handle both old format (without grn_code) and new format (with grn_code)
    # New format has 27 elements (with grn_code), old format has 26
    has_grn_code = len(row) >= 27
    
    if has_grn_code:
        # New format with grn_code
        raw_items = row[23]
        grn_code = row[3] if row[3] else row[2]
        po_number_idx = 4
        delivery_challan_idx = 5
        quantity_received_idx = 6
        remarks_idx = 7
        status_idx = 8
        created_by_idx = 9
        created_by_name_idx = 10
        created_at_idx = 11
        updated_at_idx = 12
        supplier_name_idx = 13
        supplier_address_idx = 14
        supplier_location_idx = 15
        supplier_contact_idx = 16
        document_status_idx = 17
        document_date_idx = 18
        delivery_date_idx = 19
        period_idx = 20
        reference_idx = 21
        comment_idx = 22
        net_total_idx = 24
        vat_total_idx = 25
        gross_total_idx = 26
    else:
        # Old format without grn_code
        raw_items = row[22]
        grn_code = row[2]  # Use entry_code as fallback
        po_number_idx = 3
        delivery_challan_idx = 4
        quantity_received_idx = 5
        remarks_idx = 6
        status_idx = 7
        created_by_idx = 8
        created_by_name_idx = 9
        created_at_idx = 10
        updated_at_idx = 11
        supplier_name_idx = 12
        supplier_address_idx = 13
        supplier_location_idx = 14
        supplier_contact_idx = 15
        document_status_idx = 16
        document_date_idx = 17
        delivery_date_idx = 18
        period_idx = 19
        reference_idx = 20
        comment_idx = 21
        net_total_idx = 23
        vat_total_idx = 24
        gross_total_idx = 25
    
    if raw_items is None:
        items = []
    elif isinstance(raw_items, str):
        try:
            items = json.loads(raw_items)
        except json.JSONDecodeError:
            items = []
    else:
        items = raw_items

    return {
        "id": str(row[0]),
        "gate_entry_id": str(row[1]),
        "entry_code": row[2],
        "grn_code": grn_code,
        "po_number": row[po_number_idx],
        "delivery_challan": row[delivery_challan_idx],
        "quantity_received": float(row[quantity_received_idx]) if row[quantity_received_idx] is not None else None,
        "remarks": row[remarks_idx],
        "status": row[status_idx],
        "created_by": row[created_by_idx],
        "created_by_name": row[created_by_name_idx],
        "created_at": row[created_at_idx],
        "updated_at": row[updated_at_idx],
        "supplier_name": row[supplier_name_idx],
        "supplier_address": row[supplier_address_idx],
        "supplier_location": row[supplier_location_idx],
        "supplier_contact": row[supplier_contact_idx],
        "document_status": row[document_status_idx],
        "document_date": row[document_date_idx],
        "delivery_date": row[delivery_date_idx],
        "period": row[period_idx],
        "reference": row[reference_idx],
        "comment": row[comment_idx],
        "items": items,
        "net_total": float(row[net_total_idx]) if row[net_total_idx] is not None else None,
        "vat_total": float(row[vat_total_idx]) if row[vat_total_idx] is not None else None,
        "gross_total": float(row[gross_total_idx]) if row[gross_total_idx] is not None else None,
    }


def _serialize_grn_pending(row: tuple) -> dict:
    return {
        "grn_id": str(row[0]),
        "entry_code": row[1],
        "po_number": row[2],
        "delivery_challan": row[3],
        "quantity_received": float(row[4]) if row[4] is not None else None,
        "remarks": row[5],
        "status": row[6],
        "material_name": row[7],
        "vehicle_number": row[8],
        "driver_name": row[9],
        "driver_contact": row[10],
        "gate_quantity": float(row[11]) if row[11] is not None else None,
        "uom": row[12],
        "gate_created_at": row[13],
    }


def ensure_gate_entries_table() -> None:
    table_sql = """
        CREATE TABLE IF NOT EXISTS gate_entries (
            id UUID PRIMARY KEY,
            entry_code VARCHAR(16) UNIQUE NOT NULL,
            material_name VARCHAR NOT NULL,
            material_category VARCHAR,
            po_number VARCHAR,
            vehicle_name VARCHAR,
            vehicle_number VARCHAR NOT NULL,
            driver_name VARCHAR,
            driver_contact VARCHAR,
            supplier_name VARCHAR,
            document_number VARCHAR,
            quantity NUMERIC(12, 3),
            uom VARCHAR,
            remarks TEXT,
            seal_intact BOOLEAN DEFAULT true,
            status VARCHAR DEFAULT 'Awaiting GRN',
            plant_id VARCHAR,
            created_by VARCHAR,
            created_by_name VARCHAR,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_gate_entries_status ON gate_entries(status);
        CREATE INDEX IF NOT EXISTS idx_gate_entries_created_at ON gate_entries(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_gate_entries_month ON gate_entries(entry_code);
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(table_sql)
        conn.commit()


def generate_entry_code(cur, created_at: datetime) -> str:
    month_key = created_at.strftime("%m%y")
    cur.execute(
        "SELECT COUNT(*) FROM gate_entries WHERE to_char(created_at, 'MMYY') = %s",
        (month_key,),
    )
    seq = (cur.fetchone() or (0,))[0] + 1
    return f"{month_key}{seq:03d}"


def generate_grn_code(cur, created_at: datetime) -> str:
    """Generate GRN code in format GRN-YY-XXX (e.g., GRN-25-001)"""
    year_suffix = created_at.strftime("%y")
    cur.execute(
        "SELECT COUNT(*) FROM goods_receipt_notes WHERE to_char(created_at, 'YY') = %s",
        (year_suffix,),
    )
    seq = (cur.fetchone() or (0,))[0] + 1
    return f"GRN-{year_suffix}-{seq:03d}"


def ensure_grn_table() -> None:
    table_sql = """
        CREATE TABLE IF NOT EXISTS goods_receipt_notes (
            id UUID PRIMARY KEY,
            gate_entry_id UUID NOT NULL REFERENCES gate_entries(id) ON DELETE CASCADE,
            entry_code VARCHAR(16) NOT NULL,
            po_number VARCHAR NOT NULL,
            delivery_challan VARCHAR,
            quantity_received NUMERIC(12, 3),
            remarks TEXT,
            status VARCHAR DEFAULT 'Awaiting QA',
            created_by VARCHAR,
            created_by_name VARCHAR,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            supplier_name VARCHAR(150),
            supplier_address TEXT,
            supplier_location VARCHAR(150),
            supplier_contact VARCHAR(100),
            document_status VARCHAR(60) DEFAULT 'Goods Received',
            document_date DATE,
            delivery_date DATE,
            period VARCHAR(40),
            reference VARCHAR(80),
            comment TEXT,
            items JSONB,
            net_total NUMERIC(14, 2),
            vat_total NUMERIC(14, 2),
            gross_total NUMERIC(14, 2)
        );
        CREATE INDEX IF NOT EXISTS idx_grn_status ON goods_receipt_notes(status);
        CREATE INDEX IF NOT EXISTS idx_grn_entry_code ON goods_receipt_notes(entry_code);
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Create table first (without grn_code for backward compatibility)
            cur.execute(table_sql)
            
            # Check if grn_code column exists, if not add it (migration)
            try:
                cur.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='goods_receipt_notes' AND column_name='grn_code';
                """)
                if cur.fetchone() is None:
                    # Column doesn't exist, add it
                    cur.execute("ALTER TABLE goods_receipt_notes ADD COLUMN grn_code VARCHAR(20);")
                    # Populate existing rows with entry_code as fallback
                    cur.execute("""
                        UPDATE goods_receipt_notes 
                        SET grn_code = entry_code 
                        WHERE grn_code IS NULL;
                    """)
                    # Make it NOT NULL after populating
                    cur.execute("ALTER TABLE goods_receipt_notes ALTER COLUMN grn_code SET NOT NULL;")
                    # Create unique constraint
                    cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_grn_code ON goods_receipt_notes(grn_code);")
                else:
                    # Column exists, just ensure index exists
                    cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_grn_code ON goods_receipt_notes(grn_code);")
            except Exception as e:
                log_error(e, {"context": "grn_table_migration", "component": "grn_table"})
                # If migration fails, continue - the table structure is still valid
        conn.commit()


def ensure_quality_samples_table() -> None:
    """Create quality_samples table if it doesn't exist."""
    table_sql = """
        CREATE TABLE IF NOT EXISTS quality_samples (
            id UUID PRIMARY KEY,
            grn_id UUID REFERENCES goods_receipt_notes(id) ON DELETE SET NULL,
            entry_code VARCHAR(16),
            product_name VARCHAR(200) NOT NULL,
            batch_number VARCHAR(100),
            sample_type VARCHAR(50) DEFAULT 'FG',
            sample_date DATE DEFAULT CURRENT_DATE,
            due_date DATE,
            status VARCHAR(50) DEFAULT 'Pending',
            analyst_id VARCHAR(100),
            requested_by VARCHAR(100),
            requested_by_name VARCHAR(200),
            priority VARCHAR(20) DEFAULT 'Medium',
            qa_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_quality_samples_status ON quality_samples(status);
        CREATE INDEX IF NOT EXISTS idx_quality_samples_analyst ON quality_samples(analyst_id);
        CREATE INDEX IF NOT EXISTS idx_quality_samples_grn ON quality_samples(grn_id);
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(table_sql)
        conn.commit()


def ensure_quality_tests_table() -> None:
    """Create quality_tests table if it doesn't exist."""
    table_sql = """
        CREATE TABLE IF NOT EXISTS quality_tests (
            id UUID PRIMARY KEY,
            sample_id UUID NOT NULL REFERENCES quality_samples(id) ON DELETE CASCADE,
            test_name VARCHAR(200) NOT NULL,
            method VARCHAR(200),
            status VARCHAR(50) DEFAULT 'Not Started',
            assigned_to VARCHAR(100),
            instrument_id VARCHAR(100),
            submitted_on TIMESTAMP WITH TIME ZONE,
            reviewed_by VARCHAR(100),
            manager_notes TEXT,
            submitted_by VARCHAR(100),
            result_data JSONB,
            qa_officer_id UUID,
            qa_officer_notes TEXT,
            qa_officer_recommendation VARCHAR(20),
            qa_manager_decision VARCHAR(20),
            qa_manager_decision_notes TEXT,
            material_disposition VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_quality_tests_sample ON quality_tests(sample_id);
        CREATE INDEX IF NOT EXISTS idx_quality_tests_status ON quality_tests(status);
        CREATE INDEX IF NOT EXISTS idx_quality_tests_assigned ON quality_tests(assigned_to);
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(table_sql)
            # Ensure result_data column exists
            cur.execute(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='quality_tests' AND column_name='result_data';
                """
            )
            if cur.fetchone() is None:
                cur.execute("ALTER TABLE quality_tests ADD COLUMN result_data JSONB;")
            # Ensure submitted_by column exists
            cur.execute(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='quality_tests' AND column_name='submitted_by';
                """
            )
            if cur.fetchone() is None:
                cur.execute("ALTER TABLE quality_tests ADD COLUMN submitted_by VARCHAR(100);")
            # QA related columns
            cur.execute(
                """
                SELECT data_type
                FROM information_schema.columns
                WHERE table_name='quality_tests' AND column_name='qa_officer_id';
                """
            )
            column_info = cur.fetchone()
            if column_info is None:
                cur.execute("ALTER TABLE quality_tests ADD COLUMN qa_officer_id VARCHAR(100);")
            elif column_info[0] != "character varying":
                cur.execute(
                    "ALTER TABLE quality_tests ALTER COLUMN qa_officer_id TYPE VARCHAR(100) USING qa_officer_id::text;"
                )

            additional_columns = [
                ("qa_officer_notes", "TEXT"),
                ("qa_officer_recommendation", "VARCHAR(20)"),
                ("qa_manager_decision", "VARCHAR(20)"),
                ("qa_manager_decision_notes", "TEXT"),
                ("material_disposition", "VARCHAR(100)"),
                ("warehouse_action", "VARCHAR(20)"),
                ("warehouse_notes", "TEXT"),
                ("warehouse_acknowledged_at", "TIMESTAMP WITH TIME ZONE"),
            ]
            for column_name, column_type in additional_columns:
                cur.execute(
                    """
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_name='quality_tests' AND column_name=%s;
                    """,
                    (column_name,),
                )
                if cur.fetchone() is None:
                    cur.execute(f"ALTER TABLE quality_tests ADD COLUMN {column_name} {column_type};")
        conn.commit()


def notify_role(cur, role: str, title: str, message: str) -> None:
    cur.execute(
        "SELECT id FROM users WHERE role = %s AND is_active = true;",
        (role,),
    )
    for (user_id,) in cur.fetchall():
        cur.execute(
            """
            INSERT INTO notifications (id, user_id, title, message, type)
            VALUES (%s, %s, %s, %s, %s);
            """,
            (str(uuid4()), user_id, title, message, "action"),
        )


def require_role(user_role: str, allowed_roles: List[str], detail: str) -> None:
    if user_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


def _ensure_security_or_warehouse_role(user_role: str) -> None:
    allowed = {
        "Security Officer",
        "Warehouse Manager",
        "Plant Head",
        "Management",
        "System Admin",
    }
    if user_role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to security gate data.",
        )


@app.post(
    "/api/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["users"],
)
@limiter.limit("30/minute")
def create_user(request: Request, user_data: UserCreate) -> dict:
    password_bytes = user_data.password.encode("utf-8")
    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot exceed 72 bytes when encoded.",
        )

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM users WHERE email = %s", (user_data.email.lower(),))
            if cur.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A user with this email already exists.",
                )

            hashed_password = get_password_hash(user_data.password)
            user_id = str(uuid4())
            cur.execute(
                """
                INSERT INTO users (id, name, email, hashed_password, role, department, plant_id, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, true)
                RETURNING id, name, email, role, department, plant_id, is_active, created_at, updated_at;
                """,
                (
                    user_id,
                    user_data.name.strip(),
                    user_data.email.lower().strip(),
                    hashed_password,
                    user_data.role,
                    user_data.department,
                    user_data.plant_id,
                ),
            )
            row = cur.fetchone()
            conn.commit()

    invalidate_cache("users*")
    invalidate_cache("user*")
    return _serialize_user_with_timestamps(row)


# Security Gate Endpoints
@app.get(
    "/api/security/logs",
    response_model=list[SecurityLogResponse],
    tags=["security"],
)
@limiter.limit("60/minute")
def list_security_logs(
    request: Request,
    status_filter: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    _ensure_security_or_warehouse_role(current_user["role"])

    params: list = []
    where_clause = ""
    if status_filter:
        safe_status = sanitize_string(status_filter, max_length=40)
        where_clause = "WHERE status = %s"
        params.append(safe_status)

    ensure_gate_entries_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            query = f"""
                SELECT
                    id,
                    entry_code,
                    material_name,
                    material_category,
                    po_number,
                    vehicle_name,
                    vehicle_number,
                    driver_name,
                    driver_contact,
                    supplier_name,
                    document_number,
                    quantity,
                    uom,
                    remarks,
                    seal_intact,
                    status,
                    plant_id,
                    created_by,
                    created_by_name,
                    created_at
                FROM gate_entries
                {where_clause}
                ORDER BY created_at DESC
                LIMIT 200;
            """
            cur.execute(query, params)
            rows = cur.fetchall()
            return [_serialize_security_log(row) for row in rows]


@app.post(
    "/api/security/logs",
    response_model=SecurityLogResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["security"],
)
@limiter.limit("20/minute")
def create_security_log(
    request: Request,
    log_data: SecurityLogCreate,
    current_user: dict = Depends(get_current_user),
) -> dict:
    if current_user["role"] != "Security Officer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only security officers can create gate entries.",
        )

    ensure_gate_entries_table()

    log_id = str(uuid4())
    created_at = datetime.utcnow()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            entry_code = generate_entry_code(cur, created_at)
            insert_sql = """
                INSERT INTO gate_entries (
                    id,
                    entry_code,
                    material_name,
                    material_category,
                    po_number,
                    vehicle_name,
                    vehicle_number,
                    driver_name,
                    driver_contact,
                    supplier_name,
                    document_number,
                    quantity,
                    uom,
                    remarks,
                    seal_intact,
                    status,
                    plant_id,
                    created_by,
                    created_by_name,
                    created_at
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
                RETURNING
                    id,
                    entry_code,
                    material_name,
                    material_category,
                    po_number,
                    vehicle_name,
                    vehicle_number,
                    driver_name,
                    driver_contact,
                    supplier_name,
                    document_number,
                    quantity,
                    uom,
                    remarks,
                    seal_intact,
                    status,
                    plant_id,
                    created_by,
                    created_by_name,
                    created_at;
            """
            params = (
                log_id,
                entry_code,
                log_data.material_name.strip(),
                log_data.material_category,
                log_data.po_number,
                log_data.vehicle_name,
                log_data.vehicle_number,
                log_data.driver_name,
                log_data.driver_contact,
                log_data.supplier_name,
                log_data.document_number,
                log_data.quantity,
                log_data.uom,
                log_data.remarks,
                log_data.seal_intact,
                "Awaiting GRN",
                log_data.plant_id or current_user.get("plant_id"),
                current_user["id"],
                current_user["name"],
                created_at,
            )
            cur.execute(insert_sql, params)
            row = cur.fetchone()

            cur.execute(
                """
                SELECT id FROM users
                WHERE role = %s AND is_active = true;
                """,
                ("Warehouse Manager",),
            )
            for (warehouse_user_id,) in cur.fetchall():
                cur.execute(
                    """
                    INSERT INTO notifications (id, user_id, title, message, type)
                    VALUES (%s, %s, %s, %s, %s);
                    """,
                    (
                        str(uuid4()),
                        warehouse_user_id,
                        "Gate entry awaiting GRN",
                        f"{log_data.material_name} from {log_data.supplier_name or 'supplier'} \
arrived via {log_data.vehicle_number}. Create GRN referencing security log {entry_code}.",
                        "action",
                    ),
                )

            conn.commit()

    return _serialize_security_log(row)


# GRN Endpoints
@app.post(
    "/api/grn",
    response_model=GRNResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["grn"],
)
@limiter.limit("30/minute")
def create_grn(
    request: Request,
    grn_data: GRNCreate,
    current_user: dict = Depends(get_current_user),
) -> dict:
    require_role(
        current_user["role"],
        ["Warehouse Manager"],
        "Only warehouse managers can create GRNs.",
    )

    ensure_grn_table()

    grn_id = str(uuid4())
    created_at = datetime.utcnow()
    document_date = grn_data.document_date or created_at.date()
    delivery_date = grn_data.delivery_date or document_date
    document_status = grn_data.document_status or "Goods Received"

    enriched_items = []
    net_total = 0.0
    vat_total = 0.0
    for item in grn_data.items:
        qty = float(item.quantity)
        price = float(item.price)
        net = round(qty * price, 2)
        vat_rate = float(item.vat_rate or 0)
        vat_amount = round(net * (vat_rate / 100), 2)
        gross = round(net + vat_amount, 2)
        net_total += net
        vat_total += vat_amount
        enriched_items.append(
            {
                "description": item.description,
                "stock_code": item.stock_code,
                "status": item.status or "GRN",
                "quantity": qty,
                "price": price,
                "vat_rate": vat_rate,
                "net": net,
                "vat_amount": vat_amount,
                "gross": gross,
                "nominal": item.nominal,
                "account": item.account,
            }
        )

    gross_total = round(net_total + vat_total, 2)
    items_json = json.dumps(enriched_items)

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, entry_code, status, material_name, vehicle_number, supplier_name
                FROM gate_entries
                WHERE id = %s;
                """,
                (grn_data.gate_entry_id,),
            )
            gate_row = cur.fetchone()
            if gate_row is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Gate entry not found",
                )
            gate_status = gate_row[2]
            if gate_status != "Awaiting GRN":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="GRN already created for this entry",
                )

            # Generate GRN code
            grn_code = generate_grn_code(cur, created_at)

            cur.execute(
                """
                INSERT INTO goods_receipt_notes (
                    id,
                    gate_entry_id,
                    entry_code,
                    grn_code,
                    po_number,
                    delivery_challan,
                    quantity_received,
                    remarks,
                    status,
                    created_by,
                    created_by_name,
                    created_at,
                    updated_at,
                    supplier_name,
                    supplier_address,
                    supplier_location,
                    supplier_contact,
                    document_status,
                    document_date,
                    delivery_date,
                    period,
                    reference,
                    comment,
                    items,
                    net_total,
                    vat_total,
                    gross_total
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, 'Awaiting QA', %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s, %s
                )
                RETURNING
                    id,
                    gate_entry_id,
                    entry_code,
                    grn_code,
                    po_number,
                    delivery_challan,
                    quantity_received,
                    remarks,
                    status,
                    created_by,
                    created_by_name,
                    created_at,
                    updated_at,
                    supplier_name,
                    supplier_address,
                    supplier_location,
                    supplier_contact,
                    document_status,
                    document_date,
                    delivery_date,
                    period,
                    reference,
                    comment,
                    items,
                    net_total,
                    vat_total,
                    gross_total;
                """,
                (
                    grn_id,
                    grn_data.gate_entry_id,
                    gate_row[1],
                    grn_code,
                    grn_data.po_number.strip(),
                    grn_data.delivery_challan.strip() if grn_data.delivery_challan else None,
                    grn_data.quantity_received,
                    grn_data.remarks,
                    current_user["id"],
                    current_user["name"],
                    created_at,
                    created_at,
                    grn_data.supplier_name,
                    grn_data.supplier_address,
                    grn_data.supplier_location,
                    grn_data.supplier_contact,
                    document_status,
                    document_date,
                    delivery_date,
                    grn_data.period,
                    grn_data.reference,
                    grn_data.comment,
                    items_json,
                    net_total,
                    vat_total,
                    gross_total,
                ),
            )
            grn_row = cur.fetchone()

            cur.execute(
                """
                UPDATE gate_entries
                SET status = 'Awaiting QA'
                WHERE id = %s;
                """,
                (grn_data.gate_entry_id,),
            )

            notify_role(
                cur,
                "QA Manager",
                "GRN awaiting QA",
                f"Entry {gate_row[1]} ({gate_row[3]}) is ready for QA review.",
            )

            conn.commit()

    return _serialize_grn(grn_row)


@app.get(
    "/api/grn/pending-qa",
    response_model=list[GRNPendingQAResponse],
    tags=["grn"],
)
@limiter.limit("60/minute")
def get_grns_pending_qa(
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    require_role(
        current_user["role"],
        ["QA Manager"],
        "Only QA managers can view pending GRNs.",
    )

    ensure_grn_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    grn.id,
                    grn.entry_code,
                    grn.po_number,
                    grn.delivery_challan,
                    grn.quantity_received,
                    grn.remarks,
                    grn.status,
                    gate.material_name,
                    gate.vehicle_number,
                    gate.driver_name,
                    gate.driver_contact,
                    gate.quantity,
                    gate.uom,
                    gate.created_at
                FROM goods_receipt_notes grn
                JOIN gate_entries gate ON gate.id = grn.gate_entry_id
                WHERE grn.status = 'Awaiting QA'
                ORDER BY grn.created_at ASC;
                """
            )
            rows = cur.fetchall()
            return [_serialize_grn_pending(row) for row in rows]


@app.get("/api/grn", response_model=list[GRNResponse], tags=["grn"])
@limiter.limit("60/minute")
def list_grn_history(
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    allowed_roles = [
        "Warehouse Manager",
        "QA Manager",
        "QA Head",
        "QC Manager",
        "Plant Head",
        "Management",
        "System Admin",
    ]
    require_role(
        current_user["role"],
        allowed_roles,
        "You are not permitted to view GRN history.",
    )

    ensure_grn_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    id,
                    gate_entry_id,
                    entry_code,
                    grn_code,
                    po_number,
                    delivery_challan,
                    quantity_received,
                    remarks,
                    status,
                    created_by,
                    created_by_name,
                    created_at,
                    updated_at,
                    supplier_name,
                    supplier_address,
                    supplier_location,
                    supplier_contact,
                    document_status,
                    document_date,
                    delivery_date,
                    period,
                    reference,
                    comment,
                    items,
                    net_total,
                    vat_total,
                    gross_total
                FROM goods_receipt_notes
                ORDER BY created_at DESC;
                """
            )
            rows = cur.fetchall()
            return [_serialize_grn(row) for row in rows]


@app.post(
    "/api/grn/{grn_id}/request-sampling",
    response_model=GRNResponse,
    tags=["grn"],
)
@limiter.limit("30/minute")
def request_sampling(
    grn_id: str,
    sampling_request: SamplingRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    require_role(
        current_user["role"],
        ["QA Manager"],
        "Only QA managers can raise sampling requests.",
    )

    ensure_grn_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, gate_entry_id, entry_code, status, remarks
                FROM goods_receipt_notes
                WHERE id = %s;
                """,
                (grn_id,),
            )
            grn_row = cur.fetchone()
            if grn_row is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="GRN not found",
                )
            if grn_row[3] != "Awaiting QA":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="GRN already processed",
                )

            qa_notes_combined = sampling_request.qa_notes.strip() if sampling_request.qa_notes else None

            cur.execute(
                """
                UPDATE goods_receipt_notes
                SET status = 'Sampling Requested',
                    remarks = COALESCE(remarks, '') || %s,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING
                    id,
                    gate_entry_id,
                    entry_code,
                    po_number,
                    delivery_challan,
                    quantity_received,
                    remarks,
                    status,
                    created_by,
                    created_by_name,
                    created_at,
                    updated_at,
                    supplier_name,
                    supplier_address,
                    supplier_location,
                    supplier_contact,
                    document_status,
                    document_date,
                    delivery_date,
                    period,
                    reference,
                    comment,
                    items,
                    net_total,
                    vat_total,
                    gross_total;
                """,
                (
                    f"\nQA Notes: {qa_notes_combined}" if qa_notes_combined else "",
                    grn_id,
                ),
            )
            updated_row = cur.fetchone()

            cur.execute(
                """
                UPDATE gate_entries
                SET status = 'Sampling Requested'
                WHERE id = %s;
                """,
                (grn_row[1],),
            )

            # Ensure tables exist
            ensure_quality_samples_table()
            ensure_quality_tests_table()

            # Create quality sample record from GRN
            sample_id = str(uuid4())
            cur.execute(
                """
                INSERT INTO quality_samples (
                    id,
                    grn_id,
                    entry_code,
                    product_name,
                    batch_number,
                    sample_type,
                    sample_date,
                    due_date,
                    status,
                    requested_by,
                    requested_by_name,
                    priority,
                    created_at,
                    updated_at
                )
                SELECT
                    %s,
                    %s,
                    entry_code,
                    (SELECT material_name FROM gate_entries WHERE id = gate_entry_id),
                    entry_code,
                    'FG',
                    CURRENT_DATE,
                    CURRENT_DATE + INTERVAL '3 days',
                    'Pending',
                    %s,
                    %s,
                    'Medium',
                    NOW(),
                    NOW()
                FROM goods_receipt_notes
                WHERE id = %s
                RETURNING id;
                """,
                (
                    sample_id,
                    grn_id,
                    current_user["id"],
                    current_user["name"],
                    grn_id,
                ),
            )
            sample_row = cur.fetchone()

            notify_role(
                cur,
                "QC Manager",
                "Sampling request raised",
                f"Entry {grn_row[2]} requires sampling. QA has requested QC action.",
            )

            # Create default tests for the sample
            default_tests = [
                ("Assay", "HPLC"),
                ("Related Substances", "HPLC"),
                ("Water Content", "Titration"),
            ]
            for test_name, method in default_tests:
                test_id = str(uuid4())
                cur.execute(
                    """
                    INSERT INTO quality_tests (id, sample_id, test_name, method, status, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, 'Not Started', NOW(), NOW());
                    """,
                    (test_id, sample_id, test_name, method),
                )

            conn.commit()

    return _serialize_grn(updated_row)


# Quality Sample Assignment Endpoints
@app.get("/api/quality-samples/unassigned", tags=["quality"])
@limiter.limit("60/minute")
def get_unassigned_samples(
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Get unassigned quality samples for QC Manager."""
    require_role(
        current_user["role"],
        ["QC Manager"],
        "Only QC managers can view unassigned samples.",
    )

    ensure_quality_samples_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    s.id,
                    s.grn_id,
                    s.entry_code,
                    s.product_name,
                    s.batch_number,
                    s.sample_type,
                    s.sample_date,
                    s.due_date,
                    s.status,
                    s.analyst_id,
                    s.requested_by_name,
                    s.priority,
                    s.qa_notes,
                    COUNT(t.id) as test_count
                FROM quality_samples s
                LEFT JOIN quality_tests t ON s.id = t.sample_id
                WHERE s.analyst_id IS NULL
                AND s.status = 'Pending'
                GROUP BY s.id
                ORDER BY s.created_at DESC;
                """
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(row[0]),
                    "grn_id": str(row[1]) if row[1] else None,
                    "entry_code": row[2],
                    "product_name": row[3],
                    "batch_number": row[4],
                    "sample_type": row[5],
                    "sample_date": str(row[6]) if row[6] else None,
                    "due_date": str(row[7]) if row[7] else None,
                    "status": row[8],
                    "analyst_id": row[9],
                    "requested_by_name": row[10],
                    "priority": row[11],
                    "qa_notes": row[12],
                    "test_count": row[13] or 0,
                }
                for row in rows
            ]


@app.get("/api/quality-samples/assigned", tags=["quality"])
@limiter.limit("60/minute")
def get_assigned_samples(
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Get assigned quality samples for Test Assignment."""
    require_role(
        current_user["role"],
        ["QC Manager"],
        "Only QC managers can view assigned samples.",
    )

    ensure_quality_samples_table()
    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    s.id,
                    s.grn_id,
                    s.entry_code,
                    s.product_name,
                    s.batch_number,
                    s.sample_type,
                    s.sample_date,
                    s.due_date,
                    s.status,
                    s.analyst_id,
                    s.requested_by_name,
                    s.priority,
                    COUNT(t.id) as test_count
                FROM quality_samples s
                LEFT JOIN quality_tests t ON s.id = t.sample_id
                WHERE s.analyst_id IS NOT NULL
                AND s.status IN ('Pending', 'In Progress')
                GROUP BY s.id
                ORDER BY s.created_at DESC;
                """
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(row[0]),
                    "grn_id": str(row[1]) if row[1] else None,
                    "entry_code": row[2],
                    "product_name": row[3],
                    "batch_number": row[4],
                    "sample_type": row[5],
                    "sample_date": str(row[6]) if row[6] else None,
                    "due_date": str(row[7]) if row[7] else None,
                    "status": row[8],
                    "analyst_id": row[9],
                    "requested_by_name": row[10],
                    "priority": row[11],
                    "test_count": row[12] or 0,
                }
                for row in rows
            ]


@app.post("/api/quality-samples/{sample_id}/assign", tags=["quality"])
@limiter.limit("30/minute")
def assign_sample_to_analyst(
    sample_id: str,
    assignment: SampleAssignmentRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Assign a quality sample to an analyst."""
    require_role(
        current_user["role"],
        ["QC Manager"],
        "Only QC managers can assign samples.",
    )

    analyst_id = assignment.analyst_id

    ensure_quality_samples_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE quality_samples
                SET analyst_id = %s,
                    status = 'In Progress',
                    updated_at = NOW()
                WHERE id = %s
                AND analyst_id IS NULL
                RETURNING id, product_name, analyst_id, status;
                """
            ,
                (analyst_id, sample_id),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Sample not found or already assigned",
                )

            conn.commit()

            return {
                "id": str(row[0]),
                "product_name": row[1],
                "analyst_id": row[2],
                "status": row[3],
            }


@app.get("/api/quality-samples/{sample_id}/tests", tags=["quality"])
@limiter.limit("60/minute")
def get_sample_tests(
    sample_id: str,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Get tests for a quality sample."""
    require_role(
        current_user["role"],
        ["QC Manager", "QC Officer", "QC Operator"],
        "You are not permitted to view sample tests.",
    )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(
                    """
                    SELECT
                        id,
                        test_name,
                        method,
                        status,
                        assigned_to,
                        instrument_id,
                        submitted_on,
                        reviewed_by,
                        manager_notes
                    FROM quality_tests
                    WHERE sample_id = %s
                    ORDER BY created_at;
                    """
                ,
                    (sample_id,),
                )
                rows = cur.fetchall()
                return [
                    {
                        "id": str(row[0]) if row[0] else None,
                        "test_name": row[1] if row[1] else None,
                        "method": row[2] if row[2] else None,
                        "status": row[3] if row[3] else "Not Started",
                        "assigned_to": str(row[4]) if row[4] else None,
                        "instrument_id": str(row[5]) if row[5] else None,
                        "submitted_on": str(row[6]) if row[6] else None,
                        "reviewed_by": str(row[7]) if row[7] else None,
                        "manager_notes": row[8] if row[8] else None,
                    }
                    for row in rows
                ]
            except Exception as e:
                log_error(f"Error fetching sample tests: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to fetch sample tests: {str(e)}",
                )


@app.post("/api/quality-samples/{sample_id}/tests/create", tags=["quality"])
@limiter.limit("30/minute")
def create_tests_for_sample(
    sample_id: str,
    tests: list[TestCreateRequest],
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Create tests for a quality sample."""
    require_role(
        current_user["role"],
        ["QC Manager"],
        "Only QC managers can create tests.",
    )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Verify sample exists
            cur.execute("SELECT id FROM quality_samples WHERE id = %s", (sample_id,))
            if not cur.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Sample not found",
                )

            created_tests = []
            for test_data in tests:
                test_id = str(uuid4())
                test_name = test_data.test_name
                method = test_data.method or ""

                cur.execute(
                    """
                    INSERT INTO quality_tests (
                        id, sample_id, test_name, method, status, created_at, updated_at
                    )
                    VALUES (%s, %s, %s, %s, 'Not Started', NOW(), NOW())
                    RETURNING id, test_name, method, status;
                    """,
                    (test_id, sample_id, test_name, method),
                )
                row = cur.fetchone()
                if row:
                    created_tests.append({
                        "id": str(row[0]),
                        "test_name": row[1],
                        "method": row[2],
                        "status": row[3],
                    })

            conn.commit()
            return created_tests


@app.post("/api/quality-tests/{test_id}/assign", tags=["quality"])
@limiter.limit("30/minute")
def assign_test_to_employee(
    test_id: str,
    assignment: TestAssignmentRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Assign a test to an employee."""
    log_info(f"Assignment request received: test_id={test_id}, employee_id={assignment.employee_id}, user={current_user.get('name')}")
    
    require_role(
        current_user["role"],
        ["QC Manager"],
        "Only QC managers can assign tests.",
    )

    employee_id = assignment.employee_id
    log_info(f"Processing assignment: test_id={test_id}, employee_id={employee_id}")

    if not employee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID is required",
        )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # First verify the test exists
            cur.execute(
                "SELECT id, test_name, assigned_to FROM quality_tests WHERE id = %s",
                (test_id,),
            )
            test_row = cur.fetchone()
            if not test_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test not found",
                )
            
            # Verify employee exists
            log_info(f"Checking employee: {employee_id}")
            cur.execute(
                "SELECT id, name, role FROM users WHERE id = %s AND is_active = true",
                (employee_id,),
            )
            employee_row = cur.fetchone()
            if not employee_row:
                # Try to find similar IDs for debugging
                cur.execute("SELECT id, name FROM users WHERE is_active = true LIMIT 10")
                sample_users = cur.fetchall()
                log_error(f"Employee {employee_id} not found. Sample user IDs: {[str(u[0]) for u in sample_users]}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Employee not found or inactive. ID: {employee_id}",
                )
            log_info(f"Employee found: {employee_row[1]} ({employee_row[0]}) - Role: {employee_row[2]}")

            # Update the test assignment
            cur.execute(
                """
                UPDATE quality_tests
                SET assigned_to = %s,
                    status = 'In Progress',
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, test_name, assigned_to, status;
                """
            ,
                (employee_id, test_id),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update test assignment",
                )

            conn.commit()
            
            # Verify the update was successful
            cur.execute(
                "SELECT assigned_to, status FROM quality_tests WHERE id = %s",
                (test_id,),
            )
            verify_row = cur.fetchone()
            # Verify assignment - handle UUID comparison
            verify_assigned_to = str(verify_row[0]) if verify_row[0] else None
            employee_id_str = str(employee_id)
            
            if not verify_row or verify_assigned_to != employee_id_str:
                log_error(f"Assignment verification failed: expected {employee_id_str}, got {verify_assigned_to}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Assignment verification failed. Expected {employee_id_str}, got {verify_assigned_to}",
                )
            
            log_info(f"✓ Test {test_id} ({row[1]}) successfully assigned to employee {employee_id} ({employee_row[1]}) by {current_user['name']}")

            response_data = {
                "id": str(row[0]),
                "test_name": row[1],
                "assigned_to": str(row[2]) if row[2] else None,
                "status": row[3],
            }
            log_info(f"Returning response: {response_data}")
            return response_data


@app.post("/api/quality-tests/{test_id}/start", tags=["quality"])
@limiter.limit("30/minute")
def start_test(
    test_id: str,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Start a test (update status to In Progress)."""
    require_role(
        current_user["role"],
        ["QC Operator", "QC Manager"],
        "You are not permitted to start tests.",
    )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Verify the test exists and is assigned to the current user
            cur.execute(
                """
                SELECT id, test_name, assigned_to, status 
                FROM quality_tests 
                WHERE id = %s
                """,
                (test_id,),
            )
            test_row = cur.fetchone()
            if not test_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test not found",
                )
            
            # Check if test is assigned to current user
            assigned_to = str(test_row[2]) if test_row[2] else None
            if assigned_to != current_user["id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only start tests assigned to you.",
                )
            
            # Only allow starting if status is Not Started or Pending
            current_status = test_row[3]
            if current_status not in ["Not Started", "Pending"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot start test with status: {current_status}",
                )

            # Update the test status to In Progress
            cur.execute(
                """
                UPDATE quality_tests
                SET status = 'In Progress',
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, test_name, assigned_to, status;
                """,
                (test_id,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update test status",
                )

            conn.commit()
            
            log_info(f"Test {test_id} ({row[1]}) started by {current_user['name']}")

            return {
                "id": str(row[0]),
                "test_name": row[1],
                "assigned_to": str(row[2]) if row[2] else None,
                "status": row[3],
            }


@app.post("/api/quality-tests/{test_id}/submit", tags=["quality"])
@limiter.limit("30/minute")
def submit_test_result(
    test_id: str,
    submission: TestResultSubmitRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Submit a completed test for manager review."""
    require_role(
        current_user["role"],
        ["QC Operator", "QC Manager"],
        "You are not permitted to submit test results.",
    )

    ensure_quality_tests_table()

    result_payload = submission.result_data or {}
    if submission.analyst_notes:
        result_payload = {
            **result_payload,
            "analyst_notes": submission.analyst_notes,
        }

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT assigned_to, status, test_name
                FROM quality_tests
                WHERE id = %s
                """,
                (test_id,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test not found",
                )

            assigned_to = str(row[0]) if row[0] else None
            current_status = row[1]
            test_name = row[2]

            # Operators can only submit their assigned tests
            if current_user["role"] == "QC Operator":
                if not assigned_to or assigned_to != current_user["id"]:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You can only submit tests assigned to you.",
                    )

            if current_status not in ["In Progress"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot submit test with status '{current_status}'. Start the test before submitting.",
                )

            cur.execute(
                """
                UPDATE quality_tests
                SET status = 'Submitted for Review',
                    result_data = %s,
                    submitted_on = NOW(),
                    submitted_by = %s,
                    reviewed_by = NULL,
                    manager_notes = NULL,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, test_name, status, submitted_on;
                """,
                (
                    json.dumps(result_payload),
                    current_user["id"],
                    test_id,
                ),
            )
            updated_row = cur.fetchone()
            if not updated_row:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to submit test result",
                )

            notify_role(
                cur,
                "QC Manager",
                "Test ready for review",
                f"{test_name} has been submitted for review.",
            )

            conn.commit()

            return {
                "id": str(updated_row[0]),
                "test_name": updated_row[1],
                "status": updated_row[2],
                "submitted_on": str(updated_row[3]) if updated_row[3] else None,
            }


@app.get("/api/quality-tests/my-tests", tags=["quality"])
@limiter.limit("60/minute")
def get_my_tests(
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Get tests assigned to the current user (QC Operator)."""
    require_role(
        current_user["role"],
        ["QC Operator", "QC Manager"],
        "You are not permitted to view assigned tests.",
    )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    t.id,
                    t.test_name,
                    t.method,
                    t.status,
                    t.assigned_to,
                    t.instrument_id,
                    t.submitted_on,
                    t.reviewed_by,
                    t.manager_notes,
                        t.result_data,
                    t.created_at,
                    t.updated_at,
                    s.id as sample_id,
                    s.entry_code,
                    s.product_name,
                    s.batch_number,
                    s.sample_type,
                    s.sample_date,
                    s.due_date,
                    s.status as sample_status,
                    s.priority
                FROM quality_tests t
                INNER JOIN quality_samples s ON t.sample_id = s.id
                WHERE t.assigned_to = %s
                ORDER BY s.due_date ASC, t.created_at ASC;
                """
            ,
                (current_user["id"],),
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(row[0]),
                    "test_name": row[1],
                    "method": row[2] or None,
                    "status": row[3],
                    "assigned_to": str(row[4]) if row[4] else None,
                    "instrument_id": str(row[5]) if row[5] else None,
                    "submitted_on": str(row[6]) if row[6] else None,
                    "reviewed_by": str(row[7]) if row[7] else None,
                    "manager_notes": row[8],
                        "result_data": row[9],
                        "created_at": str(row[10]),
                        "updated_at": str(row[11]),
                    "sample": {
                            "id": str(row[12]),
                            "entry_code": row[13],
                            "product_name": row[14],
                            "batch_number": row[15],
                            "sample_type": row[16],
                            "sample_date": str(row[17]) if row[17] else None,
                            "due_date": str(row[18]) if row[18] else None,
                            "status": row[19],
                            "priority": row[20],
                    },
                }
                for row in rows
            ]


@app.get("/api/quality-tests/review", tags=["quality"])
@limiter.limit("60/minute")
def get_tests_for_review(
    status: str = "pending",
    stage: str = "qc",
    request: Request = None,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Retrieve tests that need review."""
    if status not in {"pending", "reviewed"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status filter. Use 'pending' or 'reviewed'.",
        )

    stage = stage.lower()

    ensure_quality_tests_table()
    ensure_quality_samples_table()

    statuses: list[str]
    additional_filters: list[str] = []
    filter_params: list[Any] = []

    if stage == "qc":
        require_role(
            current_user["role"],
            ["QC Manager"],
            "Only QC managers can review tests.",
        )
        if status == "pending":
            statuses = ["Submitted for Review"]
        else:
            statuses = ["Approved", "Rejected", "Returned for Correction", "Submitted to QA Manager"]
    elif stage == "qa-manager":
        require_role(
            current_user["role"],
            ["QA Manager", "QA Head"],
            "Only QA managers or QA heads can perform this action.",
        )
        if status == "pending":
            statuses = ["Submitted to QA Manager", "QA Officer Review", "QA Recommendation Submitted"]
        else:
            statuses = ["Accepted - Warehouse", "Rejected - Return to Supplier"]
    elif stage == "qa-officer":
        require_role(
            current_user["role"],
            ["QA Operator"],
            "Only QA officers can view these tests.",
        )
        statuses = ["QA Officer Review"] if status == "pending" else ["QA Recommendation Submitted"]
        additional_filters.append("t.qa_officer_id = %s")
        filter_params.append(current_user["id"])
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stage. Use 'qc', 'qa-manager', or 'qa-officer'.",
        )

    where_clause = "t.status = ANY(%s)"
    params: list[Any] = [statuses]
    if additional_filters:
        where_clause += " AND " + " AND ".join(additional_filters)
        params.extend(filter_params)

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                SELECT
                    t.id,
                    t.test_name,
                    t.method,
                    t.status,
                    t.submitted_on,
                    t.result_data,
                    t.manager_notes,
                    t.reviewed_by,
                    t.assigned_to,
                    s.id,
                    s.entry_code,
                    s.product_name,
                    s.batch_number,
                    s.sample_type,
                    s.sample_date,
                    s.due_date,
                    s.priority,
                    analyst.name as analyst_name,
                    reviewer.name as reviewer_name,
                    t.qa_officer_id,
                    qa_officer.name as qa_officer_name,
                    t.qa_officer_notes,
                    t.qa_officer_recommendation,
                    t.qa_manager_decision,
                    t.qa_manager_decision_notes,
                    t.material_disposition
                FROM quality_tests t
                INNER JOIN quality_samples s ON t.sample_id = s.id
                LEFT JOIN users analyst ON t.assigned_to = analyst.id
                LEFT JOIN users reviewer ON t.reviewed_by = reviewer.id
                LEFT JOIN users qa_officer ON t.qa_officer_id = qa_officer.id
                WHERE {where_clause}
                ORDER BY t.submitted_on DESC NULLS LAST, t.updated_at DESC;
                """,
                tuple(params),
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(row[0]),
                    "test_name": row[1],
                    "method": row[2],
                    "status": row[3],
                    "submitted_on": str(row[4]) if row[4] else None,
                    "result_data": row[5],
                    "manager_notes": row[6],
                    "reviewed_by": str(row[7]) if row[7] else None,
                    "assigned_to": str(row[8]) if row[8] else None,
                    "sample": {
                        "id": str(row[9]),
                        "entry_code": row[10],
                        "product_name": row[11],
                        "batch_number": row[12],
                        "sample_type": row[13],
                        "sample_date": str(row[14]) if row[14] else None,
                        "due_date": str(row[15]) if row[15] else None,
                        "priority": row[16],
                    },
                    "analyst": {
                        "id": str(row[8]) if row[8] else None,
                        "name": row[17],
                    },
                    "reviewer_name": row[18],
                    "qa_officer": {
                        "id": str(row[19]) if row[19] else None,
                        "name": row[20],
                    },
                    "qa_officer_notes": row[21],
                    "qa_officer_recommendation": row[22],
                    "qa_manager_decision": row[23],
                    "qa_manager_decision_notes": row[24],
                    "material_disposition": row[25],
                }
                for row in rows
            ]


@app.post("/api/quality-tests/{test_id}/review", tags=["quality"])
@limiter.limit("30/minute")
def review_test_result(
    test_id: str,
    review: TestReviewRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Process a submitted test."""
    require_role(
        current_user["role"],
        ["QC Manager"],
        "Only QC managers can review tests.",
    )

    ensure_quality_tests_table()

    status_map = {
        "Approve": "Approved",
        "Reject": "Rejected",
        "Return": "Returned for Correction",
        "SendToQA": "Submitted to QA Manager",
    }

    if review.action not in status_map:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported review action.",
        )

    new_status = status_map[review.action]

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE quality_tests
                SET status = %s,
                    reviewed_by = %s,
                    manager_notes = %s,
                    updated_at = NOW()
                WHERE id = %s
                AND status = 'Submitted for Review'
                RETURNING id, test_name, status, submitted_on;
                """,
                (
                    new_status,
                    current_user["id"],
                    review.manager_notes,
                    test_id,
                ),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Test not found or not pending review.",
                )

            conn.commit()

            return {
                "id": str(row[0]),
                "test_name": row[1],
                "status": row[2],
                "submitted_on": str(row[3]) if row[3] else None,
            }


@app.post("/api/quality-tests/{test_id}/qa-assign", tags=["quality"])
@limiter.limit("30/minute")
def assign_qa_officer_to_test(
    test_id: str,
    assignment: QaOfficerAssignRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Assign a QA officer to review a test."""
    require_role(
        current_user["role"],
        ["QA Manager"],
        "Only QA managers can assign QA officers.",
    )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, role FROM users WHERE id = %s AND is_active = true",
                (assignment.officer_id,),
            )
            officer_row = cur.fetchone()
            if not officer_row or "QA Operator" not in (officer_row[1] or ""):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="QA officer not found or inactive.",
                )

            cur.execute(
                """
                UPDATE quality_tests
                SET qa_officer_id = %s,
                    qa_officer_notes = %s,
                    status = 'QA Officer Review',
                    updated_at = NOW()
                WHERE id = %s
                AND status IN ('Submitted to QA Manager', 'QA Recommendation Submitted')
                RETURNING id, test_name, status;
                """,
                (
                    assignment.officer_id,
                    assignment.notes,
                    test_id,
                ),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Test not found or not eligible for QA assignment.",
                )

            conn.commit()

            return {
                "id": str(row[0]),
                "test_name": row[1],
                "status": row[2],
            }


@app.post("/api/quality-tests/{test_id}/qa-officer-review", tags=["quality"])
@limiter.limit("30/minute")
def qa_officer_review_test(
    test_id: str,
    review: QaOfficerReviewRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """QA officer submits a recommendation."""
    require_role(
        current_user["role"],
        ["QA Operator"],
        "Only QA officers can submit recommendations.",
    )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT qa_officer_id, status FROM quality_tests WHERE id = %s",
                (test_id,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test not found.",
                )

            qa_officer_id, status_value = row
            if str(qa_officer_id) != current_user["id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not assigned to this test.",
                )

            if status_value != "QA Officer Review":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This test is not awaiting QA officer review.",
                )

            cur.execute(
                """
                UPDATE quality_tests
                SET qa_officer_recommendation = %s,
                    qa_officer_notes = %s,
                    status = 'QA Recommendation Submitted',
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, test_name, status;
                """,
                (
                    review.recommendation,
                    review.notes,
                    test_id,
                ),
            )
            updated = cur.fetchone()
            notify_role(
                cur,
                "QA Manager",
                "QA recommendation submitted",
                f"{updated[1]} now has a QA officer recommendation awaiting your decision.",
            )
            conn.commit()
            return {
                "id": str(updated[0]),
                "test_name": updated[1],
                "status": updated[2],
            }


@app.post("/api/quality-tests/{test_id}/qa-manager-decision", tags=["quality"])
@limiter.limit("30/minute")
def qa_manager_decision(
    test_id: str,
    decision: QaManagerDecisionRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """QA manager final decision."""
    require_role(
        current_user["role"],
        ["QA Manager"],
        "Only QA managers can finalize QA review.",
    )

    ensure_quality_tests_table()
    ensure_quality_samples_table()

    new_status = (
        "Accepted - Warehouse" if decision.decision == "Approve" else "Rejected - Return to Supplier"
    )
    material_disposition = (
        "Dispensed to Warehouse" if decision.decision == "Approve" else "Return to Supplier"
    )
    sample_status = "Passed" if decision.decision == "Approve" else "Failed"

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT sample_id, status FROM quality_tests WHERE id = %s",
                (test_id,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test not found.",
                )
            sample_id, current_status = row
            if current_status != "QA Recommendation Submitted":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Await QA officer recommendation before taking a final decision.",
                )

            cur.execute(
                """
                UPDATE quality_tests
                SET status = %s,
                    qa_manager_decision = %s,
                    qa_manager_decision_notes = %s,
                    material_disposition = %s,
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, test_name, status;
                """,
                (
                    new_status,
                    decision.decision,
                    decision.notes,
                    material_disposition,
                    test_id,
                ),
            )
            test_row = cur.fetchone()

            notify_role(
                cur,
                "Warehouse Manager",
                "Material disposition decided",
                f"{test_row[1]}: QA manager {decision.decision.lower()}ed the lot ({material_disposition}).",
            )

            if sample_id:
                cur.execute(
                    """
                    UPDATE quality_samples
                    SET status = %s,
                        updated_at = NOW()
                    WHERE id = %s;
                    """,
                    (sample_status, sample_id),
                )

            cur.execute(
                "SELECT id FROM users WHERE role = %s AND is_active = true;",
                ("Warehouse Manager",),
            )
            warehouse_managers = cur.fetchall()
            for (manager_id,) in warehouse_managers:
                cur.execute(
                    """
                    INSERT INTO tasks (id, title, description, status, priority, assigned_to, assigned_by, due_date, component)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW() + INTERVAL '1 day', %s);
                    """,
                    (
                        str(uuid4()),
                        f"{decision.decision} material - {test_row[1]}",
                        f"{test_row[1]} for sample {sample_id or '-'} requires warehouse action ({material_disposition}).",
                        "Pending",
                        "High",
                        manager_id,
                        current_user["id"],
                        "qa_manager_decision",
                    ),
                )

            conn.commit()

            return {
                "id": str(test_row[0]),
                "test_name": test_row[1],
                "status": test_row[2],
            }

@app.get("/api/quality-tests/warehouse-decisions", tags=["quality"])
@limiter.limit("30/minute")
def get_warehouse_decisions(
    status: str = "pending",
    request: Request = None,
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Fetch QA decisions awaiting warehouse acknowledgement."""
    require_role(
        current_user["role"],
        ["Warehouse Manager"],
        "Only warehouse managers can view these decisions.",
    )

    if status not in {"pending", "completed"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status filter. Use 'pending' or 'completed'.",
        )

    ensure_quality_tests_table()
    ensure_quality_samples_table()

    action_filter = "t.warehouse_action IS NULL" if status == "pending" else "t.warehouse_action IS NOT NULL"

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                SELECT
                    t.id,
                    t.test_name,
                    t.status,
                    t.material_disposition,
                    t.qa_manager_decision,
                    t.qa_manager_decision_notes,
                    t.qa_officer_notes,
                    t.qa_officer_recommendation,
                    t.warehouse_action,
                    t.warehouse_notes,
                    t.warehouse_acknowledged_at,
                    s.id,
                    s.entry_code,
                    s.product_name,
                    s.batch_number,
                    s.sample_type,
                    s.sample_date,
                    s.due_date,
                    s.priority,
                    analyst.name as analyst_name
                FROM quality_tests t
                INNER JOIN quality_samples s ON t.sample_id = s.id
                LEFT JOIN users analyst ON t.assigned_to = analyst.id
                WHERE t.status = ANY(%s)
                AND {action_filter}
                ORDER BY t.updated_at DESC;
                """,
                (
                    [
                        "Accepted - Warehouse",
                        "Rejected - Return to Supplier",
                    ],
                ),
            )
            rows = cur.fetchall()
            return [
                {
                    "id": str(row[0]),
                    "test_name": row[1],
                    "status": row[2],
                    "material_disposition": row[3],
                    "qa_manager_decision": row[4],
                    "qa_manager_decision_notes": row[5],
                    "qa_officer_notes": row[6],
                    "qa_officer_recommendation": row[7],
                    "warehouse_action": row[8],
                    "warehouse_notes": row[9],
                    "warehouse_acknowledged_at": str(row[10]) if row[10] else None,
                    "sample": {
                        "id": str(row[11]),
                        "entry_code": row[12],
                        "product_name": row[13],
                        "batch_number": row[14],
                        "sample_type": row[15],
                        "sample_date": str(row[16]) if row[16] else None,
                        "due_date": str(row[17]) if row[17] else None,
                        "priority": row[18],
                    },
                    "analyst": {
                        "id": None,
                        "name": row[19],
                    },
                }
                for row in rows
            ]


@app.post("/api/quality-tests/{test_id}/warehouse-action", tags=["quality"])
@limiter.limit("30/minute")
def record_warehouse_action(
    test_id: str,
    action: WarehouseActionRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Warehouse manager acknowledges QA disposition."""
    require_role(
        current_user["role"],
        ["Warehouse Manager"],
        "Only warehouse managers can perform this action.",
    )

    ensure_quality_tests_table()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT status, warehouse_action
                FROM quality_tests
                WHERE id = %s;
                """,
                (test_id,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Test not found.",
                )

            current_status, current_action = row
            if current_status not in {"Accepted - Warehouse", "Rejected - Return to Supplier"}:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This test is not awaiting warehouse action.",
                )

            if current_action:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Warehouse action already recorded.",
                )

            cur.execute(
                """
                UPDATE quality_tests
                SET warehouse_action = %s,
                    warehouse_notes = %s,
                    warehouse_acknowledged_at = NOW(),
                    updated_at = NOW()
                WHERE id = %s
                RETURNING id, test_name, warehouse_action, warehouse_notes;
                """,
                (
                    action.action,
                    action.notes,
                    test_id,
                ),
            )
            updated = cur.fetchone()
        conn.commit()

    return {
        "id": str(updated[0]),
        "test_name": updated[1],
        "warehouse_action": updated[2],
        "warehouse_notes": updated[3],
    }
