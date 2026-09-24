/**
 * Reusable server-side authentication guard for API routes in TanStack Start / Nitro.
 * Validates the Authorization header against the backend GET /auth/me endpoint.
 */
import { normalizeRole, type Role } from "./rbac";

export interface AuthenticatedUser {
  id: string;
  name?: string;
  email?: string;
  role: Role;
  company_id?: string | number;
  [key: string]: unknown;
}

export interface AuthSuccess {
  user: AuthenticatedUser;
  token: string;
  error?: undefined;
}

export interface AuthFailure {
  user?: undefined;
  token?: undefined;
  error: Response;
}

export type AuthResult = AuthSuccess | AuthFailure;

function getBackendApiUrl(): string {
  const envUrl = process.env.VITE_API_URL || "https://api.ofc360.com";
  let url = envUrl.trim().replace(/\/+$/, "");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Validates that the incoming request contains a valid Bearer token,
 * and verifies it against the backend GET /auth/me endpoint.
 */
export async function requireAuth(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: new Response(
        JSON.stringify({ error: "Unauthorized: Missing or malformed Authorization header" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": 'Bearer realm="aurix-api"',
          },
        },
      ),
    };
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return {
      error: new Response(
        JSON.stringify({ error: "Unauthorized: Token missing" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": 'Bearer realm="aurix-api"',
          },
        },
      ),
    };
  }

  const baseUrl = getBackendApiUrl();

  try {
    // Try primary endpoint /api/v1/auth/me first, fallback to /auth/me
    let response = await fetch(`${baseUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      response = await fetch(`${baseUrl}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    }

    if (response.status === 401 || response.status === 403) {
      return {
        error: new Response(
          JSON.stringify({ error: "Unauthorized: Invalid or expired token" }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "WWW-Authenticate": 'Bearer realm="aurix-api"',
            },
          },
        ),
      };
    }

    if (!response.ok) {
      return {
        error: new Response(
          JSON.stringify({ error: "Unauthorized: Identity verification failed" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        ),
      };
    }

    const payload = await response.json();
    const userData = payload?.data ?? payload?.user ?? payload;

    if (!userData || (!userData.id && !userData.sub && !userData.email)) {
      return {
        error: new Response(
          JSON.stringify({ error: "Unauthorized: Invalid user payload from identity service" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        ),
      };
    }

    const user: AuthenticatedUser = {
      id: String(userData.id || userData.sub || userData.email),
      name: userData.name || userData.full_name || "",
      email: userData.email || "",
      role: normalizeRole(typeof userData.role === "string" ? userData.role : null),
      company_id: userData.company_id,
      ...userData,
    };

    return { user, token };
  } catch (err) {
    console.error("[requireAuth] Failed to verify token with backend:", err);
    return {
      error: new Response(
        JSON.stringify({ error: "Unauthorized: Authentication service unavailable" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    };
  }
}
