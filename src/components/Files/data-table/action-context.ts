import React from "react";

interface FileActionsContextProps {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  page?: number;
  totalPageCount?: 0;
  setPage?: (value: number) => void;
  size?: number;
  setSize?: (value: number) => void;
  order?: boolean;
  sortKey?: string;
  setSortDetails?: (_order: boolean, _sortKey: string) => void;
}

export const FileActionsContext = React.createContext<FileActionsContextProps>(
  {}
);
export const useFileActions = () => React.useContext(FileActionsContext);
