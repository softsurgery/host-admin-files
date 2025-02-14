import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthPersistData {
  isAuthenticated: boolean;
  setAuthenticated: (isAuth: boolean) => void;
  logout: () => void;
}

export const useAuthPersistStore = create(
  persist<AuthPersistData>(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
