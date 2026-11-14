import axios from "axios";
import apiInstance from "./apiInstance";
import { normalizeApiPath } from "./normalizeApiPath";

export { normalizeApiPath };

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
  params?: Record<string, unknown>;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions & { method?: string } = {},
): Promise<T> {
  const normalized = normalizeApiPath(path);
  const method = (options.method || "GET").toUpperCase();

  try {
    const response = await apiInstance.request<T>({
      url: normalized,
      method,
      data: options.data,
      headers: options.headers,
      timeout: options.timeout,
      params: options.params,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const resData = err.response?.data;
      const message =
        (resData &&
          typeof resData === "object" &&
          ("detail" in resData || "message" in resData || "error" in resData) &&
          String(
            (resData as Record<string, unknown>).detail ||
              (resData as Record<string, unknown>).message ||
              (resData as Record<string, unknown>).error,
          )) ||
        err.message ||
        `Request failed with status ${status}`;
      throw new ApiError(message, status, resData);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err instanceof Error ? err.message : "Network request failed",
      500,
      null,
    );
  }
}

export const api = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(path: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", data }),
  put: <T = unknown>(path: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", data }),
  patch: <T = unknown>(path: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", data }),
  delete: <T = unknown>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
