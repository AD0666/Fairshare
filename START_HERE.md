# 🚀 Start Here - FairShare Backend Setup

Welcome! Follow these steps to get your FairShare backend running.

## Your Current Status

✅ **Frontend:** Already running with mock data on `http://localhost:3000`
❌ **PostgreSQL:** Not installed yet
❌ **Backend:** Not set up yet

---

## Quick Path to Success

### Step 1: Install PostgreSQL ✅

**You don't have PostgreSQL yet.** Install it first:

👉 **See: [POSTGRESQL_INSTALLATION_WINDOWS.md](POSTGRESQL_INSTALLATION_WINDOWS.md)**

**Quick version:**
1. Download: https://www.postgresql.org/download/windows/
2. Run installer
3. Set password to: `postgres` (remember this!)
4. Complete installation
5. Verify with: `psql --version`

**⏱️ Takes:** ~5 minutes

---

### Step 2: Create the Database ✅

After PostgreSQL is installed:

```powershell
# Add PostgreSQL to PATH (if needed)
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"

# Create the database
createdb -U postgres fairshare
# Password: postgres
```

**Alternative using pgAdmin:**
1. Open pgAdmin from Start Menu
2. Double-click "PostgreSQL 15"
3. Right-click "Databases" → Create → Database
4. Name: `fairshare`
5. Save

---

### Step 3: Install Backend Dependencies ✅

```powershell
# Make sure you're in project root
cd c:\Users\npmd1\Startup\Splitwise

cd backend
npm install
```

**⏱️ Takes:** ~30 seconds

---

### Step 4: Configure Environment Variables ✅

```powershell
# Copy the example file
Copy-Item .env.example .env
```

**Edit `backend\.env` file** with Notepad or any editor:

```env
PORT=5000
NODE_ENV=development

# Change YOUR_PASSWORD to what you set during PostgreSQL installation
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fairshare?schema=public"

JWT_SECRET=this-is-a-secret-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**Important:** Replace `YOUR_PASSWORD` with your PostgreSQL password!

---

### Step 5: Initialize Database ✅

```powershell
# Still in backend folder
npx prisma generate
npx prisma migrate dev
```

When prompted for migration name, just press Enter.

**Expected output:**
```
✔ Generated Prisma Client
✔ Applied migration
```

**⏱️ Takes:** ~10 seconds

---

### Step 6: Create Uploads Folder ✅

```powershell
# Create folder for file uploads
New-Item -ItemType Directory -Force -Path uploads
```

---

### Step 7: Start Backend Server ✅

**Open a NEW terminal window** (keep the frontend running):

```powershell
cd c:\Users\npmd1\Startup\Splitwise\backend
npm run dev
```

**You should see:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

**✅ Backend is running!**

---

### Step 8: Connect Frontend to Backend ✅

1. Open: `frontend/src/config.ts`
2. Change line 2:
```typescript
export const USE_MOCK_DATA = false;  // Change from true
```

3. Save the file - frontend will auto-reload!

---

### Step 9: Test Everything! 🎉

Open browser: **http://localhost:3000**

**Try:**
1. Click "Sign in" or "Sign up"
2. Create a new account
3. Go to Dashboard - should see real data now!
4. Create a group
5. Add expenses
6. View reports

**✅ Everything is working!**

---

## Common Issues & Quick Fixes

### "psql command not found"
```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"
```

### "Database connection failed"
- Check PostgreSQL service is running
- Verify DATABASE_URL password in `.env`
- Make sure database `fairshare` exists

### "Port 5000 in use"
```powershell
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### "Module not found"
```powershell
cd backend
Remove-Item -Recurse -Force node_modules
npm install
```

---

## What You Should Have Now

✅ PostgreSQL installed and running
✅ Database "fairshare" created
✅ Backend dependencies installed
✅ `.env` file configured
✅ Database migrations applied
✅ Backend server running on port 5000
✅ Frontend connected to backend
✅ Full app working!

---

## File Checklist

Make sure these exist:
- ✅ `backend/.env` (created from .env.example)
- ✅ `backend/uploads/` (empty folder)
- ✅ `backend/node_modules/` (installed)
- ✅ Database `fairshare` in PostgreSQL

---

## Running Order

1. **Start PostgreSQL** (already running as a service)
2. **Start Backend:** `cd backend && npm run dev`
3. **Start Frontend:** `cd frontend && npm run dev` (already running!)
4. **Open Browser:** http://localhost:3000

---

## Need Help?

- **PostgreSQL issues:** See POSTGRESQL_INSTALLATION_WINDOWS.md
- **Backend issues:** See BACKEND_SETUP_GUIDE.md
- **API docs:** See README.md
- **General:** Check terminal logs for errors

---

## Quick Commands Reference

```powershell
# PostgreSQL
psql -U postgres -l                           # List databases
psql -U postgres -d fairshare                 # Connect to database

# Prisma
npx prisma generate                            # Generate client
npx prisma migrate dev                         # Run migrations
npx prisma studio                              # Open database GUI

# Backend
cd backend
npm install                                    # Install deps
npm run dev                                    # Start server

# Frontend
cd frontend
npm install                                    # Install deps
npm run dev                                    # Start server
```

---

## Next Steps After Setup

1. ✅ Create your account
2. ✅ Add friends
3. ✅ Create groups
4. ✅ Add expenses
5. ✅ Test all features
6. ✅ Explore the dashboard
7. ✅ Check reports

**You're all set! Enjoy FairShare! 🎉**

