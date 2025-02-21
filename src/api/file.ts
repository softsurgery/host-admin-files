import { ServerApiResponse } from "@/types/utils/ServerResponse";
import axios from "./axios";
import { CreateUploadFileDto, UploadFile } from "@/types/UploadFile";
import { upload } from "./upload";
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
  return response.data;
};

const create = async (file: CreateUploadFileDto) => {
  const response = await axios.post("/api.php/records/files", file);
  return response.data;
};

const uploadThenCreate = async (file: File, workspace_id: number) => {
  const uploadResponse = await upload.uploadOne(file);
  const fileToCreate = {
    filename: file.name,
    uuid: uploadResponse.results[0].file,
    size: file.size,
    mime_type: file.type,
    workspace_id,
  };
  const response = await axios.post("/api.php/records/files", fileToCreate);
  return response.data;
};

export const file = {
  create,
  uploadThenCreate,
  fetchPaginated,
};
