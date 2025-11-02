# Quick Start - FairShare UI Testing

This guide will help you quickly test the FairShare UI without setting up the backend.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager

## Quick Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Frontend Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### 3. Test the UI

The application is now running with **mock data**! You can:

✅ **Login/Register** - Use any credentials to test the auth flow
✅ **View Dashboard** - See balance cards, expense summaries, and recent transactions
✅ **Browse Expenses** - View sample expenses with different categories
✅ **Explore Groups** - See sample groups with members
✅ **Check Friends** - View and search for friends
✅ **View Reports** - See charts and spending breakdowns

## Mock Data Includes

- **3 Sample Users**: John Doe, Jane Smith, Mike Johnson
- **2 Groups**: Weekend Trip and Office Lunch Group
- **3 Sample Expenses**: Dinner, Uber, Hotel with different categories
- **2 Friends**: Pre-populated friend list
- **Balance Data**: Showing who owes what
- **Statistics**: Category and monthly breakdowns with charts

## Switching to Real Backend

When you're ready to use the real backend:

1. Update `frontend/src/config.ts`:
```typescript
export const USE_MOCK_DATA = false;
```

2. Make sure your backend is running (see INSTALLATION.md)

## Features You Can Test

### 🔐 Authentication
- Login with any email/password combination
- Register with any credentials
- Session persistence

### 📊 Dashboard
- Balance summary cards (Total You Owe, Total Owed to You, Net Balance)
- Individual balance breakdown
- Recent expenses list
- Empty states

### 💸 Expenses
- View all expenses in a table
- See expense details (payer, category, amount, date)
- Delete expenses (with confirmation)

### 👥 Groups
- View all groups
- See group members and avatars
- Group statistics
- Delete groups

### 👫 Friends
- Search for users by email
- Add friends
- Remove friends
- View friend list

### 📈 Reports
- Category breakdown pie chart
- Monthly spending bar chart
- Summary statistics
- Total spent, paid, and difference

## UI Features

- ✨ **Modern Design**: Clean, intuitive interface with TailwindCSS
- 📱 **Responsive**: Works on mobile, tablet, and desktop
- 🎨 **Color Coding**: Green for money you're owed, red for money you owe
- 🔔 **Toast Notifications**: Success and error messages
- ⚡ **Loading States**: Spinner animations during data fetch
- 🎯 **Empty States**: Helpful messages when no data exists

## Next Steps

After testing the UI:

1. If you like the design, proceed with backend setup from INSTALLATION.md
2. If you want to modify the UI, edit the components in `frontend/src/`
3. Mock data is in `frontend/src/services/mockData.ts` - you can customize it

## Troubleshooting

**Port 3000 already in use?**
- Change the port in `frontend/vite.config.ts`

**Module not found errors?**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**UI not loading?**
- Check the browser console for errors
- Make sure you're accessing http://localhost:3000

## Development Tips

- All mock responses have realistic delays (300-800ms)
- Toast notifications work with mock data
- Form validation is active
- All button clicks and navigation work normally

Enjoy testing the FairShare UI! 🎉

