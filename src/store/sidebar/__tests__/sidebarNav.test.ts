import { describe, it, expect } from "vitest";
import { filterNavTree } from "../sidebarSelectors";
import { sidebarApi, DEFAULT_ROLE_PERMISSIONS } from "@/services/sidebarApi";
import type { SidebarNavSection } from "../sidebarTypes";

describe("Sidebar Navigation & HR Admin Access", () => {
  const testSections: SidebarNavSection[] = [
    {
      items: [
        {
          to: "/dashboard",
          label: "Overview",
          permission: "overview.view",
          icon: () => null,
        },
        {
          to: "/dashboard/workforce",
          label: "Workforce",
          permission: "workforce.view",
          icon: () => null,
        },
        {
          to: "/dashboard/attendance",
          label: "Attendance",
          permission: "workforce.attendance",
          roles: ["super_admin", "hr_admin", "manager"],
          icon: () => null,
        },
        {
          to: "/dashboard/leaves",
          label: "Leaves",
          permission: "workforce.leaves",
          roles: ["super_admin", "hr_admin", "manager"],
          icon: () => null,
        },
        {
          to: "/dashboard/talent",
          label: "Talent Management",
          permission: "talent.view",
          roles: ["super_admin", "hr_admin", "manager"],
          icon: () => null,
        },
        {
          to: "/dashboard/hr-operations",
          label: "HR Operations",
          permission: "hrops.view",
          roles: ["super_admin", "hr_admin"],
          icon: () => null,
        },
        {
          to: "/dashboard/payroll",
          label: "Payroll",
          permission: "payroll.view",
          roles: ["super_admin", "hr_admin"],
          icon: () => null,
        },
        {
          to: "/dashboard/super-admin-only",
          label: "Super Admin Only",
          permission: "settings.roles_permissions",
          roles: ["super_admin"],
          icon: () => null,
        },
      ],
    },
  ];

  it("ensures hr_admin sees all authorized items even when permissions array is empty (unloaded backend)", () => {
    const result = filterNavTree(testSections, "hr_admin", []);
    expect(result.length).toBe(1);
    const labels = result[0].items.map((i) => i.label);

    expect(labels).toContain("Overview");
    expect(labels).toContain("Workforce");
    expect(labels).toContain("Attendance");
    expect(labels).toContain("Leaves");
    expect(labels).toContain("Talent Management");
    expect(labels).toContain("HR Operations");
    expect(labels).toContain("Payroll");
    // Should NOT contain Super Admin Only item
    expect(labels).not.toContain("Super Admin Only");
  });

  it("ensures hr_admin sees all authorized items with DEFAULT_ROLE_PERMISSIONS", () => {
    const result = filterNavTree(testSections, "hr_admin", DEFAULT_ROLE_PERMISSIONS.hr_admin);
    expect(result.length).toBe(1);
    const labels = result[0].items.map((i) => i.label);

    expect(labels).toContain("Overview");
    expect(labels).toContain("Workforce");
    expect(labels).toContain("Attendance");
    expect(labels).toContain("Leaves");
    expect(labels).toContain("Talent Management");
    expect(labels).toContain("HR Operations");
    expect(labels).toContain("Payroll");
    expect(labels).not.toContain("Super Admin Only");
  });

  it("super_admin sees all items including super admin only", () => {
    const result = filterNavTree(testSections, "super_admin", []);
    expect(result.length).toBe(1);
    const labels = result[0].items.map((i) => i.label);
    expect(labels).toContain("Super Admin Only");
    expect(labels).toContain("Payroll");
  });

  it("sidebarApi.getPermissions returns default permissions for hr_admin upon network/backend fallback", async () => {
    const res = await sidebarApi.getPermissions("hr_admin");
    expect(res.role).toBe("hr_admin");
    expect(res.permissions).toContain("overview.view");
    expect(res.permissions).toContain("payroll.view");
    expect(res.permissions).toContain("workforce.attendance");
    expect(res.permissions).toContain("workforce.leaves");
  });
});
