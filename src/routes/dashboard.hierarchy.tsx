import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/employees/components/EmployeeHierarchyView"), "EmployeeHierarchyView");

export const Route = createFileRoute("/dashboard/hierarchy")({
  head: () => ({ meta: [{ title: "Organization Hierarchy — OFC360" }] }),
  component: PageComponent,
});
