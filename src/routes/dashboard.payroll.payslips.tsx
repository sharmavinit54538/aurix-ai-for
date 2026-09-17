import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollPayslipsHubPage = lazyFeaturePage(
  () => import("@/pages/PayrollPayslipsHubPage")
);

export const Route = createFileRoute("/dashboard/payroll/payslips")({
  head: () => ({
    meta: [
      { title: "My Payslips & Salary Statements — OFC360" },
      {
        name: "description",
        content: "View, print, and download official finalized salary payslips.",
      },
    ],
  }),
  component: PayrollPayslipsHubPage,
});
