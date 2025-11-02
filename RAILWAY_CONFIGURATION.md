# Railway Configuration - IMPORTANT

The deployment is failing because Railway needs to be configured correctly in the dashboard.

## Critical Configuration Steps

Go to your Railway project → Fairshare service → **Settings** tab:

### ✅ Required Settings

1. **Root Directory**: `backend`
   - This tells Railway where your backend code is

2. **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - Installs dependencies in backend folder
   - Generates Prisma client
   - Runs database migrations

3. **Start Command**: `npm run build && npm start`
   - Compiles TypeScript
   - Starts the server

### ⚠️ Why Your Deploy is Failing

Railway's build command is probably:
- Running from root directory
- NOT changing to backend directory
- OR not running npm install before build

## Fix in Railway Dashboard NOW

1. Open Railway → Your Project → **Fairshare** service
2. Click **"Settings"** tab
3. Scroll to **"Build & Deploy"** section
4. Set these EXACT commands:

   **Build Command:**
   ```
   cd backend && npm install && npx prisma generate && npx prisma db push
   ```

   **Start Command:**
   ```
   npm run build && npm start
   ```

5. Click **"Save"** at the bottom
6. Click **"Deploy"** at the top

## Verify These are Set Correctly

In Railway Settings, you should see:
- ✅ Root Directory: `backend`
- ✅ Build Command includes: `cd backend && npm install`
- ✅ Start Command includes: `npm run build && npm start`

## After Saving

Railway will automatically redeploy with the correct commands.

## Still Not Working?

Run a manual redeploy:
1. In Railway, click **"Deployments"** tab
2. Click **"Manual Deploy"** or **"Redeploy"** on the latest deployment

