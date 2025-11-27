# Technical Deep Dive - Critical Enhancement Areas

This document provides detailed technical specifications for the most critical enhancement areas identified in the Future Enhancements roadmap.

## 1. Microservices Architecture - Detailed Design

### 1.1 Service Boundaries

#### Authentication & Authorization Service
**Responsibilities**:
- User authentication (login, logout, token management)
- JWT token generation and validation
- OAuth2/OIDC integration
- MFA management
- Session management
- Password management (reset, change)

**Technology Stack**:
- FastAPI (Python)
- PostgreSQL (user data)
- Redis (session storage, token blacklist)
- JWT library (python-jose)

**API Endpoints**:
```
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/verify-token
GET    /auth/me
POST   /auth/mfa/enable
POST   /auth/mfa/verify
```

**Data Model**:
```sql
CREATE TABLE auth_sessions (
    id UUID PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    token_hash VARCHAR NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    revoked_at TIMESTAMP
);

CREATE TABLE mfa_devices (
    id UUID PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    type VARCHAR NOT NULL, -- 'totp', 'sms', 'hardware'
    secret VARCHAR,
    phone_number VARCHAR,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Production Management Service
**Responsibilities**:
- Batch creation and management
- Production stage tracking
- Equipment assignment
- Production metrics
- BMR (Batch Manufacturing Record) management

**Technology Stack**:
- FastAPI (Python)
- PostgreSQL (batch data)
- TimescaleDB (time-series metrics)
- Redis (caching)

**API Endpoints**:
```
GET    /api/v1/batches
POST   /api/v1/batches
GET    /api/v1/batches/{id}
PUT    /api/v1/batches/{id}
POST   /api/v1/batches/{id}/stages
GET    /api/v1/batches/{id}/metrics
POST   /api/v1/batches/{id}/complete
```

**Data Model**:
```sql
CREATE TABLE production_batches (
    id UUID PRIMARY KEY,
    batch_number VARCHAR UNIQUE NOT NULL,
    product_id VARCHAR NOT NULL,
    plant_id VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR NOT NULL,
    created_by VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE batch_stages (
    id UUID PRIMARY KEY,
    batch_id UUID NOT NULL REFERENCES production_batches(id),
    stage_name VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    officer_id VARCHAR,
    notes TEXT
);

-- TimescaleDB hypertable for metrics
CREATE TABLE batch_metrics (
    time TIMESTAMPTZ NOT NULL,
    batch_id UUID NOT NULL,
    metric_name VARCHAR NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL
);
SELECT create_hypertable('batch_metrics', 'time');
```

#### Quality Assurance Service
**Responsibilities**:
- Deviation management
- CAPA (Corrective and Preventive Action)
- Change control
- Audit management
- Document review and approval

**Technology Stack**:
- FastAPI (Python)
- PostgreSQL (QA data)
- Document storage (S3/Azure Blob)

**API Endpoints**:
```
GET    /api/v1/deviations
POST   /api/v1/deviations
GET    /api/v1/deviations/{id}
PUT    /api/v1/deviations/{id}
POST   /api/v1/deviations/{id}/investigate
POST   /api/v1/deviations/{id}/close
GET    /api/v1/capas
POST   /api/v1/capas
GET    /api/v1/change-controls
POST   /api/v1/change-controls
```

### 1.2 Inter-Service Communication

#### Synchronous Communication (REST)
- Use for request-response patterns
- Implement circuit breakers (Resilience4j, Hystrix)
- Timeout configuration: 5 seconds default
- Retry logic with exponential backoff

#### Asynchronous Communication (Message Queue)
**Technology**: Apache Kafka or RabbitMQ

**Event Types**:
```python
# Event schema
{
    "event_type": "batch.status.changed",
    "event_id": "uuid",
    "timestamp": "2024-01-01T00:00:00Z",
    "source_service": "production-service",
    "data": {
        "batch_id": "uuid",
        "old_status": "In Progress",
        "new_status": "QA Hold",
        "changed_by": "user_id"
    }
}
```

**Event Topics**:
- `batch.events` - Batch lifecycle events
- `quality.events` - Quality-related events
- `inventory.events` - Inventory changes
- `notification.events` - Notification triggers
- `audit.events` - Audit trail events

### 1.3 API Gateway

**Technology**: Kong or AWS API Gateway

**Features**:
- Request routing
- Authentication/authorization
- Rate limiting
- Request/response transformation
- API versioning
- Monitoring and analytics

**Configuration Example**:
```yaml
services:
  - name: production-service
    url: http://production-service:8000
    routes:
      - name: production-routes
        paths:
          - /api/v1/batches
        methods:
          - GET
          - POST
        plugins:
          - name: rate-limiting
            config:
              minute: 100
          - name: jwt
            config:
              secret_is_base64: false
```

---

## 2. Database Optimization - Detailed Strategy

### 2.1 Indexing Strategy

#### Critical Indexes
```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_plant_id ON users(plant_id);
CREATE INDEX idx_users_role ON users(role);

-- Production batches
CREATE INDEX idx_batches_batch_number ON production_batches(batch_number);
CREATE INDEX idx_batches_plant_id ON production_batches(plant_id);
CREATE INDEX idx_batches_status ON production_batches(status);
CREATE INDEX idx_batches_created_at ON production_batches(created_at);
CREATE INDEX idx_batches_assigned_to ON production_batches(assigned_to);

-- Composite indexes for common queries
CREATE INDEX idx_batches_plant_status ON production_batches(plant_id, status);
CREATE INDEX idx_batches_plant_date ON production_batches(plant_id, created_at DESC);

-- Partial indexes for active records
CREATE INDEX idx_batches_active ON production_batches(plant_id, status)
WHERE status IN ('In Progress', 'Planned');
```

### 2.2 Partitioning Strategy

#### Time-Based Partitioning
```sql
-- Partition batches by year
CREATE TABLE production_batches_2024 PARTITION OF production_batches
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE production_batches_2025 PARTITION OF production_batches
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

#### Hash Partitioning for High-Volume Tables
```sql
-- Partition notifications by user_id hash
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    ...
) PARTITION BY HASH (user_id);

CREATE TABLE notifications_0 PARTITION OF notifications
FOR VALUES WITH (modulus 4, remainder 0);
-- ... create partitions 1, 2, 3
```

### 2.3 Query Optimization

#### Materialized Views
```sql
-- Daily production summary
CREATE MATERIALIZED VIEW daily_production_summary AS
SELECT
    DATE(created_at) as date,
    plant_id,
    COUNT(*) as batch_count,
    SUM(quantity) as total_quantity,
    AVG(final_yield) as avg_yield
FROM production_batches
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), plant_id;

CREATE UNIQUE INDEX ON daily_production_summary (date, plant_id);

-- Refresh strategy
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_production_summary;
```

#### Query Performance Monitoring
```sql
-- Enable query logging
SET log_min_duration_statement = 1000; -- Log queries > 1 second

-- Query analysis
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;
```

---

## 3. Caching Strategy - Detailed Implementation

### 3.1 Cache Layers

#### Layer 1: Browser Cache
```typescript
// Service Worker for offline caching
// Cache static assets, API responses
const CACHE_NAME = 'viruj-erp-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/api/v1/plants', // Cache plant list
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

#### Layer 2: CDN Cache
- Static assets: CSS, JS, images
- Cache-Control headers: `max-age=31536000, immutable`
- API responses (GET only): `max-age=300` (5 minutes)

#### Layer 3: Application Cache (Redis)
```python
# Cache decorator
from functools import wraps
import redis
import json
import hashlib

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(ttl=300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            key = f"{func.__name__}:{hashlib.md5(json.dumps(kwargs).encode()).hexdigest()}"
            
            # Try to get from cache
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Store in cache
            redis_client.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator

# Usage
@cache_result(ttl=600)  # 10 minutes
async def get_user_batches(user_id: str):
    # Database query
    pass
```

### 3.2 Cache Invalidation Strategy

#### Event-Driven Invalidation
```python
# When batch status changes, invalidate related caches
async def update_batch_status(batch_id: str, new_status: str):
    # Update database
    await db.update_batch_status(batch_id, new_status)
    
    # Invalidate caches
    cache_keys = [
        f"batch:{batch_id}",
        f"user_batches:{user_id}",
        f"plant_batches:{plant_id}",
        "dashboard:production_summary"
    ]
    for key in cache_keys:
        redis_client.delete(key)
    
    # Publish event
    await publish_event("batch.status.changed", {
        "batch_id": batch_id,
        "new_status": new_status
    })
```

---

## 4. Security Implementation - Detailed Specifications

### 4.1 JWT Token Structure

```python
# Token payload
{
    "sub": "user_id",
    "email": "user@example.com",
    "role": "Production Manager",
    "department": "Production",
    "plant_id": "plant-a",
    "permissions": ["batch.create", "batch.update", "batch.view"],
    "iat": 1234567890,
    "exp": 1234567890 + (30 * 24 * 60 * 60),  # 30 days
    "jti": "token_id"  # For token revocation
}
```

### 4.2 Role-Based Access Control (RBAC)

#### Permission Model
```python
# Permission definitions
PERMISSIONS = {
    "batch": {
        "create": "Create new production batches",
        "read": "View production batches",
        "update": "Update production batches",
        "delete": "Delete production batches",
        "approve": "Approve production batches"
    },
    "quality": {
        "deviation.create": "Create deviations",
        "deviation.investigate": "Investigate deviations",
        "deviation.approve": "Approve deviation closures"
    },
    # ... more permissions
}

# Role definitions
ROLES = {
    "Production Manager": [
        "batch.create",
        "batch.read",
        "batch.update",
        "material.request"
    ],
    "QA Head": [
        "batch.read",
        "quality.deviation.create",
        "quality.deviation.investigate",
        "quality.deviation.approve",
        "quality.capa.create",
        "quality.capa.approve"
    ],
    # ... more roles
}
```

#### Permission Check Middleware
```python
from fastapi import HTTPException, status

def require_permission(permission: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            user_permissions = get_user_permissions(current_user)
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission '{permission}' required"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage
@require_permission("batch.create")
async def create_batch(batch_data: BatchCreate, current_user: User):
    # Create batch
    pass
```

### 4.3 Audit Trail Implementation

#### Audit Log Schema
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR NOT NULL,
    entity_type VARCHAR NOT NULL,
    entity_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    action VARCHAR NOT NULL, -- 'create', 'update', 'delete', 'view'
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id, timestamp);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
```

#### Audit Logging Decorator
```python
from functools import wraps
import json

async def log_audit_event(
    event_type: str,
    entity_type: str,
    entity_id: str,
    user_id: str,
    action: str,
    old_values: dict = None,
    new_values: dict = None,
    metadata: dict = None
):
    await db.execute("""
        INSERT INTO audit_logs 
        (event_type, entity_type, entity_id, user_id, action, old_values, new_values, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    """, event_type, entity_type, entity_id, user_id, action,
        json.dumps(old_values) if old_values else None,
        json.dumps(new_values) if new_values else None,
        json.dumps(metadata) if metadata else None
    )

def audit_log(entity_type: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User, **kwargs):
            # Get old values before update
            old_values = None
            if 'id' in kwargs:
                old_entity = await get_entity(entity_type, kwargs['id'])
                old_values = old_entity.dict() if old_entity else None
            
            # Execute function
            result = await func(*args, current_user=current_user, **kwargs)
            
            # Get new values after update
            new_values = result.dict() if hasattr(result, 'dict') else None
            
            # Log audit event
            await log_audit_event(
                event_type=f"{entity_type}.{func.__name__}",
                entity_type=entity_type,
                entity_id=result.id if hasattr(result, 'id') else kwargs.get('id'),
                user_id=current_user.id,
                action=func.__name__,
                old_values=old_values,
                new_values=new_values
            )
            
            return result
        return wrapper
    return decorator
```

---

## 5. Performance Optimization - Specific Techniques

### 5.1 Database Connection Pooling

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,  # Number of connections to maintain
    max_overflow=10,  # Additional connections beyond pool_size
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,  # Recycle connections after 1 hour
    echo=False
)
```

### 5.2 Async Database Operations

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Async engine
async_engine = create_async_engine(
    DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://'),
    pool_size=20,
    max_overflow=10
)

AsyncSessionLocal = sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Usage
async def get_batches(plant_id: str):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(ProductionBatch).where(ProductionBatch.plant_id == plant_id)
        )
        return result.scalars().all()
```

### 5.3 Query Optimization Techniques

#### Eager Loading
```python
from sqlalchemy.orm import joinedload

# Avoid N+1 queries
batches = await session.execute(
    select(ProductionBatch)
    .options(joinedload(ProductionBatch.plant))
    .options(joinedload(ProductionBatch.assigned_user))
    .where(ProductionBatch.status == 'In Progress')
)
```

#### Batch Operations
```python
# Instead of individual inserts
async def create_batches(batch_data_list: list):
    async with AsyncSessionLocal() as session:
        batches = [ProductionBatch(**data) for data in batch_data_list]
        session.add_all(batches)
        await session.commit()
```

---

## 6. Monitoring & Observability - Implementation

### 6.1 Structured Logging

```python
import logging
import json
from pythonjsonlogger import jsonlogger

# Configure JSON logger
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    '%(timestamp)s %(level)s %(name)s %(message)s'
)
logHandler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Usage
logger.info("Batch created", extra={
    "batch_id": batch_id,
    "user_id": user_id,
    "plant_id": plant_id,
    "event_type": "batch.created"
})
```

### 6.2 Metrics Collection

```python
from prometheus_client import Counter, Histogram, Gauge

# Define metrics
batch_created_total = Counter(
    'batch_created_total',
    'Total number of batches created',
    ['plant_id', 'product_type']
)

batch_processing_duration = Histogram(
    'batch_processing_duration_seconds',
    'Time spent processing batches',
    ['plant_id']
)

active_batches = Gauge(
    'active_batches',
    'Number of active batches',
    ['plant_id', 'status']
)

# Usage
@batch_processing_duration.time()
async def process_batch(batch_id: str):
    batch_created_total.labels(
        plant_id=plant_id,
        product_type=product_type
    ).inc()
    # Process batch
    pass
```

### 6.3 Distributed Tracing

```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Setup tracing
trace.set_tracer_provider(TracerProvider())
jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

tracer = trace.get_tracer(__name__)

# Usage
async def create_batch(batch_data: dict):
    with tracer.start_as_current_span("create_batch") as span:
        span.set_attribute("batch.product", batch_data['product'])
        span.set_attribute("batch.plant", batch_data['plant_id'])
        # Create batch
        pass
```

---

This technical deep dive provides concrete implementation details for the most critical enhancement areas. Each section can be expanded further as implementation progresses.

