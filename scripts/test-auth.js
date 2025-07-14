const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    // Test if we can access the users collection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check if users collection exists and has data
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`Users in database: ${userCount}`);
    
    if (userCount > 0) {
      const users = await usersCollection.find({}).toArray();
      console.log('Existing users:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Suggestions:');
      console.log('1. Make sure MongoDB is running locally');
      console.log('2. Or update MONGODB_URI to use a cloud database');
      console.log('3. Check if the port 27017 is correct');
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔍 Checking environment variables...');
  
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'MONGODB_URI'
  ];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName.includes('SECRET') || varName.includes('CLIENT_SECRET')) {
        console.log(`✅ ${varName}: [HIDDEN]`);
      } else {
        console.log(`✅ ${varName}: ${value}`);
      }
    } else {
      console.log(`❌ ${varName}: NOT SET`);
    }
  });
}

async function main() {
  console.log('🚀 InterviewAI Authentication Test\n');
  
  await testEnvironmentVariables();
  await testConnection();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Ensure MongoDB is running and accessible');
  console.log('2. Run the seeding script: node scripts/seed-admin.js');
  console.log('3. Test login with alpsingh03@gmail.com / Aa2275aA');
  console.log('4. Test Google OAuth login');
}

main().catch(console.error);
