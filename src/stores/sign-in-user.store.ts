import { create } from 'zustand';
import { UserInterest } from '../types/interfaces';

interface SignInUserState {
  userId: string;
  userNickname: string;
  userProfileImage: string | null;
  userIntroduce: string;
  userPhoneNumber: string;
  userEmail: string;
  userRole: string;
  userInterests: UserInterest;

  setUserId: (userId: string) => void;
  setUserNickname: (userNickname: string) => void;
  setUserProfileImage: (userProfileImage: string | null) => void;
  setUserIntroduce: (userIntroduce: string) => void;
  setUserPhoneNumber: (userPhoneNumber: string) => void;
  setUserEmail: (userEmail: string) => void;
  setUserRole: (userRole: string) => void;
  setUserInterests: (userInterests: UserInterest) => void;

  setUserAll: (user: {
    userId: string;
    userNickname: string;
    userProfileImage: string | null;
    userIntroduce: string;
    userPhoneNumber: string;
    userEmail: string;
    userRole: string;
    userInterests: UserInterest;
  }) => void;

  resetUser: () => void;
}

const defaultInterests: UserInterest = {
  userInterestTrip: false,
  userInterestGame: false,
  userInterestFashion: false,
  userInterestWorkout: false,
  userInterestFood: false,
  userInterestMusic: false,
  userInterestEconomics: false,
  userInterestNull: false,
};

const useSignInUserStore = create<SignInUserState>((set) => ({
  userId: '',
  userNickname: '',
  userProfileImage: null,
  userIntroduce: '',
  userPhoneNumber: '',
  userEmail: '',
  userRole: '',
  userInterests: defaultInterests,

  setUserId: (userId) => set({ userId }),
  setUserNickname: (userNickname) => set({ userNickname }),
  setUserProfileImage: (userProfileImage) => set({ userProfileImage }),
  setUserIntroduce: (userIntroduce) => set({ userIntroduce }),
  setUserPhoneNumber: (userPhoneNumber) => set({ userPhoneNumber }),
  setUserEmail: (userEmail) => set({ userEmail }),
  setUserRole: (userRole) => set({ userRole }),
  setUserInterests: (userInterests) => set({ userInterests }),

  setUserAll: (user) =>
    set({
      userId: user.userId,
      userNickname: user.userNickname,
      userProfileImage: user.userProfileImage,
      userIntroduce: user.userIntroduce,
      userPhoneNumber: user.userPhoneNumber,
      userEmail: user.userEmail,
      userRole: user.userRole,
      userInterests: user.userInterests || defaultInterests,
    }),

  resetUser: () =>
    set({
      userId: '',
      userNickname: '',
      userProfileImage: null,
      userIntroduce: '',
      userPhoneNumber: '',
      userEmail: '',
      userRole: '',
      userInterests: defaultInterests,
    }),
}));

export default useSignInUserStore;
