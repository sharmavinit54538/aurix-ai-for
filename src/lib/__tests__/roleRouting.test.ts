import { describe, it, expect } from "vitest";
import { getDefaultDashboardPath, getSafeRedirectUrl } from "../role-routing";
import { checkRouteAccess } from "../route-guards";
import { normalizeRole } from "../roles";
import type { AuthUserPayload } from "@/api/types";

describe("Role-Based Dashboard Routing", () => {
  describe("normalizeRole", () => {
    it("recognizes recruiter and its synonyms", () => {
      expect(normalizeRole("recruiter")).toBe("recruiter");
      expect(normalizeRole("talent_acquisition")).toBe("recruiter");
      expect(normalizeRole("recruiting")).toBe("recruiter");
      expect(normalizeRole("ta")).toBe("recruiter");
    });

    it("recognizes all standard application roles", () => {
      expect(normalizeRole("super_admin")).toBe("super_admin");
      expect(normalizeRole("hr_admin")).toBe("hr_admin");
      expect(normalizeRole("manager")).toBe("manager");
      expect(normalizeRole("employee")).toBe("employee");
      expect(normalizeRole("it_admin")).toBe("it_admin");
      expect(normalizeRole("executive")).toBe("executive");
    });

    it("returns null for unrecognized roles", () => {
      expect(normalizeRole("unknown_role")).toBeNull();
      expect(normalizeRole("")).toBeNull();
      expect(normalizeRole(null)).toBeNull();
      expect(normalizeRole(undefined)).toBeNull();
    });
  });

  describe("getDefaultDashboardPath", () => {
    it("maps every canonical role to its own specific dashboard", () => {
      expect(getDefaultDashboardPath("recruiter")).toBe("/dashboard/recruitment");
      expect(getDefaultDashboardPath("super_admin")).toBe("/dashboard/super-admin");
      expect(getDefaultDashboardPath("hr_admin")).toBe("/dashboard");
      expect(getDefaultDashboardPath("manager")).toBe("/dashboard/manager");
      expect(getDefaultDashboardPath("employee")).toBe("/dashboard/employee");
      expect(getDefaultDashboardPath("it_admin")).toBe("/dashboard/admin");
      expect(getDefaultDashboardPath("executive")).toBe("/dashboard/executive");
    });

    it("safely falls back for unknown or empty roles", () => {
      expect(getDefaultDashboardPath("random_guest")).toBe("/dashboard");
      expect(getDefaultDashboardPath(null)).toBe("/dashboard");
      expect(getDefaultDashboardPath(undefined)).toBe("/dashboard");
    });

    it("routes unverified users to /verify-email", () => {
      const unverifiedUser: AuthUserPayload = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        role: "recruiter",
        is_verified: false,
      };
      expect(getDefaultDashboardPath(unverifiedUser)).toBe("/verify-email");
    });

    it("routes hr_admin with incomplete onboarding to /onboarding", () => {
      const pendingHr: AuthUserPayload = {
        id: "2",
        name: "HR Admin",
        email: "hr@example.com",
        role: "hr_admin",
        is_verified: true,
        onboarding_completed: false,
      };
      expect(getDefaultDashboardPath(pendingHr)).toBe("/onboarding");
    });

    it("routes recruiter with full user object to /dashboard/recruitment", () => {
      const recruiter: AuthUserPayload = {
        id: "3",
        name: "Jane Recruiter",
        email: "recruiter@example.com",
        role: "recruiter",
        is_verified: true,
      };
      expect(getDefaultDashboardPath(recruiter)).toBe("/dashboard/recruitment");
    });
  });

  describe("getSafeRedirectUrl", () => {
    const recruiterUser: AuthUserPayload = {
      id: "3",
      name: "Recruiter",
      email: "rec@example.com",
      role: "recruiter",
      is_verified: true,
    };

    const employeeUser: AuthUserPayload = {
      id: "4",
      name: "Employee",
      email: "emp@example.com",
      role: "employee",
      is_verified: true,
    };

    const hrUser: AuthUserPayload = {
      id: "5",
      name: "HR Admin",
      email: "hr@example.com",
      role: "hr_admin",
      is_verified: true,
      onboarding_completed: true,
    };

    it("honours valid authorized redirect paths with search parameters", () => {
      expect(getSafeRedirectUrl("/dashboard/recruitment/jobs?status=active", recruiterUser)).toBe(
        "/dashboard/recruitment/jobs?status=active"
      );
      expect(getSafeRedirectUrl("/dashboard/payroll", hrUser)).toBe("/dashboard/payroll");
      expect(getSafeRedirectUrl("/dashboard/employee", employeeUser)).toBe("/dashboard/employee");
    });

    it("rejects unauthorized redirect targets and falls back to role dashboard", () => {
      // Employee attempting to open recruiter dashboard falls back to employee dashboard
      expect(getSafeRedirectUrl("/dashboard/recruitment", employeeUser)).toBe("/dashboard/employee");
      // Employee attempting to open payroll falls back to employee dashboard
      expect(getSafeRedirectUrl("/dashboard/payroll", employeeUser)).toBe("/dashboard/employee");
      // Recruiter attempting to open super-admin falls back to recruiter dashboard
      expect(getSafeRedirectUrl("/dashboard/super-admin", recruiterUser)).toBe(
        "/dashboard/recruitment"
      );
    });

    it("rejects open-redirect external URLs and falls back to role dashboard", () => {
      expect(getSafeRedirectUrl("https://malicious-phishing.com/steal", recruiterUser)).toBe(
        "/dashboard/recruitment"
      );
      expect(getSafeRedirectUrl("//evil.com/payload", recruiterUser)).toBe(
        "/dashboard/recruitment"
      );
    });

    it("rejects redirect targets that point to auth routes to prevent loops", () => {
      expect(getSafeRedirectUrl("/login", recruiterUser)).toBe("/dashboard/recruitment");
      expect(getSafeRedirectUrl("/auth/login", employeeUser)).toBe("/dashboard/employee");
      expect(getSafeRedirectUrl("/", hrUser)).toBe("/dashboard");
    });

    it("falls back to role dashboard when redirect param is missing or empty", () => {
      expect(getSafeRedirectUrl("", recruiterUser)).toBe("/dashboard/recruitment");
      expect(getSafeRedirectUrl(null, employeeUser)).toBe("/dashboard/employee");
      expect(getSafeRedirectUrl(undefined, hrUser)).toBe("/dashboard");
    });
  });

  describe("checkRouteAccess route protection", () => {
    it("allows recruiter to access recruitment dashboard", () => {
      const res = checkRouteAccess("/dashboard/recruitment", "recruiter");
      expect(res.allowed).toBe(true);
    });

    it("denies employee access to recruitment dashboard and provides redirectPath", () => {
      const res = checkRouteAccess("/dashboard/recruitment", "employee");
      expect(res.allowed).toBe(false);
      expect(res.redirectPath).toBe("/dashboard/employee");
    });

    it("denies manager access to recruitment root dashboard", () => {
      const res = checkRouteAccess("/dashboard/recruitment", "manager");
      expect(res.allowed).toBe(false);
      expect(res.redirectPath).toBe("/dashboard/manager");
    });

    it("allows manager access to hiring manager specific recruitment routes", () => {
      const res = checkRouteAccess("/dashboard/recruitment/hiring-manager", "manager");
      expect(res.allowed).toBe(true);
    });

    it("redirects non-HR roles attempting to access root /dashboard", () => {
      const empRes = checkRouteAccess("/dashboard", "employee");
      expect(empRes.allowed).toBe(false);
      expect(empRes.redirectPath).toBe("/dashboard/employee");

      const recRes = checkRouteAccess("/dashboard", "recruiter");
      expect(recRes.allowed).toBe(false);
      expect(recRes.redirectPath).toBe("/dashboard/recruitment");

      const mgrRes = checkRouteAccess("/dashboard", "manager");
      expect(mgrRes.allowed).toBe(false);
      expect(mgrRes.redirectPath).toBe("/dashboard/manager");

      const superRes = checkRouteAccess("/dashboard", "super_admin");
      expect(superRes.allowed).toBe(false);
      expect(superRes.redirectPath).toBe("/dashboard/super-admin");
    });

    it("allows hr_admin and executive to access root /dashboard", () => {
      const hrRes = checkRouteAccess("/dashboard", "hr_admin");
      expect(hrRes.allowed).toBe(true);

      const execRes = checkRouteAccess("/dashboard", "executive");
      expect(execRes.allowed).toBe(true);
    });

    it("enforces route access for /dashboard/analytics: allowed for hr_admin, executive, manager; redirected for employee, recruiter, it_admin", () => {
      // Allowed roles
      expect(checkRouteAccess("/dashboard/analytics", "hr_admin").allowed).toBe(true);
      expect(checkRouteAccess("/dashboard/analytics", "executive").allowed).toBe(true);
      expect(checkRouteAccess("/dashboard/analytics", "manager").allowed).toBe(true);

      // Child routes also covered by longest-prefix match
      expect(checkRouteAccess("/dashboard/analytics/reports", "hr_admin").allowed).toBe(true);
      expect(checkRouteAccess("/dashboard/analytics/reports", "executive").allowed).toBe(true);
      expect(checkRouteAccess("/dashboard/analytics/reports", "manager").allowed).toBe(true);
      expect(checkRouteAccess("/dashboard/analytics/ai-insights", "manager").allowed).toBe(true);

      // Redirected roles
      const empRes = checkRouteAccess("/dashboard/analytics", "employee");
      expect(empRes.allowed).toBe(false);
      expect(empRes.redirectPath).toBe("/dashboard/employee");

      const recRes = checkRouteAccess("/dashboard/analytics", "recruiter");
      expect(recRes.allowed).toBe(false);
      expect(recRes.redirectPath).toBe("/dashboard/recruitment");

      const itRes = checkRouteAccess("/dashboard/analytics", "it_admin");
      expect(itRes.allowed).toBe(false);
      expect(itRes.redirectPath).toBe("/dashboard/admin");
    });
  });
});
