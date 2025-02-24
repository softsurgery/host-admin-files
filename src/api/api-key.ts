import { ApiKey } from "@/types/APIKey";
import axios from "./axios";
import { QueryParams } from "@/types/utils/QueryParams";
import { ServerApiResponse } from "@/types/utils/ServerResponse";

const fetchPaginated = async (
  params?: QueryParams
): Promise<ServerApiResponse<ApiKey>> => {
  const queryString = params
    ? Object.values(params)
        .filter((value) => value)
        .join("&")
    : "";
  const response = await axios.get(`/api.php/records/api_keys?${queryString}`);
  return response.data;
};

const create = async (key: Partial<ApiKey>): Promise<number> => {
  const response = await axios.post("/api.php/records/api_keys", key);
  return response.data;
};

const update = async (id?: number, key?: Partial<ApiKey>): Promise<boolean> => {
  const response = await axios.put(`/api.php/records/api_keys/${id}`, key);
  return response.data;
};

const remove = async (id?: number): Promise<boolean> => {
  const response = await axios.delete(`/api.php/records/api_keys/${id}`);
  return response.data;
};

const fetchOne = async (id?: number): Promise<ApiKey> => {
  const response = await axios.get(`/api.php/records/api_keys/${id}`);
  return response.data;
};

export const apiKey = {
  create,
  update,
  remove,
  fetchPaginated,
  fetchOne,
};
