# Microservices Quick Start Guide

## Prerequisites

- Docker and Docker Compose
- Python 3.9+ (for local development)
- PostgreSQL 16
- Redis
- RabbitMQ (for event bus)

## Quick Start with Docker Compose

### 1. Start All Services

```bash
cd services
docker-compose -f docker-compose.microservices.yml up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- RabbitMQ (port 5672, Management UI: 15672)
- Auth Service (port 8001)
- User Service (port 8002)
- Production Service (port 8003)
- API Gateway (port 8000)

### 2. Initialize Database

```bash
# Run migrations
docker exec -it viruj_postgres psql -U viruj_app -d viruj_erp -f /path/to/migrations/init_db.sql

# Or use the Python migration script
python -m backend.migrations.init_db
```

### 3. Test the Services

```bash
# Test API Gateway
curl http://localhost:8000/health

# Test Auth Service directly
curl http://localhost:8001/health

# Test login via API Gateway
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.smith@pharma.com", "password": "demo123"}'
```

## Local Development

### 1. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, RabbitMQ
docker-compose -f docker-compose.microservices.yml up -d postgres redis rabbitmq
```

### 2. Start Services Individually

#### Auth Service
```bash
cd services/auth-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

#### User Service
```bash
cd services/user-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

#### Production Service
```bash
cd services/production-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8003 --reload
```

#### API Gateway
```bash
cd services/api-gateway
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL=postgresql://viruj_app:password@localhost:5432/viruj_erp

# Services
AUTH_SERVICE_URL=http://localhost:8001
USER_SERVICE_URL=http://localhost:8002
PRODUCTION_SERVICE_URL=http://localhost:8003

# Infrastructure
REDIS_URL=redis://localhost:6379/0
RABBITMQ_URL=amqp://guest:guest@localhost:5672/

# Security
SECRET_KEY=your-secret-key-change-in-production

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Service URLs

- **API Gateway**: http://localhost:8000
- **Auth Service**: http://localhost:8001
- **User Service**: http://localhost:8002
- **Production Service**: http://localhost:8003
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)

## Testing

### Test Authentication Flow

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.smith@pharma.com", "password": "demo123"}' \
  | jq -r '.access_token')

# 2. Get current user
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Get users
curl http://localhost:8000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

## Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f auth-service
```

### Health Checks

```bash
# Check all service health
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
```

## Next Steps

1. Implement remaining services (QA, SCM, Inventory, etc.)
2. Add service mesh (Istio) for advanced routing
3. Implement distributed tracing
4. Set up Kubernetes deployment
5. Add monitoring dashboard

