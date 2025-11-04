# Step-by-Step: Get PostgreSQL DATABASE_URL

## Open Railway

1. Go to https://railway.app in your browser
2. Log in if needed

## Find Your Project

3. Look for your **"Fairshare"** project
4. Click on it

## Look for Two Boxes

5. You should see **TWO service boxes** in your project:
   - Box 1: Has a **GitHub logo** 🔗 - This is your code
   - Box 2: Has a **cylinder/database icon** 🗄️ - This is PostgreSQL

## Click PostgreSQL

6. Click on the **database/cylinder box** (Box 2)

## Open Variables

7. You'll see **tabs** at the top: Deployments, Variables, Metrics, Settings
8. Click on **"Variables"** tab

## Find and Copy DATABASE_URL

9. In the Variables list, you'll see something like:

```
Name           Value
───────────────────────────────────────────────
DATABASE_URL   postgresql://postgres:PASSWORD@...
```

10. Click on the **long value** next to DATABASE_URL
11. **Select all** of it (Ctrl+A or Cmd+A)
12. **Copy** it (Ctrl+C or Cmd+C)

That's your DATABASE_URL! 🎉

## What It Looks Like

It will be a long string like:
```
postgresql://postgres:somelongrandompassword123456@containers-us-west-1.railway.app:5432/railway
```

## If You Don't See PostgreSQL Service

If you don't see the database icon, add it:
1. Click **"+ New"** button (usually at bottom or top)
2. Click **"Database"**
3. Click **"Add PostgreSQL"**
4. Wait ~30 seconds
5. Then follow steps above again

That's it! Just copy that long string! 📋


