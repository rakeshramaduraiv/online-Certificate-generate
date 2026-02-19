# 🚀 Deployment Guide — Certificate Management System

## Project Structure

```
Certificate Management/
├── backend/               # Spring Boot (Java 17) — REST API
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile         ← Multi-stage (Maven build → slim JRE runtime)
│   └── src/main/resources/
│       ├── application.properties       ← Dev (H2 in-memory)
│       └── application-prod.properties  ← Prod (PostgreSQL)
├── frontend/              # React 18 — SPA
│   ├── src/
│   ├── package.json
│   ├── Dockerfile         ← Multi-stage (Node build → nginx serve)
│   └── nginx.conf
├── docker-compose.yml     ← Full stack with PostgreSQL
├── .env.example           ← Copy to .env and fill in
└── .gitignore
```

---

## Option 1: Docker Compose (Recommended for Self-Hosting)

### Prerequisites
- Docker Desktop installed and running

### Steps

```bash
# 1. Copy .env.example to .env and fill in your values
copy .env.example .env
# Edit .env with a text editor (Notepad, VS Code, etc.)

# 2. Build and start all services
docker-compose up --build

# 3. App will be available at:
#    Frontend → http://localhost:3001
#    Backend  → http://localhost:8080
#    API Docs → http://localhost:8080/swagger-ui.html
```

### Stop / Clean up
```bash
docker-compose down         # Stop containers
docker-compose down -v      # Stop + delete database volume
```

---

## Option 2: Render.com + Railway Deployment (Free Tier)

### Database (PostgreSQL → Railway)

1. Go to [railway.app](https://railway.app) → **New Project → PostgreSQL**
2. Copy the `DATABASE_URL` from the Railway dashboard
3. Note the `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` values

### Backend (Spring Boot → Render Web Service)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Docker (uses your `backend/Dockerfile`)
   - **Build Command:** *(leave blank, Docker handles it)*
5. Add **Environment Variables** in Render dashboard:

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:postgresql://<host>:<port>/<dbname>` |
| `DB_USERNAME` | Your Railway DB username |
| `DB_PASSWORD` | Your Railway DB password |
| `JWT_SECRET` | A long random secret (64+ chars) |
| `CORS_ALLOWED_ORIGINS` | Your frontend URL on Netlify/Vercel |
| `PORT` | `8080` *(Render sets this automatically)* |

> **Database**: Use [Railway PostgreSQL](https://railway.app) for a free managed database.

### Frontend (React → Netlify or Vercel)

#### Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Connect GitHub, select repo
3. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
4. Add **Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com`

#### Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `REACT_APP_API_URL` = your backend URL

---

## Option 3: Run Locally (Without Docker)

### Backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
# Create .env file
echo REACT_APP_API_URL=http://localhost:8080 > .env
npm install
npm start
# Runs on http://localhost:3000
```

---

## Environment Variables Reference

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | Production only | Set to `prod` |
| `JWT_SECRET` | ✅ Required | 256-bit+ random secret |
| `JWT_EXPIRATION` | Optional | Token TTL in ms (default: 86400000) |
| `DB_URL` | Production only | PostgreSQL JDBC URL (`jdbc:postgresql://host:port/db`) |
| `DB_USERNAME` | Production only | Database username |
| `DB_PASSWORD` | Production only | Database password |
| `CORS_ALLOWED_ORIGINS` | Recommended | Your frontend URL (comma-separated for multiple) |
| `PORT` | Optional | Server port (default: 8080) |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | ✅ Required | Backend API base URL |

---

## Security Checklist Before Going Live

- [ ] `JWT_SECRET` is at least 64 characters of random data
- [ ] Database credentials are strong and unique
- [ ] `SPRING_PROFILES_ACTIVE=prod` is set (disables H2 console)
- [ ] `CORS_ALLOWED_ORIGINS` is set to your actual frontend URL only
- [ ] HTTPS is enabled on both frontend and backend
- [ ] `.env` is in `.gitignore` and never committed to Git
- [ ] Default admin password is changed after first login

---

## Default Admin Credentials

On first startup, the system creates default users:

| Role | Email | Password |
|------|-------|----------|
| System Admin | `admin@certificate.com` | `Admin@123` |
| Certificate Admin | `certadmin@certificate.com` | `CertAdmin@123` |
| Instructor | `instructor@certificate.com` | `Instructor@123` |
| Student | `student@certificate.com` | `Student@123` |

> ⚠️ **Change all default passwords immediately after first login in production!**

---

## API Documentation

After starting the backend, Swagger UI is available at:
- Local: `http://localhost:8080/swagger-ui.html`
- Production: `https://your-backend.onrender.com/swagger-ui.html`