import { ServerApiResponse } from "@/types/utils/ServerResponse";
import axios from "./axios";
import { CreateUploadFileDto, UploadFile } from "@/types/UploadFile";
import { QueryParams } from "@/types/utils/QueryParams";

const fetchPaginated = async (
  params?: QueryParams
): Promise<ServerApiResponse<UploadFile>> => {
  const queryString = params
    ? Object.values(params)
        .filter((value) => value)
        .join("&")
    : "";
  const response = await axios.get(`/api.php/records/files?${queryString}`);
  const isWorkspaceJoined = params?.join?.includes("workspaces");
  return {
    ...response.data,
    records: response.data.records.map(
      (record: Record<keyof UploadFile, unknown>) => ({
        ...record,
        workspace: isWorkspaceJoined ? record.workspace_id : undefined,
        workspace_id: isWorkspaceJoined
          ? (record.workspace_id as { id: number }).id
          : record.workspace_id,
      })
    ),
  };
};

const create = async (file: CreateUploadFileDto) => {
  const response = await axios.post("/api.php/records/files", file);
  return response.data;
};

export const file = {
  create,
  fetchPaginated,
};
