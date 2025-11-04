const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Setting up database schema...');

try {
  // Change to backend directory
  process.chdir(path.join(__dirname, '..'));
  
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('🗄️  Pushing database schema...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  console.log('✅ Database schema setup complete!');
  process.exit(0);
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}
