# ✅ Next Steps - Configure & Deploy

Your backend is deployed! Now follow these steps:

## Step 1: Configure Backend Environment Variables ⚙️

You need to add environment variables to your backend service in Railway.

### 1.1 Get DATABASE_URL

1. In Railway, go back to your project overview
2. **Click on the PostgreSQL service** (🗄️ database icon)
3. Click **"Variables"** tab
4. Find **`DATABASE_URL`** and **copy the entire value** (it's long!)
   - It looks like: `postgresql://postgres:PASSWORD@containers-us-west-1.railway.app:5432/railway`

### 1.2 Add Variables to Backend Service

1. **Click on your Backend Service** (the one with 🔗 GitHub icon)
2. Click **"Variables"** tab
3. Click **"+ New Variable"** and add these **5 variables**:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<paste the DATABASE_URL you just copied>
JWT_SECRET=8558086994f8eaddd40d93290737e34970a2baf68813baa41b8111225efcc6f3
JWT_EXPIRES_IN=7d
```

**Important:** 
- Replace `<paste the DATABASE_URL you just copied>` with the actual URL
- Use the JWT_SECRET shown above (already generated for you)

4. Click **"Add"** or **"Save"** for each variable
5. Railway will **automatically redeploy** after you save

### 1.3 Get Your Backend URL

1. In your **Backend Service**, click **"Settings"** tab
2. Look for **"Generate Domain"** button and click it
3. Copy the URL (e.g., `https://fairshare-production-xxxx.up.railway.app`)
4. **Save this URL** - you'll need it in Step 2!

---

## Step 2: Deploy Frontend to Vercel 🌐

### 2.1 Sign Up for Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### 2.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find and select your **FairShare repository**
3. Click **"Import"**

### 2.3 Configure Project

1. **Framework Preset**: `Vite` (should auto-detect)
2. **Root Directory**: Click "Edit" → Select **`frontend`** folder
3. **Build Command**: `npm run build` (should be auto-filled)
4. **Output Directory**: `dist` (should be auto-filled)

### 2.4 Add Environment Variable

In the **"Environment Variables"** section:

- **Name**: `VITE_API_URL`
- **Value**: `<paste your Railway backend URL from Step 1.3>`

For example: `https://fairshare-production-xxxx.up.railway.app`

**Important:** Make sure there's **NO trailing slash** at the end!

### 2.5 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. Once done, you'll see your **Vercel URL** (e.g., `https://fairshare.vercel.app`)
4. **Copy this URL** - this is your live app!

---

## Step 3: Connect Frontend to Backend 🔗

### 3.1 Update Backend CORS

1. Go back to **Railway** → Your **Backend Service**
2. Click **"Variables"** tab
3. Add or update:
   ```
   CLIENT_URL=<paste your Vercel URL from Step 2.5>
   ```
4. Railway will **automatically redeploy**

---

## Step 4: Test Your App! 🎉

1. Open your **Vercel URL** in a browser
2. You should see the **FairShare login page**
3. Click **"Register"**
4. Create a test account:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`
5. Click **"Sign Up"**
6. You should be redirected to the dashboard!

### Test These Features:

- ✅ Create an expense
- ✅ View dashboard balances
- ✅ Check reports
- ✅ Add friends
- ✅ Create groups

---

## 🎯 Quick Checklist

- [ ] Got DATABASE_URL from PostgreSQL service
- [ ] Added 5 environment variables to backend service
- [ ] Got backend URL from Railway
- [ ] Signed up for Vercel
- [ ] Deployed frontend to Vercel
- [ ] Added VITE_API_URL to Vercel
- [ ] Added CLIENT_URL to Railway backend
- [ ] Tested the app - created account and logged in

---

## ❓ Need Help?

If you encounter errors:
- Check Railway logs: Backend Service → "Logs" tab
- Check Vercel logs: Your project → "Deployments" → Click latest → "View Build Logs"
- Verify all environment variables are set correctly
- Make sure backend URL has no trailing slash

**You're almost done! Let's get your app live! 🚀**
