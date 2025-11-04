# How to Find PostgreSQL Variables Tab in Railway

## Step-by-Step Visual Guide

### Step 1: Open Your Railway Project
1. Go to https://railway.app
2. Click on your **"Fairshare"** project (or project name)

### Step 2: Find the PostgreSQL Service
On your project dashboard, you'll see **two services**:

1. **First service** (top/left): Has a **GitHub logo** → This is your backend code
2. **Second service** (below): Has a **database icon** (cylinder/silo shape) → This is PostgreSQL

Click on the **database icon** service (the PostgreSQL one).

### Step 3: Open Variables Tab
Once you click the PostgreSQL service:
- You'll see tabs at the top: **"Settings"**, **"Variables"**, **"Metrics"**, etc.
- Click on **"Variables"** tab

### Step 4: Find DATABASE_URL
In the Variables tab, you'll see:
- A list of environment variables
- One of them is **`DATABASE_URL`**
- It has a long value next to it

### Step 5: Copy DATABASE_URL
1. Click on the **value** (the long URL)
2. Select all and copy it
3. It looks like:
   ```
   postgresql://postgres:SUPER_LONG_PASSWORD@containers-us-west-1.railway.app:5432/railway
   ```

## Alternative: Railway UI Screenshots Description

If you can't find it, look for:
- A **purple/blue cylinder icon** = PostgreSQL database
- Click it → "Variables" tab → Find `DATABASE_URL`

## Still Can't Find It?

**Check if you added PostgreSQL:**
- If you don't see a database icon, you need to add it first:
  1. Click **"+ New"** button
  2. Click **"Database"**
  3. Click **"Add PostgreSQL"**
  4. Wait for it to create
  5. Then follow steps above

## Quick Checklist

□ Opened Railway dashboard?
□ See your project with two services?
□ Found the service with database icon?
□ Clicked "Variables" tab?
□ Found DATABASE_URL?
□ Copied the entire URL?

Once you have it, you're ready! 🎯


