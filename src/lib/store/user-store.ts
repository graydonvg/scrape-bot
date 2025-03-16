import { create } from "zustand";

type UserStore = {
  userCreditBalance: number;
  setUserCreditBalance: (creditBalance: number) => void;
};

const useUserStore = create<UserStore>()((set) => ({
  userCreditBalance: 0,
  setUserCreditBalance: (creditBalance) =>
    set({ userCreditBalance: creditBalance }),
}));

export default useUserStore;
