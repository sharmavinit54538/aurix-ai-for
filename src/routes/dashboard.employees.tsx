import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";

const EmployeesPage = lazyFeaturePage(
  () => import("@/features/employees/pages/EmployeesPage"),
  "EmployeesPage",
);

export const Route = createFileRoute("/dashboard/employees")({
  head: () => ({ meta: [{ title: "Employees — Aurix" }] }),
  component: EmployeesPage,
});
