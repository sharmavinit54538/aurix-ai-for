/**
 * Reusable server-side authentication and authorization guards for API routes in TanStack Start / Nitro.
 * Enforces:
 * 1. Bearer token validation (401 Unauthorized)
 * 2. Role-based backend authorization (403 Forbidden)
 * 3. Platform Owner (Super Admin) separation (403 Forbidden)
 * 4. Tenant / Organization isolation (403 Forbidden)
 */
import { normalizeRole, isSuperAdmin, type AppRole, COMPANY_ROLES } from "./roles";

export interface AuthenticatedUser {
  id: string;
  name?: string;
  email?: string;
  role: AppRole | null;
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
 * and verifies it against the backend identity service.
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

/**
 * Enforces that the authenticated user possesses one of the allowed roles.
 * Returns 401 if unauthenticated, 403 Forbidden if role not permitted.
 */
export async function requireRole(
  request: Request,
  allowedRoles: AppRole[],
): Promise<AuthResult> {
  const auth = await requireAuth(request);
  if (auth.error) return auth;

  const userRole = auth.user.role;
  const isAllowed = userRole && allowedRoles.some((r) => r === userRole || (r === "super_admin" && userRole === "superadmin"));

  if (!isAllowed) {
    return {
      error: new Response(
        JSON.stringify({
          error: "Forbidden: You lack permission to perform this action.",
          requiredRoles: allowedRoles,
          currentRole: userRole,
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      ),
    };
  }

  return auth;
}

/**
 * Enforces that the request is strictly made by the platform Super Admin owner.
 * Any other role (HR_ADMIN, MANAGER, etc.) receives a 403 Forbidden.
 */
export async function requireSuperAdmin(request: Request): Promise<AuthResult> {
  const auth = await requireAuth(request);
  if (auth.error) return auth;

  if (!isSuperAdmin(auth.user.role)) {
    return {
      error: new Response(
        JSON.stringify({
          error: "Forbidden: This platform management endpoint is strictly restricted to the Super Admin platform owner.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      ),
    };
  }

  return auth;
}

/**
 * Enforces organization / tenant isolation.
 * Normal users can ONLY access data belonging to their own companyId.
 * Super Admin (platform owner) has cross-tenant oversight for platform operations.
 */
export async function requireTenantIsolation(
  request: Request,
  targetCompanyId: string | number | undefined,
): Promise<AuthResult> {
  const auth = await requireAuth(request);
  if (auth.error) return auth;

  // Platform owner has cross-tenant visibility
  if (isSuperAdmin(auth.user.role)) {
    return auth;
  }

  // Normal organization users must match company_id
  if (
    targetCompanyId !== undefined &&
    String(auth.user.company_id) !== String(targetCompanyId)
  ) {
    return {
      error: new Response(
        JSON.stringify({
          error: "Forbidden: Tenant isolation violation. You cannot access data outside your organization.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      ),
    };
  }

  return auth;
}
