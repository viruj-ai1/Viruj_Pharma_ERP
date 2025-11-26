## PostgreSQL Integration Playbook

### 1. Provision a PostgreSQL Instance
1. **Local (Homebrew macOS)**  
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   psql postgres
   ```
2. **Managed (Supabase / RDS / Azure)**  
   - Create a new Postgres 16 instance.  
   - Restrict network access (VPC peering, IP allow list, SSL required).  
3. **Initial objects**  
   ```sql
   CREATE DATABASE viruj_erp;
   CREATE USER viruj_app WITH PASSWORD '<strong-secret>';
   GRANT ALL PRIVILEGES ON DATABASE viruj_erp TO viruj_app;
   ```

### 2. Secure Connectivity
1. Enforce SCRAM-SHA-256 (`password_encryption = 'scram-sha-256'`).  
2. Update `pg_hba.conf` (self-hosted) to allow SSL connections from app servers only:  
   ```
   hostssl viruj_erp viruj_app <app-cidr> scram-sha-256
   ```
3. Store credentials only in environment variables. Create `server/.env` (not committed):  
   ```
   DATABASE_URL=postgres://viruj_app:<password>@<host>:5432/viruj_erp
   ```

### 3. Backend Skeleton
1. Create a backend folder:
   ```bash
   mkdir server && cd server
   npm init -y
   npm install typescript tsx @types/node express pg drizzle-orm
   npx tsc --init
   ```
2. Add `server/src/db.ts`:
   ```ts
   import { Pool } from "pg";
   export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   ```
3. Expose API in `server/src/index.ts` that imports `pool`, runs migrations, and starts Express.

### 4. Schema & Migrations
1. Install migration tooling (example with Drizzle):
   ```bash
   npm install drizzle-kit
   ```
2. Define tables (`server/src/schema.ts`):
   ```ts
   export const users = pgTable("users", {
     id: uuid("id").primaryKey().defaultRandom(),
     email: varchar("email", { length: 255 }).notNull().unique(),
     passwordHash: varchar("password_hash", { length: 255 }).notNull(),
     role: varchar("role", { length: 64 }).notNull(),
     createdAt: timestamp("created_at").defaultNow(),
   });
   ```
3. Run migrations:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit push
   ```

### 5. Domain Tables (examples)
- `metadata` → generic key/value per plant/site.  
- `notifications` → status, delivery channel, payload JSONB.  
- `documents` → store filename, hash, S3 key, uploaded_by.  
- `auth_sessions` → session token, user_id, expires_at.  
- `audit_logs` → captures CRUD events for compliance.

### 6. Document Storage Strategy
1. Upload PDFs/binaries to S3/GCS via presigned URLs.  
2. Store only metadata + location in PostgreSQL.  
3. For small signatures, use `bytea` column with max size safeguards.

### 7. Frontend Integration
1. Replace mock services with fetch calls to backend endpoints.  
2. Centralize HTTP client (`services/apiClient.ts`) handling tokens and retry.  
3. Update contexts (`AuthContext`, notifications) to consume live data.

### 8. Testing & CI
1. Local: spin up Postgres container for backend tests.  
   ```bash
   docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=test postgres:16
   ```
2. CI: add GitHub Action service container, run migrations, execute backend unit/integration tests, then frontend e2e.  
3. Seed scripts populate baseline roles, metadata, and sample documents.

### 9. Deployment Checklist
1. Build backend image with migrations baked in.  
2. Use secrets manager for `DATABASE_URL`.  
3. Run migrations before rolling out new app version.  
4. Monitor with pg_stat_statements, set up PITR backups.  
5. Regularly rotate credentials and audit access.

### 10. Operational Playbook
- **Daily**: check replication lag, locks, slow queries.  
- **Weekly**: vacuum/analyze heavy tables, review backup integrity.  
- **Incident**: failover to replica, re-point `DATABASE_URL`, run migration drift check.  
- **Compliance**: encrypt at rest, mask PII in logs, maintain audit tables per SOP.


