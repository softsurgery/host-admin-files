import axios from "./axios";
import { ServerFileResponse } from "@/types/utils/ServerResponse";

const uploadOne = async (
  file: File,
  workspaceId: string
): Promise<ServerFileResponse> => {
  const formData = new FormData();
  formData.append("workspace_id", workspaceId.toString());
  formData.append("files", file);
  const response = await axios.post("/files.php", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const uploadMany = async (
  files: File[],
  workspaceId: string
): Promise<ServerFileResponse> => {
  const formData = new FormData();
  formData.append("workspace_id", workspaceId.toString());
  files.forEach((file) => {
    formData.append("files[]", file);
  });
  const response = await axios.post("/files.php", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const upload = {
  uploadOne,
  uploadMany,
};
