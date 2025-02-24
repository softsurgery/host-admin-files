import { cn } from "@/lib/utils";
import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import ContentSection from "@/components/common/ContentSection";
import APIKeyPanel from "@/components/DMS/ApiKeys/APIKeys";

interface ApiKeysPageProps {
  className?: string;
}

export const ApiKeysPage = ({ className }: ApiKeysPageProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "DMS", href: "/dms/workspaces" },
      { title: "API Keys", href: "/dms/api-keys" },
    ]);
  }, []);

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <ContentSection
        title=" API Key Management"
        desc="Generate, manage, and secure your API keys. Control access, track usage, and revoke keys as needed to maintain security and compliance."
        className="flex-row"
      ></ContentSection>

      <div className="flex flex-col flex-1 overflow-auto gap-4 mt-5 mx-2">
        <APIKeyPanel />
      </div>
    </div>
  );
};
