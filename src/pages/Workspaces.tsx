import { cn } from "@/lib/utils";
import { WorkspaceEntry } from "../components/DMS/Workspaces/WorkspaceEntry";
import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import ContentSection from "../components/common/ContentSection";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceCreateSheet } from "../components/DMS/Workspaces/modals/WorkspaceCreateSheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Workspace } from "@/types/Workspace";
import { useWorkspaceStore } from "@/hooks/stores/useWorkspaceStore";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ServerResponse } from "@/types/utils/ServerResponse";
import { workspaceSchema } from "@/types/validations/Workspace";
import { useWorkspaceDeleteDialog } from "../components/DMS/Workspaces/modals/WorkspaceDeleteDialog";
import { useWorkspaceUpdateSheet } from "../components/DMS/Workspaces/modals/WorkspaceUpdateSheet";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";

interface WorkspacesProps {
  className?: string;
}

export const Workspaces = ({ className }: WorkspacesProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "DMS", href: "/dms/workspaces" },
      { title: "Workspaces", href: "/dms/workspaces" },
    ]);
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const {
    data: workspaceResp,
    isPending: isWorkspaceRespPending,
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ["workspaces", debouncedSearchTerm],
    queryFn: () =>
      api.workspace.fetchPaginated({ search: `search=${debouncedSearchTerm}` }),
  });

  const workspaceStore = useWorkspaceStore();

  const workspaces = React.useMemo(() => {
    return workspaceResp?.records || [];
  }, [workspaceResp]);

  const { mutate: createWorkspace, isPending: isCreatePending } = useMutation({
    mutationFn: async () => {
      return api.workspace.create(workspaceStore.get());
    },
    onSuccess: () => {
      refetchWorkspaces();
      toast.success("Workspace created successfully");
    },
    onError: (error: AxiosError<ServerResponse>) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: updateWorkspace, isPending: isUpdatePending } = useMutation({
    mutationFn: async () => {
      return api.workspace.update(workspaceStore.id, workspaceStore.get());
    },
    onSuccess: () => {
      workspaceStore.reset();
      refetchWorkspaces();
      toast.success("Workspace updated successfully");
    },
    onError: (error: AxiosError<ServerResponse>) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: deleteWorkspace } = useMutation({
    mutationFn: async () => {
      return api.workspace.remove(workspaceStore.id);
    },
    onSuccess: () => {
      workspaceStore.reset();
      refetchWorkspaces();
      closeDeleteWorkspaceDialog();
      toast.success("Workspace deleted successfully");
    },
    onError: (error: AxiosError<ServerResponse>) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const handleCreateWorkspace = () => {
    const data = workspaceStore.get();
    const result = workspaceSchema.safeParse(data);
    if (!result.success) {
      workspaceStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      createWorkspace();
      closeCreateWorkspaceSheet();
    }
  };

  const handleUpdateWorkspace = () => {
    const data = workspaceStore.get();
    const result = workspaceSchema.safeParse(data);
    if (!result.success) {
      workspaceStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      updateWorkspace();
      closeUpdateWorkspaceSheet();
    }
  };

  const {
    createWorkspaceSheet,
    openCreateWorkspaceSheet,
    closeCreateWorkspaceSheet,
  } = useWorkspaceCreateSheet({
    createWorkspace: handleCreateWorkspace,
    isCreatePending,
    resetWorkspace: () => workspaceStore.reset(),
  });

  const {
    updateWorkspaceSheet,
    openUpdateWorkspaceSheet,
    closeUpdateWorkspaceSheet,
  } = useWorkspaceUpdateSheet({
    updateWorkspace: handleUpdateWorkspace,
    isUpdatePending,
    resetWorkspace: () => workspaceStore.reset(),
  });

  const {
    deleteWorkspaceDialog,
    openDeleteWorkspaceDialog,
    closeDeleteWorkspaceDialog,
  } = useWorkspaceDeleteDialog({
    workspaceLabel: workspaceStore.name,
    deleteWorkspace: deleteWorkspace,
    isDeletionPending: false,
  });

  const isPending = isWorkspaceRespPending || searching;

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <ContentSection
        title="Workspace Management"
        desc="Manage and organize your workspaces efficiently. Create, update, and delete workspaces while seamlessly navigating through your workspace list."
        className="flex-row"
      >
        <div className="flex flex-row gap-2 ">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e)}
              className="w-full rounded-lg  pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <Button onClick={openCreateWorkspaceSheet}>Add New Workspace</Button>
        </div>
      </ContentSection>

      <div className="flex flex-col flex-1 overflow-auto gap-4 mt-5 mx-2">
        <div className="flex flex-col gap-4 items-center justify-center">
          {isPending ? (
            <div className="flex flex-row gap-4 items-center justify-center">
              <Label>Searching</Label>
            </div>
          ) : workspaces.length == 0 ? (
            <Label>No Results Found</Label>
          ) : (
            workspaces.map((workspace: Workspace) => (
              <WorkspaceEntry
                key={workspace.id}
                workspace={workspace}
                openUpdateDialog={() => {
                  workspaceStore.setWorkspace(workspace);
                  openUpdateWorkspaceSheet();
                }}
                openDeleteDialog={() => {
                  workspaceStore.set("id", workspace.id);
                  workspaceStore.set("name", workspace.name);
                  openDeleteWorkspaceDialog();
                }}
              />
            ))
          )}
        </div>
      </div>
      {createWorkspaceSheet}
      {updateWorkspaceSheet}
      {deleteWorkspaceDialog}
    </div>
  );
};
