import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { EmployeeHierarchyView } from "@/features/admin/employees/components/EmployeeHierarchyView";

export const Route = createFileRoute("/dashboard/hierarchy")({
  head: () => ({ meta: [{ title: "Interactive Employee Hierarchy — OFC360" }] }),
  component: HierarchyPage,
});

function HierarchyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Hierarchy & Organization Tree"
        description="Interactive, enterprise-grade organizational tree visualization with real-time reporting paths, AI span of control analytics, and multi-layout views."
      />

      <EmployeeHierarchyView />
    </div>
  );
}

export default HierarchyPage;
