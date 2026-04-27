# Art Gallery Frontend - Vercel Deployment Guide

This guide walks you through deploying the Art Gallery React frontend to Vercel.

## Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account with the Art Gallery repository
- Deployed backend API (or backend URL to configure)

## Deployment Steps

### 1. Connect GitHub to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account and choose the **ArtGallery-FSAD** repository
5. Click **"Import"**

### 2. Configure Project Settings

When prompted, use these settings:

- **Framework Preset:** React
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### 3. Set Environment Variables

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following variable:

   | Name | Value |
   |------|-------|
   | `REACT_APP_API_URL` | `https://your-backend-url.com/api` |

   Replace `https://your-backend-url.com/api` with your actual backend API URL

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. You'll get a live URL like `https://artgallery-*.vercel.app`

## Local Development

To test locally before deploying:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm start
```

The app will run at `http://localhost:3000` and connect to the backend at `http://localhost:8080/api`.

## Deploying Your Backend

Your Spring Boot backend needs to be deployed separately. Here are popular options:

### Option 1: Railway (Recommended - Free tier available)
- Deploy at https://railway.app
- Easy Docker support
- Get your backend URL and add to `REACT_APP_API_URL` in Vercel

### Option 2: Render
- Deploy at https://render.com
- Free tier available
- Similar process to Railway

### Option 3: AWS / Azure / Google Cloud
- More complex but more powerful
- Can host database and backend together

### Option 4: Heroku (Legacy - Paid only now)
- Previously free, now paid only
- Still a solid option if you have budget

## Troubleshooting

### "API calls not working" 
- Check that `REACT_APP_API_URL` is set correctly in Vercel Environment Variables
- Verify backend is running and accessible from your deployed app
- Check browser console for CORS errors (may need to enable CORS on backend)

### "Build fails"
- Check that `frontend` directory is specified as Root Directory
- Ensure all npm dependencies are compatible
- Check Vercel build logs for specific errors

### "Can't connect to backend locally"
- Make sure backend (Spring Boot) is running on port 8080
- Check `.env.local` file has correct `REACT_APP_API_URL`
- Verify no firewall issues

## Redeploy

To redeploy after making changes:

```bash
git add .
git commit -m "Update message"
git push origin main
```

Vercel will automatically rebuild and deploy on every push to main branch.

## Custom Domain

To add a custom domain:

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Enter your domain name
4. Follow DNS configuration instructions

## Next Steps

1. Deploy your Spring Boot backend to Railway/Render
2. Update `REACT_APP_API_URL` in Vercel with your backend URL
3. Test API calls from your deployed app
4. Add a custom domain if desired

---

For more info: https://vercel.com/docs
