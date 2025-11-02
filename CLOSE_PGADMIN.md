# Close pgAdmin to Fix Migration Issue

## The Problem

pgAdmin is running and has a lock on your database. This is preventing Prisma migrations from running.

## The Fix

**Close pgAdmin 4 completely:**

1. Look at the taskbar (bottom of screen)
2. Find the pgAdmin 4 icon
3. Right-click it → Close window
4. If multiple pgAdmin windows are open, close ALL of them

**OR**

Click the X button on all pgAdmin windows to close them.

---

## Then Try Migration Again

Once pgAdmin is completely closed:

```powershell
cd C:\Users\npmd1\Startup\Splitwise\backend
npx prisma migrate dev --name init
```

This should work now! ✅

---

## Why This Happens

pgAdmin opens a persistent database connection to keep your data visible. This connection locks the database for migrations.

**Solution:** Keep pgAdmin closed while running migrations, then reopen it afterwards if you need it.

---

## After Migration Succeeds

You can reopen pgAdmin anytime to view your database!

```powershell
# Only after migration is done
npx prisma studio
```

Let me know when pgAdmin is closed! 🚀

