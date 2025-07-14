// Chat Session API
// This file provides functions to interact with the chat session API

// Define the types for chat sessions and messages
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// API functions for chat sessions
export const chatSessionApi = {
  // Get all chat sessions
  getChatSessions: async (): Promise<ChatSession[]> => {
    try {
      const response = await fetch('/api/chat-sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      return [];
    }
  },

  // Get a specific chat session by ID
  getChatSession: async (sessionId: string): Promise<ChatSession | null> => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat session');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching chat session ${sessionId}:`, error);
      return null;
    }
  },

  // Create a new chat session
  createChatSession: async (data: { title: string; initialMessage?: string }): Promise<ChatSession> => {
    try {
      const response = await fetch('/api/chat-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating chat session:', error);
      // Return a minimal local session object
      return {
        id: `local-${Date.now()}`,
        title: data.title,
        messages: data.initialMessage ? [
          {
            role: 'user',
            content: data.initialMessage,
            timestamp: new Date(),
          }
        ] : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  // Update a chat session
  updateChatSession: async (sessionId: string, data: Partial<ChatSession>): Promise<ChatSession | null> => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update chat session');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating chat session ${sessionId}:`, error);
      return null;
    }
  },

  // Delete a chat session
  deleteChatSession: async (sessionId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete chat session');
      }
      return true;
    } catch (error) {
      console.error(`Error deleting chat session ${sessionId}:`, error);
      return false;
    }
  },

  // Add a message to a chat session
  addMessageToChatSession: async (sessionId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage | null> => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      if (!response.ok) {
        throw new Error('Failed to add message to chat session');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error adding message to chat session ${sessionId}:`, error);
      return null;
    }
  },

  // Update message feedback
  updateMessageFeedback: async (sessionId: string, messageIndex: number, feedback: 'positive' | 'negative'): Promise<boolean> => {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/messages/${messageIndex}/feedback`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });
      if (!response.ok) {
        throw new Error('Failed to update message feedback');
      }
      return true;
    } catch (error) {
      console.error(`Error updating message feedback in session ${sessionId}:`, error);
      return false;
    }
  },
};