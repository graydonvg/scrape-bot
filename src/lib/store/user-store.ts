import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserDb } from "../types/user";

type UserStore = {
  user: UserDb;
  setUser: (user: UserDb) => void;
  clearUser: () => void;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (isUserMenuOpen: boolean) => void;
};

const initialData: UserDb = {
  firstName: "",
  lastName: "",
  email: "",
  avatarUrl: "",
  credits: 0,
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: initialData,
      setUser: (user) => set({ user }),
      clearUser: () =>
        set({
          user: initialData,
        }),
      isUserMenuOpen: false,
      setIsUserMenuOpen: (isUserMenuOpen) => set({ isUserMenuOpen }),
    }),
    {
      name: "user-storage",
    },
  ),
);

export default useUserStore;
