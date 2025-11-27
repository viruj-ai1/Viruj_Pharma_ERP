# Microservices Architecture Implementation

## Overview

The Viruj Pharma ERP system has been restructured into a microservices architecture, breaking down the monolithic application into independent, scalable services.

## Architecture Diagram

```
                    ┌─────────────┐
                    │   Frontend  │
                    │  (React)    │
                    └──────┬──────┘
                           │
                           │ HTTP
                           │
                    ┌──────▼──────────┐
                    │   API Gateway   │
                    │   (Port 8000)   │
                    └──────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌──────▼──────┐    ┌──────▼──────┐
   │  Auth   │      │    User     │    │ Production  │
   │ Service │      │  Service    │    │  Service    │
   │ :8001   │      │   :8002     │    │   :8003     │
   └─────────┘      └─────────────┘    └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌──────▼──────┐    ┌──────▼──────┐
   │PostgreSQL│     │   Redis     │    │  RabbitMQ   │
   │  :5432   │     │   :6379     │    │   :5672     │
   └──────────┘     └─────────────┘    └─────────────┘
```

## Services

### 1. Auth Service (Port 8001)
**Responsibilities:**
- User authentication (login, logout)
- JWT token generation and validation
- Token verification for other services
- Password management

**Endpoints:**
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify token
- `POST /api/auth/logout` - User logout
- `GET /health` - Health check

### 2. User Service (Port 8002)
**Responsibilities:**
- User CRUD operations
- User profile management
- User queries and searches

**Endpoints:**
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /health` - Health check

### 3. Production Service (Port 8003)
**Responsibilities:**
- Production batch management
- Batch lifecycle tracking
- Production metrics
- Stage management

**Endpoints:**
- `GET /api/batches` - Get batches
- `POST /api/batches` - Create batch
- `GET /api/batches/{id}` - Get batch by ID
- `PUT /api/batches/{id}` - Update batch
- `GET /health` - Health check

**Events Published:**
- `batch.created` - When a new batch is created
- `batch.status.changed` - When batch status changes
- `batch.completed` - When batch is completed

### 4. API Gateway (Port 8000)
**Responsibilities:**
- Request routing to appropriate services
- Authentication verification
- Rate limiting
- Request/response transformation
- Load balancing (future)

**Features:**
- Automatic service discovery
- Request forwarding
- Error handling and retries
- Metrics collection

## Communication Patterns

### Synchronous Communication (REST)
- Services communicate via HTTP/REST
- API Gateway routes requests
- Service-to-service calls use `service_client.py`

**Example:**
```python
from service_client import call_service

# Call user service from production service
users = call_service(
    "user",
    "GET",
    "/api/users",
    token=token
)
```

### Asynchronous Communication (Event Bus)
- RabbitMQ for event-driven communication
- Services publish events for others to consume
- Decoupled service interactions

**Example:**
```python
from event_bus import publish_event

# Publish event when batch status changes
publish_event(
    "batch.status.changed",
    {
        "batch_id": "batch-123",
        "old_status": "In Progress",
        "new_status": "QA Hold"
    }
)
```

## Service Discovery

### Current Implementation
- Environment variables for service URLs
- Docker Compose service names for containerized deployment
- Manual configuration

### Future Enhancements
- Consul for service discovery
- Kubernetes service discovery
- Health check-based routing

## Database Strategy

### Shared Database (Current)
- All services share the same PostgreSQL database
- Schema separation by service (future: separate databases)
- Connection pooling per service

### Future: Database per Service
- Each service has its own database
- Data synchronization via events
- Eventual consistency

## Deployment

### Docker Compose (Development)
```bash
cd services
docker-compose -f docker-compose.microservices.yml up
```

### Kubernetes (Production - Future)
- Each service as a Kubernetes deployment
- Service mesh (Istio) for inter-service communication
- Horizontal pod autoscaling

## Monitoring

### Per-Service Monitoring
- Structured JSON logging
- Health check endpoints
- Metrics collection (future: Prometheus)

### Distributed Tracing (Future)
- Jaeger or Zipkin integration
- Request correlation IDs
- Service dependency mapping

## Security

### Authentication Flow
1. Client authenticates with Auth Service
2. Receives JWT token
3. Token included in requests to other services
4. Services verify token with Auth Service
5. API Gateway can also verify tokens

### Service-to-Service Authentication
- JWT tokens for service authentication
- Service mesh mTLS (future)
- API keys for external services (future)

## Migration Path

### Phase 1: Foundation (Current)
- ✅ Service structure created
- ✅ API Gateway implemented
- ✅ Auth and User services
- ✅ Production service skeleton
- ✅ Event bus setup

### Phase 2: Service Extraction
- Extract QA service from monolithic backend
- Extract SCM service
- Extract Inventory service
- Extract Document service
- Extract Notification service

### Phase 3: Advanced Features
- Service mesh implementation
- Distributed tracing
- Advanced monitoring
- Auto-scaling
- Circuit breakers

## Benefits Achieved

1. **Independent Scaling**: Each service can scale independently
2. **Technology Flexibility**: Services can use different tech stacks
3. **Fault Isolation**: Failure in one service doesn't bring down others
4. **Team Autonomy**: Teams can work on services independently
5. **Easier Maintenance**: Smaller codebases are easier to maintain

## Challenges and Solutions

### Challenge: Service Communication Overhead
**Solution**: 
- Use connection pooling
- Implement caching
- Use async communication where possible

### Challenge: Data Consistency
**Solution**:
- Event-driven updates
- Saga pattern for distributed transactions
- Eventual consistency acceptance

### Challenge: Deployment Complexity
**Solution**:
- Docker Compose for development
- Kubernetes for production
- CI/CD automation

## Next Steps

1. Complete remaining services (QA, SCM, Inventory, etc.)
2. Implement service mesh (Istio)
3. Add distributed tracing
4. Set up Kubernetes deployment
5. Implement circuit breakers
6. Add service health monitoring dashboard

