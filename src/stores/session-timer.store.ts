import { create } from 'zustand';

interface SessionStore {
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  decreaseTimeLeft: () => void;
  resetTime: () => void;
}

const useSessionTimerStore = create<SessionStore>((set) => ({
  timeLeft: 0,
  setTimeLeft: (time) => set({ timeLeft: time }),
  decreaseTimeLeft: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  resetTime: () => set({ timeLeft: 0 }),
}));

export default useSessionTimerStore;
