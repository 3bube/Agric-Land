import axios from "axios";

// const newRequest = axios.create({
//   baseURL: isDevelopment
//     ? "http://localhost:5000/api"
//     : "https://agric-land-backend.vercel.app/api",
//   withCredentials: false,
// });

const newRequest = axios.create({
  baseURL: "https://agric-land.onrender.com/api",
  withCredentials: false,
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
