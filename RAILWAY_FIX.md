# Fix Railway Deployment Error

Your build succeeded but healthcheck failed. This usually means the app crashed after starting.

## Diagnose the Problem

### Step 1: Check Railway Logs

1. In Railway, click on your **Fairshare** service
2. Click the **"Logs"** tab
3. Look for error messages, especially:
   - Database connection errors
   - Prisma errors
   - Missing environment variables

## Common Issues & Fixes

### Issue 1: Missing DATABASE_URL

**Symptom:** Logs show "Can't reach database server" or "DATABASE_URL is not defined"

**Fix:**
1. In Railway, click **PostgreSQL service** (the database)
2. Click **"Variables"** tab
3. Copy the **DATABASE_URL** value
4. Go to **backend service** → **"Variables"** tab
5. Add `DATABASE_URL` with the copied value

### Issue 2: Missing JWT_SECRET

**Symptom:** Logs show JWT errors or "JWT_SECRET is not defined"

**Fix:**
1. In PowerShell, run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Copy the output
3. In Railway backend service → **"Variables"**, add:
   ```
   JWT_SECRET=<paste the generated value>
   ```

### Issue 3: Wrong Root Directory

**Symptom:** Build can't find files

**Fix:**
1. Go to backend service → **"Settings"** tab
2. Check **"Root Directory"** is set to: `backend`
3. If not, set it and redeploy

### Issue 4: Prisma Client Not Generated

**Symptom:** Logs show "Cannot find module @prisma/client"

**Fix:**
1. Go to backend service → **"Settings"** tab
2. Set **"Build Command"** to: `npm install && npx prisma generate && npx prisma db push`
3. Redeploy

### Issue 5: Environment Variables Not Set

**All Required Variables:**

Make sure ALL these are set in Railway backend service → Variables:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<from PostgreSQL service>
JWT_SECRET=<64 character random string>
JWT_EXPIRES_IN=7d
```

## Quick Fix Checklist

Go to your Railway backend service and verify:

- [ ] **Settings** → Root Directory: `backend`
- [ ] **Settings** → Build Command: `npm install && npx prisma generate && npx prisma db push`
- [ ] **Settings** → Start Command: `npm run build && npm start`
- [ ] **Variables** → DATABASE_URL (from PostgreSQL)
- [ ] **Variables** → JWT_SECRET (random 64 chars)
- [ ] **Variables** → NODE_ENV=production
- [ ] **Variables** → PORT=5000
- [ ] **Variables** → JWT_EXPIRES_IN=7d

## Redeploy

After fixing any issues:

1. In Railway, click **"Deploy"** or **"Redeploy"**
2. Watch the logs
3. Check if healthcheck succeeds

## Still Failing?

Share the exact error from Railway logs, and I'll help debug further!

