import { io, Socket } from 'socket.io-client';
import useSessionStore from '../stores/sessionStore';

/**
 * WebSocket service for real-time updates
 */
export class WebSocketService {
  private static socket: Socket | null = null;
  private static isConnected = false;
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 5;
  private static reconnectDelay = 2000; // 2 seconds
  
  /**
   * Initialize the WebSocket connection
   * @param userId The user ID for authentication
   * @param token The authentication token
   */
  static initialize(userId: string, token: string) {
    if (this.socket) {
      // Already initialized
      return;
    }
    
    // Create the socket connection
    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:5001', {
      auth: {
        token
      },
      query: {
        userId
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 10000
    });
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Set up WebSocket event listeners
   */
  private static setupEventListeners() {
    if (!this.socket) {
      return;
    }
    
    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log(`WebSocket disconnected: ${reason}`);
      this.isConnected = false;
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnect attempts reached, giving up');
        this.socket?.disconnect();
      }
    });
    
    // Chat message events
    this.socket.on('chat:message', (message) => {
      console.log('Received chat message:', message);
      
      // Add the message to the session store
      const { activeChatId, addChatMessage } = useSessionStore.getState();
      
      if (activeChatId === message.chatSessionId) {
        addChatMessage({
          role: message.role,
          content: message.content,
          timestamp: new Date(message.timestamp)
        });
      }
    });
    
    // Interview events
    this.socket.on('interview:update', (data) => {
      console.log('Received interview update:', data);
      
      // Update the interview state if it's the active interview
      const { activeInterviewId, setInterviewInProgress } = useSessionStore.getState();
      
      if (activeInterviewId === data.interviewId) {
        // Update the interview state based on the event
        if (data.status === 'completed') {
          setInterviewInProgress(false);
        }
      }
    });
    
    // PDF generation events
    this.socket.on('pdf:generated', (data) => {
      console.log('PDF generated:', data);
      
      // Handle PDF generation completion
      // This could trigger a notification or update the UI
    });
  }
  
  /**
   * Join a chat session room
   * @param chatSessionId The chat session ID
   */
  static joinChatSession(chatSessionId: string) {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot join chat session: WebSocket not connected');
      return;
    }
    
    this.socket.emit('chat:join', { chatSessionId });
  }
  
  /**
   * Leave a chat session room
   * @param chatSessionId The chat session ID
   */
  static leaveChatSession(chatSessionId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }
    
    this.socket.emit('chat:leave', { chatSessionId });
  }
  
  /**
   * Join an interview room
   * @param interviewId The interview ID
   */
  static joinInterview(interviewId: string) {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot join interview: WebSocket not connected');
      return;
    }
    
    this.socket.emit('interview:join', { interviewId });
  }
  
  /**
   * Leave an interview room
   * @param interviewId The interview ID
   */
  static leaveInterview(interviewId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }
    
    this.socket.emit('interview:leave', { interviewId });
  }
  
  /**
   * Send a chat message
   * @param chatSessionId The chat session ID
   * @param message The message to send
   */
  static sendChatMessage(chatSessionId: string, message: { role: string; content: string }) {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot send message: WebSocket not connected');
      return;
    }
    
    this.socket.emit('chat:message', {
      chatSessionId,
      ...message,
      timestamp: new Date()
    });
  }
  
  /**
   * Disconnect the WebSocket
   */
  static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}