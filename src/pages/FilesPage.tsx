import { cn } from "@/lib/utils";
import React from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import ContentSection from "@/components/common/ContentSection";
import FilePanel from "@/components/DMS/Files/Files";

interface FilesPageProps {
  className?: string;
}

export const FilesPage = ({ className }: FilesPageProps) => {
  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: "DMS", href: "/dms/workspaces" },
      { title: "Files", href: "/dms/files" },
    ]);
  }, []);

  return (
    <div className={cn("flex flex-col flex-1 overflow-hidden", className)}>
      <ContentSection
        title="File Management"
        desc="Upload, organize, and manage your files with ease. Search, update, and delete files while keeping track of their details for seamless access and control."
        className="flex-row"
      ></ContentSection>

      <div className="flex flex-col flex-1 overflow-auto gap-4 mt-5 mx-2">
        <FilePanel />
      </div>
    </div>
  );
};
