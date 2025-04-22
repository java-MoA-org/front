import { create } from 'zustand';

interface SignInUserState {
    userId: string;
    userNickname: string;
    profileImage: string | null;

    setUserId: (userId: string) => void;
    setUserNickname: (name: string) => void;
    setProfileImage: (profileImage: string | null) => void;

    resetUser: () => void;
}

const useSignInUserStore = create<SignInUserState>((set) => ({
    userId: '',
    userNickname: '',
    profileImage: null,

    setUserId: (userId) => set({ userId }),
    setUserNickname: (userNickname) => set({ userNickname }),
    setProfileImage: (profileImage) => set({ profileImage }),

    resetUser: () => set({ userId: '', userNickname: '', profileImage: null }),
}));

export default useSignInUserStore;
