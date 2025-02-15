import { create } from "zustand";

interface WorkspaceData {
  name: string;
  description: string;
  errors?: Record<string, string>;
}

interface WorkspaceStore extends WorkspaceData {
  set: (attribute: keyof WorkspaceData, value: unknown) => void;
  get: () => WorkspaceData;
  reset: () => void;
}

const WorkspaceStoreDataDefaults: WorkspaceData = {
  name: "",
  description: "",
  errors: {},
};

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  ...WorkspaceStoreDataDefaults,
  set: (attribute: keyof WorkspaceData, value: unknown) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  get: () => {
    const data = get();
    return {
      name: data.name,
      description: data.description,
    };
  },
  reset: () => {
    set(WorkspaceStoreDataDefaults);
  },
}));
