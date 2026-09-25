import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { aurix } from "@/lib/aurix-store";
import { isAccessTokenExpired } from "./token-utils";
import { getTokens, getRefreshToken, setTokens } from "./tokens";
import { AUTH_ENDPOINTS } from "./endpoints";
import { normalizeApiPath } from "./client";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipCache?: boolean;
  }
}

/**
 * Normalizes the API base origin, ensuring https:// protocol and no trailing slashes.
 * e.g., "https://api.ofc360.com"
 */
export function getApiBaseUrl(): string {
  let url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!url) {
    return "https://api.ofc360.com";
  }
  // Remove any accidental leading slashes
  url = url.replace(/^\/+/, "");
  // Prepend https:// if protocol is omitted
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  // Normalize www.api.ofc360.com -> api.ofc360.com (www subdomain has no DNS entry)
  url = url.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com");
  // Remove trailing slashes
  url = url.replace(/\/+$/, "");
  // Strip trailing /api/v1 or /api to get purely the origin base
  url = url.replace(/\/api(\/v1)?$/, "");
  return url;
}

export const API_BASE_URL = getApiBaseUrl();
export const BASE_URL = `${API_BASE_URL}/api/v1`;

function getEndpointTag(url: string): string {
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

let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // Build request body: include the in-memory refresh token if available.
      // Remote backend supports refresh_token in request body and in HttpOnly cookie.
      const currentRefreshToken = getRefreshToken();
      const body: Record<string, string> = {};
      if (currentRefreshToken) {
        body.refresh_token = currentRefreshToken;
      }

      const refreshUrl = `${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`;
      if (process.env.NODE_ENV !== "production") {
        console.log(`[AUTH] Request: [REFRESH] POST ${refreshUrl}`);
      }

      let res;
      try {
        res = await axios.post(refreshUrl, body, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (process.env.NODE_ENV !== "production") {
          console.log(`[AUTH] Response: [REFRESH] POST ${refreshUrl} -> ${res.status}`);
        }
      } catch (postErr: any) {
        const status = postErr?.response?.status;
        if (process.env.NODE_ENV !== "production") {
          console.log(`[AUTH] Response: [REFRESH] POST ${refreshUrl} -> ${status || "NETWORK_ERROR"}`);
        }

        // Section 13: Only treat 401 Unauthorized as authentication failure.
        // Do NOT treat 404 as "user is logged out."
        if (status === 404) {
          console.error(
            `[AUTH] 404 Not Found received on refresh endpoint: ${refreshUrl}. Route configuration problem.`
          );
          throw new Error(`Refresh route configuration error: ${refreshUrl} returned 404`);
        }

        if (status === 401) {
          // Authentication failure: refresh token expired or invalid
          setTokens(null);
          aurix.set({ isRestoring: false, user: null, company: null });
          throw new Error("Failed to refresh session");
        }

        throw postErr;
      }

      const tokenData = res.data?.data ?? res.data;
      const accessToken =
        tokenData?.access_token || tokenData?.accessToken || tokenData?.token;

      if (!accessToken) {
        setTokens(null);
        aurix.set({ isRestoring: false, user: null, company: null });
        throw new Error("Invalid session refresh response: missing access token");
      }

      // Store new tokens. If the backend rotates the refresh token, store the new one in memory.
      const newRefreshToken =
        tokenData?.refresh_token || tokenData?.refreshToken || currentRefreshToken;
      setTokens({ accessToken, refreshToken: newRefreshToken || undefined });
      return accessToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  if (config.url) {
    config.url = normalizeApiPath(config.url);
  }

  if (process.env.NODE_ENV !== "production") {
    const method = (config.method || "GET").toUpperCase();
    const fullUrl = resolveFullUrl(config.url, config.baseURL);
    const endpointTag = getEndpointTag(config.url || "");
    console.log(`[AUTH] Request:${endpointTag ? ` [${endpointTag}]` : ""} ${method} ${fullUrl}`);
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== "production") {
      const method = (response.config.method || "GET").toUpperCase();
      const fullUrl = resolveFullUrl(response.config.url, response.config.baseURL);
      const endpointTag = getEndpointTag(response.config.url || "");
      console.log(`[AUTH] Response:${endpointTag ? ` [${endpointTag}]` : ""} ${method} ${fullUrl} -> ${response.status}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (process.env.NODE_ENV !== "production" && error.config) {
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
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    const tokens = getTokens();

    // Access token is still valid — don't clear session on unrelated 401 responses.
    if (tokens?.accessToken && !isAccessTokenExpired(tokens.accessToken)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiInstance(originalRequest);
    } catch (refreshError: any) {
      // Only treat 401 Unauthorized as authentication failure (Section 13)
      // Do NOT treat 404 as "user is logged out"
      const status = refreshError?.response?.status ?? refreshError?.status;
      if (status === 401 && typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.replace("/login");
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

function getRequestKey(config: any): string {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
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
          data: typeof cached.response.data === "object" && cached.response.data !== null
            ? Array.isArray(cached.response.data)
              ? [...cached.response.data]
              : { ...cached.response.data }
            : cached.response.data,
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

