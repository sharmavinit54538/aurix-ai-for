import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { aurix } from "@/lib/aurix-store";
import { getTokens, setTokens } from "./tokens";

export const BASE_URL =(import.meta.env.VITE_API_URL as string).replace(/\/$/, "") + "/api/v1";

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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
    const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refresh_token: tokens.refreshToken,
    });

    if (!res.data?.success || !res.data?.data) {
      setTokens(null);
      aurix.reset();
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
      aurix.reset();
    }
    throw new Error("Failed to refresh session");
  }
}

apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
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
    if (!tokens?.refreshToken) {
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
