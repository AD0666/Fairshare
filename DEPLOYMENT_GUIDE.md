# FairShare Deployment Guide

This guide will help you deploy FairShare online so you can share it with others via a simple URL.

## Architecture

- **Frontend**: Deploy to Vercel (free, React-friendly)
- **Backend**: Deploy to Railway (free tier, includes PostgreSQL)
- **Database**: Provided by Railway

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 1.2 Add PostgreSQL Database
1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Railway will create a PostgreSQL database for you
3. Copy the DATABASE_URL from the Variables tab

### 1.3 Deploy Backend Code
1. Click "+ New" → "GitHub Repo"
2. Select your FairShare repository
3. Railway will auto-detect it's a Node.js app

### 1.4 Configure Environment Variables
In the Railway project settings, add these variables:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<paste the DATABASE_URL from PostgreSQL service>
JWT_SECRET=<generate a random string, minimum 32 characters>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your frontend URL from Vercel, we'll add this after step 2>
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.5 Configure Build Settings
In Railway project settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npx prisma db push`
- **Start Command**: `npm run build && npm start`

### 1.6 Get Your Backend URL
Once deployed, Railway will give you a URL like: `https://your-app.up.railway.app`

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### 2.2 Configure Frontend Project
1. Select the `frontend` directory as root
2. Vercel auto-detects Vite/React

### 2.3 Add Environment Variables
Add a custom environment variable for the backend URL.

But first, update the API configuration (see Step 2.4 below).

### 2.4 Update Frontend API Configuration

The frontend currently uses relative URLs (`/api`). We need to update it to use your Railway backend URL.

Update `frontend/src/utils/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

Then in Vercel, add:
- **VITE_API_URL**: `https://your-backend-url.up.railway.app`

### 2.5 Deploy
Click "Deploy" and wait for it to complete.

### 2.6 Get Your Frontend URL
Vercel will give you a URL like: `https://fairshare.vercel.app`

## Step 3: Connect Frontend and Backend

### 3.1 Update Railway Backend Variables
Go back to Railway and update:
```
CLIENT_URL=<your Vercel frontend URL>
```

### 3.2 Redeploy Backend
Railway will automatically redeploy when you change variables.

## Step 4: Run Database Migrations

The backend needs to set up the database schema.

### Option A: Via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
cd backend
railway run npx prisma db push
```

### Option B: Via Railway Dashboard
1. Go to your backend service in Railway
2. Click on "View Logs"
3. Railway should have already run the build command which includes `npx prisma db push`
4. Check logs to confirm it succeeded

## Step 5: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try to register a new user
3. Test creating expenses
4. Check if data persists

## Troubleshooting

### Backend not connecting
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Make sure CLIENT_URL matches your frontend URL

### Database errors
- Run migrations again: `railway run npx prisma db push`
- Check PostgreSQL service is running in Railway

### CORS errors
- Verify CLIENT_URL in Railway matches your Vercel URL exactly
- Make sure no trailing slashes

### 401 Unauthorized errors
- Clear browser cache
- Try logging in again
- Check JWT_SECRET is set and consistent

## Next Steps

Once deployed:
1. Share your Vercel URL with others
2. They can sign up and use FairShare
3. No installation needed!

## Alternative: Quick Local Testing

If you want to test locally first before deploying:

```bash
# Terminal 1: Start PostgreSQL locally
# Then start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Then access at http://localhost:3000

