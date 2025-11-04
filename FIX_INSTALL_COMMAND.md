# Fix Install Command Override in Vercel

I can see the issue in your settings! The **"Override" toggle for Install Command is ENABLED** and it has command text.

## Fix This Now:

### Step 1: Turn OFF Install Command Override

1. On the **"Build and Deployment"** settings page you're viewing
2. Find **"Install Command"** section
3. You'll see:
   - Input field with: `'yarn install', 'pnpm install', 'npm install', or 'bun install'`
   - **Toggle switch showing "Override" is ENABLED (blue/on)**
4. **TURN OFF the toggle** - Click it so it's grey/off
5. **Delete the text** in the input field (make it empty)
6. Scroll down and click **"Save"** button

### Step 2: Verify Other Settings

Make sure these are correct (they look good):
- ✅ **Root Directory:** `frontend` (correct!)
- ✅ **Build Command:** `npm run build` with Override ON (this is fine)
- ✅ **Output Directory:** `dist` with Override ON (this is fine)
- ❌ **Install Command:** Override should be OFF

### Step 3: Force Deploy Latest Commit

Since deployments keep using old commit `9654a0e`, we need to force a new deployment:

1. Go to **"Deployments"** tab
2. Click **"Create Deployment"** button (big button, top right)
3. In the modal:
   - **Repository:** Should show `AD0666/adfairshare`
   - **Branch:** Select `main` from dropdown
   - **Commit:** Leave EMPTY (this will use the latest)
   - OR manually enter: `0df1729`
4. Click **"Create Deployment"**

---

## Why This Fixes It:

- **Root Directory = `frontend`** → Vercel changes to that folder first
- **Install Command Override = OFF** → Vercel auto-detects and runs `npm install` in the frontend folder
- **Latest commit** → Includes all our fixes

**The toggle being ON was forcing Vercel to use that command template, which was causing the `cd frontend` error!**

Turn OFF that toggle, save, then deploy again! 🎯
