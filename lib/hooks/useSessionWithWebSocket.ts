import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import useSessionStore, { SessionState } from '../stores/sessionStore';
import { WebSocketService } from '../services/websocketService';
import { IChatMessage } from '../models/schema-design';

/**
 * Custom hook for using the session store with WebSocket integration
 * This hook handles the connection to the WebSocket server and
 * synchronizes the session state between the client and server
 */
export function useSessionWithWebSocket() {
  const { data: authSession } = useSession();
  const [
    activeChatId,
    chatMessages,
    isLoading,
    error,
    activeInterviewId,
    interviewInProgress,
    currentQuestionIndex,
    setActiveChatId,
    setChatMessages,
    addChatMessage,
    clearChatMessages,
    setIsLoading,
    setError,
    setActiveInterviewId,
    setInterviewInProgress,
    setCurrentQuestionIndex,
    resetInterviewState
  ] = useSessionStore((state: SessionState) => [
    state.activeChatId,
    state.chatMessages,
    state.isLoading,
    state.error,
    state.activeInterviewId,
    state.interviewInProgress,
    state.currentQuestionIndex,
    state.setActiveChatId,
    state.setChatMessages,
    state.addChatMessage,
    state.clearChatMessages,
    state.setIsLoading,
    state.setError,
    state.setActiveInterviewId,
    state.setInterviewInProgress,
    state.setCurrentQuestionIndex,
    state.resetInterviewState
  ]);
  
  const [isConnected, setIsConnected] = useState(false);
  
  // Initialize WebSocket connection when auth session is available
  useEffect(() => {
    if (authSession?.user?.id && authSession?.accessToken) {
      // Initialize WebSocket connection
      WebSocketService.initialize(
        authSession.user.id,
        authSession.accessToken as string
      );
      
      setIsConnected(true);
      
      // Clean up WebSocket connection on unmount
      return () => {
        WebSocketService.disconnect();
        setIsConnected(false);
      };
    }
  }, [authSession]);
  
  // Join chat session room when activeChatId changes
  useEffect(() => {
    if (isConnected && activeChatId) {
      // Join the chat session room
      WebSocketService.joinChatSession(activeChatId);
      
      // Leave the chat session room on cleanup
      return () => {
        WebSocketService.leaveChatSession(activeChatId);
      };
    }
  }, [isConnected, activeChatId]);
  
  // Join interview room when activeInterviewId changes
  useEffect(() => {
    if (isConnected && activeInterviewId) {
      // Join the interview room
      WebSocketService.joinInterview(activeInterviewId);
      
      // Leave the interview room on cleanup
      return () => {
        WebSocketService.leaveInterview(activeInterviewId);
      };
    }
  }, [isConnected, activeInterviewId]);
  
  // Rehydrate chat messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      setIsLoading(true);
      
      // Fetch chat messages from the server
      fetch(`/api/chat-sessions/${activeChatId}/messages`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch chat messages');
          }
          return response.json();
        })
        .then(data => {
          // Format the messages
          const formattedMessages = data.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          }));
          
          // Update the session store
          setChatMessages(formattedMessages);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching chat messages:', err);
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [activeChatId, setChatMessages, setIsLoading, setError]);
  
  // Function to send a chat message
  const sendChatMessage = (content: string) => {
    if (!activeChatId) {
      setError('No active chat session');
      return;
    }
    
    setIsLoading(true);
    
    // Create the message object
    const message: IChatMessage = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    // Add the message to the local state
    addChatMessage(message);
    
    // Send the message via WebSocket
    WebSocketService.sendChatMessage(activeChatId, {
      role: message.role,
      content: message.content
    });
    
    // Also send the message via API for persistence
    fetch(`/api/chat-sessions/${activeChatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message.content,
        role: message.role
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        return response.json();
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error sending message:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };
  
  // Function to start a new chat session
  const startNewChatSession = async (title?: string) => {
    setIsLoading(true);
    
    try {
      // Create a new chat session
      const response = await fetch('/api/chat-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title || 'New Chat' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }
      
      const data = await response.json();
      
      // Set the active chat session
      setActiveChatId(data._id);
      clearChatMessages();
      setIsLoading(false);
      
      return data._id;
    } catch (err: any) {
      console.error('Error creating chat session:', err);
      setError(err.message);
      setIsLoading(false);
      return null;
    }
  };
  
  // Function to start a new interview
  const startNewInterview = async (interviewData: any) => {
    setIsLoading(true);
    
    try {
      // Create a new interview
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(interviewData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create interview');
      }
      
      const data = await response.json();
      
      // Set the active interview
      setActiveInterviewId(data._id);
      setInterviewInProgress(true);
      setCurrentQuestionIndex(0);
      setIsLoading(false);
      
      return data._id;
    } catch (err: any) {
      console.error('Error creating interview:', err);
      setError(err.message);
      setIsLoading(false);
      return null;
    }
  };
  
  return {
    // Session state
    activeChatId,
    chatMessages,
    isLoading,
    error,
    activeInterviewId,
    interviewInProgress,
    currentQuestionIndex,
    isConnected,
    
    // Actions
    setActiveChatId,
    setChatMessages,
    addChatMessage,
    clearChatMessages,
    setIsLoading,
    setError,
    setActiveInterviewId,
    setInterviewInProgress,
    setCurrentQuestionIndex,
    resetInterviewState,
    sendChatMessage,
    startNewChatSession,
    startNewInterview
  };
}