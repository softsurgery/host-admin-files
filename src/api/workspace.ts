import { Workspace } from "@/types/Workspace";
import axios from "./axios";
import { ServerApiResponse } from "@/types/utils/ServerResponse";

const create = async (workspace: Workspace): Promise<number> => {
  const response = await axios.post("/api.php/records/workspaces", workspace);
  return response.data;
};

const fetchAll = async (): Promise<ServerApiResponse<Workspace>> => {
  const response = await axios.get("/api.php/records/workspaces");
  return response.data;
};

export const workspace = {
  create,
  fetchAll,
};
