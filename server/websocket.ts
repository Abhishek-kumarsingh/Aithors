import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ChatSessionModel, InterviewModel } from '../lib/models/schema-design';

// Define socket interface with data property
interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
  };
}

/**
 * Initialize the WebSocket server
 * @param httpServer The HTTP server to attach the WebSocket server to
 */
export function initializeWebSocketServer(httpServer: http.Server) {
  // Create the Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Middleware for authentication
  io.use((socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      
      // Attach the user ID to the socket
      socket.data.userId = decoded.userId;
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });
  
  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.data.userId}`);
    
    // Join a chat session room
    socket.on('chat:join', async ({ chatSessionId }: { chatSessionId: string }) => {
      try {
        // Verify that the user has access to this chat session
        const chatSession = await ChatSessionModel.findById(chatSessionId);
        
        if (!chatSession) {
          socket.emit('error', { message: 'Chat session not found' });
          return;
        }
        
        if (chatSession.userId.toString() !== socket.data.userId) {
          socket.emit('error', { message: 'Unauthorized access to chat session' });
          return;
        }
        
        // Join the room
        socket.join(`chat:${chatSessionId}`);
        console.log(`User ${socket.data.userId} joined chat session ${chatSessionId}`);
      } catch (error) {
        console.error('Error joining chat session:', error);
        socket.emit('error', { message: 'Failed to join chat session' });
      }
    });
    
    // Leave a chat session room
    socket.on('chat:leave', ({ chatSessionId }: { chatSessionId: string }) => {
      socket.leave(`chat:${chatSessionId}`);
      console.log(`User ${socket.data.userId} left chat session ${chatSessionId}`);
    });
    
    // Join an interview room
    socket.on('interview:join', async ({ interviewId }: { interviewId: string }) => {
      try {
        // Verify that the user has access to this interview
        const interview = await InterviewModel.findById(interviewId);
        
        if (!interview) {
          socket.emit('error', { message: 'Interview not found' });
          return;
        }
        
        if (interview.userId.toString() !== socket.data.userId) {
          socket.emit('error', { message: 'Unauthorized access to interview' });
          return;
        }
        
        // Join the room
        socket.join(`interview:${interviewId}`);
        console.log(`User ${socket.data.userId} joined interview ${interviewId}`);
      } catch (error) {
        console.error('Error joining interview:', error);
        socket.emit('error', { message: 'Failed to join interview' });
      }
    });
    
    // Leave an interview room
    socket.on('interview:leave', ({ interviewId }: { interviewId: string }) => {
      socket.leave(`interview:${interviewId}`);
      console.log(`User ${socket.data.userId} left interview ${interviewId}`);
    });
    
    // Handle chat messages
    socket.on('chat:message', async (message: { chatSessionId: string; role: string; content: string; timestamp: string | Date }) => {
      try {
        const { chatSessionId, role, content, timestamp } = message;
        
        // Verify that the user has access to this chat session
        const chatSession = await ChatSessionModel.findById(chatSessionId);
        
        if (!chatSession) {
          socket.emit('error', { message: 'Chat session not found' });
          return;
        }
        
        if (chatSession.userId.toString() !== socket.data.userId) {
          socket.emit('error', { message: 'Unauthorized access to chat session' });
          return;
        }
        
        // Add the message to the chat session
        chatSession.messages.push({
          role,
          content,
          timestamp: new Date(timestamp)
        });
        
        // Update the lastUpdated field
        chatSession.lastUpdated = new Date();
        
        // Save the chat session
        await chatSession.save();
        
        // Broadcast the message to all clients in the room
        io.to(`chat:${chatSessionId}`).emit('chat:message', {
          chatSessionId,
          role,
          content,
          timestamp
        });
        
        // If the message is from the user, generate an AI response
        if (role === 'user') {
          // Simulate AI processing delay
          setTimeout(async () => {
            try {
              // In a real implementation, this would call an AI service
              const aiResponse = {
                chatSessionId,
                role: 'assistant',
                content: `This is a simulated AI response to: "${content}"`,
                timestamp: new Date()
              };
              
              // Add the AI response to the chat session
              chatSession.messages.push({
                role: aiResponse.role,
                content: aiResponse.content,
                timestamp: aiResponse.timestamp
              });
              
              // Update the lastUpdated field
              chatSession.lastUpdated = new Date();
              
              // Save the chat session
              await chatSession.save();
              
              // Broadcast the AI response to all clients in the room
              io.to(`chat:${chatSessionId}`).emit('chat:message', aiResponse);
            } catch (error) {
              console.error('Error generating AI response:', error);
              socket.emit('error', { message: 'Failed to generate AI response' });
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error handling chat message:', error);
        socket.emit('error', { message: 'Failed to process message' });
      }
    });
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });
  
  // Function to broadcast interview updates
  const broadcastInterviewUpdate = (interviewId: string, data: any) => {
    io.to(`interview:${interviewId}`).emit('interview:update', {
      interviewId,
      ...data
    });
  };
  
  // Function to broadcast PDF generation completion
  const broadcastPdfGenerated = (interviewId: string, pdfPath: string) => {
    io.to(`interview:${interviewId}`).emit('interview:pdf-generated', {
      interviewId,
      pdfPath
    });
  };
  
  // Return the io instance and broadcast functions
  return { io, broadcastInterviewUpdate, broadcastPdfGenerated };
}