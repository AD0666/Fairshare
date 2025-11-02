# FairShare Testing Guide

## How to Test All Features

### 1. Add Friends First

**Go to:** Friends → Add Friends

Search for your friends' emails and add them.

**OR** use the mock data email addresses:
- `jane.smith@example.com`
- `mike.johnson@example.com`

---

### 2. Create a Group

**Go to:** Groups → Create Group

- Name it: "Weekend Trip"
- Select your friends
- Click "Create Group"

---

### 3. Add Expenses

**Go to:** Add Expense or Dashboard → Add Expense

Fill in:
- Description: "Dinner at Restaurant"
- Amount: $150
- Category: Food & Dining
- Paid By: You (Damon)
- **Select your group** from dropdown
- Or manually select friends to split with
- Split: Equally

Click "Create Expense"

---

### 4. View Your Dashboard

**Go to:** Dashboard

You should now see:
- Balance cards with real numbers
- Your balances with each person
- Recent expenses list

---

### 5. Test All Features

✅ **Expenses Page** - View all expenses, edit, delete
✅ **Groups Page** - View all groups
✅ **Friends Page** - Manage friends
✅ **Reports Page** - View charts and statistics

---

## Expected Data Flow

**After creating an expense of $150 split 3 ways:**

1. **Dashboard Balance:**
   - Each friend owes you: $50
   - Total Owed to You: $100
   - Total You Owe: $0
   - Net Balance: $100

2. **Your Balances:**
   - Friend 1 owes you: $50
   - Friend 2 owes you: $50

3. **Recent Expenses:**
   - Shows your new expense
   - Amount: $150
   - Category: Food & Dining

---

## Quick Test Steps

1. ✅ Register account (done!)
2. ⏳ Add friends
3. ⏳ Create group
4. ⏳ Add expense
5. ⏳ View dashboard
6. ⏳ Check reports

---

## Troubleshooting

**Dashboard shows $0?**
- Make sure you created expenses with OTHER people
- You can't owe yourself money
- Add friends first!

**Expense not showing?**
- Click Refresh on dashboard
- Check if expense was created successfully
- Look at backend terminal for errors

**Balance calculations wrong?**
- Check who paid the expense
- Make sure it was split with multiple people
- Verify group members

---

**Go ahead and create your first real expense!** 🚀

