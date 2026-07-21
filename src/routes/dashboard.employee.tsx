import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const EmployeePage = lazyFeaturePage(
  () => import("@/features/portal/employee/pages/EmployeePage"),
  "EmployeePage",
);

export const Route = createFileRoute("/dashboard/employee")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Aurix HR" },
      {
        name: "description",
        content:
          "Aurix HR Employee Self-Service Dashboard — manage your attendance, leaves, payslips, performance goals, documents, and assets.",
      },
    ],
  }),
  component: EmployeePage,
});
