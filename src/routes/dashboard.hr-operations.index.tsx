import { createFileRoute } from "@tanstack/react-router";
import { Activity, History, UserCheck, ClipboardCheck, LogOut, FileCheck, Layers } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/hr-operations/")({
  head: () => ({ meta: [{ title: "HR Operations Hub — Aurix" }] }),
  component: HrOperationsHubPage,
});

const HR_OPS_MODULES: ModuleItem[] = [
  {
    id: "hr-ops-dashboard",
    title: "HR Ops Command Center",
    description: "Operational overview of active HR tasks, daily checklists, and SLA metrics.",
    icon: Activity,
    to: "/dashboard/hr-operations",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "timeline",
    title: "Employee Timeline",
    description: "Track career history, promotions, department transfers, and milestone timelines.",
    icon: History,
    to: "/dashboard/hr-operations/timeline",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
  {
    id: "visitor-management",
    title: "Visitor Management",
    description: "Visitor kiosk registration, host notifications, visitor passes, and security logs.",
    icon: UserCheck,
    to: "/dashboard/hr-operations/visitor-management",
    color: "from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "onboarding",
    title: "Onboarding Checklist",
    description: "New hire orientation tasks, asset provisioning, document sign-offs, and welcome kits.",
    icon: ClipboardCheck,
    to: "/dashboard/hr-operations/onboarding",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "offboarding",
    title: "Offboarding Workflow",
    description: "Employee departure clearance, handover tasks, asset returns, and access revocation.",
    icon: LogOut,
    to: "/dashboard/hr-operations/offboarding",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "exit-management",
    title: "Exit Management",
    description: "Exit interview feedback, attrition analysis, final settlement approvals, and NOCs.",
    icon: FileCheck,
    to: "/dashboard/hr-operations/exit-management",
    color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
  },
];

function HrOperationsHubPage() {
  return (
    <ModuleHubView
      eyebrow="Operations Management"
      title="HR Operations Hub"
      description="Manage day-to-day HR operations, onboarding checklists, visitor check-ins, employee career timelines, and exit clearance workflows."
      headerIcon={Layers}
      modules={HR_OPS_MODULES}
    />
  );
}
