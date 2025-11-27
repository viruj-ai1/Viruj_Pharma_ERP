"""
Database initialization script.

This script creates all necessary tables in the PostgreSQL database.
Run this once to set up the database schema.

Usage:
    python -m backend.migrations.init_db
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
ROOT_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT_DIR))

from dotenv import load_dotenv
import psycopg
from psycopg.rows import dict_row

# Load environment variables
load_dotenv(ROOT_DIR / ".env", override=False)
load_dotenv(ROOT_DIR / "backend" / ".env", override=False)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://viruj_app:password@localhost:5432/viruj_erp",
)


def create_tables():
    """Create all database tables."""
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            # Enable UUID extension
            cur.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")

            # Users table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id VARCHAR PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    email VARCHAR UNIQUE NOT NULL,
                    hashed_password VARCHAR NOT NULL,
                    role VARCHAR NOT NULL,
                    department VARCHAR NOT NULL,
                    plant_id VARCHAR,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE
                );
                CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            """)

            # Plants table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS plants (
                    id VARCHAR PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    region VARCHAR NOT NULL,
                    running_lines INTEGER DEFAULT 0,
                    oee NUMERIC(5, 2) DEFAULT 0,
                    yield_value NUMERIC(5, 2) DEFAULT 0,
                    open_qa_holds INTEGER DEFAULT 0,
                    inventory_value NUMERIC(15, 2) DEFAULT 0,
                    manager_id VARCHAR,
                    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Production batches table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS production_batches (
                    id VARCHAR PRIMARY KEY,
                    product_name VARCHAR NOT NULL,
                    batch_number VARCHAR UNIQUE NOT NULL,
                    status VARCHAR NOT NULL,
                    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
                    end_date TIMESTAMP WITH TIME ZONE,
                    quantity NUMERIC(10, 2) NOT NULL,
                    unit VARCHAR NOT NULL,
                    assigned_to VARCHAR,
                    officer_id VARCHAR,
                    plant_id VARCHAR NOT NULL,
                    qa_release_status VARCHAR DEFAULT 'Pending',
                    bmr_status VARCHAR DEFAULT 'Incomplete',
                    final_yield NUMERIC(5, 2),
                    qa_officer_id VARCHAR,
                    hold_reason TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE
                );
                CREATE INDEX IF NOT EXISTS idx_batches_batch_number ON production_batches(batch_number);
                CREATE INDEX IF NOT EXISTS idx_batches_plant_id ON production_batches(plant_id);
            """)

            # Materials table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS materials (
                    id VARCHAR PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    type VARCHAR NOT NULL,
                    default_unit VARCHAR NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Notifications table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id VARCHAR PRIMARY KEY,
                    user_id VARCHAR NOT NULL,
                    title VARCHAR NOT NULL,
                    message TEXT NOT NULL,
                    type VARCHAR DEFAULT 'info',
                    is_read BOOLEAN DEFAULT false,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    read_at TIMESTAMP WITH TIME ZONE
                );
                CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
            """)

            conn.commit()
            print("✅ Database tables created successfully!")


def seed_initial_data():
    """Seed database with initial demo data."""
    import bcrypt
    
    # Hash password using bcrypt directly
    password = "demo123".encode('utf-8')
    salt = bcrypt.gensalt()
    demo_password_hash = bcrypt.hashpw(password, salt).decode('utf-8')

    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            # Check if users already exist
            cur.execute("SELECT COUNT(*) FROM users;")
            count = cur.fetchone()[0]
            if count > 0:
                print("⚠️  Database already contains data. Skipping seed.")
                return

            # Insert demo users (matching mockData.ts)
            users_data = [
                ("prod-head-1", "John Smith", "john.smith@pharma.com", "Production Head", "Production", "plant-a"),
                ("prod-man-1", "Sarah Johnson", "sarah.johnson@pharma.com", "Production Manager", "Production", "plant-a"),
                ("prod-op-1", "David Chen", "david.chen@pharma.com", "Production Operator", "Production", "plant-a"),
                ("qa-head-1", "Raj Patel", "raj.patel@pharma.com", "QA Head", "Quality Assurance", "plant-a"),
                ("qa-man-1", "Priya Sharma", "priya.sharma@pharma.com", "QA Manager", "Quality Assurance", "plant-a"),
                ("qa-op-1", "Emily Brown", "emily.brown@pharma.com", "QA Operator", "Quality Assurance", "plant-a"),
                ("qc-head-1", "Laura Vance", "laura.vance@pharma.com", "QC Head", "Quality Control", "plant-a"),
                ("qc-man-1", "Robert Taylor", "robert.taylor@pharma.com", "QC Manager", "Quality Control", "plant-a"),
                ("qc-op-1", "Lisa Anderson", "lisa.anderson@pharma.com", "QC Operator", "Quality Control", "plant-a"),
                ("scm-proc-1", "Maria Garcia", "maria.garcia@pharma.com", "Procurement Officer", "Supply Chain Management", "plant-a"),
                ("scm-wh-1", "James Wilson", "james.wilson@pharma.com", "Warehouse Manager", "Supply Chain Management", "plant-a"),
                ("fin-off-1", "Michael Scott", "michael.scott@pharma.com", "Finance Officer", "Finance", None),
                ("plant-head-1", "Thomas Moore", "thomas.moore@pharma.com", "Plant Head", "Administration", "plant-a"),
                ("sec-off-1", "Jennifer Lee", "jennifer.lee@pharma.com", "Security Officer", "Security", "plant-a"),
                ("admin-1", "Admin User", "admin@pharma.com", "System Admin", "Administration", None),
                ("mgmt-1", "Jan Levinson", "jan.levinson@pharma.com", "Management", "Corporate", None),
                ("sales-1", "Alex Thompson", "alex.thompson@pharma.com", "Sales Person", "Sales", None),
            ]

            for user_id, name, email, role, department, plant_id in users_data:
                cur.execute("""
                    INSERT INTO users (id, name, email, hashed_password, role, department, plant_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, (user_id, name, email, demo_password_hash, role, department, plant_id))

            # Insert demo plants
            plants_data = [
                ("plant-a", "Hyderabad Plant", "APAC", 8, 82.5, 98.1, 5, 12500000, "plant-head-1"),
                ("plant-b", "Dublin Plant", "EMEA", 6, 89.1, 99.2, 2, 9800000, "plant-head-1"),
                ("plant-c", "New Jersey Plant", "AMER", 12, 78.9, 97.5, 8, 15200000, "plant-head-1"),
            ]

            for plant_id, name, region, lines, oee, yield_val, holds, inv_val, mgr_id in plants_data:
                cur.execute("""
                    INSERT INTO plants (id, name, region, running_lines, oee, yield_value, open_qa_holds, inventory_value, manager_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, (plant_id, name, region, lines, oee, yield_val, holds, inv_val, mgr_id))

            conn.commit()
            print("✅ Initial data seeded successfully!")


if __name__ == "__main__":
    print("🚀 Initializing database...")
    create_tables()
    seed_initial_data()
    print("✅ Database initialization complete!")

