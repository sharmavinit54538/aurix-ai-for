import React from "react";
import { Users, UserCheck, FolderKanban, UsersRound, Scale, Plane } from "lucide-react";
import type { Manager } from "../types";
import { Card, CardContent } from "@/components/ui/card";

interface ManagerStatsCardsProps {
  managers: Manager[];
}

export function ManagerStatsCards({ managers }: ManagerStatsCardsProps) {
  const totalManagers = managers.length;
  const activeManagers = managers.filter((m) => m.status === "active").length;
  
  // Unique departments
  const departments = new Set(managers.map((m) => m.department));
  const departmentsCount = departments.size;

  // Sum of teamSize
  const totalReporting = managers.reduce((acc, m) => acc + (m.teamSize || 0), 0);

  // Average team size
  const avgTeamSize = totalManagers > 0 ? Math.round(totalReporting / totalManagers) : 0;

  // Managers on leave
  const managersOnLeave = managers.filter((m) => m.status === "on_leave").length;

  const stats = [
    {
      label: "Total Managers",
      value: totalManagers,
      icon: Users,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/20",
    },
    {
      label: "Active Managers",
      value: activeManagers,
      icon: UserCheck,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20",
    },
    {
      label: "Departments",
      value: departmentsCount,
      icon: FolderKanban,
      color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20",
    },
    {
      label: "Employees Reporting",
      value: totalReporting,
      icon: UsersRound,
      color: "from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/20",
    },
    {
      label: "Avg. Team Size",
      value: avgTeamSize,
      icon: Scale,
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/20",
    },
    {
      label: "Managers On Leave",
      value: managersOnLeave,
      icon: Plane,
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
            <CardContent className="p-4 flex flex-col justify-between h-full min-h-[110px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground line-clamp-1">{stat.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br border ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
