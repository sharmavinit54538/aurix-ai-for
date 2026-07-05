import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — Aurix" }] }),
  component: RolesPage,
});

function RolesPage() {
  return (
    <>
      <PageHeader title="Roles & Permissions" description="Control who can access what across Aurix." />
      <ComingSoon title="Role-based access" description="Create custom roles and fine-tune permissions for every module." icon={ShieldCheck} />
    </>
  );
}
