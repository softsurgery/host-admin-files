import { cn } from "@/lib/utils";
import { WorkspaceCard } from "./WorkspaceCard";
import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import ContentSection from "../common/ContentSection";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useWorkspaceCreateSheet } from "./Workspaces/modals/WorkspaceCreateSheet";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Workspace } from "@/types/Workspace";

interface WorkspacesProps {
  className?: string;
}

export const Workspaces = ({ className }: WorkspacesProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([{ title: "DMS" }, { title: "Workspaces" }]);
  }, []);

  const { data: workspaceResp, isPending: isWorkspaceRespPending } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => api.workspace.fetchAll(),
  });

  const workspaces = React.useMemo(() => {
    return workspaceResp?.records || [];
  }, [workspaceResp]);

  const { createWorkspaceSheet, openCreateWorkspaceSheet } =
    useWorkspaceCreateSheet({
      createWorkspace: () => {},
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
      <div className="flex flex-col flex-1 overflow-auto gap-4 pr-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {workspaces.map((workspace: Workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </div>
      {createWorkspaceSheet}
    </div>
  );
};
