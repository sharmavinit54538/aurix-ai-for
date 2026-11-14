import { createFileRoute } from "@tanstack/react-router";
import { Users, Building2, CalendarCheck, CalendarDays, Timer, Network } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/workforce/")({
  head: () => ({ meta: [{ title: "Workforce Hub — OFC360" }] }),
  component: WorkforceHubPage,
});

const WORKFORCE_MODULES: ModuleItem[] = [
  {
    id: "people",
    title: "Employees Directory",
    description: "Manage employee profiles, roles, reporting lines, and lifecycle status.",
    icon: Users,
    to: "/dashboard/employees",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "departments",
    title: "Departments & Cost Centers",
    description: "Configure organizational units, department heads, and headcount budgets.",
    icon: Building2,
    to: "/dashboard/departments",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
  {
    id: "hierarchy",
    title: "Organization Hierarchy",
    description: "Interactive visual org chart and reporting structure explorer.",
    icon: Network,
    to: "/dashboard/hierarchy",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "attendance",
    title: "Attendance & Shifts",
    description: "Real-time clock-in logs, shift scheduling, rosters, and holiday calendars.",
    icon: CalendarCheck,
    to: "/dashboard/attendance",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "leaves",
    title: "Leave Management",
    description: "Leave balances, approval workflows, and team availability tracking.",
    icon: CalendarDays,
    to: "/dashboard/leaves",
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "timesheets",
    title: "Project Timesheets",
    description: "Billable hours tracking, project utilization, and manager approvals.",
    icon: Timer,
    to: "/dashboard/timesheets",
    color: "from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30",
  },
];

function WorkforceHubPage() {
  return <ModuleHubView modules={WORKFORCE_MODULES} />;
}
