import React from "react";
import { DataTable } from "./data-table/data-table";
import { api } from "@/api";
import { getFileColumns } from "./data-table/columns";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ApiKeyActionsContext,
  ApiKeyActionsContextProps,
} from "./data-table/action-context";
import { useAPIKeyCreateSheet } from "./modals/APIKeyCreateSheet";
import { useAPIKeyStore } from "@/hooks/stores/useAPIKeyStore";
import { AxiosError } from "axios";
import { ServerResponse } from "@/types/utils/ServerResponse";
import { apiKeySchema } from "@/types/validations/APIKey";
import { useAPIKeyDeleteDialog } from "./modals/APIKeyDeleteDialog";

interface APIKeyPanelProps {
  className?: string;
  workspaceId?: string;
}

export default function APIKeyPanel({
  className,
  workspaceId,
}: APIKeyPanelProps) {
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
    order: false,
    sortKey: "id",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const apiKeyStore = useAPIKeyStore();

  const {
    data: apiKeysResp,
    isPending: isApiKeysRespPending,
    refetch: refetchApiKeys,
  } = useQuery({
    queryKey: [
      "api-keys",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails,
      debouncedSearchTerm,
    ],
    queryFn: async () =>
      api.apiKey.fetchPaginated({
        page: `page=${debouncedPage},${debouncedSize}`,
        order: `order=${sortDetails.sortKey},${
          sortDetails.order ? "desc" : "asc"
        }`,
        search: `search=${debouncedSearchTerm}`,
        filter: workspaceId ? `filter=workspace_id,eq,${workspaceId}` : "",
        join: `join=workspaces`,
      }),
  });

  const apiKeys = React.useMemo(() => {
    return apiKeysResp?.records || [];
  }, [apiKeysResp]);

  const totalPageCount = React.useMemo(() => {
    return Math.ceil((apiKeysResp?.results ?? 0) / size);
  }, [apiKeysResp]);

  const { mutate: createAPIKey, isPending: isCreatePending } = useMutation({
    mutationFn: async () => {
      return api.apiKey.create(apiKeyStore.get());
    },
    onSuccess: () => {
      refetchApiKeys();
      toast.success("API Key created successfully");
    },
    onError: (error: AxiosError<ServerResponse>) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: deleteAPIKey, isPending: isDeletionPending } = useMutation({
    mutationFn: async () => {
      await api.apiKey.remove(apiKeyStore.id);
    },
    onSuccess: () => {
      toast.success("API Key deleted successfully");
      closeDeleteAPIKeyDialog();
      refetchApiKeys();
    },
    onError: (error) => {
      toast.error(JSON.stringify(error));
    },
  });

  const handleCreateWorkspace = () => {
    const data = apiKeyStore.get();
    const result = apiKeySchema.safeParse(data);
    if (!result.success) {
      apiKeyStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      createAPIKey();
      closeCreateAPIKeySheet();
    }
  };

  const { createAPIKeySheet, openCreateAPIKeySheet, closeCreateAPIKeySheet } =
    useAPIKeyCreateSheet({
      createAPIKeys: handleCreateWorkspace,
      isCreatePending,
      resetAPIKey: () => apiKeyStore.reset(),
    });

  const {
    deleteAPIKeyDialog,
    openDeleteAPIKeyDialog,
    closeDeleteAPIKeyDialog,
  } = useAPIKeyDeleteDialog({
    apiKeyLabel: apiKeyStore.name,
    deleteAPIKey: deleteAPIKey,
    isDeletionPending,
    resetAPIKey: () => apiKeyStore.reset(),
  });

  const context: Partial<ApiKeyActionsContextProps> = {
    openCreateAPIKeySheet,
    openDeleteAPIKeyDialog,
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
    isApiKeysRespPending || paging || resizing || sorting || searching;

  return (
    <ApiKeyActionsContext.Provider value={context}>
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
          data={apiKeys}
          isPending={isPending}
        />
      </div>
      {createAPIKeySheet}
      {deleteAPIKeyDialog}
    </ApiKeyActionsContext.Provider>
  );
}
