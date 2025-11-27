This contains everything you need to run your app locally.
## Run Locally

**Prerequisites:**  Node.js, Python 3.11+


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## FastAPI backend

1. Install Python deps:
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate  # optional but recommended
   pip install -r requirements.txt
   ```
2. Start the backend helper (prints backend + frontend URLs):
   ```bash
   python start.py
   ```
   Ensure `.env` contains `DATABASE_URL`, optional `FRONTEND_URL`, and `BACKEND_PORT`.
