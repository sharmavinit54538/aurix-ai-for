import { redirect } from "@tanstack/react-router";
import { aurix } from "@/lib/aurix-store";
import { waitForAuth } from "@/lib/auth-bootstrap";
import { isUserOnboardingComplete } from "@/lib/onboarding-once";
import { getDefaultDashboardPath } from "@/lib/role-paths";
import { getSafeRedirectUrl } from "@/lib/role-routing";
import { normalizeRole } from "@/lib/roles";
import { isUserAuthenticated } from "@/lib/route-guards";

export async function guardGuestAuthRoute(
  route: "login" | "register" | "verify_email",
  search?: Record<string, unknown>,
): Promise<void> {
  if (typeof window === "undefined") return;

  await waitForAuth();
  const ws = aurix.get();
  if (!isUserAuthenticated() || !ws.user) {
    return;
  }

  if (route === "verify_email") {
    if (ws.user.emailVerified) {
      const redirectParam = (search?.redirect || search?.callbackUrl) as string | undefined;
      const dest = redirectParam ? getSafeRedirectUrl(redirectParam, ws.user) : getDefaultDashboardPath(ws.user);
      throw redirect({ to: dest as any });
    }
    return;
  }

  if (route === "register") {
    if (!ws.user.emailVerified) {
      throw redirect({
        to: "/verify-email" as any,
        ...(ws.user.email ? { search: { email: ws.user.email } as any } : {}),
      });
    }
    throw redirect({ to: getDefaultDashboardPath(ws.user) as any });
  }

  // route === "login"
  if (ws.user.emailVerified) {
    const redirectParam = (search?.redirect || search?.callbackUrl) as string | undefined;
    const destination = getSafeRedirectUrl(redirectParam, ws.user);
    if (destination && destination !== "/login" && destination !== "/auth/login") {
      throw redirect({ to: destination as any });
    }
  }
}

export async function guardOnboardingRoute(search?: Record<string, unknown>): Promise<void> {
  if (typeof window === "undefined") return;
  if (search?.token) {
    return;
  }

  await waitForAuth();
  const ws = aurix.get();
  if (!isUserAuthenticated() || !ws.user) {
    throw redirect({ to: "/login" as any });
  }

  if (!ws.user.emailVerified) {
    throw redirect({
      to: "/verify-email" as any,
      ...(ws.user.email ? { search: { email: ws.user.email } as any } : {}),
    });
  }

  if (isUserOnboardingComplete(ws.user)) {
    throw redirect({ to: getDefaultDashboardPath(ws.user) as any });
  }
}

export async function guardEmployeeOnboardingRoute(search?: Record<string, unknown>): Promise<void> {
  if (typeof window === "undefined") return;
  if (search?.token) {
    return;
  }

  await waitForAuth();
  const ws = aurix.get();
  if (!isUserAuthenticated() || !ws.user) {
    throw redirect({ to: "/login" as any });
  }

  if (!ws.user.emailVerified) {
    throw redirect({
      to: "/verify-email" as any,
      ...(ws.user.email ? { search: { email: ws.user.email } as any } : {}),
    });
  }

  const role = normalizeRole(ws.user.role);
  if ((role === "employee" || role === "manager") && isUserOnboardingComplete(ws.user)) {
    throw redirect({ to: getDefaultDashboardPath(ws.user) as any });
  }
}

export async function guardDashboardRoute(locationHref?: string): Promise<void> {
  if (typeof window === "undefined") return;

  await waitForAuth();
  const ws = aurix.get();
  if (!isUserAuthenticated() || !ws.user) {
    const redirectTarget =
      locationHref && locationHref !== "/" && !locationHref.startsWith("/login")
        ? { redirect: locationHref }
        : undefined;
    throw redirect({
      to: "/login" as any,
      ...(redirectTarget ? { search: redirectTarget as any } : {}),
    });
  }

  if (!ws.user.emailVerified) {
    throw redirect({
      to: "/verify-email" as any,
      ...(ws.user.email ? { search: { email: ws.user.email } as any } : {}),
    });
  }

  const role = normalizeRole(ws.user.role);
  if (role === "hr_admin" && !isUserOnboardingComplete(ws.user)) {
    throw redirect({ to: "/onboarding" as any });
  }
  if ((role === "employee" || role === "manager") && !isUserOnboardingComplete(ws.user)) {
    throw redirect({ to: "/employee-onboarding" as any });
  }
}
