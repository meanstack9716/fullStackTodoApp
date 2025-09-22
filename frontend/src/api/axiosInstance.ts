import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

//  Request Interceptor 
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//  Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
        if (error.response?.status === 401 && token) {
            if (typeof window !== "undefined") {
                localStorage.clear();
                window.location.href = "/login";
                console.error("Unauthorized! Please login again.");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
