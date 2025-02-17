import { Workspace } from "@/types/Workspace";
import { create } from "zustand";

interface WorkspaceData {
  id?: number;
  name: string;
  description: string;
  errors?: Record<string, string>;
}

interface WorkspaceStore extends WorkspaceData {
  set: (attribute: keyof WorkspaceData, value: unknown) => void;
  setWorkspace: (workspace: Workspace) => void;
  get: () => WorkspaceData;
  reset: () => void;
}

const WorkspaceStoreDataDefaults: WorkspaceData = {
  id: undefined,
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
  setWorkspace: (workspace) => {
    set({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
    });
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
