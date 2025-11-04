#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "--- Starting Fairshare Backend Deployment ---"

# Navigate to the backend directory (Railway might start from root)
cd "$(dirname "$0")" || exit

echo "📍 Current directory: $(pwd)"

echo "1️⃣ Building TypeScript code..."
npm run build

echo "2️⃣ Generating Prisma Client..."
npx prisma generate

echo "3️⃣ Pushing database schema to PostgreSQL..."
npx prisma db push --accept-data-loss --skip-generate

echo "✅ Database schema setup complete!"
echo "4️⃣ Starting Node.js server..."
exec npm start
