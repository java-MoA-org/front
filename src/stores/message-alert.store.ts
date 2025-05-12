import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MessageAlertStore {
  unreadCount: number;
  isMessageRead: boolean;
  setUnreadCount: (unreadCount: number) => void;
  setIsMessageRead: (isRead: boolean) => void;
}

const useMessageAlertStore = create(
  persist<MessageAlertStore>(
    (set, get) => ({
      unreadCount: 0,
      isMessageRead: true,

      setUnreadCount: (unreadCount) => set({ unreadCount }),

      setIsMessageRead: (isMessageRead) => set({ isMessageRead }),
    }),
    {
      name: 'message-alert-store',
    }
  )
);

export default useMessageAlertStore;
