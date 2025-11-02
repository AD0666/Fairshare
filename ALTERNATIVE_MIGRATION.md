# Alternative: Bypass Migration and Deploy Directly

The migration is timing out due to locks. Let's try a different approach!

## Option 1: Deploy Schema Directly

Instead of using `migrate dev`, let's push the schema directly:

```powershell
cd C:\Users\npmd1\Startup\Splitwise\backend
npx prisma db push
```

**What this does:** 
- Pushes schema directly without creating migration files
- Bypasses the lock mechanism
- Faster for development

---

## Option 2: Check What's Locking

```powershell
# Make sure psql is in PATH
$env:PATH += ";C:\Program Files\PostgreSQL\18\bin"
```

Then run pgAdmin query tool to see what's locking.

---

## Try db push First

This is faster and easier:

```powershell
npx prisma db push
```

It will ask to create the database. Type `y` and press Enter.

Let me know what happens! 🚀

