import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const DepartmentsPage = lazyFeaturePage(
  () => import("@/features/admin/departments/pages/DepartmentsPage"),
  "DepartmentsPage",
);

export const Route = createFileRoute("/dashboard/departments")({
  head: () => ({ meta: [{ title: "Departments — Aurix" }] }),
  component: DepartmentsPage,
});
