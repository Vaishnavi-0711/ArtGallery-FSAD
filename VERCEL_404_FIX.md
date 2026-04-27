# Vercel 404 Error - Troubleshooting Guide

If you're seeing a 404 error on your Vercel deployment, follow these steps.

## ✅ What I Just Fixed

I've updated your `vercel.json` and configuration to properly handle React Router routes:

1. ✅ Added `rewrites` to route all paths to `index.html`
2. ✅ Added cache headers for better performance  
3. ✅ Added `_redirects` file for compatibility

**These changes have been pushed to GitHub. Vercel will redeploy automatically.**

## 🔄 Vercel Redeployment

**Wait 2-5 minutes for Vercel to redeploy**, then refresh your site. Check deployment status:

1. Go to https://vercel.com/dashboard
2. Select your **ArtGallery-FSAD** project
3. Click **Deployments** tab
4. Look for the latest deployment (should be in progress or completed)
5. Wait for the checkmark ✅

## 🧪 Testing After Deploy

Once deployment is complete:

1. Visit your Vercel URL: `https://artgallery-*.vercel.app`
2. You should see the **home page** (not 404)
3. Try clicking **Artworks**, **Login**, **Register** - should work without 404

## ❌ Still Getting 404?

Try these steps:

### Step 1: Clear Browser Cache
```
Ctrl + Shift + Delete (Windows/Linux)
Cmd + Shift + Delete (Mac)
```
Or use Incognito/Private mode

### Step 2: Check Vercel Deployment Logs

1. Go to Vercel dashboard
2. Click your project
3. Click **Deployments**
4. Click the latest deployment
5. Click **Logs** and look for errors
6. Check **Runtime Logs** tab

### Step 3: Verify Environment Variables in Vercel

1. Go to your Vercel project
2. Click **Settings**
3. Click **Environment Variables**
4. Make sure `REACT_APP_API_URL` is set:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** Your backend URL (e.g., `https://your-api.railway.app/api`)

⚠️ **Important:** If you just added environment variables, you must redeploy:
1. Go to **Deployments**
2. Click the 3 dots on latest deployment
3. Click **Redeploy**

### Step 4: Check Frontend Build

Is the build succeeding? In Vercel:
1. Click **Deployments**
2. Click latest deployment
3. Scroll to **Building** section
4. Look for "✓ Built" or "✗ Failed"

If it says "Failed", click the deployment and check Build Logs for errors.

## 🔍 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Page shows blank/error** | Clear cache, wait for redeploy, check build logs |
| **Routes like /artworks show 404** | The `vercel.json` rewrite fix should resolve this |
| **API calls fail (404 from backend)** | Check `REACT_APP_API_URL` environment variable is set |
| **Deployment stuck/failed** | Check build logs, may need to update dependencies |
| **Old version still showing** | Hard refresh: Ctrl+F5 or Cmd+Shift+R |

## 🚀 Manual Redeploy (if needed)

1. Go to Vercel dashboard
2. Select your project
3. Click **Deployments** tab
4. Find your latest deployment
5. Click the **⋮** (three dots) menu
6. Click **Redeploy** 
7. Wait for build to complete

## 📋 What the Fix Does

Your `vercel.json` now includes:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This tells Vercel: *"Any request that doesn't match a static file, send to index.html"*

React Router then takes over and shows the right page based on the URL.

**Without this:** Vercel looks for `/artworks.html` - doesn't exist → 404
**With this:** Vercel sends to `index.html`, React Router loads `/artworks` page

## ✅ Verify Fix Worked

In browser console, check:
```javascript
console.log(process.env.REACT_APP_API_URL)
// Should show your API URL, not undefined
```

## 📞 Still Need Help?

Check:
1. Vercel Logs (Deployments → Latest → Logs)
2. Browser Console (F12 → Console)
3. Network tab (F12 → Network) for failed requests
4. GitHub Actions (check if build passed)

---

**The fix is deployed! Your site should work now. Refresh and let me know if you still see 404.** 🎉
