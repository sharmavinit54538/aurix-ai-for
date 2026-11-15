import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  handleSessionExpired,
  resetSessionExpiredFlag,
  refreshAccessToken,
} from "./tokens";
import { getApiBaseUrl, API_BASE_URL, BASE_URL } from "./baseUrl";
import { normalizeApiPath } from "./normalizeApiPath";
import { getMockApiResponse, isMockDemoToken } from "@/lib/mock-hr-admin";

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

const IS_TEST_ENV =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.MODE === "test") ||
  (typeof process !== "undefined" && Boolean((process as any).env?.VITEST || (process as any).env?.NODE_TEST_CONTEXT));

function isStrictRealBackendEndpoint(url: string): boolean {
  const normalized = url.toLowerCase();
  return (
    normalized.includes("/payments") ||
    normalized.includes("/billing") ||
    normalized.includes("/settings/billing") ||
    normalized.includes("/settings/subscription")
  );
}

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url) {
      config.url = normalizeApiPath(config.url);
    }
    const token = getAccessToken();
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const reqUrl = config.url || "";
    if (!IS_TEST_ENV && isMockDemoToken(token) && !isStrictRealBackendEndpoint(reqUrl)) {
      const mockPayload = getMockApiResponse(
        config.method || "GET",
        reqUrl,
        config.params,
        config.data,
      );
      config.adapter = async () => ({
        data: mockPayload,
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        config,
      });
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

    if (!IS_TEST_ENV && isMockDemoToken(getAccessToken()) && !isStrictRealBackendEndpoint(reqUrl)) {
      const mockPayload = getMockApiResponse(
        originalRequest?.method || "GET",
        reqUrl,
        originalRequest?.params,
        originalRequest?.data,
      );
      return {
        data: mockPayload,
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        config: originalRequest || ({} as InternalAxiosRequestConfig),
      };
    }

    if (!IS_TEST_ENV && isMockDemoToken(getAccessToken()) && isStrictRealBackendEndpoint(reqUrl)) {
      return Promise.reject(error);
    }

    const isAuthRoute =
      reqUrl.includes("/auth/login") ||
      reqUrl.includes("/auth/register") ||
      reqUrl.includes("/auth/refresh") ||
      reqUrl.includes("/auth/verify");

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
