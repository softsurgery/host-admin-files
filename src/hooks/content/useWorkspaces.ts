import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/types/utils/QueryParams";
import { useDebounce } from "../useDebounce";

const useWorkspaces = (query?: QueryParams, enabled: boolean = true) => {
  const {
    isPending: isWorkspacesPending,
    data: workspacesResp,
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ["workspaces", query],
    queryFn: () => api.workspace.fetchPaginated(query),
    enabled: enabled,
  });

  const workspaces = React.useMemo(() => {
    if (!workspacesResp) return [];
    return workspacesResp.records;
  }, [workspacesResp]);

  const { value: loading } = useDebounce<boolean>(isWorkspacesPending, 500);

  return {
    workspaces,
    isWorkspacesPending: loading,
    refetchWorkspaces,
  };
};

export default useWorkspaces;
