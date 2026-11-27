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

export const API_TIMEOUTS = {
  standard: 15_000,
  chatHistory: 15_000,
  aiMessage: 120_000,
  aiComplex: 180_000,
  streamIdle: 45_000,
} as const;

export function getEndpointTimeout(url?: string): number {
  const path = (url || "").toLowerCase();
  if (
    path.includes("/workforce/forecast") ||
    path.includes("/chat-assistant/report") ||
    path.includes("/chat-assistant/analytics") ||
    path.includes("/chat-assistant/recommendations") ||
    path.includes("/ai/chat/report") ||
    path.includes("/ai/chat/analytics") ||
    path.includes("/ai/chat/recommendations") ||
    (path.includes("/ai-hub/") && (path.includes("/analyze") || path.includes("/generate") || path.includes("/scan")))
  ) {
    return API_TIMEOUTS.aiComplex;
  }
  if (
    path.includes("/chat-assistant/message") ||
    path.includes("/chat-assistant/query") ||
    path.includes("/chat-assistant/stream") ||
    path.includes("/ai/chat/message") ||
    path.includes("/ai/chat/query") ||
    path.includes("/ai/chat/stream")
  ) {
    return API_TIMEOUTS.aiMessage;
  }
  return API_TIMEOUTS.standard;
}

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUTS.standard,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_URL_PREFIXES = ["/api/public/", "/public/"];

function isPublicOrExternalTarget(url: string | undefined, baseUrl: string): boolean {
  if (!url) return false;
  if (PUBLIC_URL_PREFIXES.some((prefix) => url.startsWith(prefix))) {
    return true;
  }
  if (/^https?:\/\//i.test(url)) {
    try {
      const originFallback =
        typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const targetOrigin = new URL(url).origin;
      const apiOrigin = new URL(baseUrl, originFallback).origin;
      return targetOrigin !== apiOrigin;
    } catch {
      return false;
    }
  }
  return false;
}

export function buildApiUrl(path: string): string {
  const normalized = normalizeApiPath(path);
  return apiInstance.getUri({ url: normalized });
}

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url) {
      config.url = normalizeApiPath(config.url);
    }
    if (!config.timeout || config.timeout === API_TIMEOUTS.standard) {
      config.timeout = getEndpointTimeout(config.url);
    }
    const skipAuth =
      Boolean(config.headers?.["X-Skip-Auth"]) ||
      isPublicOrExternalTarget(
        config.url,
        String(config.baseURL || apiInstance.defaults.baseURL || ""),
      );
    if (config.headers && "X-Skip-Auth" in config.headers) {
      delete config.headers["X-Skip-Auth"];
    }
    if (!skipAuth) {
      const token = getAccessToken();
      if (token && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
