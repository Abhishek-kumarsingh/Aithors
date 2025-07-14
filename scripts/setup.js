const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Run a command and log the output
 * @param {string} command - The command to run
 * @param {string} description - Description of the command
 */
function runCommand(command, description) {
  console.log(`\n🚀 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

/**
 * Check if MongoDB is running
 */
function checkMongoDB() {
  console.log('\n🔍 Checking MongoDB connection...');
  try {
    // Simple check - this will throw an error if MongoDB is not running
    execSync('mongosh --eval "db.version()" --quiet', { stdio: 'pipe' });
    console.log('✅ MongoDB is running!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB check failed. Make sure MongoDB is installed and running.');
    console.log('   You can start MongoDB with: mongod --dbpath=./data');
    return false;
  }
}

/**
 * Main setup function
 */
async function setup() {
  console.log('\n====================================');
  console.log('🔧 AITHOR SETUP AND BUILD PROCESS');
  console.log('====================================\n');

  // Check if .env file exists, create if not
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    const envContent = `MONGODB_URI=mongodb://localhost:27017/aithor\nNEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production\nNEXTAUTH_URL=http://localhost:3000\n`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created!');
  } else {
    console.log('✅ .env file already exists.');
  }

  // Check MongoDB connection
  const mongodbRunning = checkMongoDB();
  if (!mongodbRunning) {
    console.log('\n⚠️ MongoDB check failed. Continuing with setup, but seeding may fail.');
  }

  // Install dependencies
  if (!runCommand('npm install', 'Installing dependencies')) {
    console.error('\n❌ Setup failed at dependency installation. Please fix the errors and try again.');
    process.exit(1);
  }

  // Seed the database
  if (mongodbRunning) {
    if (!runCommand('npx ts-node scripts/seed-data.ts', 'Seeding database')) {
      console.error('\n⚠️ Database seeding failed. Continuing with build process.');
    }
  }

  // Build the project
  if (!runCommand('npm run build', 'Building project')) {
    console.error('\n❌ Build failed. Please fix the errors and try again.');
    process.exit(1);
  }

  console.log('\n====================================');
  console.log('🎉 SETUP COMPLETED SUCCESSFULLY!');
  console.log('====================================');
  console.log('\nYou can now start the development server with: npm run dev');
  console.log('Or start the production server with: npm start');
  
  if (mongodbRunning) {
    console.log('\nSample login credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');
  }
}

// Run the setup
setup();