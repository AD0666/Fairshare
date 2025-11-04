# How to Get Environment Variable Values

## DATABASE_URL

### Step 1: Get from Railway
1. In Railway, click on the **PostgreSQL service** (look for the database icon)
2. Click the **"Variables"** tab
3. Find **`DATABASE_URL`** 
4. **Copy the entire value** (it's long, looks like this):

```
postgresql://postgres:PASSWORD@HOST:PORT/railway?schema=public
```

This is your **DATABASE_URL** - just copy and paste it!

## JWT_SECRET

### Step 2: Generate Random Secret
Run this in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output something like:
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

Copy that entire string - that's your **JWT_SECRET**.

## Complete List of Values

Once you have the above, set these in Railway → Backend Service → Variables:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<paste the URL from PostgreSQL>
JWT_SECRET=<paste the generated string>
JWT_EXPIRES_IN=7d
```

## Example

Here's what it might look like (YOUR values will be different):

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:abc123xyz@containers-us-west-1.railway.app:5678/railway
JWT_SECRET=4f8e2d1a9c7b5e3f2a1d8b6c4e9f7a3d2b1c8e5f9a4d7b2c6e8f1a5d9b3c7e2f
JWT_EXPIRES_IN=7d
```

Just don't share these publicly! 🔒

