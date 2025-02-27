import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/types/utils/QueryParams";
import { useDebounce } from "../useDebounce";

const useFiles = (query?: QueryParams, enabled: boolean = true) => {
  const {
    isPending: isFilesPending,
    data: filesResp,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ["files", query],
    queryFn: () => api.file.fetchPaginated(query),
    enabled: enabled,
  });

  const files = React.useMemo(() => {
    if (!filesResp) return [];
    return filesResp.records;
  }, [filesResp]);

  const { value: loading } = useDebounce<boolean>(isFilesPending, 500);

  return {
    files,
    isFilesPending: loading,
    refetchFiles
  };
};

export default useFiles;
