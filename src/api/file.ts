import axios from "./axios";
import { BFile } from "@/types/BFile";

const create = async (file: BFile) => {
  const response = await axios.post("/api.php/records/files", file);
  return response.data;
};

const fetchAll = async () => {
  const response = await axios.get("/api.php/records/files");
  return response.data;
};

export const file = {
  create,
  fetchAll,
};
