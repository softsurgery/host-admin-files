import React from "react";

export interface ApiKeyActionsContextProps {
  openCreateAPIKeySheet: () => void;
  openDeleteFileDialog: () => void;
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

export const ApiKeyActionsContext = React.createContext<
  Partial<ApiKeyActionsContextProps>
>({
  openCreateAPIKeySheet: () => {},
  openDeleteFileDialog: () => {},
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
export const useApiKeyActions = () => React.useContext(ApiKeyActionsContext);
