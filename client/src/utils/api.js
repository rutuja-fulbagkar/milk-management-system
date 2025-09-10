import axios from "axios";
import { toast } from "react-toastify";

export const API_BASE_URL = import.meta.env.VITE_HOST_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `${token}`; // Ensure "Bearer" is included
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.error === "jwt expired"
    ) {
      // Remove token
      localStorage.removeItem("token");

      // Show toast
      toast.error("Session expired. You have been logged out.", {
        position: "top-center",
        autoClose: 3000, // Toast auto closes after 3 seconds
      });

      // Delay redirect by 3 seconds
      setTimeout(() => {
        window.location.href = "/signin";
      }, 3000);
    }

    return Promise.reject(error);
  }
);
