# API Testing Guide

## Authentication Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@system.com",
    "password": "admin123"
  }'
```

## Certificate Endpoints (Requires JWT Token)

### 3. Get All Certificates (Admin Only)
```bash
curl -X GET http://localhost:8080/api/certificates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get My Certificates
```bash
curl -X GET http://localhost:8080/api/certificates/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Create Certificate
```bash
curl -X POST http://localhost:8080/api/certificates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "courseId": 1,
    "recipientId": 1
  }'
```

## Template Endpoints

### 6. Get All Templates
```bash
curl -X GET http://localhost:8080/api/templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Create Template (Admin Only)
```bash
curl -X POST http://localhost:8080/api/templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Basic Certificate Template",
    "designData": "Template design JSON data here",
    "version": 1
  }'
```

## Verification Endpoint (Public)

### 8. Verify Certificate
```bash
curl -X GET http://localhost:8080/api/verify/ABC123DEF456
```

## User Management (Admin Only)

### 9. Get All Users
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Default Test Users

After starting the application, you can use these default users:

1. **System Admin**
   - Email: admin@system.com
   - Password: admin123

2. **Certificate Admin**
   - Email: certadmin@system.com
   - Password: cert123

3. **Instructor**
   - Email: instructor@system.com
   - Password: instructor123

4. **Student**
   - Email: student@system.com
   - Password: student123

## Postman Collection

Import the following JSON into Postman:

```json
{
  "info": {
    "name": "Certificate Generator API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@system.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fullName\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"STUDENT\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## Testing Steps

1. Start the application: `mvn spring-boot:run`
2. Login with admin credentials to get JWT token
3. Use the token in Authorization header for protected endpoints
4. Test certificate verification with public endpoint