#!/usr/bin/env python3
"""
Helper script that boots both FastAPI backend and Vite frontend.

Usage:
  python start.py            # runs both backend and frontend servers
"""

from __future__ import annotations

import os
import signal
import subprocess
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
ENV_FILE_CANDIDATES = [
    ROOT_DIR / ".env",
    BACKEND_DIR / ".env",
]

processes: list[subprocess.Popen] = []


def signal_handler(sig, frame):
    """Handle Ctrl+C to gracefully stop all processes."""
    print("\n\nStopping all servers...")
    for proc in processes:
        try:
            proc.terminate()
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
        except Exception:
            pass
    sys.exit(0)


def load_env() -> None:
    for env_file in ENV_FILE_CANDIDATES:
        if env_file.exists():
            load_dotenv(env_file, override=False)


def main() -> int:
    if not BACKEND_DIR.exists():
        print("Backend folder not found. Expected path:", BACKEND_DIR, file=sys.stderr)
        return 1

    # Check if frontend dependencies are installed
    if not (ROOT_DIR / "node_modules").exists():
        print("⚠️  Frontend dependencies not installed. Run: npm install", file=sys.stderr)
        return 1

    load_env()

    # Check for virtual environment
    venv_python = BACKEND_DIR / ".venv" / "bin" / "python3"
    if venv_python.exists():
        python_exec = str(venv_python)
    else:
        python_exec = sys.executable

    backend_host = os.getenv("BACKEND_HOST", "0.0.0.0")
    backend_port = os.getenv("BACKEND_PORT", "8000")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    database_url = os.getenv("DATABASE_URL", "postgresql://viruj_app:password@localhost:5432/viruj_erp")

    env = os.environ.copy()
    env.setdefault("DATABASE_URL", database_url)

    # Setup signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Start backend
    backend_cmd = [
        python_exec,
        "-m",
        "uvicorn",
        "main:app",
        "--reload",
        "--host",
        backend_host,
        "--port",
        backend_port,
    ]

    # Start frontend
    frontend_cmd = ["npm", "run", "dev"]

    print(f"\n{'='*60}")
    print(f"🚀 Starting Viruj Pharma ERP")
    print(f"{'='*60}")
    print(f"📡 Backend API: http://{backend_host}:{backend_port}")
    print(f"🌐 Frontend Interface: {frontend_url}")
    print(f"📚 API Docs: http://localhost:{backend_port}/docs")
    print(f"{'='*60}\n")

    try:
        # Start backend process
        print("🔄 Starting backend server...")
        backend_proc = subprocess.Popen(
            backend_cmd,
            cwd=str(BACKEND_DIR),
            env=env,
        )
        processes.append(backend_proc)

        # Give backend a moment to start
        time.sleep(2)

        # Start frontend process
        print("🔄 Starting frontend server...")
        frontend_proc = subprocess.Popen(
            frontend_cmd,
            cwd=str(ROOT_DIR),
        )
        processes.append(frontend_proc)

        print("\n✅ Both servers are starting...")
        print("Press Ctrl+C to stop all servers\n")

        # Wait for processes
        while True:
            for proc in processes:
                if proc.poll() is not None:
                    print(f"\n⚠️  Process exited with code {proc.returncode}")
                    return proc.returncode
            time.sleep(1)

    except KeyboardInterrupt:
        signal_handler(None, None)
        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        signal_handler(None, None)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

