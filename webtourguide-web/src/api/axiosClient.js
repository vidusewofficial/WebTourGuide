import axios from "axios";

const baseURL = "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Could not read token from localStorage:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;