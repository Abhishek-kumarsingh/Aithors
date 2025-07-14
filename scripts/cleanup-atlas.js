#!/usr/bin/env node

/**
 * MongoDB Atlas Cleanup Script
 * Removes all dummy/test data from MongoDB Atlas
 * Prepares database for fresh production seeding
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

console.log('🧹 MongoDB Atlas Cleanup Script');
console.log('===============================');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

if (!MONGODB_URI.includes('mongodb+srv://')) {
  console.error('❌ This script is designed for MongoDB Atlas (mongodb+srv://)');
  console.log('💡 Current URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
  process.exit(1);
}

console.log('✅ Using MongoDB Atlas:', MONGODB_URI.replace(/:[^:@]*@/, ':****@'));

async function cleanupAtlasDatabase() {
  try {
    console.log('\n🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📊 Found ${collections.length} collections to clean:`);
    
    let totalDocuments = 0;
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      
      if (count > 0) {
        console.log(`   📁 ${collectionName}: ${count} documents`);
        totalDocuments += count;
      }
    }

    if (totalDocuments === 0) {
      console.log('✅ Database is already clean - no documents to remove');
      return;
    }

    console.log(`\n⚠️  About to delete ${totalDocuments} documents from ${collections.length} collections`);
    console.log('🚨 This action cannot be undone!');
    
    // In a real scenario, you might want to add a confirmation prompt
    // For automation, we'll proceed directly
    
    console.log('\n🧹 Cleaning collections...');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const result = await mongoose.connection.db.collection(collectionName).deleteMany({});
      
      if (result.deletedCount > 0) {
        console.log(`   ✅ Cleaned ${collectionName}: ${result.deletedCount} documents removed`);
      }
    }

    console.log('\n🗑️  Dropping empty collections...');
    for (const collection of collections) {
      try {
        await mongoose.connection.db.collection(collection.name).drop();
        console.log(`   ✅ Dropped collection: ${collection.name}`);
      } catch (error) {
        // Collection might already be empty/dropped
        if (error.code !== 26) { // NamespaceNotFound
          console.log(`   ⚠️  Could not drop ${collection.name}: ${error.message}`);
        }
      }
    }

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('🎯 Your MongoDB Atlas database is now clean and ready for fresh data');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm run seed-atlas');
    console.log('   2. Start your app: npm run dev');

  } catch (error) {
    console.error('\n❌ Error cleaning database:', error);
    
    if (error.name === 'MongoNetworkError') {
      console.log('💡 Network error - check your internet connection and MongoDB Atlas access');
    } else if (error.name === 'MongooseError') {
      console.log('💡 Database connection error - verify your MONGODB_URI');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

// Run the cleanup script
if (require.main === module) {
  cleanupAtlasDatabase();
}

module.exports = { cleanupAtlasDatabase };
