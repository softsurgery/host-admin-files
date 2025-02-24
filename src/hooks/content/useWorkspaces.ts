import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

const useWorkspaces = (enabled: boolean = true) => {
  const { isPending: isWorkspacesPending, data: workspacesResp } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => api.workspace.fetchPaginated(),
    enabled: enabled,
  });

  const workspaces = React.useMemo(() => {
    if (!workspacesResp) return [];
    return workspacesResp.records;
  }, [workspacesResp]);

  return {
    workspaces,
    isWorkspacesPending,
  };
};

export default useWorkspaces;
