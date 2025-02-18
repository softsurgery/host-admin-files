import React from "react";
import { DataTable } from "./data-table/data-table";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { api } from "@/api";
import { getFileColumns } from "./data-table/columns";
import { BFile } from "@/types/BFile";
import { cn } from "@/lib/utils";
import { FileActionsContext } from "./data-table/action-context";
import { useFileUploadSheet } from "./modals/FileUploadSheet";

interface FilePanelProps {
  className?: string;
}

export default function FilePanel({ className }: FilePanelProps) {
  const [data, setData] = React.useState<BFile[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { href: "/", title: "Home" },
      { href: "/files", title: "Files" },
    ]);
  }, []);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await api.file.fetchAll();
      setData(data.records);
      setLoading(false);
    };
    fetch();
  }, []);

  const { uploadFileSheet, openUploadFileSheet } =
    useFileUploadSheet({
      uploadFile: async () => {
        console.log("hello");
      },
      isUploadPending: false,
      resetFile: () => {},
    });

  const context = {
    openUploadSheet: openUploadFileSheet,
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <FileActionsContext.Provider value={context}>
      <div
        className={cn(
          "flex flex-col flex-1 overflow-auto no-scrollbar",
          className
        )}
      >
        <DataTable columns={getFileColumns()} data={data} />
      </div>
      {uploadFileSheet}
    </FileActionsContext.Provider>
  );
}
