import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthPersistData {
  token: string;
  isAuthenticated: boolean | null;
  setToken: (token: string) => void;
  setAuthenticated: (isAuth: boolean) => void;
  logout: () => void;
}

export const useAuthPersistStore = create(
  persist<AuthPersistData>(
    (set) => ({
      token: "",
      isAuthenticated: null,
      setToken: (token) => set({ token }),
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      logout: () => set({ isAuthenticated: false, token: "" }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
