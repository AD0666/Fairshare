# Installing PostgreSQL on Windows - FairShare

## Option 1: PostgreSQL Official Installer (Recommended)

### Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Select the latest version (PostgreSQL 15 or 16)
4. Download the Windows x86-64 installer

### Install PostgreSQL

1. Run the downloaded `.exe` file
2. Follow the installation wizard:
   - **Installation Directory:** Leave as default (C:\Program Files\PostgreSQL\15)
   - **Select Components:** 
     - ✅ PostgreSQL Server
     - ✅ pgAdmin 4 (GUI tool - recommended)
     - ✅ Command Line Tools
     - ✅ Stack Builder
   
3. **Data Directory:** Leave as default
4. **Password:** Enter a password (REMEMBER THIS!)
   - Recommended: `postgres`
   - Write this down - you'll need it!
   
5. **Port:** Leave as default (5432)
6. **Locale:** Leave as default
7. Click "Next" and "Finish"

### Verify Installation

1. Open **pgAdmin 4** from Start Menu
2. Enter your password when prompted
3. You should see the PostgreSQL server running

**OR** use PowerShell:
```powershell
# This will work after installation completes
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"
psql --version
```

---

## Option 2: Using Chocolatey (If you have it)

```powershell
# Run as Administrator
choco install postgresql
```

---

## Option 3: Using Winget (Windows 10/11)

```powershell
winget install PostgreSQL.PostgreSQL
```

---

## After Installation

### 1. Start PostgreSQL Service

PostgreSQL should start automatically, but if not:

1. Press `Win + R`
2. Type: `services.msc`
3. Find "PostgreSQL 15" service
4. Right-click → Start

### 2. Add PostgreSQL to PATH

**Temporary (for this session only):**
```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"
```

**Permanent:**
1. Right-click "This PC" → Properties
2. Advanced System Settings → Environment Variables
3. Under "System Variables", find "Path"
4. Click "Edit" → "New"
5. Add: `C:\Program Files\PostgreSQL\15\bin`
6. Click OK on all dialogs
7. Restart your terminal

### 3. Verify Installation

Open a NEW PowerShell window and run:
```powershell
psql --version
# Should show: psql (PostgreSQL) 15.x or 16.x

psql -U postgres
# Enter your password when prompted
# You should see: postgres=#
# Type: \q to exit
```

---

## If Installation Fails

### Common Issues

**Port 5432 already in use:**
- Change port during installation
- Or use: `netstat -ano | findstr :5432` to find what's using it

**Installation hangs:**
- Run installer as Administrator
- Temporarily disable antivirus

**Cannot find psql command:**
- Add PostgreSQL bin folder to PATH (see above)
- Restart your terminal/computer

---

## Next Steps After Installing PostgreSQL

Once PostgreSQL is installed, go back to **[BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)** and continue from Step 2.

---

## Quick Database Creation

After PostgreSQL is installed, create the database:

**Method 1: Using pgAdmin (GUI)**
1. Open pgAdmin 4
2. Expand "Servers" → "PostgreSQL 15"
3. Right-click "Databases" → Create → Database
4. Name: `fairshare`
5. Click "Save"

**Method 2: Using Command Line**
```powershell
# Make sure psql is in PATH
createdb -U postgres fairshare
# Enter your password
```

**Method 3: Using psql**
```powershell
psql -U postgres
```
Then type:
```sql
CREATE DATABASE fairshare;
\q
```

---

## Default Credentials

| Field | Default Value |
|-------|---------------|
| Username | `postgres` |
| Password | (What you set during installation) |
| Port | `5432` |
| Host | `localhost` |

---

## Resources

- **PostgreSQL Download:** https://www.postgresql.org/download/windows/
- **Documentation:** https://www.postgresql.org/docs/
- **pgAdmin Guide:** https://www.pgadmin.org/docs/

---

## Alternative: Use SQLite for Development

If you don't want to install PostgreSQL, you can temporarily use SQLite for development:

**Update backend/prisma/schema.prisma:**
Change:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**Note:** SQLite is simpler but less powerful. PostgreSQL is recommended for production.

---

Good luck! 🚀

