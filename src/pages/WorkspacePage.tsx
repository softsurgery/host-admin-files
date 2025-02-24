import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { Workspaces } from "@/components/DMS/Workspaces/Workspaces";

interface WorkspacePageProps {
  className?: string;
}

export const WorkspacePage = ({ className }: WorkspacePageProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "DMS", href: "/dms/workspaces" },
      { title: "Workspaces", href: "/dms/workspaces" },
    ]);
  }, []);

  return <Workspaces className={className} />;
};
