import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { Playground } from "@/components/DMS/Playground/Playground";
import ContentSection from "@/components/common/ContentSection";
import { cn } from "@/lib/utils";

interface PlaygroundPageProps {
  className?: string;
}

export const PlaygroundPage = ({ className }: PlaygroundPageProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "DMS", href: "/dms/workspaces" },
      { title: "Playgrounds", href: "/dms/playground" },
    ]);
  }, []);

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <ContentSection
        title="Playground"
        desc="The Playground is an interactive interface that allows users to execute various file gateway actions within a selected workspace."
        className="flex-row"
      ></ContentSection>

      <div className="flex flex-col flex-1 overflow-auto gap-4 mt-5 mx-2">
        <Playground className={className} />
      </div>
    </div>
  );
};
