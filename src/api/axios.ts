import _axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axios = _axios.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default axios;
