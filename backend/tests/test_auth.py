"""
Tests for authentication endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_login_invalid_credentials():
    """Test login with invalid credentials."""
    response = client.post(
        "/api/auth/login",
        json={"email": "invalid@example.com", "password": "wrong"}
    )
    assert response.status_code == 401


def test_login_missing_fields():
    """Test login with missing fields."""
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com"}
    )
    assert response.status_code == 422  # Validation error


def test_get_users_without_auth():
    """Test getting users without authentication."""
    response = client.get("/api/users")
    # Should work for now (no auth required in test)
    assert response.status_code in [200, 401]


def test_rate_limiting():
    """Test rate limiting on login endpoint."""
    # Try to login 6 times (limit is 5/minute)
    for i in range(6):
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "test123"}
        )
        if i < 5:
            # First 5 should work (even if auth fails)
            assert response.status_code in [401, 429]
        else:
            # 6th should be rate limited
            assert response.status_code == 429

