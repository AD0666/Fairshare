# FairShare - Expense Tracking & Bill Splitting App

A full-stack expense tracking and bill splitting application.

## Features

- **User Management**: Registration, authentication, and profile management
- **Expense Management**: Create, edit, and delete expenses with multiple split options
- **Group Management**: Create groups and track group-specific expenses
- **Settlement System**: Simplify debts and settle balances between users
- **Dashboard & Reports**: View spending breakdown with charts and filters
- **Friend System**: Add friends and manage contacts

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Recharts for data visualization
- Context API for state management

### Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication
- bcrypt for password hashing

## Getting Started

### 🚀 Quick Start - Test UI Only (No Backend Required!)

Want to test the UI without setting up the backend? See **[QUICKSTART.md](QUICKSTART.md)** for a 2-minute setup!

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000 and start exploring!
```

### 📋 Full Installation (With Backend)

#### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

#### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd FairShare
\`\`\`

2. Install backend dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
# Edit .env with your database credentials
\`\`\`

4. Set up database
\`\`\`bash
npx prisma migrate dev
npx prisma generate
\`\`\`

5. Start backend server
\`\`\`bash
npm run dev
# Server runs on http://localhost:5000
\`\`\`

6. Install frontend dependencies (in a new terminal)
\`\`\`bash
cd ../frontend
npm install
\`\`\`

7. Start frontend development server
\`\`\`bash
npm run dev
# App runs on http://localhost:3000
\`\`\`

**Note**: The frontend runs with mock data by default. Set `USE_MOCK_DATA = false` in `frontend/src/config.ts` to connect to the backend.

## Project Structure

\`\`\`
FairShare/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── utils/
│   ├── prisma/
│   └── uploads/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── context/
│   └── public/
└── README.md
\`\`\`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Users
- GET /api/users/search?email= - Search users by email
- PUT /api/users/profile - Update user profile
- GET /api/users/:id - Get user details

### Groups
- GET /api/groups - Get all groups for user
- POST /api/groups - Create new group
- GET /api/groups/:id - Get group details
- PUT /api/groups/:id - Update group
- DELETE /api/groups/:id - Delete group
- POST /api/groups/:id/members - Add members
- DELETE /api/groups/:id/members/:userId - Remove member

### Expenses
- GET /api/expenses - Get expenses with filters
- POST /api/expenses - Create expense
- PUT /api/expenses/:id - Update expense
- DELETE /api/expenses/:id - Delete expense

### Settlements
- POST /api/settlements - Record settlement
- GET /api/settlements - Get settlement history
- GET /api/settlements/simplify - Get simplified debts

### Dashboard
- GET /api/dashboard/balance - Get balance summary
- GET /api/dashboard/stats - Get spending statistics

## 🌐 Deployment

Want to deploy FairShare online to share with others? Check out **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for a step-by-step guide!

**Quick deployment options:**
- **Frontend**: Deploy to [Vercel](https://vercel.com) (free)
- **Backend**: Deploy to [Railway](https://railway.app) (free tier available)
- **Database**: PostgreSQL included with Railway

In 10 minutes, your app can be live on the internet! 🚀

## License

MIT

