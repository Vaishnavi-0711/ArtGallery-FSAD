# Art Gallery FSAD - Deployment Guide

This guide explains how to deploy the complete Art Gallery application.

## Architecture Overview

The Art Gallery application consists of two parts:

1. **Frontend** - React application → Deploy to **Vercel** (free, easy, fast)
2. **Backend** - Spring Boot Java API → Deploy to **Railway/Render** (or other service)

## Quick Start Deployment

### 1. Deploy Frontend to Vercel (5 minutes)

See **`frontend/VERCEL_DEPLOYMENT.md`** for detailed steps.

**Quick version:**
- Connect GitHub repo to Vercel
- Set Root Directory to `frontend`
- Add environment variable `REACT_APP_API_URL` with your backend URL
- Deploy!

### 2. Deploy Backend (Choose one)

#### **Option A: Railway (Recommended)**

1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repository
4. Railway auto-detects Maven project
5. Configure environment:
   - Add database (MySQL)
   - Set environment variables
6. Deploy!
7. Copy Railway API URL (e.g., `https://api-prod-*.railway.app`)

#### **Option B: Render**

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set:
   - Root Directory: `backend`
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
5. Add environment variables and database
6. Deploy!
7. Copy Render service URL

#### **Option C: Docker (Advanced)**

Create `backend/Dockerfile`:

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

Then deploy using any container service (Railway, Render, Cloud Run, etc.)

## Environment Configuration

### Backend Environment Variables

Set these in your deployment platform:

```
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/art_gallery
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

### Frontend Environment Variables

In Vercel dashboard, set:

```
REACT_APP_API_URL=https://your-deployed-backend-url.com/api
```

## Database Setup

### Using MySQL

**Local Development:**
```bash
mysql -u root -p
CREATE DATABASE art_gallery;
```

**Production (Railway/Render):**
- Both services offer managed MySQL
- They provide connection string automatically
- Use that for `SPRING_DATASOURCE_URL`

**Or use cloud services:**
- AWS RDS
- Google Cloud SQL
- Azure Database for MySQL

## Testing After Deployment

1. Visit your Vercel URL: `https://artgallery-*.vercel.app`
2. Try to register/login
3. Browse artworks
4. Check browser console for errors

If API calls fail:
- Check `REACT_APP_API_URL` in Vercel environment
- Verify backend is running
- Check backend logs for errors
- Enable CORS if needed on backend

## Continuous Deployment

After initial setup, every push to GitHub triggers auto-deploy:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Both Vercel and Railway/Render redeploy automatically!
```

## Domain Names

### Get a free domain:
- https://www.freenom.com (free .ml, .ga, etc.)
- https://vercel.com/docs/concepts/projects/domains (free .vercel.app included)

### Add custom domain to Vercel:
1. Vercel dashboard → Domains
2. Add your domain
3. Follow DNS configuration

## Monitoring & Logs

### Vercel Logs
- Dashboard → Deployments → View Logs

### Railway/Render Logs
- Dashboard → Logs tab

## Rollback

If deployment breaks:

**Vercel:** Click previous deployment and promote to production
**Railway:** In deployments, select previous and redeploy
**Render:** Similar rollback process

## Budget

**Vercel:** Free tier (~100GB bandwidth/month)
**Railway:** $5/month free credit (plenty for hobby projects)
**Render:** Free tier available
**Total:** Can run completely free or ~$5-20/month for production

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://railway.app/docs
- Render Docs: https://render.com/docs
- Spring Boot: https://spring.io/projects/spring-boot

## Next Steps

1. Follow `frontend/VERCEL_DEPLOYMENT.md` to deploy frontend
2. Choose backend deployment option and deploy
3. Add custom domain if desired
4. Monitor deployments and logs
5. Celebrate! 🎉

---

Questions? Check the specific deployment guide for your chosen service.
