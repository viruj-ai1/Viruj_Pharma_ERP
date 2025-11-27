# Release Notes - Viruj Pharmaceuticals ERP (QA Handoff)

## Overview
- Frontend login page fully integrated with FastAPI backend and PostgreSQL user store.
- Demo credentials modal (top-right menu) fetches real users from DB for quick QA access.
- Glassmorphism UI, responsive design, improved errors, password toggle, loading state.
- FastAPI backend: JWT auth, rate limiting, monitoring, hardened headers, caching, detailed logging.
- PostgreSQL: users/plants/materials/notifications tables, init script seeds one user per role.
- CI/CD via GitHub Actions, Docker artifacts for backend/frontend, docs for microservices future work.
- Documentation set: Quick Start, Backend Integration, QA Test Plan, Technical Deep Dive, Future Enhancements, Implementation Summary, Microservices architecture/guides.

## Key Features in this Release
1. Live authentication end-to-end (React UI ↔ FastAPI ↔ PostgreSQL).
2. Secure login UX: responsive layout, animations, error messaging, dev credentials modal.
3. Monitoring & security: Prometheus metrics, structured logging, security headers, rate limiting, caching, optimized queries.
4. Microservices foundation (docs + service stubs) and Docker-based local orchestration.
5. Comprehensive documentation: setup, QA plan, future roadmap, technical deep dive.

## Known Considerations
- Demo users share password `demo123`; change during production hardening.
- Credential modal is for dev/QA only; remove or gate before production.
- Some services outlined in docs are stubs; core auth/user flows are functional.
