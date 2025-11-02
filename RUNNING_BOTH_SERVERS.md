# How to Run Both Backend and Frontend

## Terminal 1: Backend (Already Running ✅)

Keep this terminal open:
```
PS C:\Users\npmd1\Startup\Splitwise\backend> npm run dev
```

**DO NOT CLOSE THIS!** The backend server needs to keep running.

---

## Terminal 2: Frontend (Need to Start)

**Open a NEW PowerShell window** and run:

```powershell
cd C:\Users\npmd1\Startup\Splitwise\frontend
npm run dev
```

---

## You Should See

**Terminal 1 (Backend):**
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

**Terminal 2 (Frontend):**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## IMPORTANT

**Do NOT close either terminal!** Both servers need to keep running while you use the app.

**To stop:** Press `Ctrl+C` in each terminal when you're done.

---

## Quick Setup

**Already done:**
- ✅ PostgreSQL running
- ✅ Database created
- ✅ Backend running on port 5000

**Just need:**
- ⏳ Start frontend in a new terminal

---

**Open a new terminal and start the frontend now!** 🚀

