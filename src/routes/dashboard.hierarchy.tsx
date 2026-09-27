import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { EmployeeHierarchyView } from "@/features/admin/employees/components/EmployeeHierarchyView";

export const Route = createFileRoute("/dashboard/hierarchy")({
  head: () => ({ meta: [{ title: "Organizational Graph — OFC360" }] }),
  component: HierarchyPage,
});

function HierarchyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizational Graph"
        description="Interactive, relationship-aware organizational intelligence layer with real-time reporting paths, department mapping, skill analysis, and AI-powered insights."
      />

      <EmployeeHierarchyView />
    </div>
  );
}

