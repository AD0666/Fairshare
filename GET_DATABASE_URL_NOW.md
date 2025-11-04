# 🗄️ How to Get DATABASE_URL from PostgreSQL in Railway

## Follow These Exact Steps:

### Step 1: Open Railway
- Go to: **https://railway.app**
- Sign in if needed

### Step 2: Find Your Project
- Look for a project called **"Fairshare"** (or your project name)
- **Click on it**

### Step 3: You'll See 2 Services
Your screen will show something like this:

```
┌─────────────────────┐
│   🔗 GitHub Icon    │  ← This is your backend code
│   (Service Name)    │
└─────────────────────┘

┌─────────────────────┐
│   🗄️ Database Icon  │  ← This is PostgreSQL (CLICK THIS ONE!)
│   PostgreSQL        │
└─────────────────────┘
```

### Step 4: Click the Database Service
- Click on the **🗄️ Database/PostgreSQL box** (the one with the cylinder icon)
- It might say "PostgreSQL" or just show a database icon

### Step 5: Click "Variables" Tab
- At the top, you'll see tabs: **Deployments | Variables | Metrics | Settings**
- **Click "Variables"**

### Step 6: Find DATABASE_URL
You'll see a list like this:

```
┌────────────────────────────────────────────────────────────┐
│ Variable Name      │ Value                                 │
├────────────────────────────────────────────────────────────┤
│ PGHOST             │ containers-us-west-1.railway.app      │
│ PGPORT             │ 5432                                  │
│ PGDATABASE         │ railway                               │
│ PGUSER             │ postgres                              │
│ PGPASSWORD         │ **********                            │
│ DATABASE_URL       │ postgresql://postgres:abc123@...      │ ← THIS ONE!
└────────────────────────────────────────────────────────────┘
```

### Step 7: Copy DATABASE_URL
- Find the row that says **`DATABASE_URL`**
- Click on the **value** (the long string next to it)
- Press **Ctrl+A** (or Cmd+A on Mac) to select all
- Press **Ctrl+C** (or Cmd+C on Mac) to copy

### Step 8: That's It! ✅
You now have the DATABASE_URL copied to your clipboard!

---

## What It Looks Like

The DATABASE_URL will be a long string like:
```
postgresql://postgres:VERY_LONG_PASSWORD_HERE@containers-us-west-1.railway.app:5432/railway
```

---

## What to Do Next

1. **Go to your Backend Service** (the one with the GitHub icon)
2. Click **"Variables"** tab
3. Add these variables (paste DATABASE_URL where indicated):
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<paste your copied URL here>
   JWT_SECRET=8558086994f8eaddd40d93290737e34970a2baf68813baa41b8111225efcc6f3
   JWT_EXPIRES_IN=7d
   ```
4. Save
5. Railway will automatically redeploy

---

## ❓ Troubleshooting

**I don't see a PostgreSQL service:**
- Click **"+ New"** button
- Select **"Database"**
- Select **"Add PostgreSQL"**
- Wait ~30 seconds
- Then follow steps above

**I can't find the Variables tab:**
- Make sure you clicked on the **PostgreSQL service** (database icon), not your backend service
- The Variables tab should be at the top

**The DATABASE_URL is too long to see:**
- Just click on it and copy the whole thing - it's all one line!

---

**That's all! You got this! 🚀**
