import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/payslips")({
  head: () => ({ meta: [{ title: "Payslips — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Payslips" description="Generate, distribute, and download employee payslips." />
      <ComingSoon title="Payslips" description="Auto-generate monthly payslips and share them securely with employees." icon={FileText} />
    </>
  ),
});
