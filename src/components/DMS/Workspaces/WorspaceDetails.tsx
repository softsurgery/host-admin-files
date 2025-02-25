import React from "react";
import ContentSection from "@/components/common/ContentSection";
import { Spinner } from "@/components/common/Spinner";
import Files from "@/components/DMS/Files/Files";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import useWorkspace from "@/hooks/content/useWorkspace";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import APIKeyPanel from "../ApiKeys/APIKeys";
import { File, KeyRound } from "lucide-react";

interface WorspaceDetailsProps {
  className?: string;
}

export const WorspaceDetails = ({ className }: WorspaceDetailsProps) => {
  const { id } = useParams();
  const { workspace, isWorkspacePending } = useWorkspace(Number(id));

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (workspace) {
      setRoutes?.([
        { title: "DMS", href: "/dms/workspaces" },
        { title: "Workspaces", href: "/dms/workspaces" },
        {
          title: `${workspace?.name}'s Workspace`,
          href: `/dms/workspaces/${id}`,
        },
      ]);
    }
  }, [id, workspace]);

  const elements = [
    {
      id: "files",
      label: "Files",
      icon: <File />,
      component: <Files className="mt-4 p-2" workspaceId={id} />,
    },
    {
      id: "apiKeys",
      label: "API Keys",
      icon: <KeyRound />,
      component: <APIKeyPanel className="mt-4 p-2" workspaceId={id} />,
    },
  ];

  if (isWorkspacePending) return <Spinner className="w-full h-full" />;
  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <ContentSection
        title={`${workspace?.name}'s Workspace`}
        desc={workspace?.description || ""}
        className="flex-row"
      />
      <Tabs defaultValue={elements[0].id} className="flex flex-col overflow-hidden mt-5">
        <TabsList className="w-fit">
          {elements.map(({ id, label, icon }) => (
            <TabsTrigger key={id} value={id} className="flex items-center gap-2">
              {icon}
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {elements.map(({ id, component }) => (
          <TabsContent key={id} value={id} className="flex flex-col overflow-hidden">
            {component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
