import { create } from 'zustand';

interface SignInUserState {
    userId: string;
    name: string;
    profileImage: string | null;

    setUserId: (userId: string) => void;
    setName: (name: string) => void;
    setProfileImage: (profileImage: string | null) => void;

    resetUser: () => void;
}

const useSignInUserStore = create<SignInUserState>((set) => ({
    userId: '',
    name: '',
    profileImage: null,

    setUserId: (userId) => set({ userId }),
    setName: (name) => set({ name }),
    setProfileImage: (profileImage) => set({ profileImage }),

    resetUser: () => set({ userId: '', name: '', profileImage: null }),
}));

export default useSignInUserStore;
