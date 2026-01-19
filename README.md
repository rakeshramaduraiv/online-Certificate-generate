# Certificate Management System (CertiChain)

A comprehensive certificate management system built with Spring Boot (backend) and React.js (frontend), designed to streamline how educational institutions issue and verify certificates.

## 🏗️ System Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Spring Security
- **Database**: MySQL with JPA/Hibernate
- **Authentication**: JWT-based authentication
- **API Documentation**: Swagger/OpenAPI 3

### Frontend (React.js)
- **Framework**: React 18 with React Router
- **HTTP Client**: Axios with interceptors
- **Styling**: CSS with responsive design
- **State Management**: Context API

## 👥 User Roles

### 1. System Admin
- Manages institutions and users
- Invites institution administrators
- Oversees the entire platform
- **Default Login**: admin@examly.com / 1234

### 2. Institution Admin
- Manages certificate templates
- Issues certificates to students
- Views institution statistics
- **Signup**: Requires invite token from System Admin

### 3. Student
- Views and downloads issued certificates
- Registers under an institution
- **Default Login**: student@examly.com / student123

### 4. Verifier
- Verifies certificate authenticity
- Views verification history
- **Default Login**: verifier@examly.com / verify123

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. **Clone the repository**
   ```bash
   cd srs/springapp
   ```

2. **Configure Database**
   - Create MySQL database: `certificate_db`
   - Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost/certificate_db?createDatabaseIfNotExist=true
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   - Backend will start on `http://localhost:8080`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd srs/reactapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   - Frontend will start on `http://localhost:8081`

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for each user type
- **Password Encryption**: BCrypt password hashing
- **Input Validation**: Comprehensive validation on both frontend and backend
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📋 Key Features

### Certificate Management
- **Template Creation**: Custom certificate templates for institutions
- **Certificate Issuance**: Issue certificates to students with unique verification codes
- **Bulk Operations**: Support for batch certificate generation
- **PDF Generation**: Generate downloadable PDF certificates

### Verification System
- **Public Verification**: Anyone can verify certificates using verification codes
- **QR Code Support**: Quick verification through QR codes
- **Verification History**: Track all verification attempts
- **Anti-Fraud Measures**: Tamper detection and security validation

### Institution Management
- **Multi-Institution Support**: Support for multiple educational institutions
- **Institution Branding**: Custom branding for each institution
- **Admin Invitations**: Secure invitation system for institution administrators
- **Statistics Dashboard**: Comprehensive analytics and reporting

## 🛠️ API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /auth/institutions` - List all institutions

### Certificate Management
- `POST /institution/issue` - Issue certificate
- `GET /certificates/student/view/{email}` - Get student certificates
- `GET /certificates/institution/{id}` - Get institution certificates

### Verification
- `GET /verify/{code}` - Verify certificate (public endpoint)

### Templates
- `POST /templates/create` - Create certificate template
- `GET /templates/my` - Get institution templates
- `PUT /templates/{id}` - Update template
- `DELETE /templates/{id}` - Delete template

### System Administration
- `POST /system/institutions` - Create institution
- `POST /system/invite` - Invite institution admin
- `GET /system/users` - List all users

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts with roles and institution associations
- **institutions**: Educational institutions
- **certificate_templates**: Certificate design templates
- **certificates**: Issued certificates with verification codes
- **invite_tokens**: Invitation tokens for institution admins

## 🔧 Configuration

### Environment Variables
- `JWT_SECRET`: Secret key for JWT token signing
- `MYSQL_URL`: Database connection URL
- `MYSQL_USERNAME`: Database username
- `MYSQL_PASSWORD`: Database password

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost/certificate_db
spring.datasource.username=root
spring.datasource.password=examly

# JWT
jwt.secret=${JWT_SECRET:defaultSecretKey}
jwt.expiration=28800

# Server
server.port=8080
```

## 🧪 Testing

### Backend Testing
```bash
cd srs/springapp
mvn test
```

### Frontend Testing
```bash
cd srs/reactapp
npm test
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🔄 Workflow

1. **System Admin** creates institutions and invites Institution Admins
2. **Institution Admin** signs up using invite token and creates certificate templates
3. **Students** register under institutions
4. **Institution Admin** issues certificates to students
5. **Students** view and download their certificates
6. **Verifiers** can verify certificate authenticity using verification codes
7. **Public users** can verify certificates without authentication

## 🚀 Deployment

### Production Considerations
- Use environment-specific configuration files
- Set up proper SSL/TLS certificates
- Configure production database with connection pooling
- Set up monitoring and logging
- Use a reverse proxy (nginx) for static file serving
- Implement rate limiting and security headers

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM openjdk:17-jdk-slim
COPY target/springapp-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]

# Frontend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8081
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints in Swagger UI
- Check the browser console for frontend issues
- Review application logs for backend issues

## 🔮 Future Enhancements

- Mobile native applications
- Blockchain integration for immutable certificates
- Advanced analytics and reporting
- Multi-language support
- Integration with learning management systems
- Automated certificate generation based on course completion
- Advanced template designer with drag-and-drop interface