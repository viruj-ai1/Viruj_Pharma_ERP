"""
Production Management Service

Handles production batches, stages, and production-related operations.
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

from schemas import BatchResponse, BatchCreate, BatchUpdate
from monitoring import log_info, log_error, setup_monitoring
from database import get_db_connection
from service_client import verify_token
from event_bus import publish_event

# Load environment
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env", override=False)

DATABASE_URL = os.getenv("DATABASE_URL")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")
SERVICE_NAME = "production-service"
SERVICE_PORT = int(os.getenv("PRODUCTION_SERVICE_PORT", "8003"))

app = FastAPI(
    title="Production Service",
    version="1.0.0",
    description="Production Management Service",
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


@app.get("/api/batches")
@limiter.limit("100/minute")
def get_batches(request, plant_id: Optional[str] = None, authorization: Optional[str] = None):
    """Get production batches."""
    get_current_user_id(authorization)
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                if plant_id:
                    cur.execute(
                        """
                        SELECT id, batch_number, product_name, status, plant_id, created_at
                        FROM production_batches
                        WHERE plant_id = %s
                        ORDER BY created_at DESC
                        """,
                        (plant_id,)
                    )
                else:
                    cur.execute(
                        """
                        SELECT id, batch_number, product_name, status, plant_id, created_at
                        FROM production_batches
                        ORDER BY created_at DESC
                        """
                    )
                rows = cur.fetchall()
                return [
                    {
                        "id": row[0],
                        "batch_number": row[1],
                        "product_name": row[2],
                        "status": row[3],
                        "plant_id": row[4],
                        "created_at": row[5].isoformat() if row[5] else None,
                    }
                    for row in rows
                ]
    except Exception as e:
        log_error(e, {"context": "get_batches"})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@app.post("/api/batches")
@limiter.limit("50/minute")
def create_batch(request, batch_data: BatchCreate, authorization: Optional[str] = None):
    """Create a new production batch."""
    user_id = get_current_user_id(authorization)
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO production_batches 
                    (id, batch_number, product_name, status, plant_id, start_date, quantity, unit, created_by)
                    VALUES (gen_random_uuid()::text, %s, %s, %s, %s, NOW(), %s, %s, %s)
                    RETURNING id, batch_number
                    """,
                    (
                        batch_data.batch_number,
                        batch_data.product_name,
                        "Planned",
                        batch_data.plant_id,
                        batch_data.quantity,
                        batch_data.unit,
                        user_id,
                    )
                )
                row = cur.fetchone()
                conn.commit()
                
                batch_id, batch_number = row
                
                # Publish event
                publish_event(
                    "batch.created",
                    {
                        "batch_id": batch_id,
                        "batch_number": batch_number,
                        "plant_id": batch_data.plant_id,
                        "created_by": user_id,
                    }
                )
                
                log_info("Batch created", {"batch_id": batch_id, "batch_number": batch_number})
                
                return {"id": batch_id, "batch_number": batch_number, "status": "Planned"}
    except Exception as e:
        log_error(e, {"context": "create_batch"})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=SERVICE_PORT)

