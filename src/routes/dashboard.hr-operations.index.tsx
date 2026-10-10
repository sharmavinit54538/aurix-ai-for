import { createFileRoute } from "@tanstack/react-router";
import { Activity, History, ClipboardCheck, LogOut, FileCheck, Users, Server } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";
import { Badge } from "@/components/ui/badge";

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
    title: "Employee Timeline",
    description: "Track career history, promotions, department transfers, and milestone timelines.",
    icon: History,
    to: "/dashboard/hr-operations/timeline",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
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

// Visitor Management is not yet available - backend endpoint pending
const UNAVAILABLE_MODULES: ModuleItem[] = [
  {
    id: "visitor-management",
    title: "Visitor Management",
    description: "Visitor kiosk registration, host notifications, visitor passes, and security logs. (Not available yet)",
    icon: Users,
    to: "/dashboard/hr-operations/visitor-management",
    color: "from-slate-500/20 to-gray-500/20 text-slate-400 border-slate-500/30",
    badge: "Coming Soon",
  },
];

function HrOperationsHubPage() {
  return (
    <div className="space-y-6">
      <ModuleHubView modules={HR_OPS_MODULES} />
      <div className="border-t border-border pt-6">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Coming Soon</h3>
        <ModuleHubView modules={UNAVAILABLE_MODULES} />
      </div>
    </div>
  );
}

