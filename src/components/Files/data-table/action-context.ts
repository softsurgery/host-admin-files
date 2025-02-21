import React from "react";

export interface FileActionsContextProps {
  openUploadSheet: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  page: number;
  totalPageCount: number;
  setPage: (value: number) => void;
  size: number;
  setSize: (value: number) => void;
  order: boolean;
  sortKey: string;
  setSortDetails: (_order: boolean, _sortKey: string) => void;
}

export const FileActionsContext = React.createContext<
  Partial<FileActionsContextProps>
>({
  openUploadSheet: () => {},
  searchTerm: "",
  setSearchTerm: (_value: string) => {},
  page: 1,
  totalPageCount: 0,
  setPage: (_value: number) => {},
  size: 10,
  setSize: (_value: number) => {},
  order: false,
  sortKey: "",
  setSortDetails: (_order: boolean, _sortKey: string) => {},
});
export const useFileActions = () => React.useContext(FileActionsContext);
