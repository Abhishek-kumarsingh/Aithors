import express from 'express';
import http from 'http';
import next from 'next';
import mongoose from 'mongoose';
import { initializeWebSocketServer } from './websocket';
import { BackgroundWorker } from '../lib/services/backgroundWorker';

// Determine if we're in development or production
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aithor';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Initialize the server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Prepare Next.js
    await app.prepare();
    
    // Create Express app
    const expressApp = express();
    
    // Create HTTP server
    const server = http.createServer(expressApp);
    
    // Initialize WebSocket server
    const wsServer = initializeWebSocketServer(server);
    const { io, broadcastInterviewUpdate, broadcastPdfGenerated } = wsServer;
    
    // Setup background workers
    const workers = BackgroundWorker.setupBackgroundWorkers({
      onPdfGenerated: (interviewId, pdfPath) => {
        broadcastPdfGenerated(interviewId, pdfPath);
      },
      onInterviewScored: (interviewId, resultSummary) => {
        broadcastInterviewUpdate(interviewId, { resultSummary });
      }
    });
    
    // Add middleware for parsing JSON and URL-encoded data
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    
    // Serve static files from the public directory
    expressApp.use(express.static('public'));
    
    // Handle all other routes with Next.js
    expressApp.all('*', (req, res) => {
      return handle(req, res);
    });
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`> Server listening on http://localhost:${PORT}`);
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = async () => {
      console.log('Shutting down server...');
      
      // Close the HTTP server
      server.close(() => {
        console.log('HTTP server closed');
      });
      
      // Close the WebSocket server
      io.close(() => {
        console.log('WebSocket server closed');
      });
      
      // Close the background workers
      await workers.close();
      console.log('Background workers closed');
      
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
      
      process.exit(0);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();