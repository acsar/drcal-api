# Healthcare Professionals Management

This module implements complete management of healthcare professionals in the DrCal API (open source scheduling system for healthcare professionals), allowing you to create, list, search, update, and delete professionals associated with authenticated users.

## 📋 Table Structure

The `public.professionals` table has the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | ✅ | Unique ID (auto-generated) |
| `name` | TEXT | ✅ | Professional's name |
| `specialty` | TEXT | ❌ | Medical specialty |
| `slug` | TEXT | ✅ | Friendly URL identifier (unique) |
| `crm` | TEXT | ❌ | Regional Medical Council registration |
| `rqe` | TEXT | ❌ | Specialist Qualification Registration |
| `img_url` | TEXT | ❌ | Professional's image URL |
| `user_id` | UUID | ✅ | Linked to the logged-in user |
| `created_at` | TIMESTAMPTZ | ✅ | Creation date (automatic) |
| `updated_at` | TIMESTAMPTZ | ✅ | Update date (automatic) |

## 🔗 Available Routes

### Authenticated (requires API Key)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/professionals` | Create new professional |
| `GET` | `/professionals` | List all user's professionals |
| `GET` | `/professionals/:id` | Get professional by ID |
| `GET` | `/professionals/slug/:slug` | Get professional by slug (private) |
| `PUT` | `/professionals/:id` | Update professional |
| `DELETE` | `/professionals/:id` | Delete professional |

### Public (no authentication)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/professionals/public/:slug` | Get professional by slug (public) |

## 🔐 Authentication

All authenticated routes require the `x-api-key` header with the user's API key:

```http
x-api-key: your-api-key-here
```

## 📝 Usage Examples

### Create Professional

```http
POST /professionals
Content-Type: application/json
x-api-key: your-api-key

{
  "name": "Dr. John Smith",
  "specialty": "Cardiology",
  "slug": "dr-john-smith",
  "crm": "12345-SP",
  "rqe": "67890",
  "img_url": "https://example.com/photo.jpg"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Professional created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Dr. John Smith",
    "specialty": "Cardiology",
    "slug": "dr-john-smith",
    "crm": "12345-SP",
    "rqe": "67890",
    "img_url": "https://example.com/photo.jpg",
    "user_id": "user-uuid-here",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### List Professionals

```http
GET /professionals
x-api-key: your-api-key
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Professionals listed successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Dr. John Smith",
      "specialty": "Cardiology",
      "slug": "dr-john-smith",
      "crm": "12345-SP",
      "rqe": "67890",
      "img_url": "https://example.com/photo.jpg",
      "user_id": "user-uuid-here",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  ],
  "count": 1
}
```

### Search by Slug (Public)

```http
GET /professionals/public/dr-john-smith
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Professional found",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Dr. John Smith",
    "specialty": "Cardiology",
    "slug": "dr-john-smith",
    "crm": "12345-SP",
    "rqe": "67890",
    "img_url": "https://example.com/photo.jpg",
    "user_id": "user-uuid-here",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

## ⚠️ Error Handling

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Name and slug are required"
  }
}
```

### Duplicate Slug (409)
```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "DUPLICATE_SLUG",
    "details": "Slug already exists"
  }
}
```

### Professional Not Found (404)
```json
{
  "success": false,
  "message": "Professional not found",
  "error": {
    "code": "NOT_FOUND",
    "details": "Professional not found"
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "API key is required",
  "error": "MISSING_API_KEY"
}
```

## 🧪 Tests

Use the `examples/professionals-tests.http` file to test all features:

1. Replace `{{API_KEY}}` with your real API key
2. Replace `{{PROFESSIONAL_ID}}` with the ID returned when creating a professional
3. Run the tests in order to verify all features

## 📚 Swagger Documentation

Access the interactive documentation at:
```
http://localhost:3000/docs
```

## 🛠️ Module Files

- **Service**: `src/services/professionalService.js`
- **Controller**: `src/controllers/professionalController.js`
- **Routes**: `src/routes/professionals.js`
- **Documentation**: `src/docs/swagger.js` (schema added)
- **Tests**: `examples/professionals-tests.http`

## 🚀 Implemented Features

✅ **Full CRUD**
- Create professional
- List user's professionals
- Search by ID
- Search by slug (private and public)
- Update professional
- Delete professional

✅ **Validations**
- Required fields (name, slug)
- Unique slug per user
- Permission check (user only accesses their own professionals)

✅ **Error Handling**
- Data validation
- Professional not found
- Duplicate slug
- Authentication errors

✅ **Documentation**
- Complete Swagger
- Usage examples
- Standardized error codes

✅ **Security**
- API key authentication
- User isolation
- Permission validation 