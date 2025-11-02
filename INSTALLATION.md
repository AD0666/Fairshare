# Installation & Setup Guide - FairShare

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```bash
createdb fairshare
```

2. Copy environment file:
```bash
cd backend
cp .env.example .env
```

3. Edit `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fairshare?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Run Database Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Start the Application

#### Option A: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App will run on http://localhost:3000
```

#### Option B: Run Both Together (Root Directory)

```bash
# From root directory
npm run dev
```

### 5. Access the Application

Open your browser and navigate to: http://localhost:3000

## First Steps

1. **Register a new account** at http://localhost:3000/register
2. **Add friends** by searching for their email addresses
3. **Create a group** with your friends
4. **Add expenses** and split them among group members
5. **View your balance** on the dashboard
6. **Use the settle up feature** to record payments

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
- Change PORT in `backend/.env` for backend
- Change server port in `frontend/vite.config.ts` for frontend

### Module Not Found Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Prisma cache: `npx prisma generate --force`

### API Connection Issues
- Verify backend is running on correct port
- Check CORS settings in `backend/src/index.ts`
- Verify CLIENT_URL in `.env` matches frontend URL

## Development Commands

### Backend
```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm start            # Run production build
npm run prisma:studio # Open Prisma Studio
```

### Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
FairShare/
├── backend/
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, validation middleware
│   │   ├── utils/          # Utilities and helpers
│   │   ├── config/         # Configuration files
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── uploads/            # File uploads directory
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # Utilities
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── public/             # Static assets
└── README.md

```

## Next Steps

- Add receipt image uploads using Cloudinary
- Implement real-time notifications with WebSockets
- Add export to PDF/CSV functionality
- Create mobile responsive improvements
- Add unit and integration tests

## Support

For issues or questions, please check the README.md or open an issue on GitHub.

