import axios from "./axios";
import { ServerFileResponse } from "@/types/utils/ServerResponse";

const downloadFile = async (uuid: string, ext: string) => {
  try {
    const response = await axios.get(`/files.php?uuid=${uuid}&ext=${ext}`, {
      responseType: "blob",
    });

    const a = document.createElement("a");
    const url = window.URL.createObjectURL(new Blob([response.data]));
    a.href = url;
    a.download = `${uuid}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

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

const deleteFile = async (uuid: string) => {
    const response = await axios.delete(`/files.php?uuid=${uuid}`);
    return response.data;
};

export const upload = {
  downloadFile,
  uploadOne,
  uploadMany,
  deleteFile
};
