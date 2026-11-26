import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  handleSessionExpired,
  resetSessionExpiredFlag,
  refreshAccessToken,
} from "./tokens";
import { getApiBaseUrl, API_BASE_URL, BASE_URL } from "./baseUrl";
import { normalizeApiPath } from "./normalizeApiPath";

export { handleSessionExpired, resetSessionExpiredFlag, refreshAccessToken };
export { getApiBaseUrl, API_BASE_URL, BASE_URL };

declare module "axios" {
  export interface AxiosRequestConfig {
    skipCache?: boolean;
    _retry?: boolean;
  }
}

export function clearApiCache(_urlPattern?: string) {
  // No-op cache invalidation helper kept for caller compatibility
}

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url) {
      config.url = normalizeApiPath(config.url);
    }
    const token = getAccessToken();
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const reqUrl = originalRequest?.url || "";

    const isAuthRoute =
      reqUrl.includes("/auth/login") ||
      reqUrl.includes("/auth/register") ||
      reqUrl.includes("/auth/refresh") ||
      reqUrl.includes("/auth/verify") ||
      reqUrl.includes("/auth/forgot-password") ||
      reqUrl.includes("/auth/reset-password") ||
      reqUrl.includes("/auth/logout");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const freshToken = await refreshAccessToken();
        if (freshToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
        }
        return apiInstance(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
