import { create } from "zustand";

interface FileUploaderData {
  uuid: string;
  files: File[];
}

interface FileUploaderStore extends FileUploaderData {
  addFile: (file: File) => void;
  removeFile: (file: File) => void;
  setFiles: (files: File[]) => void;
  set: (attribute: keyof FileUploaderData, value: unknown) => void;
  reset: () => void;
}

const FileUploaderStoreDataDefaults: FileUploaderData = {
  uuid: "",
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
  set: (attribute: keyof FileUploaderData, value: unknown) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  reset: () => {
    set(FileUploaderStoreDataDefaults);
  },
}));
