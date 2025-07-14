import mongoose from 'mongoose';

// Define the type for the global mongoose cache
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Define the global mongoose variable with the correct type
declare global {
  var mongoose: MongooseCache;
}

// Initialize the global mongoose cache
global.mongoose = global.mongoose || { conn: null, promise: null };

/**
 * Connect to MongoDB using Mongoose
 * @returns A Promise that resolves to a Mongoose connection
 */
export async function connectToMongoDB(): Promise<mongoose.Connection> {
  // If we already have a connection, return it
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // If we don't have a connection but have a promise, return the promise
  if (!global.mongoose.conn && global.mongoose.promise) {
    return global.mongoose.promise;
  }

  // Check if MONGODB_URI is defined
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  // Connect to MongoDB
  global.mongoose.promise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  } as mongoose.ConnectOptions).then((mongoose) => {
    return mongoose.connection;
  });

  // Store the connection
  global.mongoose.conn = await global.mongoose.promise;

  return global.mongoose.conn;
}

// Export the connectToMongoDB function as the default export for backward compatibility
export default connectToMongoDB;
