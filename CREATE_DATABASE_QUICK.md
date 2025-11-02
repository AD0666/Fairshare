# Create FairShare Database - Quick Guide

## Option 1: Using pgAdmin (Easiest - GUI Tool)

1. **Open pgAdmin from Start Menu:**
   - Click Windows Start
   - Type "pgAdmin"
   - Click "pgAdmin 4"

2. **Enter your PostgreSQL password:**
   - You set this during installation
   - If you can't remember, you might need to reinstall PostgreSQL

3. **Connect to PostgreSQL server:**
   - In left panel, expand "Servers"
   - Expand "PostgreSQL 15" (or your version)
   - You should see folders like "Databases"

4. **Create the database:**
   - Right-click on "Databases"
   - Click "Create"
   - Click "Database..."

5. **Name the database:**
   - In "Database" field, type: `fairshare`
   - Click "Save" (bottom right)
   - ✅ Done!

---

## Option 2: Using Command Line (PowerShell)

### Step 1: Add PostgreSQL to PATH

Open PowerShell and run:

```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"
```

If you have PostgreSQL 16 instead of 15, use:

```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\16\bin"
```

### Step 2: Create the Database

```powershell
createdb -U postgres fairshare
```

When prompted for password, enter the password you set during PostgreSQL installation.

**Expected output:**
```
Password:
(no message means success!)
```

### Step 3: Verify it Works

```powershell
psql -U postgres -l
```

You should see `fairshare` in the list of databases!

---

## Option 3: Using psql Interactive Mode

```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted
```

You'll see: `postgres=#`

Then type:
```sql
CREATE DATABASE fairshare;
```

Press Enter

Then exit:
```sql
\q
```

---

## Which Option Should You Use?

**Use Option 1 (pgAdmin)** if:
- You like GUI tools
- You're not comfortable with command line
- You want to see everything visually

**Use Option 2 or 3 (Command Line)** if:
- You prefer faster command line
- You're comfortable with PowerShell/SQL
- You want to script things

---

## Troubleshooting

### "createdb not recognized"
Run first:
```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"
```

### "Password authentication failed"
- Make sure you're using the correct password
- Check if PostgreSQL service is running

### "Database already exists"
You already have the database! Skip this step and continue to next.

---

## Next Steps After Creating Database

Once the database `fairshare` is created:

1. ✅ Install backend dependencies
2. ✅ Configure .env file
3. ✅ Run Prisma migrations
4. ✅ Start backend server

Let me know when you've created the database! 🚀

