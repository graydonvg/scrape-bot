import { create } from "zustand";

type UserStore = {
  avatarPreviewUrl: string | null;
  setAvatarPreviewUrl: (avatarPreviewUrl: string) => void;
  userCreditBalance: number | null;
  setUserCreditBalance: (creditBalance: number) => void;
};

const useUserStore = create<UserStore>()((set) => ({
  avatarPreviewUrl: null,
  setAvatarPreviewUrl: (avatarPreviewUrl) => set({ avatarPreviewUrl }),
  userCreditBalance: null,
  setUserCreditBalance: (userCreditBalance) => set({ userCreditBalance }),
}));

export default useUserStore;
