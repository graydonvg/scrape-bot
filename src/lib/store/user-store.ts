import { create } from "zustand";

type UserStore = {
  userCreditBalance: number | null;
  setUserCreditBalance: (creditBalance: number) => void;
};

const useUserStore = create<UserStore>()((set) => ({
  userCreditBalance: null,
  setUserCreditBalance: (userCreditBalance) => set({ userCreditBalance }),
}));

export default useUserStore;
