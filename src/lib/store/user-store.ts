import { create } from "zustand";

type UserStore = {
  userCreditBalance: number;
  setUserCreditBalance: (creditBalance: number) => void;
};

const useUserStore = create<UserStore>()((set) => ({
  userCreditBalance: 0,
  setUserCreditBalance: (userCreditBalance) => set({ userCreditBalance }),
}));

export default useUserStore;
