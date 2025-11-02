# Fix PostgreSQL Connection Timeout

## The Problem

The migration timed out trying to connect to PostgreSQL. This usually means:
1. PostgreSQL service stopped running
2. Another process has a lock on the database (like Prisma Studio)

## Quick Fix

### Step 1: Make Sure PostgreSQL is Running

**Windows Services:**

1. Press `Win + R`
2. Type: `services.msc`
3. Press Enter
4. Look for "PostgreSQL 18" or "PostgreSQL 15" or similar
5. Check if status says "Running"
6. If it says "Stopped":
   - Right-click on it
   - Click "Start"

**OR use PowerShell:**

```powershell
Get-Service | Where-Object {$_.Name -like "*PostgreSQL*"}
# Look for the running status
```

If stopped, start it:
```powershell
Start-Service postgresql-x64-15  # Replace 15 with your version number
```

### Step 2: Close Prisma Studio (If Running)

If you opened Prisma Studio earlier, close it!
- Look for a terminal window running `npx prisma studio`
- Close that window or press `Ctrl + C` in it

### Step 3: Try Again

```powershell
cd C:\Users\npmd1\Startup\Splitwise\backend
npx prisma migrate dev --name init
```

---

## Alternative: Quick Test

Before running migration, test if you can connect:

```powershell
psql -U postgres -d fairshare -c "SELECT 1;"
```

If this works, PostgreSQL is running fine. If not, check the service.

---

## If Still Not Working

### Check PostgreSQL Port

Sometimes PostgreSQL runs on a different port:

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

Should return: `TcpTestSucceeded : True`

### Check Firewall

Windows Firewall might be blocking:
1. Windows Security → Firewall & network protection
2. Look for any PostgreSQL-related blocks
3. Allow through firewall if prompted

---

## Simplest Solution

If still stuck, restart your computer:
- This will restart PostgreSQL service fresh
- Try the migration again after restart

---

## Quick Summary

1. ✅ Check PostgreSQL service is running
2. ✅ Close Prisma Studio if open
3. ✅ Run migration again: `npx prisma migrate dev --name init`
4. ✅ If still fails → Restart computer

Let me know what happens! 🚀

