import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IChatMessage } from '../models/schema-design';

// Define the session store state
export interface SessionState {
  // Active chat session
  activeChatId: string | null;
  chatMessages: IChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Active interview session
  activeInterviewId: string | null;
  interviewInProgress: boolean;
  currentQuestionIndex: number;
  
  // Actions
  setActiveChatId: (id: string | null) => void;
  setChatMessages: (messages: IChatMessage[]) => void;
  addChatMessage: (message: IChatMessage) => void;
  clearChatMessages: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  setActiveInterviewId: (id: string | null) => void;
  setInterviewInProgress: (inProgress: boolean) => void;
  setCurrentQuestionIndex: (index: number) => void;
  resetInterviewState: () => void;
}

// Create the session store with persistence
const useSessionStore = create(
  persist<SessionState>(
    (set) => ({
      // Initial state
      activeChatId: null,
      chatMessages: [],
      isLoading: false,
      error: null,
      
      activeInterviewId: null,
      interviewInProgress: false,
      currentQuestionIndex: 0,
      
      // Chat session actions
      setActiveChatId: (id: string | null) => set({ activeChatId: id }),
      setChatMessages: (messages: IChatMessage[]) => set({ chatMessages: messages }),
      addChatMessage: (message: IChatMessage) => set((state: SessionState) => ({
        chatMessages: [...state.chatMessages, message]
      })),
      clearChatMessages: () => set({ chatMessages: [] }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      
      // Interview session actions
      setActiveInterviewId: (id: string | null) => set({ activeInterviewId: id }),
      setInterviewInProgress: (inProgress: boolean) => set({ interviewInProgress: inProgress }),
      setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index }),
      resetInterviewState: () => set({
        activeInterviewId: null,
        interviewInProgress: false,
        currentQuestionIndex: 0
      })
    }),
    {
      name: 'aithor-session-storage', // Name for localStorage/sessionStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      partialize: (state) => {
        // Only persist these fields
        const persistedState = {
          activeChatId: state.activeChatId,
          chatMessages: state.chatMessages,
          activeInterviewId: state.activeInterviewId,
          interviewInProgress: state.interviewInProgress,
          currentQuestionIndex: state.currentQuestionIndex,
          isLoading: state.isLoading,
          error: state.error
        };
        return persistedState as any;
      }
    }
  )
);

export default useSessionStore;