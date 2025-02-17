import { cn } from "@/lib/utils";
import { WorkspaceEntry } from "./WorkspaceCard";
import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import ContentSection from "../common/ContentSection";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "@/components/ui/button";
import { useWorkspaceCreateSheet } from "./Workspaces/modals/WorkspaceCreateSheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Workspace } from "@/types/Workspace";
import { useWorkspaceStore } from "@/hooks/stores/useWorkspaceStore";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ServerResponse } from "@/types/utils/ServerResponse";
import { workspaceSchema } from "@/types/validations/Workspace";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkspacesProps {
  className?: string;
}

export const Workspaces = ({ className }: WorkspacesProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([{ title: "DMS" }, { title: "Workspaces" }]);
  }, []);

  const {
    data: workspaceResp,
    isPending: isWorkspaceRespPending,
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => api.workspace.fetchAll(),
  });

  const workspaceStore = useWorkspaceStore();

  const workspaces = React.useMemo(() => {
    return workspaceResp?.records || [];
  }, [workspaceResp]);

  const { mutate: createWorkspace } = useMutation({
    mutationFn: async () => {
      return api.workspace.create(workspaceStore.get());
    },
    onSuccess: () => {
      workspaceStore.reset();
      refetchWorkspaces();
      toast.success("Workspace created successfully");
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

  const {
    createWorkspaceSheet,
    openCreateWorkspaceSheet,
    closeCreateWorkspaceSheet,
  } = useWorkspaceCreateSheet({
    createWorkspace: handleCreateWorkspace,
    isCreatePending: false,
    resetWorkspace: () => {},
  });

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <ContentSection
        title="Workspace Control"
        desc="Control your workspaces"
        className="flex-row"
      >
        <div className="flex flex-row gap-2 ">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openCreateWorkspaceSheet}>Add New Workspace</Button>
        </div>
      </ContentSection>

      <div className="flex flex-col flex-1 overflow-auto gap-4 mt-5">
        {isWorkspaceRespPending ? (
          <React.Fragment>
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-24" />
          </React.Fragment>
        ) : (
          workspaces.map((workspace: Workspace) => (
            <WorkspaceEntry key={workspace.id} workspace={workspace} />
          ))
        )}
      </div>

      {createWorkspaceSheet}
    </div>
  );
};
