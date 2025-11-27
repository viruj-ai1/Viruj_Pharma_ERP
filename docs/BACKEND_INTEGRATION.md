# Backend Integration Guide

This document outlines how the FastAPI backend integrates with the React frontend and provides guidance for future enhancements.

## Current Architecture

### Frontend (React + TypeScript)
- **Location**: Root directory
- **Framework**: React 19 with Vite
- **State Management**: React Context API
- **API Client**: `services/apiClient.ts` - Centralized HTTP client

### Backend (FastAPI + PostgreSQL)
- **Location**: `backend/` directory
- **Framework**: FastAPI with Python 3.9+
- **Database**: PostgreSQL 16
- **ORM**: SQLAlchemy (models) + raw SQL (queries for now)

## Integration Flow

### 1. Authentication Flow

```
Frontend (Login.tsx)
    ↓
apiClient.post('/api/auth/login', { email, password })
    ↓
Backend (main.py) - /api/auth/login
    ↓
PostgreSQL (users table)
    ↓
JWT Token + User Data
    ↓
Frontend stores token in localStorage
    ↓
AuthContext updates with user data
```

### 2. API Client Usage

```typescript
import { authApi, usersApi } from '../services/apiClient';

// Login
const response = await authApi.login(email, password);
apiClient.setToken(response.access_token);

// Get current user
const user = await authApi.getCurrentUser();

// Get all users
const users = await usersApi.getAll();
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Initialize Database

```bash
# From project root
python -m backend.migrations.init_db
```

This will:
- Create all necessary tables
- Seed initial demo users and plants
- Set up indexes

### 3. Configure Environment Variables

Create `.env` in project root:

```env
DATABASE_URL=postgresql://viruj_app:your_password@localhost:5432/viruj_erp
FRONTEND_URL=http://localhost:5173
SECRET_KEY=your-secret-key-change-in-production
BACKEND_PORT=8000
```

### 4. Start Both Servers

```bash
# From project root
python start.py
```

This starts both backend (port 8000) and frontend (port 5173).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout (client removes token)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{user_id}` - Get user by ID

### Meta
- `GET /health` - Health check
- `GET /` - API info
- `GET /docs` - Swagger UI documentation

## Future Enhancements

### Phase 1: Core Features (Immediate)
1. **Complete User Management**
   - [ ] User CRUD operations
   - [ ] Role-based access control (RBAC)
   - [ ] Password reset functionality
   - [ ] User profile updates

2. **Plant Management**
   - [ ] Plant CRUD operations
   - [ ] Plant metrics tracking
   - [ ] Multi-plant support

3. **Production Batch Management**
   - [ ] Batch creation and tracking
   - [ ] Batch status updates
   - [ ] Batch history/audit trail

### Phase 2: Advanced Features (Short-term)
1. **Real-time Updates**
   - [ ] WebSocket support for live updates
   - [ ] Server-Sent Events (SSE) for notifications
   - [ ] Real-time dashboard metrics

2. **Document Management**
   - [ ] File upload/download
   - [ ] PDF generation
   - [ ] Document versioning
   - [ ] Integration with cloud storage (S3/GCS)

3. **Notifications System**
   - [ ] Push notifications
   - [ ] Email notifications
   - [ ] Notification preferences
   - [ ] Notification history

### Phase 3: Enterprise Features (Medium-term)
1. **Audit Trail & Compliance**
   - [ ] Complete audit logging
   - [ ] E-signature integration
   - [ ] Regulatory compliance tracking
   - [ ] Data retention policies

2. **Advanced Analytics**
   - [ ] Custom reports generation
   - [ ] Data visualization APIs
   - [ ] Export to Excel/PDF
   - [ ] Scheduled reports

3. **Integration & APIs**
   - [ ] RESTful API documentation
   - [ ] GraphQL endpoint (optional)
   - [ ] Webhook support
   - [ ] Third-party integrations (ERP, MES)

### Phase 4: Scalability & Performance (Long-term)
1. **Performance Optimization**
   - [ ] Database query optimization
   - [ ] Caching layer (Redis)
   - [ ] CDN for static assets
   - [ ] Database connection pooling

2. **Scalability**
   - [ ] Horizontal scaling support
   - [ ] Load balancing
   - [ ] Microservices architecture (if needed)
   - [ ] Message queue (RabbitMQ/Kafka)

3. **Security Enhancements**
   - [ ] OAuth2/SSO integration
   - [ ] Two-factor authentication (2FA)
   - [ ] Rate limiting
   - [ ] API key management
   - [ ] Security scanning & vulnerability management

4. **DevOps & Monitoring**
   - [ ] CI/CD pipeline
   - [ ] Automated testing (unit, integration, e2e)
   - [ ] Application monitoring (Prometheus/Grafana)
   - [ ] Log aggregation (ELK stack)
   - [ ] Error tracking (Sentry)

## Database Schema Evolution

### Current Tables
- `users` - User accounts and authentication
- `plants` - Manufacturing plants/locations
- `production_batches` - Production batch records
- `materials` - Material master data
- `notifications` - User notifications

### Future Tables (Planned)
- `inventory_items` - Warehouse inventory
- `purchase_requisitions` - Material procurement requests
- `purchase_orders` - Purchase orders
- `deviations` - Quality deviations
- `documents` - Document metadata
- `audit_logs` - System audit trail
- `sessions` - User sessions
- `tasks` - Task management
- `equipment` - Equipment tracking
- `maintenance_tasks` - Maintenance scheduling

## Migration Strategy

### For New Features
1. Create migration script in `backend/migrations/`
2. Update models in `backend/models.py`
3. Update schemas in `backend/schemas.py`
4. Add API endpoints in `backend/main.py` or separate router files
5. Update frontend types in `types.ts`
6. Update API client in `services/apiClient.ts`
7. Update frontend components to use new API

### Example Migration Workflow
```bash
# 1. Create migration file
touch backend/migrations/add_inventory_table.py

# 2. Write migration script
# 3. Test migration
python -m backend.migrations.add_inventory_table

# 4. Update models and schemas
# 5. Add API endpoints
# 6. Update frontend
```

## Testing Strategy

### Backend Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Database migration tests
- Authentication/authorization tests

### Frontend Testing
- Component unit tests (React Testing Library)
- Integration tests for API calls
- E2E tests (Playwright/Cypress)

## Deployment Considerations

### Development
- Local PostgreSQL
- Local file storage
- Development secrets

### Production
- Managed PostgreSQL (AWS RDS, Azure Database)
- Cloud storage (S3, GCS, Azure Blob)
- Environment-specific secrets management
- SSL/TLS certificates
- Domain configuration
- Load balancing
- Auto-scaling

## Best Practices

1. **API Design**
   - Use RESTful conventions
   - Consistent error responses
   - Version API endpoints (`/api/v1/...`)
   - Pagination for list endpoints
   - Filtering and sorting support

2. **Security**
   - Always hash passwords
   - Use HTTPS in production
   - Validate all inputs
   - Sanitize user inputs
   - Implement rate limiting
   - Regular security audits

3. **Performance**
   - Use database indexes
   - Implement caching where appropriate
   - Optimize database queries
   - Use connection pooling
   - Monitor query performance

4. **Code Quality**
   - Type hints in Python
   - TypeScript strict mode
   - Code linting (Black, ESLint)
   - Code formatting
   - Code reviews

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

