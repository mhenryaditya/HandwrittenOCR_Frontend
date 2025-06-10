import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    // await fetchUserData(token);
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        const refreshToken = Cookies.get("refresh_token");

        fetch("/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        }).then((res) => {
          const newToken = res.data.token;
          Cookies.set("token", newToken);
          onRefreshed(newToken);
          isRefreshing = false;
        }).catch((err) => {
          console.log('ok2');
          
          console.error("Error refreshing token:", err);
          isRefreshing = false;
          if (onLogout) {
            onLogout();
          }
          Cookies.remove("token");
          Cookies.remove("refresh_token");
          toast.error("Your session has expired. Please log in again.", {
            duration: 5000,
            position: "top-center",
          });
          window.location.href = "/auth/login";
          
          return Promise.reject(err);
        });
        
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;

let onLogout = null
export function setOnLogout(callback) {
  onLogout = callback;
};
