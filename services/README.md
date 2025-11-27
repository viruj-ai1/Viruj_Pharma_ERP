# Microservices Architecture

This directory contains the microservices implementation for the Viruj Pharma ERP system.

## Service Structure

Each service is a self-contained FastAPI application with its own:
- Database schema (can share PostgreSQL with schema separation)
- Business logic
- API endpoints
- Tests
- Docker configuration

## Services

1. **auth-service** - Authentication & Authorization
2. **user-service** - User Management
3. **production-service** - Production Management
4. **qa-service** - Quality Assurance
5. **scm-service** - Supply Chain Management
6. **inventory-service** - Inventory Management
7. **document-service** - Document Management
8. **notification-service** - Notifications
9. **analytics-service** - Analytics & Reporting

## Communication Patterns

- **Synchronous**: REST API calls via API Gateway
- **Asynchronous**: Message queue (RabbitMQ/Kafka) for events
- **Service Discovery**: Consul or Kubernetes service discovery

## Getting Started

See individual service README files for setup instructions.

