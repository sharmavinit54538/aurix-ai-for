import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { aurix } from "@/lib/aurix-store";
import { isAccessTokenExpired } from "./token-utils";
import { getTokens, setTokens } from "./tokens";

/**
 * Normalizes the API base origin, ensuring https:// protocol and no trailing slashes.
 * e.g., "https://www.api.ofc360.com"
 */
export function getApiBaseUrl(): string {
  let url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!url) {
    return "https://www.api.ofc360.com";
  }
  // Remove any accidental leading slashes
  url = url.replace(/^\/+/, "");
  // Prepend https:// if protocol is omitted
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
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
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const res = await axios.post(`${BASE_URL}/auth/refresh`, {
      refresh_token: tokens.refreshToken,
    });

    if (!res.data?.success || !res.data?.data) {
      setTokens(null);
      aurix.set({ isRestoring: false, user: null, company: null });
      throw new Error("Invalid session refresh response");
    }

    const newTokens = {
      accessToken: res.data.data.access_token,
      refreshToken: res.data.data.refresh_token,
    };
    setTokens(newTokens);
    return newTokens.accessToken;
  } catch (error) {
    const status = (error as AxiosError)?.response?.status;
    if (status === 400 || status === 401 || status === 403) {
      setTokens(null);
      aurix.set({ isRestoring: false, user: null, company: null });
    }
    throw new Error("Failed to refresh session");
  }
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

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const tokens = getTokens();

    // Access token is still valid — don't clear the session on unrelated 401 responses.
    if (tokens?.accessToken && !isAccessTokenExpired(tokens.accessToken)) {
      return Promise.reject(error);
    }

    if (!tokens?.refreshToken) {
      setTokens(null);
      aurix.set({ isRestoring: false, user: null, company: null });
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newAccessToken);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        setTokens(null);
        aurix.set({ isRestoring: false, user: null, company: null });
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.replace("/login");
        }
        return Promise.reject(refreshError);
      }
    }

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        apiInstance(originalRequest).then(resolve).catch(reject);
      });
    });
  },
);

export default apiInstance;
