import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:5000/api",
});

axios.interceptors.request.use(
  (config) => {
    const token =
      JSON.parse(sessionStorage.getItem("token") ?? "") ??
      sessionStorage.getItem("token");
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
