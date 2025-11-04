# How to Add VITE_API_URL in Vercel

You're on the correct page! Here's exactly where to enter it:

## Step-by-Step:

### 1. Find the "Key" and "Value" Fields

On the "Environment Variables" page you're viewing, you'll see:
- A **"Key"** input field (on the left)
- A **"Value"** input field (on the right)

### 2. Enter the Key

1. Click in the **"Key"** field (left side)
2. Type exactly: `VITE_API_URL`
   - Must be all caps
   - Use underscores (not hyphens)

### 3. Enter the Value

1. Click in the **"Value"** field (right side)
2. Paste your **Railway backend URL** (the one you copied from Step 1.3)
   - It looks like: `https://fairshare-production-xxxx.up.railway.app`
   - Make sure there's **NO trailing slash** at the end!

### 4. If You Don't See Empty Fields

If there's no empty row to enter a new variable:
1. Look for a **"+ Add Another"** button
2. Click it to create a new row
3. Then follow steps 2-3 above

### 5. Save

1. Scroll down to find the **black "Save"** button (usually at the bottom right)
2. Click **"Save"**
3. Vercel will save your environment variable

---

## Visual Guide:

```
┌─────────────────────────────────────────────┐
│ Environment Variables                       │
├─────────────────────────────────────────────┤
│                                             │
│ Key              │ Value                    │
├──────────────────┼──────────────────────────┤
│ VITE_API_URL     │ https://fairshare-...    │ ← Enter here!
│                  │                          │
└─────────────────────────────────────────────┘
                  ↓
            [Save Button]
```

---

## Important Notes:

✅ **Key must be:** `VITE_API_URL` (exactly like this)  
✅ **Value must be:** Your Railway backend URL (no trailing slash)  
✅ **Click Save** after entering  
✅ **"Environments"** dropdown can stay as "All Environments"

That's it! Once you save, Vercel will use this URL when building your app. 🚀
