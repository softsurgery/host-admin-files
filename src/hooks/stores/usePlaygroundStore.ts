import { create } from "zustand";

interface PlaygroundData {
  apiKeyId?: number;
  apiKey?: string;
  workspaceId?: number;
  fileId?: number;
  fileExtension?: string;
  filename?: string;
  uuid: string;
}

interface PlaygroundStore extends PlaygroundData {
  set: <K extends keyof PlaygroundData>(
    attribute: K,
    value: PlaygroundData[K]
  ) => void;
  reset: () => void;
}

const PlaygroundDataDefaults: PlaygroundData = {
  apiKeyId: undefined,
  apiKey: "",
  workspaceId: undefined,
  fileId: undefined,
  fileExtension: "",
  filename: "",
  uuid: "",
};

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  ...PlaygroundDataDefaults,
  set: (attribute, value) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  reset: () => {
    set(() => ({ ...PlaygroundDataDefaults }));
  },
}));
