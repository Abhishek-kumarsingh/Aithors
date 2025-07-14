// MongoDB Atlas Connection Test
// Run this script to test your MongoDB Atlas connection

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function testConnection() {
  console.log('🔄 Testing MongoDB Atlas connection...');
  console.log('📍 Connection URI:', uri ? uri.replace(/:[^:@]*@/, ':****@') : 'NOT FOUND');

  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('💡 Make sure you have MONGODB_URI set in your .env.local file');
    return;
  }

  if (uri.includes('<db_password>') || uri.includes('YOUR_ACTUAL_PASSWORD')) {
    console.error('❌ Please replace the placeholder password in your connection string');
    console.log('💡 Edit .env.local and replace YOUR_ACTUAL_PASSWORD with your real database password');
    return;
  }

  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB Atlas
    console.log('🔗 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // Test database operations
    const db = client.db('interviewai');
    console.log('📊 Connected to database: interviewai');

    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));

    // Test write operation
    const testCollection = db.collection('connection_test');
    const testDoc = {
      test: 'Hello from InterviewAI!',
      timestamp: new Date(),
      connection: 'MongoDB Atlas'
    };

    console.log('📝 Testing write operation...');
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted with ID:', insertResult.insertedId);

    // Test read operation
    console.log('📖 Testing read operation...');
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Test document retrieved:', foundDoc.test);

    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('🧹 Test document cleaned up');

    console.log('\n🎉 All tests passed! Your MongoDB Atlas connection is working perfectly.');
    console.log('🚀 You can now start your application with: npm run dev');

  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error('Error:', error.message);
    
    // Provide helpful troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    
    if (error.message.includes('authentication failed')) {
      console.log('• Check your username and password in the connection string');
      console.log('• Verify the database user exists in MongoDB Atlas');
      console.log('• Ensure the user has read/write permissions');
    }
    
    if (error.message.includes('network') || error.message.includes('timeout')) {
      console.log('• Check your internet connection');
      console.log('• Verify your IP address is whitelisted in MongoDB Atlas Network Access');
      console.log('• Try adding 0.0.0.0/0 to allow all IPs (for testing)');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('• Check the cluster URL in your connection string');
      console.log('• Ensure your cluster is running and accessible');
    }
    
    console.log('• Visit MongoDB Atlas dashboard to check cluster status');
    console.log('• Refer to the troubleshooting guide in docs/TROUBLESHOOTING.md');
    
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

// Run the test
testConnection().catch(console.error);
