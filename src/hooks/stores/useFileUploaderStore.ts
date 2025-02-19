import { create } from "zustand";

interface FileUploaderData {
  files: File[];
}

interface FileUploaderStore extends FileUploaderData {
  addFile: (file: File) => void;
  removeFile: (file: File) => void;
  setFiles: (files: File[]) => void;
  reset: () => void;
}

const FileUploaderStoreDataDefaults: FileUploaderData = {
  files: [],
};

export const useFileUploaderStore = create<FileUploaderStore>((set) => ({
  ...FileUploaderStoreDataDefaults,
  addFile: (file: File) => {
    set((state) => ({
      ...state,
      files: [...state.files, file],
    }));
  },
  removeFile: (file: File) => {
    set((state) => ({
      ...state,
      files: state.files.filter((f) => f !== file),
    }));
  },
  setFiles: (files: File[]) => {
    set({
      files,
    });
  },
  reset: () => {
    set(FileUploaderStoreDataDefaults);
  },
}));
