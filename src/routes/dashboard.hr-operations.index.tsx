import { createFileRoute } from "@tanstack/react-router";
import { Activity, History, UserCheck, ClipboardCheck, LogOut, FileCheck } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/hr-operations/")({
  head: () => ({ meta: [{ title: "HR Operations Hub — OFC360" }] }),
  component: HrOperationsHubPage,
});

const HR_OPS_MODULES: ModuleItem[] = [
  {
    id: "hr-ops-dashboard",
    title: "HR Ops Command Center",
    description: "Operational overview of active HR tasks, daily checklists, and SLA metrics.",
    icon: Activity,
    to: "/dashboard/hr-operations/command-center",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "timeline",
    title: "Employee Career Timeline",
    description: "End-to-end milestone tracking across promotions, transfers, and appraisals.",
    icon: History,
    to: "/dashboard/hr-operations/timeline",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
  {
    id: "visitors",
    title: "Visitor Management",
    description: "Digital visitor check-in, host notifications, and security badge passes.",
    icon: UserCheck,
    to: "/dashboard/hr-operations/visitor-management",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "onboarding",
    title: "Onboarding Checklists",
    description: "Structured day-one readiness, IT provisioning, and document verification.",
    icon: ClipboardCheck,
    to: "/dashboard/hr-operations/onboarding",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "offboarding",
    title: "Offboarding Workflows",
    description: "Asset recovery, access revocation, and exit interview coordination.",
    icon: FileCheck,
    to: "/dashboard/hr-operations/offboarding",
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "exit-management",
    title: "Exit & Clearance Management",
    description: "Resignation processing, notice period tracking, and full-and-final clearance.",
    icon: LogOut,
    to: "/dashboard/hr-operations/exit-management",
    color: "from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30",
  },
];

function HrOperationsHubPage() {
  return <ModuleHubView modules={HR_OPS_MODULES} />;
}
