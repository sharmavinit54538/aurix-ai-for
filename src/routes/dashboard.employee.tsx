import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/portal/employee/pages/EmployeePage"), "EmployeePage");

export const Route = createFileRoute("/dashboard/employee")({
  head: () => ({ meta: [{ title: "Employee Portal — OFC360" }] }),
  component: PageComponent,
});
