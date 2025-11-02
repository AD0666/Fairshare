# Configure .env File - FairShare Backend

## Important: You Need to Edit the .env File!

You created the `.env` file from the template, but it has placeholder values. You need to update the PostgreSQL password.

---

## How to Edit the .env File

### Option 1: Using Notepad
1. Open File Explorer
2. Navigate to: `C:\Users\npmd1\Startup\Splitwise\backend\`
3. Right-click on `.env` file
4. Click "Open with" → "Notepad"

### Option 2: Using PowerShell
```powershell
cd C:\Users\npmd1\Startup\Splitwise\backend
notepad .env
```

### Option 3: Using VS Code
```powershell
cd C:\Users\npmd1\Startup\Splitwise\backend
code .env
```

---

## What to Change

Find this line in the .env file:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fairshare?schema=public"
```

**Replace `YOUR_PASSWORD`** with the actual password you set during PostgreSQL installation.

**Example:**
If your PostgreSQL password is "mypassword123", change it to:

```
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/fairshare?schema=public"
```

---

## Full .env File Should Look Like This:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/fairshare?schema=public"

JWT_SECRET=this-is-a-secret-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

---

## Don't Know Your PostgreSQL Password?

### Option 1: Try Common Defaults
- `postgres`
- `admin`
- `password`

### Option 2: Reset PostgreSQL Password

If you can't remember, you need to reset it:

1. Open File Explorer
2. Go to: `C:\Program Files\PostgreSQL\15\data\`
3. Find and open `pg_hba.conf` with Notepad
4. Find the line: `host all all 127.0.0.1/32 scram-sha-256`
5. Change to: `host all all 127.0.0.1/32 md5`
6. Save and close
7. Restart PostgreSQL service:
   - Press `Win + R`, type `services.msc`
   - Find "PostgreSQL" service
   - Right-click → Restart
8. Open pgAdmin and reset password from Tools menu

**Or just reinstall PostgreSQL with a password you remember**

---

## After Saving .env File

Once you've updated the password and saved the file:

1. ✅ Close the .env file editor
2. ⏭️ Continue to next step: Generate Prisma client

---

## Verify .env File Exists

Run this in PowerShell to check:

```powershell
cd C:\Users\npmd1\Startup\Splitwise\backend
Test-Path .env
# Should return: True
```

---

## Quick Check

Before moving forward, make sure:
- ✅ `.env` file exists in backend folder
- ✅ `DATABASE_URL` has your actual PostgreSQL password
- ✅ No quotes are missing around values

Then tell me when you're ready to continue! 🚀

