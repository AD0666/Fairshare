# ⚠️ URGENT: Configure Railway Settings in Dashboard

Railway deployment is failing because the build/start commands are not configured correctly.

## 🚨 Action Required NOW

**You MUST configure these in Railway dashboard** - the railway.json file alone isn't enough!

### Step-by-Step Fix

1. **Open Railway**: https://railway.app
2. **Go to your project**: Click on "Fairshare" project
3. **Click on the backend service**: The one with GitHub icon
4. **Click "Settings"** tab
5. **Scroll to "Build & Deploy"** section

### Required Settings

**Root Directory:**
```
backend
```

**Build Command:**
```
cd backend && npm install && npx prisma generate && npx prisma db push
```

**Start Command:**
```
npm run build && npm start
```

### Verify Environment Variables

While you're in Settings, also check the **"Variables"** tab and make sure these are set:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<from PostgreSQL service>
JWT_SECRET=<64 character random string>
JWT_EXPIRES_IN=7d
```

### After Setting

1. Click **"Save"** at the bottom
2. Go back to **"Deployments"** tab
3. Click **"Manual Deploy"** or **"Redeploy Latest"**
4. Watch the logs

## Expected Result

After setting these, logs should show:
✅ Installing dependencies in backend
✅ Generating Prisma client
✅ Pushing database schema
✅ Building TypeScript
✅ Server starting
✅ Healthcheck passing

## If You Need DATABASE_URL

1. Click on the **PostgreSQL service** in your Railway project
2. Click **"Variables"** tab
3. Copy the **DATABASE_URL** value
4. Paste it into backend service variables

Do this NOW and redeploy! 🚀

