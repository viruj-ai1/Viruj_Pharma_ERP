# Quick Start Guide - Backend Integration

## Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 16
- npm or yarn

## Setup Steps

### 1. Database Setup
```bash
# Ensure PostgreSQL is running
brew services start postgresql@16

# Connect and create database (if not already done)
psql -h localhost -p 5432 postgres
CREATE DATABASE viruj_erp;
CREATE USER viruj_app WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE viruj_erp TO viruj_app;
\q
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
cd ..
python -m backend.migrations.init_db
```

### 3. Environment Configuration

Create `.env` file in project root:
```env
DATABASE_URL=postgresql://viruj_app:your_password@localhost:5432/viruj_erp
FRONTEND_URL=http://localhost:5173
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-change-in-production
```

For frontend API integration, create `.env.local` in project root:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_API=true
```

### 4. Frontend Setup
```bash
# Install dependencies (if not already done)
npm install
```

### 5. Start Application
```bash
# From project root - starts both backend and frontend
python start.py
```

Or start separately:
```bash
# Terminal 1 - Backend
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev
```

## Testing the Integration

1. **Check Backend Health**
   - Visit: http://localhost:8000/health
   - Should return: `{"status":"ok","db_user":"viruj_app"}`

2. **Check API Documentation**
   - Visit: http://localhost:8000/docs
   - Swagger UI with all endpoints

3. **Test Login**
   - Open: http://localhost:5173
   - Use any email from mockData.ts (e.g., `john.smith@pharma.com`)
   - Password: `demo123`

## Switching Between Mock Data and API

### Use Mock Data (Default)
- No `.env.local` file needed
- Uses `services/mockData.ts`
- No backend required

### Use API Backend
- Create `.env.local` with `VITE_USE_API=true`
- Backend must be running
- Data comes from PostgreSQL

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `brew services list | grep postgresql`
- Verify DATABASE_URL in `.env`
- Check port 8000 is available: `lsof -i :8000`

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` in `.env.local`
- Check CORS settings in `backend/main.py`
- Ensure backend is running on correct port

### Database connection errors
- Verify database exists: `psql -l | grep viruj_erp`
- Check user permissions
- Verify DATABASE_URL format

## Next Steps

See `docs/BACKEND_INTEGRATION.md` for:
- Complete API documentation
- Future enhancement roadmap
- Migration strategies
- Best practices

