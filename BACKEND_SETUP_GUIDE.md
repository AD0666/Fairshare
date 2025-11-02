# Backend Setup Guide - FairShare

This detailed guide will walk you through setting up the FairShare backend from scratch.

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js** (v18 or higher) installed
- [ ] **PostgreSQL** (v14 or higher) installed and running
- [ ] **npm** or **yarn** installed

### How to Check if You Have Prerequisites

**Check Node.js:**
```bash
node --version
# Should show v18.x.x or higher
```

**Check PostgreSQL:**
```bash
psql --version
# Should show PostgreSQL version

# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"
```

If PostgreSQL is installed but not running, start it with:
- Windows: Services > PostgreSQL > Start
- Mac: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

---

## Step-by-Step Backend Setup

### Step 1: Install Backend Dependencies

1. Open your terminal and navigate to the project root
2. Go to the backend folder:
```bash
cd backend
```

3. Install all dependencies:
```bash
npm install
```

**What this does:** Downloads all Node.js packages (Express, Prisma, bcrypt, JWT, etc.)

**Expected output:**
```
added 250+ packages, and audited 250+ packages
```

---

### Step 2: Set Up PostgreSQL Database

#### A. Create the Database

**Option 1: Using Command Line (Recommended)**
```bash
createdb fairshare
```

**Option 2: Using psql**
```bash
psql -U postgres
```
Then inside psql:
```sql
CREATE DATABASE fairshare;
\q
```

**Option 3: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name it "fairshare"
4. Click Save

#### B. Verify Database Creation
```bash
psql -U postgres -l
# Look for "fairshare" in the list
```

---

### Step 3: Configure Environment Variables

1. In the backend folder, copy the example environment file:
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

2. Open `.env` file in a text editor and update:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
# Replace with YOUR PostgreSQL username and password
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/fairshare?schema=public"

# JWT Secret (Generate a random string)
JWT_SECRET=change-this-to-a-random-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# CORS (Frontend URL)
CLIENT_URL=http://localhost:3000

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**Important Changes:**
- Replace `YOUR_USERNAME` with your PostgreSQL username (often "postgres")
- Replace `YOUR_PASSWORD` with your PostgreSQL password
- Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)

**Example with defaults:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fairshare?schema=public"
```

---

### Step 4: Generate Prisma Client

Prisma needs to generate TypeScript types based on your database schema:

```bash
npx prisma generate
```

**What this does:** Creates TypeScript types for all your database models

**Expected output:**
```
✔ Generated Prisma Client (v5.x.x)
```

---

### Step 5: Run Database Migrations

This creates all the tables in your database:

```bash
npx prisma migrate dev
```

**What this does:** 
- Creates a migration file
- Runs SQL to create all tables (Users, Groups, Expenses, etc.)
- Applies the migration to your database

**You'll be prompted:** "Enter a name for the new migration:"
- Just press Enter to use the default name

**Expected output:**
```
✔ Applied migration: 20240101_initial_setup
```

**If there's an error:** Check your DATABASE_URL in `.env` file

---

### Step 6: Verify Database Setup (Optional but Recommended)

Open Prisma Studio to view your database:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- See the schema
- Manually add/edit data for testing

**Leave this terminal open** - Prisma Studio keeps running.

---

### Step 7: Create Uploads Directory

The backend needs a folder for storing uploaded images:

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path uploads

# Mac/Linux
mkdir -p uploads
```

---

### Step 8: Start the Backend Server

In a NEW terminal window (keep Prisma Studio running if you opened it):

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

**If there's an error about database connection:**
1. Check PostgreSQL is running: `psql -U postgres -c "SELECT 1;"`
2. Verify DATABASE_URL in `.env` file
3. Make sure the database "fairshare" exists

---

### Step 9: Test the Backend

Open your browser and go to:
```
http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

✅ **Backend is running successfully!**

---

### Step 10: Connect Frontend to Backend

Now that your backend is running, connect the frontend:

1. Open `frontend/src/config.ts`
2. Change this line:
```typescript
export const USE_MOCK_DATA = false;  // Changed from true to false
```

3. The frontend is already running, so it should auto-reload!

**Verify connection:**
- Try to login/register at `http://localhost:3000`
- Check the Network tab in browser DevTools
- You should see API calls to `localhost:5000`

---

## Troubleshooting Common Issues

### Issue 1: "Prisma schema not found"
```bash
cd backend
npx prisma generate
```

### Issue 2: "Database connection refused"
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Try: `psql -U postgres -d fairshare -c "SELECT 1;"`

### Issue 3: "Port 5000 already in use"
- Change PORT in `backend/.env` file
- Or kill the process: `netstat -ano | findstr :5000` (Windows) or `lsof -ti:5000 | xargs kill` (Mac/Linux)

### Issue 4: "Module not found errors"
```bash
cd backend
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue 5: "JWT_SECRET is not defined"
- Make sure `.env` file exists in backend folder
- Restart the server after changing `.env`

---

## What Each Component Does

| Component | Purpose |
|-----------|---------|
| **Express** | Web server framework |
| **Prisma** | Database ORM (Object-Relational Mapping) |
| **PostgreSQL** | Database for storing data |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **CORS** | Allow frontend to connect |

---

## Next Steps

Once backend is running successfully:

1. ✅ Register your first user
2. ✅ Create a test group
3. ✅ Add expenses
4. ✅ Test the balance calculations
5. ✅ Explore all features!

---

## Running Both Servers Together

You can run frontend and backend together from the root directory:

**Terminal 1:**
```bash
# From project root
npm run dev
```

This runs both servers simultaneously!

---

## Database Management

**View Database:** `npx prisma studio`

**Reset Database:**
```bash
npx prisma migrate reset
# This drops all tables and recreates them
# ⚠️ This DELETES all data!
```

**Create New Migration:**
```bash
npx prisma migrate dev --name description_of_changes
```

---

## Production Deployment

When ready for production:

1. Change `NODE_ENV=production` in `.env`
2. Generate production build: `npm run build`
3. Start server: `npm start`
4. Use a process manager (PM2, systemd, etc.)
5. Set up SSL/HTTPS
6. Use production database
7. Update JWT_SECRET to a strong value
8. Configure proper CORS origins

---

## Need Help?

- Check `INSTALLATION.md` for general setup
- See `README.md` for API endpoints
- View logs in terminal for errors
- Check Prisma Studio for database issues

**Your FairShare backend should now be running! 🎉**

