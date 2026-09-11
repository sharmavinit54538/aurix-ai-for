import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ExecutiveDashboardPage = lazyFeaturePage(
  () => import("@/features/dashboard/pages/ExecutiveDashboardPage"),
  "ExecutiveDashboardPage",
);

export const Route = createFileRoute("/dashboard/")({
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
