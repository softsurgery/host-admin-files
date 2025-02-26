import React from "react";
import { DataTable } from "./data-table/data-table";
import { api } from "@/api";
import { getFileColumns } from "./data-table/columns";
import { cn } from "@/lib/utils";
import {
  FileActionsContext,
  FileActionsContextProps,
} from "./data-table/action-context";
import { useFileUploadSheet } from "./modals/FileUploadSheet";
import { useFileUploaderStore } from "@/hooks/stores/useFileUploaderStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { useFileDeleteDialog } from "./modals/FileDeleteDialog";
import { ServerResponse } from "@/types/utils/ServerResponse";

interface FilePanelProps {
  className?: string;
  workspaceId?: string;
}

export default function FilePanel({ className, workspaceId }: FilePanelProps) {
  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(
    size,
    500
  );

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: "id",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const fileUploaderStore = useFileUploaderStore();

  const {
    data: filesResp,
    isPending: isFilesRespPending,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: [
      "files",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails,
      debouncedSearchTerm,
      workspaceId,
    ],
    queryFn: async () =>
      api.file.fetchPaginated({
        page: `page=${debouncedPage},${debouncedSize}`,
        order: `order=${sortDetails.sortKey},${
          sortDetails.order ? "desc" : "asc"
        }`,
        search: `search=${debouncedSearchTerm}`,
        filter: workspaceId ? `filter=workspace_id,eq,${workspaceId}` : "",
      }),
  });

  const files = React.useMemo(() => {
    return filesResp?.records || [];
  }, [filesResp]);

  const totalPageCount = React.useMemo(() => {
    return Math.ceil((filesResp?.results ?? 0) / size);
  }, [filesResp]);

  const { mutate: uploadFilesMutator, isPending: isUploadPending } =
    useMutation({
      mutationFn: async () => {
        await api.upload.uploadMany(fileUploaderStore.files, workspaceId || "");
      },
      onSuccess: () => {
        closeUploadFileSheet();
        fileUploaderStore.reset();
        toast.success("Files uploaded successfully");
        refetchFiles();
      },
      onError: (error) => {
        toast.error(JSON.stringify(error));
      },
    });

  const { mutate: deleteFile, isPending: isDeletionPending } = useMutation({
    mutationFn: async () => {
      return api.upload.deleteFile(fileUploaderStore.uuid);
    },
    onSuccess: (data: ServerResponse) => {
      toast.success(data.message);
      refetchFiles();
    },
    onError: (error) => {
      toast.error(JSON.stringify(error));
    },
  });

  const uploadFiles = async () => {
    if (fileUploaderStore.files.length === 0) {
      toast.error("You have not selected any files to upload", {
        position: "bottom-center",
      });
    } else {
      uploadFilesMutator();
    }
  };

  const { uploadFileSheet, openUploadFileSheet, closeUploadFileSheet } =
    useFileUploadSheet({
      uploadFiles,
      isUploadPending,
      resetFile: () => fileUploaderStore.reset(),
    });

  const { deleteFileDialog, openDeleteFileDialog } = useFileDeleteDialog({
    fileLabel: fileUploaderStore.uuid,
    deleteFile,
    isDeletionPending,
    resetFile: () => fileUploaderStore.reset(),
  });

  const context: Partial<FileActionsContextProps> = {
    openUploadSheet: openUploadFileSheet,
    openDeleteFileDialog,
    page,
    setPage,
    size,
    setSize,
    totalPageCount,
    sortKey: sortDetails.sortKey,
    order: sortDetails.order,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm,
  };

  const isPending =
    isFilesRespPending || paging || resizing || sorting || searching;

  return (
    <FileActionsContext.Provider value={context}>
      <div
        className={cn(
          "flex flex-col flex-1 overflow-auto no-scrollbar",
          className
        )}
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getFileColumns()}
          data={files}
          isPending={isPending}
        />
      </div>
      {deleteFileDialog}
      {uploadFileSheet}
    </FileActionsContext.Provider>
  );
}
