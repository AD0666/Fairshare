# Your Environment Variable Values

## JWT_SECRET (Generated for You)

Here's your secure JWT secret:

```
8558086994f8eaddd40d93290737e34970a2baf68813baa41b8111225efcc6f3
```

## DATABASE_URL (Get from Railway)

**You need to get this from Railway:**

1. Open Railway dashboard: https://railway.app
2. Click on your project
3. Click on the **PostgreSQL service** (database icon)
4. Click **"Variables"** tab
5. Find **`DATABASE_URL`**
6. **Copy the entire value** (it's long!)

## Complete Setup Instructions

### In Railway → Your Backend Service → Variables Tab

Add these EXACTLY as shown:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<paste from PostgreSQL service Variables tab>
JWT_SECRET=8558086994f8eaddd40d93290737e34970a2baf68813baa41b8111225efcc6f3
JWT_EXPIRES_IN=7d
```

## Important Notes

⚠️ **Keep JWT_SECRET secret** - don't share it publicly
⚠️ **DATABASE_URL** will be unique to your Railway PostgreSQL instance
⚠️ You can't copy DATABASE_URL from here - you MUST get it from Railway

## Quick Copy-Paste

For easy reference, here's the JWT_SECRET again:
```
8558086994f8eaddd40d93290737e34970a2baf68813baa41b8111225efcc6f3
```

## Next Steps

1. Go to Railway → PostgreSQL service → Variables tab
2. Copy DATABASE_URL
3. Go to Backend service → Variables tab  
4. Paste all 5 environment variables
5. Save
6. Redeploy

Done! 🚀

