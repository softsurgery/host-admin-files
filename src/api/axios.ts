import { useAuthPersistStore } from "@/hooks/stores/useAuthPersistStore";
import _axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axios = _axios.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use(
  (config) => {
    const token = useAuthPersistStore.getState().token;
    if (token) {
      config.headers["X-Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
