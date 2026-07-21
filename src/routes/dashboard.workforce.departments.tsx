import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const DepartmentsPage = lazyFeaturePage(
  () => import("@/features/admin/departments/pages/DepartmentsPage") as any,
  "DepartmentsPage"
);

export const Route = createFileRoute("/dashboard/workforce/departments")({
  head: () => ({ meta: [{ title: "Departments — Aurix" }] }),
  component: DepartmentsPage,
});
