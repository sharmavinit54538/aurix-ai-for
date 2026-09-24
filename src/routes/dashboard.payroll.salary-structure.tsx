import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const SalaryStructurePage = lazyFeaturePage(
  () => import("@/features/payroll/pages/SalaryStructurePage"),
);

export const Route = createFileRoute("/dashboard/payroll/salary-structure")({
  head: () => ({ meta: [{ title: "Salary Structures & Component Master — OFC360" }] }),
  component: SalaryStructurePage,
});
