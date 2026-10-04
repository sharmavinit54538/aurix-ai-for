import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  getTokens,
  getRefreshToken,
  hasSessionHint,
  refreshAccessToken,
  handleSessionExpired,
  resetSessionExpiredFlag,
} from "./tokens";
import { getApiBaseUrl, API_BASE_URL, BASE_URL } from "./baseUrl";
import { normalizeApiPath } from "./normalizeApiPath";

export { handleSessionExpired, resetSessionExpiredFlag, refreshAccessToken };
export { getApiBaseUrl, API_BASE_URL, BASE_URL };

declare module "axios" {
  export interface AxiosRequestConfig {
    skipCache?: boolean;
  }
}

function getEndpointTag(url: string): string {
  if (url.includes("/auth/change-password")) return "CHANGE_PASSWORD";
  if (url.includes("/auth/login")) return "LOGIN";
  if (url.includes("/auth/refresh")) return "REFRESH";
  if (url.includes("/auth/logout")) return "LOGOUT";
  if (url.includes("/auth/me")) return "ME";
  if (url.includes("/auth/register")) return "REGISTER";
  if (url.includes("/auth/verify-email")) return "VERIFY_EMAIL";
  if (url.includes("/auth/resend-otp")) return "RESEND_OTP";
  if (url.includes("/auth/forgot-password")) return "FORGOT_PASSWORD";
  if (url.includes("/auth/verify-reset-otp")) return "VERIFY_RESET_OTP";
  if (url.includes("/auth/reset-password")) return "RESET_PASSWORD";
  if (url.includes("/auth/google")) return "GOOGLE_AUTH";
  if (url.includes("/auth/")) return "AUTH";
  return "";
}

function resolveFullUrl(configUrl?: string, baseUrl?: string): string {
  if (!configUrl) return baseUrl || "";
  if (configUrl.startsWith("http://") || configUrl.startsWith("https://")) {
    return configUrl;
  }
  const cleanBase = (baseUrl || "").replace(/\/+$/, "");
  const cleanPath = configUrl.replace(/^\/+/, "");
  return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
}

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  if (config.url) {
    config.url = normalizeApiPath(config.url);
  }

  if (import.meta.env.DEV && import.meta.env.MODE !== "test") {
    const method = (config.method || "GET").toUpperCase();
    const fullUrl = resolveFullUrl(config.url, config.baseURL);
    const endpointTag = getEndpointTag(config.url || "");
    console.log(`[AUTH] Request:${endpointTag ? ` [${endpointTag}]` : ""} ${method} ${fullUrl}`);
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV && import.meta.env.MODE !== "test") {
      const method = (response.config.method || "GET").toUpperCase();
      const fullUrl = resolveFullUrl(response.config.url, response.config.baseURL);
      const endpointTag = getEndpointTag(response.config.url || "");
      console.log(`[AUTH] Response:${endpointTag ? ` [${endpointTag}]` : ""} ${method} ${fullUrl} -> ${response.status}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (import.meta.env.DEV && import.meta.env.MODE !== "test" && error.config) {
      const method = (error.config.method || "GET").toUpperCase();
      const fullUrl = resolveFullUrl(error.config.url, error.config.baseURL);
      const endpointTag = getEndpointTag(error.config.url || "");
      const status = error.response?.status ?? "NETWORK_ERROR";
      console.log(`[AUTH] Response:${endpointTag ? ` [${endpointTag}]` : ""} ${method} ${fullUrl} -> ${status}`);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Don't retry refresh endpoint or non-401 or already retried requests
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/change-password")
    ) {
      return Promise.reject(error);
    }

    const currentRefreshToken = getRefreshToken();
    const tokens = getTokens();
    const hasHint = hasSessionHint();

    if (!tokens?.accessToken && !currentRefreshToken && !hasHint) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiInstance(originalRequest);
    } catch (refreshError: any) {
      const status = refreshError?.response?.status ?? refreshError?.status;
      if (status === 401 || refreshError?.message === "Failed to refresh session") {
        handleSessionExpired();
      }
      return Promise.reject(refreshError);
    }
  },
);

// ── In-flight request deduplication & TTL Cache ───────────────
interface CacheEntry {
  response: any;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<any>>();
const DEFAULT_CACHE_TTL_MS = 30_000; // 30 seconds

export function clearApiCache(urlPattern?: string) {
  if (!urlPattern) {
    responseCache.clear();
    return;
  }
  for (const key of responseCache.keys()) {
    if (key.includes(urlPattern)) {
      responseCache.delete(key);
    }
  }
}

function cloneResponseData(data: any): any {
  if (data == null || typeof data !== "object") return data;
  if (Array.isArray(data)) return [...data];
  const copy: Record<string, any> = { ...data };
  if (Array.isArray(copy.items)) copy.items = [...copy.items];
  if (Array.isArray(copy.results)) copy.results = [...copy.results];
  if (Array.isArray(copy.data)) copy.data = [...copy.data];
  return copy;
}

function getRequestKey(config: any): string {
  const method = (config.method || "get").toLowerCase();
  const url = normalizeApiPath(config.url || "");
  let paramsStr = "";
  if (config.params) {
    try {
      paramsStr = typeof config.params === "string" ? config.params : JSON.stringify(config.params);
    } catch {
      paramsStr = String(config.params);
    }
  }
  return `${method}:${url}:${paramsStr}`;
}

const rawRequest = apiInstance.request.bind(apiInstance);

apiInstance.request = async function <T = any, R = any, D = any>(config: any): Promise<R> {
  const method = (config?.method || "get").toLowerCase();

  // On any mutating method, clear cached GET data to ensure freshness
  if (method === "post" || method === "put" || method === "patch" || method === "delete") {
    clearApiCache();
    return rawRequest(config);
  }

  // Deduplicate and cache GET requests
  if (method === "get") {
    const skipCache =
      config.headers?.["x-skip-cache"] === "true" ||
      config.headers?.["Cache-Control"] === "no-cache" ||
      config.skipCache;

    const key = getRequestKey(config);

    if (!skipCache) {
      const cached = responseCache.get(key);
      if (cached && Date.now() < cached.expiresAt) {
        // Return shallow clone so caller modifications do not affect cached object
        return Promise.resolve({
          ...cached.response,
          data: cloneResponseData(cached.response.data),
        });
      }

      if (inFlightRequests.has(key)) {
        return inFlightRequests.get(key)!;
      }
    }

    const promise = rawRequest(config)
      .then((response: any) => {
        if (!skipCache && response && response.status >= 200 && response.status < 300) {
          responseCache.set(key, {
            response,
            expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS,
          });
        }
        return response;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    if (!skipCache) {
      inFlightRequests.set(key, promise);
    }

    return promise;
  }

  return rawRequest(config);
};

export default apiInstance;

