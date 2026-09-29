/**
 * Centralized Role-Based Dashboard Routing and Redirect Handling for OFC360.
 *
 * Provides a single source of truth for:
 * - Mapping user roles to their canonical dashboard landing pages.
 * - Safely validating and honouring callback/redirect query parameters without open redirects or privilege escalation.
 */
import type { AuthUserPayload } from "@/api/types";
import { normalizeRole, type AppRole } from "./roles";
import type { AurixUser } from "./aurix-store";
import { checkRouteAccess } from "./route-guards";
import { getDefaultDashboardPath, type RoleOrUser } from "./role-paths";

export { getDefaultDashboardPath, type RoleOrUser };

const DISALLOWED_REDIRECT_PATHS = new Set([
  "/",
  "/login",
  "/login/",
  "/auth/login",
  "/auth/login/",
  "/register",
  "/register/",
  "/forgot-password",
  "/forgot-password/",
  "/reset-password",
  "/reset-password/",
  "/verify-email",
  "/verify-email/",
  "/verify-reset-otp",
  "/verify-reset-otp/",
]);

/**
 * Validates and returns a safe destination path for post-login or guarded redirects.
 *
 * Honours the requested target URL ONLY if:
 * 1. It is a local relative path or matches the current window origin.
 * 2. It does NOT point to an authentication page or the root route (preventing redirect loops).
 * 3. The user has permission to access the target route according to checkRouteAccess().
 *
 * Otherwise, falls back to the user's role-based default dashboard path.
 */
export function getSafeRedirectUrl(
  targetUrl: string | null | undefined,
  userOrRole?: RoleOrUser,
): string {
  const fallback = getDefaultDashboardPath(userOrRole);

  if (!targetUrl || typeof targetUrl !== "string") {
    return fallback;
  }

  const trimmed = targetUrl.trim();
  if (!trimmed) {
    return fallback;
  }

  let pathname = "";
  let fullTarget = "";

  try {
    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
      const url = new URL(trimmed, "http://localhost");
      pathname = url.pathname;
      fullTarget = `${url.pathname}${url.search}${url.hash}`;
    } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      if (typeof window !== "undefined" && url.origin !== window.location.origin) {
        return fallback;
      }
      pathname = url.pathname;
      fullTarget = `${url.pathname}${url.search}${url.hash}`;
    } else {
      return fallback;
    }
  } catch {
    return fallback;
  }

  if (DISALLOWED_REDIRECT_PATHS.has(pathname)) {
    return fallback;
  }

  const role =
    typeof userOrRole === "object" && userOrRole !== null
      ? normalizeRole(userOrRole.role)
      : normalizeRole(userOrRole);

  const access = checkRouteAccess(pathname, role);
  if (!access.allowed) {
    return fallback;
  }

  return fullTarget;
}
