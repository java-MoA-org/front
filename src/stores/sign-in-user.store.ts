import { create } from "zustand";
import { UserInterest } from "../types/interfaces";

interface SignInUserState {
  userId: string;
  userNickname: string;
  userProfileImage: string | null;
  userIntroduce: string | "";
  userPhoneNumber: string;
  userEmail: string;
  userRole: string;
  userInterests: UserInterest;

  setUserId: (userId: string) => void;
  setUserNickname: (name: string) => void;
  setUserProfileImage: (userProfileImage: string | null) => void;
  setUserPhoneNumber: (userPhoneNumber: string) => void;
  setUserIntroduce: (userIntroduce: string) => void;
  setUserEmail: (userEmail: string) => void;
  setUserRole: (userRole: string) => void;
  setUserInterests: (userInterests: UserInterest) => void;

  resetUser: () => void;
}

const defaultInterests = {
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
  userId: "",
  userNickname: "",
  userProfileImage: null,
  userIntroduce: "",
  userPhoneNumber: "",
  userEmail: "",
  userRole: "",
  userInterests: defaultInterests,

  setUserId: (userId) => set({ userId }),
  setUserNickname: (userNickname) => set({ userNickname }),
  setUserProfileImage: (userProfileImage) => set({ userProfileImage }),
  setUserIntroduce: (userIntroduce) => set({ userIntroduce }),
  setUserPhoneNumber: (userPhoneNumber) => set({ userPhoneNumber }),
  setUserEmail: (userEmail) => set({ userEmail }),
  setUserRole: (userRole) => set({ userRole }),
  setUserInterests: (userInterests) => set({ userInterests }),

  resetUser: () =>
    set({
      userId: "",
      userNickname: "",
      userProfileImage: null,
      userIntroduce: "",
      userPhoneNumber: "",
      userEmail: "",
      userRole: "",
      userInterests: defaultInterests,
    }),
}));

export default useSignInUserStore;
