# Step-by-Step Deployment Instructions

Follow these exact steps to deploy FairShare online.

## Prerequisites Check

✅ You have a GitHub account
✅ Your code is working locally

## Step 1: Initialize Git Repository (If Not Already Done)

Open PowerShell in your project folder and run:

```powershell
cd C:\Users\npmd1\Startup\Splitwise

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - FairShare app"

# Create GitHub repository (do this manually on github.com first)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### 2.2 Create New Project

1. Click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your **Splitwise/FairShare** repository
4. Click **"Deploy Now"**

### 2.3 Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Click **"Add PostgreSQL"**
4. Wait for the database to be created

### 2.4 Get Database URL

1. Click on the **PostgreSQL service** (you'll see a box with a database icon)
2. Click on the **"Variables"** tab
3. Find **`DATABASE_URL`** and **copy the entire value**

It looks like: `postgresql://postgres:PASSWORD@CONTAINER:PUBLIC_PORT/railway`

### 2.5 Configure Backend Service

1. Click on the backend service in Railway (the one with GitHub icon)
2. Go to **"Settings"** tab
3. Set **"Root Directory"** to: `backend`
4. Set **"Build Command"** to: `npm install && npx prisma generate && npx prisma db push`
5. Set **"Start Command"** to: `npm run build && npm start`
6. Click **"Deploy"** at the top

### 2.6 Add Environment Variables

In the backend service, click **"Variables"** tab and add:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<paste the DATABASE_URL you copied>
JWT_SECRET=<generate: see below>
JWT_EXPIRES_IN=7d
```

**Generate JWT_SECRET:**
1. Open a new PowerShell window
2. Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Copy the output (64 characters)
4. Use this as your JWT_SECRET value

### 2.7 Get Your Backend URL

1. Railway will auto-deploy
2. Go to the **"Settings"** tab of your backend service
3. Click **"Generate Domain"**
4. Copy your domain (e.g., `https://fairshare-production-1234.up.railway.app`)
5. **Keep this URL handy** - you'll need it in Step 3!

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your **GitHub repository**
3. Vercel will auto-detect your project

### 3.3 Configure Project Settings

1. **Framework Preset**: Vite (auto-detected)
2. **Root Directory**: Select **`frontend`**
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### 3.4 Add Environment Variable

In the **"Environment Variables"** section, add:

```
VITE_API_URL=<paste your Railway backend URL from Step 2.7>
```

For example: `https://fairshare-production-1234.up.railway.app`

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Copy your **deployment URL** (e.g., `https://fairshare.vercel.app`)

## Step 4: Connect Frontend and Backend

### 4.1 Update Railway with Frontend URL

1. Go back to **Railway**
2. Click on your **backend service**
3. Go to **"Variables"** tab
4. Add or update:
   ```
   CLIENT_URL=<paste your Vercel URL from Step 3.5>
   ```
5. Railway will **automatically redeploy**

## Step 5: Test Your Deployment

1. Open your **Vercel URL** in a browser
2. You should see the **FairShare login page**
3. Click **"Register"**
4. Create an account:
   - Enter any email
   - Enter a password
   - Enter your name
5. Click **"Sign Up"**
6. You should be redirected to the dashboard!

### 5.1 Test Features

- ✅ Create an expense
- ✅ View on dashboard
- ✅ Check reports
- ✅ Add friends

## 🎉 Success!

Your FairShare app is now live on the internet! Share your Vercel URL with anyone.

## Troubleshooting

### "Cannot connect to backend"
- Wait 2 minutes after Railway deployment
- Check Railway logs for errors
- Verify VITE_API_URL in Vercel matches Railway URL
- Make sure Railway domain doesn't have trailing slash

### "Database error"
- Check Railway logs
- Verify DATABASE_URL is correct
- Prisma push should have run during build

### "CORS error"
- Make sure CLIENT_URL in Railway matches your Vercel URL exactly
- No http/https mismatch
- Wait for Railway to redeploy after updating CLIENT_URL

### "401 Unauthorized"
- Clear browser cache
- Logout and login again
- Check JWT_SECRET is set in Railway

## Next Steps

- Share your Vercel URL with users
- Monitor Railway and Vercel dashboards
- Check logs if issues occur

Enjoy your deployed app! 🚀

