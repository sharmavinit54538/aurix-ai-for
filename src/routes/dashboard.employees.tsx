import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/employees/pages/EmployeesPage"), "EmployeesPage");

export const Route = createFileRoute("/dashboard/employees")({
  head: () => ({ meta: [{ title: "Employees — OFC360" }] }),
  component: PageComponent,
});
