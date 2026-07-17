import React from "react";
import { Building, Activity, Users, UserCheck, ShieldCheck, Landmark } from "lucide-react";
import type { Department } from "../types";
import { Card, CardContent } from "@/components/ui/card";

interface DepartmentStatsCardsProps {
  departments: Department[];
}

export function DepartmentStatsCards({ departments }: DepartmentStatsCardsProps) {
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter((d) => d.status === "active").length;
  const inactiveDepartments = totalDepartments - activeDepartments;
  const totalEmployees = departments.reduce((acc, d) => acc + (Number(d.currentEmployeeCount) || 0), 0);
  const assignedManagers = new Set(
    departments
      .map((d) => d.departmentHeadId || d.departmentHeadName)
      .filter((value): value is string => Boolean(value) && value !== "Unassigned" && value !== "None"),
  ).size;
  const avgTeamSize = totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0;
  const openPositions = departments.reduce((acc, d) => acc + (d.openPositions || 0), 0);
  const hiringDepartments = departments.filter((d) => (d.openPositions || 0) > 0).length;

  const stats = [
    {
      label: "Total Departments",
      value: totalDepartments,
      icon: Building,
      desc: `${activeDepartments} active`,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/20",
    },
    {
      label: "Active Departments",
      value: activeDepartments,
      icon: Activity,
      desc: `${inactiveDepartments} inactive`,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20",
    },
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      desc: totalDepartments > 0 ? "Across departments" : "No departments yet",
      color: "from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/20",
    },
    {
      label: "Total Managers",
      value: assignedManagers,
      icon: UserCheck,
      desc: "Assigned department heads",
      color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20",
    },
    {
      label: "Average Team Size",
      value: avgTeamSize,
      icon: Landmark,
      desc: totalEmployees > 0 ? "Employees per department" : "No employees assigned",
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/20",
    },
    {
      label: "Open Positions",
      value: openPositions,
      icon: ShieldCheck,
      desc: hiringDepartments > 0 ? `Across ${hiringDepartments} departments` : "No open positions",
      color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md hover:bg-card/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" />
            <CardContent className="p-4 flex flex-col justify-between h-full min-h-[120px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground line-clamp-1">{stat.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br border ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <div className="mt-1 truncate text-[10px] font-medium text-muted-foreground">{stat.desc}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}