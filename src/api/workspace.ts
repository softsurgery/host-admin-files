import { Workspace } from "@/types/workspace";
import axios from "./axios";

const create = async (workspace: Workspace):Promise<number> => {
  const response = await axios.post("/api.php/records/workspaces", workspace);
  return response.data;
};

const fetchAll = async (): Promise<Workspace[]> => {
  const response = await axios.get("/api.php/records/workspaces");
  return response.data;
};

export const workspace = {
  create,
  fetchAll,
};
