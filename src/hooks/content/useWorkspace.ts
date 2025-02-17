import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useWorkspace = (id?: number, enabled: boolean = true) => {
  const { isPending: isWorkspacePending, data: workspaceResp } = useQuery({
    queryKey: [`workspace-${id}`],
    queryFn: () => api.workspace.fetchOne(id),
    enabled: !!id && enabled
  });

  const workspace = React.useMemo(() => {
    if (!workspaceResp) return null;
    return workspaceResp;
  }, [workspaceResp]);

  return {
    workspace,
    isWorkspacePending
  };
};

export default useWorkspace;