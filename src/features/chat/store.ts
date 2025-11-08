import { create } from 'zustand';

interface ChatState {
  conversationId: string;
  setConversationId: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversationId: 'demo-thread',
  setConversationId: (conversationId) => set({ conversationId })
}));
