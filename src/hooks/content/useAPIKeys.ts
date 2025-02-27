import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/types/utils/QueryParams";
import { useDebounce } from "../useDebounce";

const useAPIKeys = (query?: QueryParams, enabled: boolean = true) => {
  const {
    isPending: isAPIKeysPending,
    data: apiKeysResp,
    refetch: refetchAPIKeys,
  } = useQuery({
    queryKey: ["apiKeys", query],
    queryFn: () => api.apiKey.fetchPaginated(query),
    enabled: enabled,
  });

  const apiKeys = React.useMemo(() => {
    if (!apiKeysResp) return [];
    return apiKeysResp.records;
  }, [apiKeysResp]);

  const { value: loading } = useDebounce<boolean>(isAPIKeysPending, 500);

  return {
    apiKeys,
    isAPIKeysPending: loading,
    refetchAPIKeys,
  };
};

export default useAPIKeys;
