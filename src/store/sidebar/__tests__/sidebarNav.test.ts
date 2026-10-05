import { describe, it, expect, vi } from "vitest";
import { filterNavTree } from "../sidebarSelectors";
import { sidebarApi, DEFAULT_ROLE_PERMISSIONS } from "@/services/sidebarApi";
import apiInstance from "@/api/apiInstance";
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
    vi.spyOn(apiInstance, "get").mockRejectedValueOnce(new Error("Backend route not available"));
    const res = await sidebarApi.getPermissions("hr_admin");
    expect(res.role).toBe("hr_admin");
    expect(res.permissions).toContain("overview.view");
    expect(res.permissions).toContain("payroll.view");
    expect(res.permissions).toContain("workforce.attendance");
    expect(res.permissions).toContain("workforce.leaves");
    expect(res.permissions).toContain("announcements.view");
    expect(res.permissions).toContain("autopilot.view");
    expect(res.permissions).toContain("connect.view");
    expect(res.permissions).toContain("helpdesk.view");
  });

  it("verifies the full 13 enterprise navigation items are visible for hr_admin with permissions", () => {
    const enterpriseSections: SidebarNavSection[] = [
      {
        items: [
          { to: "/dashboard", label: "Overview", icon: () => null, permission: "overview.view" },
          { to: "/dashboard/announcements", label: "Announcements", icon: () => null, permission: "announcements.view" },
          { to: "/dashboard/workforce", label: "Workforce", icon: () => null, permission: "workforce.view" },
          { to: "/dashboard/talent", label: "Talent Management", icon: () => null, permission: "talent.view", roles: ["super_admin", "hr_admin", "manager"] },
          { to: "/dashboard/hr-operations", label: "HR Operations", icon: () => null, permission: "hrops.view", roles: ["super_admin", "hr_admin"] },
          { to: "/dashboard/resources", label: "Resources", icon: () => null, permission: "resources.view" },
          { to: "/dashboard/payroll", label: "Payroll", icon: () => null, permission: "payroll.view", roles: ["super_admin", "hr_admin"] },
          { to: "/dashboard/analytics", label: "Analytics", icon: () => null, permission: "analytics.view", roles: ["super_admin", "hr_admin", "executive", "manager"] },
          { to: "/dashboard/autopilot", label: "OneHR", icon: () => null, permission: "autopilot.view", roles: ["super_admin", "hr_admin", "manager"] },
          { to: "/dashboard/ai-hub", label: "AI Hub", icon: () => null, permission: "ai.view" },
          { to: "/dashboard/connect", label: "Connect", icon: () => null, permission: "connect.view" },
          { to: "/dashboard/helpdesk", label: "Helpdesk", icon: () => null, permission: "helpdesk.view", roles: ["hr_admin"] },
          { to: "/dashboard/settings", label: "Settings", icon: () => null, permission: "settings.view" },
        ],
      },
    ];

    const result = filterNavTree(enterpriseSections, "hr_admin", DEFAULT_ROLE_PERMISSIONS.hr_admin);
    expect(result.length).toBe(1);
    const labels = result[0].items.map((i) => i.label);

    expect(labels).toEqual([
      "Overview",
      "Announcements",
      "Workforce",
      "Talent Management",
      "HR Operations",
      "Resources",
      "Payroll",
      "Analytics",
      "OneHR",
      "AI Hub",
      "Connect",
      "Helpdesk",
      "Settings",
    ]);
    expect(labels.length).toBe(13);
  });
});
