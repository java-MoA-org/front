import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Alert {
  id: number;
  type: string;
  content: string;
  creationDate: string;
  link: string;
  read: boolean;
}

interface NotificationStore {
  alerts: Alert[];
  isRead: boolean;
  setAlerts: (alerts: Alert[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeAlert: (id: number) => void;
  removeAllAlerts: () => void;
  appendAlerts: (alerts: Alert[]) => void;
  setIsRead: () => void;
}

const useNotificationStore = create(
  persist<NotificationStore>(
    (set, get) => ({
      alerts: [],
      isRead: true,
      setAlerts: (alerts) => set({ alerts }),
      markAsRead: (id) => {
        const updated = get().alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
        set({ alerts: updated });
        get().setIsRead();
      },
      markAllAsRead: () => {
        const updated = get().alerts.map((a) => ({ ...a, read: true }));
        set({ alerts: updated });
        get().setIsRead();
      },
      removeAlert: (id) => {
        const updated = get().alerts.filter((a) => a.id !== id);
        set({ alerts: updated });
      },
      removeAllAlerts: () => {
        set({ alerts: [] });
      },
      appendAlerts: (newAlerts) => {
        const current = get().alerts;
        set({ alerts: [...current, ...newAlerts] });
      },
      setIsRead: () => {
        const allRead = get().alerts.every((a) => a.read);
        set({ isRead: allRead });
      },
    }),
    {
      name: 'notification-store',
    }
  )
);

export default useNotificationStore;
