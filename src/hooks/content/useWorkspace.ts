import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";

const useWorkspace = (id?: number, enabled: boolean = true) => {
  const {
    isPending: isWorkspacePending,
    data: workspaceResp,
    refetch: refetchWorkspace,
  } = useQuery({
    queryKey: [`workspace-${id}`],
    queryFn: () => api.workspace.fetchOne(id),
    enabled: !!id && enabled,
  });

  const workspace = React.useMemo(() => {
    if (!workspaceResp) return null;
    return workspaceResp;
  }, [workspaceResp]);

  const { value: loading } = useDebounce<boolean>(isWorkspacePending, 500);

  return {
    workspace,
    isWorkspacePending: loading,
    refetchWorkspace,
  };
};

export default useWorkspace;
