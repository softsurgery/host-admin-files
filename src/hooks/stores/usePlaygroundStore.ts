import { create } from "zustand";

interface PlaygroundData {
  actionId?: number;
  apiKeyId?: number;
  apiKey?: string;
  workspaceId?: number;
  fileId?: number;
  fileExtension?: string;
  filename?: string;
  uuid?: string;
}

interface PlaygroundStore extends PlaygroundData {
  set: <K extends keyof PlaygroundData>(
    attribute: K,
    value: PlaygroundData[K]
  ) => void;
  reset: () => void;
  resetByLevel: (level: number) => void;
}

const PlaygroundDataDefaults: PlaygroundData = {
  actionId: undefined,
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
  resetByLevel: (level: number) => {
    const resetFields: Partial<PlaygroundData> = {};
    if (level < 1) resetFields.actionId = undefined;
    if (level < 2) resetFields.workspaceId = undefined;
    if (level < 3) resetFields.apiKeyId = resetFields.apiKey = undefined;
    if (level < 4)
      resetFields.fileId =
        resetFields.fileExtension =
        resetFields.uuid =
        resetFields.filename =
          undefined;
    set((state) => ({ ...state, ...resetFields }));
  },
}));
