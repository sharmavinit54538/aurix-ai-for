import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardForbiddenPage from "@/routes/dashboard.forbidden";
import { aurix } from "@/lib/aurix-store";
import { checkRouteAccess, getRoleDefaultHome } from "@/lib/route-guards";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (opt: any) => opt,
  Link: ({ children, to }: { children?: React.ReactNode; to?: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("F-10: UX Completeness, Accessibility, and Role Guard Safety", () => {
  beforeEach(() => {
    aurix.set({ user: null });
  });

  it("renders 403 Forbidden page with safe employee fallback for unknown role", () => {
    aurix.set({
      user: {
        id: "u-1",
        email: "unknown@example.com",
        fullName: "Unknown User",
        role: "unrecognized_alien_role" as any,
        phone: "",
        companyId: "c-1",
        emailVerified: true,
        onboardingComplete: true,
        createdAt: "2026-01-01T00:00:00Z",
      },
    });

    render(<DashboardForbiddenPage />);
    expect(screen.getByText(/403 — Access Restricted/i)).toBeInTheDocument();
    expect(screen.getByText(/Module Access Denied/i)).toBeInTheDocument();
    // Safe role fallback should resolve to employee
    expect(screen.getByText("employee")).toBeInTheDocument();
    // Return link should point to employee home portal
    const returnLink = screen.getByRole("link", { name: /Return to My Portal/i });
    expect(returnLink).toHaveAttribute("href", "/dashboard/employee");
  });

  it("checkRouteAccess safely falls back for unauthenticated/unrecognized requests", () => {
    // Platform route attempted by standard employee
    const deniedPlatform = checkRouteAccess("/dashboard/super-admin", "employee");
    expect(deniedPlatform.allowed).toBe(false);
    expect(deniedPlatform.redirectPath).toBe("/dashboard/forbidden");

    // Company route attempted by super_admin
    const deniedCompany = checkRouteAccess("/dashboard/payroll", "super_admin");
    expect(deniedCompany.allowed).toBe(false);
    expect(deniedCompany.redirectPath).toBe("/dashboard/super-admin");

    // Unknown role defaults safely to forbidden
    const unknownAccess = checkRouteAccess("/dashboard/payroll", "unknown_role_string");
    expect(unknownAccess.allowed).toBe(false);
    expect(unknownAccess.redirectPath).toBe("/dashboard/forbidden");
  });

  it("getRoleDefaultHome provides safe canonical landing paths for all supported roles", () => {
    expect(getRoleDefaultHome("super_admin")).toBe("/dashboard/super-admin");
    expect(getRoleDefaultHome("hr_admin")).toBe("/dashboard");
    expect(getRoleDefaultHome("manager")).toBe("/dashboard/manager");
    expect(getRoleDefaultHome("employee")).toBe("/dashboard/employee");
    expect(getRoleDefaultHome("it_admin")).toBe("/dashboard/admin");
    expect(getRoleDefaultHome("executive")).toBe("/dashboard/executive");
    expect(getRoleDefaultHome("recruiter")).toBe("/dashboard/recruitment");
    // Unknown defaults safely to /dashboard
    expect(getRoleDefaultHome("invalid_xyz")).toBe("/dashboard");
    expect(getRoleDefaultHome(null)).toBe("/dashboard");
  });
});
