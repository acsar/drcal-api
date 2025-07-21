# Authentication - DrCal API

## Overview

The DrCal API uses a **hybrid authentication system** that combines **Supabase Auth** (JWT) for user authentication and **API Keys** for programmatic access to resources.

## Authentication System

### 1. User Authentication (Supabase Auth)
For operations that require user authentication (login, registration, API key regeneration):

- **Login/Logout** via Supabase Auth
- **User registration**
- **Password recovery**
- **JWT tokens** for sessions

### 2. Programmatic Authentication (API Keys)
For programmatic access to API resources:

- **Unique API Keys** per user
- **Authentication via** `x-api-key` **header**
- **Direct access** to protected endpoints

## Authentication Flow

### Step 1: User Registration
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Check your email to confirm.",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  }
}
```

### Step 2: Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "api_key": "your_api_key_here",
    "is_active": true
  }
}
```

### Step 3: Use the API Key
With the API key obtained at login, you can access resources:

```http
GET /users/me
x-api-key: your_api_key_here
```

### Step 4: Regenerate API Key (if needed)
If you need to regenerate your API key:

```http
POST /users/me/api-key
Authorization: Bearer your_jwt_token_here
```

## Using Swagger UI

### Setting Up Authentication in Swagger

1. **Access Swagger documentation**: `http://localhost:3000/docs`

2. **For endpoints using API Key**:
   - Click the **"Authorize"** button (lock icon)
   - In the `x-api-key` field, enter your API key
   - Click **"Authorize"**

3. **For endpoints using JWT Bearer**:
   - Click the **"Authorize"** button (lock icon)
   - In the `BearerAuth` field, enter your JWT token (without "Bearer ")
   - Click **"Authorize"**

### Practical Example in Swagger

1. **Login first**:
   - Use the `POST /users/login` route
   - Copy the `access_token` from the response

2. **Set up Bearer authentication**:
   - Click **"Authorize"**
   - Paste the token in the `BearerAuth` field
   - Click **"Authorize"**

3. **Test API key regeneration**:
   - Use the `POST /users/me/api-key` route
   - It should now work with the configured token

## Authentication Endpoints

### 🔐 User Authentication
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/logout` - User logout
- `POST /users/forgot-password` - Password recovery

### 🔑 API Key Operations
- `POST /users/me/api-key` - Regenerate API key (requires JWT)
- `GET /users/me` - User info (requires API key)
- `PUT /users/me/status` - Update status (requires API key)

### 🔒 Protected Endpoints (API Key)
- `POST /appointments` - Create appointment
- `POST /appointments/waitlist` - Add to waitlist
- `GET /appointments/waitlist` - List waitlist
- `GET /appointments/queue/stats` - Queue statistics
- `GET /users` - List users (Admin)
- `GET /users/{userId}` - Get user (Admin)
- `PUT /users/{userId}/status` - Update user (Admin)
- `DELETE /users/{userId}` - Delete user (Admin)

### 🔓 Public Endpoints
- `GET /` - API info
- `GET /health` - Health check
- `GET /docs` - Swagger documentation
- `GET /appointments/available` - Available slots
- `POST /webhooks/supabase` - Supabase webhook

## Password Recovery

### Request Recovery
```http
POST /users/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Supabase will send an email with a link to reset your password.

## API Key Regeneration

### Scenario: Lost/Compromised API Key
1. **Login** with email/password
2. **Use the JWT token** to regenerate the API key
3. **No need** for the old API key

```http
POST /users/me/api-key
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "API key successfully regenerated",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "api_key": "new_generated_api_key",
    "is_active": true
  }
}
```

## Usage Examples

### JavaScript/Node.js
```javascript
// 1. Login
const loginResponse = await fetch('/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data: { access_token, api_key } } = await loginResponse.json();

// 2. Use API key for resources
const userResponse = await fetch('/users/me', {
  headers: {
    'x-api-key': api_key
  }
});

// 3. Regenerate API key if needed
const regenerateResponse = await fetch('/users/me/api-key', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

### cURL
```bash
# Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use API key
curl -X GET http://localhost:3000/users/me \
  -H "x-api-key: your_api_key_here"

# Regenerate API key
curl -X POST http://localhost:3000/users/me/api-key \
  -H "Authorization: Bearer your_jwt_token_here"
```

## Security

### Implemented Validations
- ✅ JWT authentication via Supabase Auth
- ✅ Unique API keys per user
- ✅ Active user check
- ✅ Secure API key regeneration
- ✅ Password recovery via email
- ✅ Authentication logs

### Best Practices
1. **Keep your JWT token secure** - Use HTTPS in production
2. **Regenerate API keys regularly** - For security
3. **Use strong passwords** - For user accounts
4. **Monitor usage** - Of the API and tokens
5. **Logout** - When not using

## Supabase Configuration

### Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=http://localhost:3000
```

### `users` Table
The `users` table is automatically created by the `handle_new_user()` trigger when a user registers in Supabase Auth.

## Error Codes

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Authentication token is required",
  "error": "MISSING_TOKEN"
}
```

### 401 - Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": "INVALID_TOKEN"
}
```

### 403 - Inactive User
```json
{
  "success": false,
  "message": "Inactive or not found user",
  "error": "INACTIVE_USER"
}
```

## Support

If you have authentication issues:
1. Check if the email was confirmed in Supabase
2. Confirm the user is active in the `users` table
3. Test login via Supabase Dashboard
4. Check application logs
5. Use password recovery if needed 
