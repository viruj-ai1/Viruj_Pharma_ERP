# QA Test Plan - Viruj Pharmaceuticals ERP System

**Document Version:** 1.0  
**Date:** 2025-01-27  
**Prepared By:** QA Team  
**Application:** Viruj Pharmaceuticals ERP System  
**Testing Phase:** Pre-Production Testing

---

## Table of Contents

1. [Test Overview](#test-overview)
2. [Test Scope](#test-scope)
3. [Test Environment](#test-environment)
4. [Test Cases by Category](#test-cases-by-category)
5. [Test Execution Plan](#test-execution-plan)
6. [Defect Management](#defect-management)
7. [Test Deliverables](#test-deliverables)

---

## 1. Test Overview

### 1.1 Purpose
This document outlines the comprehensive test plan for the Viruj Pharmaceuticals ERP System. It covers all functional, non-functional, security, and integration testing requirements to ensure the system meets quality standards before production deployment.

### 1.2 Objectives
- Verify all functional requirements are met
- Validate security measures and data protection
- Ensure system performance meets acceptable standards
- Confirm cross-browser and device compatibility
- Validate database integrity and data consistency
- Test user role-based access control
- Verify API endpoints functionality
- Validate error handling and edge cases

### 1.3 Testing Approach
- **Manual Testing:** UI/UX, User workflows, Visual validation
- **API Testing:** Postman/Insomnia for backend endpoints
- **Database Testing:** Direct SQL queries and data validation
- **Security Testing:** Authentication, authorization, input validation
- **Performance Testing:** Load testing, response time validation
- **Integration Testing:** Frontend-Backend integration, Database connectivity

---

## 2. Test Scope

### 2.1 In Scope
✅ **Authentication & Authorization**
- Login functionality
- JWT token management
- User session management
- Role-based access control
- Password validation

✅ **Backend API Endpoints**
- Health check endpoints
- Authentication endpoints (login, logout, get current user)
- User management endpoints
- Metrics and monitoring endpoints

✅ **Database**
- Database connectivity
- Data initialization
- User data integrity
- Password hashing
- Index creation and optimization

✅ **Frontend Components**
- Login page UI/UX
- Demo credentials modal
- Error handling and display
- Form validation
- Responsive design

✅ **Security**
- Input validation and sanitization
- SQL injection prevention
- XSS prevention
- CORS configuration
- Rate limiting
- Security headers

✅ **Integration**
- Frontend-Backend communication
- Database connectivity
- API response handling
- Error propagation

### 2.2 Out of Scope (Future Phases)
- Production module functionality
- QA/QC module functionality
- SCM module functionality
- Warehouse module functionality
- Reporting and analytics
- Document management
- Email notifications
- Mobile app testing

---

## 3. Test Environment

### 3.1 Environment Setup
- **Backend URL:** `http://localhost:8000`
- **Frontend URL:** `http://localhost:5173` or `http://localhost:3000`
- **Database:** PostgreSQL 16
- **Database Name:** `viruj_erp`
- **Database User:** `viruj_app`

### 3.2 Prerequisites
- PostgreSQL 16 installed and running
- Python 3.8+ with virtual environment
- Node.js 18+ installed
- All dependencies installed (`pip install -r requirements.txt` and `npm install`)
- Database initialized (`python backend/migrations/init_db.py`)

### 3.3 Test Data
- **Demo Users:** 16 users with various roles (see `backend/migrations/init_db.py`)
- **Default Password:** `demo123` (for all demo users)
- **Test Credentials:** Available in Login page demo credentials modal

---

## 4. Test Cases by Category

### 4.1 Authentication & Login Testing

#### TC-AUTH-001: Valid Login
**Priority:** High  
**Description:** Verify successful login with valid credentials

**Steps:**
1. Navigate to login page
2. Enter valid email: `john.smith@pharma.com`
3. Enter valid password: `demo123`
4. Click "Sign in" button

**Expected Result:**
- User is successfully logged in
- JWT token is stored in localStorage
- User is redirected to dashboard
- User information is displayed correctly

**Test Data:**
- Email: `john.smith@pharma.com`
- Password: `demo123`

---

#### TC-AUTH-002: Invalid Email
**Priority:** High  
**Description:** Verify error handling for invalid email

**Steps:**
1. Navigate to login page
2. Enter invalid email: `invalid@test.com`
3. Enter password: `demo123`
4. Click "Sign in" button

**Expected Result:**
- Error message displayed: "Invalid email or password"
- User remains on login page
- No token is stored

---

#### TC-AUTH-003: Invalid Password
**Priority:** High  
**Description:** Verify error handling for invalid password

**Steps:**
1. Navigate to login page
2. Enter valid email: `john.smith@pharma.com`
3. Enter invalid password: `wrongpassword`
4. Click "Sign in" button

**Expected Result:**
- Error message displayed: "Invalid email or password"
- User remains on login page
- No token is stored

---

#### TC-AUTH-004: Empty Email Field
**Priority:** Medium  
**Description:** Verify validation for empty email field

**Steps:**
1. Navigate to login page
2. Leave email field empty
3. Enter password: `demo123`
4. Click "Sign in" button

**Expected Result:**
- Error message displayed: "Email and password are required"
- Form submission is prevented

---

#### TC-AUTH-005: Empty Password Field
**Priority:** Medium  
**Description:** Verify validation for empty password field

**Steps:**
1. Navigate to login page
2. Enter email: `john.smith@pharma.com`
3. Leave password field empty
4. Click "Sign in" button

**Expected Result:**
- Error message displayed: "Email and password are required"
- Form submission is prevented

---

#### TC-AUTH-006: Password Visibility Toggle
**Priority:** Low  
**Description:** Verify password visibility toggle functionality

**Steps:**
1. Navigate to login page
2. Enter password: `demo123`
3. Click eye icon to toggle visibility

**Expected Result:**
- Password is hidden by default (shows dots)
- Clicking eye icon shows password in plain text
- Clicking again hides password

---

#### TC-AUTH-007: Login with All User Roles
**Priority:** High  
**Description:** Verify login works for all 16 user roles

**Test Data:**
1. Production Head - `john.smith@pharma.com`
2. Production Manager - `sarah.johnson@pharma.com`
3. Production Operator - `david.chen@pharma.com`
4. QA Head - `raj.patel@pharma.com`
5. QA Manager - `priya.sharma@pharma.com`
6. QA Operator - `emily.brown@pharma.com`
7. QC Head - `laura.vance@pharma.com`
8. QC Manager - `robert.taylor@pharma.com`
9. QC Operator - `lisa.anderson@pharma.com`
10. Procurement Officer - `maria.garcia@pharma.com`
11. Warehouse Manager - `james.wilson@pharma.com`
12. Finance Officer - `michael.scott@pharma.com`
13. Plant Head - `thomas.moore@pharma.com`
14. Security Officer - `jennifer.lee@pharma.com`
15. System Admin - `admin@pharma.com`
16. Management - `jan.levinson@pharma.com`

**Steps:**
1. For each user, navigate to login page
2. Enter email and password (`demo123`)
3. Click "Sign in"

**Expected Result:**
- All users can successfully log in
- Correct user information is displayed
- User role is correctly assigned

---

#### TC-AUTH-008: Session Persistence
**Priority:** Medium  
**Description:** Verify user session persists after page refresh

**Steps:**
1. Log in with valid credentials
2. Refresh the page (F5)
3. Check if user remains logged in

**Expected Result:**
- User remains logged in after page refresh
- Token is retrieved from localStorage
- User information is displayed correctly

---

#### TC-AUTH-009: Logout Functionality
**Priority:** High  
**Description:** Verify logout clears session

**Steps:**
1. Log in with valid credentials
2. Click logout button
3. Verify session is cleared

**Expected Result:**
- User is logged out
- Token is removed from localStorage
- User is redirected to login page
- Cannot access protected routes

---

#### TC-AUTH-010: Inactive User Login
**Priority:** Medium  
**Description:** Verify inactive users cannot log in

**Steps:**
1. Set a user's `is_active` to `false` in database
2. Attempt to log in with that user's credentials

**Expected Result:**
- Login fails with "Invalid email or password" error
- User cannot access the system

---

### 4.2 API Endpoint Testing

#### TC-API-001: Health Check Endpoint
**Priority:** High  
**Description:** Verify `/health` endpoint returns correct status

**Request:**
```
GET http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "db_user": "viruj_app"
}
```

**Status Code:** 200 OK

---

#### TC-API-002: Root Endpoint
**Priority:** Low  
**Description:** Verify root endpoint returns API information

**Request:**
```
GET http://localhost:8000/
```

**Expected Response:**
```json
{
  "message": "Viruj Chematrix FastAPI backend is running.",
  "frontend": "http://localhost:5173",
  "docs": "/docs"
}
```

**Status Code:** 200 OK

---

#### TC-API-003: Login Endpoint - Success
**Priority:** High  
**Description:** Verify login endpoint returns JWT token

**Request:**
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "john.smith@pharma.com",
  "password": "demo123"
}
```

**Expected Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "prod-head-1",
    "name": "John Smith",
    "email": "john.smith@pharma.com",
    "role": "Production Head",
    "department": "Production",
    "plant_id": "plant-a",
    "is_active": true,
    "created_at": "2025-01-27T..."
  }
}
```

**Status Code:** 200 OK

---

#### TC-API-004: Login Endpoint - Invalid Credentials
**Priority:** High  
**Description:** Verify login endpoint rejects invalid credentials

**Request:**
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "invalid@test.com",
  "password": "wrongpassword"
}
```

**Expected Response:**
```json
{
  "detail": "Invalid email or password"
}
```

**Status Code:** 401 Unauthorized

---

#### TC-API-005: Login Endpoint - Rate Limiting
**Priority:** Medium  
**Description:** Verify rate limiting on login endpoint

**Steps:**
1. Send 6 login requests within 1 minute
2. Verify 6th request is rate limited

**Expected Result:**
- First 5 requests succeed
- 6th request returns 429 Too Many Requests
- Error message indicates rate limit exceeded

---

#### TC-API-006: Get Current User Endpoint
**Priority:** High  
**Description:** Verify `/api/auth/me` returns current user info

**Request:**
```
GET http://localhost:8000/api/auth/me
Authorization: Bearer <token>
```

**Expected Response:**
```json
{
  "id": "prod-head-1",
  "name": "John Smith",
  "email": "john.smith@pharma.com",
  "role": "Production Head",
  "department": "Production",
  "plant_id": "plant-a",
  "is_active": true,
  "created_at": "2025-01-27T..."
}
```

**Status Code:** 200 OK

---

#### TC-API-007: Get Current User - Invalid Token
**Priority:** High  
**Description:** Verify endpoint rejects invalid token

**Request:**
```
GET http://localhost:8000/api/auth/me
Authorization: Bearer invalid_token
```

**Expected Response:**
```json
{
  "detail": "Could not validate credentials"
}
```

**Status Code:** 401 Unauthorized

---

#### TC-API-008: Get Current User - No Token
**Priority:** High  
**Description:** Verify endpoint rejects requests without token

**Request:**
```
GET http://localhost:8000/api/auth/me
```

**Expected Response:**
```json
{
  "detail": "Not authenticated"
}
```

**Status Code:** 401 Unauthorized

---

#### TC-API-009: Logout Endpoint
**Priority:** Medium  
**Description:** Verify logout endpoint returns success message

**Request:**
```
POST http://localhost:8000/api/auth/logout
```

**Expected Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Status Code:** 200 OK

---

#### TC-API-010: Get All Users Endpoint
**Priority:** Medium  
**Description:** Verify `/api/users` returns list of all users

**Request:**
```
GET http://localhost:8000/api/users
```

**Expected Response:**
```json
[
  {
    "id": "prod-head-1",
    "name": "John Smith",
    "email": "john.smith@pharma.com",
    "role": "Production Head",
    "department": "Production",
    "plant_id": "plant-a",
    "is_active": true
  },
  ...
]
```

**Status Code:** 200 OK  
**Note:** Should return only active users

---

#### TC-API-011: Get User by ID
**Priority:** Medium  
**Description:** Verify `/api/users/{user_id}` returns specific user

**Request:**
```
GET http://localhost:8000/api/users/prod-head-1
```

**Expected Response:**
```json
{
  "id": "prod-head-1",
  "name": "John Smith",
  "email": "john.smith@pharma.com",
  "role": "Production Head",
  "department": "Production",
  "plant_id": "plant-a",
  "is_active": true
}
```

**Status Code:** 200 OK

---

#### TC-API-012: Get User by ID - Not Found
**Priority:** Medium  
**Description:** Verify endpoint returns 404 for non-existent user

**Request:**
```
GET http://localhost:8000/api/users/non-existent-id
```

**Expected Response:**
```json
{
  "detail": "User not found"
}
```

**Status Code:** 404 Not Found

---

#### TC-API-013: Metrics Endpoint
**Priority:** Low  
**Description:** Verify `/metrics` endpoint returns Prometheus metrics

**Request:**
```
GET http://localhost:8000/metrics
```

**Expected Result:**
- Returns Prometheus-formatted metrics
- Includes HTTP request metrics
- Includes request duration metrics

**Status Code:** 200 OK

---

### 4.3 Database Testing

#### TC-DB-001: Database Connection
**Priority:** High  
**Description:** Verify database connection is established

**Steps:**
1. Start backend server
2. Check startup logs
3. Verify "Database connection verified" message

**Expected Result:**
- Database connection successful
- No connection errors in logs

---

#### TC-DB-002: Database Initialization
**Priority:** High  
**Description:** Verify database tables are created correctly

**Steps:**
1. Run `python backend/migrations/init_db.py`
2. Check database for tables: `users`, `plants`, `materials`, `notifications`

**Expected Result:**
- All tables are created
- Tables have correct schema
- Primary keys and constraints are set

**SQL Verification:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

#### TC-DB-003: User Data Seeding
**Priority:** High  
**Description:** Verify all 16 users are created in database

**Steps:**
1. Run database initialization
2. Query users table

**Expected Result:**
- 16 users are created
- All users have correct roles
- All users have hashed passwords
- All users are active by default

**SQL Verification:**
```sql
SELECT COUNT(*) FROM users;
SELECT id, name, email, role, department FROM users;
```

---

#### TC-DB-004: Password Hashing
**Priority:** High  
**Description:** Verify passwords are properly hashed

**Steps:**
1. Check `hashed_password` column in users table
2. Verify passwords are not stored in plain text

**Expected Result:**
- Passwords are hashed using bcrypt
- No plain text passwords in database
- Hash format is correct

**SQL Verification:**
```sql
SELECT email, hashed_password FROM users LIMIT 1;
```

---

#### TC-DB-005: Database Indexes
**Priority:** Medium  
**Description:** Verify database indexes are created

**Steps:**
1. Check if indexes exist on key columns
2. Verify index creation in startup logs

**Expected Result:**
- Indexes created on `users.email`
- Indexes created on `notifications.user_id`
- Query performance is optimized

**SQL Verification:**
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'users';
```

---

#### TC-DB-006: Data Integrity - Email Uniqueness
**Priority:** High  
**Description:** Verify email uniqueness constraint

**Steps:**
1. Attempt to insert duplicate email
2. Verify constraint violation

**Expected Result:**
- Duplicate email insertion fails
- Error message indicates constraint violation

**SQL Test:**
```sql
INSERT INTO users (id, name, email, hashed_password, role, department)
VALUES ('test-1', 'Test User', 'john.smith@pharma.com', 'hash', 'Production Head', 'Production');
-- Should fail
```

---

#### TC-DB-007: Data Integrity - Foreign Key Constraints
**Priority:** Medium  
**Description:** Verify foreign key constraints work correctly

**Steps:**
1. Check `plant_id` references in users table
2. Verify constraint enforcement

**Expected Result:**
- Foreign key constraints are enforced
- Invalid `plant_id` values are rejected

---

#### TC-DB-008: Database Query Performance
**Priority:** Low  
**Description:** Verify query performance is acceptable

**Steps:**
1. Execute user lookup query
2. Measure response time

**Expected Result:**
- User lookup query completes in < 100ms
- Indexes are being used (check with EXPLAIN)

**SQL Test:**
```sql
EXPLAIN ANALYZE 
SELECT * FROM users WHERE email = 'john.smith@pharma.com';
```

---

### 4.4 Frontend UI/UX Testing

#### TC-UI-001: Login Page Layout
**Priority:** High  
**Description:** Verify login page displays correctly

**Steps:**
1. Navigate to login page
2. Verify all elements are visible

**Expected Result:**
- Logo is displayed
- "VIRUJ PHARMACEUTICALS" text is visible
- Email input field is present
- Password input field is present
- Sign in button is present
- Footer text is visible

---

#### TC-UI-002: Responsive Design - Desktop
**Priority:** Medium  
**Description:** Verify login page works on desktop (1920x1080)

**Steps:**
1. Open browser in desktop resolution
2. Navigate to login page
3. Verify layout and alignment

**Expected Result:**
- All elements are properly aligned
- Text is readable
- Buttons are appropriately sized
- No horizontal scrolling

---

#### TC-UI-003: Responsive Design - Tablet
**Priority:** Medium  
**Description:** Verify login page works on tablet (768px width)

**Steps:**
1. Resize browser to tablet width
2. Navigate to login page
3. Verify responsive behavior

**Expected Result:**
- Layout adapts to tablet size
- Elements remain accessible
- Text remains readable

---

#### TC-UI-004: Responsive Design - Mobile
**Priority:** Medium  
**Description:** Verify login page works on mobile (375px width)

**Steps:**
1. Resize browser to mobile width
2. Navigate to login page
3. Verify mobile-friendly layout

**Expected Result:**
- Layout adapts to mobile size
- Input fields are easily tappable
- Buttons are appropriately sized
- No horizontal scrolling

---

#### TC-UI-005: Demo Credentials Modal
**Priority:** Medium  
**Description:** Verify demo credentials modal functionality

**Steps:**
1. Click three-dots menu icon (top right)
2. Verify modal opens
3. Verify all 16 credentials are listed
4. Click on a credential card
5. Verify auto-fill functionality

**Expected Result:**
- Modal opens with backdrop
- All credentials are displayed
- Clicking credential auto-fills form
- Modal closes after selection
- Copy icon works correctly

---

#### TC-UI-006: Demo Credentials - Copy Functionality
**Priority:** Low  
**Description:** Verify copy to clipboard works

**Steps:**
1. Open demo credentials modal
2. Click copy icon on any credential
3. Verify credentials are copied

**Expected Result:**
- Copy icon changes to checkmark
- Credentials are copied to clipboard
- Can paste credentials elsewhere

---

#### TC-UI-007: Form Validation - Visual Feedback
**Priority:** Medium  
**Description:** Verify form validation provides visual feedback

**Steps:**
1. Click on email field
2. Verify focus state (green border)
3. Click outside field
4. Verify focus state removed

**Expected Result:**
- Input fields show green border on focus
- Visual feedback is clear and consistent

---

#### TC-UI-008: Error Message Display
**Priority:** High  
**Description:** Verify error messages display correctly

**Steps:**
1. Attempt login with invalid credentials
2. Verify error message appears

**Expected Result:**
- Error message is displayed in red
- Error message is clear and actionable
- Error message disappears on next attempt

---

#### TC-UI-009: Loading State
**Priority:** Medium  
**Description:** Verify loading state during login

**Steps:**
1. Enter valid credentials
2. Click "Sign in" button
3. Observe loading state

**Expected Result:**
- Button shows "Signing in..." text
- Button is disabled during login
- Spinner animation is visible

---

#### TC-UI-010: Logo Display
**Priority:** Low  
**Description:** Verify logo loads correctly

**Steps:**
1. Navigate to login page
2. Verify logo is displayed

**Expected Result:**
- Logo image loads successfully
- Logo is properly sized
- Logo has appropriate spacing

---

#### TC-UI-011: Brand Text Display
**Priority:** Low  
**Description:** Verify "VIRUJ PHARMACEUTICALS" text displays correctly

**Steps:**
1. Navigate to login page
2. Verify brand text

**Expected Result:**
- Text is displayed in single line
- Text is white and readable
- Text is properly aligned with logo

---

#### TC-UI-012: Background Design
**Priority:** Low  
**Description:** Verify background gradient and effects

**Steps:**
1. Navigate to login page
2. Observe background

**Expected Result:**
- Blue gradient background is visible
- Abstract shapes are rendered
- Background doesn't interfere with readability

---

### 4.5 Security Testing

#### TC-SEC-001: SQL Injection Prevention
**Priority:** Critical  
**Description:** Verify SQL injection attacks are prevented

**Test Cases:**
1. Email field: `' OR '1'='1`
2. Email field: `admin@pharma.com'; DROP TABLE users; --`
3. Password field: `' OR '1'='1`

**Expected Result:**
- All SQL injection attempts fail
- No database errors exposed
- Error message: "Invalid email or password"

---

#### TC-SEC-002: XSS Prevention
**Priority:** Critical  
**Description:** Verify XSS attacks are prevented

**Test Cases:**
1. Email field: `<script>alert('XSS')</script>`
2. Email field: `<img src=x onerror=alert('XSS')>`

**Expected Result:**
- Scripts are not executed
- Input is sanitized
- No alert popups appear

---

#### TC-SEC-003: Input Validation
**Priority:** High  
**Description:** Verify input validation on all fields

**Test Cases:**
1. Email: Very long string (> 255 characters)
2. Email: Invalid format (no @ symbol)
3. Email: Special characters
4. Password: Very long string
5. Password: Special characters

**Expected Result:**
- Invalid inputs are rejected
- Appropriate error messages displayed
- No system errors occur

---

#### TC-SEC-004: CORS Configuration
**Priority:** High  
**Description:** Verify CORS is properly configured

**Steps:**
1. Make API request from different origin
2. Verify CORS headers

**Expected Result:**
- Only allowed origins can access API
- CORS headers are present in responses
- Preflight requests are handled correctly

---

#### TC-SEC-005: Rate Limiting
**Priority:** High  
**Description:** Verify rate limiting prevents abuse

**Steps:**
1. Send 6 login requests within 1 minute
2. Verify rate limiting kicks in

**Expected Result:**
- 5 requests succeed
- 6th request is rate limited (429 status)
- Rate limit resets after time window

---

#### TC-SEC-006: JWT Token Security
**Priority:** High  
**Description:** Verify JWT tokens are secure

**Steps:**
1. Log in and obtain token
2. Decode token (without secret)
3. Verify sensitive data is not exposed

**Expected Result:**
- Token contains only necessary claims
- Token is signed with secret key
- Token cannot be modified without detection

---

#### TC-SEC-007: Password Hashing
**Priority:** Critical  
**Description:** Verify passwords are never stored in plain text

**Steps:**
1. Check database directly
2. Verify all passwords are hashed

**Expected Result:**
- No plain text passwords in database
- Passwords are hashed with bcrypt
- Hash verification works correctly

---

#### TC-SEC-008: Security Headers
**Priority:** Medium  
**Description:** Verify security headers are present

**Steps:**
1. Make API request
2. Check response headers

**Expected Result:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security header (if HTTPS)
- Content-Security-Policy header

---

#### TC-SEC-009: Authentication Bypass
**Priority:** Critical  
**Description:** Verify protected endpoints require authentication

**Steps:**
1. Attempt to access `/api/auth/me` without token
2. Attempt to access `/api/users` without token

**Expected Result:**
- All protected endpoints return 401 Unauthorized
- No data is exposed without authentication

---

#### TC-SEC-010: Session Management
**Priority:** High  
**Description:** Verify session management is secure

**Steps:**
1. Log in and obtain token
2. Use expired token
3. Verify token expiration is enforced

**Expected Result:**
- Expired tokens are rejected
- Token expiration time is reasonable (30 days)
- Logout clears token properly

---

### 4.6 Integration Testing

#### TC-INT-001: Frontend-Backend Integration
**Priority:** High  
**Description:** Verify frontend successfully communicates with backend

**Steps:**
1. Start both frontend and backend
2. Log in from frontend
3. Verify API calls are made correctly

**Expected Result:**
- Frontend makes correct API calls
- Backend responds correctly
- Data flows correctly between layers

---

#### TC-INT-002: Database-Backend Integration
**Priority:** High  
**Description:** Verify backend successfully connects to database

**Steps:**
1. Start backend server
2. Verify database connection in logs
3. Make API call that queries database

**Expected Result:**
- Database connection established
- Queries execute successfully
- Data is retrieved correctly

---

#### TC-INT-003: Error Propagation
**Priority:** Medium  
**Description:** Verify errors propagate correctly through layers

**Steps:**
1. Cause database error (e.g., invalid query)
2. Verify error is caught and handled
3. Verify appropriate error message to frontend

**Expected Result:**
- Errors are caught at appropriate layer
- User-friendly error messages displayed
- No stack traces exposed to frontend

---

#### TC-INT-004: Token Storage and Retrieval
**Priority:** High  
**Description:** Verify JWT token is stored and retrieved correctly

**Steps:**
1. Log in from frontend
2. Verify token is stored in localStorage
3. Refresh page
4. Verify token is retrieved and used

**Expected Result:**
- Token is stored in localStorage
- Token is retrieved on page load
- Token is sent with API requests
- User remains logged in after refresh

---

### 4.7 Performance Testing

#### TC-PERF-001: Login Response Time
**Priority:** Medium  
**Description:** Verify login response time is acceptable

**Steps:**
1. Measure time from login click to redirect
2. Verify response time < 2 seconds

**Expected Result:**
- Login completes in < 2 seconds
- No noticeable lag

---

#### TC-PERF-002: API Response Time
**Priority:** Medium  
**Description:** Verify API endpoints respond quickly

**Steps:**
1. Measure response time for `/health` endpoint
2. Measure response time for `/api/auth/login`
3. Measure response time for `/api/users`

**Expected Result:**
- Health endpoint: < 100ms
- Login endpoint: < 500ms
- Users endpoint: < 300ms

---

#### TC-PERF-003: Database Query Performance
**Priority:** Low  
**Description:** Verify database queries are optimized

**Steps:**
1. Execute user lookup query
2. Check query execution plan
3. Verify indexes are used

**Expected Result:**
- Queries use indexes
- Query execution time < 100ms
- No full table scans

---

#### TC-PERF-004: Page Load Time
**Priority:** Medium  
**Description:** Verify login page loads quickly

**Steps:**
1. Measure time to load login page
2. Verify all resources load

**Expected Result:**
- Page loads in < 3 seconds
- All images and assets load
- No broken resources

---

### 4.8 Cross-Browser Testing

#### TC-BROWSER-001: Chrome
**Priority:** High  
**Description:** Verify application works in Chrome

**Steps:**
1. Open application in Chrome
2. Test login functionality
3. Verify UI displays correctly

**Expected Result:**
- All features work correctly
- UI displays properly
- No console errors

---

#### TC-BROWSER-002: Firefox
**Priority:** High  
**Description:** Verify application works in Firefox

**Steps:**
1. Open application in Firefox
2. Test login functionality
3. Verify UI displays correctly

**Expected Result:**
- All features work correctly
- UI displays properly
- No console errors

---

#### TC-BROWSER-003: Safari
**Priority:** Medium  
**Description:** Verify application works in Safari

**Steps:**
1. Open application in Safari
2. Test login functionality
3. Verify UI displays correctly

**Expected Result:**
- All features work correctly
- UI displays properly
- No console errors

---

#### TC-BROWSER-004: Edge
**Priority:** Medium  
**Description:** Verify application works in Edge

**Steps:**
1. Open application in Edge
2. Test login functionality
3. Verify UI displays correctly

**Expected Result:**
- All features work correctly
- UI displays properly
- No console errors

---

### 4.9 Error Handling Testing

#### TC-ERR-001: Network Error Handling
**Priority:** High  
**Description:** Verify network errors are handled gracefully

**Steps:**
1. Stop backend server
2. Attempt to log in from frontend
3. Verify error handling

**Expected Result:**
- User-friendly error message displayed
- No application crash
- Error is logged appropriately

---

#### TC-ERR-002: Database Connection Error
**Priority:** High  
**Description:** Verify database connection errors are handled

**Steps:**
1. Stop database server
2. Attempt to access API
3. Verify error handling

**Expected Result:**
- Appropriate error message returned
- No stack trace exposed
- Error is logged

---

#### TC-ERR-003: Invalid JSON in Request
**Priority:** Medium  
**Description:** Verify invalid JSON is handled

**Steps:**
1. Send request with invalid JSON body
2. Verify error handling

**Expected Result:**
- Appropriate error message returned
- Status code: 400 Bad Request
- No application crash

---

#### TC-ERR-004: Missing Required Fields
**Priority:** Medium  
**Description:** Verify missing required fields are handled

**Steps:**
1. Send login request without email
2. Send login request without password
3. Verify validation

**Expected Result:**
- Validation error returned
- Status code: 422 Unprocessable Entity
- Clear error message

---

## 5. Test Execution Plan

### 5.1 Test Execution Schedule

**Phase 1: Smoke Testing (Day 1)**
- Execute all High Priority test cases
- Verify critical functionality works
- Identify blocking issues

**Phase 2: Functional Testing (Days 2-3)**
- Execute all functional test cases
- Verify all features work as expected
- Document any issues

**Phase 3: Security Testing (Day 4)**
- Execute all security test cases
- Verify security measures are in place
- Document vulnerabilities

**Phase 4: Integration Testing (Day 5)**
- Execute integration test cases
- Verify system components work together
- Test end-to-end workflows

**Phase 5: Performance & Compatibility (Day 6)**
- Execute performance test cases
- Test cross-browser compatibility
- Verify responsive design

**Phase 6: Regression Testing (Day 7)**
- Re-test fixed issues
- Execute critical test cases again
- Final verification

### 5.2 Test Execution Guidelines

1. **Test Environment Setup**
   - Ensure all prerequisites are met
   - Verify database is initialized
   - Confirm backend and frontend are running

2. **Test Data Preparation**
   - Use demo credentials provided
   - Create additional test data if needed
   - Document any custom test data

3. **Test Execution**
   - Execute test cases in order of priority
   - Document actual results vs expected results
   - Capture screenshots for UI tests
   - Record API responses for API tests

4. **Defect Reporting**
   - Report defects immediately
   - Include steps to reproduce
   - Attach screenshots/logs
   - Assign priority and severity

5. **Test Completion**
   - Verify all test cases are executed
   - Review test results
   - Prepare test summary report

---

## 6. Defect Management

### 6.1 Defect Severity Levels

**Critical (P1)**
- System crash or data loss
- Security vulnerability
- Complete feature failure
- Blocks testing

**High (P2)**
- Major feature malfunction
- Significant data issue
- Performance degradation
- Workaround available

**Medium (P3)**
- Minor feature issue
- UI/UX problem
- Non-critical error
- Easy workaround

**Low (P4)**
- Cosmetic issue
- Minor UI inconsistency
- Documentation issue
- Enhancement suggestion

### 6.2 Defect Reporting Template

**Defect ID:** DEF-001  
**Title:** [Brief description]  
**Severity:** [Critical/High/Medium/Low]  
**Priority:** [P1/P2/P3/P4]  
**Status:** [New/Open/In Progress/Fixed/Closed]  
**Assigned To:** [Developer name]  
**Reported By:** [Tester name]  
**Reported Date:** [Date]  

**Description:**
[Detailed description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Environment:**
- Browser: [Browser and version]
- OS: [Operating system]
- Backend Version: [Version]
- Frontend Version: [Version]

**Screenshots/Logs:**
[Attach relevant files]

---

## 7. Test Deliverables

### 7.1 Test Artifacts

1. **Test Plan Document** (This document)
2. **Test Cases** (Detailed test cases with results)
3. **Test Execution Report** (Summary of test execution)
4. **Defect Report** (List of all defects found)
5. **Test Summary Report** (Overall testing summary)

### 7.2 Test Summary Report Template

**Test Summary Report**

**Project:** Viruj Pharmaceuticals ERP System  
**Test Phase:** Pre-Production Testing  
**Test Period:** [Start Date] to [End Date]  
**Tested By:** [QA Team]  

**Test Statistics:**
- Total Test Cases: [Number]
- Passed: [Number]
- Failed: [Number]
- Blocked: [Number]
- Not Executed: [Number]
- Pass Rate: [Percentage]

**Defect Statistics:**
- Total Defects: [Number]
- Critical: [Number]
- High: [Number]
- Medium: [Number]
- Low: [Number]
- Fixed: [Number]
- Open: [Number]

**Test Coverage:**
- Functional Testing: [Percentage]
- Security Testing: [Percentage]
- Integration Testing: [Percentage]
- Performance Testing: [Percentage]

**Recommendations:**
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]

**Sign-off:**
- QA Lead: [Name, Date]
- Development Lead: [Name, Date]
- Project Manager: [Name, Date]

---

## 8. Test Tools and Resources

### 8.1 Recommended Tools

**API Testing:**
- Postman
- Insomnia
- curl
- HTTPie

**Database Testing:**
- pgAdmin
- psql (command line)
- DBeaver

**Browser Testing:**
- Chrome DevTools
- Firefox Developer Tools
- BrowserStack (for cross-browser testing)

**Performance Testing:**
- Chrome DevTools Network tab
- Postman Collection Runner
- Apache JMeter (for load testing)

**Security Testing:**
- OWASP ZAP
- Burp Suite
- Browser DevTools Security tab

### 8.2 Test Data

**Demo Credentials:**
All demo credentials are available in the Login page demo credentials modal. Password for all users: `demo123`

**Database Connection:**
- Host: `localhost`
- Port: `5432`
- Database: `viruj_erp`
- User: `viruj_app`
- Password: [From .env file]

---

## 9. Risk Assessment

### 9.1 Testing Risks

**Risk 1: Incomplete Test Coverage**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:** Regular review of test cases, add missing scenarios

**Risk 2: Environment Issues**
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Document environment setup, maintain test environment

**Risk 3: Time Constraints**
- **Impact:** High
- **Probability:** Medium
- **Mitigation:** Prioritize test cases, focus on critical paths

**Risk 4: Data Issues**
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:** Use consistent test data, backup database before testing

---

## 10. Sign-off and Approval

This test plan has been reviewed and approved by:

**QA Lead:** _________________ Date: ________  
**Development Lead:** _________________ Date: ________  
**Project Manager:** _________________ Date: ________  

---

## Appendix A: Test Case Checklist

Use this checklist to track test execution:

### Authentication & Login
- [ ] TC-AUTH-001: Valid Login
- [ ] TC-AUTH-002: Invalid Email
- [ ] TC-AUTH-003: Invalid Password
- [ ] TC-AUTH-004: Empty Email Field
- [ ] TC-AUTH-005: Empty Password Field
- [ ] TC-AUTH-006: Password Visibility Toggle
- [ ] TC-AUTH-007: Login with All User Roles
- [ ] TC-AUTH-008: Session Persistence
- [ ] TC-AUTH-009: Logout Functionality
- [ ] TC-AUTH-010: Inactive User Login

### API Endpoints
- [ ] TC-API-001: Health Check Endpoint
- [ ] TC-API-002: Root Endpoint
- [ ] TC-API-003: Login Endpoint - Success
- [ ] TC-API-004: Login Endpoint - Invalid Credentials
- [ ] TC-API-005: Login Endpoint - Rate Limiting
- [ ] TC-API-006: Get Current User Endpoint
- [ ] TC-API-007: Get Current User - Invalid Token
- [ ] TC-API-008: Get Current User - No Token
- [ ] TC-API-009: Logout Endpoint
- [ ] TC-API-010: Get All Users Endpoint
- [ ] TC-API-011: Get User by ID
- [ ] TC-API-012: Get User by ID - Not Found
- [ ] TC-API-013: Metrics Endpoint

### Database
- [ ] TC-DB-001: Database Connection
- [ ] TC-DB-002: Database Initialization
- [ ] TC-DB-003: User Data Seeding
- [ ] TC-DB-004: Password Hashing
- [ ] TC-DB-005: Database Indexes
- [ ] TC-DB-006: Data Integrity - Email Uniqueness
- [ ] TC-DB-007: Data Integrity - Foreign Key Constraints
- [ ] TC-DB-008: Database Query Performance

### Frontend UI/UX
- [ ] TC-UI-001: Login Page Layout
- [ ] TC-UI-002: Responsive Design - Desktop
- [ ] TC-UI-003: Responsive Design - Tablet
- [ ] TC-UI-004: Responsive Design - Mobile
- [ ] TC-UI-005: Demo Credentials Modal
- [ ] TC-UI-006: Demo Credentials - Copy Functionality
- [ ] TC-UI-007: Form Validation - Visual Feedback
- [ ] TC-UI-008: Error Message Display
- [ ] TC-UI-009: Loading State
- [ ] TC-UI-010: Logo Display
- [ ] TC-UI-011: Brand Text Display
- [ ] TC-UI-012: Background Design

### Security
- [ ] TC-SEC-001: SQL Injection Prevention
- [ ] TC-SEC-002: XSS Prevention
- [ ] TC-SEC-003: Input Validation
- [ ] TC-SEC-004: CORS Configuration
- [ ] TC-SEC-005: Rate Limiting
- [ ] TC-SEC-006: JWT Token Security
- [ ] TC-SEC-007: Password Hashing
- [ ] TC-SEC-008: Security Headers
- [ ] TC-SEC-009: Authentication Bypass
- [ ] TC-SEC-010: Session Management

### Integration
- [ ] TC-INT-001: Frontend-Backend Integration
- [ ] TC-INT-002: Database-Backend Integration
- [ ] TC-INT-003: Error Propagation
- [ ] TC-INT-004: Token Storage and Retrieval

### Performance
- [ ] TC-PERF-001: Login Response Time
- [ ] TC-PERF-002: API Response Time
- [ ] TC-PERF-003: Database Query Performance
- [ ] TC-PERF-004: Page Load Time

### Cross-Browser
- [ ] TC-BROWSER-001: Chrome
- [ ] TC-BROWSER-002: Firefox
- [ ] TC-BROWSER-003: Safari
- [ ] TC-BROWSER-004: Edge

### Error Handling
- [ ] TC-ERR-001: Network Error Handling
- [ ] TC-ERR-002: Database Connection Error
- [ ] TC-ERR-003: Invalid JSON in Request
- [ ] TC-ERR-004: Missing Required Fields

---

**Total Test Cases: 80+**

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-27 | QA Team | Initial test plan creation |

---

**End of Test Plan Document**

