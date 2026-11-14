import { normalizeApiPath } from "./normalizeApiPath";
import { buildMockPayload } from "./apiInstance";

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
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions & { method?: string } = {},
): Promise<T> {
  const normalized = normalizeApiPath(path);
  const method = (options.method || "GET").toUpperCase();

  if (normalized.includes("/auth/me")) {
    return {
      success: true,
      data: {
        id: "usr-1",
        name: "Alex Vance",
        email: "alex.vance@aurix.ai",
        role: "hr_admin",
        company_id: "org-1",
        company_name: "AURIX AI Enterprise",
        is_verified: true,
        onboarding_completed: true,
      },
    } as unknown as T;
  }

  const payload = buildMockPayload(normalized, method, options.data);
  if (Array.isArray(payload)) {
    return payload as unknown as T;
  }
  return {
    success: true,
    data: payload,
    ...(typeof payload === "object" && payload !== null ? payload : {}),
  } as unknown as T;
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
