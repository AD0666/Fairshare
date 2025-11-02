# Quick Deployment Checklist

Follow these steps to deploy FairShare online:

## ✅ Pre-Deployment Checklist

- [ ] Code is committed to GitHub
- [ ] All dependencies are installed
- [ ] Application works locally

## 🚂 Railway (Backend) - 5 minutes

1. **Sign up**: [railway.app](https://railway.app) (use GitHub login)
2. **New Project** → "Deploy from GitHub repo" → Select your repo
3. **Add PostgreSQL**: "+ New" → "Database" → "Add PostgreSQL"
4. **Copy DATABASE_URL**: From PostgreSQL service → Variables tab
5. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<paste from PostgreSQL>
   JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   JWT_EXPIRES_IN=7d
   ```
6. **Configure Build**: 
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma db push`
   - Start Command: `npm run build && npm start`
7. **Deploy**: Railway auto-deploys
8. **Copy your backend URL**: e.g., `https://fairshare-production.up.railway.app`

## ▲ Vercel (Frontend) - 3 minutes

1. **Sign up**: [vercel.com](https://vercel.com) (use GitHub login)
2. **New Project** → Import your GitHub repo
3. **Configure**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
4. **Environment Variables**:
   - `VITE_API_URL`: `<your railway backend URL>`
5. **Deploy**: Click "Deploy"
6. **Copy your frontend URL**: e.g., `https://fairshare.vercel.app`

## 🔗 Connect Them

1. **Back to Railway**: Update `CLIENT_URL` with your Vercel URL
2. **Railway redeploys** automatically

## 🧪 Test

1. Visit your Vercel URL
2. Click "Register"
3. Create an account
4. Add an expense
5. Everything works! 🎉

## 📤 Share

Share your Vercel URL with anyone - they can use FairShare immediately!

## 🆘 Troubleshooting

**Backend won't start?**
- Check Railway logs
- Verify DATABASE_URL is correct
- Make sure Prisma migrations ran

**Can't connect to API?**
- Check VITE_API_URL in Vercel
- Make sure CLIENT_URL in Railway matches Vercel URL
- Check browser console for CORS errors

**Database errors?**
- In Railway, manually run: `npx prisma db push`
- Check PostgreSQL service is running

## 📝 Environment Variables Summary

### Railway (Backend)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=<from PostgreSQL service>
JWT_SECRET=<generate random 64 char string>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your Vercel URL>
```

### Vercel (Frontend)
```
VITE_API_URL=<your Railway backend URL>
```

That's it! Your app is now live on the internet! 🌐

