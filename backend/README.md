# Online Course Certificate Generator System

A complete Spring Boot 3 backend system for managing online course certificates with JWT authentication, role-based authorization, and certificate verification.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for multiple user roles (Student, Instructor, Certificate Admin, Institution Admin, System Admin, Verifier)
- **Certificate Management**: Complete CRUD operations for certificates
- **Template Management**: Certificate template creation and management
- **Verification System**: Public certificate verification using verification codes
- **Audit Logging**: Comprehensive logging of verification attempts
- **Security**: BCrypt password encoding, JWT token expiration based on roles

## Technologies Used

- Spring Boot 3.2.0
- Spring Security 6
- Spring Data JPA
- MySQL 8.0
- JWT (HS256)
- Lombok
- Maven
- Docker

## Project Structure

```
com.examly.springapp/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── exception/      # Exception handling
├── repository/     # JPA repositories
├── security/       # Security configuration
└── service/        # Business logic services
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0
- Docker (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd onlinesrs
   ```

2. **Setup MySQL Database**
   ```sql
   CREATE DATABASE cert_db;
   ```

3. **Configure Application Properties**
   Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Build and Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Access the Application**
   - Backend API: http://localhost:8080
   - API Documentation: Check `API_TESTING.md`

### Docker Setup

1. **Build the application**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## Default Users

The application seeds the following default users:

| Role | Email | Password |
|------|-------|----------|
| System Admin | admin@system.com | admin123 |
| Certificate Admin | certadmin@system.com | cert123 |
| Instructor | instructor@system.com | instructor123 |
| Student | student@system.com | student123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Certificates
- `GET /api/certificates` - Get all certificates (Admin only)
- `GET /api/certificates/my` - Get user's certificates
- `POST /api/certificates` - Create certificate
- `PUT /api/certificates/{id}` - Update certificate
- `DELETE /api/certificates/{id}` - Delete certificate

### Templates
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template (Admin only)
- `PUT /api/templates/{id}` - Update template
- `DELETE /api/templates/{id}` - Delete template

### Users
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Verification
- `GET /api/verify/{code}` - Verify certificate (Public)

## Role-Based Access Control

- **Student**: View own certificates
- **Instructor**: Create certificates, verify course completion
- **Certificate Admin**: Manage templates and certificates
- **Institution Admin**: Manage users within institution
- **System Admin**: Full system access
- **Verifier**: Verify certificates

## JWT Token Expiration

- Students: 8 hours
- Instructors: 12 hours
- Admins: 6 hours
- Refresh tokens: 7 days

## Testing

See `API_TESTING.md` for detailed API testing instructions including:
- cURL commands
- Postman collection
- Sample requests and responses

## Security Features

- Password encryption using BCrypt
- JWT token-based authentication
- Role-based authorization
- CORS configuration for frontend integration
- Request validation
- Global exception handling

## Database Schema

The application uses the following main entities:
- **User**: System users with roles
- **Institution**: Educational institutions
- **Course**: Course information
- **Certificate**: Generated certificates
- **CertificateTemplate**: Certificate design templates
- **VerificationLog**: Audit trail for verifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.