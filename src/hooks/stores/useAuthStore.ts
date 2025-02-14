import { create } from "zustand";

interface AuthData {
  email: string;
  password: string;
}

interface AuthStore extends AuthData {
  set: (attribute: keyof AuthData, value: unknown) => void;
  reset: () => void;
}

const AuthDataDefaults: AuthData = {
  email: "",
  password: "",
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...AuthDataDefaults,
  set: (attribute: keyof AuthData, value: unknown) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  reset: () => {
    set(AuthDataDefaults);
  },
}));
