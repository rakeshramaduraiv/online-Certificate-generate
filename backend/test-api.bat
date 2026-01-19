@echo off
echo Testing Certificate Generator API...
echo.

echo 1. Testing Health Check (should return 404 - no health endpoint configured)
curl -X GET http://localhost:8080/actuator/health
echo.
echo.

echo 2. Testing Registration
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"STUDENT\"}"
echo.
echo.

echo 3. Testing Login
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@system.com\",\"password\":\"admin123\"}"
echo.
echo.

echo 4. Testing Certificate Verification (should return 404 for invalid code)
curl -X GET http://localhost:8080/api/verify/INVALID123
echo.
echo.

echo API Testing Complete!
pause