# QA Handoff Instructions

## Environment Setup
1. Follow `docs/QUICK_START.md` to install dependencies.
2. Run `python backend/migrations/init_db.py` to seed DB with 17 user roles (password `demo123`).
3. Start stack via `python start.py` (backend + Vite frontend). Backend `http://localhost:8000`, frontend `http://localhost:5173` (or configured IP).

## Credentials
- Use demo modal (three-dot button) for autofill/copy. All seeded users use `demo123`.
- Reference `backend/migrations/init_db.py` for full email list per role.

## Test Coverage
- Primary reference: `docs/QA_TEST_PLAN.md` (80+ cases covering auth, API, DB, UI, security, performance, regression).
- Additional docs:
  - `docs/BACKEND_INTEGRATION.md` – API expectations, future roadmap.
  - `docs/TECHNICAL_DEEP_DIVE.md` – architecture and constraints.
  - `docs/FUTURE_ENHANCEMENTS.md` – backlog context.

## Test Focus Areas
1. **Authentication:** valid/invalid login, session persistence, logout, role coverage.
2. **API:** `/health`, `/metrics`, `/api/auth/*`, `/api/users`. Validate JWT, rate limiting, error handling.
3. **Database:** data seeding, password hashing, indexes, constraints.
4. **UI/UX:** responsive layout, modal behavior, error states, loading states.
5. **Security:** SQLi/XSS attempts, headers, CORS, rate limiting.
6. **Integration:** frontend-backend sync, token storage in localStorage, error propagation.
7. **Performance/Cross-browser:** baseline on Chrome/Firefox/Safari/Edge (desktop + mobile viewports).

## Defect Reporting
- Use template in `docs/QA_TEST_PLAN.md` (severity, steps, expected vs actual, env, evidence).
- Prioritize blocking auth/API issues first, then UI/UX, docs.
- Record logs/screenshots; include console/network traces for frontend issues, API responses for backend.

## Regression Expectations
- After fixes, rerun smoke set: valid login, invalid login, `/api/auth/me`, `/api/users`, credential modal, logout.
- Document pass/fail status in shared tracker (Jira/Sheets) referencing case IDs from QA plan.

## Support
- For data resets, rerun `python backend/migrations/init_db.py`.
- For questions, reference documentation or ping engineering lead.
