import _axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axios = _axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axios.interceptors.request.use(
  function (config) {
    const excludeCredentials = ["/auth.php"];
    
    if (excludeCredentials.some((url) => config.url?.includes(url))) {
      config.withCredentials = false;
    }
    
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default axios;
