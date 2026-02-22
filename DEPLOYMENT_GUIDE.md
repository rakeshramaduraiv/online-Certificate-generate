# Deployment Guide - Render (Backend) + Vercel (Frontend)

## Prerequisites
- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)

---

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
cd "c:\Users\balan\OneDrive\Desktop\Certificate Management"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create PostgreSQL Database on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `certichain-db`
   - Database: `certificate_db`
   - User: `certichain_user`
   - Region: Choose closest to you
   - Plan: Free
4. Click "Create Database"
5. **Save the connection details** (Internal Database URL, External Database URL, Username, Password)

### Step 3: Deploy Backend Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - Name: `certichain-backend`
   - Region: Same as database
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Java`
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/springapp-0.0.1-SNAPSHOT.jar`
   - Plan: Free

4. Add Environment Variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=<generate-random-64-char-string>
   JWT_EXPIRATION=86400000
   DB_URL=<internal-database-url-from-step-2>
   DB_USERNAME=<username-from-step-2>
   DB_PASSWORD=<password-from-step-2>
   CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
   ```

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. **Copy your backend URL**: `https://certichain-backend.onrender.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variable
1. Edit `frontend\.env.production`:
   ```
   REACT_APP_API_URL=https://certichain-backend.onrender.com
   ```

2. Commit and push:
   ```bash
   git add frontend/.env.production
   git commit -m "Update backend URL"
   git push
   ```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://certichain-backend.onrender.com
   ```

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. **Copy your frontend URL**: `https://your-app.vercel.app`

### Step 3: Update CORS on Backend
1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment"
4. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app
   ```
5. Save changes (service will redeploy)

---

## Part 3: Test Deployment

### Test Backend
```bash
curl https://certichain-backend.onrender.com/api/auth/login
```

### Test Frontend
1. Open `https://your-app.vercel.app`
2. Try logging in with default credentials:
   - Admin: admin@examly.com / 1234
   - Student: student@examly.com / student123

---

## Important Notes

### Render Free Tier Limitations
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Database has 90-day expiration (backup data regularly)

### Vercel Free Tier
- Unlimited deployments
- Automatic HTTPS
- Global CDN

### Security Recommendations
1. Change default user passwords immediately
2. Use strong JWT_SECRET (64+ characters)
3. Enable HTTPS only in production
4. Regularly backup PostgreSQL database

---

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify database connection string
- Check Render logs: Dashboard → Service → Logs

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS_ALLOWED_ORIGINS includes your Vercel URL
- Open browser console for errors

### Database connection errors
- Verify DB_URL, DB_USERNAME, DB_PASSWORD
- Check database is running on Render
- Use Internal Database URL (not External)

---

## Monitoring

### Render
- View logs: Dashboard → Service → Logs
- Monitor metrics: Dashboard → Service → Metrics

### Vercel
- View deployments: Dashboard → Project → Deployments
- Check analytics: Dashboard → Project → Analytics

---

## Updating the Application

### Backend Updates
```bash
git add backend/
git commit -m "Update backend"
git push
```
Render auto-deploys on push.

### Frontend Updates
```bash
git add frontend/
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push.

---

## Cost Optimization

Both services are FREE for this project size:
- Render: 750 hours/month free
- Vercel: Unlimited bandwidth for personal projects
- PostgreSQL: Free tier with 1GB storage

---

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
