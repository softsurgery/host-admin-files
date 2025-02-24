import { ApiKey } from "@/types/APIKey";
import { create } from "zustand";

interface APIKeyData {
  id?: number;
  name: string;
  key: string;
  workspace_id?: number;
  errors?: Record<string, string>;
}

interface APIKeyStore extends APIKeyData {
  set: (attribute: keyof APIKeyData, value: unknown) => void;
  setAPIKey: (apiKey: ApiKey) => void;
  get: () => APIKeyData;
  reset: () => void;
}

const APIKeyStoreDataDefaults: APIKeyData = {
  id: undefined,
  name: "",
  key: "",
  workspace_id: undefined,
  errors: {},
};

export const useAPIKeyStore = create<APIKeyStore>((set, get) => ({
  ...APIKeyStoreDataDefaults,
  set: (attribute: keyof APIKeyData, value: unknown) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  setAPIKey: (apiKey) => {
    set({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key,
      workspace_id:
        typeof apiKey.workspace_id == "number"
          ? apiKey.workspace_id
          : apiKey.workspace_id?.id,
    });
  },
  get: () => {
    const data = get();
    return {
      id: data.id,
      name: data.name,
      key: data.key,
      workspace_id: data.workspace_id,
    };
  },
  reset: () => {
    set(APIKeyStoreDataDefaults);
  },
}));
