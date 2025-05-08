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
  setAlerts: (alerts: Alert[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeAlert: (id: number) => void;
  removeAllAlerts: () => void;
  appendAlerts: (alerts: Alert[]) => void;
}

const useNotificationStore = create(
  persist<NotificationStore>(
    (set, get) => ({
      alerts: [],
      setAlerts: (alerts) => set({ alerts }),
      markAsRead: (id) => {
        const updated = get().alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a));
        set({ alerts: updated });
      },
      markAllAsRead: () => {
        const updated = get().alerts.map((a) => ({ ...a, isRead: true }));
        set({ alerts: updated });
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
    }),
    {
      name: 'notification-store',
    }
  )
);

export default useNotificationStore;
