import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import useSessionStore, { SessionState } from '../stores/sessionStore';

interface UseWebSocketConnectionProps {
  enabled?: boolean;
}

interface WebSocketMessage {
  chatSessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface WebSocketInterviewUpdate {
  interviewId: string;
  [key: string]: any;
}

interface WebSocketPdfGenerated {
  interviewId: string;
  pdfPath: string;
}

export function useWebSocketConnection({ enabled = true }: UseWebSocketConnectionProps = {}) {
  const { data: sessionData } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  
  // Get session store actions
  const [
    activeChatId,
    activeInterviewId,
    addChatMessage,
    setIsLoading,
    setSessionError
  ] = useSessionStore((state: SessionState) => [
    state.activeChatId,
    state.activeInterviewId,
    state.addChatMessage,
    state.setIsLoading,
    state.setError
  ]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (!enabled || !sessionData?.user) return;
    
    const token = sessionData.accessToken as string;
    
    if (!token) {
      setLocalError('No authentication token available');
      return;
    }
    
    // Create Socket.IO connection
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socketRef.current = socket;
    
    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setLocalError(null);
      
      // Join active rooms if available
      if (activeChatId) {
        joinChatSession(activeChatId);
      }
      
      if (activeInterviewId) {
        joinInterview(activeInterviewId);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });
    
    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setLocalError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });
    
    // Message handlers
    socket.on('chat:message', (message: WebSocketMessage) => {
      console.log('Received chat message:', message);
      addChatMessage(message);
    });
    
    socket.on('interview:update', (update: WebSocketInterviewUpdate) => {
      console.log('Received interview update:', update);
      // Handle interview update
      // Note: updateInterviewData function is not available in the current store
    });
    
    socket.on('pdf:generated', (data: WebSocketPdfGenerated) => {
      console.log('PDF generated:', data);
      // Handle PDF generation
      // Note: setPdfPath function is not available in the current store
    });
    
    socket.on('error', (err) => {
      console.error('WebSocket error:', err);
      setLocalError(err.message);
      setSessionError(err.message);
    });
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        console.log('Cleaning up WebSocket connection');
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [enabled, sessionData, activeChatId, activeInterviewId]);
  
  // Join a chat session room
  const joinChatSession = useCallback((chatSessionId: string) => {
    if (!socketRef.current || !isConnected) return;
    
    console.log(`Joining chat session: ${chatSessionId}`);
    socketRef.current.emit('chat:join', { chatSessionId });
  }, [isConnected]);
  
  // Leave a chat session room
  const leaveChatSession = useCallback((chatSessionId: string) => {
    if (!socketRef.current || !isConnected) return;
    
    console.log(`Leaving chat session: ${chatSessionId}`);
    socketRef.current.emit('chat:leave', { chatSessionId });
  }, [isConnected]);
  
  // Join an interview room
  const joinInterview = useCallback((interviewId: string) => {
    if (!socketRef.current || !isConnected) return;
    
    console.log(`Joining interview: ${interviewId}`);
    socketRef.current.emit('interview:join', { interviewId });
  }, [isConnected]);
  
  // Leave an interview room
  const leaveInterview = useCallback((interviewId: string) => {
    if (!socketRef.current || !isConnected) return;
    
    console.log(`Leaving interview: ${interviewId}`);
    socketRef.current.emit('interview:leave', { interviewId });
  }, [isConnected]);
  
  // Send a chat message
  const sendChatMessage = useCallback((chatSessionId: string, content: string) => {
    if (!socketRef.current || !isConnected) {
      setLocalError('WebSocket not connected');
      return;
    }
    
    const message = {
      chatSessionId,
      role: 'user' as const,
      content,
      timestamp: new Date()
    };
    
    console.log('Sending chat message:', message);
    socketRef.current.emit('chat:message', message);
    
    // Optimistically add the message to the store
    addChatMessage(message);
    
    // Set loading state while waiting for AI response
    setIsLoading(true);
  }, [isConnected, addChatMessage, setIsLoading]);
  
  return {
    isConnected,
    error,
    joinChatSession,
    leaveChatSession,
    joinInterview,
    leaveInterview,
    sendChatMessage
  };
}