import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/user";

type UserStore = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
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
    }),
    {
      name: "user-storage",
    },
  ),
);

export default useUserStore;
