# How to Check Your Database in pgAdmin

## Step 1: Open pgAdmin 4

From your Start Menu, open **pgAdmin 4**.

## Step 2: Connect to Your Database

1. In the left panel, expand **Servers**
2. Expand **PostgreSQL 18** (or your version)
3. Double-click to enter password if prompted
4. Expand **Databases**
5. Expand **fairshare** database
6. Expand **Schemas**
7. Expand **public** (this is where your tables are!)
8. Expand **Tables**

## Step 3: View Your Data

You'll see all your tables:
- ✅ `expenses`
- ✅ `expense_splits`
- ✅ `friendships`
- ✅ `group_members`
- ✅ `groups`
- ✅ `settlements`
- ✅ `users`

**To view data:**
1. Right-click on a table (e.g., `users`)
2. Click **View/Edit Data** → **All Rows**

## Quick Example: Check Users

1. Right-click **users** table
2. **View/Edit Data** → **All Rows**
3. You should see the user(s) you just registered!

---

## What Should You See?

After registering a user in the UI, the `users` table should show:
- `id` (long string)
- `email` (your email)
- `name` (your name)
- `password_hash` (hashed password)
- `created_at` (timestamp)

---

## Pro Tip: Refresh pgAdmin

Sometimes you need to refresh to see new data:
- Right-click the **fairshare** database
- Click **Refresh**

---

## If You Don't See Data

**Check:**
1. Is the backend server still running? (check Terminal 1)
2. Did you get any errors in the browser console?
3. Try refreshing pgAdmin

**Let me know what you see in the users table!** 🔍

