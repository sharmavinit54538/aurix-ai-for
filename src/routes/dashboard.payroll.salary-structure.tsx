import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/salary-structure")({
  head: () => ({ meta: [{ title: "Salary Structure — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Salary Structure" description="Define pay components, grades, and templates." />
      <ComingSoon title="Salary structures" description="Build reusable salary templates with earnings, deductions, and CTC breakups." icon={Layers} />
    </>
  ),
});
