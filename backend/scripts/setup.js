const { execSync } = require('child_process');
const path = require('path');

console.log('--- Starting Fairshare Backend Deployment ---');

try {
  // Change to backend directory if not already there
  const backendDir = path.join(__dirname, '..');
  process.chdir(backendDir);
  console.log('📍 Current directory:', process.cwd());

  console.log('🗄️  Pushing database schema to PostgreSQL...');
  execSync('npx prisma db push --accept-data-loss --skip-generate', { 
    stdio: 'inherit', 
    cwd: backendDir 
  });

  console.log('✅ Database schema setup complete!');
  console.log('🚀 Starting Node.js server...');
  
  // Start the server
  require('../dist/index.js');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
