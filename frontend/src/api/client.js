import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api"
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("pms_auth");
  if (!auth) return config;

  try {
    const { token } = JSON.parse(auth);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    localStorage.removeItem("pms_auth");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pms_auth");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
