import React from "react";
import { DataTable } from "./data-table/data-table";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
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
import { CreateUploadFileDto } from "@/types/UploadFile";
import { useDebounce } from "@/hooks/useDebounce";

interface FilePanelProps {
  className?: string;
  workspaceId: number;
}

export default function FilePanel({ className, workspaceId }: FilePanelProps) {
  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { href: "/", title: "Home" },
      { href: "/files", title: "Files" },
    ]);
  }, []);

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
    ],
    queryFn: async () =>
      api.file.fetchPaginated({
        page: `page=${debouncedPage},${debouncedSize}`,
        order: `order=${sortDetails.sortKey},${
          sortDetails.order ? "desc" : "asc"
        }`,
        search: `search=${debouncedSearchTerm}`,
      }),
  });

  const files = React.useMemo(() => {
    return filesResp?.records || [];
  }, [filesResp]);

  const { mutate: createManyFiles } = useMutation({
    mutationFn: async (files: CreateUploadFileDto[]) =>
      api.file.create(files[0]),
    onSuccess: () => {
      closeUploadFileSheet();
      fileUploaderStore.reset();
      toast.success("Files uploaded successfully");
    },
    onError: (error) => {
      toast.error(JSON.stringify(error));
    },
  });

  const { mutate: uploadFilesMutator, isPending: isUploadPending } =
    useMutation({
      mutationFn: async () => {
        createManyFiles(
          fileUploaderStore.files.map((file) => {
            return {
              filename: file.name,
              uuid: "",
              size: file.size,
              mime_type: file.type,
              workspace_id: workspaceId,
            };
          })
        );
      },
      onSuccess: () => {
        refetchFiles();
        closeUploadFileSheet();
        fileUploaderStore.reset();
        toast.success("Files uploaded successfully");
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

  const context: Partial<FileActionsContextProps> = {
    openUploadSheet: openUploadFileSheet,
    page,
    setPage,
    size,
    setSize,
    totalPageCount: Math.ceil((filesResp?.results ?? 0) / size),
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
          columns={getFileColumns()}
          data={files}
          isPending={isPending}
        />
      </div>
      {uploadFileSheet}
    </FileActionsContext.Provider>
  );
}
