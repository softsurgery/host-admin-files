import React from "react";
import { DataTable } from "./data-table/data-table";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { api } from "@/api";
import { getFileColumns } from "./data-table/columns";
import { cn } from "@/lib/utils";
import { FileActionsContext } from "./data-table/action-context";
import { useFileUploadSheet } from "./modals/FileUploadSheet";
import { useFileUploaderStore } from "@/hooks/stores/useFileUploaderStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface FilePanelProps {
  className?: string;
}

export default function FilePanel({ className }: FilePanelProps) {
  const fileUploaderStore = useFileUploaderStore();

  const { data: filesResp, isPending: isFilesRespPending } = useQuery({
    queryKey: ["files"],
    queryFn: async () => api.file.fetchAll(),
  });

  const files = React.useMemo(() => {
    return filesResp?.records || [];
  }, [filesResp]);

  const { mutate: uploadFiles, isPending: isUploadPending } = useMutation({
    mutationFn: async () => api.upload.uploadMany(fileUploaderStore.files),
    onSuccess: () => {
      closeUploadFileSheet();
      fileUploaderStore.reset();
      toast.success("Files uploaded successfully");
    },
    onError: () => {
      console.log("error");
    },
  });

  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { href: "/", title: "Home" },
      { href: "/files", title: "Files" },
    ]);
  }, []);

  const { uploadFileSheet, openUploadFileSheet, closeUploadFileSheet } =
    useFileUploadSheet({
      uploadFiles,
      isUploadPending: false,
      resetFile: () => {},
    });

  const context = {
    openUploadSheet: openUploadFileSheet,
  };

  return (
    <FileActionsContext.Provider value={context}>
      <div
        className={cn(
          "flex flex-col flex-1 overflow-auto no-scrollbar",
          className
        )}
      >
        <DataTable columns={getFileColumns()} data={files} />
      </div>
      {uploadFileSheet}
    </FileActionsContext.Provider>
  );
}
