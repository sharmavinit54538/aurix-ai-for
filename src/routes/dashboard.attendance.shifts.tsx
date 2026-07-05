import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/attendance/shifts")({
  head: () => ({ meta: [{ title: "Shifts — Aurix" }] }),
  component: ShiftsPage,
});

function ShiftsPage() {
  return (
    <>
      <PageHeader title="Shifts" description="Define and assign work shifts across teams." />
      <ComingSoon title="Shift management" description="Create shift templates, assign them to employees, and track shift coverage in real time." icon={Clock} />
    </>
  );
}
