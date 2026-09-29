import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { aurix } from "@/lib/aurix-store";
import { waitForAuth } from "@/lib/auth-bootstrap";
import { normalizeRole } from "@/lib/roles";
import { getDefaultDashboardPath } from "@/lib/role-routing";

const ExecutiveDashboardPage = lazyFeaturePage(
  () => import("@/features/dashboard/pages/ExecutiveDashboardPage"),
  "ExecutiveDashboardPage",
);

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      await waitForAuth();
      const ws = aurix.get();
      const role = normalizeRole(ws.user?.role);
      // Executive Command Center is for HR Admin and Executive; other roles land on their dedicated dashboard
      if (role && role !== "hr_admin" && role !== "executive") {
        throw redirect({
          to: getDefaultDashboardPath(ws.user) as any,
        });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Executive Command Center — OFC360 HR" },
      {
        name: "description",
        content:
          "OFC360 Enterprise Executive Dashboard — a world-class HR operating system command center with real-time KPIs, approvals, analytics, recruitment, payroll, attendance, and more.",
      },
    ],
  }),
  component: ExecutiveDashboardPage,
});
