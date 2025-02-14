import { create } from "zustand";

interface AuthData {
  email: string;
  password: string;
  errors?: Record<string, string>;
}

interface AuthStore extends AuthData {
  set: (attribute: keyof AuthData, value: unknown) => void;
  get: () => AuthData;
  reset: () => void;
}

const AuthDataDefaults: AuthData = {
  email: "",
  password: "",
  errors: {},
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...AuthDataDefaults,
  set: (attribute: keyof AuthData, value: unknown) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  get: () => {
    const data = get();
    return {
      email: data.email,
      password: data.password,
    };
  },
  reset: () => {
    set(AuthDataDefaults);
  },
}));
