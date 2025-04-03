import axios from "axios";

const isDevelopment = window.location.hostname === "localhost";

const newRequest = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

newRequest.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token") ?? "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
