import prisma from '../utils/prisma';

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Verify that the users table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "users" LIMIT 1`;
      console.log('✅ Database tables verified');
    } catch (error: any) {
      if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
        console.error('❌ CRITICAL: Database tables do not exist!');
        console.error('❌ Please run: npx prisma db push');
        console.error('❌ Or check Railway deployment logs for database setup errors');
        throw new Error('Database schema not initialized. Tables missing.');
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

