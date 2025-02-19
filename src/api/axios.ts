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
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthPersistStore.getState().setToken("");
      useAuthPersistStore.getState().setAuthenticated(false);
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axios;
