# Ready to Try Migration Again!

## Do This Now

**Step 1:** Look at your screen - are there ANY pgAdmin windows open?
- If YES → Close them all (click X on each window)
- If NO → Great!

**Step 2:** Look at your terminal/command prompt
- Make sure you're in the backend folder
- Check the prompt shows: `PS C:\Users\npmd1\Startup\Splitwise\backend>`

**Step 3:** Run the migration command:

```powershell
npx prisma migrate dev --name init
```

---

## What Should Happen

You should see output like:
```
✔ Generated Prisma Client
✔ Created migration: 20240101_init
✔ Applied migration: 20240101_init
✅ Migration complete!
```

This might take 10-20 seconds.

---

## If It Still Fails

Restart PostgreSQL service:

```powershell
# Find and restart PostgreSQL service
Restart-Service postgresql-x64-18
```

Then try migration again.

---

**Ready? Close pgAdmin and run the migration command!** 🚀

