import { cn } from "@/lib/utils";
import { WorkspaceCard } from "./WorkspaceCard";
import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { WorkspaceControl } from "./WorkspaceControl";

interface WorkspacesProps {
  className?: string;
}

export const Workspaces = ({ className }: WorkspacesProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([{ title: "DMS" }, { title: "Workspaces" }]);
  }, []);
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <WorkspaceControl />
      <div className="flex flex-col flex-1 overflow-auto gap-4 pr-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
          <WorkspaceCard />
        </div>
      </div>
    </div>
  );
};
