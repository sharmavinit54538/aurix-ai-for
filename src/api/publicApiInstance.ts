import axios, { type InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "./baseUrl";
import { normalizeApiPath } from "./normalizeApiPath";

/**
 * Unauthenticated Axios client for public endpoints (/api/public/*).
 * Never attaches employee Bearer tokens or triggers authenticated session refresh/redirects.
 */
export const publicApiInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

publicApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url) {
      config.url = normalizeApiPath(config.url);
    }
    if (config.headers && "Authorization" in config.headers) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default publicApiInstance;
