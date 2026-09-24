import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { aurix } from "@/lib/aurix-store";
import { isAccessTokenExpired } from "./token-utils";
import { getTokens, setTokens } from "./tokens";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipCache?: boolean;
  }
}

/**
 * Normalizes the API base origin, ensuring https:// protocol and no trailing slashes.
 * e.g., "https://www.api.ofc360.com"
 */
export function getApiBaseUrl(): string {
  // If accessed from localhost on a port other than 8080 (e.g. 8081),
  // backend rejects with '400 Disallowed CORS origin'.
  // Using relative path routes through Vite dev server proxy (changeOrigin: true), bypassing CORS completely!
  if (typeof window !== "undefined") {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocalhost && window.location.port !== "8080") {
      return "";
    }
  }

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
      // POST to /auth/refresh with withCredentials: true.
      // The browser automatically attaches the HttpOnly cookie.
      let res;
      try {
        res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
      } catch (postErr: any) {
        if (postErr?.response?.status === 404) {
          res = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
        } else {
          throw postErr;
        }
      }

      const tokenData = res.data?.data ?? res.data;
      const accessToken =
        tokenData?.access_token || tokenData?.accessToken || tokenData?.token;

      if (!accessToken) {
        setTokens(null);
        aurix.set({ isRestoring: false, user: null, company: null });
        throw new Error("Invalid session refresh response");
      }

      setTokens({ accessToken });
      return accessToken;
    } catch (error) {
      setTokens(null);
      aurix.set({ isRestoring: false, user: null, company: null });
      throw new Error("Failed to refresh session");
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
    let url = config.url.trim();

    // Fix accidental local host or domain prepends
    url = url.replace(/^(?:https?:\/\/[^/]+)?(?:\/)?(?:www\.)?api\.ofc360\.com(?:\/)?/, "/");
    url = url.replace(/^\/?(?:http:\/\/localhost:\d+\/)?/, "/");

    // If it's a full external URL, don't modify
    if (url.startsWith("http://") || url.startsWith("https://")) {
      config.url = url;
      return config;
    }

    if (!url.startsWith("/")) {
      url = `/${url}`;
    }

    // Automatically route to /api/v1 if not already prefixed with /api/
    if (!url.startsWith("/api/")) {
      url = `/api/v1${url}`;
    }

    config.url = url;
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
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
    } catch (refreshError) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
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

