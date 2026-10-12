import { Clock, CheckCircle2, Moon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShiftStatsProps {
  total: number;
  active: number;
  night: number;
  assigned: number;
  loading: boolean;
}

export function ShiftStats({ total, active, night, assigned, loading }: ShiftStatsProps) {
  const stats = [
    {
      label: "Total Shifts",
      value: loading ? "..." : total,
      sublabel: "Configured shift profiles",
      icon: Clock,
      color: "text-indigo-400",
    },
    {
      label: "Active Shifts",
      value: loading ? "..." : active,
      sublabel: "Currently in rotation",
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      label: "Night Shifts",
      value: loading ? "..." : night,
      sublabel: "With night differential",
      icon: Moon,
      color: "text-purple-400",
    },
    {
      label: "Allocations",
      value: loading ? "..." : assigned,
      sublabel: "Employees mapped",
      icon: Users,
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-left">
      {stats.map((stat, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</span>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{stat.value}</div>
          <span className="text-[11px] text-muted-foreground">{stat.sublabel}</span>
        </div>
      ))}
    </div>
  );
}