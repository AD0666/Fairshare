# 🔧 Fix Vercel Deployment - Step by Step

The problem: Vercel UI has an Install Command set that overrides our config file.

## Step 1: Fix Vercel Settings (CRITICAL!)

1. Go to your **Vercel Dashboard**: https://vercel.com
2. Click on your **"adfairshare"** project
3. Click **"Settings"** tab (top navigation)
4. Click **"General"** in the left sidebar
5. Scroll down to **"Build & Development Settings"** section

### Fix Install Command:

6. Find **"Install Command"**
7. You'll see it probably says: `cd frontend && npm install`
8. **DELETE this entire command** (make it empty)
9. Click **"Save"** button

### Verify Root Directory:

10. In the same section, find **"Root Directory"**
11. It should say: `frontend`
12. If it's empty or different, change it to: `frontend`
13. Click **"Save"** button again

## Step 2: Redeploy with Latest Commit

1. Go to **"Deployments"** tab
2. Click the **"Create Deployment"** button (top right, or the big button)
3. In the modal, select:
   - **Branch:** `main` (from dropdown)
   - Leave **Commit** empty (or it should auto-select latest)
4. Click **"Create Deployment"**

**OR** click the **"Redeploy"** button on any deployment and select latest commit.

## Step 3: Wait and Verify

- The deployment should now use commit `0df1729` (not the old one)
- It should NOT run `cd frontend && npm install` anymore
- It should run `npm install` directly (since Root Directory is `frontend`)

---

## ✅ What Should Happen:

After these steps:
- ✅ Root Directory = `frontend` (Vercel runs commands from there)
- ✅ Install Command = **EMPTY** (Vercel auto-detects `npm install`)
- ✅ Deploys latest commit with our fixes
- ✅ Build succeeds!

---

## 🔍 Verify Settings Are Correct:

Go to **Settings** → **General** → **Build & Development Settings**

Should show:
- **Root Directory:** `frontend`
- **Install Command:** (empty/blank)
- **Build Command:** `npm run build` (or auto-detected)
- **Output Directory:** `dist`

**Do Step 1 FIRST - that's the main issue!** 🎯
