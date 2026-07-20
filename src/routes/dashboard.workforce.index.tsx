import { createFileRoute } from "@tanstack/react-router";
import { Users, Building2, Clock, Timer, Palmtree, Users2 } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/workforce/")({
  head: () => ({ meta: [{ title: "Workforce Hub — Aurix" }] }),
  component: WorkforceHubPage,
});

const WORKFORCE_MODULES: ModuleItem[] = [
  {
    id: "people",
    title: "People Directory",
    description: "Manage workforce profiles, department assignments, designations, and employee directory.",
    icon: Users,
    to: "/dashboard/workforce/people",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "departments",
    title: "Departments",
    description: "Structure company departments, assign department heads, and monitor team headcount.",
    icon: Building2,
    to: "/dashboard/workforce/departments",
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "attendance",
    title: "Attendance & Shifts",
    description: "Real-time shift schedules, check-in logs, rosters, and attendance exception monitoring.",
    icon: Clock,
    to: "/dashboard/workforce/attendance",
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "timesheets",
    title: "Timesheets",
    description: "Track project work hours, weekly time entries, billable activities, and approvals.",
    icon: Timer,
    to: "/dashboard/workforce/timesheets",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "leaves",
    title: "Leaves & Time-Off",
    description: "Manage leave balances, request approvals, policy limits, and holiday calendars.",
    icon: Palmtree,
    to: "/dashboard/workforce/leaves",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30",
  },
];

function WorkforceHubPage() {
  return (
    <ModuleHubView
      eyebrow="Workforce Module Workspace"
      title="Workforce Management"
      description="Centralized portal for managing your company workforce, departments, daily shift attendance, timesheets, and leave balances."
      headerIcon={Users2}
      modules={WORKFORCE_MODULES}
    />
  );
}
