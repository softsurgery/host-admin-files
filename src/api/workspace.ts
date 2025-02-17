import axios from "./axios";
import { Workspace } from "@/types/Workspace";
import { ServerApiResponse } from "@/types/utils/ServerResponse";

const create = async (workspace: Partial<Workspace>): Promise<number> => {
  const response = await axios.post("/api.php/records/workspaces", workspace);
  return response.data;
};

const update = async (
  id?: number,
  workspace?: Partial<Workspace>
): Promise<boolean> => {
  const response = await axios.put(
    `/api.php/records/workspaces/${id}`,
    workspace
  );
  return response.data;
};

const remove = async (id?: number): Promise<boolean> => {
  const response = await axios.delete(`/api.php/records/workspaces/${id}`);
  return response.data;
};

const fetchAll = async (): Promise<ServerApiResponse<Workspace>> => {
  const response = await axios.get("/api.php/records/workspaces");
  return response.data;
};

export const workspace = {
  create,
  update,
  remove,
  fetchAll,
};
